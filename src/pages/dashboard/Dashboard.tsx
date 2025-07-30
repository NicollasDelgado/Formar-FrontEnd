import React from 'react'
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  IconButton,
  Grid,
  useTheme,
} from '@mui/material'
import {
  CalendarToday,
  Build,
  Speed,
  ChevronLeft,
  ChevronRight,
  Add,
} from '@mui/icons-material'
import { BaseLayoutPage } from '../../shared/layouts/BaseLayoutPage'

export const Dashboard: React.FC = () => {
  const theme = useTheme()

  // Dados do calendário
  const currentMonth = 'Julho 2025'
  const daysOfWeek = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

  // Gerar dias do calendário (exemplo para julho 2025)
  const calendarDays = [
    // Semana 1
    [29, 30, 1, 2, 3, 4, 5],
    // Semana 2
    [6, 7, 8, 9, 10, 11, 12],
    // Semana 3
    [13, 14, 15, 16, 17, 18, 19],
    // Semana 4
    [20, 21, 22, 23, 24, 25, 26],
    // Semana 5
    [27, 28, 29, 30, 31, 1, 2],
  ]

  return (
    <BaseLayoutPage>
      <h1>home</h1>
    </BaseLayoutPage>
  )

  return (
    <Box p={4}>
      {/* Título e Subtítulo */}
      <Box mb={4}>
        <Typography variant="h4" fontWeight="bold" mb={1}>
          Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Gerencie os agendamentos de veículos do Instituto Formar
        </Typography>
      </Box>

      {/* Cards de Estatísticas */}
      <Grid container spacing={3} mb={4}>
        {/* Agendamentos Ativos */}
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <CalendarToday sx={{ color: '#FFA726', fontSize: 20 }} />
                <Typography variant="body2" color="text.secondary" ml={1}>
                  Agendamentos Ativos
                </Typography>
              </Box>
              <Typography variant="h3" fontWeight="bold">
                3
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Próximo Agendamento */}
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <Speed sx={{ color: '#26C6DA', fontSize: 20 }} />
                <Typography variant="body2" color="text.secondary" ml={1}>
                  Próximo Agendamento
                </Typography>
              </Box>
              <Typography variant="h6" fontWeight="bold">
                20/01/2024, 05:00:00
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Em Manutenção */}
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <Build sx={{ color: '#EF5350', fontSize: 20 }} />
                <Typography variant="body2" color="text.secondary" ml={1}>
                  Em Manutenção
                </Typography>
              </Box>
              <Typography variant="h3" fontWeight="bold">
                1
              </Typography>
              <Typography variant="body2" color="text.secondary">
                veículos
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Ações Rápidas */}
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <Speed sx={{ color: '#AB47BC', fontSize: 20 }} />
                <Typography variant="body2" color="text.secondary" ml={1}>
                  Ações Rápidas
                </Typography>
              </Box>
              <Button
                variant="contained"
                startIcon={<Add />}
                sx={{
                  backgroundColor: '#EC407A',
                  color: 'white',
                  textTransform: 'none',
                  borderRadius: 2,
                  '&:hover': {
                    backgroundColor: '#D81B60',
                  },
                }}
                fullWidth
              >
                Novo Agendamento
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Calendário */}
      <Card>
        <CardContent>
          {/* Header do Calendário */}
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={3}
          >
            <Typography variant="h5" fontWeight="bold">
              Calendário de Agendamentos
            </Typography>

            <Box display="flex" alignItems="center">
              <IconButton size="small">
                <ChevronLeft />
              </IconButton>
              <Typography
                variant="h6"
                mx={2}
                minWidth="120px"
                textAlign="center"
              >
                {currentMonth}
              </Typography>
              <IconButton size="small">
                <ChevronRight />
              </IconButton>
            </Box>
          </Box>

          {/* Dias da Semana */}
          <Grid container>
            {daysOfWeek.map((day) => (
              <Grid item xs key={day} sx={{ width: '14.28%' }}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  fontWeight="medium"
                  textAlign="center"
                  py={1}
                >
                  {day}
                </Typography>
              </Grid>
            ))}
          </Grid>

          {/* Dias do Calendário */}
          {calendarDays.map((week, weekIndex) => (
            <Grid container key={weekIndex}>
              {week.map((day, dayIndex) => {
                const isCurrentMonth = !(
                  (weekIndex === 0 && day > 20) ||
                  (weekIndex === 4 && day < 10)
                )

                return (
                  <Grid
                    item
                    xs
                    key={`${weekIndex}-${dayIndex}`}
                    sx={{ width: '14.28%' }}
                  >
                    <Box
                      sx={{
                        height: 60,
                        display: 'flex',
                        alignItems: 'flex-start',
                        justifyContent: 'flex-start',
                        p: 1,
                        cursor: 'pointer',
                        '&:hover': {
                          backgroundColor: 'rgba(0, 0, 0, 0.04)',
                        },
                        borderRight: '1px solid',
                        borderBottom: '1px solid',
                        borderColor: theme.palette.divider,
                      }}
                    >
                      <Typography
                        variant="body2"
                        color={
                          isCurrentMonth ? 'text.primary' : 'text.disabled'
                        }
                        fontWeight={isCurrentMonth ? 'medium' : 'normal'}
                      >
                        {day}
                      </Typography>
                    </Box>
                  </Grid>
                )
              })}
            </Grid>
          ))}
        </CardContent>
      </Card>
    </Box>
  )
}
