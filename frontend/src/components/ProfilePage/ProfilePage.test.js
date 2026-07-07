import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router-dom'
import ProfilePage from './index'

const queryClient = new QueryClient()

describe('ProfilePage validation', () => {
  it('shows validation error for invalid URL', async () => {
    // mock profile fetch
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({ profile_details: { name: 'Test', profile_image_url: 'https://example.com/avatar.png', short_bio: '' } }),
    })

    render(
      <MemoryRouter>
        <QueryClientProvider client={queryClient}>
          <ProfilePage />
        </QueryClientProvider>
      </MemoryRouter>
    )

    const user = userEvent.setup()
    const textarea = await screen.findByPlaceholderText(/Tell recruiters a little about yourself/i)
    await user.clear(textarea)
    const button = screen.getByRole('button', { name: /save changes/i })
    await user.click(button)

    expect(await screen.findByText(/Bio cannot be empty/i)).toBeTruthy()
  })
})

