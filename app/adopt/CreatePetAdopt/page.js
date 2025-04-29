'use client';
import { useState } from 'react';
import PetAdoptControls from '../../src/components/PetForm/PetAdoptForm';
import SalesoradoptmeGrid from '../../src/components/PetForm/Petimagesupload';
import { Button } from '@mui/material';
import styles from './CreatePetadoptme.module.css';

export default function PetAdoptPage() {
  const [images, setImages] = useState(Array(6).fill(null));
  const [confirmedImages, setConfirmedImages] = useState(Array(6).fill(false));
  const [previewUrls, setPreviewUrls] = useState(Array(6).fill(null));
  const [resetSignal, setResetSignal] = useState(0);
  const [petDetails, setPetDetails] = useState({
    ownerName: '',
    petName: '',
    type: '',
    breed: '',
    gender: '',
    age: '',
    tel: '',
    description: '',
  });

  const handleSubmit = async () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || !user.username) {
      alert('กรุณาเข้าสู่ระบบก่อนลงประกาศ');
      return;
    }

    if (!petDetails.ownerName || !petDetails.petName || !petDetails.type || !petDetails.breed || !petDetails.gender || !petDetails.age || !petDetails.tel || !petDetails.description) {
      alert('กรุณากรอกข้อมูลให้ครบถ้วน');
      return;
    }

    if (!/^\d{9,10}$/.test(petDetails.tel)) {
      alert('กรุณากรอกเบอร์โทรให้ถูกต้อง (9-10 ตัวเลข)');
      return;
    }

    const selectedImages = images.filter(img => img !== null);
    if (selectedImages.length === 0) {
      alert('กรุณาอัปโหลดรูปสัตว์เลี้ยงอย่างน้อย 1 รูป');
      return;
    }


    const formData = new FormData();
    Object.entries(petDetails).forEach(([key, value]) => {
      formData.append(key, value);
    });
    if (selectedImages && selectedImages.length > 0) {
      selectedImages.forEach(image => {
        if (image) {
          formData.append('images', image);
        }
      });
    } 

    formData.append('user_id', user.id);
    formData.append('email', user.email);
    formData.append('username', user.username);

    try {
      const response = await fetch('/api/adopt/createpetadopt ', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        alert('บันทึกข้อมูลสำเร็จ');
        setPetDetails({
          ownerName: '',  petName: '', type: '',
          breed: '',gender: '', age: '',tel: '',
          description: '',
        });

        setImages(Array(6).fill(null));
        setPreviewUrls(Array(6).fill(null));
        setConfirmedImages(Array(6).fill(false));
        setResetSignal(prev => prev + 1);
      } else {
        alert(`เกิดข้อผิดพลาด: ${data?.message || 'ไม่สามารถบันทึกได้'}`);
      }
    } catch (err) {
      console.error('เชื่อมต่อผิดพลาด:', err);
      alert('เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์');
    }
  };

  return (
    <div className="main-container">
  <div className={styles.Body}>
        <h1 className={styles.Title}>ลงสัตว์เลี้ยงให้รับเลี้ยง</h1>
        <PetAdoptControls petDetails={petDetails} setPetDetails={setPetDetails} />
        <SalesoradoptmeGrid
          setImages={setImages}
          images={images}
          previewUrls={previewUrls}
          setPreviewUrls={setPreviewUrls}
          confirmedImages={confirmedImages}
          setConfirmedImages={setConfirmedImages}
          resetSignal={resetSignal} 
        />
        <Button variant="contained" onClick={handleSubmit} sx={{ mt: 2 }}>
          ยืนยันการลงรับเลี้ยง
        </Button>
      </div>
    </div>
  );
}
