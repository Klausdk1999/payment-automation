import React, { useState } from 'react';
import {
  Container, TextField, Button, Paper, Box,
} from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Swal from 'sweetalert2';
import { api } from '../../utils/api';
import { useFormik, Field, FormikProvider } from 'formik';
import { toFormikValidationSchema } from 'zod-formik-adapter';
import z from 'zod';

interface ItemInput {
  itemId: string;
  quantity: number;
}

const createOrderSchema = z.object({
  pdvId: z.string().min(1, 'Ponto de venda ID é obrigatório'),
  price: z.number().min(0, 'Preço total deve ser maior que zero'),
  items: z.array(
    z.object({
      itemId: z.string().min(1, 'Item ID é obrigatório'),
      quantity: z.number().min(1, 'Quantidade deve ser maior que zero'),
    }),
  ),
});

const CreateOrder = () => {
  const createOrderMutation = api.order.create.useMutation();
  const formik = useFormik({
    initialValues: {
      pdvId: '',
      price: 0,
      items: [] as ItemInput[],
    },
    validationSchema: toFormikValidationSchema(createOrderSchema),
    onSubmit: async (values: { pdvId: string; price: number; items: ItemInput[] }) => {
      try {
        const response = await createOrderMutation.mutateAsync(values);

        if (response.payment_link) {
          // Redirect to the payment URL
          window.location.href = response.payment_link;
        } else {
          toast.error('An error occurred while creating the order.');
        }
      } catch (error) {
        console.error(error);
        toast.error('An error occurred while creating the order.');
      }
    },
  });

  return (
    <Container>
      <FormikProvider value={formik}>
        <form onSubmit={formik.handleSubmit}>
          <Paper>
            <Box sx={{ padding: 2 }}>
              <Field
                name="pdvId"
                type="text"
                label="Ponto de venda ID"
                margin="normal"
                fullWidth
                as={TextField}
                error={formik.touched.pdvId && Boolean(formik.errors.pdvId)}
                helperText={formik.touched.pdvId && formik.errors.pdvId}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.pdvId}
              />
              <Field
                name="price"
                type="number"
                label="Preço total"
                margin="normal"
                fullWidth
                as={TextField}
                error={formik.touched.price && Boolean(formik.errors.price)}
                helperText={formik.touched.price && formik.errors.price}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.price}
              />
              {/* Render form fields for each item */}
                              {/* {formik.values.items.map((item, index) => (
                <Box key={index}>
                  <Field
                    name={`items[${index}].itemId`}
                    type="text"
                    label="Item ID"
                    margin="normal"
                    fullWidth
                    as={TextField}
                    error={
                      formik.touched.items &&
                      formik.touched.items[index]?.itemId &&
                      Boolean(formik.errors.items?.[index]?.itemId)
                    }
                    helperText={
                      formik.touched.items &&
                      formik.touched.items[index]?.itemId &&
                      formik.errors.items?.[index]?.itemId
                    }
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={item.itemId}
                  />
                  <Field
                    name={`items[${index}].quantity`}
                    type="number"
                    label="Quantidade"
                    margin="normal"
                    fullWidth
                    as={TextField}
                    error={
                      formik.touched.items &&
                      formik.touched.items[index]?.quantity &&
                      Boolean(formik.errors.items?.[index]?.quantity)
                    }
                    helperText={
                      formik.touched.items &&
                      formik.touched.items[index]?.quantity &&
                      formik.errors.items?.[index]?.quantity
                    }
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={item.quantity}
                  />
                </Box>
              ))}

              <Button
                onClick={() =>
                  formik.setFieldValue('items', [
                    ...formik.values.items,
                    { itemId: '', quantity: 1 },
                  ])
                }
              >
                Adicionar Item
              </Button> */}
              <Button type="submit" color="primary">
                Criar Pedido
              </Button>
            </Box>
          </Paper>
        </form>
      </FormikProvider>
      <ToastContainer />
    </Container>
  );
};

export default CreateOrder;

