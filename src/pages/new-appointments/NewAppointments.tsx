import React, { useState } from 'react';
import { 
  Box, Typography, Button, Chip, Card, CardContent, CardActions, 
  Dialog, DialogTitle, DialogContent, DialogActions, TextField,
  MenuItem, Grid, AppBar, Tabs, Tab,
  FormControl,
  InputLabel,
  Select,
  IconButton,
  Collapse
} from '@mui/material';
import { ExpandMore, ExpandLess } from '@mui/icons-material';
import { BaseLayoutPage } from '../../shared/layouts';

// Interfaces para tipagem
interface AppointmentInfo {
  type: string;
  description: string;
  scheduledDate?: string;
  completedDate?: string;
  observations?: string;
  usageDetails?: UsageDetails; // Nova propriedade para detalhes de uso
}

interface UsageDetails {
  motivo: string;
  descricaoUso: string;
  dataHoraDestino: string;
  dataFinal: string;
  localDestino: string;
  kmInicial: number;
  kmFinal: number;
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
  userEmail?: string;
  showDetails?: boolean; // Para controlar a exibição dos detalhes
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
    service: 'Visita Técnica',
    scheduledDate: '2025-01-15',
    scheduledTime: '09:00',
    status: 'Agendado',
    priority: 'Média',
    userEmail: 'maria@exemplo.com',
    appointmentInfo: {
      type: 'visita-tecnica',
      description: 'Visita técnica ao cliente XYZ',
      usageDetails: {
        motivo: 'Visita Técnica',
        descricaoUso: 'Manutenção preventiva no sistema do cliente',
        dataHoraDestino: '2025-01-15T09:00',
        dataFinal: '2025-01-15T17:00',
        localDestino: 'Av. Paulista, 1000 - São Paulo/SP',
        kmInicial: 12500,
        kmFinal: 12650
      }
    }
  },
  {
    id: 2,
    employeeName: 'Carlos Santos',
    employeeId: 'EMP002',
    service: 'Reunião Externa',
    scheduledDate: '2025-01-16',
    scheduledTime: '14:30',
    status: 'Concluído',
    priority: 'Alta',
    userEmail: 'carlos@exemplo.com',
    appointmentInfo: {
      type: 'reuniao-externa',
      description: 'Apresentação comercial para novo cliente',
      usageDetails: {
        motivo: 'Outros',
        descricaoUso: 'Apresentação do portfólio de serviços para potencial cliente',
        dataHoraDestino: '2025-01-16T14:30',
        dataFinal: '2025-01-16T16:00',
        localDestino: 'Rua Augusta, 500 - São Paulo/SP',
        kmInicial: 8900,
        kmFinal: 8950
      }
    }
  },
  {
    id: 3,
    employeeName: 'Ana Costa',
    employeeId: 'EMP003',
    service: 'Coleta de Documentos',
    scheduledDate: '2025-01-17',
    scheduledTime: '10:15',
    status: 'Em Andamento',
    priority: 'Baixa',
    userEmail: 'ana@exemplo.com',
    appointmentInfo: {
      type: 'coleta-documentos',
      description: 'Coleta de documentos em cartório',
      usageDetails: {
        motivo: 'Outros',
        descricaoUso: 'Coleta de documentos jurídicos no cartório central',
        dataHoraDestino: '2025-01-17T10:15',
        dataFinal: '2025-01-17T12:00',
        localDestino: 'Fórum Central - Centro, São Paulo/SP',
        kmInicial: 10200,
        kmFinal: 10280
      }
    }
  },
  {
    id: 4,
    employeeName: 'João Silva',
    employeeId: 'EMP004',
    service: 'Visita Técnica',
    scheduledDate: '2025-01-18',
    scheduledTime: '11:00',
    status: 'Agendado',
    priority: 'Alta',
    userEmail: 'usuario@exemplo.com',
    appointmentInfo: {
      type: 'visita-tecnica',
      description: 'Instalação de equipamentos no cliente ABC',
      usageDetails: {
        motivo: 'Visita Técnica',
        descricaoUso: 'Instalação e configuração de servidores',
        dataHoraDestino: '2025-01-18T11:00',
        dataFinal: '2025-01-18T18:00',
        localDestino: 'Av. Faria Lima, 1500 - São Paulo/SP',
        kmInicial: 0,
        kmFinal: 0
      }
    }
  }
];

