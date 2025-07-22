import { ReactNode } from 'react'
import {
  Box,
  Divider,
  Grid,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'

import logo from '../../assets/logo.png'

interface AuthLayoutProps {
  children: ReactNode
}

export const AuthLayout = ({ children }: AuthLayoutProps) => {
  const theme = useTheme()
  const mdDown = useMediaQuery(theme.breakpoints.down('md'))

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      flexDirection={mdDown ? 'column' : 'row'}
      maxHeight="100vh"
      sx={{
        background: theme.palette.background.paper,
      }}
    >
      <Box
        width={mdDown ? '90%' : '35%'}
        height="100vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Grid
          container
          margin={2}
          sx={{
            height: '88%',
            padding: '25px',
            borderRadius: '8px',
            border: `1px solid ${theme.palette.primary.light}`,
            background: theme.palette.background.default,
          }}
        >
          <Grid
            item
            container
            width="100%"
            alignItems="center"
            justifyContent="center"
          >
            <Box
              height="100%"
              display="flex"
              flexDirection="column"
              alignItems="center"
              gap={1}
              width="100%"
            >
              <Box
                width="100%"
                marginBottom={5}
                marginTop={2}
                display="flex"
                flexDirection="column"
              >
                <img
                  src={logo}
                  alt="Instituto Formar"
                  width={mdDown ? '180px' : '200px'}
                  style={{
                    alignSelf: 'center',
                    marginTop: mdDown ? '40%' : '0px',
                    position: mdDown ? 'absolute' : 'relative',
                    top: '0',
                  }}
                />

                <Typography
                  variant="h5"
                  marginTop={mdDown ? 0 : 2}
                  textAlign="center"
                  fontWeight={800}
                >
                  Instituto Formar
                </Typography>

                <Typography
                  variant="body2"
                  marginTop={mdDown ? 0 : 2}
                  textAlign="center"
                >
                  Sistema de Gestão de Veículos
                </Typography>
                <Divider sx={{ marginTop: 1 }} />
              </Box>

              {/* Formulário ou conteúdo injetado */}
              {children}
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  )
}
