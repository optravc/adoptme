'use client';
import React, { useState } from 'react';
import { Box, Modal, Typography, TextField, Button, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
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

export default function RegisterPage() {
  const [open, setOpen] = useState(true);
  const router = useRouter();
  
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleClose = () => {
    setOpen(false);
    router.push('/'); 
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      // แก้ไข URL ที่ถูกต้อง
      const res = await fetch('/api/Login&Register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, username, password, name }),
      });

      // แสดงผลค่า response ที่ได้รับ
      console.log(res);
  
      if (res.ok) {
        const data = await res.json();
        alert('Registration successful!');
        router.push('/login');
      } else {
        const errorData = await res.json();
        alert(errorData.error || 'Registration failed.');
      }
    } catch (err) {
      console.error(err);
      alert('Something went wrong.');
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        <IconButton onClick={handleClose} sx={{ position: 'absolute', top: 8, right: 8, color: (theme) => theme.palette.grey[500] }}>
          <CloseIcon />
        </IconButton>

        <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
          Register on Adopt-Me
        </Typography>

        <form onSubmit={handleRegister}>
          <TextField label="Email" type="email" fullWidth required margin="normal" value={email} onChange={(e) => setEmail(e.target.value)} />
          <TextField label="Username" fullWidth required margin="normal" value={username} onChange={(e) => setUsername(e.target.value)} />
          <TextField label="Password" type="password" fullWidth required margin="normal" value={password} onChange={(e) => setPassword(e.target.value)} />
          <TextField label="Name" fullWidth required margin="normal" value={name} onChange={(e) => setName(e.target.value)} />
          <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
            Register
          </Button>
        </form>
      </Box>
    </Modal>
  );
}
