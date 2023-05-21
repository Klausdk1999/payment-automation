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
      style={{
        padding: 16,
        border: `1px solid`,
        borderRadius: 4,
        marginTop: 16,
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
        style={{ color: 'white', marginTop: 16 }}
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
