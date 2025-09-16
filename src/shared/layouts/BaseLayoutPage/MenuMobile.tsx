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

interface MenuMobileProps {
  theme: Theme
  open: boolean
  onClose: () => void
  logo: string
  navigationContent: ReactNode
  onSignOut: () => void
}

export const MenuMobile: React.FC<MenuMobileProps> = ({
  theme,
  open,
  onClose,
  logo,
  navigationContent,
  onSignOut
}) => {
  return (
    <Drawer
      anchor="left"
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
          alignItems: 'center'
        }}
      >
        <img 
          src={logo} 
          alt="Logo" 
          style={{ height: 40 }} 
        />
      </Box>
      <Divider />
      
      <Box sx={{ overflow: 'auto' }}>
        {navigationContent}
      </Box>
      
      <Box sx={{ mt: 'auto', p: 2 }}>
        <List>
          <ListItem disablePadding>
            <ListItemButton onClick={onSignOut}>
              <ListItemIcon>
                <span className="material-icons">logout</span>
              </ListItemIcon>
              <ListItemText primary="Sair" />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
    </Drawer>
  )
}