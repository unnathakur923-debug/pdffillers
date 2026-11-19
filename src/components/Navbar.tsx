import React, { useState } from 'react';
import { Download, Menu, X, FileText } from 'lucide-react';
import { SitePage } from '../utils/seoManager';

interface NavbarProps {
  activePage: SitePage;
  onNavigatePage: (path: string) => void;
  onDownload: () => void;
}

const NAV_ITEMS: Array<{ label: string; path: string; page: SitePage }> = [
  { label: 'Form Filler', path: '/', page: 'tool' },
  { label: 'Guides', path: '/guides', page: 'guides' },
  { label: 'About Us', path: '/about', page: 'about' },
  { label: 'Contact', path: '/contact', page: 'contact' },
  { label: 'Privacy Policy', path: '/privacy-policy', page: 'privacy' },
  { label: 'Terms', path: '/terms', page: 'terms' },
];

export const Navbar: React.FC<NavbarProps> = ({
  activePage,
  onNavigatePage,
  onDownload,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    onNavigatePage(path);
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-6 h-16">
          {/* Zone 1: Clean single-line Brand Wordmark */}
          <a
            href="/"
            onClick={(e) => handleNavClick(e, '/')}
            className="text-base sm:text-lg font-bold tracking-tight text-slate-900 hover:text-emerald-700 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 rounded"
          >
            Thakur Xerox
          </a>

          {/* Zone 2: Clear Top-Level Text Navigation Links */}
          <nav
            aria-label="Primary Navigation"
            className="hidden md:flex items-center gap-5 lg:gap-6 text-sm font-medium text-slate-600"
          >
            {NAV_ITEMS.map((item) => {
              const isActive = activePage === item.page;
              return (
                <a
                  key={item.path}
                  href={item.path}
                  onClick={(e) => handleNavClick(e, item.path)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`py-1 transition-colors whitespace-nowrap shrink-0 underline-offset-4 ${
                    isActive
                      ? 'text-emerald-800 font-semibold underline decoration-emerald-600 decoration-2'
                      : 'text-slate-600 hover:text-slate-900 hover:underline decoration-slate-300'
                  }`}
                >
                  {item.label}
                </a>
              );
            })}
          </nav>

          {/* Zone 3: 1 Primary Action + Mobile Menu Trigger */}
          <div className="flex items-center gap-2 shrink-0">
            {activePage === 'tool' ? (
              <button
                type="button"
                onClick={onDownload}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
                title="Download print-ready filled PDF"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download PDF</span>
              </button>
            ) : (
              <a
                href="/"
                onClick={(e) => handleNavClick(e, '/')}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg transition-colors whitespace-nowrap shrink-0"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Open Form Filler</span>
              </a>
            )}

            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle navigation menu"
              className="md:hidden inline-flex items-center justify-center p-2 rounded-lg text-slate-700 hover:bg-slate-100 border border-slate-200 cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Accessible Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <nav
          aria-label="Mobile Navigation"
          className="md:hidden border-t border-slate-200 bg-white px-4 py-3 space-y-1"
        >
          {NAV_ITEMS.map((item) => {
            const isActive = activePage === item.page;
            return (
              <a
                key={item.path}
                href={item.path}
                onClick={(e) => handleNavClick(e, item.path)}
                aria-current={isActive ? 'page' : undefined}
                className={`block px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-900 font-semibold'
                    : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                {item.label}
              </a>
            );
          })}
        </nav>
      )}
    </header>
  );
};
