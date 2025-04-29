import { NextResponse } from 'next/server';
import { getPool } from '../../../../lib/db';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ message: 'กรุณาระบุ id' }, { status: 400 });
    }

    const pool = getPool();
    const [result] = await pool.query(`
      SELECT * FROM petsales WHERE id = ?
    `, [id]);

    if (result.length === 0) {
      return NextResponse.json({ message: 'ไม่พบข้อมูล' }, { status: 404 });
    }

    return NextResponse.json(result[0]);
    
  } catch (err) {
    console.error('เกิดข้อผิดพลาด:', err);
    return NextResponse.json({ message: 'เกิดข้อผิดพลาด', error: err.message }, { status: 500 });
  }
}
