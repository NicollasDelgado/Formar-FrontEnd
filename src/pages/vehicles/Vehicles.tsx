import React, { useState } from 'react';
import { 
  Box, Typography, Button, Chip, Card, CardContent, CardActions, 
  Dialog, DialogTitle, DialogContent, DialogActions, TextField,
  MenuItem, Grid, Divider, AppBar, Tabs, Tab
} from '@mui/material';
import { BaseLayoutPage } from '../../shared/layouts';

// Interfaces para tipagem
interface MaintenanceInfo {
  type: string;
  description: string;
  start?: string;
  end?: string;
  cost?: string;
}

interface Vehicle {
  id: number;
  plate: string;
  brand: string;
  model: string;
  year: number;
  registeredAt: string;
  status: 'Ativo' | 'Manutenção' | 'Inativo';
  condition: string;
  maintenance?: MaintenanceInfo;
}

interface NewMaintenance {
  type: string;
  description: string;
  estimatedCompletion: string;
  estimatedCost: string;
}

// Mock data
const initialVehicles: Vehicle[] = [
  {
    id: 1,
    plate: 'ABC-1234',
    brand: 'Toyota',
    model: 'Corolla',
    year: 2020,
    registeredAt: '31/12/2023',
    status: 'Ativo',
    condition: 'Operacional',
  },
  {
    id: 2,
    plate: 'DEF-5678',
    brand: 'Honda',
    model: 'Civic',
    year: 2019,
    registeredAt: '01/01/2024',
    status: 'Ativo',
    condition: 'Operacional',
  },
  {
    id: 3,
    plate: 'GHI-9012',
    brand: 'Chevrolet',
    model: 'Onix',
    year: 2021,
    registeredAt: '15/01/2024',
    status: 'Manutenção',
    condition: 'Preventiva',
    maintenance: {
      type: 'Preventiva',
      description: 'Revisão dos 20.000 km - troca de óleo, filtros e verificação geral',
      start: '15/01/2024',
      end: '17/01/2024',
      cost: '450,00'
    }
  }
];

// Função para formatar data no padrão brasileiro
const formatDateToBrazilian = (date: Date): string => {
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};


