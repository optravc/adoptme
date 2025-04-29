// app/api/upload/route.js
import Busboy from 'busboy';
import fs from 'fs';
import path from 'path';
import { Readable } from 'stream';

export async function POST(req) {

  return new Promise((resolve, reject) => {
    const folder = req.headers.get('folder-type');
    const uploadDir = path.join(process.cwd(), 'public', 'upload', folder);
    fs.mkdirSync(uploadDir, { recursive: true });

    const busboy = Busboy({
      headers: Object.fromEntries(req.headers),
    });

    let filePath = '';

    busboy.on('file', ( file, info) => {
      const filename = typeof info === 'object' ? info.filename : info;
      filePath = path.join(uploadDir, filename);
      const writeStream = fs.createWriteStream(filePath);
      file.pipe(writeStream);
    });

    busboy.on('finish', () => {
      const fileNameOnly = path.basename(filePath);
      resolve(
        new Response(JSON.stringify({ url: `/upload/${folder}/${fileNameOnly}` }), {
          status: 200,
        })
      );
    });

    busboy.on('error', (err) => {
      reject(new Response(JSON.stringify({ error: 'Upload failed' }), { status: 500 }));
    });

    //   ใช้ stream pipe แทน .read()
    const stream = Readable.fromWeb(req.body);
    stream.pipe(busboy);
  });
}
