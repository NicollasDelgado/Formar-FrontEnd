import { Box } from '@mui/material'
import { BaseLayoutPage } from '../../shared/layouts'
import CustomDataGrid from '../../shared/components/data-grid'

export const NewAppointments: React.FC = () => {
  return (
    <BaseLayoutPage>
      <Box>
        <h1>NewAppointments</h1>
        <CustomDataGrid key={} columns={} rows={} />
      </Box>
    </BaseLayoutPage>
  )
}
