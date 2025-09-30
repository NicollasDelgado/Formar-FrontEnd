// src/pages/CreateUser/CreateUser.tsx
import { useState, ReactNode } from 'react'
import {
  Box,
  Typography,
  TextField,
  Button,
  Link,
  Divider,
  InputAdornment,
  IconButton,
} from '@mui/material'
import { Visibility, VisibilityOff } from '@mui/icons-material'

// Layout genérico para formulários
interface CreateLayoutPageProps {
  children: ReactNode
  title?: string
  subtitle?: string
}

export const CreateLayoutPage = ({
  children,
  title = 'Criar Conta',
  subtitle = 'Preencha os dados abaixo para criar sua conta',
}: CreateLayoutPageProps) => {
  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: 500,
        mx: 'auto',
        my: 4,
        px: 3,
      }}
    >
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        align="center"
        fontWeight="bold"
      >
        {title}
      </Typography>

      <Typography
        variant="body1"
        color="text.secondary"
        align="center"
        sx={{ mb: 3 }}
      >
        {subtitle}
      </Typography>

      {children}
    </Box>
  )
}

// Componente do formulário de criação de usuário
export const CreateUser = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
  })

  const handleChange =
    (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
      setFormData((prev) => ({ ...prev, [field]: e.target.value }))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Dados do formulário:', formData)
  }

  return (
    <CreateLayoutPage>
      <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
        {/* Nome Completo */}
        <Typography variant="h6" gutterBottom fontWeight="medium">
          Nome Completo
        </Typography>
        <TextField
          fullWidth
          placeholder="Digite seu nome completo"
          value={formData.fullName}
          onChange={handleChange('fullName')}
          sx={{ mb: 2 }}
        />

        <Divider sx={{ my: 2 }} />

        {/* Email */}
        <Typography variant="h6" gutterBottom fontWeight="medium">
          E-mail
        </Typography>
        <TextField
          fullWidth
          type="email"
          placeholder="Digite seu e-mail"
          value={formData.email}
          onChange={handleChange('email')}
          sx={{ mb: 3 }}
        />

        {/* WhatsApp */}
        <Typography variant="h6" gutterBottom fontWeight="medium">
          WhatsApp
        </Typography>
        <TextField
          fullWidth
          type="tel"
          placeholder="Digite seu Número de Telefone"
          value={formData.phone}
          onChange={handleChange('phone')}
          sx={{ mb: 3 }}
        />

        {/* Senha */}
        <Typography variant="h6" gutterBottom fontWeight="medium">
          Senha
        </Typography>
        <TextField
          fullWidth
          type={showPassword ? 'text' : 'password'}
          placeholder="Digite sua senha"
          value={formData.password}
          onChange={handleChange('password')}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{ mb: 3 }}
        />

        <Divider sx={{ my: 3 }} />

        {/* Botão Criar Conta */}
        <Button
          type="submit"
          fullWidth
          variant="contained"
          size="large"
          sx={{
            py: 1.5,
            mb: 2,
            fontWeight: 'bold',
            fontSize: '1.1rem',
          }}
        >
          CRIAR CONTA
        </Button>

        {/* Link Login */}
        <Typography variant="body2" align="center">
          Já possui uma conta?{' '}
          <Link href="/login" underline="hover" fontWeight="medium">
            Fazer Login
          </Link>
        </Typography>
      </Box>
    </CreateLayoutPage>
  )
}
