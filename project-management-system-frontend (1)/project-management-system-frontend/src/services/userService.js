import api from './api'

const userService = {
  getAll:     () => api.get('/users'),
  getById:    (id) => api.get(`/users/${id}`),
  getMe:      () => api.get('/users/me'),
  updateRole: (id, role) => api.put(`/users/${id}/role`, null, { params: { role } }),
  delete:     (id) => api.delete(`/users/${id}`),
}

export default userService
