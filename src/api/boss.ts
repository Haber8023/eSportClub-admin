import api from './axios'

export const getBossList = (params?: any) => api.get('/admin/bosses', { params })
export const getBossById = (id: number) => api.get(\`/admin/bosses/\${id}\`)
export const updateBoss = (id: number, data: any) => api.put(\`/admin/bosses/\${id}\`, data)
export const getBossAccounts = (params?: any) => api.get('/admin/boss-accounts', { params })
export const getAccountById = (id: number) => api.get(\`/admin/boss-accounts/\${id}\`)
