//login//page.js
'use client';
import React, { useState } from 'react';
import {
  Box,
  Modal,
  Typography,
  TextField,
  Button,
  Link as MuiLink,
  IconButton,
  Alert,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  borderRadius: 2,
  p: 4,
};

export default function LoginPage() {
  const [open, setOpen] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const router = useRouter();

  const handleClose = () => {
    setOpen(false);
    router.push('/');
  };

  const handleLogin = async () => {
    setErrorMsg('');
    try {
      const res = await fetch('/api/Login&Register/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (data.success) {
        // บันทึก user ลง localStorage
        localStorage.setItem('user', JSON.stringify(data.user));
        console.log('Logged in as:', data.user.role);    
        window.dispatchEvent(new Event('userChanged'));
        router.push('/');
      } else {
        setErrorMsg(data.error || 'Login failed');
      }
    } catch (err) {
      setErrorMsg('Something went wrong. Please try again.');
    }
  };
  
  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        <IconButton
          onClick={handleClose}
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>

        <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
          Sign in to Adopt-Me
        </Typography>

        <Typography variant="body2" sx={{ mb: 2 }}>
          Don’t have an account?{' '}
          <MuiLink
            component={Link}
            href="/register"
            underline="always"
            sx={{ color: '#1976d2', fontWeight: 500, cursor: 'pointer' }}
          >
            Sign Up
          </MuiLink>
        </Typography>

        {errorMsg && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {errorMsg}
          </Alert>
        )}

        <TextField
          label="Email"
          fullWidth
          sx={{ mb: 2 }}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          label="Password"
          type="password"
          fullWidth
          sx={{ mb: 2 }}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Box sx={{ textAlign: 'right', mb: 2 }}>
          <Button size="small">Forgot password?</Button>
        </Box>

        <Button variant="contained" fullWidth onClick={handleLogin}>
          Sign In
        </Button>
      </Box>
    </Modal>
  );
}
