/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import logo from "../assets/images/logo.jpeg";
import Image from "next/image";
import Head from "next/head";
import { type NextPage } from "next";
import { api } from "../utils/api";
import { useRouter } from "next/router";
import Copyright from "../components/Copyright";
import { toast } from "react-toastify";
import { useFormik, Field, FormikProvider } from "formik";
import { toFormikValidationSchema } from "zod-formik-adapter";
import z from "zod";

const loginSchema = z.object({
  email: z
    .string({ required_error: "Campo obrigatório" })
    .email("Digite um e-mail válido"),
  password: z
    .string({ required_error: "Campo obrigatório" })
    .min(4, "A senha tem no mínimo 4 caracteres"),
});

const Home: NextPage = () => {
  const router = useRouter();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const login = api.auth.login.useMutation({
    onSuccess: async (data) => {
      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
      }
      await router.push("/pdv");
    },
    onError: (err) => {
      toast.error("Ocorreu um erro. Verifique suas credenciais.");
    },
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: toFormikValidationSchema(loginSchema),
    onSubmit: (values) => {
      login.mutate({
        email: values.email,
        password: values.password,
      });
    },
  });

  return (
    <Container component="main" maxWidth="xs">
      <Head>
        <title>QuickPay</title>
      </Head>
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Image
          src={logo}
          alt="Logo da Empresa QuickPay"
          style={{
            width: "250px",
            height: "200px",
          }}
        />
        <FormikProvider value={formik}>
          <form noValidate onSubmit={formik.handleSubmit}>
            <Box sx={{ mt: 1 }}>
              <div>
                <Field
                  name="email"
                  type="email"
                  label="E-mail"
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
                >
                  Entrar
                </Button>
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
