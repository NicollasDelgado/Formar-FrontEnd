import { Box, useTheme, IconButton, Typography } from '@mui/material'
import logo from '../../assets/logo.png'
import LogoutIcon from '@mui/icons-material/Logout'
interface IBaseLayoutPageProps {
  children: React.ReactNode
}

export const BaseLayoutPage: React.FC<IBaseLayoutPageProps> = ({
  children,
}) => {
  const theme = useTheme()

  return (
    <Box
      height="100vh"
      width="100%"
      display="flex"
      flexDirection="column"
      sx={{
        background: theme.palette.background.paper,
      }}
    >
      <Box
        padding={1}
        sx={{
          background: theme.palette.background.default,
          paddingLeft: '3rem',
          paddingRight: '3rem',
          boxShadow: '0px 1px 3px rgba(0,0,0,0.1)',
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <img src={logo} alt="Instituto Formar" width={'150px'} />
        <Box display="flex" alignItems="center">
          <IconButton
            sx={{
              px: 1.5,
              py: 1,
              borderRadius: 3,
              color: theme.palette.text.primary,
              '&:hover': {
                backgroundColor: 'rgba(255, 0, 0, 0.05)',
                boxShadow: 'none',
                color: (theme) => theme.palette.error.main,
                '& svg': {
                  color: (theme) => theme.palette.error.main,
                },
                '& .MuiTypography-root': {
                  color: (theme) => theme.palette.error.main,
                },
              },
            }}
          >
            <LogoutIcon fontSize="small" />
            <Typography ml={2} variant="body2">
              Sair
            </Typography>
          </IconButton>
        </Box>
      </Box>

      <Box>{children}</Box>
    </Box>
  )
}
