import CustomDataGrid from '../../shared/components/data-grid'
import { BaseLayoutPage } from '../../shared/layouts'

const columns = [
  { field: 'id', headerName: 'ID', width: 90 },
  { field: 'name', headerName: 'Nome', width: 200 },
  { field: 'email', headerName: 'Email', width: 250 },
  { field: 'role', headerName: 'Função', width: 150 },
]
// mock data
const rows = [
  {
    id: 1,
    name: 'João Silva',
    email: 'joao.silva@example.com',
    role: 'Administrador',
  },
  {
    id: 2,
    name: 'Maria Oliveira',
    email: 'maria.oliveira@example.com',
    role: 'Usuário',
  },
  {
    id: 3,
    name: 'Carlos Souza',
    email: 'carlos.souza@example.com',
    role: 'Moderador',
  },
]

export const User: React.FC = () => {
  return (
    <BaseLayoutPage>
      <h1>Usuários</h1>
      <CustomDataGrid key="user-grid" columns={columns} rows={rows} />
    </BaseLayoutPage>
  )
}
