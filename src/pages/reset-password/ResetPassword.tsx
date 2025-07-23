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
import { Link, useNavigate, useParams } from 'react-router-dom'

import { useForm } from 'react-hook-form'
import * as zod from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

import { resetPassword } from '../../api/api'
import { useToast } from '../../shared/hooks/Toast'
import { InputText } from '../../shared/components/hook-form-components/input-text'
import { AuthLayout } from '../../shared/layouts/AuthLayoutPage'

interface IData {
  password: string
  password_confirmation: string
}

const resetPasswordValidationSchema = zod.object({
  password_confirmation: zod
    .string()
    .min(6, 'Senha deve ter no mínimo 6 caracteres'),
  password: zod.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
})

type ResetPasswordFormType = zod.infer<typeof resetPasswordValidationSchema>

export const ResetPassword: React.FC = () => {
  const { addToast } = useToast()
  const navigate = useNavigate()
  const { token = '' } = useParams<'token'>()

  if (!token) {
    navigate('/')
  }

  const methods = useForm<ResetPasswordFormType>({
    resolver: zodResolver(resetPasswordValidationSchema),
    defaultValues: {
      password_confirmation: '',
      password: '',
    },
  })

  const { handleSubmit, control } = methods

  const [loading, setLoading] = useState(false)

  const [showPassword, setShowPassword] = useState(false)

  const handleSubmitResetPassword = useCallback(
    async (data: IData) => {
      try {
        setLoading(true)

        await resetPassword({ token, password: data.password })

        addToast({
          type: 'success',
          title: 'Senha alterada com sucesso',
        })
        navigate('/')
      } catch (err: any) {
        addToast({
          type: 'error',
          title: 'Erro ao alterar a senha, verifique seus dados',
        })
      } finally {
        setLoading(false)
      }
    },
    [addToast, navigate, token],
  )

  return (
    <AuthLayout>
      <form onSubmit={handleSubmit(handleSubmitResetPassword)}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography mb={1} variant="body1">
              Senha
            </Typography>
            <InputText
              name="password"
              label="Digite sua nova senha"
              control={control}
              type={showPassword ? 'text' : 'password'}
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
            <Typography mb={1} variant="body1">
              Confirme sua Senha
            </Typography>
            <InputText
              name="password_confirmation"
              placeholder="Confirme sua nova senha"
              control={control}
              type={showPassword ? 'text' : 'password'}
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
            {loading && <LinearProgress />}
            <Button
              fullWidth
              variant="contained"
              type="submit"
              disabled={loading}
            >
              <Typography variant="button" color="white">
                Enviar reset
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
            <Typography variant="body2" display="flex">
              Voltar para
              <Link
                to="/"
                style={{
                  marginLeft: '10px',
                }}
              >
                <Typography variant="body2" color="primary" fontWeight="bold">
                  Login
                </Typography>
              </Link>
            </Typography>
          </Box>
        </Grid>
      </form>
    </AuthLayout>
  )
}
