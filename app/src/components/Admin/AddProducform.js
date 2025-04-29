'use client';
import React, { useState } from 'react';
import {
  Box, Button, TextField, Typography, MenuItem,
  Select, InputLabel, FormControl
} from '@mui/material';
import { useDropzone } from 'react-dropzone';

export default function AddProductForm({ onAdd }) {
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    image: null,
    type: '',
    subtype: '',
  });

  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const mapTypeToFolder = (type) => {
    switch (type) {
      case 'อาหาร': return 'food';
      case 'ของเล่น': return 'toys';
      case 'อุปกรณ์': return 'equipment';
      default: return 'else';
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      return alert('กรุณาเลือกรูปภาพก่อน');
    }
    if (!form.type) {
      return alert('กรุณาเลือกประเภทสินค้าก่อน');
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      const folder = mapTypeToFolder(form.type);

      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'folder-type': folder,
        },
        body: formData,
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Upload failed: ${text}`);
      }

      const data = await res.json();
      const fileNameOnly = data.url.replace(`/upload/${folder}/`, '');

      // อัปโหลดเสร็จแล้วค่อยเพิ่มสินค้า
      onAdd({ ...form, image: fileNameOnly });

      // reset form หลังเพิ่มเสร็จ
      handleClear();
    } catch (err) {
      console.error('Upload error:', err);
      alert('เกิดข้อผิดพลาดในการอัปโหลดไฟล์');
    } finally {
      setUploading(false);
    }
  };


  

  const handleClear = () => {
    setForm({
      name: '',
      description: '',
      price: '',
      stock: '',
      image: null,
      type: '',
      subtype: '',
    });
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl); // clear memory URL
    }
    setPreviewUrl(null);
  };

  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
  });

  return (
    <Box sx={{ my: 4 }}>
      <Typography variant="h6">➕ เพิ่มสินค้า</Typography>

      <TextField label="ชื่อสินค้า" name="name" fullWidth sx={{ mb: 1 }}
        value={form.name} onChange={handleChange} />

      <TextField label="รายละเอียด" name="description" fullWidth sx={{ mb: 1 }}
        value={form.description} onChange={handleChange} />

      <TextField label="ราคา" name="price" type="number" fullWidth sx={{ mb: 1 }}
        value={form.price} onChange={handleChange} />

      <TextField label="จำนวน" name="stock" type="number" fullWidth sx={{ mb: 2 }}
        value={form.stock} onChange={handleChange} />

      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>ประเภทสินค้า</InputLabel>
        <Select name="type" value={form.type}
          onChange={handleChange} label="ประเภทสินค้า">
          <MenuItem value="อาหาร">อาหาร</MenuItem>
          <MenuItem value="ของเล่น">ของเล่น</MenuItem>
          <MenuItem value="อุปกรณ์">อุปกรณ์</MenuItem>
          <MenuItem value="อื่น ๆ">อื่น ๆ</MenuItem>
        </Select>
      </FormControl>

      <TextField label="ประเภทย่อย" name="subtype" fullWidth sx={{ mb: 2 }}
        value={form.subtype} onChange={handleChange} />

      <Box {...getRootProps()} sx={{
        border: '2px dashed #aaa',
        borderRadius: 2,
        p: 2,
        mb: 2,
        textAlign: 'center',
        cursor: 'pointer',
        bgcolor: isDragActive ? '#eee' : '#fafafa'
      }}>
        <input {...getInputProps()} />
        {previewUrl ? (
          <img
            src={previewUrl}
            alt="preview"
            style={{ maxHeight: 150, objectFit: 'cover', marginTop: 8 }}
          />
        ) : (
          <p>ลากรูปภาพมาวางที่นี่ หรือคลิกเพื่อเลือกรูป</p>
        )}
      </Box>

      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button variant="contained" onClick={handleSubmit} disabled={uploading}>
          {uploading ? 'กำลังเพิ่มสินค้า...' : 'เพิ่มสินค้า'}
        </Button>

        <Button variant="outlined" color="secondary" onClick={handleClear}>
          ล้างฟอร์ม
        </Button>
      </Box>
    </Box>
  );
}
