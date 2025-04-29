'use client';
import { Box, Typography, Divider } from '@mui/material';
import { keyframes } from '@emotion/react';

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const fadeInStyle = {
  animation: `${fadeIn} 1s ease-in-out`,
};

export default function AboutPage() {
  return (
    <Box position="relative">
      {/* รูป Hero */}
      <Box
        component="img"
        src="https://png.pngtree.com/background/20210710/original/pngtree-cute-orange-pet-shop-promotion-banner-picture-image_994312.jpg"
        alt="Banner"
        sx={{
          width: '100%',
          height: '100vh',
          objectFit: 'cover',
        }}
      />

      {/* กล่องข้อความ */}
      <Box
        position="absolute"
        top="50%"
        left="50%"
        sx={{
          transform: 'translate(-50%, -50%)', // << ยึดศูนย์กลางจริงๆ
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          borderRadius: 4,
          boxShadow: 3,
          p: 4,
          maxWidth: 800,
          width: '90%',
          ...fadeInStyle, // << เฟดเฉพาะ opacity
        }}
      >
        <Typography variant="h4" gutterBottom>
          เกี่ยวกับเรา
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Typography variant="body1" paragraph>
          Adopt Me! คือเว็บไซต์ที่รวบรวมสัตว์เลี้ยงที่กำลังมองหาบ้านใหม่ ไม่ว่าจะเป็นจากศูนย์พักพิงสัตว์ สถานสงเคราะห์ หรือเจ้าของเดิม
          เว็บไซต์นี้มีจุดประสงค์เพื่อช่วยให้น้องหมา น้องแมว และสัตว์เลี้ยงอื่น ๆ ได้พบกับเจ้าของใหม่ที่พร้อมดูแล
        </Typography>
        <Typography variant="body1" paragraph>
          เราเชื่อว่าการรับเลี้ยงสัตว์เป็นการให้ชีวิตใหม่ และช่วยลดจำนวนสัตว์จรจัดในสังคม
          เว็บไซต์นี้ถูกสร้างขึ้นเพื่อเชื่อมโยงผู้ที่อยากช่วยกับสัตว์ที่ต้องการความช่วยเหลือ
        </Typography>
      </Box>
    </Box>
  );
}
