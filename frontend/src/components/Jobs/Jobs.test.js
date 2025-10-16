import React from 'react'
import {screen, waitFor} from '@testing-library/react'
import {vi} from 'vitest'
import Jobs from './index'
import {renderWithProviders} from '../../test-utils'

describe('Jobs component', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  test('renders jobs list from API', async () => {
    const fakeProfile = { profile_details: { name: 'Alice', profile_image_url: '', short_bio: 'Dev' } }
    const fakeJobs = { jobs: [ { _id: '1', title: 'Test Job', company_logo_url: '', employment_type: 'FULLTIME', job_description: 'x', location: 'Remote', package_per_annum: 100000, rating: 4 } ], total: 1, page: 1, total_pages:1 }

    vi.spyOn(global, 'fetch').mockImplementation(url => {
      if (url.endsWith('/profile')) {
        return Promise.resolve({ok: true, json: () => Promise.resolve(fakeProfile)})
      }
      if (url.includes('/jobs')) {
        return Promise.resolve({ok: true, json: () => Promise.resolve(fakeJobs)})
      }
      return Promise.resolve({ok: false})
    })

    renderWithProviders(<Jobs />)

    await waitFor(() => expect(screen.getByText(/Test Job/i)).toBeInTheDocument())
  })
})
