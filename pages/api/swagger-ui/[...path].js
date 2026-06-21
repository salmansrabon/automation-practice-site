import path from 'path';
import fs from 'fs';
import swaggerUiDist from 'swagger-ui-dist';

const distPath = swaggerUiDist.getAbsoluteFSPath();

const MIME = {
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.html': 'text/html',
  '.png': 'image/png',
  '.map': 'application/json',
};

export default function handler(req, res) {
  const parts = req.query.path;
  const filePath = path.join(distPath, ...parts);

  if (!filePath.startsWith(distPath)) {
    return res.status(403).end();
  }

  if (!fs.existsSync(filePath)) {
    return res.status(404).end();
  }

  const ext = path.extname(filePath);
  res.setHeader('Content-Type', MIME[ext] || 'application/octet-stream');
  fs.createReadStream(filePath).pipe(res);
}
