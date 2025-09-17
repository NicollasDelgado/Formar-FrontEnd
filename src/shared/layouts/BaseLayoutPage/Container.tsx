import { Box, BoxProps, useTheme, useMediaQuery } from '@mui/material'
import { ReactNode } from 'react'

interface ContainerProps extends BoxProps {
  children: ReactNode
  isMobile?: boolean
}

export const Container: React.FC<ContainerProps> = ({ 
  children, 
  isMobile = false, 
  ...props 
}) => {
  const theme = useTheme()
  
  // Breakpoints específicos
  const isXsScreen = useMediaQuery('(max-width: 375px)') // iPhone SE e menores
  const isSmallMobile = useMediaQuery('(max-width: 480px)') // Celulares pequenos
  const isTablet = useMediaQuery(theme.breakpoints.between('md', 'lg')) // Tablets
  const isLargeDesktop = useMediaQuery('(min-width: 1440px)') // Telas grandes
  const isUltraWide = useMediaQuery('(min-width: 1920px)') // Monitores ultrawide

  // Função para calcular padding responsivo
  const getResponsivePadding = () => {
    if (isMobile) {
      if (isXsScreen) return { px: 1, py: 1.5 } // Muito pouco espaço
      if (isSmallMobile) return { px: 1.5, py: 2 } // Pouco espaço
      return { px: 2, py: 2.5 } // Mobile padrão
    }
    
    // Desktop/Tablet
    if (isTablet) return { px: 3, py: 3 }
    if (isLargeDesktop) return { px: 5, py: 4 }
    if (isUltraWide) return { px: 6, py: 5 }
    return { px: 4, py: 3 } // Desktop padrão
  }

  // Função para calcular max-width do conteúdo
  const getMaxWidth = () => {
    if (isMobile) return '100%'
    if (isUltraWide) return '1400px' // Limita em telas muito grandes
    return '100%'
  }

  const responsivePadding = getResponsivePadding()

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        ...responsivePadding,
        overflow: 'auto',
        display: 'flex',
        flexDirection: 'column',
        
        // Melhorias de performance e UX
        WebkitOverflowScrolling: 'touch', // Scroll suave no iOS
        scrollbarWidth: 'thin', // Firefox
        '&::-webkit-scrollbar': {
          width: '6px',
        },
        '&::-webkit-scrollbar-track': {
          background: 'transparent',
        },
        '&::-webkit-scrollbar-thumb': {
          background: theme.palette.divider,
          borderRadius: '3px',
          '&:hover': {
            background: theme.palette.text.disabled,
          },
        },

        // Container centralizado para telas muito grandes
        alignItems: isUltraWide ? 'center' : 'stretch',
        
        // Animação suave ao redimensionar
        transition: 'padding 0.3s ease-in-out',
        
        // Gap responsivo para elementos filhos
        gap: {
          xs: 1,
          sm: 1.5,
          md: 2,
          lg: 2.5,
          xl: 3,
        },
        
        // Min-height para evitar layout shifts
        minHeight: 0, // Importante para flex containers
      }}
      {...props}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: getMaxWidth(),
          display: 'flex',
          flexDirection: 'column',
          gap: 'inherit', // Herda o gap do pai
        }}
      >
        {children}
      </Box>
    </Box>
  )
}