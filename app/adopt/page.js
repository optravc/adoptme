'use client';
import { useState, useEffect } from 'react';
import { Typography, Box } from '@mui/material';
import styles from './adopt.module.css';
import PetControls from '../src/components/PetFliter/PetFilterControls';
import PetCardAdopt from '../src/components/PetCard/PetCardAdopt';

export default function AdoptPage() {
  const [allPets, setAllPets] = useState([]);
  const [filter, setFilter] = useState('ทั้งหมด');
  const [breedFilter, setBreedFilter] = useState('ทั้งหมด');
  const [sortOrder, setSortOrder] = useState('asc');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const res = await fetch('/api/adopt');
        const data = await res.json();
  
        // ⭐ เพิ่ม mapTypeToFolder ตรงนี้
        const mapTypeToFolder = (type) => {
          switch (type) {
            case 'นก': return 'bird';
            case 'แมว': return 'cat';
            case 'สุนัข': return 'dog';
            default: return 'other';
          }
        };
  
        // ⭐ map ข้อมูลใหม่แบบเติม path รูปให้ถูก
        const mapped = data.map((pet) => ({
          id: pet.id,
          name: pet.pet_name,
          type: pet.type,
          breed: pet.breed,
          gender: pet.gender,
          age: pet.age,
          sales: pet.sales,
          description: pet.description,
          image_urlmain: `/upload/petadopt/${mapTypeToFolder(pet.type)}/${pet.image_urlmain}`, // ⭐ ตรงนี้เปลี่ยน!
        }));
  
        setAllPets(mapped);
      } catch (err) {
        console.error('โหลดข้อมูลล้มเหลว:', err);
      } finally {
        setLoading(false);
      }
    };
  
    fetchPets();
  }, []);
  

  const filteredPets = allPets
    .filter((pet) => filter === 'ทั้งหมด' || pet.type === filter)
    .filter((pet) => breedFilter === 'ทั้งหมด' || pet.breed === breedFilter)
    .sort((a, b) => {
      const priceA = parseFloat(a.sales);
      const priceB = parseFloat(b.sales);
      return sortOrder === 'asc' ? priceA - priceB : priceB - priceA;
    });

  return (
    <div className="main-container">
      <div className={styles.Body}>
        {/* ส่วนหัว + fade-in */}
        <div className={`${styles.fadeIn} ${styles.fadeInDelay1}`}>
          <Box sx={{ textAlign: 'left', mb: 4 }}>
            <Typography variant="h2" className={styles.TitleShadow}>
              Pet Adopt
            </Typography>
            <Typography
              variant="h5"
              sx={{
                mt: 2,
                color: 'white',
                textShadow: '1px 1px 3px rgba(0,0,0,0.5)',
              }}
            >
              รับเลี้ยงสัตว์หนึ่งตัว แล้วคุณจะได้เพื่อนแท้ตลอดไป มีสมาชิกใหม่ที่ต้องการจะไปอยู่กับคุณ
            </Typography>
          </Box>
        </div>

        {/* ส่วนฟิลเตอร์ + รายการสัตว์ */}
        {loading ? (
          <Typography align="center" mt={4} sx={{ color: 'white' }}>
            กำลังโหลดข้อมูล...
          </Typography>
        ) : (
          <div className={`${styles.fadeIn} ${styles.fadeInDelay2}`}>
            <Box sx={{ display: 'flex', gap: 4, alignItems: 'flex-start' }}>
              <Box sx={{ flex: '0 0 300px' }}>
                <PetControls
                  filter={filter}
                  setFilter={setFilter}
                  breedFilter={breedFilter}
                  setBreedFilter={setBreedFilter}
                  sortOrder={sortOrder}
                  setSortOrder={setSortOrder}
                  pets={allPets}
                />
              </Box>
              <Box sx={{ flex: 1 }}>
                <PetCardAdopt pets={filteredPets} />
              </Box>
            </Box>
          </div>
        )}
      </div>
    </div>
  );
}
