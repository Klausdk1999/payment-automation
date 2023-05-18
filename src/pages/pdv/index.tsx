/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import React, { useState, useEffect } from "react";
import { type NextPage } from "next";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";

import { Header } from "../../components/ItemOrderHeader";
import { ContentHeader } from "../../components/ContentHeader";
import { Edit } from "@mui/icons-material";
import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  TablePagination,
} from "@mui/material";

import { api } from "../../utils/api";
import { useRouter } from "next/router";
import { toast } from "react-toastify";

interface IPDVData {
  id: string;
  isActive: boolean;
  type: string;
  company: string;
  login: string;
  password: string;
}

const PDV: NextPage = () => {
  const router = useRouter();

  const getpdv = api.pdvs.getAll.useMutation({
    onSuccess: (data: IPDVData[]) => {
      if (data && data.length > 0) {
        setpdv(data);
      }
    },
    onError: (err) => {
      toast.error(`Ocorreu um erro. ${err.message.toString()}`, {
        position: "top-right",
        autoClose: 5000,
        theme: "colored",
      });
    },
  });

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [pdv, setpdv] = useState<IPDVData[]>(
    [] as IPDVData[]
  );
  const [filteredPDV, setFilteredPDV] = useState<IPDVData[]>(
    [] as IPDVData[]
  );

  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, pdv.length - page * rowsPerPage);

  useEffect(() => {
    getpdv.mutate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.reload]);

  useEffect(() => {
    setFilteredPDV(pdv);
  }, [pdv]);

  const handleAddPDV = () => {
    void router.push("/pdv/create");
  };

  const handleEditPDV = (id: string) => {
    const findPDV = pdv.find(
      (PDV) => PDV.id === id
    ) as IPDVData;

    const formattedPDV = JSON.stringify(findPDV);

    void router.push(
      {
        pathname: `/pdv/edit/[id]`,
        query: {
          id,
          PDVData: formattedPDV,
        },
      },
      `/pdv/edit/${id}`
    );
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
      <Header />
      <Container maxWidth="lg">
        <Box
          sx={{
            my: 4,
            display: "flex",
            flexDirection: "column",
            height: "100%",
          }}
        >
          <Box>
            <ContentHeader title="Pontos de Vendas" handleAdd={handleAddPDV} />
          </Box>
          <TableContainer
            component={Paper}
            sx={{
              mt: 2,
              bgcolor: "#fafafa",
              borderRadius: "5px 5px 0 0",
            }}
          >
            <Table size="small" aria-label="lista de pdvs">
              <TableHead>
                <TableRow>
                  <TableCell align="left">Editar</TableCell>
                  <TableCell align="left">Companhia</TableCell>
                  <TableCell align="left">Login</TableCell>
                  <TableCell align="left">Tipo</TableCell>
                  <TableCell align="left">Ativo</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(rowsPerPage > 0
                  ? filteredPDV.slice(
                      page * rowsPerPage,
                      page * rowsPerPage + rowsPerPage
                    )
                  : filteredPDV
                ).map((PDVData: IPDVData) => (
                  <TableRow key={PDVData?.id}>
                    <TableCell component="th" scope="row" align="left">
                      <IconButton
                        aria-label="Editar"
                        size="small"
                        onClick={() =>
                          handleEditPDV(PDVData?.id)
                        }
                      >
                        <Edit />
                      </IconButton>
                    </TableCell>
                    <TableCell component="th" scope="row"  align="left">
                      {PDVData.company}
                    </TableCell>
                    <TableCell component="th" scope="row"  align="left">
                      {PDVData.login}
                    </TableCell>
                    <TableCell component="th" scope="row"  align="left">
                      {PDVData.type}
                    </TableCell>
                    <TableCell component="th" scope="row" align="left">
                      {PDVData.isActive ? "Sim" : "Não"}
                    </TableCell>
                  </TableRow>
                ))}
                {emptyRows > 0 && (
                  <TableRow style={{ height: 43 * emptyRows }}>
                    <TableCell colSpan={10} />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, { label: "Todos", value: -1 }]}
            colSpan={10}
            component={Paper}
            count={filteredPDV.length}
            rowsPerPage={rowsPerPage}
            page={page}
            labelRowsPerPage="Linhas por página"
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            sx={{
              margin: 0,
              padding: 0,
              backgroundColor: "#fafafa",
              borderTopLeftRadius: "0",
              borderTopRightRadius: "0",
            }}
            size="small"
          />
        </Box>
      </Container>
    </>
  );
};

export default PDV;
