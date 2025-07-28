import { Box, IconButton, Typography, useTheme } from '@mui/material'
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined'
import DriveEtaOutlinedIcon from '@mui/icons-material/DriveEtaOutlined'
import AddOutlinedIcon from '@mui/icons-material/AddOutlined'
import LogoutIcon from '@mui/icons-material/Logout'
import logo from '../../assets/logo.png' // Ajuste o caminho conforme necessário

interface IBaseLayoutPageProps {
  children: React.ReactNode
}

export const BaseLayoutPage: React.FC<IBaseLayoutPageProps> = ({
  children,
}) => {
  const theme = useTheme()

  return (
    <Box
      height="100vh"
      width="100%"
      display="flex"
      flexDirection="column"
      sx={{
        background: theme.palette.background.paper,
      }}
    >
      {/* BARRA SUPERIOR */}
      <Box
        sx={{
          background: theme.palette.background.default,
          px: 6,
          py: 1.5,
          boxShadow: '0px 1px 3px rgba(0,0,0,0.1)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        {/* LOGO E MENU */}
        <Box display="flex" alignItems="center">
          <img src={logo} alt="Instituto Formar" width="150px" />
          {/* <Typography variant="h5" fontWeight="bold" color="primary">
            Formar
          </Typography> */}

          {/* BOTÕES */}
          <Box display="flex" alignItems="center" ml={6}>
            {/* Dashboard */}
            <Box
              display="flex"
              alignItems="center"
              px={1.5}
              py={1}
              borderRadius={2}
              sx={{
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.05)',
                },
              }}
            >
              <CalendarTodayOutlinedIcon sx={{ fontSize: 19 }} />
              <Typography ml={1} variant="body2">
                Dashboard
              </Typography>
            </Box>

            {/* Veículos */}
            <Box
              display="flex"
              alignItems="center"
              px={1.5}
              py={1}
              ml={2}
              borderRadius={2}
              sx={{
                backgroundColor: 'rgba(0, 0, 0, 0.03)', // destaque leve
              }}
            >
              <DriveEtaOutlinedIcon sx={{ fontSize: 19 }} />
              <Typography ml={1} variant="body2">
                Veículos
              </Typography>
            </Box>

            {/* Novo Agendamento */}
            <Box
              display="flex"
              alignItems="center"
              px={1.5}
              py={1}
              ml={2}
              borderRadius={2}
              sx={{
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.05)',
                },
              }}
            >
              <AddOutlinedIcon sx={{ fontSize: 19 }} />
              <Typography ml={1} variant="body2">
                Novo Agendamento
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* BOTÃO SAIR */}
        <Box display="flex" alignItems="center">
          <IconButton
            sx={{
              px: 1.5,
              py: 1,
              borderRadius: 3,
              color: theme.palette.text.primary,
              '&:hover': {
                backgroundColor: 'rgba(255, 0, 0, 0.05)',
                color: theme.palette.error.main,
                '& svg': {
                  color: theme.palette.error.main,
                },
                '& .MuiTypography-root': {
                  color: theme.palette.error.main,
                },
              },
            }}
          >
            <LogoutIcon fontSize="small" />
            <Typography ml={1} variant="body2">
              Sair
            </Typography>
          </IconButton>
        </Box>
      </Box>

      {/* CONTEÚDO */}
      <Box flex={1}>{children}</Box>
    </Box>
  )
}
