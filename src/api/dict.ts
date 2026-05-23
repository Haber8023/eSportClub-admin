import api from './axios'

export const getGameCategories = () => api.get('/admin/dict/game-category')
export const getGameItems = (params?: any) => api.get('/admin/dict/game-item', { params })
export const getDiscounts = () => api.get('/admin/dict/discount')
export const getCommissionRates = () => api.get('/admin/dict/commission-rate')
export const getDeposits = () => api.get('/admin/dict/deposit')
export const getExtraFees = () => api.get('/admin/dict/extra-fee')
