'use client';
import React from 'react';
import { Box, FormControl, InputLabel, MenuItem, Select, Typography } from '@mui/material';

const types = ['ทั้งหมด', 'อาหาร', 'ของเล่น', 'อุปกรณ์', 'อื่น ๆ'];
const subtypes = ['ทั้งหมด', 'อาหารแมว', 'อาหารหมา', 'ของเล่น'];
const sortOptions = [
  { value: 'asc', label: 'ราคาต่ำ → สูง' },
  { value: 'desc', label: 'ราคาสูง → ต่ำ' },
];

export default function ShopControls({
  typeFilter, 
  setTypeFilter, 
  subtypeFilter, 
  setSubtypeFilter, 
  sortOrder, 
  setSortOrder 
}) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Typography variant="h6" sx={{ color: 'white' }}>
        กรองสินค้า
      </Typography>

      {/* หมวดหมู่ */}
      <FormControl fullWidth size="small">
        <InputLabel sx={{ color: 'black', fontSize: '1.2rem' }}>
          หมวดหมู่
        </InputLabel>
        <Select
          value={typeFilter}
          label="หมวดหมู่"
          onChange={(e) => setTypeFilter(e.target.value)}
          sx={{
            backgroundColor: 'white',
            fontSize: '1.2rem',
          }}
        >
          {types.map((type) => (
            <MenuItem key={type} value={type} sx={{ fontSize: '1.2rem' }}>
              {type}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* ประเภทย่อย */}
      <FormControl fullWidth size="small">
        <InputLabel sx={{ color: 'black', fontSize: '1.2rem' }}>
          ประเภทย่อย
        </InputLabel>
        <Select
          value={subtypeFilter}
          label="ประเภทย่อย"
          onChange={(e) => setSubtypeFilter(e.target.value)}
          sx={{
            backgroundColor: 'white',
            fontSize: '1.2rem',
          }}
        >
          {subtypes.map((subtype) => (
            <MenuItem key={subtype} value={subtype} sx={{ fontSize: '1.2rem' }}>
              {subtype}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* เรียงตามราคา */}
      <FormControl fullWidth size="small">
        <InputLabel sx={{ color: 'black', fontSize: '1.2rem' }}>
          เรียงตามราคา
        </InputLabel>
        <Select
          value={sortOrder}
          label="เรียงตามราคา"
          onChange={(e) => setSortOrder(e.target.value)}
          sx={{
            backgroundColor: 'white',
            fontSize: '1.2rem',
          }}
        >
          {sortOptions.map((opt) => (
            <MenuItem key={opt.value} value={opt.value} sx={{ fontSize: '1.2rem' }}>
              {opt.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}
