import { createContext, useContext } from 'react'
import type { User } from '@/types/api'
import type { LoginValues, RegisterInput } from './schemas'

export type AuthStatus = 'loading' | 'authenticated' | 'guest'

export interface AuthContextValue {
  user: User | null
  status: AuthStatus
  isAdmin: boolean
  login: (values: LoginValues) => Promise<void>
  register: (values: RegisterInput) => Promise<void>
  logout: () => Promise<void>
  setUser: (user: User) => void
}

export const AuthContext = createContext<AuthContextValue | null>(null)

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}
