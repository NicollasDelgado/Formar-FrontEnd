import React from 'react'
import { Navigate } from 'react-router-dom'
import { usePermission } from '../shared/hooks/usePermission'

type UserRole = 'admin' | 'user'

interface RoleRouteProps {
  children: React.ReactElement
  allowedRoles: UserRole[]
  redirectTo?: string
}

export const RoleRoute: React.FC<RoleRouteProps> = ({
  children,
  allowedRoles,
  redirectTo = '/home',
}) => {
  const { hasPermission } = usePermission()

  if (!hasPermission(allowedRoles)) {
    return <Navigate to={redirectTo} replace />
  }

  return children
}