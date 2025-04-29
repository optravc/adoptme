import { NextResponse } from 'next/server';
import { getPool } from '../../../lib/db';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const user_id = searchParams.get('user_id');

    if (!user_id) {
      return NextResponse.json({ message: 'กรุณาระบุ user_id' }, { status: 400 });
    }

    const pool = getPool();

    const [result] = await pool.query(`
      SELECT * FROM petadopt
      WHERE user_id = ?
      ORDER BY id DESC
    `, [user_id]);

    return NextResponse.json(result);
  } catch (err) {
    console.error('เกิดข้อผิดพลาด:', err);
    return NextResponse.json({ message: 'เกิดข้อผิดพลาด', error: err.message }, { status: 500 });
  }
}
