'use client';
import { Button, Stack } from '@mui/material';

export default function PetFilterButtons({ filter, setFilter }) {
  return (
    <Stack direction="row" spacing={2} mb={4} flexWrap="wrap" justifyContent="center">
      <Button variant={filter === 'ทั้งหมด' ? 'contained' : 'outlined'} onClick={() => setFilter('ทั้งหมด')}>
        ทั้งหมด
      </Button>
      <Button variant={filter === 'แมว' ? 'contained' : 'outlined'} onClick={() => setFilter('แมว')}>
        แมว 🐱
      </Button>
      <Button variant={filter === 'สุนัข' ? 'contained' : 'outlined'} onClick={() => setFilter('สุนัข')}>
        สุนัข 🐶
      </Button>
    </Stack>
  );
}