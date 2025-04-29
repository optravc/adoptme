// /pages/admin/page.js
'use client';
import Productcard from '../src/components/Admin/Productcard';
import AddProductForm from '../src/components/Admin/AddProducform';
import {  Typography } from '@mui/material';
import { useState, useEffect } from 'react';
import styles from './admin.module.css';

export default function AdminPage() {
  const [products, setProducts] = useState([]);

  // โหลดข้อมูลสินค้า
  const loadProducts = async () => {
    const res = await fetch('/api/product');
    if (!res.ok) return alert('โหลดข้อมูลสินค้าไม่สำเร็จ');
    const data = await res.json();
    setProducts(data);
  };

  // ฟังก์ชันเพิ่มสินค้าใหม่
  const handleAddProduct = async (newProduct) => {
    await fetch('/api/product', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newProduct),
    });
    loadProducts();
  };

  // ฟังก์ชันลบสินค้า
  const handleDelete = async (id) => {
    await fetch(`/api/product/${id}`, { method: 'DELETE' });
    loadProducts();
  };

  // ฟังก์ชันเพิ่มสต็อกสินค้า
  const handleAddStock = async (id) => {
    await fetch(`/api/product/${id}/add`, { method: 'PUT' });
    loadProducts();
  };

  // ฟังก์ชันลดสต็อกสินค้า
  const handleRemoveStock = async (id) => {
    await fetch(`/api/product/${id}/remove`, { method: 'PUT' });
    loadProducts();
  };

  // ฟังก์ชันแก้ไขสินค้า
  const handleEditProduct = async (editedProduct) => {
    await fetch(`/api/product/${editedProduct.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editedProduct),
    });
    loadProducts();
  };

  // โหลดข้อมูลสินค้าทุกครั้งเมื่อหน้าเพจโหลด
  useEffect(() => {
    loadProducts();
  }, []);

  return (
    <div className={styles.adminContainer}>
      <div className={styles.formSection}>
        <Typography variant="h4" sx={{ mb: 3 }}>🛠️ จัดการสินค้า (Admin)</Typography>
        <AddProductForm onAdd={handleAddProduct} />  {/* ฟอร์มสำหรับเพิ่มสินค้าใหม่ */}
      </div>

      <div className={styles.productList}>
        {/* แสดงรายการสินค้า */}
        {products.map((item) => (
          <Productcard
            key={item.id}
            product={item}
            isAdmin={true}  // กำหนดว่าเป็น admin
            onAddStock={handleAddStock}
            onRemoveStock={handleRemoveStock}
            onDelete={handleDelete}
            onEdit={handleEditProduct}  // ฟังก์ชันสำหรับแก้ไขสินค้า
          />
        ))}
      </div>
    </div>
  );
}
