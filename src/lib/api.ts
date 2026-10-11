import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios'
import type { AuthResult } from '@/types/api'
import { getRefreshToken, setRefreshToken } from './tokenStorage'

const baseURL = import.meta.env.VITE_API_URL ?? '/api/v1'

export const api = axios.create({ baseURL, withCredentials: true })

// The access token only lives in memory. On a page reload it's restored via
// /auth/refresh, using the stored refresh token (or the httpOnly cookie when
// the API is on the same site).
let accessToken: string | null = null
let refreshRequest: Promise<AuthResult | null> | null = null
let sessionExpiredHandler: (() => void) | null = null

export function setTokens(tokens: { accessToken: string; refreshToken: string } | null) {
  accessToken = tokens?.accessToken ?? null
  setRefreshToken(tokens?.refreshToken ?? null)
}

export function onSessionExpired(handler: (() => void) | null) {
  sessionExpiredHandler = handler
}

// Several requests can hit a 401 at the same time; they all share one refresh call.
export function refreshSession() {
  refreshRequest ??= axios
    .post<{ data: AuthResult }>(
      `${baseURL}/auth/refresh`,
      { refreshToken: getRefreshToken() ?? undefined },
      { withCredentials: true },
    )
    .then((res) => {
      setTokens(res.data.data)
      return res.data.data
    })
    .catch(() => {
      setTokens(null)
      return null
    })
    .finally(() => {
      refreshRequest = null
    })

  return refreshRequest
}

api.interceptors.request.use((config) => {
  if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`
  return config
})

const AUTH_ROUTES = ['/auth/login', '/auth/register', '/auth/refresh']

api.interceptors.response.use(undefined, async (error: AxiosError) => {
  const config = error.config as (InternalAxiosRequestConfig & { _retried?: boolean }) | undefined

  const canRetry =
    error.response?.status === 401 &&
    config &&
    !config._retried &&
    !AUTH_ROUTES.some((route) => config.url?.includes(route))

  if (!canRetry) throw error

  config._retried = true
  const session = await refreshSession()
  if (!session) {
    sessionExpiredHandler?.()
    throw error
  }

  config.headers.Authorization = `Bearer ${session.accessToken}`
  return api(config)
})

// Every API response is wrapped as { success, data }.
export async function unwrap<T>(request: Promise<{ data: { data: T } }>) {
  const res = await request
  return res.data.data
}

export function getErrorMessage(error: unknown, fallback = 'Something went wrong') {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { message?: string; details?: Record<string, string[]> }
    const firstDetail = data?.details && Object.values(data.details).flat()[0]
    return firstDetail ?? data?.message ?? error.message ?? fallback
  }
  return error instanceof Error ? error.message : fallback
}
