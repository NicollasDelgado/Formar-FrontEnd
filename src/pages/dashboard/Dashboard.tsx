import React, { useState, useEffect, ReactNode } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  IconButton,
  Grid,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  CalendarToday,
  Build,
  ChevronLeft,
  ChevronRight,
  Add,
} from '@mui/icons-material';
import { BaseLayoutPage } from '../../shared/layouts/BaseLayoutPage/BaseLayoutPage';

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

  // Botão de Nova Ferramenta com responsividade
  const toolsBar: ReactNode = (
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
  );

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
          {toolsBar}
        </Box>

        {/* Cards de estatísticas */}
        <Box display="flex" flexDirection="column" gap={2}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
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
              <Card>
                <CardContent sx={{ p: { xs: 1.5, md: 2 } }}>
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
              <Card>
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
      </Box>
    </BaseLayoutPage>
  );
}