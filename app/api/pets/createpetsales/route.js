import { NextResponse } from 'next/server';
import { getPool } from '../../lib/db';
import fs from 'fs';
import path from 'path';
import { writeFile } from 'fs/promises';

export async function POST(req) {
  try {
    const formData = await req.formData();

    const email = formData.get('email'); // รับ email
    const username = formData.get('username'); // รับ username
    const owner_name = formData.get('ownerName');
    const pet_name = formData.get('petName');
    const type = formData.get('type'); // รับประเภทสัตว์เลี้ยง (cat, dog, else)
    const breed = formData.get('breed');
    const gender = formData.get('gender');
    const age = formData.get('age');
    const sales = formData.get('sales');
    const description = formData.get('description');
    const tel = formData.get('tel');
    const images = formData.getAll('images');
    const user_id = Number(formData.get('user_id')); // รับ user_id จาก frontend

    if (!owner_name || !pet_name || !type || !breed || !gender || !age || !sales || !description || !tel || images.length < 1 || !user_id) {
      return NextResponse.json({ message: 'ข้อมูลไม่ครบถ้วน' }, { status: 400 });
    }

    const pool = getPool();

    // ตรวจสอบ email, username, และ user_id ว่ามีในฐานข้อมูลหรือไม่
    const [userCheck] = await pool.query(`
      SELECT id FROM users WHERE email = ? AND username = ? AND id = ?
    `, [email, username, Number(user_id)]); // <<< บังคับ user_id เป็น number
    

    if (userCheck.length === 0) {
      return NextResponse.json({ message: 'ไม่พบผู้ใช้งานที่มีอีเมล์, ชื่อผู้ใช้ หรือ id ตรงกัน' }, { status: 400 });
    }

    // ฟังก์ชันแปลงประเภทสัตว์เป็นโฟลเดอร์ที่เก็บรูปภาพ
    const mapTypeToFolder = (type) => {
      switch (type) {
        case 'สุนัข': return 'dog';
        case 'แมว': return 'cat';
        case 'นก': return 'bird';
        default: return 'else';
      }
    };

    // ใช้โฟลเดอร์ที่มีอยู่แล้ว
    const uploadDir = path.join(process.cwd(), 'public', 'upload', 'petsales', mapTypeToFolder(type));

    // ตรวจสอบว่าโฟลเดอร์มีอยู่หรือไม่ หากไม่มีจะใช้โฟลเดอร์ที่มีอยู่แล้ว
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const imageFilenames = [];
    for (const image of images) {
      const buffer = Buffer.from(await image.arrayBuffer());
      const filename = image.name;
      await writeFile(`${uploadDir}/${filename}`, buffer);
      imageFilenames.push(filename);
    }

    while (imageFilenames.length < 6) {
      imageFilenames.push('');
    }

    const sql = `
      INSERT INTO petsales (
        user_id, owner_name, pet_name, type, breed, gender, age, sales, description, tel,
        image_urlmain, image_url2, image_url3, image_url4, image_url5, image_url6
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      user_id, owner_name, pet_name, type, breed, gender, age, sales,
      description, tel,
      ...imageFilenames
    ];

    const [result] = await pool.query(sql, values);
    return NextResponse.json({ message: 'ลงขายสำเร็จ', id: result.insertId });

  } catch (err) {
    console.error('เกิดข้อผิดพลาด:', err);
    return NextResponse.json({ message: 'เกิดข้อผิดพลาด', error: err.message }, { status: 500 });
  }
}
