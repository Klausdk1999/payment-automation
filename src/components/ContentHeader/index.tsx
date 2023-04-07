import React from 'react';

import { Box, Typography, Button } from '@mui/material';

interface IHeaderPageProps {
  title: string;
  handleAdd?: () => void;
}

export const ContentHeader: React.FC<IHeaderPageProps> = ({ title, handleAdd }) => {

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
      }}
    >
      <Typography variant="h4" component="h1">
        {title}
      </Typography>
      {handleAdd ? (
        <Button
          variant="contained"
          color="primary"
          onClick={handleAdd}
          sx={{
            padding: '0.35rem 1rem',
          }}
        >
          Adicionar
        </Button>
      ) : <></>}
    </Box>
  );
};
