import React from 'react';
import { Dialog, DialogTitle, DialogContentText, Box } from '@mui/material';

type PaymentDialogProps = {
  open: boolean;
  text: string;
};

const PaymentDialog: React.FC<PaymentDialogProps> = ({ open, text }) => {
  return (
    <Dialog
      open={open}
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      onClose={() => { }}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      sx={{ minWidth: '400px', bgcolor:'#1da89a' }} // Set width here
    >
      <DialogTitle id="alert-dialog-title">{"Atenção"}</DialogTitle>
      <Box p={2}> {/* Add padding here */}
        <DialogTitle id="alert-dialog-description">
          {text}
        </DialogTitle>
      </Box>
    </Dialog>
  );
}

export default PaymentDialog;
