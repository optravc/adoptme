  import { NextResponse } from 'next/server';
  import { getPool } from '../../lib/db';

  export async function GET() {
      const pool = getPool();
      const [rows] = await pool.execute('SELECT * FROM products ORDER BY id DESC');
      return NextResponse.json(rows);
    }