import { api } from '../shared/services/api'

import { IResetPassword } from '../shared/dtos'

interface ICustomerRegisterProps {
  name: string
  email: string
  whatsapp: string
}

interface ICreateUserProps {
  name: string
  email: string
  whatsapp: string
}

const login = async (email: string, password: string) => {
  try {
    const result = await api.post('/login', {
      email,
      password,
    })

    return result.data
  } catch (error: any) {
    throw new Error(error.message)
  }
}

const forgotPassword = async (email: string) => {
  try {
    const result = await api.post('/forgot-password', { email })

    return result.data
  } catch (error: any) {
    throw new Error(error.message)
  }
}

const resetPassword = async ({ token, password }: IResetPassword) => {
  try {
    const result = await api.patch(`/reset-password/${token}`, { password })

    return result.data
  } catch (error: any) {
    throw new Error(error.message)
  }
}

const customerRegister = async (data: ICustomerRegisterProps) => {
  try {
    const result = await api.post('/customer', data)

    return result.data
  } catch (error: any) {
    throw new Error(error.message)
  }
}

const createUser = async (data: ICreateUserProps) => {
  try {
    const result = await api.post('/users', data)

    return result.data
  } catch (error: any) {
    throw new Error(error.message)
  }
}

export { login, forgotPassword, resetPassword, customerRegister, createUser }