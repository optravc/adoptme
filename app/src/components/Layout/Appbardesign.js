'use client';
import * as React from 'react';
import {
  AppBar, Box, CssBaseline, Toolbar, Typography, Button,
  IconButton, Menu, MenuItem
} from '@mui/material';
import { useRouter } from 'next/navigation';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

const navItems = ['Home', 'Pets', 'Adopt', 'Shop', 'About'];

function DrawerAppBar() {
  const [user, setUser] = React.useState(null);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const router = useRouter();
  const handleMenuClick = (e) => setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleNavClick = (path) => {
    router.push(path.toLowerCase() === 'home' ? '/' : `/${path.toLowerCase()}`);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    router.push('/');
  };

  const handleProfile = () => {
    handleMenuClose();
    router.push('/profile');
  };

  const handlePetSalesClick = () => {
    handleMenuClose();
    router.push('/pets/CreatePetsales');
  };

  const handlePetAdoptClick = () => {
    handleMenuClose();
    router.push('/adopt/CreatePetAdopt');
  };

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('user');
      if (storedUser) setUser(JSON.parse(storedUser));

      const updateUser = () => {
        const updatedUser = localStorage.getItem('user');
        setUser(updatedUser ? JSON.parse(updatedUser) : null);
      };

      window.addEventListener('userChanged', updateUser);
      window.addEventListener('storage', updateUser);

      return () => {
        window.removeEventListener('userChanged', updateUser);
        window.removeEventListener('storage', updateUser);
      };
    }
  }, []);

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />

      <AppBar
        component="nav"
        sx={{
          backgroundColor: '#fff',
          color: '#000',
          boxShadow: 3,
          position: 'fixed',
          top: 0,
          width: '100%',
          zIndex: 1200,
        }}
      >
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {/* ซ้าย: Logo */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography
              variant="h6"
              sx={{ cursor: 'pointer', color: '#1E90FF', fontWeight: 'bold' }}
              onClick={() => router.push('/')}
            >
              Adopt-Me
            </Typography>
          </Box>

          {/* กลาง: เมนู */}
          <Box sx={{
            display: 'flex',
            justifyContent: 'center',
            flexGrow: 1,
            gap: 2,
          }}>
            {navItems.map((item) => (
              <Button key={item} sx={{ color: '#000' }} onClick={() => handleNavClick(item)}>
                {item}
              </Button>
            ))}
          </Box>

          {/* ขวา: Login / User menu */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton
              color="inherit"
              sx={{ mr: 1 }}
              onClick={() => router.push('/shop/cart')}
            >
              <ShoppingCartIcon />
            </IconButton>

            {user ? (
              <>
                {user.role === 'admin' && (
                  <Typography sx={{ mr: 2, color: 'red', fontWeight: 'bold' }}>
                    👑 ADMIN
                  </Typography>
                )}
                <Button onClick={handleMenuClick} sx={{ color: '#000', textTransform: 'none' }}>
                  {user.username}
                </Button>

                <Menu
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleMenuClose}
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                >
                  <MenuItem onClick={handleProfile}>โปรไฟล์</MenuItem>
                  <MenuItem onClick={handlePetSalesClick}>ลงขายสัตว์เลี้ยง</MenuItem>
                  <MenuItem onClick={handlePetAdoptClick}>ลงให้รับเลี้ยง</MenuItem>

                  {user.role === 'admin' && (
                    <MenuItem onClick={() => {
                      handleMenuClose();
                      router.push('/admin');
                    }}>
                      🛠️ จัดการระบบ (Admin Panel)
                    </MenuItem>
                  )}

                  <MenuItem onClick={handleLogout}>ออกจากระบบ</MenuItem>
                </Menu>
              </>
            ) : (
              <>
                <Button sx={{ color: '#000' }} onClick={() => router.push('/login')}>Login</Button>
                <Button sx={{ color: '#000' }} onClick={() => router.push('/register')}>Register</Button>
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default DrawerAppBar;
