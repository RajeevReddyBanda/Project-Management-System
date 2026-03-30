import api from './api'

const taskService = {
  getAll:        (params) => api.get('/tasks', { params }),
  getById:       (id)     => api.get(`/tasks/${id}`),
  create:        (data)   => api.post('/tasks', data),
  update:        (id, data) => api.put(`/tasks/${id}`, data),
  delete:        (id)     => api.delete(`/tasks/${id}`),
  updateStatus:  (id, status) => api.patch(`/tasks/${id}/status`, null, { params: { status } }),
  getOverdue:    () => api.get('/tasks', { params: { overdue: true } }),
}

export default taskService
