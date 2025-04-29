import { NextResponse } from 'next/server';
import { getPool } from '../../../lib/db';
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
    const type = formData.get('type');
    const breed = formData.get('breed');
    const gender = formData.get('gender');
    const age = formData.get('age');
    const description = formData.get('description');
    const tel = formData.get('tel');
    const images = formData.getAll('images');
    const user_id = Number(formData.get('user_id'));

    if (!owner_name || !pet_name || !type || !breed || !gender || !age || !description || !tel || images.length < 1) {
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

    const mapTypeToFolder = (type) => {
      switch (type) {
        case 'สุนัข': return 'dog';
        case 'แมว': return 'cat';
        case 'นก': return 'bird';
        default: return 'else';
      }
    };


    const uploadDir = path.join(process.cwd(), 'public', 'upload', 'petadopt', mapTypeToFolder(type));

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
      INSERT INTO petadopt (
        user_id , owner_name, pet_name, type, breed, gender, age, description, tel,
        image_urlmain, image_url2, image_url3, image_url4, image_url5, image_url6
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [
      user_id, owner_name, pet_name, type, breed, gender, age, description, tel,
      ...imageFilenames
    ];

    const [result] = await pool.query(sql, values);
    return NextResponse.json({ message: 'ลงรับเลี้ยงสำเร็จ', id: result.insertId });

  } catch (err) {
    console.error('เกิดข้อผิดพลาด:', err);
    return NextResponse.json({ message: 'เกิดข้อผิดพลาด', error: err.message }, { status: 500 });
  }
}
