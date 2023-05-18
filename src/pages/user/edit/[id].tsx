/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unused-vars */
// lista de licensas
import React, { useEffect, useState } from 'react';
import { type NextPage } from "next";
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import { Paper, TextField, FormControlLabel, Checkbox, Button } from '@mui/material';
import { ContentHeader } from '../../../components/ContentHeader';

import { Header } from '../../../components/ItemOrderHeader';

import { useRouter } from 'next/router';
import { api } from "../../../utils/api";
import { z } from 'zod';
import { toast } from 'react-toastify';
import { FormikProvider, useFormik } from 'formik';
import { toFormikValidationSchema } from 'zod-formik-adapter';
import type { User as IUser } from '@prisma/client';

const editUserSchema = z.object({
  email: z
    .string({ required_error: "Campo obrigatório" })
    .email("Digite um email válido"),
  cpf_cnpj: z.string({ required_error: "Campo obrigatório" }),
  name: z
    .string({ required_error: "Campo obrigatório" })
    .min(2, "Digite pelo menos 2 caracteres"),
  new_password: z
    .string()
    .min(4, "Digite pelo menos 4 caracteres")
    .optional(),
  confirm_password: z.string().optional(),
}).refine((data) => data.new_password === data.confirm_password, {
  message: "Senhas não conferem.",
  path: ["confirm_password"],
});

const EditUser: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [user, setUser] = useState<IUser | null>(null);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getUser: any = api.users.getById.useMutation({
    onSuccess: (data) => {
      if (data) {
        setUser(data);
      }
    },
    onError: (err) => {
      toast.error(`Erro carregar dados. ${err.message.toString()}`, {
        position: "top-right",
        autoClose: 5000,
        theme: "colored",
      });
    },
  });

  useEffect(() => {
    if (!router.isReady){
      return;
    }

    if (id && id.length > 0) getUser.mutate({id});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const updateUser = api.users.updateById.useMutation({
    onSuccess: async () => {
      toast.success("Usuário editado com sucesso", {
        position: "top-right",
        autoClose: 3000,
        theme: "colored",
      });
      await router.push("/users");
    },
    onError: (err) => {
      toast.error(`Erro ao editar usuário. ${err.message.toString()}`, {
        position: "top-right",
        autoClose: 5000,
        theme: "colored",
      });
    },
  });

  const formik = useFormik({
    initialValues: {
      id: user ? user.id : '',
      name: user ? user.name : '',
      cpf_cnpj: user ? user.cpf_cnpj : '',
      email: user ? user.email : '',
      new_password: '',
      confirm_password: '',
    },
    enableReinitialize: true,
    validationSchema: toFormikValidationSchema(editUserSchema),
    onSubmit: (values: { 
      id: string;
      name: string;
      email: string;
      cpf_cnpj: string;
      new_password: string;
      confirm_password: string;
    }) => {
      if (values.new_password && values.new_password.length > 0){
        updateUser.mutate(values);
      } else {
        updateUser.mutate({
          id: values.id,
          name: values.name,
          email: values.email,
          cpf_cnpj: values.cpf_cnpj,
        });
      }
    },
  });


  return (
    <>
      <Header />
      <Container maxWidth="lg">
        <Box
          sx={{
            my: 4,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            width: "100%",
          }}
        >
          <ContentHeader title="Editar usuário" />
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
                <TextField
                  id="name"
                  label="Nome"
                  name="name"
                  autoComplete="name"
                  margin="normal"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  error={formik.touched.name && Boolean(formik.errors.name)}
                  helperText={formik.touched.name && formik.errors.name}
                  autoFocus
                  fullWidth
                />
                <TextField
                  id="email"
                  label="E-mail"
                  name="email"
                  autoComplete="email"
                  margin="normal"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  error={formik.touched.email && Boolean(formik.errors.email)}
                  helperText={formik.touched.email && formik.errors.email}
                  fullWidth
                />
                <TextField
                  id="cpf_cnpj"
                  label="CPF/CNPJ"
                  name="cpf_cnpj"
                  autoComplete="cpf_cnpj"
                  margin="normal"
                  value={formik.values.cpf_cnpj}
                  onChange={formik.handleChange}
                  error={formik.touched.cpf_cnpj && Boolean(formik.errors.cpf_cnpj)}
                  helperText={formik.touched.cpf_cnpj && formik.errors.cpf_cnpj}
                  fullWidth
                />
                <TextField
                  id="new_password"
                  label="Nova Senha"
                  name="new_password"
                  type="password"
                  autoComplete="new_password"
                  margin="normal"
                  value={formik.values.new_password}
                  onChange={(e) => {
                    formik.handleChange(e);
                    if (e.target.value === ''){
                      void formik.setFieldValue('confirm_password', '');
                    }
                  }}
                  error={
                    formik.touched.new_password &&
                    Boolean(formik.errors.new_password)
                  }
                  helperText={
                    formik.touched.new_password && formik.errors.new_password
                  }
                  fullWidth
                />
                <TextField
                  id="confirm_password"
                  label="Confirmar Senha"
                  name="confirm_password"
                  type="password"
                  autoComplete="confirm_password"
                  margin="normal"
                  value={formik.values.confirm_password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleChange}
                  error={
                    formik.touched.confirm_password &&
                    Boolean(formik.errors.confirm_password)
                  }
                  helperText={
                    formik.touched.confirm_password && formik.errors.confirm_password
                  }
                  fullWidth
                  disabled={!formik.values.new_password}
                />
                <Box
                  sx={{
                    mt: 2,
                    width: "100%",
                    display: "flex",
                    flexDirection: "row",
                    gap: 2,
                    alignItems: "center",
                    justifyContent: "right",
                  }}
                >
                  <Button
                    variant="contained"
                    color="inherit"
                    onClick={() => router.back()}
                    sx={{
                      padding: "0.35rem 1rem",
                    }}
                  >
                    Voltar
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    sx={{
                      padding: "0.35rem 1rem",
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

export default EditUser;