'use client';
import React from 'react';
import {
  Grid,
  Typography,
  Box,
  Card,
  CardContent,
  CardMedia,
  Button,
  Chip
} from '@mui/material';
import { keyframes } from '@mui/system';

// ฟังก์ชัน animation ตอน hover
const hoverEffect = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const mapTypeToFolder = (type) => {
  switch (type) {
    case 'ของเล่น': return 'toys';
    case 'อาหาร': return 'food';
    case 'อุปกรณ์': return 'equipment';
    default: return 'else';
  }
};

const getImageSource = (product) => {
  if (!product || !product.image) return '/default-image.jpg';
  if (product.image.startsWith('http://') || product.image.startsWith('https://')) return product.image;
  const folder = mapTypeToFolder(product.type);
  return `/upload/${folder}/${product.image}`;
};

const getFillers = (products) => {
  const remainder = products.length % 3;
  return remainder === 0 ? [] : Array.from({ length: 3 - remainder });
};

export default function ShopCardSales({ products }) {

  const addToCart = (product) => {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    const existingIndex = cart.findIndex((item) => item.id === product.id);

    // เช็ก stock ก่อนเพิ่ม
    if (existingIndex !== -1) {
      const currentQtyInCart = cart[existingIndex].qty;
      const productStock = Number(product.stock);

      if (currentQtyInCart >= productStock) {
        alert('❌ ไม่สามารถเพิ่มได้ สินค้าเกินสต็อกแล้ว');
        return;
      }

      cart[existingIndex].qty += 1;
    } else {
      if (Number(product.stock) <= 0) {
        alert('❌ สินค้าหมดแล้ว ไม่สามารถเพิ่มได้');
        return;
      }
      cart.push({ ...product, qty: 1 });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('cartChanged'));
    alert('✅ เพิ่มสินค้าในตะกร้าเรียบร้อย');
  };

  if (!Array.isArray(products) || products.length === 0) {
    return (
      <Typography variant="body1" color="textSecondary" textAlign="center" mt={4}>
        ไม่มีสินค้าที่ตรงกับเงื่อนไข
      </Typography>
    );
  }

  return (
    <Box mt={4} sx={{ maxWidth: 960, mx: 'auto' }}>
      <Grid container spacing={4}>
        {products.map((product) => {
          const stock = Number(product.stock);
          const isOutOfStock = isNaN(stock) || stock <= 0;

          return (
            <Grid item xs={12} sm={6} md={4} key={product.id}>
              <Card
                sx={{
                  width: 300,
                  height: 500,
                  borderRadius: 3,
                  boxShadow: 4,
                  transition: 'transform 0.3s ease-in-out',
                  '&:hover': {
                    animation: `${hoverEffect} 0.5s ease-in-out`,
                  },
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                }}
              >
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
                  image={getImageSource(product)}
                  alt={product.name}
                  sx={{ height: 200, width: '100%', objectFit: 'cover' }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/default-image.jpg';  
                  }}
                />

                <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  <Typography variant="h6" gutterBottom>{product.name}</Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ whiteSpace: 'pre-line', flexGrow: 1 }}
                  >
                    <strong>Details:</strong> {product.description}
                  </Typography>
                  <Typography variant="body1" sx={{ mt: 1, fontWeight: 'bold' }}>
                    ฿{parseFloat(product.price).toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    คงเหลือ: {product.stock}
                  </Typography>

                  <Box mt={2}>
                    <Button
                      variant="contained"
                      color="primary"
                      fullWidth
                      onClick={() => addToCart(product)}
                      disabled={isOutOfStock} // ⭐ ปิดปุ่มถ้า stock <= 0
                    >
                      {isOutOfStock ? 'หมดสต็อก' : 'สั่งซื้อ'}
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          );
        })}

        {getFillers(products).map((_, index) => (
          <Grid item xs={12} sm={4} md={4} key={`filler-${index}`} sx={{ visibility: 'hidden' }}>
            <Box sx={{ width: '100%', height: 500 }} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
