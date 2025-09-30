import React, { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useDrawer } from '../shared/hooks/drawer'
import {
  Dashboard,
  User,
  Analytics,
  Configurations,
  Vehicles,
  NewAppointments,
} from '../pages'
import { getFilteredMenu } from '../shared/utils/menu'
import { usePermission } from '../shared/hooks/usePermission'
import { RoleRoute } from './RoleRoute'

export const PrivateRoutes: React.FC = () => {
  const { setDrawerOptions } = useDrawer()
  const { userRole } = usePermission()

  useEffect(() => {
    // Filtra o menu baseado no role do usuário
    const filteredMenu = getFilteredMenu(userRole)
    setDrawerOptions(filteredMenu)
  }, [setDrawerOptions, userRole])

  return (
    <Routes>
      {/* Rotas acessíveis para TODOS os usuários autenticados */}
      <Route path="/home" element={<Dashboard />} />
      <Route path="/analytics" element={<Analytics />} />
      <Route path="/configs" element={<Configurations />} />
      <Route path="/new-appointments" element={<NewAppointments />} />

      {/* Rotas APENAS para ADMIN */}
      <Route
        path="/users"
        element={
          <RoleRoute allowedRoles={['admin']}>
            <User />
          </RoleRoute>
        }
      />
      <Route
        path="/vehicles"
        element={
          <RoleRoute allowedRoles={['admin']}>
            <Vehicles />
          </RoleRoute>
        }
      />

      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  )
}