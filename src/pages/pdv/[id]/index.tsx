/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { useState } from 'react';
import type { NextPage } from 'next';
import { api } from '../../../utils/api';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import React from 'react';
import ItemCard from '../../../components/ItemCard';
import OrderSummaryCard from '../../../components/OrderSummary';
import {
  Paper,
  TextField,
  Box,
  Typography,
  Grid,
  CircularProgress,
} from '@mui/material';
import PaymentDialog from '../../../components/PaymentDialog';

interface IPDV {
  id: string;
  type: string;
  company: string;
}

export interface IItem {
  id: string;
  name: string;
  price: number;
  description?: string;
}
interface IItemsOnPDV {
  id: string;
  quantity: number;
  item: IItem[];
  pdv: IPDV;
}

const Store: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [selectedItems, setSelectedItems] = useState<{
    [itemId: string]: { item: IItem; quantity: number };
  }>({});
  const [dialogOpen, setDialogOpen] = useState(false);

  const createOrderMutation = api.order.create.useMutation();

  // Fetch PDV and items
  const { data, isLoading, isError } = api.items.getByPdvId.useQuery({
    pdvId: id as string,
  });

  if (isLoading) return <CircularProgress />;
  if (isError) return <div>Erro buscando informações.</div>;

  const pdv = data[0]?.pdv;
  const items = data.map(item => item.item);

  // Handle item quantity change
  const handleQuantityChange = (
    itemId: string,
    item: IItem,
    quantity: number,
  ) => {
    setSelectedItems({
      ...selectedItems,
      [itemId]: { item, quantity },
    });
  };

  // Finalizar Compra
  const finalizePurchase = async () => {
    if (Object.keys(selectedItems).length === 0) {
      toast.error('Nenhum item selecionado.', {
        position: 'top-right',
        autoClose: 3000,
        theme: 'colored',
      });
      return;
    }

    try {
      // Transform selectedItems into the format expected by the mutation
      const itemsArray = Object.values(selectedItems).map(itemData => ({
        itemId: itemData.item.id,
        quantity: itemData.quantity,
      }));

      // Calculate the total price
      const totalPrice = Object.values(selectedItems).reduce(
        (total, itemData) => total + itemData.item.price * itemData.quantity,
        0,
      );

      const order = await createOrderMutation.mutateAsync({
        pdvId: id as string,
        items: itemsArray,
        price: totalPrice,
      });

      setDialogOpen(true);

      toast.success('Compra finalizada com sucesso!', {
        position: 'top-right',
        autoClose: 3000,
        theme: 'colored',
      });

      setTimeout(() => {
        order.payment_link && window.open(order.payment_link, '_blank');
        setDialogOpen(false);
      }, 4000);

      // Reset selectedItems after successful order
      setSelectedItems({});
    } catch (error) {
      toast.error(`Erro ao finalizar a compra`, {
        position: 'top-right',
        autoClose: 5000,
        theme: 'colored',
      });
    }
  };

  return (
    <Box sx={{ padding: 2, marginTop: -12 }}>
      <PaymentDialog
        open={dialogOpen}
        text="Você será redirecionado para a página de pagamento"
      />
      <Typography variant="h4" gutterBottom>
        {pdv?.company}
      </Typography>
      <Grid container marginBottom={8} spacing={2}>
        {items.map(item => (
          <Grid item key={item.id} xs={12} sm={6} md={4}>
            <ItemCard
              item={item}
              selectedQuantity={selectedItems[item.id]?.quantity || 0}
              onQuantityChange={quantity =>
                handleQuantityChange(item.id, item, quantity)
              }
            />
          </Grid>
        ))}
      </Grid>
      <OrderSummaryCard
        selectedItems={selectedItems}
        finalizePurchase={finalizePurchase}
      />
    </Box>
  );
};

export default Store;
