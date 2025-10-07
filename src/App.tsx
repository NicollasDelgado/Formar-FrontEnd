import React from 'react'
import 'react-toastify/dist/ReactToastify.css'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './shared/hooks/auth'
import { AppRoutes } from './routes'
import { DrawerProvider } from './shared/hooks/drawer'
import './global.css'

export const App: React.FC = () => (
  <AuthProvider>
    <DrawerProvider>
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
    </DrawerProvider>
  </AuthProvider>
)