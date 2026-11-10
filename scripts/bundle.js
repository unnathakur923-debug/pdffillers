import fs from 'fs';
import path from 'path';
import JSZip from 'jszip';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Helper to recursively add files to JSZip
function addFolderToZip(zip, folderPath, zipBasePath = '') {
  const items = fs.readdirSync(folderPath);
  for (const item of items) {
    const fullPath = path.join(folderPath, item);
    const stat = fs.statSync(fullPath);
    const zipPath = zipBasePath ? `${zipBasePath}/${item}` : item;

    if (stat.isDirectory()) {
      if (item === 'node_modules' || item === '.git' || item === 'dist' || item === '.aistudio') {
        continue;
      }
      const subFolder = zip.folder(item);
      addFolderToZip(subFolder, fullPath);
    } else {
      if (item.endsWith('.zip')) continue;
      const data = fs.readFileSync(fullPath);
      zip.file(item, data);
    }
  }
}

async function createBundles() {
  const publicDir = path.join(rootDir, 'public');
  const distDir = path.join(rootDir, 'dist');

  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  // 1. Hostinger Pre-Built Deploy ZIP (dist directory + .htaccess + ads.txt)
  if (fs.existsSync(distDir)) {
    console.log('Packaging dist/ into public/hostinger_deploy.zip...');
    const distZip = new JSZip();

    function addDistFiles(zip, currentPath, rel = '') {
      const items = fs.readdirSync(currentPath);
      for (const item of items) {
        const fullPath = path.join(currentPath, item);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
          const sub = zip.folder(item);
          addDistFiles(sub, fullPath, rel ? `${rel}/${item}` : item);
        } else {
          if (item.endsWith('.zip')) continue;
          zip.file(item, fs.readFileSync(fullPath));
        }
      }
    }

    addDistFiles(distZip, distDir);

    // Ensure .htaccess and ads.txt are present
    const htaccessPath = path.join(publicDir, '.htaccess');
    if (fs.existsSync(htaccessPath)) {
      distZip.file('.htaccess', fs.readFileSync(htaccessPath));
    }

    const adsTxtPath = path.join(publicDir, 'ads.txt');
    if (fs.existsSync(adsTxtPath)) {
      distZip.file('ads.txt', fs.readFileSync(adsTxtPath));
    }

    // Include package.json, server.js, and package-lock.json so Hostinger Node.js installer detects it!
    const pkgPath = path.join(rootDir, 'package.json');
    if (fs.existsSync(pkgPath)) {
      distZip.file('package.json', fs.readFileSync(pkgPath));
    }
    const serverPath = path.join(rootDir, 'server.js');
    if (fs.existsSync(serverPath)) {
      distZip.file('server.js', fs.readFileSync(serverPath));
    }
    const lockPath = path.join(rootDir, 'package-lock.json');
    if (fs.existsSync(lockPath)) {
      distZip.file('package-lock.json', fs.readFileSync(lockPath));
    }

    // Add Hostinger Instructions
    const guide = `======================================================================
  HOSTINGER 1-MINUTE DEPLOYMENT INSTRUCTIONS
  DocuFill Studio & Bank Letters Portal - Thakur Xerox Center
======================================================================

THIS ZIP WORKS ON BOTH HOSTINGER DEPLOYMENT OPTIONS:

METHOD 1: Hostinger "Node Setup" / "Quick Install Node Setup" (Your current screen)
----------------------------------------------------------------------
1. In the Hostinger Node upload box, upload: pdf-filler-app.zip
2. Hostinger detects: Node.js / Express / Vite
3. Root directory: /
4. Start script: npm start (which executes "node server.js")
5. Port: 3000 (or default)
6. Click Deploy. Your site is live!

METHOD 2: Hostinger Standard File Manager (public_html) — Easiest!
----------------------------------------------------------------------
1. If you are on the Node screen, click "Set up manually" at the top right.
2. Go to Hostinger hPanel -> "Websites" -> "Manage" -> "File Manager".
3. Open folder: public_html
4. Upload hostinger_deploy.zip and click "Extract".
5. All files (index.html, assets, .htaccess, ads.txt) will be live instantly!

ADSENSE VERIFICATION:
The ads.txt file is included with your publisher ID:
google.com, pub-3166168589952262, DIRECT, f08c47fec0942fa0
Verify at: https://yourdomain.com/ads.txt

For support, contact Vinodsingh Thakur at 9970996060.
======================================================================
`;
    distZip.file('README_HOSTINGER_DEPLOYMENT.txt', guide);

    const distBuffer = await distZip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' });
    fs.writeFileSync(path.join(publicDir, 'hostinger_deploy.zip'), distBuffer);
    if (fs.existsSync(distDir)) {
      fs.writeFileSync(path.join(distDir, 'hostinger_deploy.zip'), distBuffer);
    }
    console.log(`Created public/hostinger_deploy.zip (${Math.round(distBuffer.length / 1024)} KB)`);
  }

  // 2. Hostinger Node App ZIP (Full project with package.json, server.js, package-lock.json, src, and dist prebuilt)
  console.log('Packaging Hostinger Node App into public/pdf-filler-app.zip & hostinger_node_app.zip...');
  const nodeZip = new JSZip();

  const nodeRootFiles = [
    'package.json',
    'package-lock.json',
    'index.js',
    'server.js',
    'vite.config.ts',
    'tsconfig.json',
    'tsconfig.app.json',
    'tsconfig.node.json',
    'index.html',
    'metadata.json'
  ];

  for (const file of nodeRootFiles) {
    const p = path.join(rootDir, file);
    if (fs.existsSync(p)) {
      nodeZip.file(file, fs.readFileSync(p));
    }
  }

  if (fs.existsSync(path.join(rootDir, 'src'))) {
    addFolderToZip(nodeZip.folder('src'), path.join(rootDir, 'src'));
  }

  if (fs.existsSync(distDir)) {
    addFolderToZip(nodeZip.folder('dist'), distDir);
  }

  if (fs.existsSync(publicDir)) {
    const pubZip = nodeZip.folder('public');
    const pubFiles = fs.readdirSync(publicDir);
    for (const f of pubFiles) {
      if (f.endsWith('.zip')) continue;
      const full = path.join(publicDir, f);
      const stat = fs.statSync(full);
      if (stat.isDirectory()) {
        addFolderToZip(pubZip.folder(f), full);
      } else {
        pubZip.file(f, fs.readFileSync(full));
      }
    }
  }

  const nodeBuffer = await nodeZip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' });
  fs.writeFileSync(path.join(publicDir, 'pdf-filler-app.zip'), nodeBuffer);
  fs.writeFileSync(path.join(publicDir, 'hostinger_node_app.zip'), nodeBuffer);
  if (fs.existsSync(distDir)) {
    fs.writeFileSync(path.join(distDir, 'pdf-filler-app.zip'), nodeBuffer);
    fs.writeFileSync(path.join(distDir, 'hostinger_node_app.zip'), nodeBuffer);
  }
  console.log(`Created public/pdf-filler-app.zip (${Math.round(nodeBuffer.length / 1024)} KB)`);
  console.log('Packaging full source code into public/docufill_source_code.zip...');
  const sourceZip = new JSZip();

  // Add source folders and root files
  const rootFilesToInclude = [
    'package.json',
    'vite.config.ts',
    'tsconfig.json',
    'tsconfig.app.json',
    'tsconfig.node.json',
    'index.html',
    'metadata.json'
  ];

  for (const file of rootFilesToInclude) {
    const p = path.join(rootDir, file);
    if (fs.existsSync(p)) {
      sourceZip.file(file, fs.readFileSync(p));
    }
  }

  if (fs.existsSync(path.join(rootDir, 'src'))) {
    addFolderToZip(sourceZip.folder('src'), path.join(rootDir, 'src'));
  }

  if (fs.existsSync(publicDir)) {
    const pubZip = sourceZip.folder('public');
    const pubFiles = fs.readdirSync(publicDir);
    for (const f of pubFiles) {
      if (f.endsWith('.zip')) continue;
      const full = path.join(publicDir, f);
      const stat = fs.statSync(full);
      if (stat.isDirectory()) {
        addFolderToZip(pubZip.folder(f), full);
      } else {
        pubZip.file(f, fs.readFileSync(full));
      }
    }
  }

  // Add Developer README
  const devReadme = `# DocuFill Studio & Bank Letters Portal - Source Code
Thakur Xerox Center — Contact: Vinodsingh Thakur (9970996060)

## Quick Start (Local Development)
1. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`
2. Start development server:
   \`\`\`bash
   npm run dev
   \`\`\`
3. Build for production (Hostinger, cPanel, Apache):
   \`\`\`bash
   npm run build
   \`\`\`
4. Upload all contents of the \`dist/\` folder to your Hostinger \`public_html/\`.
`;
  sourceZip.file('README.md', devReadme);

  const sourceBuffer = await sourceZip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' });
  fs.writeFileSync(path.join(publicDir, 'docufill_source_code.zip'), sourceBuffer);
  if (fs.existsSync(distDir)) {
    fs.writeFileSync(path.join(distDir, 'docufill_source_code.zip'), sourceBuffer);
  }
  console.log(`Created public/docufill_source_code.zip (${Math.round(sourceBuffer.length / 1024)} KB)`);

  console.log('Bundle generation complete!');
}

createBundles().catch(console.error);
