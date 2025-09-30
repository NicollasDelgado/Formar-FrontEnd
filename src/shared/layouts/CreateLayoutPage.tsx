import { useState } from 'react'
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Link, 
  Divider,
  InputAdornment,
  IconButton
} from '@mui/material'
import { Visibility, VisibilityOff } from '@mui/icons-material'

export const CreateAccountForm = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: ''
  })

  const handleChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }))
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    // Lógica de criação de conta aqui
    console.log('Dados do formulário:', formData)
  }

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
      {/* Título do Formulário */}
      <Typography variant="h4" component="h1" gutterBottom align="center" fontWeight="bold">
        Criar Conta
      </Typography>
      
      <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 3 }}>
        Preencha os dados abaixo para criar sua conta
      </Typography>

      {/* Campo Nome Completo */}
      <Typography variant="h6" component="h2" gutterBottom fontWeight="medium">
        Nome Completo
      </Typography>
      <TextField
        fullWidth
        placeholder="Digite seu nome completo"
        value={formData.fullName}
        onChange={handleChange('fullName')}
        sx={{ mb: 2 }}
        helperText="Ex: Fábio Amaral"
      />

      <Divider sx={{ my: 3 }} />

      {/* Campo E-mail */}
      <Typography variant="h6" component="h2" gutterBottom fontWeight="medium">
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

      {/* Campo WhatsApp */}
      <Typography variant="h6" component="h2" gutterBottom fontWeight="medium">
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

      {/* Campo Senha (adicionado para funcionalidade completa) */}
      <Typography variant="h6" component="h2" gutterBottom fontWeight="medium">
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
          )
        }}
        sx={{ mb: 3 }}
      />

      <Divider sx={{ my: 3 }} />

      {/* Botão CRIAR CONTA */}
      <Button
        type="submit"
        fullWidth
        variant="contained"
        size="large"
        sx={{
          py: 1.5,
          mb: 2,
          fontWeight: 'bold',
          fontSize: '1.1rem'
        }}
      >
        CRIAR CONTA
      </Button>

      {/* Link para Login */}
      <Typography variant="body2" align="center">
        Já possui uma conta?{' '}
        <Link 
          href="/login" 
          underline="hover" 
          fontWeight="medium"
        >
          Fazer Login
        </Link>
      </Typography>
    </Box>
  )
}