// Componente principal
export const Vehicles: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>(initialVehicles);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [maintenanceVehicle, setMaintenanceVehicle] = useState<Vehicle | null>(null);
  const [newMaintenance, setNewMaintenance] = useState<NewMaintenance>({
    type: '',
    description: '',
    estimatedCompletion: '',
    estimatedCost: '0,00'
  });
  const [tabValue, setTabValue] = useState(0);

  // Contadores para as abas
  const operationalCount = vehicles.filter(v => v.status === 'Ativo').length;
  const maintenanceCount = vehicles.filter(v => v.status === 'Manutenção').length;

  // Funções para abrir/fechar diálogos
  const handleEditOpen = (vehicle: Vehicle) => setEditingVehicle({...vehicle});
  const handleEditClose = () => setEditingVehicle(null);
  
  const handleMaintenanceOpen = (vehicle: Vehicle) => setMaintenanceVehicle(vehicle);
  const handleMaintenanceClose = () => {
    setMaintenanceVehicle(null);
    setNewMaintenance({
      type: '',
      description: '',
      estimatedCompletion: '',
      estimatedCost: '0,00'
    });
  };

  // Função para salvar edição
  const handleSaveEdit = () => {
    if (editingVehicle) {
      setVehicles(vehicles.map(v => 
        v.id === editingVehicle.id ? editingVehicle : v
      ));
      handleEditClose();
    }
  };

  // Função para enviar para manutenção
  const handleSendToMaintenance = () => {
    if (maintenanceVehicle && newMaintenance.type) {
      const formattedDate = newMaintenance.estimatedCompletion 
        ? formatDateToBrazilian(new Date(newMaintenance.estimatedCompletion))
        : '';
      
      setVehicles(vehicles.map(v => 
        v.id === maintenanceVehicle.id 
          ? { 
              ...v, 
              status: 'Manutenção',
              condition: newMaintenance.type,
              maintenance: {
                type: newMaintenance.type,
                description: newMaintenance.description,
                start: formatDateToBrazilian(new Date()),
                end: formattedDate,
                cost: newMaintenance.estimatedCost
              }
            } 
          : v
      ));
      handleMaintenanceClose();
    }
  };

  // Função para finalizar manutenção
  const handleFinishMaintenance = (vehicleId: number) => {
    setVehicles(vehicles.map(v => 
      v.id === vehicleId 
        ? { 
            ...v, 
            status: 'Ativo',
            condition: 'Operacional',
            maintenance: undefined
          } 
        : v
    ));
  };

  // Função para excluir veículo
  const handleDeleteVehicle = (vehicleId: number) => {
    setVehicles(vehicles.filter(v => v.id !== vehicleId));
  };

  // Função para adicionar novo veículo
  const handleAddNewVehicle = () => {
    const newVehicle: Vehicle = {
      id: Math.max(...vehicles.map(v => v.id)) + 1,
      plate: '',
      brand: '',
      model: '',
      year: new Date().getFullYear(),
      registeredAt: new Date().toLocaleDateString('pt-BR'),
      status: 'Ativo',
      condition: 'Operacional'
    };
    setVehicles([...vehicles, newVehicle]);
    handleEditOpen(newVehicle);
  };

  // Função para lidar com mudanças nos campos de edição
  const handleEditChange = (field: keyof Vehicle, value: string | number) => {
    if (editingVehicle) {
      setEditingVehicle({
        ...editingVehicle,
        [field]: value
      });
    }
  };

  // Função para lidar com mudanças nos campos de manutenção
  const handleMaintenanceChange = (field: keyof NewMaintenance, value: string) => {
    setNewMaintenance({
      ...newMaintenance,
      [field]: value
    });
  };

  // Função para mudar a aba
  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <BaseLayoutPage>
      <Box display="flex" flexDirection="column" gap={2}>
        
        {/* Header */}
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="h4" fontWeight="bold">Veículos</Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Gerencie a frota de veículos do Instituto Formar
            </Typography>
          </Box>
          <Button 
            variant="contained" 
            sx={{ bgcolor: '#4dd0ff', color: 'black', borderRadius: 2, px: 3 }}
            onClick={handleAddNewVehicle}
          >
            + Novo Veículo
          </Button>
        </Box>

        {/* Tabs */}
        <AppBar position="static" color="default" elevation={0} sx={{ borderRadius: 1 }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange}
            indicatorColor="primary"
            textColor="primary"
            variant="fullWidth"
          >
            <Tab label={`Veículos Operacionais (${operationalCount})`} />
            <Tab label={`Em Manutenção (${maintenanceCount})`} />
          </Tabs>
        </AppBar>

        {/* Cards baseado na aba selecionada */}
        <Box display="flex" flexWrap="wrap" gap={2}>
          {vehicles
            .filter(v => tabValue === 0 ? v.status === 'Ativo' : v.status === 'Manutenção')
            .map((vehicle) => (
              <Card key={vehicle.id} sx={{ width: 300, borderRadius: 2, boxShadow: 2 }}>
                <CardContent>
                  <Typography variant="h6" fontWeight="bold">
                    {vehicle.brand} {vehicle.model}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Placa: {vehicle.plate}
                  </Typography>

                  <Box display="flex" gap={1} my={1}>
                    <Chip 
                      label={vehicle.status} 
                      sx={{ 
                        bgcolor: vehicle.status === 'Ativo' ? '#4caf50' : '#ff9800', 
                        color: 'white', 
                        fontWeight: 'bold',
                        fontSize: '0.7rem'
                      }} 
                    />
                    <Chip 
                      label={vehicle.condition} 
                      sx={{ 
                        bgcolor: '#a5f3dc', 
                        color: 'black', 
                        fontWeight: 'bold',
                        fontSize: '0.7rem'
                      }} 
                    />
                  </Box>

                  <Typography variant="body2"><b>Ano:</b> {vehicle.year}</Typography>
                  <Typography variant="body2"><b>Cadastrado em:</b> {vehicle.registeredAt}</Typography>
                  
                  {vehicle.status === 'Manutenção' && vehicle.maintenance && (
                    <>
                      <Divider sx={{ my: 1 }} />
                      <Typography variant="body2"><b>Início:</b> {vehicle.maintenance.start}</Typography>
                      <Typography variant="body2"><b>Previsão:</b> {vehicle.maintenance.end}</Typography>
                      <Typography variant="body2" sx={{ wordBreak: 'break-word' }}>
                        <b>Descrição:</b> {vehicle.maintenance.description}
                      </Typography>
                      {vehicle.maintenance.cost && (
                        <Typography variant="body2"><b>Custo:</b> R$ {vehicle.maintenance.cost}</Typography>
                      )}
                    </>
                  )}
                </CardContent>

                <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                  <Button 
                    size="small" 
                    variant="outlined" 
                    sx={{ borderColor: '#4dd0ff', color: '#4dd0ff' }}
                    onClick={() => handleEditOpen(vehicle)}
                  >
                    Editar
                  </Button>
                  {vehicle.status === 'Ativo' ? (
                    <Button 
                      size="small" 
                      variant="outlined" 
                      sx={{ borderColor: '#ff9800', color: '#ff9800' }}
                      onClick={() => handleMaintenanceOpen(vehicle)}
                    >
                      Manutenção
                    </Button>
                  ) : (
                    <Button 
                      size="small" 
                      variant="outlined" 
                      sx={{ borderColor: '#4caf50', color: '#4caf50' }}
                      onClick={() => handleFinishMaintenance(vehicle.id)}
                    >
                      Finalizar
                    </Button>
                  )}
                  <Button 
                    size="small" 
                    variant="outlined" 
                    sx={{ borderColor: '#f44336', color: '#f44336' }}
                    onClick={() => handleDeleteVehicle(vehicle.id)}
                  >
                    Excluir
                  </Button>
                </CardActions>
              </Card>
            ))}
        </Box>

        {/* Diálogo de Edição */}
        <Dialog open={Boolean(editingVehicle)} onClose={handleEditClose} maxWidth="sm" fullWidth>
          <DialogTitle>
            {editingVehicle?.plate ? 'Editar Veículo' : 'Novo Veículo'}
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Placa"
                  value={editingVehicle?.plate || ''}
                  onChange={(e) => handleEditChange('plate', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Marca"
                  value={editingVehicle?.brand || ''}
                  onChange={(e) => handleEditChange('brand', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Modelo"
                  value={editingVehicle?.model || ''}
                  onChange={(e) => handleEditChange('model', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Ano"
                  type="number"
                  value={editingVehicle?.year || ''}
                  onChange={(e) => handleEditChange('year', parseInt(e.target.value) || 0)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Situação"
                  select
                  value={editingVehicle?.status || 'Ativo'}
                  onChange={(e) => handleEditChange('status', e.target.value as 'Ativo' | 'Manutenção' | 'Inativo')}
                >
                  <MenuItem value="Ativo">Ativo</MenuItem>
                  <MenuItem value="Manutenção">Manutenção</MenuItem>
                  <MenuItem value="Inativo">Inativo</MenuItem>
                </TextField>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleEditClose}>Cancelar</Button>
            <Button onClick={handleSaveEdit} variant="contained">
              Salvar
            </Button>
          </DialogActions>
        </Dialog>

        {/* Diálogo de Manutenção */}
        <Dialog open={Boolean(maintenanceVehicle)} onClose={handleMaintenanceClose} maxWidth="sm" fullWidth>
          <DialogTitle>
            Enviar para Manutenção
          </DialogTitle>
          <DialogContent>
            <Typography variant="body1" gutterBottom>
              Enviar {maintenanceVehicle?.brand} {maintenanceVehicle?.model} para manutenção.
            </Typography>
            
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  select
                  label="Tipo de Manutenção"
                  value={newMaintenance.type}
                  onChange={(e) => handleMaintenanceChange('type', e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  SelectProps={{
                    displayEmpty: true,
                    renderValue: newMaintenance.type !== "" ? undefined : () => "Selecione o tipo"
                  }}
                >
                  <MenuItem value="" disabled>
                    Selecione o tipo
                  </MenuItem>
                  <MenuItem value="Preventiva">Preventiva</MenuItem>
                  <MenuItem value="Corretiva">Corretiva</MenuItem>
                  <MenuItem value="Reparo">Reparo</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Descrição"
                  multiline
                  rows={3}
                  value={newMaintenance.description}
                  onChange={(e) => handleMaintenanceChange('description', e.target.value)}
                  placeholder="Descreva o serviço a ser realizado..."
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Previsão de Conclusão"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  value={newMaintenance.estimatedCompletion}
                  onChange={(e) => handleMaintenanceChange('estimatedCompletion', e.target.value)}
                  inputProps={{
                    placeholder: 'dd/mm/aaaa'
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Custo Estimado (R$)"
                  type="number"
                  value={newMaintenance.estimatedCost}
                  onChange={(e) => handleMaintenanceChange('estimatedCost', e.target.value)}
                  inputProps={{
                    step: "0.01",
                    min: "0"
                  }}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleMaintenanceClose}>Cancelar</Button>
            <Button 
              onClick={handleSendToMaintenance} 
              variant="contained"
              disabled={!newMaintenance.type}
            >
              Enviar para Manutenção
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </BaseLayoutPage>
  );
};