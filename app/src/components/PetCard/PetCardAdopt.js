'use client';
import {
  Grid, Typography, Box,
  Card, CardContent, CardMedia,
  Typography as MuiTypography, Button
} from '@mui/material';
import { keyframes } from '@mui/system';
import { useRouter } from 'next/navigation';

// Hover effect animation
const hoverEffect = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

export default function PetCardGridAdopt({ pets }) {
  const router = useRouter();

  const getFillers = () => {
    const remainder = pets.length % 3;
    return remainder === 0 ? [] : Array.from({ length: 3 - remainder });
  };

  const getImageSource = (url) => {
    if (!url) return '/default-image.jpg'; 
    if (url.startsWith('http://') || url.startsWith('/upload/')) {
      return url;
    }
    return `/upload/${url}`;
  };


  const handleDetailClick = (id) => {
    router.push(`/adopt/adoptdetails/${id}`);
  };

  if (!Array.isArray(pets) || pets.length === 0) {
    return (
      <Typography variant="body1" color="textSecondary" textAlign="center" mt={4}>
        ไม่มีข้อมูลสัตว์ในประเภทนี้
      </Typography>
    );
  }

  return (
    <Box mt={4}>
      <Grid container spacing={4} justifyContent="center">
        {pets.map((pet) => (
          <Grid item xs={12} sm={6} md={4} key={pet.id}>
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
              }}
            >
           <CardMedia
            component="img"
            image={getImageSource(pet.image_urlmain)}
            alt={pet.name}
            sx={{
            height: 200,
            width: '100%',
            objectFit: 'cover',
            }}
            />
              <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <MuiTypography variant="h6" gutterBottom>{pet.name}</MuiTypography>
                <MuiTypography
                  variant="body2"
                  color="text.secondary"
                  sx={{ whiteSpace: 'pre-line', flexGrow: 1 }}
                >
                  <strong>สายพันธุ์:</strong> {pet.breed} <br />
                  <strong>ประเภท:</strong> {pet.type} <br />
                  <strong>เพศ:</strong> {pet.gender} <br />
                  <strong>อายุ:</strong> {pet.age} ปี<br />
                  {pet.description}
                </MuiTypography>
                <Box mt={2}>
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={() => handleDetailClick(pet.id)}
                  >
                    รับเลี้ยง
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
        {getFillers().map((_, index) => (
          <Grid item xs={12} sm={6} md={4} key={`filler-${index}`} sx={{ visibility: 'hidden' }}>
            <Box sx={{ width: 300, height: 500 }} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
