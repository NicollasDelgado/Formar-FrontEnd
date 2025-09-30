import { Box, Typography, Button, useTheme, IconButton } from '@mui/material'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  CalendarTodayOutlined as CalendarIcon,
  DriveEtaOutlined as CarIcon,
  AddOutlined as AddIcon,
  PeopleOutlined as UsersIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material'
import { CanAccess } from './../CanAcess'

export const BotaoSair: React.FC<{ 
  onClick: () => void 
  variant?: 'desktop' | 'mobile'
}> = ({ onClick, variant = 'desktop' }) => {
  const theme = useTheme()

  if (variant === 'mobile') {
    return <LogoutIcon sx={{ color: theme.palette.error.main }} />
  }

  const commonButtonStyles = {
    px: 2,
    py: 1.5,
    borderRadius: 3,
    color: theme.palette.text.primary,
    transition: 'all 0.2s ease-in-out',
    justifyContent: 'flex-start',
    textTransform: 'none',
    width: { xs: '100%', md: 'auto' },
  }

  return (
    <IconButton
      onClick={onClick}
      sx={{
        ...commonButtonStyles,
        '&:hover': { 
          backgroundColor: 'rgba(255,0,0,0.08)', 
          color: theme.palette.error.main, 
          transform: 'translateY(-1px)', 
          boxShadow: '0px 6.5px 10px #F9A3A8'
        },
        '&:active': {
          backgroundColor: 'rgba(255,0,0,0.08)', 
          color: theme.palette.error.main,
          transform: 'translateY(-1px)',
          boxShadow: theme.shadows[4], 
        }
      }}
    >
      <LogoutIcon fontSize="small" />
      <Typography 
        ml={1} 
        variant="body2" 
        sx={{ 
          display: { md: 'none', lg: 'block' }, 
          fontWeight: 500 
        }}
      >
        Sair
      </Typography>
    </IconButton>
  )
}

export const ButtonNavigation: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const theme = useTheme()

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
    '&:active': {
      backgroundColor: 'rgba(0, 123, 255, 0.212)',
      transform: 'translateY(-1px)',
      boxShadow: theme.shadows[2],
    },
  }

  return (
    <Box
      display="flex"
      sx={{
        flexWrap: 'wrap',
        gap: 1,
        justifyContent: 'center',
        alignItems: 'center',
        '& > *': {
          flexShrink: 0
        }
      }}
    >
      {/* Dashboard - sempre visível */}
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

      {/* Veículos - apenas admin */}
      <Box sx={{ display: 'contents' }}>
        <CanAccess allowedRoles={['admin']}>
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
        </CanAccess>
      </Box>

      {/* Agendamentos - sempre visível */}
      <Button
        onClick={() => navigate('/new-appointments')}
        startIcon={<AddIcon />}
        sx={{
          ...commonButtonStyles,
          color: isSelected('/new-appointments') ? theme.palette.primary.main : theme.palette.text.primary,
          bgcolor: isSelected('/new-appointments') ? 'rgba(0,123,255,0.15)' : 'transparent',
        }}
      >
        <Typography>Agendamentos</Typography>
      </Button>

      {/* Usuários - apenas admin */}
      <Box sx={{ display: 'contents' }}>
        <CanAccess allowedRoles={['admin']}>
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
        </CanAccess>
      </Box>
    </Box>
  )
}