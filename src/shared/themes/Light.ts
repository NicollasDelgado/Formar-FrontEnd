import { createTheme } from '@mui/material'

export const LightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#f4c430',
      light: '#e5e7eb',
      contrastText: '#fff',
    },
    secondary: {
      main: '#F0801E',
      light: '#F8A629',
      contrastText: '#fff',
    },
    text: {
      primary: '#333',
    },
    background: {
      default: '#fff',
      paper: '#f9fafb	',
    },
  },
  typography: {
    allVariants: {
      color: '#333',
    },
  },
})
