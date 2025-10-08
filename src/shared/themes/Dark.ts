import { createTheme } from '@mui/material'

export const DarkTheme = createTheme({
  palette: {
    mode: 'dark',
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
      primary: '#fff',
    },
    background: {
      default: '#423F4D',
      paper: '#28262E',
    },
  },
  typography: {
    allVariants: {
      color: '#fff',
    },
  },
})
