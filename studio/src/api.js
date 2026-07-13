const BASE = import.meta.env.VITE_API_URL ?? '/api'

function getToken() {
  return sessionStorage.getItem('helios_studio_token')
}

export function clearToken() {
  sessionStorage.removeItem('helios_studio_token')
}

export function setToken(token) {
  sessionStorage.setItem('helios_studio_token', token)
}

export function isAuthenticated() {
  return !!getToken()
}

async function request(path, options = {}) {
  const token = getToken()
  const headers = { ...options.headers }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }
  if (options.body && typeof options.body === 'object' && !(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json'
  }

  const res = await fetch(`${BASE}/helios/papers${path}`, {
    ...options,
    headers,
  })

  if (res.status === 401) {
    clearToken()
    window.location.href = '/login'
    throw new Error('Unauthorized')
  }

  const data = await res.json()
  if (!res.ok) {
    throw new Error(data.error ?? 'Request failed')
  }
  return data
}

export function listPapers() {
  return request('')
}

export function getPaper(slug) {
  return request(`/${slug}`)
}

export function createPaper(input) {
  return request('', {
    method: 'POST',
    body: JSON.stringify(input),
  })
}

export function updatePaper(slug, input) {
  return request(`/${slug}`, {
    method: 'PUT',
    body: JSON.stringify(input),
  })
}

export function deletePaper(slug) {
  return request(`/${slug}`, {
    method: 'DELETE',
  })
}
