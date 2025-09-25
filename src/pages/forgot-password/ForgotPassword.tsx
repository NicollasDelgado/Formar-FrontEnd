import { useState, useCallback, useRef } from 'react'

import { useForm } from 'react-hook-form'
import * as zod from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

import { Box, Button, Grid, Typography, LinearProgress } from '@mui/material'

import { Link, useNavigate } from 'react-router-dom'

import { useToast } from '../../shared/hooks/Toast'

import { InputText } from '../../shared/components/hook-form-components/input-text'
import { forgotPassword } from '../../api/api'
import { ForgoutLayoutPage } from '../../shared/layouts/ForgoutLayoutPage'

const forgotPasswordValidationSchema = zod.object({
  email: zod.string().email('Digite um email válido'),
})

type ForgotPasswordFormType = zod.infer<typeof forgotPasswordValidationSchema>

export const ForgotPassword: React.FC = () => {
  const navigate = useNavigate()
  const timeToBack = useRef<NodeJS.Timeout>()

  const { addToast } = useToast()

  const [loading, setLoading] = useState(false)

  const methods = useForm<ForgotPasswordFormType>({
    resolver: zodResolver(forgotPasswordValidationSchema),
    defaultValues: {
      email: '',
    },
  })

  const { handleSubmit, control } = methods

  const handleSubmitForgotPassword = useCallback(
    async (data: ForgotPasswordFormType) => {
      try {
        setLoading(true)

        await forgotPassword(data.email)

        addToast({
          type: 'success',
          title: 'Verifique seu email para resetar sua senha !',
        })

        if (timeToBack.current) {
          clearTimeout(timeToBack.current)
        }
        timeToBack.current = setTimeout(() => {
          navigate('/')
        }, 2000)
      } catch (err: any) {
        addToast({
          type: 'error',
          title: 'Algo deu errado',
          description:
            'Tente novamente, verifique se o email informado está correto !',
        })
      } finally {
        setLoading(false)
      }
    },
    [addToast, navigate],
  )

  return (
    <ForgoutLayoutPage>
      <form onSubmit={handleSubmit(handleSubmitForgotPassword)}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography mb={1} variant="body1">
              E-mail
            </Typography>
            <InputText
              name="email"
              placeholder="Digite seu email"
              control={control}
              type="email"
            />
          </Grid>

          <Grid item xs={12}>
            {loading && <LinearProgress />}
            <Button
              fullWidth
              variant="contained"
              type="submit"
              disabled={loading}
              size="large"
              sx={{
                transition: 'background-color 0.3s ease-in-out',
                '&:hover': {
                  backgroundColor: '#07a8f3ff',
                  transform: 'scale(1.02)',
                },
                mb: 3,
              }}
            >
              <Typography variant="button" color="white">
                Enviar
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
                <Typography variant="body2"
                  color="primary"
                  fontWeight="bold"
                  sx={{
                    transition: '0.3s ease-in-out',
                    '&:hover': {
                      color: '#F9636B',
                      transform: 'scale(1.04)',
                    },
                  }}>
                  Página de Login
                </Typography>
              </Link>
            </Typography>
          </Box>
        </Grid>
      </form>
    </ForgoutLayoutPage>
  )
}
