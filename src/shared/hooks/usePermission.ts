import { useAuth } from './auth'

type UserRole = 'admin' | 'user'

interface UsePermissionReturn {
  hasPermission: (allowedRoles: UserRole[]) => boolean
  isAdmin: () => boolean
  isUser: () => boolean
  userRole: UserRole | undefined
}

export function usePermission(): UsePermissionReturn {
  const { user } = useAuth()

  const hasPermission = (allowedRoles: UserRole[]): boolean => {
    if (!user || !user.role) return false
    return allowedRoles.includes(user.role)
  }

  const isAdmin = (): boolean => {
    return user?.role === 'admin'
  }

  const isUser = (): boolean => {
    return user?.role === 'user'
  }

  return {
    hasPermission,
    isAdmin,
    isUser,
    userRole: user?.role,
  }
}