import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Box, Card, CardContent, Typography, Button, IconButton, Grid, Avatar,
  Menu, MenuItem, ListItemIcon, ListItemText, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, Select, FormControl,
  InputLabel, MenuItem as SelectMenuItem, useTheme, useMediaQuery,
} from '@mui/material';
import {
  CalendarToday, Build, ChevronLeft, ChevronRight, Add,
  CameraAlt, PhotoCamera, Delete, Close,
} from '@mui/icons-material';
import { BaseLayoutPage } from '../../shared/layouts/BaseLayoutPage/BaseLayoutPage';
import { useAuth } from '../../shared/hooks/auth';

// Interfaces
interface DayObject {
  date: number;
  isCurrentMonth: boolean;
  isToday: boolean;
}

interface ScheduleFormData {
  vehicle: string;
  departureDateTime: string;
  returnDateTime: string;
  destination: string;
  reason: string;
}

interface Droplet {
  id: string;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  size: number;
  duration: number;
  delay: number;
  color: string;
}

// Funções auxiliares
const getInitials = (name: string): string => {
  return name.split(' ').map(word => word.charAt(0).toUpperCase()).slice(0, 2).join('');
};

const getAvatarColor = (name: string): string => {
  const colors = ['#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#03a9f4'];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
};

const generateCalendarDays = (currentDate: Date): DayObject[] => {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const firstDayWeekday = firstDay.getDay();
  const daysInMonth = lastDay.getDate();
  const today = new Date();

  const days: DayObject[] = [];
  
  // Dias do mês anterior
  const prevMonth = new Date(year, month - 1, 0);
  for (let i = firstDayWeekday - 1; i >= 0; i--) {
    days.push({ date: prevMonth.getDate() - i, isCurrentMonth: false, isToday: false });
  }

  // Dias do mês atual
  for (let day = 1; day <= daysInMonth; day++) {
    const isToday = year === today.getFullYear() && month === today.getMonth() && day === today.getDate();
    days.push({ date: day, isCurrentMonth: true, isToday });
  }

  // Dias do próximo mês
  const remainingDays = 42 - days.length;
  for (let day = 1; day <= remainingDays; day++) {
    days.push({ date: day, isCurrentMonth: false, isToday: false });
  }

  return days;
};

const chunkArray = (array: any[], size: number): any[][] => {
  const chunks = [];
  for (let i = 0; i < array.length; i += size) chunks.push(array.slice(i, i + size));
  return chunks;
};

const createSplashEffect = (
  e: React.MouseEvent<HTMLButtonElement>,
  setDroplets: React.Dispatch<React.SetStateAction<Droplet[]>>
) => {
  const button = e.currentTarget;
  const rect = button.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  const newDroplets: Droplet[] = [];
  const colors = [
    'linear-gradient(135deg, #FFB3BA 0%, #F9636B 100%)',
    'linear-gradient(135deg, #93c5fd 0%, #3b82f6 100%)',
    'linear-gradient(135deg, #fde047 0%, #eab308 100%)'
  ];

  // Gotículas principais
  for (let i = 0; i < 12; i++) {
    const angle = (i * 360 / 12) + (Math.random() - 0.5) * 60;
    const distance = 150 + Math.random() * 100;
    const radians = angle * (Math.PI / 180);
    
    newDroplets.push({
      id: `${Date.now()}-${i}`,
      startX: centerX,
      startY: centerY,
      endX: centerX + Math.cos(radians) * distance,
      endY: centerY + Math.sin(radians) * distance,
      size: 8 + Math.random() * 12,
      duration: 0.8 + Math.random() * 0.4,
      delay: Math.random() * 100,
      color: colors[Math.floor(Math.random() * colors.length)]
    });
  }

  // Gotículas secundárias
  for (let i = 0; i < 8; i++) {
    const angle = Math.random() * 360;
    const distance = 80 + Math.random() * 60;
    const radians = angle * (Math.PI / 180);
    
    newDroplets.push({
      id: `${Date.now()}-sec-${i}`,
      startX: centerX,
      startY: centerY,
      endX: centerX + Math.cos(radians) * distance,
      endY: centerY + Math.sin(radians) * distance,
      size: 4 + Math.random() * 6,
      duration: 0.6 + Math.random() * 0.3,
      delay: 50 + Math.random() * 150,
      color: colors[Math.floor(Math.random() * colors.length)]
    });
  }

  setDroplets(prev => [...prev, ...newDroplets]);
  setTimeout(() => {
    setDroplets(prev => prev.filter(d => !newDroplets.some(nd => nd.id === d.id)));
  }, 1500);
};

