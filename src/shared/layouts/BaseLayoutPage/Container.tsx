import { Box, BoxProps } from '@mui/material'
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
  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        p: isMobile ? 2 : 3,
        overflow: 'auto',
        display: 'flex',
        flexDirection: 'column'
      }}
      {...props}
    >
      {children}
    </Box>
  )
}