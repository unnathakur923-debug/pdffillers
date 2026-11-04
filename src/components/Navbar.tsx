import React from 'react';
import { Download, Sparkles, RotateCcw, FileText, FilePlus2, Phone, FileCode, FileArchive } from 'lucide-react';
import { FormTemplateType } from '../types/formTypes';

interface NavbarProps {
  onDownload: () => void;
  onFillSample: () => void;
  onClear: () => void;
  onFreshApplication: () => void;
  onOpenWelcome?: () => void;
  onOpenDownloadCode?: () => void;
  onDirectDownloadHtml?: () => void;
  hasData: boolean;
  activeTemplate?: FormTemplateType;
  customSubtitle?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  onDownload,
  onFillSample,
  onClear,
  onFreshApplication,
  onOpenWelcome,
  onOpenDownloadCode,
  onDirectDownloadHtml,
  hasData,
  activeTemplate = 'statement',
  customSubtitle,
}) => {
  const getTemplateLabel = () => {
    switch (activeTemplate) {
      case 'statement':
        return 'Bank Application Letters (51 Official Formats: ATM, Cheques, Digital/UPI, Certificates, KYC & More)';
      case 'atm':
        return 'Bank of Maharashtra — Mahabank VISA Debit Card Application (Form AR-35)';
      case 'bom':
        return 'Bank of Maharashtra — Account Opening (13 Pages)';
      case 'sbi':
        return 'State Bank of India — Account Opening (7 Pages)';
      case 'custom':
        return 'Custom Uploaded PDF Document';
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-2 sm:gap-4 h-16">
          {/* Brand Wordmark & Document Tag */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1 mr-1">
            <button
              type="button"
              onClick={onOpenWelcome}
              title="Click to view Thakur Xerox welcome screen"
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-gradient-to-br from-emerald-600 to-emerald-800 text-white flex items-center justify-center font-bold text-sm shadow-xs hover:opacity-90 transition-opacity cursor-pointer shrink-0 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-amber-300" />
            </button>
            <div className="min-w-0">
              <div className="flex items-center gap-1 sm:gap-1.5">
                <button
                  type="button"
                  onClick={onOpenWelcome}
                  className="text-sm sm:text-base font-extrabold tracking-tight text-slate-900 whitespace-nowrap leading-tight hover:text-emerald-700 transition-colors cursor-pointer text-left"
                >
                  Thakur Xerox
                </button>
                <span className="text-[9px] sm:text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200/80 hidden xs:inline">
                  Center
                </span>
              </div>
              <span className="text-[10px] sm:text-[11px] text-emerald-800 font-medium truncate max-w-[120px] xs:max-w-[170px] sm:max-w-xs md:max-w-md block">
                {customSubtitle || getTemplateLabel()}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Mobile Call Icon Button */}
            <a
              href="tel:9970996060"
              className="flex lg:hidden items-center justify-center p-2 rounded-md bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 shadow-2xs"
              title="Call Vinodsingh Thakur: 9970996060"
            >
              <Phone className="w-3.5 h-3.5 text-amber-700" />
            </a>

            {/* Desktop Contact Vinodsingh Thakur */}
            <a
              href="tel:9970996060"
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-amber-950 bg-amber-50 hover:bg-amber-100/90 rounded-md transition-all whitespace-nowrap border border-amber-300 shadow-2xs hover:shadow-xs"
              title="Call Vinodsingh Arjunsingh Thakur: 9970996060"
            >
              <Phone className="w-3.5 h-3.5 text-amber-700" />
              <span>Contact: Vinodsingh Thakur — 9970996060</span>
            </a>

            {/* Fresh Application Button */}
            <button
              type="button"
              onClick={onFreshApplication}
              className="flex items-center gap-1 px-2 sm:px-3 py-1.5 text-xs font-bold text-emerald-950 bg-emerald-50 hover:bg-emerald-100/90 rounded-md transition-all whitespace-nowrap border border-emerald-300 shadow-2xs hover:shadow-xs active:scale-98"
              title="Start a fresh, clean application for a new applicant"
            >
              <FilePlus2 className="w-3.5 h-3.5 text-emerald-700" />
              <span className="hidden sm:inline">Fresh Application</span>
              <span className="sm:hidden">Fresh</span>
            </button>

            <button
              type="button"
              onClick={onFillSample}
              className="flex items-center gap-1 px-2 sm:px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 rounded-md transition-colors whitespace-nowrap border border-slate-300 shadow-2xs"
              title="Populate form with verified sample data"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span className="hidden sm:inline">Fill Sample</span>
              <span className="sm:hidden">Sample</span>
            </button>

            {hasData && (
              <button
                type="button"
                onClick={onClear}
                className="hidden md:flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors whitespace-nowrap"
                title="Clear all fields"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Clear
              </button>
            )}

            {/* Direct Download index.html Button for Hostinger */}
            {onDirectDownloadHtml && (
              <button
                type="button"
                onClick={onDirectDownloadHtml}
                className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-bold text-emerald-950 bg-emerald-100 hover:bg-emerald-200/90 rounded-md transition-all whitespace-nowrap border border-emerald-400 shadow-2xs hover:shadow-xs active:scale-98"
                title="Download full portal as index.html to upload directly to Hostinger public_html with zero errors"
              >
                <FileCode className="w-3.5 h-3.5 text-emerald-800" />
                <span className="hidden sm:inline">Download index.html</span>
                <span className="sm:hidden">HTML</span>
              </button>
            )}

            {/* Download Packages / All Formats Button */}
            {onOpenDownloadCode && (
              <button
                type="button"
                onClick={onOpenDownloadCode}
                className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors whitespace-nowrap border border-slate-300 shadow-2xs"
                title="All Hostinger download packages (Single HTML, ZIPs, Node App)"
              >
                <FileArchive className="w-3.5 h-3.5 text-slate-600" />
                <span className="hidden md:inline">ZIP Packages</span>
              </button>
            )}

            <button
              type="button"
              onClick={onDownload}
              className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3.5 py-1.5 sm:py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-sm hover:shadow transition-all whitespace-nowrap active:scale-98"
              title="Download filled PDF"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Download Filled PDF</span>
              <span className="sm:hidden">PDF</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
