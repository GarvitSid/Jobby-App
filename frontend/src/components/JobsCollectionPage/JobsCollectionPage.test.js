import React from 'react'
import {screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {vi, describe, it, expect, beforeEach} from 'vitest'
import SavedJobs from '../SavedJobs'
import AppliedJobs from '../AppliedJobs'
import {renderWithProviders} from '../../test-utils'

const createDeferred = () => {
  let resolve
  const promise = new Promise(res => {
    resolve = res
  })
  return {promise, resolve}
}

describe('JobsCollectionPage removal flow', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('removes a saved job optimistically', async () => {
    const deferred = createDeferred()

    vi.spyOn(global, 'fetch').mockImplementation(url => {
      if (url.includes('/saved-jobs?page=1&limit=2')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({
            jobs: [
              {
                _id: '1',
                title: 'Saved Job',
                company_logo_url: 'https://example.com/logo.png',
                employment_type: 'FULLTIME',
                job_description: 'desc',
                location: 'Remote',
                package_per_annum: 100000,
                rating: 4,
              },
            ],
            total: 1,
            page: 1,
            total_pages: 1,
          }),
        })
      }

      if (url.includes('/jobs/1/save')) {
        return Promise.resolve({
          ok: true,
          json: () => deferred.promise.then(() => ({message: 'Job removed from saved list'})),
        })
      }

      return Promise.resolve({ok: false, json: () => Promise.resolve({error_msg: 'Unexpected call'})})
    })

    const user = userEvent.setup()
    renderWithProviders(<SavedJobs />)

    expect(await screen.findByText('Saved Job', {exact: true})).toBeInTheDocument()

    await user.click(screen.getByRole('button', {name: /remove/i}))

    expect(screen.queryByText('Saved Job', {exact: true})).not.toBeInTheDocument()
    expect(screen.getByText(/No Saved Jobs/i)).toBeInTheDocument()

    deferred.resolve()
  })

  it('removes an applied job optimistically', async () => {
    const deferred = createDeferred()

    vi.spyOn(global, 'fetch').mockImplementation(url => {
      if (url.includes('/applied-jobs?page=1&limit=2')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({
            jobs: [
              {
                _id: '2',
                title: 'Applied Job',
                company_logo_url: 'https://example.com/logo2.png',
                employment_type: 'FULLTIME',
                job_description: 'desc',
                location: 'Remote',
                package_per_annum: 100000,
                rating: 4,
              },
            ],
            total: 1,
            page: 1,
            total_pages: 1,
          }),
        })
      }

      if (url.includes('/jobs/2/apply')) {
        return Promise.resolve({
          ok: true,
          json: () => deferred.promise.then(() => ({message: 'Application withdrawn successfully'})),
        })
      }

      return Promise.resolve({ok: false, json: () => Promise.resolve({error_msg: 'Unexpected call'})})
    })

    const user = userEvent.setup()
    renderWithProviders(<AppliedJobs />)

    expect(await screen.findByText('Applied Job', {exact: true})).toBeInTheDocument()

    await user.click(screen.getByRole('button', {name: /remove/i}))

    expect(screen.queryByText('Applied Job', {exact: true})).not.toBeInTheDocument()
    expect(screen.getByText(/No Applied Jobs/i)).toBeInTheDocument()

    deferred.resolve()
  })
})