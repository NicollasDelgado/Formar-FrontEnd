import React, { useState, useCallback } from 'react'

import { useForm } from 'react-hook-form'
import * as zod from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

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

import { useNavigate, Link } from 'react-router-dom'

import { useAuth } from '../../shared/hooks/auth'
import { useToast } from '../../shared/hooks/Toast'

import { InputText } from '../../shared/components/hook-form-components/input-text'
import { AuthLayout } from '../../shared/layouts/AuthLayoutPage'

const loginFormValidationSchema = zod.object({
  email: zod.string().email('Digite um email válido'),
  password: zod.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
})

type LoginFormType = zod.infer<typeof loginFormValidationSchema>

export const Login: React.FC = () => {
  const { addToast } = useToast()
  const navigate = useNavigate()

  const { signIn } = useAuth()

  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const methods = useForm<LoginFormType>({
    resolver: zodResolver(loginFormValidationSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const { handleSubmit, control } = methods

  const handleSubmitLogin = useCallback(
    async (data: LoginFormType) => {
      try {
        setLoading(true)

        const result = await signIn({
          email: data.email,
          password: data.password,
        })

        addToast({
          type: 'success',
          title: `Bem Vindo ${result?.user.name}`,
        })

        navigate('/home')
      } catch (err: any) {
        addToast({
          type: 'error',
          title: 'Erro ao logar',
          description: 'Verifique suas credenciais',
        })
      } finally {
        setLoading(false)
      }
    },
    [addToast, navigate, signIn],
  )

  return (
    <AuthLayout>
      <form onSubmit={handleSubmit(handleSubmitLogin)}>
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <Typography mb={1} variant="body1">
              E-mail
            </Typography>
          <InputText
            
              name="email"
              label="Digite seu e-mail"
              control={control}
              type="email"
              placeholder="Ex: example@institutoformar.org"
              disabled={loading}
              
            />
          </Grid>

          <Grid item xs={12}>
            <Typography mb={1} variant="body1">
              Senha
            </Typography>
            <InputText
              name="password"
              placeholder="Digite sua senha"
              type={showPassword ? 'text' : 'password'}
              control={control}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword((prev) => !prev)}
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
            <Box textAlign="end" marginRight={2}>
              <Typography variant="body2" display="flex" alignItems="center" justifyContent="flex-end">
                Não possui uma conta?
                <Link to="/CreateUser" style={{ marginLeft: '8px', textDecoration: 'none' }}>
                  <Typography variant="body2" color="primary" fontWeight="bold" sx={{
                    transition: 
                    "background-color 0.3 ease-in-out", 
                    "&:hover": {
                      color: '#f000a8ff', 
                    transform: "scale(1.02)"}}}>
                    Clique Aqui
                  </Typography>
                </Link>
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Box
              width="100%"
              display="flex"
              justifyContent="end"
              marginRight={2}
              marginBottom={1}
            >
              <Link
                style={{
                  cursor: 'pointer',
                  textDecoration: 'none',
                }}
                to="/forgot-password"
              >
                <Typography variant="body2" color="primary" fontWeight="bold" sx={{
                  transition: 
                  " 0.3 ease-in-out", 
                  "&:hover":{color: "#f000a8ff",
                   transform:"scale(1.04)" }}}>
                  Esqueci minha senha
                </Typography>
              </Link>
            </Box>
          </Grid>

          <Grid item xs={12}>
            {loading && <LinearProgress sx={{ 
              mb: 2
            }
            } />}
            <Button
            
              fullWidth
              variant="contained"
              type="submit"
              disabled={loading}
              size="large"
              sx ={{transition: "background-color 0.3 ease-in-out","&:hover": {backgroundColor: '#07a8f3ff', transform: "scale(1.02)"}}}
              
              
            >
              <Typography variant="button" color="white">
                {loading ? 'Entrando...' : 'Entrar'}
              </Typography>
            </Button>
          </Grid>
          
        </Grid>
      </form>
    </AuthLayout>
  )
}