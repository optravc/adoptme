import { getPool } from '../../../lib/db';

export async function PUT(req) {
  try {
    const pool = getPool();
    const body = await req.json();
    const { id, username, email, tel, house, district, area, province, zipcode } = body;

    const fields = [];
    const values = [];

    if (username !== undefined) {
      fields.push('username = ?');
      values.push(username);
    }
    if (email !== undefined) {
      fields.push('email = ?');
      values.push(email);
    }
    if (tel !== undefined) {
      fields.push('tel = ?');
      values.push(tel);
    }
    if (house || district || area || province || zipcode) {
      const addressParts = [
        house ? `บ้านเลขที่ ${house}` : null,
        district ? `ตำบล/แขวง ${district}` : null,
        area ? `อำเภอ/เขต ${area}` : null,
        province ? `จังหวัด ${province}` : null,
        zipcode ? `รหัสไปรษณีย์ ${zipcode}` : null
      ].filter(Boolean);
      fields.push('Address = ?');
      values.push(addressParts.join(', '));
    }

    if (fields.length === 0) {
      return new Response(JSON.stringify({ message: 'No fields to update' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    values.push(parseInt(id)); // id สำหรับ where เงื่อนไข

    const sql = `UPDATE users SET ${fields.join(', ')} WHERE id = ?`;
    await pool.execute(sql, values);

    return new Response(JSON.stringify({ message: 'Update successful' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error updating user:', error);
    return new Response(JSON.stringify({ message: 'Something went wrong' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
