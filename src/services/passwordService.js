import { api } from './api'

export const passwordService = {
  async forgotPassword(email) {
    const response = await api.post('/esqueceu-senha', { email })
    return response.data
  },

  async resetPassword(token, newPassword) {
    const response = await api.patch(`/resetar-senha/${token}`, {
      password: newPassword,
    })
    return response.data
  },
}
