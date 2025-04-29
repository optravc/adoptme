'use client';
import React, { useState } from 'react';
import {
  Card, CardMedia, CardContent, Typography, Button, Box, Chip, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions
} from '@mui/material';
import EditProductForm from '../Admin/EditProductform';

export default function Productcard({ product, isAdmin, onDelete, onAddStock, onRemoveStock, onEdit }) {
  const [openEdit, setOpenEdit] = useState(false);
  const [openDialog, setOpenDialog] = useState(false); // เพิ่ม state dialog
  const isOutOfStock = parseInt(product.stock) === 0;

  const mapTypeToFolder = (type) => {
    switch (type) {
      case 'อาหาร': return 'food';
      case 'ของเล่น': return 'toys';
      case 'อุปกรณ์': return 'equipment';
      default: return 'else';
    }
  };

  const imageUrl = `/upload/${mapTypeToFolder(product.type)}/${product.image}`;

  const handleDeleteConfirm = () => {
    onDelete(product.id);  // ลบจริง
    setOpenDialog(false);  // ปิด dialog หลังลบ
  };

  return (
    <>
      <Card sx={{ width: 300, height: 500, m: 2, display: 'flex', flexDirection: 'column', position: 'relative' }}>
        {isOutOfStock && (
          <Chip
            label="หมดสต็อก"
            color="error"
            size="small"
            sx={{ position: 'absolute', top: 8, right: 8, zIndex: 1 }}
          />
        )}

        <CardMedia
          component="img"
          image={imageUrl}
          alt={product.name}
          sx={{ height: 200, objectFit: 'cover' }}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/upload/else/default.jpg';
          }}
        />

        <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
          <Typography variant="h6" gutterBottom>{product.name}</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ flexGrow: 1 }}>
            {product.description}
          </Typography>
          <Typography variant="body1" sx={{ mt: 1, fontWeight: 'bold' }}>
            ฿{parseFloat(product.price).toLocaleString()}
          </Typography>
          <Typography variant="body2" color="text.secondary">คงเหลือ: {product.stock}</Typography>

          {isAdmin ? (
            <Box mt={2} sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant="contained"
                  color="success"
                  fullWidth
                  onClick={() => onAddStock(product.id)}
                >
                  ➕ เพิ่ม
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  fullWidth
                  onClick={() => onRemoveStock(product.id)}
                >
                  ➖ ลด
                </Button>
              </Box>

              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant="outlined"
                  color="warning"
                  fullWidth
                  onClick={() => setOpenEdit(true)}
                >
                  ✏️ แก้ไข
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  fullWidth
                  onClick={() => setOpenDialog(true)} // เปิด dialog แทนลบทันที
                >
                  🗑 ลบสินค้าออก
                </Button>
              </Box>
            </Box>
          ) : (
            <Box mt={2}>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={handleAddToCart}
                disabled={isOutOfStock}
              >
                {isOutOfStock ? 'หมดสต็อก' : 'สั่งซื้อ'}
              </Button>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Dialog ยืนยันการลบ */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>ยืนยันการลบสินค้า</DialogTitle>
        <DialogContent>
          <DialogContentText>
            คุณต้องการลบสินค้า "{product.name}" ใช่หรือไม่? การลบไม่สามารถย้อนกลับได้
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>ยกเลิก</Button>
          <Button onClick={handleDeleteConfirm} color="error">ยืนยันลบ</Button>
        </DialogActions>
      </Dialog>

      {/* ฟอร์มแก้ไขสินค้า */}
      <EditProductForm
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        product={product}
        onEdit={onEdit}
        isAdmin={isAdmin}
      />
    </>
  );
}
