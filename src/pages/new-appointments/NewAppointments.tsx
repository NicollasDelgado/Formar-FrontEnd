import React, { useState } from 'react';
import { 
  Box, Typography, Button, Chip, Card, CardContent, CardActions, 
  Dialog, DialogTitle, DialogContent, DialogActions, TextField,
  MenuItem, Grid, AppBar, Tabs, Tab
} from '@mui/material';
import { BaseLayoutPage } from '../../shared/layouts';

// Interfaces para tipagem
interface AppointmentInfo {
  type: string;
  description: string;
  scheduledDate?: string;
  completedDate?: string;
  observations?: string;
}

interface Appointment {
  id: number;
  employeeName: string;
  employeeId: string;
  service: string;
  scheduledDate: string;
  scheduledTime: string;
  status: 'Agendado' | 'Em Andamento' | 'Concluído' | 'Cancelado';
  priority: 'Baixa' | 'Média' | 'Alta';
  appointmentInfo?: AppointmentInfo;
}

interface NewAppointment {
  employeeName: string;
  employeeId: string;
  service: string;
  scheduledDate: string;
  scheduledTime: string;
  priority: 'Baixa' | 'Média' | 'Alta';
  observations: string;
}

// Mock data - Dados iniciais dos agendamentos
const initialAppointments: Appointment[] = [
  {
    id: 1,
    employeeName: 'Maria Oliveira',
    employeeId: 'EMP001',
    service: 'Consulta Médica',
    scheduledDate: '2025-01-15',
    scheduledTime: '09:00',
    status: 'Agendado',
    priority: 'Média'
  },
  {
    id: 2,
    employeeName: 'Carlos Santos',
    employeeId: 'EMP002',
    service: 'Exame Admissional',
    scheduledDate: '2025-01-16',
    scheduledTime: '14:30',
    status: 'Concluído',
    priority: 'Alta',
    appointmentInfo: {
      type: 'admissional',
      description: 'Exame admissional completo - apto para função',
      scheduledDate: '2025-01-16',
      completedDate: '2025-01-16',
      observations: 'Funcionário aprovado para admissão'
    }
  },
  {
    id: 3,
    employeeName: 'Ana Costa',
    employeeId: 'EMP003',
    service: 'Consulta Psicológica',
    scheduledDate: '2025-01-17',
    scheduledTime: '10:15',
    status: 'Em Andamento',
    priority: 'Baixa'
  }
];

// Email do usuário logado (pode ser alterado dinamicamente)
const loggedInUserEmail = 'usuario@exemplo.com';

