import api from './axios'

export const getRechargeList = (params?: any) => api.get('/admin/recharges', { params })
export const createRecharge = (data: any) => api.post('/admin/recharges', data)
export const confirmRecharge = (id: number) => api.put(\`/admin/recharges/\${id}/confirm\`)
