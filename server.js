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

// Thin / archive / tag / parameterized routes receive X-Robots-Tag: noindex, follow
const THIN_PATH_REGEX = /^\/(tag|tags|archive|archives|category|categories|author|search|page|preview|print)(\/|$)/i;
const THIN_QUERY_KEYS = ['tag', 'tags', 'archive', 'category', 'filter', 'search', 'q', 'page', 'sort', 'preview', 'print'];

app.use((req, res, next) => {
  const hasThinQuery = THIN_QUERY_KEYS.some((k) => Object.prototype.hasOwnProperty.call(req.query, k));
  if (THIN_PATH_REGEX.test(req.path) || hasThinQuery) {
    res.setHeader('X-Robots-Tag', 'noindex, follow');
  }
  next();
});

// Serve static assets with caching
app.use(express.static(staticRoot, {
  maxAge: '1d',
  setHeaders: (res, filePath) => {
    if (
      filePath.endsWith('.html') ||
      filePath.endsWith('ads.txt') ||
      filePath.endsWith('robots.txt') ||
      filePath.endsWith('sitemap.xml')
    ) {
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

// Dedicated robots.txt route
app.get('/robots.txt', (req, res) => {
  const robotsPath = path.join(staticRoot, 'robots.txt');
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('Cache-Control', 'no-cache');
  if (fs.existsSync(robotsPath)) {
    res.sendFile(robotsPath);
  } else {
    res.send('User-agent: *\nAllow: /\nDisallow: /tag/\nDisallow: /archive/\nDisallow: /category/\nDisallow: /search\nDisallow: /*?*\n');
  }
});

// Dedicated sitemap.xml route
app.get('/sitemap.xml', (req, res) => {
  const sitemapPath = path.join(staticRoot, 'sitemap.xml');
  res.setHeader('Content-Type', 'application/xml; charset=utf-8');
  res.setHeader('Cache-Control', 'no-cache');
  if (fs.existsSync(sitemapPath)) {
    res.sendFile(sitemapPath);
  } else {
    res.status(404).end();
  }
});

// Fallback all SPA routes (/guides, /about, /contact, /privacy-policy, etc.) to index.html
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