// Função para formatar data no padrão brasileiro
const formatDateToBrazilian = (date: Date): string => {
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

// Função para formatar data de string para padrão brasileiro
const formatDateStringToBrazilian = (dateString: string): string => {
  if (!dateString) return '';
  const date = new Date(dateString + 'T00:00:00');
  return formatDateToBrazilian(date);
};

// Função para capitalizar primeira letra
const capitalizeFirst = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

// Componente principal
export const NewAppointments: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [progressAppointment, setProgressAppointment] = useState<Appointment | null>(null);
  const [newAppointment, setNewAppointment] = useState<NewAppointment>({
    employeeName: '',
    employeeId: '',
    service: '',
    scheduledDate: '',
    scheduledTime: '',
    priority: 'Média',
    observations: ''
  });
  const [tabValue, setTabValue] = useState(0);

  // Filtrar agendamentos do usuário logado e de outros usuários
  const myAppointments = appointments.filter(a => a.employeeName.toLowerCase().includes(loggedInUserEmail.split('@')[0]));
  const otherAppointments = appointments.filter(a => !a.employeeName.toLowerCase().includes(loggedInUserEmail.split('@')[0]));

  // Contadores para as abas
  const myScheduledCount = myAppointments.filter(a => a.status === 'Agendado' || a.status === 'Em Andamento').length;
  const otherScheduledCount = otherAppointments.filter(a => a.status === 'Agendado' || a.status === 'Em Andamento').length;

  // Funções para abrir/fechar diálogos
  const handleEditOpen = (appointment: Appointment) => setEditingAppointment({...appointment});
  const handleEditClose = () => setEditingAppointment(null);
  
  const handleProgressOpen = (appointment: Appointment) => setProgressAppointment(appointment);
  const handleProgressClose = () => {
    setProgressAppointment(null);
  };

  // Função para salvar edição
  const handleSaveEdit = () => {
    if (editingAppointment) {
      setAppointments(appointments.map(a => 
        a.id === editingAppointment.id ? editingAppointment : a
      ));
      handleEditClose();
    }
  };

  // Função para iniciar atendimento
  const handleStartAppointment = (appointmentId: number) => {
    setAppointments(appointments.map(a => 
      a.id === appointmentId 
        ? { 
            ...a, 
            status: 'Em Andamento'
          } 
        : a
    ));
  };

  // Função para finalizar agendamento
  const handleFinishAppointment = (appointmentId: number, observations?: string) => {
    setAppointments(appointments.map(a => 
      a.id === appointmentId 
        ? { 
            ...a, 
            status: 'Concluído',
            appointmentInfo: {
              type: a.service.toLowerCase(),
              description: observations || 'Atendimento concluído',
              scheduledDate: a.scheduledDate,
              completedDate: formatDateToBrazilian(new Date()),
              observations: observations
            }
          } 
        : a
    ));
  };

  // Função para cancelar agendamento
  const handleCancelAppointment = (appointmentId: number) => {
    setAppointments(appointments.map(a => 
      a.id === appointmentId 
        ? { 
            ...a, 
            status: 'Cancelado'
          } 
        : a
    ));
  };

  // Função para excluir agendamento
  const handleDeleteAppointment = (appointmentId: number) => {
    setAppointments(appointments.filter(a => a.id !== appointmentId));
  };

  // Função para adicionar novo agendamento
  const handleAddNewAppointment = () => {
    const newAppointmentData: Appointment = {
      id: Math.max(...appointments.map(a => a.id)) + 1,
      employeeName: '',
      employeeId: '',
      service: '',
      scheduledDate: '',
      scheduledTime: '',
      status: 'Agendado',
      priority: 'Média'
    };
    setAppointments([...appointments, newAppointmentData]);
    handleEditOpen(newAppointmentData);
  };

  // Função para lidar com mudanças nos campos de edição
  const handleEditChange = (field: keyof Appointment, value: string) => {
    if (editingAppointment) {
      setEditingAppointment({
        ...editingAppointment,
        [field]: value
      });
    }
  };

  // Função para mudar a aba
  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Função para obter cor do status
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Agendado': return '#2196f3';
      case 'Em Andamento': return '#ff9800';
      case 'Concluído': return '#4caf50';
      case 'Cancelado': return '#f44336';
      default: return '#757575';
    }
  };

  // Obter agendamentos baseado na aba selecionada
  const getAppointmentsForTab = () => {
    if (tabValue === 0) {
      // Meus Agendamentos (ativos)
      return myAppointments.filter(a => a.status === 'Agendado' || a.status === 'Em Andamento');
    } else {
      // Outros agendamentos (histórico)
      return otherAppointments.filter(a => a.status === 'Concluído' || a.status === 'Cancelado');
    }
  };

  return (
    <BaseLayoutPage>
      <Box display="flex" flexDirection="column" gap={2}>
        
        {/* Header */}
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="h4" fontWeight="bold">Agendamentos</Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Gerencie os agendamentos do Instituto Formar
            </Typography>
          </Box>
          <Button 
            variant="contained" 
            sx={{ 
              backgroundColor: '#07a8f3ff',
                '&:hover': {
                  backgroundColor: '#f4c430',
                  transform: 'scale(1.02)',
                }, }}
              onClick={handleAddNewAppointment}
          >
            + Novo Agendamento
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
            <Tab label={`Meus Agendamentos (${myScheduledCount})`} />
            <Tab label={`Outros Agendamentos (${otherScheduledCount})`} />
          </Tabs>
        </AppBar>

        {/* Cards baseado na aba selecionada */}
        <Box display="flex" flexWrap="wrap" gap={2}>
          {getAppointmentsForTab().map((appointment) => (
            <Card key={appointment.id} sx={{ 
              width: 320, 
              borderRadius: 2, 
              boxShadow: '0px 2px 8px rgba(0,0,0,0.1)',
              border: appointment.status === 'Em Andamento' ? '1px solid #ff9800' : '1px solid #e0e0e0'
            }}>
              <CardContent>
                {/* Header do Card */}
                <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
                  <Box>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      {appointment.employeeName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      ID: {appointment.employeeId}
                    </Typography>
                  </Box>
                  <Chip 
                    label={appointment.status} 
                    sx={{ 
                      bgcolor: getStatusColor(appointment.status), 
                      color: 'white', 
                      fontWeight: 'bold',
                      fontSize: '0.7rem',
                      minWidth: 80
                    }} 
                  />
                </Box>

                {/* Informações Básicas */}
                <Box mb={1}>
                  <Typography variant="body2"><strong>Serviço:</strong> {appointment.service}</Typography>
                  <Typography variant="body2"><strong>Data:</strong> {formatDateStringToBrazilian(appointment.scheduledDate)}</Typography>
                  <Typography variant="body2"><strong>Horário:</strong> {appointment.scheduledTime}</Typography>
                </Box>

                {/* Informações de Atendimento (APENAS para agendamentos concluídos/em andamento) */}
                {appointment.appointmentInfo && (
                  <Box sx={{ 
                    backgroundColor: '#f0f8ff', 
                    p: 1.5, 
                    borderRadius: 1,
                    border: '1px solid #2196f330'
                  }}>
                    {appointment.appointmentInfo.completedDate && (
                      <Typography variant="body2" gutterBottom>
                        <strong>Concluído em:</strong> {appointment.appointmentInfo.completedDate}
                      </Typography>
                    )}
                    <Typography variant="body2" sx={{ wordBreak: 'break-word' }}>
                      <strong>Observações:</strong> {appointment.appointmentInfo.observations || appointment.appointmentInfo.description}
                    </Typography>
                  </Box>
                )}
              </CardContent>

              {/* Botões de Ação */}
              <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                <Button 
                  size="small" 
                  variant="outlined" 
                  sx={{ 
                    borderColor: '#4dd0ff', 
                    color: '#4dd0ff',
                    fontSize: '0.75rem',
                    px: 1
                  }}
                  onClick={() => handleEditOpen(appointment)}
                >
                  Editar
                </Button>
                
                {appointment.status === 'Agendado' ? (
                  <Button 
                    size="small" 
                    variant="outlined" 
                    sx={{ 
                      borderColor: '#ff9800', 
                      color: '#ff9800',
                      fontSize: '0.75rem',
                      px: 1
                    }}
                    onClick={() => handleStartAppointment(appointment.id)}
                  >
                    Iniciar
                  </Button>
                ) : appointment.status === 'Em Andamento' ? (
                  <Button 
                    size="small" 
                    variant="outlined" 
                    sx={{ 
                      borderColor: '#4caf50', 
                      color: '#4caf50',
                      fontSize: '0.75rem',
                      px: 1
                    }}
                    onClick={() => handleFinishAppointment(appointment.id, 'Atendimento concluído com sucesso')}
                  >
                    Finalizar
                  </Button>
                ) : (
                  <Button 
                    size="small" 
                    variant="outlined" 
                    sx={{ 
                      borderColor: '#757575', 
                      color: '#757575',
                      fontSize: '0.75rem',
                      px: 1
                    }}
                    disabled
                  >
                    {appointment.status}
                  </Button>
                )}
                
                <Button 
                  size="small" 
                  variant="outlined" 
                  sx={{ 
                    borderColor: '#f44336', 
                    color: '#f44336',
                    fontSize: '0.75rem',
                    px: 1
                  }}
                  onClick={() => appointment.status === 'Agendado' ? 
                    handleCancelAppointment(appointment.id) : 
                    handleDeleteAppointment(appointment.id)}
                >
                  {appointment.status === 'Agendado' ? 'Cancelar' : 'Excluir'}
                </Button>
              </CardActions>
            </Card>
          ))}
        </Box>

        {/* Diálogo de Edição */}
        <Dialog open={Boolean(editingAppointment)} onClose={handleEditClose} maxWidth="sm" fullWidth>
          <DialogTitle>
            {editingAppointment?.employeeName ? 'Editar Agendamento' : 'Novo Agendamento'}
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Nome do Funcionário"
                  value={editingAppointment?.employeeName || ''}
                  onChange={(e) => handleEditChange('employeeName', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="ID do Funcionário"
                  value={editingAppointment?.employeeId || ''}
                  onChange={(e) => handleEditChange('employeeId', e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  select
                  label="Serviço"
                  value={editingAppointment?.service || ''}
                  onChange={(e) => handleEditChange('service', e.target.value)}
                >
                  <MenuItem value="Consulta Médica">Consulta Médica</MenuItem>
                  <MenuItem value="Exame Admissional">Exame Admissional</MenuItem>
                  <MenuItem value="Exame Periódico">Exame Periódico</MenuItem>
                  <MenuItem value="Consulta Psicológica">Consulta Psicológica</MenuItem>
                  <MenuItem value="Fisioterapia">Fisioterapia</MenuItem>
                  <MenuItem value="Exames Laboratoriais">Exames Laboratoriais</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Data do Agendamento"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  value={editingAppointment?.scheduledDate || ''}
                  onChange={(e) => handleEditChange('scheduledDate', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Horário"
                  type="time"
                  InputLabelProps={{ shrink: true }}
                  value={editingAppointment?.scheduledTime || ''}
                  onChange={(e) => handleEditChange('scheduledTime', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  select
                  label="Status"
                  value={editingAppointment?.status || 'Agendado'}
                  onChange={(e) => handleEditChange('status', e.target.value)}
                >
                  <MenuItem value="Agendado">Agendado</MenuItem>
                  <MenuItem value="Em Andamento">Em Andamento</MenuItem>
                  <MenuItem value="Concluído">Concluído</MenuItem>
                  <MenuItem value="Cancelado">Cancelado</MenuItem>
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
      </Box>
    </BaseLayoutPage>
  );
};