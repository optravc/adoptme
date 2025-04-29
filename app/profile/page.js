'use client'
import { Box, Typography, Button, Grid, Paper, TextField } from '@mui/material';
import { useState, useEffect } from 'react';

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [editingAccount, setEditingAccount] = useState(false);
  const [editingAddress, setEditingAddress] = useState(false);
  const [accountData, setAccountData] = useState({ username: '', email: '', tel: '' });
  const [addressData, setAddressData] = useState({ house: '', district: '', area: '', province: '', zipcode: '' });

  useEffect(() => {
    const storedUser = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user')) : null;
    if (storedUser) {
      setUser(storedUser);
      setAccountData({
        username: storedUser.username || '',
        email: storedUser.email || '',
        tel: storedUser.tel || ''
      });
    }
  }, []);

  const handleSaveAccount = async () => {
    try {
      const res = await fetch('/api/profile/updateaccounts', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin', 
        body: JSON.stringify({
          id: user.id,
          username: accountData.username,
          email: accountData.email,
          tel: accountData.tel
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to update account');
      }

      const updatedUser = { ...user, ...accountData };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));

      alert('บันทึกข้อมูลบัญชีสำเร็จ');
      setEditingAccount(false);
    } catch (error) {
      console.error(error);
      alert('เกิดข้อผิดพลาดในการบันทึก');
    }
  };

  const handleSaveAddress = async () => {
    try {
      const res = await fetch('/api/profile/updateaccounts', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: user.id,
          house: addressData.house,
          district: addressData.district,
          area: addressData.area,
          province: addressData.province,
          zipcode: addressData.zipcode
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to update address');
      }

      const newAddress = [
        addressData.house ? `บ้านเลขที่ ${addressData.house}` : null,
        addressData.district ? `ตำบล/แขวง ${addressData.district}` : null,
        addressData.area ? `อำเภอ/เขต ${addressData.area}` : null,
        addressData.province ? `จังหวัด ${addressData.province}` : null,
        addressData.zipcode ? `รหัสไปรษณีย์ ${addressData.zipcode}` : null
      ].filter(Boolean).join(', ');

      const updatedUser = { ...user, Address: newAddress };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));

      alert('บันทึกที่อยู่สำเร็จ');
      setEditingAddress(false);
    } catch (error) {
      console.error(error);
      alert('เกิดข้อผิดพลาดในการบันทึก');
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" mb={3}>โปรไฟล์ของคุณ</Typography>

      {/* ข้อมูลบัญชี */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6">ข้อมูลบัญชี</Typography>
        {editingAccount ? (
          <>
            <TextField label="ชื่อผู้ใช้" fullWidth margin="normal" value={accountData.username} onChange={(e) => setAccountData({ ...accountData, username: e.target.value })} />
            <TextField label="อีเมล" fullWidth margin="normal" value={accountData.email} onChange={(e) => setAccountData({ ...accountData, email: e.target.value })} />
            <TextField label="เบอร์โทร" fullWidth margin="normal" value={accountData.tel} onChange={(e) => setAccountData({ ...accountData, tel: e.target.value })} />
            <Button variant="contained" color="primary" onClick={handleSaveAccount} sx={{ mt: 2 }}>บันทึกข้อมูลบัญชี</Button>
          </>
        ) : (
          <>
            <Typography>ชื่อผู้ใช้: {user?.username || 'ไม่พบข้อมูล'}</Typography>
            <Typography>อีเมล: {user?.email || '-'}</Typography>
            <Typography>เบอร์โทร: {user?.tel || '-'}</Typography>
            <Button variant="outlined" color="primary" fullWidth sx={{ mt: 1 }} onClick={() => setEditingAccount(true)}>แก้ไขข้อมูลบัญชี</Button>
          </>
        )}
      </Paper>

      {/* ที่อยู่ */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6">ที่อยู่</Typography>
        {editingAddress ? (
          <>
            <TextField label="บ้านเลขที่" fullWidth margin="normal" value={addressData.house} onChange={(e) => setAddressData({ ...addressData, house: e.target.value })} />
            <TextField label="ตำบล/แขวง" fullWidth margin="normal" value={addressData.district} onChange={(e) => setAddressData({ ...addressData, district: e.target.value })} />
            <TextField label="อำเภอ/เขต" fullWidth margin="normal" value={addressData.area} onChange={(e) => setAddressData({ ...addressData, area: e.target.value })} />
            <TextField label="จังหวัด" fullWidth margin="normal" value={addressData.province} onChange={(e) => setAddressData({ ...addressData, province: e.target.value })} />
            <TextField label="รหัสไปรษณีย์" fullWidth margin="normal" value={addressData.zipcode} onChange={(e) => setAddressData({ ...addressData, zipcode: e.target.value })} />
            <Button variant="contained" color="primary" onClick={handleSaveAddress} sx={{ mt: 2 }}>บันทึกที่อยู่</Button>
          </>
        ) : (
          <>
            <Typography>ที่อยู่: {user?.Address || '-'}</Typography>
            <Button variant="outlined" color="primary" fullWidth sx={{ mt: 1 }} onClick={() => setEditingAddress(true)}>แก้ไขที่อยู่</Button>
          </>
        )}
      </Paper>

      {/* ประกาศของฉัน */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" mb={1}>ประกาศของฉัน</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Button fullWidth variant="contained" onClick={() => window.location.href = '/pets/mypetsales'}>สัตว์ที่ลงขาย</Button>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Button fullWidth variant="contained" color="secondary" onClick={() => window.location.href = '/adopt/myadopt'}>สัตว์ที่ให้รับเลี้ยง</Button>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}
