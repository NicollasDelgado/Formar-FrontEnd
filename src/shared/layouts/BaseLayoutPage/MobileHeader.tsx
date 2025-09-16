import { 
  AppBar, 
  Toolbar, 
  IconButton, 
  Box, 
  Theme 
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'

interface MobileHeaderProps {
  theme: Theme
  onMenuToggle: () => void
  logo: string
}

export const MobileHeader: React.FC<MobileHeaderProps> = ({
  theme,
  onMenuToggle,
  logo
}) => {
  return (
    <AppBar 
      position="static" 
      elevation={0}
      sx={{ 
        backgroundColor: theme.palette.primary.main,
        borderBottom: `1px solid ${theme.palette.divider}`
      }}
    >
      <Toolbar>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          onClick={onMenuToggle}
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>
        
        <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
          <img 
            src={logo} 
            alt="Logo" 
            style={{ height: 30 }} 
          />
        </Box>
      </Toolbar>
    </AppBar>
  )
}