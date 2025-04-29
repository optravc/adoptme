import { NextResponse } from 'next/server';
import { getPool } from '../../lib/db';

//  โหลดข้อมูลสินค้า
export async function GET() {
  try {
    const pool = getPool();
    const [rows] = await pool.execute('SELECT * FROM products ORDER BY id DESC');
    return NextResponse.json(rows);
  } catch (error) {
    console.error('โหลดข้อมูลผิดพลาด:', error);
    return NextResponse.json({ message: 'เกิดข้อผิดพลาด', error: error.message }, { status: 500 });
  }
}

// เพิ่มสินค้าใหม่
export async function POST(request) {
  try {
    const { name, description, image, price, stock, type, subtype } = await request.json();

    if (!name || !price || !stock || !type || !image) {
      return NextResponse.json({ message: 'ข้อมูลไม่ครบถ้วน' }, { status: 400 });
    }

    const pool = getPool();
    await pool.execute(
      'INSERT INTO products (name, description, image, price, stock, type, subtype) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [name, description, image, price, stock, type, subtype]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('เพิ่มสินค้าผิดพลาด:', error);
    return NextResponse.json({ message: 'เกิดข้อผิดพลาด', error: error.message }, { status: 500 });
  }
}
