import fs from 'fs';
import path from 'path';
import JSZip from 'jszip';
import { fileURLToPath } from 'url';
import { generateStandaloneHtml } from '../src/utils/codeExporter';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

async function exportStandaloneFiles() {
  const publicDir = path.join(rootDir, 'public');
  const distDir = path.join(rootDir, 'dist');
  const htmlContent = generateStandaloneHtml();

  // 1. Write standalone HTML files to public and dist
  fs.writeFileSync(path.join(publicDir, 'sbi-bank-portal.html'), htmlContent, 'utf-8');
  fs.writeFileSync(path.join(publicDir, 'index_standalone.html'), htmlContent, 'utf-8');

  if (fs.existsSync(distDir)) {
    fs.writeFileSync(path.join(distDir, 'sbi-bank-portal.html'), htmlContent, 'utf-8');
    fs.writeFileSync(path.join(distDir, 'index_standalone.html'), htmlContent, 'utf-8');
  }

  // 2. Create hostinger_single_html.zip containing index.html, .htaccess, and ads.txt
  const zip = new JSZip();
  zip.file('index.html', htmlContent);

  const htaccessPath = path.join(publicDir, '.htaccess');
  if (fs.existsSync(htaccessPath)) {
    zip.file('.htaccess', fs.readFileSync(htaccessPath));
  }

  const adsTxtPath = path.join(publicDir, 'ads.txt');
  if (fs.existsSync(adsTxtPath)) {
    zip.file('ads.txt', fs.readFileSync(adsTxtPath));
  }

  const instructions = `======================================================================
  HOSTINGER 1-CLICK HTML DEPLOYMENT
  DocuFill Studio - Thakur Xerox Center
======================================================================

HOW TO UPLOAD TO HOSTINGER WITHOUT ANY ERROR:
1. Log into Hostinger hPanel -> Websites -> Manage.
2. Open "File Manager" -> Click on the folder: public_html
3. Upload this ZIP file: hostinger_single_html.zip
4. Right-click and choose "Extract" directly into public_html.
5. (Alternatively, you can just upload index.html directly into public_html)
6. Open your domain (https://yourdomain.com/) in your browser!
7. It will work 100% immediately with zero Node.js errors.
======================================================================
`;
  zip.file('README.txt', instructions);

  const buffer = await zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' });
  fs.writeFileSync(path.join(publicDir, 'hostinger_single_html.zip'), buffer);
  if (fs.existsSync(distDir)) {
    fs.writeFileSync(path.join(distDir, 'hostinger_single_html.zip'), buffer);
  }

  console.log(`Successfully exported standalone HTML files and hostinger_single_html.zip (${Math.round(buffer.length / 1024)} KB)!`);
}

exportStandaloneFiles().catch(console.error);
