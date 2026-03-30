import api from './api'

const projectService = {
  getAll:   (params) => api.get('/projects', { params }),
  getById:  (id)     => api.get(`/projects/${id}`),
  create:   (data)   => api.post('/projects', data),
  update:   (id, data) => api.put(`/projects/${id}`, data),
  delete:   (id)     => api.delete(`/projects/${id}`),
  getTasks: (id)     => api.get(`/projects/${id}/tasks`),
  search:   (q)      => api.get('/projects', { params: { search: q } }),
}

export default projectService
