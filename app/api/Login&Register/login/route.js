import { NextResponse } from 'next/server';
import { getPool } from '../../../lib/db';

export async function POST(request) {
  try {
    let { email, password } = await request.json();

    // ✅ ตัด space เผื่อ user พิมพ์พลาด
    email = email.trim();
    password = password.trim();

    const pool = getPool();
    const [rows] = await pool.execute(
      'SELECT * FROM users WHERE TRIM(email) = ? AND TRIM(password) = ?',
      [email, password]
    );

    if (rows.length === 0) {
      return NextResponse.json({ success: false, error: 'Invalid email or password' });
    }

    return NextResponse.json({ success: true, user: rows[0] }); // ✅ ส่ง user object ตัวเดียว
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
