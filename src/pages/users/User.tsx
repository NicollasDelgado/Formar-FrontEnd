import { useState, useEffect } from 'react'
import CustomDataGrid from '../../shared/components/data-grid'
import { BaseLayoutPage } from '../../shared/layouts'
import { Box, Button, LinearProgress } from '@mui/material'

const columns = [
  { field: 'id', headerName: 'ID', width: 90 },
  { field: 'name', headerName: 'Nome', width: 200 },
  { field: 'email', headerName: 'Email', width: 250 },
  { field: 'role', headerName: 'Função', width: 150 },
]
  
export const User: React.FC = () => {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getUsers()
  }, [])

  const getUsers = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('http://localhost:3340')
      
      if (!response.ok) {
        throw new Error('Erro ao buscar usuários')
      }
      
      const data = await response.json()
      setRows(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
      console.error('Erro ao buscar usuários:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <BaseLayoutPage>
      <h1>Usuários</h1>
      
      {error && (
        <Box style={{ color: 'red', marginBottom: '1rem' }}>
          {error}
          <Button onClick={getUsers} size="small" variant="outlined" 
              sx={{ 
                 borderColor: '#f44336', 
                 color: '#f44336',
                fontSize: '0.75rem',
                ml: 2,
                 }}>
            Tentar novamente
          </Button>
        </Box>
      )}
      
      {loading && (
        <LinearProgress 
          sx={{ 
            background: 'transparent',
            width: 700,
            '& .MuiLinearProgress-bar': {
              background: 'linear-gradient(90deg, #07a8f3ff 50%, #ffee00 0%, #EC7FA8 100%)',
            },
            mb: 2
          }} 
        />
      )}

      {!loading && (
        <CustomDataGrid 
          key="user-grid" 
          columns={columns} 
          rows={rows}
        />
      )}
    </BaseLayoutPage>
  )
}