const validateScheduleForm = (formData: ScheduleFormData): Record<string, string> => {
  const errors: Record<string, string> = {};

  if (!formData.vehicle.trim()) errors.vehicle = 'Selecione um veículo';
  
  if (!formData.departureDateTime) {
    errors.departureDateTime = 'Data e hora de saída são obrigatórias';
  } else if (new Date(formData.departureDateTime) <= new Date()) {
    errors.departureDateTime = 'A data de saída deve ser futura';
  }

  if (!formData.returnDateTime) {
    errors.returnDateTime = 'Data e hora de retorno são obrigatórias';
  } else if (formData.departureDateTime && new Date(formData.returnDateTime) <= new Date(formData.departureDateTime)) {
    errors.returnDateTime = 'A data de retorno deve ser após a data de saída';
  }

  if (!formData.destination.trim()) {
    errors.destination = 'Destino é obrigatório';
  } else if (formData.destination.trim().length < 5) {
    errors.destination = 'Destino deve ter pelo menos 5 caracteres';
  }

  if (!formData.reason.trim()) {
    errors.reason = 'Motivo do uso é obrigatório';
  } else if (formData.reason.trim().length < 10) {
    errors.reason = 'Motivo deve ter pelo menos 10 caracteres';
  }

  return errors;
};

