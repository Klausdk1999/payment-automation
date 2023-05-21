/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import React, { useState, useEffect } from "react";
import { TRPCClientError } from '@trpc/client';
import { type NextPage } from "next";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import { ItemOrderHeader } from "../../../../components/ItemOrderHeader";
import { ContentHeader } from "../../../../components/ContentHeader";
import { Edit, Delete } from "@mui/icons-material";
import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  TableFooter,
  TablePagination,
  CircularProgress,
  Skeleton,
} from "@mui/material";

import { api } from "../../../../utils/api";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const PDVItems: NextPage = () => {
  const router = useRouter();
  
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [findName, setFindName] = useState("");
  const [items, setItems] = useState<any[]>([]);
  const { id } = router.query;
  
  const itemsQuery = api.items.getByPdvId.useQuery({ pdvId: id as string }, { suspense: false });
  const deleteItemMutation = api.items.deleteById.useMutation();

  useEffect(() => {
    setItems(itemsQuery.data ?? []);
  }, [itemsQuery.data]);
  
  useEffect(() => {
    if ( items.length === 0) return;
    setItems( items.filter(
      (item) =>
        item.item.name.toUpperCase().trim().indexOf(findName.toUpperCase().trim()) >=
        0
    ));
    setPage(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [findName]);

  if (itemsQuery.error) {
    console.error(itemsQuery.error); // eslint-disable-line no-console
    return <div>An error occurred</div>;
  }
 
  if (itemsQuery.isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  const deleteItemById = async (id: string) => {
    try {
      await deleteItemMutation.mutateAsync({ id });
      toast.success("Item excluído com sucesso.", {
        position: "top-right",
        autoClose: 3000,
        theme: "colored",
      });
      router.reload();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'An error occurred';
      toast.error(`Ocorreu um erro. ${message}`, {
        position: "top-right",
        autoClose: 5000,
        theme: "colored",
      });
    }
  };
  
  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, items.length - page * rowsPerPage);

 
  const handleAddItem = () => {
    if(id && typeof id === "string"){
      void router.push(`/pdv/${id}/item/create`);
    }
  };

  const handleDeleteItem = (id: string) => {
    void Swal.fire({
      title: "Deseja excluir?",
      text: "Essa opção não poderá ser revertida.",
      icon: "warning",
      showCancelButton: true,
      cancelButtonColor: "#3085d6",
      confirmButtonColor: "#d33",
      cancelButtonText: "Não",
      confirmButtonText: "Sim",
    }).then((result: { isConfirmed: any }) => {
      if (result.isConfirmed) {
        try {
          void deleteItemById( id );
        } catch (error: any) {
          toast.error(error.response.data.message, {
            position: toast.POSITION.TOP_RIGHT,
            theme: "colored",
            autoClose: 5000,
          });
        }
      }
    });
  };

  const handleEditItem = (itemid: string) => {
    if(id && typeof id === "string"){
      void router.push(`/pdv/${id}/item/edit/${itemid}`);
    }
  };

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value));
    setPage(0);
  };

  return (
    <>
      {id && typeof id === "string" && <ItemOrderHeader id={id} />}
      
      {items ? (
      <Container maxWidth="lg" sx={{ mt: "75px" }}>
        <Box
          sx={{
            my: 4,
            display: "flex",
            flexDirection: "column",
            // justifyContent: 'center',
            // alignItems: 'center',
            height: "100%",
          }}
        >
          <Box>
            <ContentHeader title="Items" handleAdd={handleAddItem} />
            <TextField
              label="Pesquisar"
              name="find"
              margin="dense"
              size="small"
              variant="outlined"
              fullWidth
              value={findName}
              sx={{
                marginTop: 4,
                maxWidth: "400px",
              }}
              onChange={(value) => {
                if (value.target.value === "") {
                  setFindName(value.target.value);
                  setItems(itemsQuery.data ?? []);
                }else{
                setFindName(value.target.value);
              }}}
            />
          </Box>
          <TableContainer
            component={Paper}
            sx={{
              mt: 2,
              bgcolor: "#fafafa",
            }}
          >
            <Table size="small" aria-label="lista de items">
              <TableHead>
                <TableRow>
                  <TableCell align="center">Editar</TableCell>
                  <TableCell align="left">Item</TableCell>
                  <TableCell align="left">Descrição</TableCell>
                  <TableCell align="left">Preço</TableCell>
                  <TableCell align="left">Quantidade</TableCell>
                  <TableCell align="center">Excluir</TableCell>
                  
                </TableRow>
              </TableHead>
              <TableBody>
                {(rowsPerPage > 0
                  ? items.slice(
                      page * rowsPerPage,
                      page * rowsPerPage + rowsPerPage
                    )
                  : items
                ).map((itemsOnPDV) => (
                  <>
                    <TableRow key={itemsOnPDV.item.id}>
                      <TableCell component="th" scope="row">
                        <IconButton
                          aria-label="Editar"
                          size="small"
                          onClick={() => handleEditItem(itemsOnPDV.item.id)}
                        >
                          <Edit />
                        </IconButton>
                      </TableCell>
                      <TableCell
                        component="th"
                        scope="row"
                        sx={{
                          width: "50%",
                        }}
                      >
                        {itemsOnPDV.item.name}
                      </TableCell>
                      <TableCell
                        component="th"
                        scope="row"
                        sx={{
                          width: "50%",
                        }}
                      >
                        {itemsOnPDV.item.description}
                      </TableCell>
                      <TableCell
                        component="th"
                        scope="row"
                        sx={{
                          width: "50%",
                        }}
                      >
                        {itemsOnPDV.item.price}
                      </TableCell>
                      <TableCell
                        component="th"
                        scope="row"
                        sx={{
                          width: "50%",
                        }}
                      >
                        {itemsOnPDV.quantity}
                      </TableCell>
                        <TableCell component="th" scope="row">
                          <IconButton
                            aria-label="Deletar"
                            size="small"
                            onClick={() => handleDeleteItem(itemsOnPDV.item.id)}
                          >
                            <Delete />
                          </IconButton>
                        </TableCell>
                     
                    </TableRow>
                  </>
                ))}
                {emptyRows > 0 && (
                  <TableRow style={{ height: 43 * emptyRows }}>
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TablePagination
                    rowsPerPageOptions={[5, 10, { label: "Todos", value: -1 }]}
                    colSpan={4}
                    count={items.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    labelRowsPerPage="Linhas por página"
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                  />
                </TableRow>
              </TableFooter>
            </Table>
          </TableContainer>
        </Box>
      </Container>) : (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
          }}
        >
          <Skeleton variant="text" />
          <Skeleton variant="rectangular" width={210} height={118} />
        </Box>
      )}
    </>
  );
};

export default PDVItems;
