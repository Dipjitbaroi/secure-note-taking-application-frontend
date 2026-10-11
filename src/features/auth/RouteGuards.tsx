import { Navigate, Outlet, useLocation } from 'react-router'
import { FullPageLoader } from '@/components/common/FullPageLoader'
import { useAuth } from './auth-context'

export function RequireAuth() {
  const { status } = useAuth()
  const location = useLocation()

  if (status === 'loading') return <FullPageLoader />
  if (status === 'guest') return <Navigate to="/login" replace state={{ from: location }} />
  return <Outlet />
}

export function RequireAdmin() {
  const { isAdmin } = useAuth()
  return isAdmin ? <Outlet /> : <Navigate to="/notes" replace />
}

export function GuestOnly() {
  const { status } = useAuth()

  if (status === 'loading') return <FullPageLoader />
  if (status === 'authenticated') return <Navigate to="/notes" replace />
  return <Outlet />
}