export const Dashboard: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallMobile = useMediaQuery('(max-width: 480px)');
  const { user } = useAuth();

  // Estados principais
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentTime, setCurrentTime] = useState(new Date());
  const [userProfileImage, setUserProfileImage] = useState<string | null>(null);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [cameraDialog, setCameraDialog] = useState(false);
  const [newScheduleDialog, setNewScheduleDialog] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [droplets, setDroplets] = useState<Droplet[]>([]);
  const [formData, setFormData] = useState<ScheduleFormData>({
    vehicle: '', departureDateTime: '', returnDateTime: '', destination: '', reason: ''
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Dados do usuário
  const userInfo = useMemo(() => ({
    name: user?.name || 'Usuário',
    email: user?.email || 'usuario@exemplo.com',
    initials: getInitials(user?.name || 'Usuário'),
    avatarColor: getAvatarColor(user?.name || 'Usuário')
  }), [user]);

  // Handlers de foto
  const photoHandlers = {
    handleAvatarClick: (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget),
    handleMenuClose: () => setAnchorEl(null),
    
    handleChoosePhoto: () => {
      fileInputRef.current?.click();
      setAnchorEl(null);
    },

    handleTakePhoto: async () => {
      try {
        setAnchorEl(null);
        const mediaStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
        setStream(mediaStream);
        setCameraDialog(true);
        setTimeout(() => {
          if (videoRef.current) {
            videoRef.current.srcObject = mediaStream;
            videoRef.current.play();
          }
        }, 100);
      } catch (error) {
        console.error('Erro ao acessar a câmera:', error);
        alert('Não foi possível acessar a câmera.');
      }
    },

    handleCapturePhoto: () => {
      if (videoRef.current && canvasRef.current) {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          canvas.width = videoRef.current.videoWidth;
          canvas.height = videoRef.current.videoHeight;
          ctx.drawImage(videoRef.current, 0, 0);
          setUserProfileImage(canvas.toDataURL('image/jpeg', 0.8));
        }
      }
      photoHandlers.handleCloseCameraDialog();
    },

    handleCloseCameraDialog: () => {
      stream?.getTracks().forEach(track => track.stop());
      setStream(null);
      setCameraDialog(false);
    },

    handleRemovePhoto: () => {
      setUserProfileImage(null);
      setAnchorEl(null);
    },

    handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file?.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => setUserProfileImage(e.target?.result as string);
        reader.readAsDataURL(file);
      }
      if (event.target) event.target.value = '';
    }
  };

  // Handlers de agendamento
  const scheduleHandlers = {
    handleNewSchedule: () => {
      setNewScheduleDialog(true);
      setFormData({ vehicle: '', departureDateTime: '', returnDateTime: '', destination: '', reason: '' });
      setFormErrors({});
    },

    handleCloseScheduleDialog: () => {
      setNewScheduleDialog(false);
      setFormErrors({});
    },

    handleFormChange: (field: keyof ScheduleFormData, value: string) => {
      setFormData(prev => ({ ...prev, [field]: value }));
      if (formErrors[field]) {
        setFormErrors(prev => ({ ...prev, [field]: '' }));
      }
    },

    handleCreateSchedule: (e: React.MouseEvent<HTMLButtonElement>) => {
      const errors = validateScheduleForm(formData);
      if (Object.keys(errors).length > 0) {
        setFormErrors(errors);
        alert('Preencha todos os campos obrigatórios corretamente.');
        return;
      }

      createSplashEffect(e, setDroplets);
      console.log('Criar agendamento:', formData);
      setTimeout(() => setNewScheduleDialog(false), 1000);
    }
  };

  // Calendário
  const calendarData = useMemo(() => {
    const monthNames = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
    const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    const calendarDays = generateCalendarDays(currentDate);
    const calendarWeeks = chunkArray(calendarDays, 7);
    
    return { monthNames, weekDays, calendarWeeks };
  }, [currentDate]);

  const navigateMonth = (direction: number) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  // Atualizar hora
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Renderização de componentes visuais
  const renderSplashDroplets = () => (
    <>
      <style>{`
        @keyframes splash-droplet {
          0% { transform: translate(0, 0) scale(1); opacity: 0.9; }
          30% { transform: translate(calc(var(--end-x) * 0.7), calc(var(--end-y) * 0.5)) scale(0.8); opacity: 0.8; }
          70% { transform: translate(var(--end-x), calc(var(--end-y) + var(--gravity))) scale(0.4); opacity: 0.4; }
          100% { transform: translate(var(--end-x), calc(var(--end-y) + var(--gravity) * 2)) scale(0.1); opacity: 0; }
        }
      `}</style>
      {droplets.map((droplet) => (
        <Box
          key={droplet.id}
          sx={{
            position: 'fixed', pointerEvents: 'none', zIndex: 9999, borderRadius: '50%',
            background: droplet.color, boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
            left: droplet.startX - droplet.size / 2, top: droplet.startY - droplet.size / 2,
            width: droplet.size, height: droplet.size,
            animation: `splash-droplet ${droplet.duration}s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards`,
            animationDelay: `${droplet.delay}ms`,
            '--end-x': `${droplet.endX - droplet.startX}px`,
            '--end-y': `${droplet.endY - droplet.startY}px`,
            '--gravity': `${Math.random() * 20 + 30}px`,
          }}
        />
      ))}
    </>
  );

  const renderHeader = () => (
    <Box display="flex" justifyContent="space-between" alignItems={isMobile ? "flex-start" : "center"}
      flexDirection={isMobile ? "column" : "row"} gap={isMobile ? 2 : 0} mb={3}>
      
      <Typography variant={isMobile ? "h5" : "h4"} component="h1"
        sx={{ fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2.125rem' } }}>
        Dashboard
      </Typography>
      <Box display="flex" alignItems="center" gap={2} sx={{ justifyContent:{ xs:'flex-end', md:'flex-start' },
        width:{ xs: '100%', md: 'auto' }}}>
        <Box>
          <Typography variant="body1" sx={{ fontSize: { xs: '0.875rem', md: '1rem' }, fontWeight: 'bold', color: '#000000' }}>
            {userInfo.name}
          </Typography>
          <Typography variant="body2" sx={{ fontSize: { xs: '0.75rem', md: '0.875rem' }, color: '#666666' }}>
            {userInfo.email}
          </Typography>
        </Box>
        {/* Avatar com menu de foto */}
        <Box sx={{ position: 'relative' }}>
          <Avatar src={userProfileImage || undefined} alt={userInfo.name}
            onClick={photoHandlers.handleAvatarClick}
            sx={{ 
              width: { xs: 40, md: 48 }, height: { xs: 40, md: 48 },
              bgcolor: userInfo.avatarColor, fontSize: { xs: '1rem', md: '1.25rem' },
              cursor: 'pointer', transition: 'all 0.3s ease',
              '&:hover': { transform: 'scale(1.05)', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' } }}>
            {!userProfileImage && userInfo.initials}
          </Avatar>

            {/* Ícone de câmera no hover */}
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: 0,
                  transition: 'opacity 0.3s ease',
                  pointerEvents: 'none',
                  '&:hover': {
                    opacity: 1,
                  }, '&::after': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundColor: 'rgba(0,0,0,0.4)',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
            },
                  // Mostrar no hover do pai
                  '.MuiAvatar-root:hover ~ &, &:hover': {
                    opacity: 1,
                  }
                }}
              >
                <CameraAlt 
                  sx={{ 
                    color: 'white', 
                    fontSize: { xs: '1.2rem', md: '1.5rem' } 
                  }} 
                />
              </Box>
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={photoHandlers.handleMenuClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}>
            <MenuItem onClick={photoHandlers.handleChoosePhoto}>
              <ListItemIcon><PhotoCamera fontSize="small" /></ListItemIcon>
              <ListItemText>Escolher foto</ListItemText>
            </MenuItem>
            <MenuItem onClick={photoHandlers.handleTakePhoto}>
              <ListItemIcon><CameraAlt fontSize="small" /></ListItemIcon>
              <ListItemText>Tirar foto</ListItemText>
            </MenuItem>
            {userProfileImage && (
              <MenuItem onClick={photoHandlers.handleRemovePhoto}>
                <ListItemIcon><Delete fontSize="small" /></ListItemIcon>
                <ListItemText>Remover foto</ListItemText>
              </MenuItem>
            )}
          </Menu>

          <input type="file" ref={fileInputRef} onChange={photoHandlers.handleFileChange}
            accept="image/*" style={{ display: 'none' }} />
        </Box>
      </Box>
    </Box>
  );

  const renderStatsCards = () => (
    <Grid container spacing={2} sx={{ mb: 2 }}>
      {[
        { icon: <CalendarToday color="primary" />, title: "Agendamentos Hoje", value: "0", color: "primary" },
        { icon: <Build color="secondary" />, title: "Em Manutenção", value: "0", color: "secondary" },
        { icon: <CalendarToday />, title: "Próximo Agendamento", 
          value: `${currentTime.toLocaleDateString('pt-BR')} às 14:30`, isDate: true },
      ].map((card, index) => (
        <Grid item xs={12} sm={6} md={3} key={index}>
          <Card sx={{ borderRadius: 4, paddingBottom: card.isDate ? 2.5 : 0 }}>
            <CardContent sx={{ p: { xs: 1.5, md: 2 } }}>
              <Box display="flex" alignItems="center" gap={1}>
                {card.icon}
                <Typography variant="h6" sx={{ fontSize: { xs: '0.875rem', md: '1.125rem' } }}>
                  {card.title}
                </Typography>
              </Box>
              <Typography variant={card.isDate ? "body1" : "h4"} 
                color={card.color as any} sx={{ mt: 1, fontSize: card.isDate ? { xs: '0.875rem', md: '1rem' } : { xs: '1.5rem', md: '2.125rem' } }}>
                {card.value}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
      
      {/* Card de Ações Rápidas */}
      <Grid item xs={12} sm={6} md={3}>
        <Card sx={{ minWidth: isMobile ? 'auto' : '200px', borderRadius: 4, paddingBottom: 1.5 }}>
          <CardContent sx={{ p: { xs: 1.5, md: 2 } }}>
            <Typography fontFamily="Arial" sx={{ color: "#000000", opacity: 0.6, fontSize: { xs: '0.75rem', md: '0.875rem' }, mb: 1 }}>
              Ações Rápidas
            </Typography>
            <Button variant="contained" color="primary" startIcon={<Add />}
              onClick={scheduleHandlers.handleNewSchedule} fullWidth={isMobile}
              sx={{
                fontSize: { xs: '0.7rem', sm: '0.75rem', md: '0.875rem' },
                px: { xs: 1, sm: 1.5, md: 2 }, 
                py: { xs: 0.5, sm: 0.75, md: 1 },
                minWidth: { xs: 'auto', md: '140px' }, 
                height: { xs: '32px', sm: '36px', md: '40px' },
                borderRadius: 2, 
                textTransform: 'none', 
                boxShadow: 1,
                transition: 'background-color 0.3s ease-in-out',
                '&:hover': {
                  backgroundColor: '#07a8f3ff',
                  transform: 'scale(1.02)',
                },
              }}>
              {isSmallMobile ? 'Novo' : 'Novo Agendamento'}
            </Button>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const renderCalendar = () => (
    <Card>
      <CardContent sx={{ p: { xs: 1.5, md: 2 } }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}
          flexDirection={isSmallMobile ? "column" : "row"} gap={isSmallMobile ? 1 : 0}>
          <Typography variant="h6" fontWeight="bold" sx={{ fontSize: { xs: '1rem', md: '1.125rem' } }}>
            Calendário de Agendamentos
          </Typography>
          <Box display="flex" alignItems="center" gap={1}>
            <IconButton onClick={() => navigateMonth(-1)} size="small"><ChevronLeft /></IconButton>
            <Typography variant="body1" fontWeight="bold" sx={{ fontSize: { xs: '0.875rem', md: '1rem' }, minWidth: { xs: '120px', md: '140px' }, textAlign: 'center' }}>
              {calendarData.monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </Typography>
            <IconButton onClick={() => navigateMonth(1)} size="small"><ChevronRight /></IconButton>
          </Box>
        </Box>

        <Grid container spacing={0}>
          {calendarData.weekDays.map((day) => (
            <Grid item xs key={day} sx={{ width: '14.28%' }}>
              <Box display="flex" justifyContent="center" alignItems="center" p={{ xs: 0.5, md: 1 }} sx={{ backgroundColor: theme.palette.grey[100] }}>
                <Typography variant="body2" fontWeight="bold" sx={{ fontSize: { xs: '0.7rem', md: '0.875rem' } }}>
                  {day}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>

        {calendarData.calendarWeeks.map((week, weekIndex) => (
          <Grid container spacing={0} key={weekIndex}>
            {week.map((dayObj, dayIndex) => (
              <Grid item xs key={`${weekIndex}-${dayIndex}`} sx={{ width: '14.28%' }}>
                <Box display="flex" justifyContent="center" alignItems="center" p={{ xs: 0.5, sm: 1 }}
                  sx={{
                    width: { xs: 35, sm: 45, md: 60 }, minHeight: { xs: 35, sm: 45, md: 60 },
                    cursor: 'pointer', borderRadius: 1, transition: '0.2s',
                    border: dayObj.isToday ? '2px solid #F4C430' : '1px solid transparent',
                    color: dayObj.isToday ? '#F4C430' : dayObj.isCurrentMonth ? '#000000' : '#AAAAAA',
                    fontWeight: dayObj.isToday ? 'bold' : 'normal',
                    backgroundColor: 'transparent',
                    '&:hover': { backgroundColor: theme.palette.grey[100] },
                  }}
                  onClick={() => console.log(`Dia selecionado: ${dayObj.date}`)}>
                  <Typography variant="body2" sx={{ fontSize: { xs: '0.65rem', sm: '0.75rem', md: '0.875rem' } }}>
                    {dayObj.date}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        ))}
      </CardContent>
    </Card>
  );

  const renderDialogs = () => (
    <>
      {/* Dialog da Câmera */}
      <Dialog open={cameraDialog} onClose={photoHandlers.handleCloseCameraDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Tirar Foto</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" alignItems="center" gap={2} sx={{ py: 2 }}>
            <video ref={videoRef} autoPlay playsInline muted style={{ width: '100%', maxWidth: '400px', height: 'auto', borderRadius: '8px', backgroundColor: '#000' }} />
            <canvas ref={canvasRef} style={{ display: 'none' }} />
            <Typography variant="body2" color="text.secondary" textAlign="center">
              Posicione-se na frente da câmera e clique em "Capturar" quando estiver pronto
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={photoHandlers.handleCloseCameraDialog}>Cancelar</Button>
         <Button 
            onClick={(e) => {
              createSplashEffect(e, setDroplets);
              photoHandlers.handleCapturePhoto();
            }}
            variant="contained" 
            startIcon={<CameraAlt />}
          >
            Capturar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog de Novo Agendamento */}
      <Dialog open={newScheduleDialog} onClose={scheduleHandlers.handleCloseScheduleDialog} maxWidth="md" fullWidth>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h5" component="h2" fontWeight='bold'>Novo Agendamento</Typography>
            <Typography variant="body2" color="text.secondary">Agende o uso de um veículo da frota</Typography>
          </Box>
          <IconButton onClick={scheduleHandlers.handleCloseScheduleDialog}><Close /></IconButton>
        </DialogTitle>
        
        <DialogContent>
          <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 3, py: 2 }}>
            <Box>
              <Box display="flex" alignItems="center" gap={1} mb={2}>
                <CalendarToday sx={{color:"#07a8f3ff"}}/>
                <Typography variant="h6" color='#07a8f3ff'>Informações do Agendamento</Typography>
              </Box>
              
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <FormControl fullWidth required error={!!formErrors.vehicle}>
                    <InputLabel>Veículo</InputLabel>
                    <Select label="Veículo" value={formData.vehicle}
                      onChange={(e) => scheduleHandlers.handleFormChange('vehicle', e.target.value)}>
                      <SelectMenuItem value="">Selecione um veículo</SelectMenuItem>
                      <SelectMenuItem value="veiculo1">Carro A - ABC-1234</SelectMenuItem>
                      <SelectMenuItem value="veiculo2">Carro B - DEF-5678</SelectMenuItem>
                      <SelectMenuItem value="veiculo3">Van - GHI-9012</SelectMenuItem>
                    </Select>
                    {formErrors.vehicle && <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block' }}>{formErrors.vehicle}</Typography>}
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField fullWidth required label="Data e Hora de Saída" type="datetime-local"
                    InputLabelProps={{ shrink: true }} value={formData.departureDateTime}
                    onChange={(e) => scheduleHandlers.handleFormChange('departureDateTime', e.target.value)}
                    error={!!formErrors.departureDateTime} helperText={formErrors.departureDateTime} />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField fullWidth required label="Data e Hora de Retorno" type="datetime-local"
                    InputLabelProps={{ shrink: true }} value={formData.returnDateTime}
                    onChange={(e) => scheduleHandlers.handleFormChange('returnDateTime', e.target.value)}
                    error={!!formErrors.returnDateTime} helperText={formErrors.returnDateTime} />
                </Grid>

                <Grid item xs={12}>
                  <TextField fullWidth required label="Destino/Local da Atividade" multiline rows={2}
                    placeholder="Ex: Centro de São Paulo, Escola Municipal..." value={formData.destination}
                    onChange={(e) => scheduleHandlers.handleFormChange('destination', e.target.value)}
                    error={!!formErrors.destination} helperText={formErrors.destination} />
                </Grid>

                <Grid item xs={12}>
                  <TextField fullWidth required label="Motivo do Uso" multiline rows={3}
                    placeholder="Descreva o motivo do uso do veículo..." value={formData.reason}
                    onChange={(e) => scheduleHandlers.handleFormChange('reason', e.target.value)}
                    error={!!formErrors.reason} helperText={formErrors.reason} />
                </Grid>
              </Grid>
            </Box>
          </Box>
        </DialogContent>
        
         <DialogActions sx={{ p: 3, gap: 2 }}>
          
         <Button onClick={scheduleHandlers.handleCloseScheduleDialog} variant="outlined" size="large" sx={{ color:'#F9636B'
          , borderColor:'#F9636B', '&:hover': { borderColor: '#F9636B', transform: 'translateY(-1px)', 
          boxShadow: '0px 6px 5px #F9A3A8' } }}>
          Cancelar
          </Button>
          
          <Button onClick={scheduleHandlers.handleCreateSchedule} variant="contained" sx={{ color:'#F4C430', 
          '&:hover': { backgroundColor: '#F4C430', transform: 'translateY(-1px)', 
          boxShadow: theme.shadows[6] } }}
            size="large" startIcon={<Add sx={{ color: '#Ffff' }} />}>
            <Typography sx={{ color: '#ffffff' , variant:"contained", marginRight:'auto', paddingLeft:'-2px'}}> 
            Criar Agendamento
            </Typography>
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );

  return (
    <BaseLayoutPage>
      {renderSplashDroplets()}
      <Box sx={{ p: { xs: 2, md: 3 } }}>
        {renderHeader()}
        <Box display="flex" flexDirection="column" gap={2}>
          {renderStatsCards()}
          {renderCalendar()}
          
          <Box mt={2} p={{ xs: 1.5, md: 2 }} sx={{ backgroundColor: theme.palette.grey[50], borderRadius: 1 }}>
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.75rem', md: '0.875rem' } }}>
              Data atual: {currentTime.toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} - {currentTime.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
            </Typography>
          </Box>
        </Box>
        {renderDialogs()}
      </Box>
    </BaseLayoutPage>
  );
};