import { 
  AppBar, 
  Toolbar, 
  Box, 
  Theme, 
  IconButton,
  Typography
} from '@mui/material'
import { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import LogoutIcon from '@mui/icons-material/Logout' // Importar o ícone

interface DesktopHeaderProps {
  theme: Theme
  logo: string
  navigationContent: ReactNode
}

export const DesktopHeader: React.FC<DesktopHeaderProps> = ({
  theme,
  logo,
  navigationContent,
}) => {
  const navigate = useNavigate()
  
  const handleSignOut = () => {
    // Aqui você pode adicionar lógica de logout se necessário
    // Por exemplo: limpar token, contexto de autenticação, etc.
    navigate('/login')
  }

  return (
    <AppBar 
      position="static" 
      elevation={0}
      sx={{ 
        backgroundColor: 'transparent',
        borderBottom: `1px solid ${theme.palette.divider}`
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <img 
            src={logo} 
            alt="Logo" 
            style={{ 
              height: 40, 
              marginRight: theme.spacing(2) 
            }} 
          />
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {navigationContent}
          
          {/* Botão Sarr */}
          <IconButton
            onClick={handleSignOut}
            sx={{
              px: 2,
              py: 1,
              borderRadius: 3,
              color: theme.palette.text.primary,
              transition: 'all 0.2s ease-in-out',
              '&:hover': { 
                backgroundColor: 'rgba(255,0,0,0.08)', 
                color: theme.palette.error.main, 
                transform: 'translateY(-1px)', 
                boxShadow: theme.shadows[4] 
              },
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
        </Box>
      </Toolbar>
    </AppBar>
  )
}