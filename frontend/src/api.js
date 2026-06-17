import axios from 'axios'

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000' })

export const predict = (data) => api.post('/predict', data)
export const getPredictions = () => api.get('/predictions')
export const getAnalytics = () => api.get('/analytics')
export const getHealth = () => api.get('/health')
