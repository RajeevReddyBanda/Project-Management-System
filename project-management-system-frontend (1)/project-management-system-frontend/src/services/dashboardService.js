import api from './api'

const dashboardService = {
  getStats:       () => api.get('/dashboard'),
  getStatsByUser: (userId) => api.get(`/dashboard/user/${userId}`),
}

export default dashboardService
