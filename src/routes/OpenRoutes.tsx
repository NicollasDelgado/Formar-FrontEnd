import React from 'react'

import { Routes, Route, Navigate } from 'react-router-dom'
import {
  Login,
  Dashboard,
  ForgotPassword,
  ResetPassword,
  SignUp,
  User,
  Vehicles,
  NewAppointments,
} from '../pages'

export const OpenRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/sign-up" element={<SignUp />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      <Route path="/home" element={<Dashboard />} />
      <Route path="/users" element={<User />} />
      <Route path="/vehicles" element={<Vehicles />} />
      <Route path="/new-appointments" element={<NewAppointments />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}
