'use client'; // รันโค้ดฝั่ง client เนื่องจากใช้ Next.js navigation
import React, { useState } from 'react'; // React และ hook useState
import {
  Box, Modal, Typography, TextField, Button, Link as MuiLink, IconButton, Alert,
} from '@mui/material'; // นำเข้า UI components จาก MUI
import CloseIcon from '@mui/icons-material/Close'; // ไอคอนปิด modal
import Link from 'next/link'; // Next.js Link component
import { useRouter } from 'next/navigation'; // hook สำหรับ navigation

const style = { // กำหนด style สำหรับ Box ใน Modal
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
  const [open, setOpen] = useState(true); // state ควบคุมการเปิด modal
  const [email, setEmail] = useState(''); // state เก็บค่า email
  const [password, setPassword] = useState(''); // state เก็บค่า password
  const [errorMsg, setErrorMsg] = useState(''); // state เก็บข้อความ error
  const router = useRouter(); // hook สำหรับ push route

  const handleClose = () => {
    setOpen(false); // ปิด modal
    router.push('/'); 
  };

  const handleLogin = async () => {
    setErrorMsg(''); // เคลียร์ข้อความ error
    try {
      const res = await fetch('/api/login', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }), 
      });
      const data = await res.json(); 

      if (data.success) {
        localStorage.setItem('user', JSON.stringify(data.user)); // เก็บข้อมูล user ใน localStorage
        window.dispatchEvent(new Event('userChanged')); 
        router.push('/'); // ไปหน้าแรก
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