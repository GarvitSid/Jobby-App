import {Navigate, Outlet} from 'react-router-dom'
import {useQuery} from '@tanstack/react-query'
import API_BASE_URL from '../../api/config'
import Loader from '../common/Loader'

const ProtectedRoute = () => {
  const {isLoading, isError} = useQuery({
    queryKey: ['auth-check'],
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}/profile`, {
        credentials: 'include',
      })

      if (!response.ok) {
        throw new Error('Unauthorized')
      }

      return response.json()
    },
    retry: false,
    staleTime: 30 * 1000,
  })

  if (isLoading) {
    return <Loader text="Checking session..." />
  }

  if (isError) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}

export default ProtectedRoute