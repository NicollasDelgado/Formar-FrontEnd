import { Box } from '@mui/material'
import { BaseLayoutPage } from '../../shared/layouts'
import CustomDataGrid from '../../shared/components/data-grid'

const columns = [
  { field: 'id', headerName: 'ID', width: 90 },
  { field: 'plate', headerName: 'Placa', width: 150 },
  { field: 'model', headerName: 'Modelo', width: 200 },
  { field: 'brand', headerName: 'Marca', width: 150 },
  { field: 'year', headerName: 'Ano', width: 100 },
]

const rows = [
  {
    id: 1,
    plate: 'ABC-1234',
    model: 'Civic',
    brand: 'Honda',
    year: 2020,
  },
  {
    id: 2,
    plate: 'XYZ-5678',
    model: 'Corolla',
    brand: 'Toyota',
    year: 2019,
  },
  {
    id: 3,
    plate: 'LMN-9012',
    model: 'Onix',
    brand: 'Chevrolet',
    year: 2022,
  },
]

export const Vehicles: React.FC = () => {
  return (
    <BaseLayoutPage>
      <Box>
        <h1>Veículos</h1>
        <CustomDataGrid key="vehicles-grid" columns={columns} rows={rows} />
      </Box>
    </BaseLayoutPage>
  )
}
