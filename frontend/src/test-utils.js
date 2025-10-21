import React from 'react'
import {render} from '@testing-library/react'
import {QueryClient, QueryClientProvider} from '@tanstack/react-query'
import {MemoryRouter, Route, Routes} from 'react-router-dom'

export function renderWithProviders(
  ui,
  {queryClient, route = '/', path = '*', ...options} = {}
) {
  const qc =
    queryClient ||
    new QueryClient({
      defaultOptions: {
        queries: {retry: false},
      },
    })

  function Wrapper({children}) {
    return (
      <QueryClientProvider client={qc}>
        <MemoryRouter initialEntries={[route]}>
          <Routes>
            <Route path={path} element={children} />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>
    )
  }

  return render(ui, {wrapper: Wrapper, ...options})
}

export {QueryClient}
