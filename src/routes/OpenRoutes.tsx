import React from 'react'

import { Routes, Route, Navigate } from 'react-router-dom'
<<<<<<< HEAD
import {
  Login,
  Dashboard,
  ForgotPassword,
  ResetPassword,
  SignUp,
} from '../pages'
=======
import { Login, ForgotPassword, ResetPassword, SignUp } from '../pages'
>>>>>>> f5505deadde614c11fbe03e40dec64d7291a9634

export const OpenRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/sign-up" element={<SignUp />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
<<<<<<< HEAD
      <Route path="/Home" element={<Dashboard />} />

=======
>>>>>>> f5505deadde614c11fbe03e40dec64d7291a9634
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}
