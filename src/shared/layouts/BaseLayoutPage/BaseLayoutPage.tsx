import { Box, useTheme, useMediaQuery } from '@mui/material'
import { useState } from 'react'
import logo from '../../../assets/logo.png' // caminho corrigido
import { ButtonNavigation } from '../../components/buttons-navigation'
import { MobileHeader } from './MobileHeader'
import { MenuMobile } from './MenuMobile'
import { DesktopHeader } from './DesktopHeader'
import { Container } from './Container'

interface IBaseLayoutPageProps {
  children: React.ReactNode
  // Props para customização
  customLogo?: string
  customNavigation?: React.ReactNode
  customSignOutAction?: () => void
}

export const BaseLayoutPage: React.FC<IBaseLayoutPageProps> = ({ 
  children, 
  customLogo, 
  customNavigation,
}) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }
  const NavigationContent = customNavigation || <ButtonNavigation />
  const currentLogo = customLogo || logo

  if (isMobile) {
    return (
      <Box
        height="100vh"
        width="100%"
        display="flex"
        flexDirection="column"
        sx={{ 
          overflow: 'hidden' 
        }}
      >
        <MobileHeader
          theme={theme}
          onMenuToggle={handleMobileMenuToggle}
          logo={currentLogo}
        />

        <MenuMobile
          theme={theme}
          open={mobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)}
          logo={currentLogo}
          navigationContent={NavigationContent}
        />

        <Container isMobile={true}>
          {children}
        </Container>
      </Box>
    )
  }

  return (
    <Box
      height="100vh"
      width="100%"
      display="flex"
      flexDirection="column"
      sx={{ 
        overflow: 'hidden' 
      }}
    >
      <DesktopHeader
        theme={theme}
        logo={currentLogo}
        navigationContent={NavigationContent}
      />

      <Container>
        {children}
      </Container>
    </Box>
  )
}
