import React from 'react'

import 'react-toastify/dist/ReactToastify.css'

import { BrowserRouter } from 'react-router-dom'

import { AppProvider } from './shared/hooks'

import { AppRoutes } from './routes'

import './global.css'
// bypass temporário
localStorage.setItem("token", "fake-token");
localStorage.setItem("user", JSON.stringify({
  id: 1,
  name: "Nicollas",
  email: "teste@teste.com"
}));

export const App: React.FC = () => (
  <AppProvider>
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  </AppProvider>
)
