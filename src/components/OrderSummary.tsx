import React from 'react';
import { Paper, Typography, Button } from '@mui/material';
import type { IItem } from '../pages/pdv/[id]';

interface OrderItem {
  item: IItem;
  quantity: number;
}

interface OrderSummaryCardProps {
  selectedItems: { [itemId: string]: OrderItem };
  finalizePurchase: () => Promise<void>;
}

const OrderSummaryCard: React.FC<OrderSummaryCardProps> = ({
  selectedItems,
  finalizePurchase,
}) => {
  const total = Object.values(selectedItems).reduce(
    (total, itemData) => total + itemData.item.price * itemData.quantity,
    0,
  );
  return (
    <Paper
      variant="outlined"
      square
      style={{
        padding: 16,
        marginTop: -200,
        bottom: 0,
        left: 0,
        right: 0,
        position: 'fixed',
      }}
    >
      <Typography variant="h5" gutterBottom>
        Pedido
      </Typography>
      <Typography variant="body1" gutterBottom>
        Items:{' '}
        {Object.values(selectedItems)
          .map(itemData => `${itemData.item.name} (x${itemData.quantity})`)
          .join(', ')}
      </Typography>
      <Typography variant="body1" gutterBottom>
        Preço Total: ${total.toFixed(2)}
      </Typography>
      <Button
        variant="contained"
        style={{ marginTop: 16 }}
        onClick={() => {
          finalizePurchase().catch(error => {
            console.error('Error finalizing purchase:', error);
          });
        }}
      >
        Finalizar Compra
      </Button>
    </Paper>
  );
};

export default OrderSummaryCard;
