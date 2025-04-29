// app/api/register/route.js
import { NextResponse } from 'next/server';
import { getPool } from '../../../lib/db'; // ปรับ path ตามโครงสร้าง

export async function POST(request) {
  try {
    const { email, username, password, name } = await request.json();

    // ตรวจสอบข้อมูลที่รับมา
    if (!email || !username || !password || !name) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    const pool = getPool();
    const [result] = await pool.execute(
      'INSERT INTO users (email, username, password, name, role, Address , tel) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [email, username, password, name, 'user', '', '']
    );

    return NextResponse.json({ success: true, userId: result.insertId });
  } catch (err) {
    console.error('Register error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function GET(request) {
  return new Response('Use POST for registration', { status: 405 });
}
