// src/services/authService.ts
import { api } from '../shared/services/api'

export interface LoginCredentials {
  email: string
  password: string
}

export interface User {
  id: string
  name: string
  email: string
  whatsapp?: string
  avatar?: string
  id_profile: number
  status: boolean
  mail_ok: boolean
  role?: string
}

export interface LoginResponse {
  token: string
  user: User
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const response = await api.post('/login/', credentials)
    return response.data
  },

  async forgotPassword(email: string): Promise<any> {
    const response = await api.post('/esqueceu-senha/', { email })
    return response.data
  },

  async resetPassword(token: string, password: string): Promise<any> {
    const response = await api.patch(`/resetar-senha/${token}`, { password })
    return response.data
  },

  saveAuthData(token: string, user: User): void {
    localStorage.setItem('@Formar:token', token)
    localStorage.setItem('@Formar:user', JSON.stringify(user))
  },

  logout(): void {
    localStorage.removeItem('@Formar:token')
    localStorage.removeItem('@Formar:user')
    window.location.href = '/login'
  },

  getCurrentUser(): User | null {
    const user = localStorage.getItem('@Formar:user')
    return user ? JSON.parse(user) : null
  },

  getToken(): string | null {
    return localStorage.getItem('@Formar:token')
  }
}