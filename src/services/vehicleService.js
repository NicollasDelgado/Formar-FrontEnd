import { api } from './api'

export const vehicleService = {
  async create(userId, vehicleData) {
    const response = await api.post(`/admin/veiculos/${userId}`, vehicleData)
    return response.data
  },

  async getAll() {
    const response = await api.get('/admin/veiculos')
    return response.data
  },

  async update(userId, vehicleData) {
    const response = await api.put(`/admin/veiculos/${userId}`, vehicleData)
    return response.data
  },

  async delete(userId) {
    const response = await api.patch(`/admin/veiculos/${userId}`)
    return response.data
  },

  async getBySituation(userId, situation) {
    const response = await api.get(`/admin/veiculos/${userId}/${situation}`)
    return response.data
  },
}
