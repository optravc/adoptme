'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
    Box, Typography, TextField, Button, Grid, MenuItem, Stack
} from '@mui/material';

export default function EditPetSalePage() {
    const { id } = useParams();
    const router = useRouter();

    const [petDetails, setPetDetails] = useState({
        owner_name: '',
        pet_name: '',
        type: '',
        breed: '',
        gender: '',
        age: '',
        sales: '',
        description: '',
        tel: '',
    });
    const [imageFile, setImageFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    useEffect(() => {
        if (id) {
            fetch(`/api/adopt/getadopt?id=${id}`)
                .then(res => res.json())
                .then(data => {
                    setPetDetails({
                        owner_name: data.owner_name,
                        pet_name: data.pet_name,
                        type: data.type,
                        breed: data.breed,
                        gender: data.gender,
                        sales: data.sales,
                        description: data.description,
                        tel: data.tel,
                    });
                    setPreviewUrl(`/upload/petadopt/${mapTypeToFolder(data.type)}/${data.image_urlmain}`);
                });
        }
    }, [id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setPetDetails(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async () => {
        const formData = new FormData();
        Object.entries(petDetails).forEach(([key, value]) => {
            formData.append(key, value);
        });
        if (imageFile) {
            formData.append('image', imageFile);
        }
        formData.append('id', id);

        const res = await fetch('/api/adopt/updatepetadopt/', {
            method: 'POST',
            body: formData,
        });

        const data = await res.json();
        if (res.ok) {
            alert('แก้ไขสำเร็จ');
            router.push('/adopt/myadopt'); // กลับไปหน้ารายการ
        } else {
            alert(data.message || 'เกิดข้อผิดพลาด');
        }
    };

    return (
        <Box sx={{ p: 4 }}>
            <Typography variant="h4" mb={3}>แก้ไขประกาศสัตว์เลี้ยง</Typography>

            <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                    <Stack spacing={2}>
                        <TextField label="ชื่อเจ้าของ" name="owner_name" value={petDetails.owner_name} onChange={handleInputChange} fullWidth />
                        <TextField label="ชื่อสัตว์เลี้ยง" name="pet_name" value={petDetails.pet_name} onChange={handleInputChange} fullWidth />

                        <TextField label="ประเภท" name="type" value={petDetails.type} onChange={handleInputChange} select fullWidth>
                            <MenuItem value="แมว">แมว</MenuItem>
                            <MenuItem value="สุนัข">สุนัข</MenuItem>
                            <MenuItem value="อื่นๆ">อื่นๆ</MenuItem>
                        </TextField>

                        <TextField label="สายพันธุ์" name="breed" value={petDetails.breed} onChange={handleInputChange} fullWidth />
                        <TextField label="เพศ" name="gender" value={petDetails.gender} onChange={handleInputChange} select fullWidth>
                            <MenuItem value="ผู้">ผู้</MenuItem>
                            <MenuItem value="เมีย">เมีย</MenuItem>
                        </TextField>
                        <TextField label="อายุ" name="age" value={petDetails.age} onChange={handleInputChange} fullWidth />
                        <TextField label="เบอร์โทร" name="tel" value={petDetails.tel} onChange={handleInputChange} fullWidth />
                        <TextField
                            label="รายละเอียด"
                            name="description"
                            value={petDetails.description}
                            onChange={handleInputChange}
                            fullWidth
                            multiline
                            rows={4}
                        />
                    </Stack>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Typography mb={1}>รูปสัตว์เลี้ยง</Typography>
                    {previewUrl && (
                        <Box mb={2}>
                            <img src={previewUrl} alt="Preview" style={{ width: '100%', maxHeight: '300px', objectFit: 'cover', borderRadius: 8 }} />
                        </Box>
                    )}
                    <Button variant="contained" component="label">
                        เลือกรูปใหม่
                        <input hidden accept="image/*" type="file" onChange={handleImageChange} />
                    </Button>
                </Grid>
            </Grid>

            <Button variant="contained" color="primary" onClick={handleSubmit} sx={{ mt: 3 }}>
                บันทึกการแก้ไข
            </Button>
        </Box>
    );
}

function mapTypeToFolder(type) {
    switch (type) {
        case 'แมว': return 'cat';
        case 'สุนัข': return 'dog';
        case 'นก': return 'bird';
        default: return 'else';
    }
}
