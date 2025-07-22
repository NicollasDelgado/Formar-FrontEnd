import React from 'react'

import { Box } from '@mui/material'
import { BaseLayoutPage } from '../../shared/layouts'

export const Dashboard: React.FC = () => {
  return (
    <BaseLayoutPage>
      <Box width="100%" display="flex">
        <h1>Dashboard</h1>
      </Box>
    </BaseLayoutPage>
  )
}
