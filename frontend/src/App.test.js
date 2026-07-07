import {screen} from '@testing-library/react'
import {afterEach, test, expect, vi} from 'vitest'
import App from './App.js';
import { renderWithProviders } from './test-utils';

afterEach(() => {
  vi.restoreAllMocks()
})

test('renders home page for authenticated users', async () => {
  vi.spyOn(global, 'fetch').mockResolvedValueOnce({
    ok: true,
    json: async () => ({profile_details: {name: 'Test User'}}),
  })

  renderWithProviders(<App />, {route: '/', path: '*'})

  const heading = await screen.findByText(/Find The Job That Fits Your Life/i)
  expect(heading).toBeInTheDocument()
})
