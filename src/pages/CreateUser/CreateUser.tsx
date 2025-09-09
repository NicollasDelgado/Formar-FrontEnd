import { useState, useCallback } from 'react'

import {
  Box,
  Button,
  Grid,
  Typography,
  InputAdornment,
  IconButton,
  Icon,
  LinearProgress,
} from '@mui/material'
import { Link, useNavigate } from 'react-router-dom'

import { useForm } from 'react-hook-form'
import * as zod from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

import { createUser } from '../../api/api'
import { useToast } from '../../shared/hooks/Toast'
import { InputText } from '../../shared/components/hook-form-components/input-text'
import { AuthLayout } from '../../shared/layouts/AuthLayoutPage'

interface ICreateUserData {
  name: string
  email: string
  password: string
  password_confirmation: string
}

const CreateUserValidationSchema = zod
  .object({
    name: zod
      .string()
      .min(2, 'Nome deve ter no mínimo 2 caracteres')
      .max(100, 'Nome deve ter no máximo 100 caracteres'),
    email: zod
      .string()
      .email('Digite um e-mail válido')
      .min(1, 'E-mail é obrigatório'),
    password: zod
      .string()
      .min(6, 'Senha deve ter no mínimo 6 caracteres')
      .max(50, 'Senha deve ter no máximo 50 caracteres'),
    password_confirmation: zod
      .string()
      .min(6, 'Confirmação de senha deve ter no mínimo 6 caracteres'),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: 'As senhas não coincidem',
    path: ['password_confirmation'],
  })

type CreateUserFormType = zod.infer<typeof CreateUserValidationSchema>

export const CreateUser: React.FC = () => {
  const { addToast } = useToast()
  const navigate = useNavigate()

  const methods = useForm<CreateUserFormType>({
    resolver: zodResolver(CreateUserValidationSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      password_confirmation: '',
    },
  })

  const { handleSubmit, control } = methods

  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmitCreateUser = useCallback(
    async (data: ICreateUserData) => {
      try {
        setLoading(true)

        await createUser({
          name: data.name,
          email: data.email,
          password: data.password,
        })

        addToast({
          type: 'success',
          title: 'Usuário criado com sucesso',
          description: 'Você será redirecionado para a página de login',
        })
        
        // Redireciona para login após 2 segundos
        setTimeout(() => {
          navigate('/')
        }, 2000)
      } catch (err: any) {
        const errorMessage = err?.response?.data?.message || 
          'Erro ao criar usuário, verifique seus dados e tente novamente'
        
        addToast({
          type: 'error',
          title: 'Erro ao criar usuário',
          description: errorMessage,
        })
      } finally {
        setLoading(false)
      }
    },
    [addToast, navigate],
  )

  return (
    <AuthLayout>
      <Box mb={1}>
        <Typography variant="h4" component="h1" textAlign="center" gutterBottom>
          Criar Conta
        </Typography>
        <Typography variant="body2" textAlign="center" color="text.secondary">
          Preencha os dados abaixo para criar sua conta
        </Typography>
      </Box>

      <form onSubmit={handleSubmit(handleSubmitCreateUser)}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography mb={1} variant="body1">
              Nome Completo
            </Typography>
            <InputText
              name="name"
              label="Digite seu nome completo"
              control={control}
              placeholder="Ex: João Silva"
              disabled={loading}
            />
          </Grid>

          <Grid item xs={12}>
            <Typography mb={1} variant="body1">
              E-mail
            </Typography>
            <InputText
              name="email"
              label="Digite seu e-mail"
              control={control}
              type="email"
              placeholder="Ex: joao@email.com"
              disabled={loading}
            />
          </Grid>

          <Grid item xs={12}>
            <Typography mb={1} variant="body1">
              Senha
            </Typography>
            <InputText
              name="password"
              label="Digite sua senha"
              control={control}
              type={showPassword ? 'text' : 'password'}
              placeholder="Mínimo 6 caracteres"
              disabled={loading}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword((prev) => !prev)}
                      disabled={loading}
                      edge="end"
                    >
                      {showPassword ? (
                        <Icon>visibility</Icon>
                      ) : (
                        <Icon>visibility_off</Icon>
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <Typography mb={1} variant="body1">
              Confirmar Senha
            </Typography>
            <InputText
              name="password_confirmation"
              label="Confirme sua senha"
              control={control}
              type={showPassword ? 'text' : 'password'}
              placeholder="Digite novamente sua senha"
              disabled={loading}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword((prev) => !prev)}
                      disabled={loading}
                      edge="end"
                    >
                      {showPassword ? (
                        <Icon>visibility</Icon>
                      ) : (
                        <Icon>visibility_off</Icon>
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item xs={12}>
            {loading && <LinearProgress sx={{ mb: 2 }} />}
            <Button
              fullWidth
              variant="contained"
              type="submit"
              disabled={loading}
              size="large"
            >
              <Typography variant="button" color="white">
                {loading ? 'Criando conta...' : 'Criar Conta'}
              </Typography>
            </Button>
          </Grid>

          <Box
            width="100%"
            display="flex"
            justifyContent="center"
            alignItems="center"
            marginTop={2}
          >
            <Typography variant="body2" display="flex" alignItems="center">
              Já possui uma conta?
              <Link
                to="/"
                style={{
                  marginLeft: '8px',
                  textDecoration: 'none',
                }}
              >
                <Typography variant="body2" color="primary" fontWeight="bold">
                  Fazer Login
                </Typography>
              </Link>
            </Typography>
          </Box>
        </Grid>
      </form>
    </AuthLayout>
  )
}