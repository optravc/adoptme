import { NextResponse } from 'next/server';
import { getPool } from '../../../../lib/db';
import fs from 'fs';
import path from 'path';

export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ message: 'กรุณาระบุ id' }, { status: 400 });
    }

    const pool = getPool();

    // 1. ดึงข้อมูลรูปทั้งหมด
    const [pets] = await pool.query(`
      SELECT image_urlmain, image_url2, image_url3, image_url4, image_url5, image_url6, type 
      FROM petadopt
      WHERE id = ?
    `, [id]);

    if (pets.length === 0) {
      return NextResponse.json({ message: 'ไม่พบประกาศนี้' }, { status: 404 });
    }

    const { image_urlmain, image_url2, image_url3, image_url4, image_url5, image_url6, type } = pets[0];

    // 2. ลบข้อมูลใน database
    await pool.query(`DELETE FROM petadopt WHERE id = ?`, [id]);

    // 3. ลบไฟล์รูปทั้งหมดที่มี
    const images = [image_urlmain, image_url2, image_url3, image_url4, image_url5, image_url6];
    const folder = mapTypeToFolder(type);

    images.forEach(image => {
      if (image) {
        const imagePath = path.join(process.cwd(), 'public', 'upload', 'petadopt', folder, image);
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      }
    });

    return NextResponse.json({ message: 'ลบประกาศและไฟล์รูปทั้งหมดสำเร็จ' });

  } catch (err) {
    console.error('เกิดข้อผิดพลาด:', err);
    return NextResponse.json({ message: 'เกิดข้อผิดพลาด', error: err.message }, { status: 500 });
  }
}

// ฟังก์ชันแมพประเภทสัตว์เป็นโฟลเดอร์
function mapTypeToFolder(type) {
  switch (type) {
    case 'แมว': return 'cat';
    case 'สุนัข': return 'dog';
    case 'นก': return 'bird';
    default: return 'else';
  }
}
