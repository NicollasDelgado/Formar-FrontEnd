export interface IUser {
  id?: number | null
  name: string
  email: string
  whatsapp: string
  avatar?: string
  role: 'admin' | 'user'
}