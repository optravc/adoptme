import { NextResponse } from 'next/server';
import { getPool } from '../../../lib/db';

export async function POST(req) {
  try {
    const { amount, ref1, userId, cart, address } = await req.json();

    if (!amount || !ref1 || !userId || !cart || cart.length === 0) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const qrText = `https://mock-qr.adoptme.com/checkout/${ref1}-${Date.now()}`;

    const pool = getPool();
    const conn = await pool.getConnection();

    try {
      await conn.beginTransaction();

      for (const item of cart) {
        //  เช็ก stock ล่าสุดก่อน
        const [rows] = await conn.execute('SELECT stock FROM products WHERE name = ?', [item.name]);
        const currentStock = rows[0]?.stock ?? 0;

        if (currentStock < item.qty) {
          throw new Error(`❌ สินค้า "${item.name}" มีสต็อกไม่เพียงพอ (เหลือ ${currentStock})`);
        }

        //  ถ้า stock พอ ➔ ค่อย Insert และ Update
        await conn.execute(
          'INSERT INTO orders (userId, productName, quantity, address, createdAt) VALUES (?, ?, ?, ?, NOW())',
          [userId, item.name, item.qty, address]
        );

        await conn.execute(
          'UPDATE products SET stock = stock - ? WHERE name = ?',
          [item.qty, item.name]
        );
      }

      await conn.commit();
    } catch (dbError) {
      await conn.rollback();
      throw dbError;
    } finally {
      conn.release();
    }

    return NextResponse.json({ qrText });

  } catch (error) {
    console.error('🔥 เกิดข้อผิดพลาด:', JSON.stringify(error.message, null, 2));
    return NextResponse.json({
      error: 'เกิดข้อผิดพลาดขณะสร้าง QR หรือบันทึกออเดอร์',
      detail: error.message
    }, { status: 500 });
  }
}
