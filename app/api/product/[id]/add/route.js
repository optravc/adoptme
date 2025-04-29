import { NextResponse } from 'next/server';
import { getPool } from '../../../../lib/db';

export async function PUT(_, { params }) {
  const { id } = params;
  const pool = getPool();
  await pool.execute('UPDATE products SET stock = stock + 1 WHERE id = ?', [id]);
  return NextResponse.json({ success: true });
}