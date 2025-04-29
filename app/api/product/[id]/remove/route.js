import { NextResponse } from 'next/server';
import { getPool } from '../../../../lib/db';

export async function PUT(_, { params }) {
  const { id } = params;
  const pool = getPool();

  // ลบออก 1 ชิ้น ถ้าสต็อกมากกว่า 0
  await pool.execute('UPDATE products SET stock = GREATEST(stock - 1, 0) WHERE id = ?', [id]);

  return NextResponse.json({ success: true });
}