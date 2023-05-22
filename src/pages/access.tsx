/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import * as React from 'react';
import Link from 'next/link';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import logo from '../assets/images/logo.png';
import Image from 'next/image';
import CircularProgress from 'material-ui/CircularProgress';
import Head from 'next/head';
import Typography from '@mui/material/Typography';
import { type NextPage } from 'next';
import { api } from '../utils/api';
import { useRouter } from 'next/router';
import Copyright from '../components/Copyright';
import { toast } from 'react-toastify';
import { useFormik, Field, FormikProvider } from 'formik';
import { toFormikValidationSchema } from 'zod-formik-adapter';
import z from 'zod';

const loginSchema = z.object({
  email: z
    .string({ required_error: 'Campo obrigatório' })
    .email('Digite um e-mail válido'),
  password: z
    .string({ required_error: 'Campo obrigatório' })
    .min(4, 'A senha tem no mínimo 4 caracteres'),
});

const Home: NextPage = () => {
  const router = useRouter();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const login = api.auth.accessPDV.useMutation({
    onSuccess: async data => {
      if (data.pdv) {
        localStorage.setItem('pdv', JSON.stringify(data.pdv));
        await router.push(`/pdv/${data.pdv.id}/item`);
      }
    },
    onError: err => {
      toast.error('Ocorreu um erro. Verifique suas credenciais.');
    },
  });

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: toFormikValidationSchema(loginSchema),
    onSubmit: values => {
      login.mutate({
        email: values.email,
        password: values.password,
      });
    },
  });

  return (
    <Container component="main" maxWidth="xs">
      <Head>
        <title>QuickPay Acesso</title>
      </Head>
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Image
          src={logo}
          alt="Logo da Empresa QuickPay"
          style={{
            width: '250px',
            height: '200px',
          }}
        />
        <Typography component="h1" variant="h5">
          Login para Controle de Loja
        </Typography>
        <FormikProvider value={formik}>
          <form noValidate onSubmit={formik.handleSubmit}>
            <Box sx={{ mt: 1 }}>
              <div>
                <Field
                  name="email"
                  type="email"
                  label="Login"
                  margin="normal"
                  fullWidth
                  value={formik.values.email}
                  as={TextField}
                  error={formik.touched.email && Boolean(formik.errors.email)}
                  helperText={formik.touched.email && formik.errors.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                <Field
                  name="password"
                  type="password"
                  label="Senha"
                  margin="normal"
                  fullWidth
                  value={formik.values.password}
                  as={TextField}
                  error={
                    formik.touched.password && Boolean(formik.errors.password)
                  }
                  helperText={formik.touched.password && formik.errors.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                  disabled={login.isLoading} // disable button when loading
                >
                  {login.isLoading ? <CircularProgress /> : 'Entrar'}
                </Button>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100%',
                  }}
                >
                  <Link href="/login">
                    <Typography color="primary">
                      Login para funcionários QuickPay
                    </Typography>
                  </Link>
                </div>
              </div>
            </Box>
          </form>
        </FormikProvider>
      </Box>
      <Copyright />
    </Container>
  );
};

export default Home;
