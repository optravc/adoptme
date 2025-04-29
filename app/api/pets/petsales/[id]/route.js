import { getPool } from '../../../../lib/db';

export async function GET(request, { params }) {
  const { id } = await params;

  if (!id) {
    return new Response(JSON.stringify({ error: 'ID ไม่ถูกต้อง' }), { status: 400 });
  }

  try {
    const pool = getPool();
    const [rows] = await pool.query('SELECT * FROM petsales WHERE id = ?', [id]);

    if (rows.length === 0) {
      return new Response(JSON.stringify({ error: 'ไม่พบข้อมูลสัตว์เลี้ยง' }), { status: 404 });
    }

    return new Response(JSON.stringify(rows[0]), { status: 200 });
  } catch (error) {
    console.error('Error fetching pet data:', error);
    return new Response(JSON.stringify({ error: 'ไม่สามารถดึงข้อมูลได้' }), { status: 500 });
  }
}