// Email do usuário logado
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

// Função para formatar data e hora
const formatDateTime = (dateTimeString: string): string => {
  if (!dateTimeString) return '';
  const date = new Date(dateTimeString);
  return date.toLocaleString('pt-BR');
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
  
  // Estados para o formulário de motivo
  const [motivo, setMotivo] = useState('');
  const [outroMotivo, setOutroMotivo] = useState('');
  const [descricaoUso, setDescricaoUso] = useState('');
  const [dataHoraDestino, setDataHoraDestino] = useState('');
  const [dataFinal, setDataFinal] = useState('');
  const [localDestino, setLocalDestino] = useState('');
  const [kmInicial, setKmInicial] = useState<number>(0);
  const [kmFinal, setKmFinal] = useState<number>(0);

  // Filtrar agendamentos pelo email do usuário logado
  const myAppointments = appointments.filter(a => a.userEmail === loggedInUserEmail);
  const otherAppointments = appointments.filter(a => a.userEmail !== loggedInUserEmail);

  // Contadores para as abas
  const myActiveCount = myAppointments.filter(a => a.status === 'Agendado' || a.status === 'Em Andamento').length;
  const myHistoryCount = myAppointments.filter(a => a.status === 'Concluído' || a.status === 'Cancelado').length;
  const otherActiveCount = otherAppointments.filter(a => a.status === 'Agendado' || a.status === 'Em Andamento').length;

  // Funções para abrir/fechar diálogos
  const handleEditOpen = (appointment: Appointment) => {
    setEditingAppointment({...appointment});
    // Preencher os campos do formulário se existirem dados
    if (appointment.appointmentInfo?.usageDetails) {
      const details = appointment.appointmentInfo.usageDetails;
      setMotivo(details.motivo);
      setOutroMotivo(details.motivo === 'Outros' ? details.descricaoUso : '');
      setDescricaoUso(details.descricaoUso);
      setDataHoraDestino(details.dataHoraDestino);
      setDataFinal(details.dataFinal);
      setLocalDestino(details.localDestino);
      setKmInicial(details.kmInicial);
      setKmFinal(details.kmFinal);
    }
  };

  const handleEditClose = () => {
    setEditingAppointment(null);
    // Limpar os campos do formulário
    setMotivo('');
    setOutroMotivo('');
    setDescricaoUso('');
    setDataHoraDestino('');
    setDataFinal('');
    setLocalDestino('');
    setKmInicial(0);
    setKmFinal(0);
  };
  

  // Função para alternar a exibição de detalhes
  const toggleDetails = (appointmentId: number) => {
    setAppointments(appointments.map(a => 
      a.id === appointmentId 
        ? { ...a, showDetails: !a.showDetails } 
        : a
    ));
  };

  // Função para salvar edição
  const handleSaveEdit = () => {
    if (editingAppointment) {
      const motivoFinal = motivo === 'Outros' ? outroMotivo : motivo;
      
      const updatedAppointment = {
        ...editingAppointment,
        userEmail: editingAppointment.userEmail || loggedInUserEmail,
        appointmentInfo: {
          ...editingAppointment.appointmentInfo,
          type: motivoFinal.toLowerCase().replace(' ', '-'),
          description: descricaoUso,
          usageDetails: {
            motivo: motivoFinal,
            descricaoUso,
            dataHoraDestino,
            dataFinal,
            localDestino,
            kmInicial,
            kmFinal
          }
        }
      };
      
      setAppointments(appointments.map(a => 
        a.id === updatedAppointment.id ? updatedAppointment : a
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
              ...a.appointmentInfo,
              type: a.service.toLowerCase(),
              description: observations || 'Atendimento concluído com sucesso',
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
      service: 'Visita Técnica', // Valor padrão
      scheduledDate: new Date().toISOString().split('T')[0],
      scheduledTime: '09:00',
      status: 'Agendado',
      priority: 'Média',
      userEmail: loggedInUserEmail,
      showDetails: false
    };
    setEditingAppointment(newAppointmentData);
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

  // Função para renderizar seção de agendamentos
  const renderAppointmentSection = (title: string, appointments: Appointment[], showActions: boolean = true) => (
    <Box mb={4}>
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: '#333' }}>
        {title}
      </Typography>
      {appointments.length === 0 ? (
        <Box sx={{ 
          textAlign: 'center', 
          py: 4, 
          color: 'text.secondary',
          backgroundColor: '#f8f9fa',
          borderRadius: 2,
          border: '1px dashed #ddd'
        }}>
          <Typography>Nenhum agendamento encontrado</Typography>
        </Box>
      ) : (
        <Box display="flex" flexWrap="wrap" gap={2}>
          {appointments.map((appointment) => (
            <Card key={appointment.id} sx={{ 
              width: 350, 
              borderRadius: 2, 
              boxShadow: '0px 2px 8px rgba(0,0,0,0.1)',
              border: appointment.status === 'Em Andamento' ? '2px solid #ff9800' : '1px solid #e0e0e0',
              opacity: appointment.status === 'Concluído' || appointment.status === 'Cancelado' ? 0.8 : 1
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
                    <Typography variant="body2" color="text.secondary" fontSize="0.7rem" sx={{ fontStyle: 'italic' }}>
                      Criado por: {appointment.userEmail === loggedInUserEmail ? 'Você' : appointment.userEmail}
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
                  {appointment.appointmentInfo?.usageDetails && (
                    <Typography variant="body2"><strong>Motivo:</strong> {appointment.appointmentInfo.usageDetails.motivo}</Typography>
                  )}
                </Box>

                {/* Botão para expandir detalhes */}
                {appointment.appointmentInfo?.usageDetails && (
                  <Box sx={{ textAlign: 'center', my: 1 }}>
                    <Button 
                      size="small" 
                      endIcon={appointment.showDetails ? <ExpandLess /> : <ExpandMore />}
                      onClick={() => toggleDetails(appointment.id)}
                      sx={{ color: '#07a8f3' }}
                    >
                      {appointment.showDetails ? 'Menos Detalhes' : 'Mais Detalhes'}
                    </Button>
                  </Box>
                )}

                {/* Detalhes expandidos */}
                {appointment.appointmentInfo?.usageDetails && appointment.showDetails && (
                  <Collapse in={appointment.showDetails}>
                    <Box sx={{ 
                      backgroundColor: '#f8f9fa', 
                      p: 2, 
                      borderRadius: 1,
                      border: '1px solid #e0e0e0',
                      mt: 1
                    }}>
                      <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                        Detalhes do Uso:
                      </Typography>
                      <Typography variant="body2" gutterBottom>
                        <strong>Descrição:</strong> {appointment.appointmentInfo.usageDetails.descricaoUso}
                      </Typography>
                      <Typography variant="body2" gutterBottom>
                        <strong>Local:</strong> {appointment.appointmentInfo.usageDetails.localDestino}
                      </Typography>
                      <Typography variant="body2" gutterBottom>
                        <strong>Data/Hora Destino:</strong> {formatDateTime(appointment.appointmentInfo.usageDetails.dataHoraDestino)}
                      </Typography>
                      <Typography variant="body2" gutterBottom>
                        <strong>Data Final:</strong> {formatDateTime(appointment.appointmentInfo.usageDetails.dataFinal)}
                      </Typography>
                      <Typography variant="body2">
                        <strong>KM:</strong> {appointment.appointmentInfo.usageDetails.kmInicial} - {appointment.appointmentInfo.usageDetails.kmFinal} 
                        {appointment.appointmentInfo.usageDetails.kmFinal > 0 && 
                          ` (Total: ${appointment.appointmentInfo.usageDetails.kmFinal - appointment.appointmentInfo.usageDetails.kmInicial} km)`}
                      </Typography>
                    </Box>
                  </Collapse>
                )}

                {/* Informações de Atendimento */}
                {appointment.appointmentInfo && !appointment.appointmentInfo.usageDetails && (
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
              {showActions && (
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
              )}
            </Card>
          ))}
        </Box>
      )}
    </Box>
  );

  return (
    <BaseLayoutPage>
      <Box display="flex" flexDirection="column" gap={3}>
        
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
              }, 
            }}
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
            <Tab label={`Meus Agendamentos (${myActiveCount + myHistoryCount})`} />
            <Tab label={`Outros Agendamentos (${otherActiveCount})`} />
          </Tabs>
        </AppBar>

        {/* Conteúdo baseado na aba selecionada */}
        {tabValue === 0 ? (
          // Meus Agendamentos
          <>
            {renderAppointmentSection(
              `Meus Agendamentos Ativos (${myActiveCount})`, 
              myAppointments.filter(a => a.status === 'Agendado' || a.status === 'Em Andamento'),
              true
            )}
            {renderAppointmentSection(
              `Meu Histórico (${myHistoryCount})`, 
              myAppointments.filter(a => a.status === 'Concluído' || a.status === 'Cancelado'),
              false
            )}
          </>
        ) : (
          // Agendamentos de Outros Usuários
          <>
            {renderAppointmentSection(
              `Agendamentos Ativos de Outros Usuários (${otherActiveCount})`, 
              otherAppointments.filter(a => a.status === 'Agendado' || a.status === 'Em Andamento'),
              true
            )}
          </>
        )}
           

        {/* Diálogo de Edição */}
        <Dialog open={Boolean(editingAppointment)} onClose={handleEditClose} maxWidth="md" fullWidth>
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

              {/* Campo de Motivo */}
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Motivo</InputLabel>
                  <Select 
                    value={motivo} 
                    onChange={(e) => setMotivo(e.target.value)}
                    label="Motivo"
                  >
                    <MenuItem value="Visita Técnica">Visita Técnica</MenuItem>
                    <MenuItem value="Outros">Outros</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {/* Campo para descrever o motivo se for "Outros" */}
              {motivo === "Outros" && (
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Descreva o motivo"
                    value={outroMotivo}
                    onChange={(e) => setOutroMotivo(e.target.value)}
                  />
                </Grid>
              )}

              {/* Descrição do Uso */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Descrição do Uso"
                  multiline
                  rows={3}
                  value={descricaoUso}
                  onChange={(e) => setDescricaoUso(e.target.value)}
                  placeholder="Descreva em detalhes para que será usado..."
                />
              </Grid>

              {/* Data/Hora e Local de Destino */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Data e Hora do Destino"
                  type="datetime-local"
                  InputLabelProps={{ shrink: true }}
                  value={dataHoraDestino}
                  onChange={(e) => setDataHoraDestino(e.target.value)}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Data Final"
                  type="datetime-local"
                  InputLabelProps={{ shrink: true }}
                  value={dataFinal}
                  onChange={(e) => setDataFinal(e.target.value)}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Local de Destino"
                  value={localDestino}
                  onChange={(e) => setLocalDestino(e.target.value)}
                  placeholder="Endereço completo do destino..."
                />
              </Grid>

              {/* KM Inicial e Final */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="KM Inicial do Veículo"
                  type="number"
                  value={kmInicial}
                  onChange={(e) => setKmInicial(Number(e.target.value))}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="KM Final do Veículo"
                  type="number"
                  value={kmFinal}
                  onChange={(e) => setKmFinal(Number(e.target.value))}
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