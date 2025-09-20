import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  IconButton,
  Grid,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useTheme,
  useMediaQuery,
  TextField,
  FormControl,
  InputLabel,
  Select,
} from '@mui/material';
import {
  CalendarToday,
  Build,
  ChevronLeft,
  ChevronRight,
  Add,
  CameraAlt,
  PhotoCamera,
  Delete,
  Close,
} from '@mui/icons-material';
import { BaseLayoutPage } from '../../shared/layouts/BaseLayoutPage/BaseLayoutPage';
import { useAuth } from '../../shared/hooks/auth';

interface DayObject {
  date: number;
  isCurrentMonth: boolean;
  isToday: boolean;
}

export const Dashboard: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallMobile = useMediaQuery('(max-width: 480px)');
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [userProfileImage, setUserProfileImage] = useState<string | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [cameraDialog, setCameraDialog] = useState(false);
  const [newScheduleDialog, setNewScheduleDialog] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Integração com hook de autenticação
  const { user } = useAuth();

  // Dados do usuário vindos do contexto de autenticação
  const userInfo = {
    name: user?.name || 'Usuário',
    email: user?.email || 'usuario@exemplo.com'
  };

  // Função para gerar iniciais do nome
  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .slice(0, 2)
      .join('');
  };

  // Função para gerar cor baseada no nome (avatar padrão)
  const getAvatarColor = (name: string): string => {
    const colors = [
      '#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5',
      '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4caf50',
      '#8bc34a', '#cddc39', '#ffeb3b', '#ffc107', '#ff9800',
      '#ff5722', '#795548', '#9e9e9e', '#607d8b'
    ];
    
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    return colors[Math.abs(hash) % colors.length];
  };

  // Handlers para upload de foto
  const handleAvatarClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleChoosePhoto = () => {
    fileInputRef.current?.click();
    handleMenuClose();
  };

  const handleTakePhoto = async () => {
    try {
      handleMenuClose();
      
      // Solicitar acesso à câmera
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user' } // Câmera frontal
      });
      
      setStream(mediaStream);
      setCameraDialog(true);
      
      // Aguardar o dialog abrir e então configurar o vídeo
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          videoRef.current.play();
        }
      }, 100);
      
    } catch (error) {
      console.error('Erro ao acessar a câmera:', error);
      alert('Não foi possível acessar a câmera. Verifique as permissões do navegador.');
    }
  };

  const handleCapturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        // Configurar o tamanho do canvas baseado no vídeo
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        // Capturar o frame atual
        ctx.drawImage(video, 0, 0);
        
        // Converter para base64
        const photoDataUrl = canvas.toDataURL('image/jpeg', 0.8);
        setUserProfileImage(photoDataUrl);
        
        console.log('Foto capturada com sucesso');
      }
    }
    
    handleCloseCameraDialog();
  };

  const handleCloseCameraDialog = () => {
    // Parar o stream da câmera
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setCameraDialog(false);
  };

  const handleRemovePhoto = () => {
    setUserProfileImage(null);
    // Aqui você removeria a foto do backend/storage
    console.log('Foto removida');
    handleMenuClose();
  };

  const handleNewSchedule = () => {
    setNewScheduleDialog(true);
  };

  const handleCloseScheduleDialog = () => {
    setNewScheduleDialog(false);
  };

  const handleCreateSchedule = () => {
    // Aqui você implementaria a lógica para criar o agendamento
    console.log('Criar novo agendamento');
    setNewScheduleDialog(false);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Verificar se é uma imagem
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result as string;
          setUserProfileImage(result);
          // Aqui você enviaria a imagem para o backend
          console.log('Nova foto selecionada:', file.name);
        };
        reader.readAsDataURL(file);
      } else {
        alert('Por favor, selecione apenas arquivos de imagem.');
      }
    }
    // Limpar o input para permitir selecionar o mesmo arquivo novamente
    if (event.target) {
      event.target.value = '';
    }
  };

  // Computar valores baseados no usuário atual
  const userInitials = getInitials(userInfo.name);
  const avatarColor = getAvatarColor(userInfo.name);

  // Atualiza a hora a cada minuto
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Dividir array em chunks para criar linhas do calendário
  const chunkArray = (array: DayObject[], size: number): DayObject[][] => {
    const chunks: DayObject[][] = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  };

  // Gerar dias do calendário
  const generateCalendarDays = (): DayObject[] => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const firstDayWeekday = firstDayOfMonth.getDay();
    const daysInMonth = lastDayOfMonth.getDate();

    const days: DayObject[] = [];

    // Dias do mês anterior
    const prevMonth = new Date(year, month - 1, 0);
    for (let i = firstDayWeekday - 1; i >= 0; i--) {
      days.push({
        date: prevMonth.getDate() - i,
        isCurrentMonth: false,
        isToday: false,
      });
    }

    // Dias do mês atual
    const today = new Date();
    for (let day = 1; day <= daysInMonth; day++) {
      const isToday =
        year === today.getFullYear() &&
        month === today.getMonth() &&
        day === today.getDate();
      days.push({
        date: day,
        isCurrentMonth: true,
        isToday,
      });
    }

    // Dias do próximo mês para completar 42 células
    const remainingDays = 42 - days.length;
    for (let day = 1; day <= remainingDays; day++) {
      days.push({
        date: day,
        isCurrentMonth: false,
        isToday: false,
      });
    }

    return days;
  };

  const navigateMonth = (direction: number): void => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  const monthNames = [
    'Janeiro','Fevereiro','Março','Abril','Maio','Junho',
    'Julho','Agosto','Setembro','Outubro','Novembro','Dezembro',
  ];

  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  const calendarDays = generateCalendarDays();
  const calendarWeeks = chunkArray(calendarDays, 7);

  return (
    <BaseLayoutPage>
      <Box sx={{ p: { xs: 2, md: 3 } }}>
        {/* Cabeçalho */}
        <Box 
          display="flex" 
          justifyContent="space-between" 
          alignItems={isMobile ? "flex-start" : "center"}
          flexDirection={isMobile ? "column" : "row"}
          gap={isMobile ? 2 : 0}
          mb={3}
        >
          <Typography 
            variant={isMobile ? "h5" : "h4"} 
            component="h1"
            sx={{ fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2.125rem' } }}
          >
            Dashboard
          </Typography>
          
          {/* Informações do Usuário */}
          <Box display="flex" alignItems="center" gap={2}>
            <Box>
              <Typography 
                variant="body1" 
                sx={{ 
                  fontSize: { xs: '0.875rem', md: '1rem' },
                  fontWeight: 'bold',
                  color: '#000000',
                  lineHeight: 1.2
                }}
              >
                {userInfo.name}
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ 
                  fontSize: { xs: '0.75rem', md: '0.875rem' },
                  color: '#666666',
                  lineHeight: 1.2
                }}
              >
                {userInfo.email}
              </Typography>
            </Box>     
            {/*Foto do Usuário com Hover*/}
            <Box sx={{ position: 'relative' }}>
              <Avatar 
                src={userProfileImage || undefined}
                alt={userInfo.name}
                onClick={handleAvatarClick}
                sx={{ 
                  width: { xs: 40, md: 48 }, 
                  height: { xs: 40, md: 48 },
                  bgcolor: avatarColor,
                  fontSize: { xs: '1rem', md: '1.25rem' },
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.05)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    '&::after': {
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
                    }
                  }
                }}
              >
                {!userProfileImage && userInitials}
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

              {/* Menu de opções da foto */}
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
              >
                <MenuItem onClick={handleChoosePhoto}>
                  <ListItemIcon>
                    <PhotoCamera fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Escolher foto</ListItemText>
                </MenuItem>
                <MenuItem onClick={handleTakePhoto}>
                  <ListItemIcon>
                    <CameraAlt fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Tirar foto</ListItemText>
                </MenuItem>
                {userProfileImage && (
                  <MenuItem onClick={handleRemovePhoto}>
                    <ListItemIcon>
                      <Delete fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Remover foto</ListItemText>
                  </MenuItem>
                )}
              </Menu>

              {/* Input hidden para upload de arquivo */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                style={{ display: 'none' }}
              />
            </Box>
          </Box>
        </Box>

        {/* Cards de estatísticas */}
        <Box display="flex" flexDirection="column" gap={2}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{  borderRadius: 4 }}>
                <CardContent sx={{ p: { xs: 1.5, md: 2 } }}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <CalendarToday color="primary" sx={{ fontSize: { xs: '1.25rem', md: '1.5rem' } }} />
                    <Typography 
                      variant="h6" 
                      sx={{ fontSize: { xs: '0.875rem', md: '1.125rem' } }}
                    >
                      Agendamentos Hoje
                    </Typography>
                  </Box>
                  <Typography 
                    variant="h4" 
                    color="primary" 
                    sx={{ 
                      mt: 1,
                      fontSize: { xs: '1.5rem', md: '2.125rem' }
                    }}
                  >
                    0
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{  borderRadius: 4 }}>
                <CardContent sx={{ p: { xs: 1.5, md: 2, } }}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Build color="secondary" sx={{ fontSize: { xs: '1.25rem', md: '1.5rem' } }} />
                    <Typography 
                      variant="h6"
                      sx={{ fontSize: { xs: '0.875rem', md: '1.125rem' } }}
                    >
                      Em Manutenção
                    </Typography>
                  </Box>
                  <Typography 
                    variant="h4" 
                    color="secondary" 
                    sx={{ 
                      mt: 1,
                      fontSize: { xs: '1.5rem', md: '2.125rem' }
                    }}
                  >
                    0
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{  borderRadius: 4, paddingBottom: 2.5 }}>
                <CardContent sx={{ p: { xs: 1.5, md: 2 } }}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <CalendarToday sx={{ fontSize: { xs: '1.25rem', md: '1.5rem' } }} />
                    <Typography 
                      variant="h6"
                      sx={{ fontSize: { xs: '0.875rem', md: '1.125rem' } }}
                    >
                      Próximo Agendamento
                    </Typography>
                  </Box>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      mt: 1,
                      fontSize: { xs: '0.875rem', md: '1rem' }
                    }}
                  >
                    {currentTime.toLocaleDateString('pt-BR')} às 14:30
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Card de Ações Rápidas - Agora como quarto item do Grid */}
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ minWidth: isMobile ? 'auto' : '200px' }}>
                <CardContent sx={{ p: { xs: 1.5, md: 2 }, '&:last-child': { pb: { xs: 1.5, md: 2 } } }}>
                  <Box>
                    <Typography 
                      fontFamily={"Arial"}
                      sx={{
                        color: "#000000",
                        opacity: 0.6,
                        fontSize: { xs: '0.75rem', md: '0.875rem' },
                        mb: 1,
                      }}
                    >
                      Ações Rápidas
                    </Typography>                 
                    <Button 
                      className="NewSchedule"
                      variant="contained"
                      color="primary"
                      startIcon={<Add sx={{ fontSize: { xs: '1rem', md: '1.25rem' } }} />}
                      onClick={() => console.log('Novo Agendamento')}
                      fullWidth={isMobile}
                      sx={{
                        // Responsividade do botão
                        fontSize: { xs: '0.7rem', sm: '0.75rem', md: '0.875rem' },
                        px: { xs: 1, sm: 1.5, md: 2 },
                        py: { xs: 0.5, sm: 0.75, md: 1 },
                        minWidth: { xs: 'auto', md: '140px' },
                        height: { xs: '32px', sm: '36px', md: '40px' },
                        
                        // Ajustar texto no mobile muito pequeno
                        ...(isSmallMobile && {
                          fontSize: '0.65rem',
                          px: 0.75,
                          py: 0.25,
                          height: '28px',
                        }),
                        
                        // Estilos do botão
                        borderRadius: 2,
                        textTransform: 'none',
                        boxShadow: 1,
                        '&:hover': {
                          boxShadow: 2,
                          transform: 'translateY(-1px)',
                        },
                      }}
                    >
                      {isSmallMobile ? 'Novo' : 'Novo Agendamento'}
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          
          {/* Calendário */}
          <Card>
            <CardContent sx={{ p: { xs: 1.5, md: 2 } }}>
              {/* Cabeçalho do calendário */}
              <Box 
                display="flex" 
                justifyContent="space-between" 
                alignItems="center" 
                mb={2}
                flexDirection={isSmallMobile ? "column" : "row"}
                gap={isSmallMobile ? 1 : 0}
              >
                <Typography 
                  variant="h6" 
                  fontWeight="bold"
                  sx={{ fontSize: { xs: '1rem', md: '1.125rem' } }}
                >
                  Calendário de Agendamentos
                </Typography>
                <Box display="flex" alignItems="center" gap={1}>
                  <IconButton onClick={() => navigateMonth(-1)} size="small">
                    <ChevronLeft />
                  </IconButton>
                  <Typography 
                    variant="body1" 
                    fontWeight="bold"
                    sx={{ 
                      fontSize: { xs: '0.875rem', md: '1rem' },
                      minWidth: { xs: '120px', md: '140px' },
                      textAlign: 'center'
                    }}
                  >
                    {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                  </Typography>
                  <IconButton onClick={() => navigateMonth(1)} size="small">
                    <ChevronRight />
                  </IconButton>
                </Box>
              </Box>

              {/* Cabeçalho dos dias da semana */}
              <Grid container spacing={0}>
                {weekDays.map((day) => (
                  <Grid item xs key={day} sx={{ width: '14.28%' }}>
                    <Box
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                      p={{ xs: 0.5, md: 1 }}
                      sx={{ backgroundColor: theme.palette.grey[100] }}
                    >
                      <Typography 
                        variant="body2" 
                        fontWeight="bold"
                        sx={{ fontSize: { xs: '0.7rem', md: '0.875rem' } }}
                      >
                        {day}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>

              {/* Dias do calendário */}
              {calendarWeeks.map((week, weekIndex) => (
                <Grid container spacing={0} key={weekIndex}>
                  {week.map((dayObj, dayIndex) => (
                    <Grid item xs key={`${weekIndex}-${dayIndex}`} sx={{ width: '14.28%' }}>
                      <Box
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        p={{ xs: 0.5, sm: 1 }}
                        sx={{
                          width: { xs: 35, sm: 45, md: 60 },
                          minHeight: { xs: 35, sm: 45, md: 60 },
                          cursor: 'pointer',
                          position: 'relative',
                          borderRadius: 1,
                          border: dayObj.isToday ? '2px solid #F4C430' : '1px solid transparent',
                          color: dayObj.isToday
                            ? '#F4C430'
                            : dayObj.isCurrentMonth
                            ? '#000000'
                            : '#AAAAAA',
                          fontWeight: dayObj.isToday ? 'bold' : 'normal',
                          backgroundColor: 'transparent',
                          transition: '0.2s',
                          '&:hover': { backgroundColor: theme.palette.grey[100] },
                        }}
                        onClick={() => console.log(`Dia selecionado: ${dayObj.date}`)}
                      >
                        <Typography 
                          variant="body2" 
                          sx={{ fontSize: { xs: '0.65rem', sm: '0.75rem', md: '0.875rem' } }}
                        >
                          {dayObj.date}
                        </Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              ))}
            </CardContent>
          </Card>

          {/* Informações atuais */}
          <Box 
            mt={2} 
            p={{ xs: 1.5, md: 2 }} 
            sx={{ 
              backgroundColor: theme.palette.grey[50], 
              borderRadius: 1 
            }}
          >
            <Typography 
              variant="body2" 
              color="text.secondary"
              sx={{ fontSize: { xs: '0.75rem', md: '0.875rem' } }}
            >
              Data atual: {currentTime.toLocaleDateString('pt-BR', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })} - {currentTime.toLocaleTimeString('pt-BR', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Typography>
          </Box>
        </Box>

        {/* Dialog da Câmera */}
        <Dialog 
          open={cameraDialog} 
          onClose={handleCloseCameraDialog}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Tirar Foto</DialogTitle>
          <DialogContent>
            <Box 
              display="flex" 
              flexDirection="column" 
              alignItems="center" 
              gap={2}
              sx={{ py: 2 }}
            >
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                style={{
                  width: '100%',
                  maxWidth: '400px',
                  height: 'auto',
                  borderRadius: '8px',
                  backgroundColor: '#000'
                }}
              />
              <canvas
                ref={canvasRef}
                style={{ display: 'none' }}
              />
              <Typography variant="body2" color="text.secondary" textAlign="center">
                Posicione-se na frente da câmera e clique em "Capturar" quando estiver pronto
              </Typography>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseCameraDialog}>
              Cancelar
            </Button>
            <Button 
              onClick={handleCapturePhoto} 
              variant="contained"
              startIcon={<CameraAlt />}
            >
              Capturar
            </Button>
          </DialogActions>
        </Dialog>

        {/* Dialog de Novo Agendamento */}
        <Dialog 
          open={newScheduleDialog} 
          onClose={handleCloseScheduleDialog}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="h5" component="h2">
                Novo Agendamento
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Agende o uso de um veículo da frota
              </Typography>
            </Box>
            <IconButton onClick={handleCloseScheduleDialog}>
              <Close />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <Box 
              component="form"
              sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                gap: 3,
                py: 2 
              }}
            >
              {/* Seção de Informações do Agendamento */}
              <Box>
                <Box display="flex" alignItems="center" gap={1} mb={2}>
                  <CalendarToday color="error" />
                  <Typography variant="h6" color="error">
                    Informações do Agendamento
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" mb={3}>
                  Preencha todos os campos obrigatórios para criar o agendamento
                </Typography>

                <Grid container spacing={3}>
                  {/* Veículo */}
                  <Grid item xs={12}>
                    <FormControl fullWidth required>
                      <InputLabel>Veículo</InputLabel>
                      <Select
                        label="Veículo"
                        defaultValue=""
                      >
                        <SelectMenuItem value="">Selecione um veículo</SelectMenuItem>
                        <SelectMenuItem value="veiculo1">Carro A - ABC-1234</SelectMenuItem>
                        <SelectMenuItem value="veiculo2">Carro B - DEF-5678</SelectMenuItem>
                        <SelectMenuItem value="veiculo3">Van - GHI-9012</SelectMenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  {/* Data e Hora de Saída */}
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      required
                      label="Data e Hora de Saída"
                      type="datetime-local"
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>

                  {/* Data e Hora de Retorno */}
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      required
                      label="Data e Hora de Retorno (Estimada)"
                      type="datetime-local"
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>

                  {/* Destino/Local da Atividade */}
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      required
                      label="Destino/Local da Atividade"
                      placeholder="Ex: Centro de São Paulo, Escola Municipal..."
                      multiline
                      rows={2}
                    />
                  </Grid>

                  {/* Motivo do Uso */}
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      required
                      label="Motivo do Uso"
                      placeholder="Descreva o motivo do uso do veículo..."
                      multiline
                      rows={3}
                    />
                  </Grid>
                </Grid>
              </Box>
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 3, gap: 2 }}>
            <Button 
              onClick={handleCloseScheduleDialog}
              variant="outlined"
              size="large"
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleCreateSchedule}
              variant="contained"
              color="error"
              size="large"
              startIcon={<Add />}
            >
              Criar Agendamento
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </BaseLayoutPage>
  );
};