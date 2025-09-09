  import React, { useEffect } from 'react'
  import { Routes, Route, Navigate } from 'react-router-dom'

  import { useDrawer } from '../shared/hooks/drawer'

  import {
    Dashboard,
    CreateUser,
    User,
    Analytics,
    Configurations,
    Vehicles,
    NewAppointments,
  } from '../pages'

  import { menu } from '../shared/utils/menu'

  export const PrivateRoutes: React.FC = () => {
    const { setDrawerOptions } = useDrawer()

    useEffect(() => {
      setDrawerOptions(menu)
    }, [setDrawerOptions])

    return (
      <Routes>
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
