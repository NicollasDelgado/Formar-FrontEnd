import { Box, Typography, Button, useTheme } from '@mui/material'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  CalendarTodayOutlined as CalendarIcon,
  DriveEtaOutlined as CarIcon,
  AddOutlined as AddIcon,
  PeopleOutlined as UsersIcon,
} from '@mui/icons-material'

export const ButtonNavigation: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const theme = useTheme()

  // Função para saber se o botão está selecionado
  const isSelected = (path: string) => location.pathname === path

  const commonButtonStyles = {
    px: 2,
    py: 1.5,
    borderRadius: 3,
    color: theme.palette.text.primary,
    transition: 'all 0.2s ease-in-out',
    justifyContent: 'flex-start',
    textTransform: 'none',
    width: { xs: '100%', md: 'auto' },
    '&:hover': {
      backgroundColor: 'rgba(0, 123, 255, 0.212)',
      transform: 'translateY(-1px)',
      boxShadow: theme.shadows[2],
    },
  }

  const DashboardButton = () => (
    <Button
      onClick={() => navigate('/home')}
      startIcon={<CalendarIcon />}
      sx={{
        ...commonButtonStyles,
        color: isSelected('/home') ? theme.palette.primary.main : theme.palette.text.primary,
        bgcolor: isSelected('/home') ? 'rgba(0,123,255,0.15)' : 'transparent',
      }}
    >
      <Typography>Dashboard</Typography>
    </Button>
  )

  const VeiculosButton = () => (
    <Button
      onClick={() => navigate('/vehicles')}
      startIcon={<CarIcon />}
      sx={{
        ...commonButtonStyles,
       
        color: isSelected('/vehicles') ? theme.palette.primary.main : theme.palette.text.primary,
        bgcolor: isSelected('/vehicles') ? 'rgba(0,123,255,0.15)' : 'transparent',
      }}
    >
      <Typography>Veículos</Typography>
    </Button>
  )

  const NovoAgendamentoButton = () => (
    <Button
      onClick={() => navigate('/new-appointments')}
      startIcon={<AddIcon />}
      sx={{
        ...commonButtonStyles,
       
        color: isSelected('/new-appointments') ? theme.palette.primary.main : theme.palette.text.primary,
        bgcolor: isSelected('/new-appointments') ? 'rgba(0,123,255,0.15)' : 'transparent',
      }}
    >
      <Typography fontSize={13}>Novo Agendamento</Typography>
    </Button>
  )

  const UsuariosButton = () => (
    <Button
      onClick={() => navigate('/users')}
      startIcon={<UsersIcon />}
      sx={{
        ...commonButtonStyles,
      
        color: isSelected('/users') ? theme.palette.primary.main : theme.palette.text.primary,
        bgcolor: isSelected('/users') ? 'rgba(0,123,255,0.15)' : 'transparent',
      }}
    >
      <Typography>Usuários</Typography>
    </Button>
  )

  return (
    <Box
      display="flex"
      flexDirection={{ xs: 'column', md: 'row' }}
      alignItems="center"
      gap={1}
    >
      <DashboardButton />
      <VeiculosButton />
      <NovoAgendamentoButton />
      <UsuariosButton />
    </Box>
  )
}