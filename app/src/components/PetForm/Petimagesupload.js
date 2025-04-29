'use client';
import { useState, useEffect } from 'react';
import { Grid, Box, Typography, Button } from '@mui/material';

export default function SalesoradoptmeGrid({
  setImages,
  images,
  previewUrls,
  setPreviewUrls,
  confirmedImages,
  setConfirmedImages,
  resetSignal,
}) {
  const handleDrop = (e, index) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      const newImages = [...images];
      newImages[index] = file;
      setImages(newImages);

      const newPreviews = [...previewUrls];
      newPreviews[index] = URL.createObjectURL(file);
      setPreviewUrls(newPreviews);
    }
  };

  const handleConfirm = (index) => {
    const newConfirmedImages = [...confirmedImages];
    newConfirmedImages[index] = true;
    setConfirmedImages(newConfirmedImages);
  };

  const handleDelete = (index) => {
    const newImages = [...images];
    newImages[index] = null;
    setImages(newImages);

    const newPreviews = [...previewUrls];
    newPreviews[index] = null;
    setPreviewUrls(newPreviews);

    const newConfirmedImages = [...confirmedImages];
    newConfirmedImages[index] = false;
    setConfirmedImages(newConfirmedImages);
  };

  // ✅ Reset preview และ confirm เมื่อ resetSignal เปลี่ยน
  useEffect(() => {
    setPreviewUrls(Array(6).fill(null));
    setConfirmedImages(Array(6).fill(false));
  }, [resetSignal]);

  return (
    <>
      <Typography variant="h6" sx={{ mb: 2 }}>
        รูปภาพ (สูงสุด 6 รูป)
      </Typography>
      <Grid container spacing={2}>
        {images.map((img, index) => (
          <Grid item xs={12} sm={4} key={index}>
            <Box
              onDrop={(e) => handleDrop(e, index)}
              onDragOver={(e) => e.preventDefault()}
              sx={{
                width: '100%',
                height: 200,
                border: '2px dashed #aaa',
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#f9f9f9',
                position: 'relative',
                overflow: 'hidden',
                cursor: 'pointer',
              }}
            >
              {previewUrls[index] ? (
                <img
                  src={previewUrls[index]}
                  alt={`uploaded-${index}`}
                  style={{ maxWidth: '100%', maxHeight: '100%' }}
                />
              ) : (
                <Typography sx={{ color: '#aaa' }}>
                  ลากรูปภาพมาวางที่นี่
                </Typography>
              )}
            </Box>
            {images[index] && !confirmedImages[index] && (
              <Button variant="contained" onClick={() => handleConfirm(index)} sx={{ mt: 1 }}>
                ยืนยันการลงรูปภาพ
              </Button>
            )}
            {images[index] && (
              <Button variant="outlined" onClick={() => handleDelete(index)} sx={{ mt: 1, ml: 1 }}>
                ลบรูปภาพ
              </Button>
            )}
          </Grid>
        ))}
      </Grid>
    </>
  );
}
