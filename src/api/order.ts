import api from './axios'

export const getOrderList = (params?: any) => api.get('/admin/orders', { params })
export const getOrderById = (id: number) => api.get(\`/admin/orders/\${id}\`)
export const createOrder = (data: any) => api.post('/admin/orders', data)
export const updateOrder = (id: number, data: any) => api.put(\`/admin/orders/\${id}\`, data)
export const confirmOrder = (id: number) => api.put(\`/admin/orders/\${id}/confirm\`)
export const rejectOrder = (id: number, reason: string) =>
  api.put(\`/admin/orders/\${id}/reject\`, { reason })
export const settleOrder = (id: number) => api.put(\`/admin/orders/\${id}/settle\`)
