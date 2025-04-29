'use client';
import {
  Stack,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Typography,
} from '@mui/material';

export default function PetControls({
  sortOrder,
  setSortOrder,
  filter,
  setFilter,
  breedFilter,
  setBreedFilter,
  pets = [],
}) {
  const uniqueTypes = ['ทั้งหมด', ...new Set(pets.map((pet) => pet.type))];
  const uniqueBreeds = ['ทั้งหมด', ...new Set(pets.map((pet) => pet.breed))];

  const filteredBreeds = filter === 'ทั้งหมด'
    ? uniqueBreeds
    : ['ทั้งหมด', ...new Set(pets.filter((pet) => pet.type === filter).map((pet) => pet.breed))];

  return (
    <Stack spacing={2} mb={3} alignItems="flex-start" sx={{ width: '100%' }}>
      {/* หัวข้อ */}
      <Typography
        variant="subtitle1"
        fontWeight="bold"
        sx={{ mb: 2, fontSize: '1.5rem', color: 'white' }}
      >
        หมวดหมู่
      </Typography>

      {/* หมวดหมู่ปุ่ม */}
      <Stack direction="row" spacing={1} flexWrap="wrap">
  {uniqueTypes.map((type) => (
    <Button
      key={type}
      variant="contained"
      onClick={() => setFilter(type)}
      size="medium"
      sx={{
        fontSize: '1.2rem',
        backgroundColor: filter === type ? 'primary.main' : 'white', // << สีพื้นหลังปกติขาว
        color: filter === type ? 'white' : 'primary.main',           // << ตัวหนังสือ
        border: '1px solid', 
        borderColor: 'primary.main',
        '&:hover': {
          backgroundColor: filter === type ? 'primary.dark' : '#f0f0f0', // hover ขาวเป็นเทาอ่อน
        },
      }}
    >
      {type}
    </Button>
  ))}
</Stack>

      {/* เรียงราคาตาม */}
      <FormControl size="small" sx={{ minWidth: 180 }}>
        <InputLabel sx={{ fontSize: '1.2rem', color: 'black' }}>
          ราคา
        </InputLabel>
        <Select
          value={sortOrder}
          label="ราคา"
          onChange={(e) => setSortOrder(e.target.value)}
          sx={{
            fontSize: '1.2rem',
            backgroundColor: 'white',
          }}
        >
          <MenuItem value="asc" sx={{ fontSize: '1.2rem' }}>
            น้อย → มาก
          </MenuItem>
          <MenuItem value="desc" sx={{ fontSize: '1.2rem' }}>
            มาก → น้อย
          </MenuItem>
        </Select>
      </FormControl>

      {/* ประเภท */}
      <FormControl size="small" sx={{ minWidth: 180 }}>
        <InputLabel id="type-select-label" sx={{ fontSize: '1.2rem', color: 'black' }}>
          ประเภท
        </InputLabel>
        <Select
          labelId="type-select-label"
          value={filter}
          label="ประเภท"
          onChange={(e) => setFilter(e.target.value)}
          sx={{
            fontSize: '1.2rem',
            backgroundColor: 'white',
          }}
        >
          {uniqueTypes.map((type) => (
            <MenuItem key={type} value={type} sx={{ fontSize: '1.2rem' }}>
              {type}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* สายพันธุ์ */}
      <FormControl size="small" sx={{ minWidth: 180 }}>
        <InputLabel id="breed-select-label" sx={{ fontSize: '1.2rem', color: 'black' }}>
          สายพันธุ์
        </InputLabel>
        <Select
          labelId="breed-select-label"
          value={breedFilter}
          label="สายพันธุ์"
          onChange={(e) => setBreedFilter(e.target.value)}
          sx={{
            fontSize: '1.2rem',
            backgroundColor: 'white',
          }}
        >
          {filteredBreeds.map((breed) => (
            <MenuItem key={breed} value={breed} sx={{ fontSize: '1.2rem' }}>
              {breed}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Stack>
  );
}
