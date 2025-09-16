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
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  // Botão de Nova Ferramenta
  const toolsBar: ReactNode = (
          <Card>
            <CardContent>
              <Box>
               <Typography fontFamily={"Arial"}
                  sx={{
                    color: "#000000",
                    opacity: 0.6,
                  }}
                >
                  Ações Rápidas
                </Typography>                 
                 <Button className="NewSchedule"
                      variant="contained"
                      color="primary"
                      startIcon={<Add />}
                      onClick={() => console.log('Novo Agendamento')}
                    >
                      Novo Agendamento
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
      <Box sx={{ p: 3 }}>
        {/* Cabeçalho */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4" component="h1">
            Dashboard
          </Typography>
          {toolsBar}
        </Box>

        {/* Cards de estatísticas */}
        <Box display="flex" flexDirection="column" gap={2}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center" gap={1}>
                    <CalendarToday color="primary" />
                    <Typography variant="h6">Agendamentos Hoje</Typography>
                  </Box>
                  <Typography variant="h4" color="primary" sx={{ mt: 1 }}>0</Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Build color="secondary" />
                    <Typography variant="h6">Em Manutenção</Typography>
                  </Box>
                  <Typography variant="h4" color="secondary" sx={{ mt: 1 }}>0</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                
                <CardContent>
                  <Box display="flex" alignItems="center" gap={1}>
                    <CalendarToday />
                    <Typography variant="h6">Próximo Agendamento</Typography>
                  </Box>
                  <Typography variant="body1" sx={{ mt: 1 }}>
                    {currentTime.toLocaleDateString('pt-BR')} às 14:30
                  </Typography>
                  </CardContent>
              </Card>
            </Grid>
          </Grid>
          {/* Calendário */}
         <Card>
  <CardContent>
    {/* Cabeçalho do calendário */}
    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
      <Typography variant="h6" fontWeight="bold">
        Calendário de Agendamentos
      </Typography>
      <Box display="flex" alignItems="center" gap={1}>
        <IconButton onClick={() => navigateMonth(-1)} size="small">
          <ChevronLeft />
        </IconButton>
        <Typography variant="body1" fontWeight="bold">
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
            p={1}
            sx={{ backgroundColor: theme.palette.grey[100] }}
          >
            <Typography variant="body2" fontWeight="bold">{day}</Typography>
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
                width: { xs: 40, sm: 60 },
                minHeight: { xs: 40, sm: 60 },
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
              <Typography variant="body2" sx={{ fontSize: { xs: '0.7rem', sm: '0.875rem' } }}>
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
              <Box mt={2} p={2} sx={{ backgroundColor: theme.palette.grey[50], borderRadius: 1 }}>
                <Typography variant="body2" color="text.secondary">
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
