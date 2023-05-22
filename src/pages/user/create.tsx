/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import React from "react";
import { Paper, TextField, Button } from "@mui/material";
import { ContentHeader } from "../../components/ContentHeader";
import { type NextPage } from "next";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import { useRouter } from "next/router";
import { Header } from "../../components/Header";
import { api } from "../../utils/api";
import { toast } from "react-toastify";
import { useFormik, Field, FormikProvider } from "formik";
import { toFormikValidationSchema } from "zod-formik-adapter";
import z from "zod";

const createUserSchema = z.object({
  email: z
    .string({ required_error: "Campo obrigatório" })
    .email("Digite um email válido"),
  cpf_cnpj: z.string({ required_error: "Campo obrigatório" }),
  name: z
    .string({ required_error: "Campo obrigatório" })
    .min(2, "Digite pelo menos 2 caracteres"),
  password: z
    .string({ required_error: "Campo obrigatório" })
    .min(4, "Digite pelo menos 4 caracteres"),
});

const CreateUser: NextPage = () => {
  const router = useRouter();

  const createUser = api.users.create.useMutation({
    onSuccess: async () => {
      toast.success("Usuário criado com sucesso", {
        position: "top-right",
        autoClose: 3000,
        theme: "colored",
      });
      await router.push("/users");
    },
    onError: (err) => {
      toast.error("Erro ao criar usuário", {
        position: "top-right",
        autoClose: 5000,
        theme: "colored",
      });
      toast.error(err.message.toString(), {
        position: "top-right",
        autoClose: 5000,
        theme: "colored",
      });
    },
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      cpf_cnpj: "",
      password: "",
    },
    validationSchema: toFormikValidationSchema(createUserSchema),
    onSubmit: (values: { name: string; email: string; cpf_cnpj: string; password: string }) => {
      createUser.mutate(values);
    },
  });

  return (
    <>
      <Header />
      <Container>
        <Box
          sx={{
            my: 4,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            width: '100%',
          }}
        >
          <ContentHeader title="Adicionar usuário" />
          <FormikProvider value={formik}>
            <form onSubmit={formik.handleSubmit}>
              <Box
                display="flex"
                flexDirection="column"
                alignItems="start"
                component={Paper}
                width="100%"
                padding={4}
                mt={2}
              >
                <Field
                  name="name"
                  type="text"
                  label="Nome"
                  margin="normal"
                  autoFocus
                  fullWidth
                  as={TextField}
                  error={formik.touched.name && Boolean(formik.errors.name)}
                  helperText={formik.touched.name && formik.errors.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.name}
                />
                <Field
                  name="email"
                  type="email"
                  label="Email"
                  margin="normal"
                  fullWidth
                  as={TextField}
                  error={formik.touched.email && Boolean(formik.errors.email)}
                  helperText={formik.touched.email && formik.errors.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.email}
                />
                <Field
                  name="cpf_cnpj"
                  type="cpf_cnpj"
                  label="CPF/CNPJ"
                  margin="normal"
                  fullWidth
                  as={TextField}
                  error={
                    formik.touched.cpf_cnpj && Boolean(formik.errors.cpf_cnpj)
                  }
                  helperText={formik.touched.cpf_cnpj && formik.errors.cpf_cnpj}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.cpf_cnpj}
                />
                <Field
                  name="password"
                  type="password"
                  label="Senha"
                  margin="normal"
                  fullWidth
                  as={TextField}
                  error={
                    formik.touched.password && Boolean(formik.errors.password)
                  }
                  helperText={formik.touched.password && formik.errors.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.password}
                />
                <Box
                  sx={{
                    mt: 2,
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'row',
                    gap: 2,
                    alignItems: 'center',
                    justifyContent: 'right',
                  }}
                >
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => router.back()}
                    sx={{
                      padding: '0.35rem 1rem',
                    }}
                  >
                    Voltar
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    sx={{
                      padding: '0.35rem 1rem',
                    }}
                  >
                    Salvar
                  </Button>
                </Box>
              </Box>
            </form>
          </FormikProvider>
        </Box>
      </Container>
    </>
  );
};

export default CreateUser;
