/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import React from "react";
import { Paper, TextField, Button } from "@mui/material";
import { ContentHeader } from "../../../../components/ContentHeader";
import { type NextPage } from "next";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import { useRouter } from "next/router";
import { Header } from "../../../../components/Header";
import { api } from "../../../../utils/api";
import { toast } from "react-toastify";
import { useFormik, Field, FormikProvider } from "formik";
import { toFormikValidationSchema } from "zod-formik-adapter";
import z from "zod";

const createItemSchema = z.object({
  name: z.string({ required_error: "Campo obrigatório" }),
  description: z.string({ required_error: "Campo obrigatório" }).min(4, "Digite pelo menos 4 caracteres"),
  price: z.number({ required_error: "Campo obrigatório" }),
  quantity: z.number({ required_error: "Campo obrigatório" }).int(),
});

const CreateItem: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const createItem = api.items.create.useMutation({
    onSuccess: (createdItem) => {
      toast.success("Item criado com sucesso", {
        position: "top-right",
        autoClose: 3000,
        theme: "colored",
      });
      linkItemToPdv.mutate({
        pdvId: id as string,
        itemId: createdItem.id,
        quantity: formik.values.quantity,
      });
    },
    onError: (err) => {
      toast.error("Erro ao criar item", {
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

  const linkItemToPdv = api.pdvs.linkItemToPdv.useMutation({
    onSuccess: async () => {
      toast.success("Item associado ao pdv com sucesso", {
        position: "top-right",
        autoClose: 3000,
        theme: "colored",
      });
      await router.push(`/pdv/${id as string}`);
    },
    onError: (err) => {
      toast.error("Erro ao associar item ao pdv", {
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
      description: "",
      price: 1,
      pdvId: id as string,
      itemId: "",
      quantity: 1,
    },
    validationSchema: toFormikValidationSchema(createItemSchema),
    onSubmit: (values: { 
      name: string; 
      description: string; 
      price: number;
      pdvId: string;
      itemId: string;
      quantity: number;
    }) => {
      createItem.mutate({
        name: values.name,
        description: values.description,
        price: values.price,
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
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          width: '100%',
        }}
      >
        <ContentHeader title="Adicionar item" />
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
                label="Nome do item"
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
                name="description"
                type="text"
                label="Descrição"
                margin="normal"
                fullWidth
                as={TextField}
                error={formik.touched.description && Boolean(formik.errors.description)}
                helperText={formik.touched.description && formik.errors.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.description}
              />
              <Field
                name="price"
                type="number"
                label="Preço"
                margin="normal"
                fullWidth
                as={TextField}
                error={formik.touched.price && Boolean(formik.errors.price)}
                helperText={formik.touched.price && formik.errors.price}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.price}
              />
              <Field
                name="quantity"
                type="number"
                label="Quantidade"
                margin="normal"
                fullWidth
                as={TextField}
                error={formik.touched.quantity && Boolean(formik.errors.quantity)}
                helperText={formik.touched.quantity && formik.errors.quantity}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.quantity}
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

export default CreateItem;
