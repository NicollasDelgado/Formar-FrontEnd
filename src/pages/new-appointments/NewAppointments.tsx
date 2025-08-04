import { Box } from '@mui/material'
import { BaseLayoutPage } from '../../shared/layouts'
import CustomDataGrid from '../../shared/components/data-grid'

// Definindo colunas do DataGrid
const columns = [
  { field: 'id', headerName: 'ID', width: 90 },
  { field: 'funcionário', headerName: 'Funcionário', width: 200 },
  { field: 'date', headerName: 'Data', width: 150 },
  { field: 'status', headerName: 'Status', width: 120 },
]

// Simulando alguns dados (você pode puxar isso de uma API depois)
const rows = [
  {
    id: 1,
    funcionário: 'Maria Oliveira',
    date: '2025-08-01',
    status: 'Agendado',
  },
  {
    id: 2,
    funcionário: 'Carlos Santos',
    date: '2025-08-02',
    status: 'Concluído',
  },
]

export const NewAppointments: React.FC = () => {
  return (
    <BaseLayoutPage>
      <Box>
        <h1>Agendamentos</h1>
        <CustomDataGrid key="appointments-grid" columns={columns} rows={rows} />
      </Box>
    </BaseLayoutPage>
  )
}
