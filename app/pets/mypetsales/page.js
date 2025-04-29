'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Typography, Grid, Card, CardContent, CardMedia, Button, 
  Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';

function mapTypeToFolder(type) {
  switch (type) {
    case 'แมว': return 'cat';
    case 'สุนัข': return 'dog';
    case 'นก': return 'bird';
    default: return 'else';
  }
}

export default function MyPetSalesPage() {
  const [mySalesPets, setMySalesPets] = useState([]);
  const [user, setUser] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const router = useRouter(); // ใช้ navigate หน้า

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    setUser(storedUser);
  }, []);

  useEffect(() => {
    const fetchSalesPets = async () => {
      if (!user?.id) return;
      const res = await fetch(`/api/pets/mypetsales?user_id=${user.id}`);
      const data = await res.json();
      setMySalesPets(data);
    };
    if (user?.id) {
      fetchSalesPets();
    }
  }, [user?.id]);

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setOpenDialog(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const res = await fetch(`/api/pets/mypetsales/delete?id=${deleteId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        alert('ลบประกาศสำเร็จ');
        setMySalesPets(prev => prev.filter(pet => pet.id !== deleteId)); // เอาตัวที่ลบออก
      } else {
        alert('เกิดข้อผิดพลาดในการลบ');
      }
    } catch (err) {
      console.error('ลบผิดพลาด:', err);
      alert('เกิดข้อผิดพลาด');
    } finally {
      setOpenDialog(false);
      setDeleteId(null);
    }
  };

  const handleEditClick = (id) => {
    router.push(`/pets/mypetsales/${id}/edit`);
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" mb={3}>สัตว์ที่ลงขายของฉัน</Typography>
      <Grid container spacing={2}>
        {mySalesPets.map((pet) => (
          <Grid item xs={12} sm={6} md={4} key={pet.id}>
            <Card>
              <CardMedia
                component="img"
                height="200"
                image={`/upload/petsales/${mapTypeToFolder(pet.type)}/${pet.image_urlmain}`}
                alt={pet.pet_name}
              />
              <CardContent>
                <Typography variant="h6">{pet.pet_name}</Typography>
                <Typography variant="body2">ประเภท: {pet.type}</Typography>
                <Typography variant="body2">เพศ: {pet.gender}</Typography>
                <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleEditClick(pet.id)}
                  >
                    แก้ไขประกาศ
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => handleDeleteClick(pet.id)}
                  >
                    ลบประกาศ
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Confirm Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>ยืนยันการลบประกาศ</DialogTitle>
        <DialogContent>
          <DialogContentText>
            คุณต้องการลบประกาศนี้หรือไม่? การลบนี้ไม่สามารถย้อนกลับได้
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>ยกเลิก</Button>
          <Button onClick={handleConfirmDelete} color="error">ยืนยันลบ</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
