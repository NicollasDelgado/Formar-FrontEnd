import { 
  Drawer, 
  Box, 
  Divider, 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText, 
  Theme 
} from '@mui/material'
import { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { BotaoSair } from '../../components/buttons-navigation'

interface MenuMobileProps {
  theme: Theme
  open: boolean
  onClose: () => void
  logo: string
  navigationContent: ReactNode
}

export const MenuMobile: React.FC<MenuMobileProps> = ({
  theme,
  open,
  onClose,
  logo,
  navigationContent,
}) => {
  const navigate = useNavigate()
  
  const handleSignOut = () => {
    navigate('/login')
  }
  
  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      sx={{
        '& .MuiDrawer-paper': {
          boxSizing: 'border-box',
          width: 240,
        },
      }}
    >
      <Box
        sx={{
          padding: theme.spacing(2),
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Box >
        <img 
          src={logo} 
          alt="Logo" 
          style={{ height: 30}} 
        />
        </Box>
      </Box>
      <Divider />
      
     <Box sx={{ overflow: 'auto' }}>
        {navigationContent}
      </Box>
       {// Conteúdo de navegação */}

      <Box sx={{ mt: 'auto', p: 2 }}>
        <List>
          <ListItem disablePadding>
            <ListItemButton onClick={handleSignOut}>
              <ListItemIcon>
                <BotaoSair onClick={handleSignOut} variant="mobile"/>
              </ListItemIcon>
              <ListItemText primary="Sair" />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
      }
    </Drawer>
  )
}