import { api } from '../shared/services/api'
import { IResetPassword } from '../shared/dtos'

interface ICustomerRegisterProps {
  name: string
  email: string
  whatsapp: string
  password: string // ADICIONAR SENHA
}

interface ICreateUserProps {
  name: string
  email: string
  whatsapp: string
  password: string // ADICIONAR SENHA
}

const login = async (email: string, password: string) => {
  try {
    const result = await api.post('/login', {
      email,
      password,
    })

    return result.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || error.message)
  }
}

const forgotPassword = async (email: string) => {
  try {
    // ROTA CORRETA DO BACKEND
    const result = await api.post('/esqueceu-senha', { email })

    return result.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || error.message)
  }
}

const resetPassword = async ({ token, password }: IResetPassword) => {
  try {
    // ROTA CORRETA DO BACKEND
    const result = await api.post('/resetar-senha', { token, password })

    return result.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || error.message)
  }
}

const customerRegister = async (data: ICustomerRegisterProps) => {
  try {
    const result = await api.post('/users', data)

    return result.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || error.message)
  }
}

const createUser = async (data: ICreateUserProps) => {
  try {
    const result = await api.post('/users', data)

    return result.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || error.message)
  }
}

// FUNÇÕES ADICIONAIS ÚTEIS

const getUsers = async () => {
  try {
    const result = await api.get('/users')
    return result.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || error.message)
  }
}

const updateUser = async (id: number, data: Partial<ICreateUserProps>) => {
  try {
    const result = await api.put(`/users/${id}`, data)
    return result.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || error.message)
  }
}

const deleteUser = async (id: number) => {
  try {
    const result = await api.delete(`/users/${id}`)
    return result.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || error.message)
  }
}

// AGENDAMENTOS
const getSchedules = async () => {
  try {
    const result = await api.get('/agendamentos')
    return result.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || error.message)
  }
}

export { 
  login, 
  forgotPassword, 
  resetPassword, 
  customerRegister, 
  createUser,
  getUsers,
  updateUser,
  deleteUser,
  getSchedules
}