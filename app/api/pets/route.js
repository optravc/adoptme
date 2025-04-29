import { NextResponse } from 'next/server';
import { getPool } from '../../lib/db'; 

export async function GET() {
  try {
    const pool = getPool();
    const [rows] = await pool.query('SELECT * FROM petsales');
    return NextResponse.json(rows);
  } catch (error) {
    console.error('Error fetching petsales:', error);
    return NextResponse.json({ error: 'ไม่สามารถดึงข้อมูลได้' }, { status: 500 });
  }
}