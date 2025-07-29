import { Box, Typography, Link } from '@mui/material'
import { useNavigate } from 'react-router-dom'

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
  return (
    <Link onClick={() => navigate(link)} display="flex" alignItems="center">
      {/* Dashboard Button */}
      <Box
        display="flex"
        alignItems="center"
        px={1.5}
        py={1}
        borderRadius={2}
        sx={{
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.05)',
          },
        }}
      >
        {icon}{' '}
        <Typography ml={1} variant="body2">
          {label}
        </Typography>
      </Box>

      {/* Other buttons can be added here */}
    </Link>
  )
}
