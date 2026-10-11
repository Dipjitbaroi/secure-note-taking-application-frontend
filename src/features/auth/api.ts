import { api, unwrap } from '@/lib/api'
import type { AuthResult } from '@/types/api'
import type { ChangePasswordValues, LoginValues, RegisterInput } from './schemas'

export const login = (body: LoginValues) => unwrap<AuthResult>(api.post('/auth/login', body))

export const register = (body: RegisterInput) =>
  unwrap<AuthResult>(api.post('/auth/register', body))

export const logout = () => api.post('/auth/logout')

export const changePassword = (body: Omit<ChangePasswordValues, 'confirmPassword'>) =>
  unwrap<{ accessToken: string }>(api.patch('/auth/password', body))
