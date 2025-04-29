'use client';
import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useRouter } from 'next/navigation';

export default function ThankYouPage() {
  const router = useRouter();

  return (
    <Box sx={{ p: 4, textAlign: 'center' }}>
      <Typography variant="h3" gutterBottom>🎉 ขอบคุณสำหรับการสั่งซื้อ!</Typography>
      <Typography variant="h6" gutterBottom>ระบบได้รับข้อมูลของคุณเรียบร้อยแล้ว</Typography>
      <Button variant="contained" sx={{ mt: 4 }} onClick={() => router.push('/')}>
        กลับสู่หน้าแรก
      </Button>
    </Box>
  );
}
