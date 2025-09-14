import { ReactNode } from 'react'
import { Box, Divider, Typography, useMediaQuery, useTheme } from '@mui/material'
import logo from '../../assets/logo.png'

interface CreateLayoutPageProps {
  children: ReactNode
}

export const CreateLayoutPage = ({ children }: CreateLayoutPageProps) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      sx={{
        background: theme.palette.background.paper,
        overflow: 'hidden', // remove scroll
      }}
    >
      <Box
        width={isMobile ? '90%' : '400px'}
        sx={{
          maxHeight: '100vh', // garante que o container nunca ultrapasse a viewport
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center', // centraliza verticalmente o conteúdo
          padding: isMobile ? 2 : 4, // padding menor para mobile
          borderRadius: '8px',
          border: `1px solid ${theme.palette.primary.light}`,
          background: theme.palette.background.default,
          boxSizing: 'border-box',
        }}
      >
        <Box display="flex" flexDirection="column" alignItems="center" gap={1}>
          {/* Logo */}
          <img
            src={logo}
            alt="Instituto Formar"
            width={isMobile ? '150px' : '200px'}
            style={{ display: 'block' }}
          />

          {/* Título */}
          <Typography variant="h5" textAlign="center" fontWeight={800}>
            Instituto Formar
          </Typography>

          {/* Subtítulo */}
          <Typography variant="body2" textAlign="center">
            Sistema de Gestão de Veículos
          </Typography>

          {/* Divider */}
          <Divider sx={{ width: '100%', my: 2 }} />

          {/* Conteúdo injetado */}
          <Box width="100%" overflow="auto">
            {children}
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
