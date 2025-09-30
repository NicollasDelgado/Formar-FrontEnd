import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, Button, Card, CardContent, TextField,
  Grid,
  Alert, Snackbar, Avatar, Chip, Divider
} from '@mui/material';
import { 
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import { BaseLayoutPage } from '../../shared/layouts';

// Interfaces para tipagem
interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'user';
  phone?: string;
  createdAt: string;
  lastLogin?: string;
}

interface UpdateUserData {
  name: string;
  email: string;
  phone: string;
}

// Mock data do usuário atual
const currentUser: User = {
  id: 1,
  name: 'João Silva',
  email: 'joao.silva@institutoformar.com',
  role: 'user',
  phone: '(11) 99999-9999',
  createdAt: '15/03/2024',
  lastLogin: '01/04/2024 14:30'
};

const UpdateUsers: React.FC = () => {
  const [user, setUser] = useState<User>(currentUser);
  const [editMode, setEditMode] = useState(false);
  const [userData, setUserData] = useState<UpdateUserData>({
    name: user.name,
    email: user.email,
    phone: user.phone || '',
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error'
  });

  useEffect(() => {
    setUserData({
      name: user.name,
      email: user.email,
      phone: user.phone || '',
    });
  }, [user]);

  const handleInputChange = (field: keyof UpdateUserData, value: string) => {
    setUserData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    if (!userData.name.trim() || !userData.email.trim()) {
      setSnackbar({
        open: true,
        message: 'Nome e email são obrigatórios',
        severity: 'error'
      });
      return;
    }

    const updatedUser: User = {
      ...user,
      name: userData.name,
      email: userData.email,
      phone: userData.phone
    };

    setUser(updatedUser);
    setEditMode(false);
    
    setSnackbar({
      open: true,
      message: 'Dados atualizados com sucesso!',
      severity: 'success'
    });
  };

  const handleCancel = () => {
    setUserData({
      name: user.name,
      email: user.email,
      phone: user.phone || '',
    });
    setEditMode(false);
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  return (
    <BaseLayoutPage>
      <Box display="flex" flexDirection="column" gap={3}>
        
        {/* Header */}
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="h4" fontWeight="bold">Minha Conta</Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Gerencie suas informações pessoais
            </Typography>
          </Box>
          <Button 
            variant={editMode ? "outlined" : "contained"}
            startIcon={editMode ? <CancelIcon /> : <EditIcon />}
            onClick={editMode ? handleCancel : () => setEditMode(true)}
            sx={{ 
              backgroundColor: editMode ? 'transparent' : '#07a8f3ff',
              borderColor: '#07a8f3ff',
              color: editMode ? '#07a8f3ff' : 'white',
              '&:hover': {
                backgroundColor: editMode ? 'rgba(7, 168, 243, 0.04)' : '#0595d6',
                transform: 'scale(1.02)',
              },
            }}
          >
            {editMode ? 'Cancelar' : 'Editar Perfil'}
          </Button>
        </Box>

        <Grid container spacing={3}>
          {/* Coluna da Esquerda - Informações Pessoais */}
          <Grid item xs={12} md={8}>
            <Card sx={{ borderRadius: 2, boxShadow: '0px 2px 8px rgba(0,0,0,0.1)' }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PersonIcon />
                  Informações Pessoais
                </Typography>
                <Divider sx={{ my: 2 }} />

                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Nome Completo"
                      value={userData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      disabled={!editMode}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Email"
                      type="email"
                      value={userData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      disabled={!editMode}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid> 

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Telefone"
                      value={userData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      disabled={!editMode}
                      InputLabelProps={{ shrink: true }}
                      placeholder="(11) 99999-9999"
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          
          {/* Coluna da Direita - Apenas Avatar */}
          <Grid item xs={12} md={4}>
            {/* Card do Avatar */}
            <Card sx={{ borderRadius: 2, boxShadow: '0px 2px 8px rgba(0,0,0,0.1)' }}>
              <CardContent sx={{ p: 3, textAlign: 'center' }}>
                <Avatar
                  sx={{
                    width: 100,
                    height: 100,
                    mx: 'auto',
                    mb: 2,
                    bgcolor: '#07a8f3ff',
                    fontSize: '2rem'
                  }}
                >
                  {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                </Avatar>
                
                <Typography variant="h6" fontWeight="bold">
                  {user.name}
                </Typography>
                
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {user.email}
                </Typography>

                <Chip 
                  label={user.role === 'admin' ? 'Administrador' : 'Usuário'} 
                  sx={{ 
                    bgcolor: user.role === 'admin' ? '#f4c430' : '#07a8f3ff',
                    color: 'white',
                    fontWeight: 'bold',
                    mt: 1
                  }} 
                />
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Botão Salvar - Só aparece no modo edição */}
        {editMode && (
          <Box display="flex" justifyContent="flex-end" sx={{ mt: 2, paddingRight: 11 }}>
            <Button
              variant="contained"
              startIcon={<SaveIcon />}
              onClick={handleSave}
              sx={{
                backgroundColor: '#4caf50',
                '&:hover': {
                  backgroundColor: '#45a049',
                  transform: 'scale(1.02)',
                },
                px: 4,
                py: 1
              }}
            >
              Salvar Alterações
            </Button>
          </Box>
        )}
      </Box>

      {/* Snackbar para feedback */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </BaseLayoutPage>
  );
};

export { UpdateUsers };