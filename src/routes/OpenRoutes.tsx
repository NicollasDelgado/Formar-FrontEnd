import React from 'react'

import { Routes, Route, Navigate } from 'react-router-dom'
import { Login, ForgotPassword, ResetPassword, Analytics, Configurations, Dashboard, NewAppointments, CreateUser, User, Vehicles } from '../pages'

export const OpenRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      <Route path="*" element={<Navigate to="/" />} />
      
        // excluir as rotas privadas abaixo quando estiver pronto o sistema de autenticação
        <Route path="/home" element={<Dashboard />} />
          <Route path="/CreateUser" element={<CreateUser />} />
          <Route path="/users" element={<User />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/configs" element={<Configurations />} />
          <Route path="/vehicles" element={<Vehicles />} />
          <Route path="/new-appointments" element={<NewAppointments />} />
          <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  )
}
