import { api } from '../../shared/services/api'

export const userService = {
  async create(userData) {
    const response = await api.post('/users/', userData)
    return response.data
  },

  async getAll() {
    const response = await api.get('/users')
    return response.data
  },

  async update(userId, userData) {
    const response = await api.put(`/users/${userId}`, userData)
    return response.data
  },

  async softDelete(userId) {
    const response = await api.patch(`/users/${userId}`)
    return response.data
  },

  async exportToCsv() {
    const response = await api.get('/users/export-users')
    return response.data
  },
}
