import { Box } from '@mui/material'
import { BaseLayoutPage } from '../../shared/layouts'
import CustomDataGrid from '../../shared/components/data-grid'

export const Vehicles: React.FC = () => {
  return (
    <BaseLayoutPage>
      <Box>
        <h1>Vehicles</h1>
        <CustomDataGrid key={} columns={} rows={} />
      </Box>
    </BaseLayoutPage>
  )
}
