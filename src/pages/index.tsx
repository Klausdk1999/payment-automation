/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import * as React from "react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import logo from "../assets/images/logo-brasao-bpm.svg";
import Image from "next/image";
import Head from "next/head";
import { type NextPage } from "next";
import { useRouter } from "next/router";
import Copyright from "../components/Copyright";
import { toast } from "react-toastify";

const Home: NextPage = () => {
  const router = useRouter();
  
  function goToLogin() {
    try {
      void router.push("/login");
    } catch (error) {
      toast.error(JSON.stringify(error));
    }
  }
  return (
    <Container component="main" maxWidth="xs">
      <Head>
        <title>BPM - Licenses</title>
      </Head>
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Image
          src={logo}
          alt="Logo da Empresa Brasão Sistemas"
          style={{
            width: "250px",
          }}
        />
        <Typography component="h1" variant="h5" mt={1}>
          Licenças
        </Typography>
        <Box sx={{ mt: 1 }}>
          <div>
            
            <Button
              onClick={() => goToLogin()}
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Login
            </Button>
          </div>
        </Box>
      </Box>
      <Copyright />
    </Container>
  );
};

export default Home;
