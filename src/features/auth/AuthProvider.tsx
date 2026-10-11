import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { onSessionExpired, refreshSession, setTokens } from '@/lib/api'
import { queryClient } from '@/lib/queryClient'
import type { AuthResult, User } from '@/types/api'
import * as authApi from './api'
import { AuthContext, type AuthStatus } from './auth-context'
import type { LoginValues, RegisterInput } from './schemas'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [status, setStatus] = useState<AuthStatus>('loading')

  const startSession = useCallback(({ user, ...tokens }: AuthResult) => {
    setTokens(tokens)
    setUser(user)
    setStatus('authenticated')
  }, [])

  const endSession = useCallback(() => {
    setTokens(null)
    setUser(null)
    setStatus('guest')
    queryClient.clear()
  }, [])

  // Restore the session from the refresh cookie on first load.
  useEffect(() => {
    refreshSession().then((session) => (session ? startSession(session) : endSession()))
  }, [startSession, endSession])

  useEffect(() => {
    onSessionExpired(endSession)
    return () => onSessionExpired(null)
  }, [endSession])

  const value = useMemo(
    () => ({
      user,
      status,
      isAdmin: user?.role === 'admin',
      setUser,
      login: async (values: LoginValues) => startSession(await authApi.login(values)),
      register: async (values: RegisterInput) => startSession(await authApi.register(values)),
      logout: async () => {
        try {
          await authApi.logout()
        } finally {
          endSession()
        }
      },
    }),
    [user, status, startSession, endSession],
  )

  return <AuthContext value={value}>{children}</AuthContext>
}
