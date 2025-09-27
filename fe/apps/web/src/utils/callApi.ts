interface RequestOptions extends RequestInit {
  url: string
  data?: any
  headers?: HeadersInit
  requireAuth?: boolean
}

export const request = async <T>(
  options: RequestOptions
): Promise<{ data: T; status: number }> => {
  const headers = new Headers({
    'Content-Type': 'application/json',
    ...options.headers // Merge custom headers if provided
  })

  if (options.requireAuth) {
    const token = await getAccessToken()
    if (token) {
      headers.append('Authorization', 'Bearer ' + token)
    }
  }

  const finalOptions: RequestInit = {
    ...options,
    headers: headers,
    body:
      options.data instanceof FormData
        ? options.data
        : options.data
          ? JSON.stringify(options.data)
          : undefined
  }

  const response = await fetch(options.url, finalOptions)

  let data: T | null = null
  try {
    data = await response.json()
  } catch (error) {
    if (
      response.status !== 204 &&
      response.status !== 200 &&
      response.status !== 201
    ) {
      throw { error: 'Invalid JSON response', status: response.status }
    }
  }

  if (response.status === 401) {
    await refreshToken()
    return request(options)
  }

  if (!response.ok) {
    throw { data, status: response.status }
  }

  return { data: data as T, status: response.status }
}

const getAccessToken = async () => {
  const response = await fetch('/api/auth/token', {
    method: 'GET',
    credentials: 'include'
  })

  const { accessToken } = await response.json()

  return accessToken
}

const refreshToken = async () => {
  const response = await fetch('/api/auth/refresh-token', {
    method: 'POST',
    credentials: 'include'
  })

  try {
    const { accessToken } = await response.json()

    return accessToken
  } catch {
    const queryString = window.location.search
    const urlParams = new URLSearchParams(queryString)
    const callbackUrl = urlParams.get('callbackUrl')
    window.location.href =
      '/login' + (callbackUrl ? `?callbackUrl=${callbackUrl}` : '')
  }
}
