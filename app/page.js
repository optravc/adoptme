'use client';
import { keyframes } from '@emotion/react';
import { Box, Button, Card, CardContent, CardMedia, Grid, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const animatedCardStyle = {
  animation: `${fadeInUp} 1s ease-in-out`,
};

export default function Main() {
  const router = useRouter();

  useEffect(() => {
    document.body.classList.add('no-background');
    return () => {
      document.body.classList.remove('no-background');
    };
  }, []);

  const handleGoToAdopt = () => {
    router.push('/adopt');
  };

  const handleGoToShop =() => {
    router.push('/shop');
  }

  return (
    <Box
      sx={{
        width: '100%',
        minHeight: '100vh',
        position: 'relative',
        overflow: 'hidden',
        backgroundImage: 'url(https://png.pngtree.com/background/20210710/original/pngtree-cute-orange-pet-shop-promotion-banner-picture-image_994312.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Hero Text */}
      <Box
        sx={{
          position: 'absolute',
          top: '40%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
          color: 'white',
          zIndex: 2,
        }}
      >
        <Typography variant="h2" sx={{ fontWeight: 'bold', textShadow: '2px 2px 4px rgba(0,0,0,0.7)' }}>
          Adopt Me 🏠
        </Typography>
        <Typography variant="h5" sx={{ mt: 2, textShadow: '1px 1px 3px rgba(0,0,0,0.5)' }}>
          รวมสัตว์เลี้ยงน่ารัก หาบ้านใหม่หรือเลือกซื้อได้ในที่เดียว<br />
          พร้อมอุปกรณ์ครบครัน เพื่อเพื่อนขนฟูที่คุณรัก ❤️
        </Typography>
      </Box>

      {/* Card มุมขวาบน */}
      <Box sx={{
        position: 'absolute',
        top: '10%',
        right: '5%',
        zIndex: 3,
        width: '300px',
      }}>
        <Card sx={{ ...animatedCardStyle, backgroundColor: 'rgba(255, 255, 255, 0.85)', borderRadius: '8px', boxShadow: 3 }}>
          <CardMedia
            component="img"
            height="140"
            image="https://happypet-th.com/wp-content/uploads/2024/07/services-pet-shop.webp"
            alt="Accessories"

          />
          <CardContent>
            <Typography variant="h5">Pet shop 🛒</Typography>
            <Typography variant="body2" color="text.secondary">
              คอลเลกชันอุปกรณ์สัตว์เลี้ยงใหม่ของเรามีจำหน่ายในร้านแล้ว!
            </Typography>
            <Button variant="contained" sx={{ mt: 2 }} onClick={handleGoToShop} >
              ดูสินค้าของเราที่นี้เลย


            </Button>
          </CardContent>
        </Card>
      </Box>

      {/* ข่าวสารด้านซ้าย */}
      <Box sx={{
        position: 'absolute',
        top: '10%',
        left: '5%',
        zIndex: 3,
        width: '600px',
        maxWidth: '95%',
      }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Card sx={{ ...animatedCardStyle, backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: '8px', boxShadow: 3 }}>
              <CardContent>
                <Typography variant="h5">รู้จักกับวันรับเลี้ยงสัตว์โลก 🌍</Typography>
                <Typography variant="body2" color="text.secondary">
                  วันสัตว์เลี้ยงโลกตรงกับวันที่ 2 ตุลาคม เพื่อเป็นเกียรติแก่วันเกิดของมหาตมะ คานธี เริ่มต้นในปี 1983 และได้รับการยอมรับทั่วโลก
                </Typography>
                <Button
                  variant="contained"
                  sx={{ mt: 2 }}
                  href="https://www.worldanimalprotection.org/our-campaigns/sentience/animal-awareness-days/world-farmed-animals-day/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  อ่านเพิ่มเติม
                </Button>
              </CardContent>
            </Card>
          </Grid>



            {/*/ Card adopt*/}
          <Grid item xs={12} sm={6}>
            <Card sx={{ ...animatedCardStyle, backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: '8px', boxShadow: 3 }}>
              <CardMedia
                component="img"
                height="140"
                image="https://media.istockphoto.com/id/605757050/th/%E0%B8%A3%E0%B8%B9%E0%B8%9B%E0%B8%96%E0%B9%88%E0%B8%B2%E0%B8%A2/%E0%B8%A5%E0%B8%B9%E0%B8%81%E0%B9%81%E0%B8%A1%E0%B8%A7%E0%B8%95%E0%B8%B1%E0%B8%A7%E0%B9%80%E0%B8%A5%E0%B9%87%E0%B8%81%E0%B8%AD%E0%B8%A2%E0%B8%B9%E0%B9%88%E0%B9%83%E0%B8%99%E0%B8%A1%E0%B8%B7%E0%B8%AD%E0%B8%82%E0%B8%AD%E0%B8%87%E0%B9%81%E0%B8%9E%E0%B8%97%E0%B8%A2%E0%B9%8C.jpg?s=612x612&w=0&k=20&c=otthvW8CkLdcr1fO_z93SOvffmgL-s_YYW2oa6lkc2w="

              />
              <CardContent>
                <Typography variant="h5">ช่วยให้สัตว์น้อยได้มีบ้านใหม่ 💛</Typography>
                <Typography variant="body2" color="text.secondary">
                  สัตว์เลี้ยงตัวใหม่มาถึงแล้ว! มาเจอเพื่อนขนปุยของคุณได้เลย!
                </Typography>
                <Button variant="contained" sx={{ mt: 2 }} onClick={handleGoToAdopt}>
                  ร่วมช่วยเหลือ
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* หมวดหมู่ */}
      <Box
        sx={{
          position: 'absolute',
          top: '100vh',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '100%',
          textAlign: 'center',
          py: 6,
          background: '#fff',
          zIndex: 1,
        }}
      >
        <Typography variant="h4" sx={{ mb: 2 }}>หมวดหมู่ 🐾</Typography>
        <Grid container spacing={2} justifyContent="center">
          {['PETS', 'ADOPT', 'SHOP', 'ABOUT', 'CONTACT'].map((label, index) => (
            <Grid item key={index}>
              <Button variant="outlined" size="large">{label}</Button>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
}