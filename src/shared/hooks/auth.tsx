// src/shared/hooks/auth.tsx
import React, { createContext, useCallback, useState, useContext } from 'react'
import { authService } from '../../services/authService'

interface User {
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

interface SignInCredentials {
  email: string
  password: string
}

interface AuthContextData {
  user: User
  token: string
  signIn(credentials: SignInCredentials): Promise<{ token: string; user: User }>
  signOut(): void
  updateUser(user: User): void
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<{ token: string; user: User }>(() => {
    const token = authService.getToken()
    const user = authService.getCurrentUser()

    if (token && user) {
      return { token, user }
    }
    return {} as { token: string; user: User }
  })

  const signIn = useCallback(async ({ email, password }: SignInCredentials) => {
    const response = await authService.login({ email, password })
    authService.saveAuthData(response.token, response.user)
    
    setData({
      token: response.token,
      user: response.user
    })

    return response
  }, [])

  const signOut = useCallback(() => {
    authService.logout()
    setData({} as { token: string; user: User })
  }, [])

  const updateUser = useCallback((user: User) => {
    authService.saveAuthData(data.token, user)
    setData(prev => ({ ...prev, user }))
  }, [data.token])

  return (
    <AuthContext.Provider value={{ user: data.user, token: data.token, signIn, signOut, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextData {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within an AuthProvider')
  return context
}