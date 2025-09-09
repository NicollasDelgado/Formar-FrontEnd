import { Box, Typography, Link, useTheme } from '@mui/material'
import { useNavigate, useLocation } from 'react-router-dom'
import React from 'react'

interface ButtonNavigationProps {
  icon: React.ReactNode
  label: string
  link: string
}

export const ButtonNavigation = ({
  icon,
  label,
  link,
}: ButtonNavigationProps) => {
  const navigate = useNavigate()
  const location = useLocation()
  const theme = useTheme()

  const selected = location.pathname === link

  const color = selected
    ? theme.palette.primary.main
    : theme.palette.text.primary

  return (
    <Link
      component="button"
      onClick={() => navigate(link)}
      underline="none"
      sx={{
        display: 'flex',
        alignItems: 'center',
        cursor: 'pointer',
        textDecoration: 'none',
        color: 'inherit',
        margin: '0px 5px',
        '&:hover': {
          textDecoration: 'none',
        },
      }}
    >
      <Box
        display="flex"
        alignItems="center"
        px={1.5}
        py={1}
        borderRadius={2}
        sx={{
          backgroundColor: selected ? 'rgba(0, 0, 0, 0.01)' : 'transparent',
          '&:hover': {
            backgroundColor: selected
              ? 'rgba(0, 0, 0, 0.12)'
              : 'rgba(0, 0, 0, 0.05)',
          },
          color,
        }}
      >
        <Box
          component="span"
          sx={{
            display: 'flex',
            alignItems: 'center',
            color,
          }}
        >
          {icon}
        </Box>
        <Typography ml={1} variant="body2" color="inherit">
          {label}
        </Typography>
      </Box>
    </Link>
  )
}
