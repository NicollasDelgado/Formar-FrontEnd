import React from 'react'
import { usePermission } from '../hooks/usePermission'

type UserRole = 'admin' | 'user'

interface CanAccessProps {
  allowedRoles: UserRole[]
  children: React.ReactNode
  fallback?: React.ReactNode
}

export const CanAccess: React.FC<CanAccessProps> = ({
  allowedRoles,
  children,
  fallback = null,
}) => {
  const { hasPermission } = usePermission()

  if (!hasPermission(allowedRoles)) {
    return <>{fallback}</>
  }

  return <>{children}</>
}

// EXEMPLO DE USO:
// 
// import { CanAccess } from '../../shared/components/CanAccess'
// 
// function Dashboard() {
//   return (
//     <div>
//       <h1>Dashboard</h1>
//       
//       {/* Botão visível apenas para admin */}
//       <CanAccess allowedRoles={['admin']}>
//         <button>Deletar Usuário</button>
//       </CanAccess>
//     </div>
//   )
// }