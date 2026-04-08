export const CLIENT_PROFILE_UPDATED_EVENT = 'client-profile-updated'
export const CLIENT_REDIRECT_STORAGE_KEY = 'client_redirect_after_login'

export function saveClientSession(token, user = {}) {
  if (!token) return

  localStorage.setItem('client_token', token)
  localStorage.setItem('client_id', user.id || '')
  localStorage.setItem('client_ten', user.ten || user.name || '')
  localStorage.setItem('client_avatar', user.anh_dai_dien || user.avatar || '')

  window.dispatchEvent(new CustomEvent(CLIENT_PROFILE_UPDATED_EVENT))
}

export function clearClientSession() {
  localStorage.removeItem('client_token')
  localStorage.removeItem('client_id')
  localStorage.removeItem('client_ten')
  localStorage.removeItem('client_avatar')
  localStorage.removeItem(CLIENT_REDIRECT_STORAGE_KEY)

  window.dispatchEvent(new CustomEvent(CLIENT_PROFILE_UPDATED_EVENT))
}

export function saveClientRedirectPath(path) {
  if (!path) return
  localStorage.setItem(CLIENT_REDIRECT_STORAGE_KEY, path)
}

export function getClientRedirectPath() {
  return localStorage.getItem(CLIENT_REDIRECT_STORAGE_KEY) || '/'
}

export function clearClientRedirectPath() {
  localStorage.removeItem(CLIENT_REDIRECT_STORAGE_KEY)
}
