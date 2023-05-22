import { Paper, TextField, Button, Typography } from '@mui/material';
import type { IItem } from '../pages/pdv/[id]';

interface ItemCardProps {
  item: IItem;
  selectedQuantity: number;
  onQuantityChange: (quantity: number) => void;
}

const ItemCard: React.FC<ItemCardProps> = ({
  item,
  selectedQuantity,
  onQuantityChange,
}) => {
  return (
    <Paper style={{ padding: 16, border: `1px solid`, borderRadius: 4 }}>
      <Typography variant="h5" gutterBottom>
        {item.name}
      </Typography>
      <Typography variant="body1" gutterBottom>
        {item.description}
      </Typography>
      <Typography variant="body1" gutterBottom>
        Preço: R$ {item.price.toFixed(2)}
      </Typography>
      <div style={{ display: 'flex', alignItems: 'center', marginTop: 8 }}>
        <Typography variant="body1" gutterBottom style={{ marginRight: 8 }}>
          Quantidade:
        </Typography>
        <TextField
          type="number"
          inputProps={{ min: 0 }}
          value={selectedQuantity}
          onChange={e => onQuantityChange(parseInt(e.target.value))}
        />
      </div>
      <Button variant="contained" style={{ marginTop: 16 }}>
        Adicionar ao pedido
      </Button>
    </Paper>
  );
};

export default ItemCard;
