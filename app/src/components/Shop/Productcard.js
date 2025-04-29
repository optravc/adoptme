'use client';
import React, { useContext } from 'react';
import { Card, CardMedia, CardContent, Typography, Button, Box, Chip } from '@mui/material';
import { CartContext } from '../Cart/CartContext';

export default function Productcard({ product }) {
  const { updateCartCount } = useContext(CartContext);

  // ✅ เช็กว่า stock <= 0
  const stock = Number(product.stock); // ⭐ แปลงก่อน
const isOutOfStock = isNaN(stock) || stock <= 0; // ⭐ เช็กจริงจัง

  const mapTypeToFolder = (type) => {
    switch (type) {
      case 'ของเล่น':
      case 'toys': return 'toys';
      case 'อาหาร': return 'food';
      case 'อุปกรณ์': return 'equipment';
      default: return 'else';
    }
  };

  const imageUrl = `/upload/${mapTypeToFolder(product.type)}/${product.image}`;

  const handleAddToCart = () => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existing = cart.find((item) => item.id === product.id);

    if (existing) {
      if (existing.qty < parseInt(product.stock)) {
        existing.qty += 1;
      } else {
        alert('❌ สินค้าในตะกร้าเกินจำนวนสต็อกแล้ว');
        return;
      }
    } else {
      cart.push({ ...product, qty: 1 });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    alert('✅ เพิ่มสินค้าในตะกร้าแล้ว');
  };

  return (
    <Card sx={{ width: 300, height: 480, m: 2, display: 'flex', flexDirection: 'column', position: 'relative' }}>
      {/* ✅ ถ้า stock หมด แสดงป้าย "หมดสต็อก" */}
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
          e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
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

        <Box mt={2}>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleAddToCart}
            disabled={isOutOfStock} // ✅ ปิดปุ่มถ้า stock หมด
          >
            {isOutOfStock ? 'หมดสต็อก' : 'เพิ่มสินค้าในตะกร้า'}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}
