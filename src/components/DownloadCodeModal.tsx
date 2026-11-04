import React, { useState } from 'react';
import {
  X,
  Download,
  FileCode,
  Copy,
  Check,
  Server,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Globe,
  FileArchive,
  HelpCircle,
  Eye,
  FolderGit2,
  AlertTriangle,
} from 'lucide-react';
import {
  generateStandaloneHtml,
  generateHostingerZip,
  triggerFileDownload,
} from '../utils/codeExporter';
import { resolveAssetUrl } from '../utils/assetHelper';

interface DownloadCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DownloadCodeModal: React.FC<DownloadCodeModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [copied, setCopied] = useState<boolean>(false);
  const [isZipping, setIsZipping] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'download' | 'preview'>('download');
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  const htmlCode = generateStandaloneHtml();

  const handleDownloadHtml = () => {
    triggerFileDownload(htmlCode, 'sbi-bank-portal.html', 'text/html;charset=utf-8');
    setDownloadSuccess('Downloaded sbi-bank-portal.html! You can open it in any browser or upload to your hosting.');
    setTimeout(() => setDownloadSuccess(null), 5000);
  };

  const handleDownloadIndexHtml = () => {
    triggerFileDownload(htmlCode, 'index.html', 'text/html;charset=utf-8');
    setDownloadSuccess('Downloaded index.html! Simply upload this single file directly to Hostinger public_html to go live with zero errors.');
    setTimeout(() => setDownloadSuccess(null), 6000);
  };

  const handleDownloadSingleHtmlZip = () => {
    const link = document.createElement('a');
    link.href = resolveAssetUrl('/hostinger_single_html.zip');
    link.download = 'hostinger_single_html.zip';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setDownloadSuccess('Downloaded hostinger_single_html.zip! Extract directly into Hostinger public_html for zero-error hosting.');
    setTimeout(() => setDownloadSuccess(null), 6000);
  };

  const handleDownloadHostingerZip = async () => {
    try {
      setIsZipping(true);
      // Try direct download of pre-built bundle
      const link = document.createElement('a');
      link.href = resolveAssetUrl('/hostinger_deploy.zip');
      link.download = 'hostinger_deploy.zip';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setDownloadSuccess('Downloading hostinger_deploy.zip! Extract directly into your Hostinger public_html folder.');
      setTimeout(() => setDownloadSuccess(null), 6000);
    } catch {
      // Fallback to client-side generation
      const zipBlob = await generateHostingerZip();
      triggerFileDownload(zipBlob, 'hostinger-bank-portal.zip', 'application/zip');
      setDownloadSuccess('Downloaded hostinger-bank-portal.zip! Extract directly into your Hostinger public_html folder.');
      setTimeout(() => setDownloadSuccess(null), 6000);
    } finally {
      setIsZipping(false);
    }
  };

  const handleDownloadNodeAppZip = () => {
    const link = document.createElement('a');
    link.href = resolveAssetUrl('/pdf-filler-app.zip');
    link.download = 'pdf-filler-app.zip';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setDownloadSuccess('Downloading pdf-filler-app.zip! Upload this directly to Hostinger Node Setup.');
    setTimeout(() => setDownloadSuccess(null), 6000);
  };

  const handleDownloadSourceZip = () => {
    const link = document.createElement('a');
    link.href = resolveAssetUrl('/docufill_source_code.zip');
    link.download = 'docufill_source_code.zip';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setDownloadSuccess('Downloading docufill_source_code.zip with all React + TypeScript source files!');
    setTimeout(() => setDownloadSuccess(null), 5000);
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(htmlCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch (err) {
      console.error('Copy failed', err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-emerald-800 to-emerald-950 text-white flex items-center justify-between border-b border-emerald-700/50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-amber-300 border border-white/20">
              <FileCode className="w-5 h-5" />
            </div>
            <div>
              <h2 id="modal-title" className="text-lg font-extrabold tracking-tight">
                Download Full HTML Code & Hostinger Package
              </h2>
              <p className="text-xs text-emerald-200">
                Thakur Xerox Center — Run offline or upload directly to Hostinger
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-white/70 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Bar */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('download')}
            className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition-colors cursor-pointer ${
              activeTab === 'download'
                ? 'border-emerald-600 text-emerald-800 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Download className="w-4 h-4 text-emerald-600" />
            Download Options
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('preview')}
            className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition-colors cursor-pointer ${
              activeTab === 'preview'
                ? 'border-emerald-600 text-emerald-800 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Eye className="w-4 h-4 text-amber-600" />
            View Raw HTML Code ({Math.round(htmlCode.length / 1024)} KB)
          </button>
        </div>

        {/* Success Alert */}
        {downloadSuccess && (
          <div className="mx-6 mt-4 p-3 rounded-lg bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-medium flex items-center gap-2 shrink-0">
            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{downloadSuccess}</span>
          </div>
        )}

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5">
          {/* Hostinger Error Resolution Alert */}
          <div className="p-4 rounded-xl bg-amber-50 border-2 border-amber-300 text-amber-950 text-xs shadow-xs">
            <div className="font-extrabold flex items-center gap-2 mb-1.5 text-amber-950 text-sm">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
              <span>Fixing Hostinger Error: "Unsupported project structure"</span>
            </div>
            <p className="text-amber-900 leading-relaxed">
              Hostinger showed this error because its <strong>"Quick Install Node Setup"</strong> requires a root <code>package.json</code> with a <code>"start": "node server.js"</code> script and a production <code>server.js</code> file.
            </p>
            <div className="mt-2.5 pt-2.5 border-t border-amber-200 grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px]">
              <div className="bg-white/90 p-2.5 rounded-lg border border-amber-200">
                <strong className="text-amber-950 block mb-0.5">Solution A: Use Hostinger Node App ZIP</strong>
                <span className="text-slate-700">Download <strong>hostinger_node_app.zip</strong> below and drag it into that exact Hostinger upload box. Hostinger will recognize Vite / Express immediately!</span>
              </div>
              <div className="bg-white/90 p-2.5 rounded-lg border border-amber-200">
                <strong className="text-amber-950 block mb-0.5">Solution B: Use File Manager (No Node needed)</strong>
                <span className="text-slate-700">In the top right of your Hostinger screen, click <strong>"Set up manually"</strong> &rarr; open <strong>File Manager</strong> &rarr; extract <strong>hostinger_deploy.zip</strong> into <code>public_html</code>.</span>
              </div>
            </div>
          </div>

          {activeTab === 'download' ? (
            <>
              {/* Hero Banner: Single-File HTML - Upload to Hostinger without any error */}
              <div className="rounded-2xl border-2 border-emerald-500 bg-gradient-to-br from-emerald-50 via-white to-amber-50 p-5 shadow-sm">
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider bg-emerald-700 text-white shadow-2xs">
                        ⭐ 100% Zero-Error on Hostinger
                      </span>
                      <span className="text-xs font-mono text-emerald-800 font-bold bg-emerald-100 px-2 py-0.5 rounded">
                        Standalone Single File (index.html)
                      </span>
                    </div>
                    <h3 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                      <FileCode className="w-5 h-5 text-emerald-700 shrink-0" />
                      Download Full Code in Single HTML (index.html)
                    </h3>
                    <p className="text-xs text-slate-700 leading-relaxed">
                      Contains all <strong>51+ official bank application letters</strong>, live interactive forms, formal A4 letterhead preview, print-to-PDF formatting, copy-to-clipboard, Thakur Xerox branding (Vinodsingh Thakur 9970996060), and Google AdSense (<code>pub-3166168589952262</code>).
                    </p>
                    <p className="text-xs font-bold text-emerald-800">
                      💡 Simply upload this single <code>index.html</code> file into your Hostinger <code>public_html/</code> folder. No Node.js required, no framework errors!
                    </p>
                  </div>

                  <div className="flex flex-wrap sm:flex-nowrap gap-2 w-full lg:w-auto shrink-0">
                    <button
                      type="button"
                      onClick={handleDownloadIndexHtml}
                      className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs sm:text-sm font-extrabold shadow-sm hover:shadow transition-all cursor-pointer active:scale-98"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download index.html</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleDownloadSingleHtmlZip}
                      className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs sm:text-sm font-bold shadow-sm transition-all cursor-pointer"
                      title="Download ZIP containing index.html, .htaccess, and ads.txt"
                    >
                      <FileArchive className="w-4 h-4 text-emerald-400" />
                      <span>HTML .ZIP (12 KB)</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleCopyCode}
                      className="p-3 bg-white hover:bg-slate-100 text-slate-700 rounded-xl border border-slate-300 transition-colors cursor-pointer"
                      title="Copy Entire HTML Code to Clipboard"
                    >
                      {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Other Deployment Packages */}
              <div className="text-xs font-extrabold uppercase tracking-wider text-slate-500 pt-2 flex items-center gap-1.5">
                <span>Other Hostinger Deployment Packages:</span>
              </div>

              {/* Option Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Option 1: Hostinger Node Setup ZIP */}
                <div className="rounded-xl border-2 border-indigo-500 bg-gradient-to-b from-indigo-50/60 to-white p-4 flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-wider text-indigo-800 bg-indigo-100 px-2 py-0.5 rounded border border-indigo-300">
                        Hostinger Node App
                      </span>
                      <span className="text-[11px] text-slate-500 font-mono">23 MB .ZIP</span>
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                      <Server className="w-4 h-4 text-indigo-700" />
                      pdf-filler-app.zip (Node Setup)
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Packaged with <code>package.json</code>, <code>server.js</code>, and <code>package-lock.json</code> directly at the root level, exactly as Hostinger requested.
                    </p>
                    <div className="bg-slate-900 text-slate-200 p-2 rounded-lg font-mono text-[10px] space-y-0.5 leading-tight">
                      <div className="text-emerald-400 font-bold">pdf-filler-app.zip</div>
                      <div>├── package.json</div>
                      <div>├── server.js</div>
                      <div>├── package-lock.json</div>
                      <div>├── public/</div>
                      <div>└── src/</div>
                    </div>
                    <ul className="text-xs text-slate-700 space-y-1 pt-1">
                      <li className="flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-indigo-600" />
                        <span>Fixed: Top-level <code>package.json</code> verified</span>
                      </li>
                      <li className="flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-indigo-600" />
                        <span>Includes <code>package-lock.json</code> & <code>server.js</code></span>
                      </li>
                    </ul>
                  </div>

                  <div className="pt-3 mt-3 border-t border-indigo-100">
                    <button
                      type="button"
                      onClick={handleDownloadNodeAppZip}
                      className="w-full flex items-center justify-center gap-2 py-2.5 px-3 bg-indigo-700 hover:bg-indigo-800 text-white rounded-lg text-xs font-bold shadow-xs hover:shadow transition-all cursor-pointer"
                    >
                      <Download className="w-4 h-4" />
                      Download pdf-filler-app.zip
                    </button>
                  </div>
                </div>

                {/* Option 2: Hostinger File Manager ZIP */}
                <div className="rounded-xl border border-emerald-300 bg-white p-4 flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
                        Easiest (No Node)
                      </span>
                      <span className="text-[11px] text-slate-500 font-mono">11 MB .ZIP</span>
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                      <FileArchive className="w-4 h-4 text-emerald-700" />
                      Hostinger File Manager ZIP
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Pre-compiled static production files for Hostinger <strong>public_html/</strong>. Works on all Hostinger plans without Node setup.
                    </p>
                    <ul className="text-xs text-slate-700 space-y-1 pt-1">
                      <li className="flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Upload into <code>public_html</code> & Extract</span>
                      </li>
                      <li className="flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Includes <code>.htaccess</code> & <code>ads.txt</code></span>
                      </li>
                      <li className="flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Instant live website</span>
                      </li>
                    </ul>
                  </div>

                  <div className="pt-3 mt-3 border-t border-emerald-100">
                    <button
                      type="button"
                      onClick={handleDownloadHostingerZip}
                      disabled={isZipping}
                      className="w-full flex items-center justify-center gap-2 py-2.5 px-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold shadow-xs hover:shadow transition-all cursor-pointer disabled:opacity-50"
                    >
                      <Download className="w-4 h-4" />
                      {isZipping ? 'Downloading...' : 'Download File Manager ZIP'}
                    </button>
                  </div>
                </div>

                {/* Option 3: Standalone Single HTML File */}
                <div className="rounded-xl border border-slate-300 bg-white p-4 flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-wider text-blue-800 bg-blue-100 px-2 py-0.5 rounded border border-blue-200">
                        Zero Install
                      </span>
                      <span className="text-[11px] text-slate-500 font-mono">Single .HTML</span>
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                      <FileCode className="w-4 h-4 text-blue-700" />
                      Standalone HTML File
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Single offline HTML file with all 51+ bank letters, live letterhead generator, print-to-PDF, and copy functions.
                    </p>
                    <ul className="text-xs text-slate-700 space-y-1 pt-1">
                      <li className="flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-blue-600" />
                        <span>Double click to run in any browser</span>
                      </li>
                      <li className="flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-blue-600" />
                        <span>Works 100% offline without internet</span>
                      </li>
                      <li className="flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-blue-600" />
                        <span>Can be uploaded as <code>index.html</code></span>
                      </li>
                    </ul>
                  </div>

                  <div className="pt-3 mt-3 border-t border-slate-100 flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={handleDownloadHtml}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-bold shadow-xs hover:shadow transition-all cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Save .HTML
                    </button>
                    <button
                      type="button"
                      onClick={handleCopyCode}
                      className="p-2.5 rounded-lg border border-slate-300 hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer"
                      title="Copy HTML to clipboard"
                    >
                      {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Hostinger 3-Step Setup Instructions */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-700 flex items-center gap-1.5 mb-3">
                  <Server className="w-4 h-4 text-emerald-700" />
                  How to Deploy to Hostinger in 3 Simple Steps:
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-slate-700">
                  <div className="p-3 bg-white rounded-lg border border-slate-200">
                    <div className="font-bold text-slate-900 mb-1 flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-[11px] font-black">1</span>
                      Open File Manager
                    </div>
                    <p className="text-slate-600">
                      Log into Hostinger hPanel &rarr; Click <strong>Websites</strong> &rarr; <strong>Manage</strong> &rarr; Open <strong>File Manager</strong>.
                    </p>
                  </div>

                  <div className="p-3 bg-white rounded-lg border border-slate-200">
                    <div className="font-bold text-slate-900 mb-1 flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-[11px] font-black">2</span>
                      Upload & Extract
                    </div>
                    <p className="text-slate-600">
                      Navigate to <code>public_html/</code>, upload the downloaded ZIP or HTML file, and click <strong>Extract</strong>.
                    </p>
                  </div>

                  <div className="p-3 bg-white rounded-lg border border-slate-200">
                    <div className="font-bold text-slate-900 mb-1 flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-[11px] font-black">3</span>
                      Instant Live Site
                    </div>
                    <p className="text-slate-600">
                      Visit your domain! The site runs immediately with ads.txt and full banking letter generation.
                    </p>
                  </div>
                </div>
              </div>
            </>
          ) : (
            /* HTML Raw Code Preview */
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-600 font-medium">
                  Complete Standalone HTML Code ({htmlCode.split('\n').length} lines)
                </span>
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied to Clipboard!' : 'Copy Entire HTML'}
                </button>
              </div>
              <div className="relative">
                <textarea
                  readOnly
                  value={htmlCode}
                  className="w-full h-96 p-4 font-mono text-[11px] leading-relaxed bg-slate-950 text-slate-200 rounded-xl border border-slate-800 focus:outline-none resize-none select-all"
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>AdSense ID: <code>pub-3166168589952262</code> integrated</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
