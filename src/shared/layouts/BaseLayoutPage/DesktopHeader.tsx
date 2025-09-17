import { 
  AppBar, 
  Toolbar, 
  Box, 
  Theme
} from '@mui/material'
import { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { BotaoSair } from '../../components/buttons-navigation'
import StatusIndicator from '../../components/StatusIndicator'

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
        {/* StatusIndicator */}
      <Box sx={{mr: -40}}>
        <StatusIndicator />
      </Box>
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
          <BotaoSair onClick={handleSignOut} />
        </Box>
      </Toolbar>
    </AppBar>
  )
}