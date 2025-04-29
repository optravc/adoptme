/*app/api/user/route.js*/
import { NextResponse } from 'next/server';
import { getPool } from '../../lib/db'; // ปรับ path ตามโปรเจกต์คุณ

export async function POST(request) {
    try {
      const { email, password } = await request.json(); // รับค่า email และ password จาก body
  
      const pool = getPool();
      const [rows] = await pool.execute(
        'SELECT id, username, email, role FROM users WHERE email = ? AND password = ?',
        [email, password]
      );
  
      return NextResponse.json({ success: true, users: rows });
    } catch (error) {
      console.error('Fetch users error:', error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
  }