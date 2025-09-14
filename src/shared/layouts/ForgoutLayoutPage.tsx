import { ReactNode } from 'react'
import { Box, Divider, Typography, useMediaQuery, useTheme } from '@mui/material'
import logo from '../../assets/logo.png'

interface ForgoutLayoutPageProps {
  children: ReactNode
}

export const ForgoutLayoutPage = ({ children }: ForgoutLayoutPageProps) => {
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
        padding: isMobile ? 2 : 0,
      }}
    >
      <Box
        width={isMobile ? '90%' : '400px'}
        sx={{
          padding: isMobile ? 3 : 5,
          borderRadius: '8px',
          border: `1px solid ${theme.palette.primary.light}`,
          background: theme.palette.background.default,
        }}
      >
        <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
          {/* Logo */}
          <img
            src={logo}
            alt="Instituto Formar"
            width={isMobile ? '150px' : '200px'}
            style={{ marginBottom: '16px' }}
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
          <Divider sx={{ width: '100%', marginY: 2 }} />

          {/* Conteúdo injetado (formulário ou outro) */}
          <Box width="100%">{children}</Box>
        </Box>
      </Box>
    </Box>
  )
}
