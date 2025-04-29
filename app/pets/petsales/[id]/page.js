'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Box, Grid, Typography, Avatar,Button } from '@mui/material';

export default function PetsDetailPage() {
  const { id } = useParams();
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPhone, setShowPhone] = useState(false);

  const mapTypeToFolder = (type) => {
    switch (type) {
      case 'แมว': return 'cat';
      case 'สุนัข': return 'dog';
      case 'นก': return 'bird';
      default: return 'else';
    }
  };

  useEffect(() => {
    const fetchPet = async () => {
      const res = await fetch(`/api/pets/petsales/${id}`);
      const data = await res.json();
      setPet(data);
      setLoading(false);
    };
    fetchPet();
  }, [id]);

  if (loading || !pet) return <Typography align="center">กำลังโหลด...</Typography>;

  return (
    <Box sx={{ backgroundColor: '#f5f5f5', py: 4 }}>
      
      {/* ใช้auto เพิ้อปรับขนาดพื้นหลังรองรับ รูปทั้งหมด*/ }
      <Grid container spacing={4} justifyContent="center" sx={{ maxWidth: '1400px', mx: 'auto' }}>

        {/* Main Image + Thumbnails */}
        <Grid item xs={12} md={8}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={8}>
            <Box sx={{ borderRadius: 4, overflow: 'hidden', }}>
                <img
                  src={`/upload/petsales/${mapTypeToFolder(pet.type)}/${pet.image_urlmain}`}
                  alt={pet.pet_name}
                  style={{ width: '100%', height: 400, objectFit: 'cover' }}
                />
              </Box>
            </Grid>

             {/*แสดงภาพย่อย (thumbnail) สูงสุด 720px ถ้าเกินจะมี scroll bar แนวตั้ง*/ }
            <Grid item xs={12} md={4}>
              <Box sx={{ maxHeight: 720, overflowY: 'auto', pr: 1 }}>
                <Grid container spacing={2}>
                  {[pet.image_url2, pet.image_url3, pet.image_url4, pet.image_url5, pet.image_url6]
                    .filter((img) => img && img !== pet.image_urlmain)
                    .map((img, i) => (
                      <Grid item xs={12} key={i}>
                        <Box
                          sx={{
                            borderRadius: 4,
                            overflow: 'hidden',
                            height: 120,
                          }}
                        >
                          <img
                            src={`/upload/petsales/${mapTypeToFolder(pet.type)}/${img}`}
                            alt={`thumb-${i}`}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                            }}
                          />
                        </Box>
                      </Grid>
                    ))}
                </Grid>
              </Box>
            </Grid>
          </Grid>

          {/* Pet Detail รวมข้อมูลเจ้าของไว้ในกล่องเดียวกัน */}
          <Box mt={4} sx={{ backgroundColor: 'white', p: 3, borderRadius: 4 }}>
            <Typography variant="h5" fontWeight="bold"><strong >ชื่อ: </strong>{pet.pet_name} </Typography>
            <Typography variant="h5" fontWeight="bold"><strong >สายพันธ์: </strong>{pet.breed}</Typography>
            <Typography variant="h6" color="text.secondary" mt={1}>
              {pet.sales ? `฿ ${pet.sales.toLocaleString()}` : 'ยังไม่ระบุราคา'}
            </Typography>

            <Typography mt={2}><strong>ประเภท:</strong> {pet.type}</Typography>
            <Typography><strong>เพศ:</strong> {pet.gender}</Typography>
            <Typography><strong>อายุ:</strong> {pet.age} ปี</Typography>

            <Typography mt={2}><strong>รายละเอียด:</strong></Typography>

            <Typography variant="body2" color="text.secondary">{pet.description || 'ไม่มีรายละเอียด'}</Typography>
            <Box mt={4} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ width: 56, height: 56, bgcolor: '#ccc' }}>
                {pet.owner_name?.charAt(0) || ''}
              </Avatar>
              <Box>
              <Typography  variant="h5" fontWeight="bold"><strong >Profile </strong></Typography>
                <Typography variant="subtitle1" fontWeight="bold">{pet.owner_name}</Typography>
                <Button
                  variant="outlined"
                  size="small"
                  sx={{ mt: 1, borderColor: 'red', color: 'red' }}
                  onClick={() => setShowPhone(!showPhone)}
                >
                  📞 {showPhone ? pet.tel : 'แสดงหมายเลข'}
                </Button>
              </Box>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
