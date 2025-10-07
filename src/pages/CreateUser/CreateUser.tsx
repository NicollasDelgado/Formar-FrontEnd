import { useState, useCallback } from 'react'

import { Box, Button, Grid, Typography, LinearProgress } from '@mui/material'
import { Link, useNavigate } from 'react-router-dom'

import { useForm } from 'react-hook-form'
import * as zod from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

import { createUser } from '../../api/api'
import { useToast } from '../../shared/hooks/Toast'
import { InputText } from '../../shared/components/hook-form-components/input-text'
import { CreateLayoutPage } from '../../shared/layouts/CreateLayoutPage'

interface ICreateUserData {
  name: string
  email: string
  whatsapp: string
}

const CreateUserValidationSchema = zod.object({
  name: zod
    .string()
    .min(2, 'Nome deve ter no mínimo 2 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres'),
  email: zod
    .string()
    .email('Digite um e-mail válido')
    .min(1, 'E-mail é obrigatório'),
  whatsapp: zod
    .string()
    .min(11, 'O número mínimo de caracteres é 11')
    .max(15, 'O número máximo de caracteres deve ser 15'),
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
      whatsapp: '',
    },
  })

  const { handleSubmit, control } = methods

  const [loading, setLoading] = useState(false)

  const handleSubmitCreateUser = useCallback(
    async (data: ICreateUserData) => {
      try {
        setLoading(true)

        await createUser({
          name: data.name,
          email: data.email,
          whatsapp: data.whatsapp,
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
        const errorMessage =
          err?.response?.data?.message ||
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
    <CreateLayoutPage>
      <Box mb={1}>
        <Button >
        <Typography
          variant="h4"
          component="h1"
          textAlign="center"
          gutterBottom
          fontFamily={'monospace'}
        >
          Criar Conta
        </Typography>
        </Button>
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
              placeholder="Ex: Fábio Amaral"
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
              placeholder="Ex: example@institutoformar.org"
              disabled={loading}
            />
          </Grid>

          <Grid item xs={12}>
            <Typography mb={1} variant="body1">
              WhatsApp
            </Typography>
            <InputText
              name="whatsapp"
              label="Digite seu Número de Telefone"
              control={control}
              placeholder="Ex: (19) 99999-9999"
              disabled={loading}
            />
          </Grid>

          <Grid item xs={12}>
            {loading && (
              <LinearProgress
                sx={{
                  mb: 2,
                  backgroundColor: (theme) => theme.palette.primary.main,
                }}
              />
            )}
            <Button
              fullWidth
              variant="contained"
              type="submit"
              disabled={loading}
              size="large"
              sx={{
                transition: 'backgroundColor 0.3 ease-in-out',
                '&:hover': {
                  backgroundColor: '#07a8f3ff',
                  transform: 'scale(1.02)',
                },
              }} // f000a8ff
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
                <Typography
                  variant="body2"
                  sx={{
                    transition: '0.5 ease-in-out',
                    color: '#d4c818ff',
                    fontWeight: 'bold',
                    '&:hover': { color: '#F9636B', transform: 'scale(1.04)' },
                  }}
                >
                  Fazer Login
                </Typography>
              </Link>
            </Typography>
          </Box>
        </Grid>
      </form>
    </CreateLayoutPage>
  )
}
