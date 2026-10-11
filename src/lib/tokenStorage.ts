// The refresh token is kept in localStorage so the session survives a reload
// even when the API is on another domain and its cookie can't be sent.
// The short-lived access token stays in memory only (see api.ts).
const KEY = 'secure-notes.refreshToken'

export function getRefreshToken() {
  try {
    return localStorage.getItem(KEY)
  } catch {
    return null
  }
}

export function setRefreshToken(token: string | null) {
  try {
    if (token) localStorage.setItem(KEY, token)
    else localStorage.removeItem(KEY)
  } catch {
    // storage unavailable (private mode etc.) — the cookie still works where it can
  }
}
