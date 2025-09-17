import { 
  AppBar, 
  Toolbar, 
  IconButton, 
  Box, 
  Theme 
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import StatusIndicator from '../../components/StatusIndicator'

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
        backgroundColor: 'transparent',
        borderBottom: `1px solid ${theme.palette.divider}`
      }}
    >
      <Toolbar>
        <Box sx={{mr: -40}}>
        <StatusIndicator />
      </Box>
      <Box sx={{marginLeft: 45, display: 'flex', alignItems: 'center' }}>
       <img 
          src={logo} 
          alt="Logo" 
          style={{ height: 30}} 
        />
        </Box>
        <Box sx={{ flexGrow: 1 }} />
        
        <IconButton
          color="inherit"
          aria-label="menu"
          onClick={onMenuToggle}
          sx={{ color: 'black' }}
        >
          <MenuIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  )
}