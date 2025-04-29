'use client';
import { useEffect, useState } from 'react';
import { Typography, Box } from '@mui/material';
import styles from './pet.module.css';
import PetControls from '../src/components/PetFliter/PetFilterControls';
import PetCardSales from '../src/components/PetCard/PetCardSales';

function mapTypeToFolder(type) {
  switch (type) {
    case 'แมว': return 'cat';
    case 'สุนัข': return 'dog';
    case 'นก': return 'bird';
    default: return 'else';
  }
}

export default function Petspage() {
  const [allPets, setAllPets] = useState([]);
  const [filter, setFilter] = useState('ทั้งหมด');
  const [breedFilter, setBreedFilter] = useState('ทั้งหมด');
  const [sortOrder, setSortOrder] = useState('asc');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const res = await fetch('/api/pets');
        const data = await res.json();

        const mapped = data.map((pet) => ({
          id: pet.id,
          owner_name: pet.owner_name,
          name: pet.pet_name,
          type: pet.type,
          breed: pet.breed,
          gender: pet.gender,
          age: pet.age,
          sales: pet.sales,
          tel: pet.tel,
          description: pet.description,
          image_urlmain: pet.image_urlmain 
            ? `/upload/petsales/${mapTypeToFolder(pet.type)}/${pet.image_urlmain}`
            : '/upload/noimg.png',
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
    .filter((pet) =>
      (filter === 'ทั้งหมด' || pet.type === filter) &&
      (breedFilter === 'ทั้งหมด' || pet.breed === breedFilter)
    )
    .sort((a, b) => {
      const priceA = parseFloat(a.sales);
      const priceB = parseFloat(b.sales);
      return sortOrder === 'asc' ? priceA - priceB : priceB - priceA;
    });

    return (
      <div className="main-container">
        <div className={styles.Body}>
          {/* ส่วนหัว อยู่บนสุดและเยื้องซ้าย */}
          <Box sx={{ textAlign: 'left', mb: 4 }}>
            <Typography variant="h2" className={styles.TitleShadow}>
              Pet Store
            </Typography>
            <Typography variant="h5" sx={{ mt: 2, color: 'white', textShadow: '1px 1px 3px rgba(0,0,0,0.5)', }}>
              มาหาสมาชิกใหม่ให้ครอบครัวของคุณด้วยสัตว์เลี้ยงสุดน่ารักจากเจ้าของโดยตรง
            </Typography>
          </Box>
    
          {/* ส่วนฟิลเตอร์ + รายการสัตว์ */}
          {loading ? (
            <Typography align="center" mt={4} sx={{ color: 'white' }}>
              กำลังโหลดข้อมูล...
            </Typography>
          ) : (
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
                <PetCardSales pets={filteredPets} />
              </Box>
            </Box>
          )}
        </div>
      </div>
    );       
}
