import api from './axios'

export const getCompanionList = (params?: any) => api.get('/admin/companions', { params })
export const getCompanionById = (id: number) => api.get(`/admin/companions/${id}`)
export const createCompanion = (data: any) => api.post('/admin/companions/register', data)
export const updateCompanion = (id: number, data: any) => api.put(\`/admin/companions/\${id}\`, data)
export const changeCompanionStatus = (id: number, status: string) =>
  api.put(\`/admin/companions/\${id}/status\`, { status })
export const approveCompanion = (id: number) => api.put(\`/admin/companions/\${id}/approve\`)
export const rejectCompanion = (id: number, reason: string) =>
  api.put(\`/admin/companions/\${id}/reject\`, { reason })
