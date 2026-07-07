import React from 'react'
import {screen, waitFor} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {vi} from 'vitest'
import JobItemDetails from './index'
import {renderWithProviders} from '../../test-utils'

describe('JobItemDetails component', () => {
  beforeEach(() => vi.restoreAllMocks())

  test('renders job details from API', async () => {
    const fakeResponse = {
      job_details: {
        _id: '1',
        title: 'Detail Job',
        company_logo_url: '',
        company_website_url: '',
        employment_type: 'FULLTIME',
        job_description: 'desc',
        location: 'Remote',
        package_per_annum: 100000,
        rating: 4,
        life_at_company: { description: 'life', image_url: '' },
        skills: [],
        is_saved: false,
        is_applied: false,
      },
      similar_jobs: []
    }

    vi.spyOn(global, 'fetch').mockImplementation(url => {
      if (url.includes('/jobs/1')) {
        return Promise.resolve({ok: true, json: () => Promise.resolve(fakeResponse)})
      }
      return Promise.resolve({ok: false})
    })

    renderWithProviders(<JobItemDetails />, {route: '/jobs/1', path: '/jobs/:id'})

    await waitFor(() => expect(screen.getByText(/Detail Job/i)).toBeInTheDocument())
  })

  test('toggles save and apply actions with DELETE when already saved/applied', async () => {
    const fakeResponse = {
      job_details: {
        _id: '1',
        title: 'Detail Job',
        company_logo_url: 'https://example.com/logo.png',
        company_website_url: 'https://example.com',
        employment_type: 'FULLTIME',
        job_description: 'desc',
        location: 'Remote',
        package_per_annum: 100000,
        rating: 4,
        life_at_company: {description: 'life', image_url: 'https://example.com/life.png'},
        skills: [{name: 'React', image_url: 'https://example.com/react.png'}],
        is_saved: true,
        is_applied: true,
      },
      similar_jobs: [],
    }

    const fetchMock = vi.spyOn(global, 'fetch').mockImplementation(url => {
      if (url.includes('/jobs/1') && !url.includes('/save') && !url.includes('/apply')) {
        return Promise.resolve({ok: true, json: () => Promise.resolve(fakeResponse)})
      }

      if (url.includes('/jobs/1/save') || url.includes('/jobs/1/apply')) {
        return Promise.resolve({ok: true, json: () => Promise.resolve({message: 'Updated'})})
      }

      return Promise.resolve({ok: false, json: () => Promise.resolve({error_msg: 'Unexpected call'})})
    })

    const user = userEvent.setup()

    renderWithProviders(<JobItemDetails />, {route: '/jobs/1', path: '/jobs/:id'})

    expect(await screen.findByRole('button', {name: /unsave job/i})).toBeInTheDocument()
    expect(screen.getByRole('button', {name: /withdraw application/i})).toBeInTheDocument()

    await user.click(screen.getByRole('button', {name: /unsave job/i}))

    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('/jobs/1/save'),
      expect.objectContaining({method: 'DELETE'}),
    )
  })

  test('optimistically updates save button before the server responds', async () => {
    const fakeResponse = {
      job_details: {
        _id: '1',
        title: 'Detail Job',
        company_logo_url: 'https://example.com/logo.png',
        company_website_url: 'https://example.com',
        employment_type: 'FULLTIME',
        job_description: 'desc',
        location: 'Remote',
        package_per_annum: 100000,
        rating: 4,
        life_at_company: {description: 'life', image_url: 'https://example.com/life.png'},
        skills: [{name: 'React', image_url: 'https://example.com/react.png'}],
        is_saved: false,
        is_applied: false,
      },
      similar_jobs: [],
    }

    let resolveRequest
    const requestFinished = new Promise(resolve => {
      resolveRequest = resolve
    })

    vi.spyOn(global, 'fetch').mockImplementation(url => {
      if (url.includes('/jobs/1') && !url.includes('/save') && !url.includes('/apply')) {
        return Promise.resolve({ok: true, json: () => Promise.resolve(fakeResponse)})
      }

      if (url.includes('/jobs/1/save')) {
        return Promise.resolve({
          ok: true,
          json: () => requestFinished.then(() => ({message: 'Job saved successfully'})),
        })
      }

      return Promise.resolve({ok: false, json: () => Promise.resolve({error_msg: 'Unexpected call'})})
    })

    const user = userEvent.setup()

    renderWithProviders(<JobItemDetails />, {route: '/jobs/1', path: '/jobs/:id'})

    const saveButton = await screen.findByRole('button', {name: /save job/i})
    await user.click(saveButton)

    expect(screen.getByRole('button', {name: /unsave job/i})).toBeInTheDocument()

    resolveRequest()

    expect(await screen.findByText(/Job saved successfully/i)).toBeInTheDocument()
  })
})
