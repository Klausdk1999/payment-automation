/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import React, { useEffect, useState } from "react";
import {
  Paper,
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
  Select,
  MenuItem,
} from "@mui/material";
import { ContentHeader } from "../../../components/ContentHeader";
import { type NextPage } from "next";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import { useRouter } from "next/router";
import { Header } from "../../../components/Header";
import { api } from "../../../utils/api";
import { toast } from "react-toastify";
import { useFormik, Field, FormikProvider } from "formik";
import { toFormikValidationSchema } from "zod-formik-adapter";
import z from "zod";

const editpdvSchema = z.object({
  isActive: z.boolean(),
  type: z.string({ required_error: "Campo obrigatório" }),
  company: z.string({ required_error: "Campo obrigatório" }),
  login: z.string({ required_error: "Campo obrigatório" }),
  password: z.string({ required_error: "Campo obrigatório" }),
});

interface IPDVData {
  id: string;
  company: string;
  isActive: boolean;
  type: string;
  login: string;
  password: string;
}

const Editpdv: NextPage = () => {
  const router = useRouter();
  const { PDVData } = router.query;
  const [companypdv, setCompanypdv] = useState<IPDVData | null>(
    null
  );

  useEffect(() => {
    if (!router.isReady) {
      return;
    }

    if (
      PDVData &&
      PDVData.length > 0 &&
      typeof PDVData === "string"
    ) {
      const formattedData = JSON.parse(PDVData) as IPDVData;
      setCompanypdv(formattedData);
    }
  }, [PDVData, router.isReady]);

  const updatepdv = api.pdvs.updateById.useMutation({
    onSuccess: async () => {
      toast.success("PDV editado com sucesso.", {
        position: "top-right",
        autoClose: 3000,
        theme: "colored",
      });
      await router.push("/pdv");
    },
    onError: (err) => {
      toast.error(`Erro ao editar PDV. ${err.message.toString()}`, {
        position: "top-right",
        autoClose: 5000,
        theme: "colored",
      });
    },
  });

  const formik = useFormik({
    initialValues: {
      id: companypdv ? companypdv.id : "",
      type: companypdv ? companypdv.type : "",
      company: companypdv ? companypdv.company : "",
      isActive: companypdv ? companypdv?.isActive : true,
      login: companypdv ? companypdv.login : "",
      password: companypdv ? companypdv.password : "",
    },
    enableReinitialize: true,
    validationSchema: toFormikValidationSchema(editpdvSchema),
    onSubmit: (values) => {
      updatepdv.mutate({
        id: values.id,
        isActive: values.isActive,
        type: values.type,
        company: values.company,
        login: values.login,
        password: values.password,
      });
    },
  });

  return (
    <>
      <Header />
      <Container>
        <Box
          sx={{
            my: 4,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            width: "100%",
          }}
        >
          <ContentHeader title="Editar PDV" />
          <FormikProvider value={formik}>
            <form noValidate onSubmit={formik.handleSubmit}>
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
                  name="company"
                  type="text"
                  label="Nome da companhia"
                  margin="normal"
                  autoFocus
                  fullWidth
                  value={formik.values.company}
                  as={TextField}
                  error={
                    formik.touched.company &&
                    Boolean(formik.errors.company)
                  }
                  helperText={
                    formik.touched.company && formik.errors.company
                  }
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                <Field
                  name="type"
                  label="Tipo"
                  margin="normal"
                  fullWidth
                  value={formik.values.type}
                  as={Select}
                  error={
                    formik.touched.type &&
                    Boolean(formik.errors.type)
                  }
                  helperText={
                    formik.touched.type && formik.errors.type
                  }
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                >
                  <MenuItem value="manual">Manual</MenuItem>
                  <MenuItem value="automated">Automatizado</MenuItem>
                </Field>
                <Field
                  name="login"
                  type="login"
                  label="Login do PDV"
                  margin="normal"
                  fullWidth
                  value={formik.values.login}
                  as={TextField}
                  error={
                    formik.touched.login &&
                    Boolean(formik.errors.login)
                  }
                  helperText={
                    formik.touched.login && formik.errors.login
                  }
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                <Field
                  name="password"
                  type="password"
                  label="Senha do PDV"
                  margin="normal"
                  fullWidth
                  value={formik.values.password}
                  as={TextField}
                  error={
                    formik.touched.password &&
                    Boolean(formik.errors.password)
                  }
                  helperText={
                    formik.touched.password && formik.errors.password
                  }
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      name="role"
                      color="secondary"
                      checked={formik.values.isActive}
                      onChange={formik.handleChange}
                    />
                  }
                  label="PDV ativo"
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

export default Editpdv;
