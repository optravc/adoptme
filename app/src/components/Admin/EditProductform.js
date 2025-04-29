'use client';
import React, { useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, Stack, Typography, Box
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';

export default function EditProductForm({open,onClose, product, onEdit, isAdmin }) {
  const [form, setForm] = useState({
    id: product.id,
    name: product.name,
    description: product.description,
    price: product.price,
    stock: product.stock,
    image: product.image,
    type: product.type,
    subtype: product.subtype,
  });

  const mapTypeToFolder = (type) => {
    switch (type) {
      case 'อาหาร': return 'food';
      case 'ของเล่น': return 'toys';
      case 'อุปกรณ์': return 'equipment';
      default: return 'else';
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async () => {
    if (!isAdmin) {
      alert('❌ คุณไม่มีสิทธิ์แก้ไขสินค้า');
      return;
    }

    try {
      const res = await fetch(`/api/product/${form.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        alert('✅ แก้ไขสินค้าสำเร็จ');
        onEdit(form);
        onClose();
      } else {
        alert('❌ ไม่สามารถอัปเดตสินค้าได้');
      }
    } catch (err) {
      console.error('❌ Update error:', err);
      alert('เกิดข้อผิดพลาดในการอัปเดตสินค้า');
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        <Stack direction="row" alignItems="center" spacing={1}>
          <EditIcon color="primary" />
          <Typography variant="h6" fontWeight="bold">แก้ไขสินค้า</Typography>
        </Stack>
      </DialogTitle>

      <DialogContent dividers>
        <Stack spacing={2}>
          <TextField label="ชื่อสินค้า" name="name" fullWidth value={form.name} onChange={handleChange} />
          <TextField label="รายละเอียด" name="description" fullWidth multiline rows={3} value={form.description} onChange={handleChange} />
          <TextField label="ราคา" name="price" type="number" fullWidth value={form.price} onChange={handleChange} />
          <TextField label="คงเหลือ" name="stock" type="number" fullWidth value={form.stock} onChange={handleChange} />
          <TextField label="ชื่อไฟล์รูปภาพ" name="image" fullWidth value={form.image} onChange={handleChange} helperText="ใส่ชื่อไฟล์ภาพ เช่น: abc.png" />
          <TextField label="ประเภทสินค้า" name="type" fullWidth value={form.type} onChange={handleChange} />
        </Stack>

        <Box sx={{ textAlign: 'center', mt: 2 }}>
          <img
            src={`/upload/${mapTypeToFolder(form.type)}/${form.image}`}
            alt={form.name}
            style={{ maxHeight: 200 }}
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} color="secondary">ยกเลิก</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">บันทึก</Button>
      </DialogActions>
    </Dialog>
  );
}
