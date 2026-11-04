import React, { useState } from 'react';
import {
  Download,
  Printer,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Maximize2,
  FileCheck,
  RefreshCw,
  Palette,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';
import { InkColor } from '../types/formTypes';

interface PdfViewerProps {
  pdfBlobUrl: string | null;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onDownload: () => void;
  onRefresh: () => void;
  isGenerating: boolean;
  inkColor: InkColor;
  onInkColorChange: (color: InkColor) => void;
  fileName?: string;
}

export const PdfViewer: React.FC<PdfViewerProps> = ({
  pdfBlobUrl,
  currentPage,
  totalPages,
  onPageChange,
  onDownload,
  onRefresh,
  isGenerating,
  inkColor,
  onInkColorChange,
  fileName = 'SBI_Account_Opening_Form_Filled.pdf',
}) => {
  const [zoomLevel, setZoomLevel] = useState<number>(100);

  const handlePrint = () => {
    if (!pdfBlobUrl) return;
    const printWindow = window.open(pdfBlobUrl);
    if (printWindow) {
      printWindow.focus();
      printWindow.print();
    }
  };

  const pageNames: Record<number, string> = {
    1: 'Part I - CIF & Personal Info',
    2: 'Part I - Proof & Address',
    3: 'Part II - Services & Cards',
    4: 'Part II - Nomination',
    5: 'Terms & Conditions',
    6: 'Rules (Abridged)',
    7: 'Form 97 / FATCA',
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
      {/* Viewer Header Toolbar - Responsive on Mobile, Tablet, Laptop, and PC */}
      <div className="flex flex-wrap items-center justify-between gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-2 sm:py-2.5 bg-slate-950 border-b border-slate-800 text-white shrink-0">
        {/* Left: Document info & Page controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <div className="flex items-center gap-0.5 sm:gap-1 bg-slate-800/80 rounded px-1 py-0.5 border border-slate-700/60">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => onPageChange(Math.max(1, currentPage - 1))}
              className="p-1 text-slate-300 hover:text-white disabled:opacity-30 disabled:hover:text-slate-300 transition-colors"
              title="Previous Page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-mono font-medium px-1 sm:px-1.5 tabular-nums text-slate-200">
              {currentPage}/{totalPages}
            </span>
            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
              className="p-1 text-slate-300 hover:text-white disabled:opacity-30 disabled:hover:text-slate-300 transition-colors"
              title="Next Page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <span className="text-xs text-slate-400 hidden md:inline-block font-medium truncate max-w-[140px] lg:max-w-[180px]">
            {pageNames[currentPage] || `Page ${currentPage}`}
          </span>
        </div>

        {/* Center: Ink Color & Zoom Controls (Accessible on Mobile & Desktop) */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Ink color switch */}
          <div className="flex items-center gap-0.5 sm:gap-1 bg-slate-800/80 rounded px-1 sm:px-1.5 py-0.5 border border-slate-700/60">
            <Palette className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-400" />
            <button
              type="button"
              onClick={() => onInkColorChange('blue')}
              className={`px-1.5 sm:px-2 py-0.5 text-[11px] sm:text-xs font-medium rounded transition-colors ${
                inkColor === 'blue'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Blue
            </button>
            <button
              type="button"
              onClick={() => onInkColorChange('black')}
              className={`px-1.5 sm:px-2 py-0.5 text-[11px] sm:text-xs font-medium rounded transition-colors ${
                inkColor === 'black'
                  ? 'bg-slate-700 text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Black
            </button>
          </div>

          {/* Zoom controls: accessible on mobile phones, tablets, and PCs */}
          <div className="flex items-center gap-0.5 bg-slate-800/80 rounded px-1 py-0.5 border border-slate-700/60">
            <button
              type="button"
              onClick={() => setZoomLevel((z) => Math.max(75, z - 15))}
              className="p-1 text-slate-300 hover:text-white"
              title="Zoom Out"
            >
              <ZoomOut className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            </button>
            <span className="text-[10px] sm:text-xs font-mono px-0.5 sm:px-1 tabular-nums text-slate-300">
              {zoomLevel}%
            </span>
            <button
              type="button"
              onClick={() => setZoomLevel((z) => Math.min(175, z + 15))}
              className="p-1 text-slate-300 hover:text-white"
              title="Zoom In"
            >
              <ZoomIn className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setZoomLevel(100)}
              className="p-1 text-slate-400 hover:text-white hidden sm:inline-block"
              title="Reset Zoom"
            >
              <Maximize2 className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Right: Actions (Refresh, Print, Fullscreen, Download) */}
        <div className="flex items-center gap-1 sm:gap-1.5">
          <button
            type="button"
            onClick={onRefresh}
            disabled={isGenerating}
            className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded transition-colors"
            title="Refresh Document Preview"
          >
            <RefreshCw className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isGenerating ? 'animate-spin' : ''}`} />
          </button>

          {/* Fullscreen / New Tab Viewer (Especially handy on Phones and Tablets) */}
          <button
            type="button"
            onClick={() => pdfBlobUrl && window.open(pdfBlobUrl, '_blank')}
            disabled={!pdfBlobUrl}
            className="flex items-center gap-1 px-2 py-1 text-[11px] sm:text-xs font-medium text-slate-200 hover:text-white bg-slate-800 hover:bg-slate-700 rounded border border-slate-700 transition-colors"
            title="Open Fullscreen in New Tab"
          >
            <ExternalLink className="w-3.5 h-3.5 text-sky-400" />
            <span className="hidden sm:inline">Fullscreen</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            disabled={!pdfBlobUrl}
            className="hidden md:flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-slate-200 hover:text-white bg-slate-800 hover:bg-slate-700 rounded border border-slate-700 transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            Print
          </button>

          <button
            type="button"
            onClick={onDownload}
            disabled={!pdfBlobUrl || isGenerating}
            className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 text-[11px] sm:text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded shadow-sm hover:shadow transition-all whitespace-nowrap active:scale-98"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Download</span>
            <span className="sm:hidden">PDF</span>
          </button>
        </div>
      </div>

      {/* Mobile-friendly banner to open in native mobile PDF reader with pinch-to-zoom */}
      <div className="flex sm:hidden items-center justify-between px-3 py-1.5 bg-slate-950/90 border-b border-slate-800 text-[11px] text-slate-300">
        <span className="flex items-center gap-1 text-sky-400 font-medium">
          <Maximize2 className="w-3 h-3" /> Mobile Screen Mode
        </span>
        <button
          type="button"
          onClick={() => pdfBlobUrl && window.open(pdfBlobUrl, '_blank')}
          className="flex items-center gap-1 px-2 py-0.5 rounded bg-sky-600/30 text-sky-300 border border-sky-500/40 font-semibold active:scale-95 transition-transform"
        >
          <ExternalLink className="w-3 h-3" />
          <span>Open Fullscreen</span>
        </button>
      </div>

      {/* Quick Page Jump Pills */}
      <div className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 bg-slate-950/70 border-b border-slate-800/80 overflow-x-auto text-[11px] text-slate-400 shrink-0 scrollbar-none">
        <span className="text-[10px] uppercase font-semibold text-slate-500 tracking-wider mr-1 shrink-0">
          Jump to:
        </span>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => onPageChange(p)}
            className={`px-2 py-0.5 rounded transition-colors whitespace-nowrap shrink-0 ${
              currentPage === p
                ? 'bg-indigo-600/30 text-indigo-300 font-semibold border border-indigo-500/40'
                : 'hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            P{p} · {pageNames[p] || `Page ${p}`}
          </button>
        ))}
      </div>

      {/* Main PDF Viewport */}
      <div className="relative flex-1 bg-slate-900 overflow-auto p-2 sm:p-4 flex items-center justify-center">
        {isGenerating && (
          <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-2xs z-20 flex flex-col items-center justify-center text-white">
            <RefreshCw className="w-8 h-8 animate-spin text-indigo-400 mb-2" />
            <span className="text-xs font-medium">Rendering filled vector document...</span>
          </div>
        )}

        {pdfBlobUrl ? (
          <div
            className="transition-all duration-150 flex items-center justify-center max-w-full"
            style={{
              width: `${zoomLevel}%`,
              minHeight: '100%',
            }}
          >
            <iframe
              src={`${pdfBlobUrl}#page=${currentPage}&toolbar=0&navpanes=0`}
              title="Filled PDF Document Preview"
              className="w-full h-[480px] sm:h-[620px] lg:h-[720px] rounded-lg shadow-2xl bg-white border border-slate-700"
            />
          </div>
        ) : (
          <div className="text-center text-slate-400 p-6 sm:p-8">
            <FileCheck className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 stroke-1 text-slate-500" />
            <p className="text-sm font-medium text-slate-300">Generating Document Preview...</p>
            <p className="text-xs text-slate-500 mt-1">
              Your inserted details are being mapped to the exact form coordinates.
            </p>
          </div>
        )}
      </div>

      {/* Footer Banner */}
      <div className="px-3 py-2 bg-slate-950 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-1.5 text-emerald-400">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Official SBI Form Overlay Calibrated · 100% Vector PDF Output</span>
        </div>
        <span className="text-slate-500 font-mono text-[10px]">
          {fileName}
        </span>
      </div>
    </div>
  );
};
