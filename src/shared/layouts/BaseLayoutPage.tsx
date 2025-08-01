import { Box, IconButton, Typography, useTheme } from '@mui/material'
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined'
import DriveEtaOutlinedIcon from '@mui/icons-material/DriveEtaOutlined'
import AddOutlinedIcon from '@mui/icons-material/AddOutlined'
import LogoutIcon from '@mui/icons-material/Logout'
import logo from '../../assets/logo.png' // Ajuste o caminho conforme necessário
import { ButtonNavigation } from '../components/buttons-navigation'
import { useAuth } from '../hooks/auth'

interface IBaseLayoutPageProps {
  children: React.ReactNode
}

export const BaseLayoutPage: React.FC<IBaseLayoutPageProps> = ({
  children,
}) => {
  const theme = useTheme()
  const { signOut } = useAuth()
  const links = [
    {
      label: 'Dashboard',
      icon: <CalendarTodayOutlinedIcon />,
      path: '/home',
    },
    { label: 'Veículos', icon: <DriveEtaOutlinedIcon />, path: '/vehicles' },
    {
      label: 'Novo Agendamento',
      icon: <AddOutlinedIcon />,
      path: '/new-appointments',
    },
    { label: 'Usuários', icon: <AddOutlinedIcon />, path: '/users' },
  ]
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
            {links.map((link) => (
              <ButtonNavigation
                key={link.label}
                icon={link.icon}
                label={link.label}
                link={link.path}
              />
            ))}

            {/* Veículos */}
          </Box>
        </Box>
        {/* BOTÃO SAIR */}
        <Box display="flex" alignItems="center">
          <IconButton
            onClick={signOut}
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
