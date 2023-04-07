/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import * as React from 'react';
import logo from './../../assets/images/logo-brasao-bpm.svg';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import PowerSettingsNewRoundedIcon from '@mui/icons-material/PowerSettingsNewRounded';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import Image from 'next/image';

import { useRouter } from 'next/router';
import { api } from '../../utils/api';
import { toast } from 'react-toastify';

const pages = ['Licenças', 'Usuários'];

export function Header() {
  const router = useRouter();

  const logout = api.auth.logout.useMutation({
    onSuccess: () => router.push('/'),
    onError: () => {
      toast.error("Ocorreu um erro", {
        position: "top-right",
        autoClose: 5000,
        theme: "colored",
      });
    },
  });

  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };
  
  const handleMenuClick = (page: string) => {
    handleCloseNavMenu();

    if (page === 'Licenças') {
      void router.push('/licenses');
    } else {
      void router.push('/users');
    }
  };
  
  const handleLogOut = () => {
    logout.mutate({});
  };

  return (
    <AppBar sx={{ backgroundColor: '#fafafa' }}>
      <Container maxWidth="xl" sx={{ backgroundColor: '#fafafa' }}>
        <Toolbar disableGutters>
          <Box 
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            <Image
              src={logo}
              alt="Logo da empresa Brasão Sistemas"
              width="150"
              height="50"
              priority
            />
          </Box>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon sx={{ color: 'text.secondary' }} />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {pages.map((page) => (
                <MenuItem key={page} onClick={() => handleMenuClick(page)}>
                  <Typography textAlign="center">{page}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <Box
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            <Image
              src={logo}
              alt="Logo da empresa Brasão Sistemas"
              width="150"
              height="50"
              priority
            />
          </Box>
          <Box
            sx={{ 
              flexGrow: 1, 
              display: { xs: 'none', md: 'flex' },
              paddingTop: 1,
            }}
          >
            {pages.map((page) => (
              <Button
                key={page}
                onClick={() => handleMenuClick(page)}
                sx={{ color: 'text.secondary', display: 'block' }}
              >
                {page}
              </Button>
            ))}
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Sair">
              <IconButton size="large" onClick={() => handleLogOut()}>
                <PowerSettingsNewRoundedIcon sx={{ color: 'text.secondary' }}/>
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}