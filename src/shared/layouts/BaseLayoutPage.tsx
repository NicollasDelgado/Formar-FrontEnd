import { Box, useMediaQuery, useTheme } from '@mui/material'
import logo from '../../assets/logo.png'

interface IBaseLayoutPageProps {
  children: React.ReactNode
  toolbar?: React.ReactNode
}

export const BaseLayoutPage: React.FC<IBaseLayoutPageProps> = ({
  children,
  toolbar,
}) => {
  const theme = useTheme()
  const smDown = useMediaQuery(theme.breakpoints.down('sm'))

  return (
    <Box
      height="100vh"
      display="flex"
      flexDirection="column"
      marginTop={9}
    >
      <Box>
        <img
          src={logo}
          alt="Instituto Formar"
          width={'200px'}
          style={{
            alignSelf: 'center',
            marginTop:'0px',
          }}
        />
      </Box>
      {toolbar && <Box>{toolbar}</Box>}

      <Box marginLeft={smDown ? 2 : 0} overflow="auto">
        {children}
      </Box>
    </Box>
  )
}
