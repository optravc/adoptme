'use client';
import { useState, useEffect } from 'react';
import { Typography, Box } from '@mui/material';
import styles from './shop.module.css'; // อย่าลืม import ไฟล์ที่มี fadeIn ด้วย!
import ShopControls from '../src/components/Shop/ShopFilter';
import ShopCardSales from '../src/components/Shop/ShopCardSales';

export default function ShopPage() {
  const [products, setProducts] = useState([]);
  const [typeFilter, setTypeFilter] = useState('ทั้งหมด');
  const [subtypeFilter, setSubtypeFilter] = useState('ทั้งหมด');
  const [sortOrder, setSortOrder] = useState('asc');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      const res = await fetch('/api/shop');
      const data = await res.json();
      setProducts(data);
      setLoading(false);
    };
    fetchProducts();
  }, []);

  const filtered = products
    .filter(p =>
      (typeFilter === 'ทั้งหมด' || p.type === typeFilter) && 
      (subtypeFilter === 'ทั้งหมด' || p.subtype === subtypeFilter)
    )
    .sort((a, b) => {
      const priceA = parseFloat(a.price);
      const priceB = parseFloat(b.price);
      return sortOrder === 'asc' ? priceA - priceB : priceB - priceA;
    });

  return (
    <div className="main-container">
      <Box sx={{ padding: '40px' }}>
        {/* ส่วนหัว + fade-in */}
        <div className={`${styles.fadeIn} ${styles.fadeInDelay1}`}>
          <Typography variant="h2" textAlign="center" mb={4} sx={{ color: 'white' }}>
            🛒 สินค้าทั้งหมด
          </Typography>
        </div>

        {loading ? (
          <Typography align="center" sx={{ color: 'white' }}>
            กำลังโหลด...
          </Typography>
        ) : (
          // ส่วน Filter + Cards + fade-in
          <div className={`${styles.fadeIn} ${styles.fadeInDelay2}`}>
            <Box sx={{ display: 'flex', gap: 4, alignItems: 'flex-start' }}>
              {/* Sidebar Filter */}
              <Box sx={{ flex: '0 0 300px' }}>
                <ShopControls   
                  typeFilter={typeFilter}
                  setTypeFilter={setTypeFilter}
                  subtypeFilter={subtypeFilter}
                  setSubtypeFilter={setSubtypeFilter}
                  sortOrder={sortOrder}
                  setSortOrder={setSortOrder}
                />
              </Box>

              {/* Cards section */}
              <Box sx={{ flex: 1 }}>
                <ShopCardSales products={filtered} />
              </Box>
            </Box>
          </div>
        )}
      </Box>
    </div>
  );
}
