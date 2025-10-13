import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import Login from './index'

describe('Login form validation', () => {
  it('shows validation errors when fields are empty', async () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    )

    const user = userEvent.setup()
    const button = screen.getByRole('button', { name: /login/i })
    await user.click(button)

    expect(await screen.findByText(/Username must be at least 3 characters/i)).toBeTruthy()
    expect(await screen.findByText(/Password must be at least 6 characters/i)).toBeTruthy()
  })
})
