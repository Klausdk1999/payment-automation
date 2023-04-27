/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { useState, useEffect } from 'react';
import { NextPage } from 'next';
import { api } from '../../utils/api';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import React from "react";
import {
  Paper,
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
  Select,
  MenuItem,
  Typography,
  Grid,
} from "@mui/material";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";

interface IPDV {
  id: string;
  type: string;
  company: string;
  // Add other fields as needed
}

interface IItem {
  id: string;
  name: string;
  price: number;
  // Add other fields as needed
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
  const [selectedItems, setSelectedItems] = useState<{ [itemId: string]: { item: IItem,quantity: number } }>({});
   
  const createOrderMutation = api.order.create.useMutation();

  // Fetch PDV and items
  const { data, isLoading } = api.items.getByPdvId.useQuery({
    pdvId: id as string,
  });

  if (!data || isLoading) return <div>Loading ...</div>;

  const pdv = data[0]?.pdv;
  const items = data.map((item) => item.item);
  
  // Handle item quantity change
  const handleQuantityChange = (itemId: string, item: IItem, quantity: number) => {
    setSelectedItems({
      ...selectedItems,
      [itemId]: { item, quantity },
    });
  };

  // Finalizar Compra
  const finalizePurchase = async () => {
    if (Object.keys(selectedItems).length === 0) {
      toast.error("Nenhum item selecionado.", {
        position: "top-right",
        autoClose: 3000,
        theme: "colored",
      });
      return;
    }

    try {
      // Transform selectedItems into the format expected by the mutation
      const itemsArray = Object.values(selectedItems).map((itemData) => ({
        itemId: itemData.item.id,
        quantity: itemData.quantity,
      }));

      // Calculate the total price
      const totalPrice = Object.values(selectedItems).reduce(
        (total, itemData) => total + itemData.item.price * itemData.quantity,
        0
      );

      const order = await createOrderMutation.mutateAsync({
        pdvId: id as string,
        items: itemsArray,
        price: totalPrice,
      });

      toast.success("Compra finalizada com sucesso!", {
        position: "top-right",
        autoClose: 3000,
        theme: "colored",
      });

      // Reset selectedItems after successful order
      setSelectedItems({});
    } catch (error) {
      toast.error(`Erro ao finalizar a compra`, {
        position: "top-right",
        autoClose: 5000,
        theme: "colored",
      });
    }
  };

  return (
    <div style={{ padding: 16, marginTop:-100 }}>
      <Typography variant="h4" gutterBottom>
        {pdv?.company}
      </Typography>
      <Grid container spacing={2}>
        {items.map((item) => (
          <Grid item key={item.id} xs={12} sm={6} md={4}>
            <Paper style={{ padding: 16, border: `1px solid`, borderRadius: 4 }}>
              <Typography variant="h5" gutterBottom>
                {item.name}
              </Typography>
              <Typography variant="body1" gutterBottom>
                Price: ${item.price}
              </Typography>
              <div style={{ display: 'flex', alignItems: 'center', marginTop: 8 }}>
                <Typography variant="body1" gutterBottom style={{ marginRight: 8 }}>
                  Quantidade:
                </Typography>
                <TextField
                  id={`quantity-${item.id}`}
                  type="number"
                  inputProps={{ min: 0 }}
                  value={selectedItems[item.id]?.quantity || 0}
                  onChange={(e) => handleQuantityChange(item.id, item, parseInt(e.target.value))}
                />
              </div>
              <Button
                variant="contained"
                style={{ color: 'white', marginTop: 16 }}
                onClick={() => console.log('Added to cart')}
              >
                Adicionar ao pedido
              </Button>
            </Paper>
          </Grid>
        ))}
      </Grid>
      <Paper style={{ padding: 16, border: `1px solid`, borderRadius: 4, marginTop: 16 }}>
        <Typography variant="h5" gutterBottom>
          Pedido
        </Typography>
        <Typography variant="body1" gutterBottom>
          Items: {Object.values(selectedItems)
            .map(
              (itemData) => `${itemData.item.name} (x${itemData.quantity})`
            )
            .join(", ")}
        </Typography>
        <Typography variant="body1" gutterBottom>
          Preço Total: ${Object.values(selectedItems).reduce(
            (total, itemData) => total + itemData.item.price * itemData.quantity,
            0
            ).toFixed(2)}
        </Typography>
        <Button
          variant="contained"
          style={{ color: 'white', marginTop: 16 }}
          onClick={() => {
            finalizePurchase().catch((error) => {
              console.error('Error finalizing purchase:', error);
            });
          }}
        >
          Finalizar Compra
        </Button>
      </Paper>
    </div>
  );
};

export default Store;
