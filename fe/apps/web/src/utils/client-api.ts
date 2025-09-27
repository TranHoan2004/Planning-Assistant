// Only using this api client in client side

import axios from 'axios'

export const clientApi = axios.create({
  adapter: 'fetch',
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true
})

clientApi.interceptors.request.use(
  async (request) => {
    const response = await fetch('/api/auth/token')
    const { accessToken } = await response.json()

    if (accessToken) {
      request.headers.set('Authorization', `Bearer ${accessToken}`)
    }
    return request
  },
  (error) => Promise.reject(error)
)

clientApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const response = await fetch('/api/auth/refresh-token', {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          }
        })

        const { accessToken } = await response.json()

        originalRequest.headers.set('Authorization', `Bearer ${accessToken}`)
        return clientApi.request(originalRequest)
      } catch (error) {
        return Promise.reject(error)
      }
    }
    return Promise.reject(error)
  }
)
