'use client';
import React, { useEffect, useState } from 'react';
import { Box, Typography, Divider, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { useQRCode } from 'next-qrcode';
import { useRouter } from 'next/navigation';

export default function CartPage() {
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null);
  const [openQR, setOpenQR] = useState(false);
  const [qrText, setQrText] = useState('');
  const { Canvas } = useQRCode();
  const router = useRouter();

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    const storedUser = JSON.parse(localStorage.getItem('user'));

    setCart(storedCart);

    if (storedUser && storedUser.id) {
      setUser(storedUser);
    }
  }, []);

  const getTotal = () => {
    return cart.reduce((sum, item) => sum + item.qty * parseFloat(item.price), 0);
  };

  const handleClearCart = () => {
    localStorage.removeItem('cart');
    setCart([]);
    window.dispatchEvent(new Event('cartChanged'));
  };

  const handleCheckout = async () => {
    try {
      if (!user || !user.id) {
        alert('กรุณาเข้าสู่ระบบก่อนทำการสั่งซื้อ');
        return;
      }

      if (!user.Address) {
        alert('กรุณาบันทึกที่อยู่ในโปรไฟล์ของคุณก่อนทำการสั่งซื้อ');
        return;
      }

      const res = await fetch('/api/shop/qrpayment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: getTotal().toFixed(2),
          ref1: 'ORDER' + Date.now(),
          cart: cart,
          userId: user.id,
          address: user.Address
        })
      });

      const data = await res.json();
      if (data.qrText) {
        setQrText(data.qrText);
        setOpenQR(true);
      } else {
        alert('ไม่สามารถสร้าง QR ได้');
      }
    } catch (err) {
      console.error('error:', err);
      alert('เกิดข้อผิดพลาด');
    }
  };

  const handleCloseQR = () => {
    setOpenQR(false);
    localStorage.removeItem('cart');
    setCart([]);
    window.dispatchEvent(new Event('cartChanged'));
    router.push('/shop/cart/thankyou');
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" mb={3}>🛒 ตะกร้าสินค้า</Typography>

      {cart.length === 0 ? (
        <Typography>ไม่มีสินค้าในตะกร้า</Typography>
      ) : (
        <>
          {cart.map((item) => (
            <Box key={item.id} sx={{ mb: 2 }}>
              <Typography variant="h6">{item.name} × {item.qty}</Typography>
              <Typography color="text.secondary">฿{parseFloat(item.price).toLocaleString()} ต่อชิ้น</Typography>
              <Divider sx={{ my: 1 }} />
            </Box>
          ))}

          <Typography variant="h6" mt={2}>รวมทั้งหมด: ฿{getTotal().toLocaleString()}</Typography>

          <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
            <Button variant="outlined" color="error" onClick={handleClearCart}>
              ล้างตะกร้า
            </Button>
            <Button variant="contained" color="primary" onClick={handleCheckout}>
              ดำเนินการชำระเงิน
            </Button>
          </Box>

          {/* QR Dialog */}
          <Dialog open={openQR} onClose={handleCloseQR}>
            <DialogTitle>สแกน QR เพื่อชำระเงิน</DialogTitle>
            <DialogContent sx={{ textAlign: 'center', mt: 2 }}>
              {qrText && (
                <Canvas
                  text={qrText}
                  options={{
                    errorCorrectionLevel: 'M',
                    margin: 3,
                    scale: 4,
                    width: 250,
                    color: {
                      dark: '#000000',
                      light: '#ffffff',
                    },
                  }}
                />
              )}
              <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
                {qrText}
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseQR}>ปิด</Button> 
            </DialogActions>
          </Dialog>
        </>
      )}
    </Box>
  );
}
