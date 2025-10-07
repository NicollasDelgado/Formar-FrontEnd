import { api } from './api'

export const scheduleService = {
  async create(userId, scheduleData) {
    const response = await api.post(`/agendamentos/${userId}`, scheduleData)
    return response.data
  },

  async createFast(userId, scheduleData) {
    const response = await api.post(
      `/agendamentos/fastSchedule/${userId}`,
      scheduleData,
    )
    return response.data
  },

  async getAll() {
    const response = await api.get('/agendamentos')
    return response.data
  },

  async getOwn(userId) {
    const response = await api.get(`/agendamentos/${userId}`)
    return response.data
  },

  async update(userId, scheduleId, scheduleData) {
    const response = await api.put(
      `/agendamentos/${userId}/${scheduleId}`,
      scheduleData,
    )
    return response.data
  },

  async finalize(scheduleId, userId) {
    const response = await api.put(
      `/agendamentos/finalize-schedules/${scheduleId}/${userId}`,
    )
    return response.data
  },
}
