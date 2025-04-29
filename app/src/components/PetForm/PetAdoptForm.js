'use client';
import { Stack, TextField, Typography, MenuItem ,FormControl, InputLabel, Select} from '@mui/material';

export default function PetAdoptControls({ petDetails, setPetDetails }) {
  const handleChange = (field, value) => {
    setPetDetails(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Stack spacing={2} mb={3} alignItems="flex-start" sx={{ width: '100%' }}>
      <Typography variant="h6" fontWeight="bold" color="secondary.main">
        ลงรับเลี้ยงสัตว์
      </Typography>

      <TextField label="ชื่อผู้ให้รับเลี้ยง (หากไม่มีให้เว้นว่าง ' ' หรือ - )" value={petDetails.ownerName || ''} onChange={e => handleChange('ownerName', e.target.value)} size="small" fullWidth />
      <TextField label="ชื่อสัตว์เลี้ยง (หากไม่มีให้เว้นว่าง  ' ' หรือ - )" value={petDetails.petName || ''} onChange={e => handleChange('petName', e.target.value)} size="small" fullWidth />
     
      <FormControl fullWidth size="small">
        <InputLabel>ประเภทสัตว์</InputLabel>
        <Select
          value={petDetails.type || ''}
          onChange={e => handleChange('type', e.target.value)}
          label="ประเภทสัตว์"
        >
          <MenuItem value="สุนัข">สุนัข</MenuItem>
          <MenuItem value="แมว">แมว</MenuItem>
          <MenuItem value="นก">นก</MenuItem>
        </Select>
        </FormControl>


      <TextField label="สายพันธุ์ (หากไม่แน่ใจให้เว้นว่าง ' ' หรือ - )" value={petDetails.breed || ''} onChange={e => handleChange('breed', e.target.value)} size="small" fullWidth />
      <TextField label="เพศ" select value={petDetails.gender || ''} onChange={e => handleChange('gender', e.target.value)} size="small" fullWidth>
        <MenuItem value="ผู้">ผู้</MenuItem>
        <MenuItem value="เมีย">เมีย</MenuItem>
      </TextField>
      <TextField label="อายุ (หากไม่แน่ใจให้เว้นว่าง ' ' หรือ - )" value={petDetails.age || ''} onChange={e => handleChange('age', e.target.value)} size="small" fullWidth placeholder="เช่น 1 ปี หรือ 6 เดือน" />
      <TextField label="เบอร์โทร" value={petDetails.tel || ''} onChange={e => handleChange('tel', e.target.value)} size="small" fullWidth placeholder="087xxxxxxx" />
      <TextField label="รายละเอียดเพิ่มเติม" value={petDetails.description || ''} onChange={e => handleChange('description', e.target.value)} multiline rows={4} fullWidth />
    </Stack>
  );
}