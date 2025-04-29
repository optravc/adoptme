import { NextResponse } from 'next/server';
import { getPool } from '../../../lib/db';
import path from 'path';
import { existsSync, unlinkSync } from 'fs';

const mapTypeToFolder = (type) => {
  switch (type) {
    case 'อาหาร': return 'food';
    case 'ของเล่น': return 'toys';
    case 'อุปกรณ์': return 'equipment';
    default: return 'else';
  }
};

// ✅ เพิ่มสินค้าใหม่
export async function POST(request) {
  const { name, description, image, price, stock, type, subtype } = await request.json();
  const pool = getPool();
  await pool.execute(
    'INSERT INTO products (name, description, image, price, stock, type, subtype) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [name, description, image, price, stock, type, subtype]
  );
  return NextResponse.json({ success: true });
}

// ✅ อัปเดตสินค้า
export async function PUT(request, { params }) {
  const { id } = params;
  const { name, description, image, price, stock, type, subtype } = await request.json();

  const pool = getPool();

  // ดึงข้อมูลสินค้าเดิม (image + type)
  const [rows] = await pool.execute('SELECT image, type FROM products WHERE id = ?', [id]);
  const oldImage = rows[0]?.image;
  const oldType = rows[0]?.type;
  const oldFolder = mapTypeToFolder(oldType);

  // ถ้ารูปภาพมีการเปลี่ยน → ลบของเก่า
  if (oldImage && oldImage !== image) {
    const imagePath = path.join(process.cwd(), 'public', 'upload', oldFolder, oldImage);

    if (existsSync(imagePath)) {
      try {
        unlinkSync(imagePath);
        console.log(`🗑 ลบรูปเก่า: ${oldImage} (${oldFolder})`);
      } catch (err) {
        console.error('❌ ลบรูปไม่สำเร็จ:', err);
      }
    } else {
      console.warn(`📁 ไม่พบรูป ${oldImage} ในโฟลเดอร์ ${oldFolder}`);
    }
  }

  await pool.execute(
    'UPDATE products SET name = ?, description = ?, image = ?, price = ?, stock = ?, type = ?, subtype = ? WHERE id = ?',
    [name, description, image, price, stock, type, subtype, id]
  );

  return NextResponse.json({ success: true });
}

// ✅ ลบสินค้า
export async function DELETE(request, context) {
  const { params } = await context;
  const { id } = params;

  if (!id) {
    return NextResponse.json({ message: 'กรุณาระบุ id' }, { status: 400 });
  }

  const pool = getPool();

  // ดึงข้อมูลสินค้าเพื่อลบไฟล์รูป
  const [rows] = await pool.query('SELECT image, type FROM products WHERE id = ?', [id]);
  if (rows.length === 0) {
    return NextResponse.json({ message: 'ไม่พบสินค้า' }, { status: 404 });
  }

  const { image, type } = rows[0];
  const folder = mapTypeToFolder(type);

  // ลบไฟล์รูปถ้ามี
  if (image) {
    const imagePath = path.join(process.cwd(), 'public', 'upload', folder, image);

    if (existsSync(imagePath)) {
      try {
        unlinkSync(imagePath);
        console.log(`🗑 ลบไฟล์รูปสินค้า: ${image}`);
      } catch (error) {
        console.error('❌ ลบรูปไม่สำเร็จ:', error);
      }
    }
  }

  // ลบข้อมูลสินค้าจากฐานข้อมูล
  await pool.query('DELETE FROM products WHERE id = ?', [id]);

  return NextResponse.json({ message: 'ลบสินค้าเรียบร้อยแล้ว' });
}
