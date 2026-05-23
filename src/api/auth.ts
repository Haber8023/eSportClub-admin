import api from './axios'

export const login = (data: { username: string; password: string }) =>
  api.post('/auth/login', data)

export const getMe = () => api.get('/auth/me')
