import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

// Hostinger LiteSpeed / Reverse Proxy Trust
app.enable('trust proxy');

// Determine static root: dist first, fallback to current directory
const distPath = path.join(__dirname, 'dist');
const staticRoot = fs.existsSync(distPath) ? distPath : __dirname;

// Serve static assets with caching
app.use(express.static(staticRoot, {
  maxAge: '1d',
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.html') || filePath.endsWith('ads.txt')) {
      res.setHeader('Cache-Control', 'no-cache');
    }
  }
}));

// Dedicated ads.txt route for Google AdSense crawler verification
app.get('/ads.txt', (req, res) => {
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('Cache-Control', 'no-cache');
  res.send('google.com, pub-3166168589952262, DIRECT, f08c47fec0942fa0\n');
});

// Fallback all routes to index.html for React SPA
app.get('*', (req, res) => {
  const indexPath = path.join(staticRoot, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(200).send('DocuFill Studio server is starting...');
  }
});

app.listen(port, '0.0.0.0', () => {
  console.log(`DocuFill Studio portal server listening on port ${port}`);
});
