import { api, unwrap } from '@/lib/api'
import { getRefreshToken } from '@/lib/tokenStorage'
import type { AuthResult, AuthTokens } from '@/types/api'
import type { ChangePasswordValues, LoginValues, RegisterInput } from './schemas'

export const login = (body: LoginValues) => unwrap<AuthResult>(api.post('/auth/login', body))

export const register = (body: RegisterInput) =>
  unwrap<AuthResult>(api.post('/auth/register', body))

export const logout = () =>
  api.post('/auth/logout', { refreshToken: getRefreshToken() ?? undefined })

export const changePassword = (body: Omit<ChangePasswordValues, 'confirmPassword'>) =>
  unwrap<AuthTokens>(api.patch('/auth/password', body))
