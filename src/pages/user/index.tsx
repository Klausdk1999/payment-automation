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

import { Header } from "../../components/Header";
import { ContentHeader } from "../../components/ContentHeader";
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
} from "@mui/material";

import { api } from "../../utils/api";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import type { User as IUser } from "@prisma/client";
interface userData {
  name: string;
  email: string;
  role: string;
  id: string;
}

const User: NextPage = () => {
  const [userData, setUserData] = useState<userData>({
    name: "",
    email: "",
    role: "",
    id: "",
  });
  let data: userData = userData;
  if (typeof window !== "undefined") {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    data = JSON.parse(localStorage.getItem("user")!);
  }
  const windowType = typeof window;
  useEffect(() => {
    if (data) {
      setUserData(data);
    }
  }, [windowType]);

  const router = useRouter();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getUsers: any = api.users.getAll.useQuery();

  const deleteUserById = api.users.deleteById.useMutation({
    onSuccess: () => {
      toast.success("Usuário excluído com sucesso.", {
        position: "top-right",
        autoClose: 3000,
        theme: "colored",
      });
      router.reload();
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
  const [findName, setFindName] = useState("");
  const [users, setUsers] = useState<IUser[]>([] as IUser[]);
  const [filteredUsers, setFilteredUsers] = useState<IUser[]>([] as IUser[]);

  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, users.length - page * rowsPerPage);

  useEffect(() => {
    if (getUsers.data && getUsers.data.length > 0) {
      const tempUsers: IUser[] = getUsers.data;
      setUsers(tempUsers);
    }
  }, [getUsers]);

  useEffect(() => {
    if (userData && userData.role === "user") {
      setFilteredUsers(users.filter((user) => user.id === userData.id));
    } else {
      setFilteredUsers(users);
    }
  }, [users]);

  useEffect(() => {
    setFilteredUsers(users.filter(
      (user) =>
        user.name.toUpperCase().trim().indexOf(findName.toUpperCase().trim()) >=
        0
    ));

    setPage(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [findName]);

  const handleAddUser = () => {
    void router.push("/users/create");
  };

  const handleDeleteUser = (id: string) => {
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
          deleteUserById.mutate({ id });
          // setFilteredUsers(filteredUsers.filter(user => user.id !== id));
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

  const handleEditUser = (id: string) => {
    void router.push(`/users/edit/${id}`);
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
            {userData && userData.role === "admin" ? (
              <ContentHeader title="Usuários" handleAdd={handleAddUser} />
            ) : (
              <ContentHeader title="Usuários" />
            )}
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
                setFindName(value.target.value);
              }}
            />
          </Box>
          <TableContainer
            component={Paper}
            sx={{
              mt: 2,
              bgcolor: "#fafafa",
            }}
          >
            <Table size="small" aria-label="lista de usuários">
              <TableHead>
                <TableRow>
                  <TableCell align="center">Editar</TableCell>
                  <TableCell align="left">Usuário</TableCell>
                  <TableCell align="left">E-mail</TableCell>
                  {userData && userData.role === "admin" ? (
                    <TableCell align="center">Excluir</TableCell>
                  ) : null}
                </TableRow>
              </TableHead>
              <TableBody>
                {(rowsPerPage > 0
                  ? filteredUsers.slice(
                      page * rowsPerPage,
                      page * rowsPerPage + rowsPerPage
                    )
                  : filteredUsers
                ).map((user) => (
                  <>
                    <TableRow key={user.id}>
                      <TableCell component="th" scope="row">
                        <IconButton
                          aria-label="Editar"
                          size="small"
                          onClick={() => handleEditUser(user.id)}
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
                        {user.name}
                      </TableCell>
                      <TableCell
                        component="th"
                        scope="row"
                        sx={{
                          width: "50%",
                        }}
                      >
                        {user.email}
                      </TableCell>
                      {userData && userData.role === "admin" ? (
                        <TableCell component="th" scope="row">
                          <IconButton
                            aria-label="Deletar"
                            size="small"
                            onClick={() => handleDeleteUser(user.id)}
                          >
                            <Delete />
                          </IconButton>
                        </TableCell>
                      ) : null}
                    </TableRow>
                  </>
                ))}
                {emptyRows > 0 && (
                  <TableRow style={{ height: 43 * emptyRows }}>
                    <TableCell colSpan={4} />
                  </TableRow>
                )}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TablePagination
                    rowsPerPageOptions={[5, 10, { label: "Todos", value: -1 }]}
                    colSpan={4}
                    count={filteredUsers.length}
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
      </Container>
    </>
  );
};

export default User;
