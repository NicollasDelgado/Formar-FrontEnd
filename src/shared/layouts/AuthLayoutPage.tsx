import { ReactNode } from 'react'
import { Box, Divider, Grid, Typography, useMediaQuery, useTheme } from '@mui/material'
import logo from '../../assets/logo.png'
import StatusIndicator from '../components/StatusIndicator'

interface AuthLayoutProps {
  children: ReactNode
}

export const AuthLayout = ({ children }: AuthLayoutProps) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const isTablet = useMediaQuery(theme.breakpoints.between('md', 'lg'))

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      sx={{
        background: theme.palette.background.paper,
        overflow: 'hidden',
        padding: 0,
        position: 'relative',
      }}
    >
      <Box
        width={isMobile ? '95%' : isTablet ? '450px' : '420px'}
        sx={{
          height: 'auto',
          maxHeight: '95vh',
          display: 'flex',
          flexDirection: 'column',
          padding: isMobile ? 2.5 : 4,
          borderRadius: '12px',
          border: `1px solid ${theme.palette.divider}`,
          background: theme.palette.background.default,
          boxSizing: 'border-box',
          boxShadow: theme.shadows[3],
          position: 'relative',
          margin: isMobile ? 2 : 0,
        }}
      >
        {/* Header e Títulos */}
        <Box 
          display="flex" 
          flexDirection="column" 
          alignItems="center" 
          sx={{ mb: 3 }}
        >
        {/* StatusIndicator */}
          <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
            <StatusIndicator />
          </Box>
          <Typography 
            variant={isMobile ? "h6" : "h5"} 
            textAlign="center" 
            fontWeight={700}
            sx={{ mb: 0.5 }}
          >
            Instituto Formar
          </Typography>

          <Typography 
            variant="body2" 
            textAlign="center"
            color="text.secondary"
            sx={{ mb: 2 }}
          >
            Sistema de Gestão de Veículos
          </Typography>

          <Divider sx={{ width: '100%' }} />
        </Box>

        {/* Conteúdo Principal */}
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'visible',
            minHeight: 0,
          }}
        >
          {children}
        </Box>
        
          {/* Rodapé inspirado no WhatsApp */}
          <Grid item xs={12}>
            <Box
              sx={{
                borderTop: `1px solid ${theme.palette.divider}`,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 2,
              }}
            >
              <img
                src={logo}
                alt="Instituto Formar"
                width={isMobile ? '60px' : '100px'}
                style={{ 
                  display: 'block', 
                  marginBottom: '6px',
                  marginTop: '10px',
                  alignSelf: 'center',
                }}
              />
              {/* Links do Rodapé */}
              <Box
                sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: isMobile ? 1 : 2,
                  '& > *': {
                    fontSize: isMobile ? '0.75rem' : '0.8rem',
                  }
                }}
              >
                <Typography variant="caption" color="text.disabled">
                  •
                </Typography>  

                <Typography variant="caption" color="text.disabled"
                  >
                  Contato: contato@institutoformar.org
                </Typography>
              </Box>

              {/* Copyright */}
              <Typography 
                variant="caption" 
                color="text.disabled" 
                textAlign="center"
                sx={{ 
                  fontSize: isMobile ? '0.75rem' : '0.8rem',
                }}
              >
                © 2025 Instituto Formar. Todos os direitos reservados.
              </Typography>
            </Box>
          </Grid>
      </Box>
    </Box>
  )
}