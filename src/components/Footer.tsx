import React from 'react';
import { Phone, MessageCircle, ShieldCheck, Mail } from 'lucide-react';
import { AdSenseBanner } from './AdSenseBanner';
import { SitePage } from '../utils/seoManager';

interface FooterProps {
  activePage: SitePage;
  onNavigatePage: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ activePage, onNavigatePage }) => {
  const handleLink = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    e.preventDefault();
    onNavigatePage(path);
  };

  return (
    <footer className="mt-14 bg-slate-900 border-t border-slate-800 text-slate-300">
      {/* Policy-compliant footer ad placement only on primary content/tool pages */}
      {(activePage === 'tool' || activePage === 'guides') && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          <AdSenseBanner
            slot="footer-banner"
            format="auto"
            label="Advertisement"
            className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-2"
          />
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Column 1: Publisher Identity & Privacy Statement */}
          <div className="md:col-span-5 space-y-3">
            <a
              href="/"
              onClick={(e) => handleLink(e, '/')}
              className="text-lg font-bold tracking-tight text-white hover:text-emerald-400 transition-colors inline-block"
            >
              Thakur Xerox · DocuFill Studio
            </a>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-md">
              Independent browser-based banking and agricultural loan PDF preparation portal for State Bank of India पीक कर्ज मागणी (Crop Loan), Bank of Maharashtra &amp; SBI Account Opening forms, Mahabank Debit Card Form AR-35, and 51 formal branch application letters.
            </p>
            <p className="text-xs text-slate-400 flex items-center gap-1.5 pt-1">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>100% client-side PDF rendering · Zero cloud storage of applicant data</span>
            </p>
          </div>

          {/* Column 2: Site Navigation */}
          <div className="md:col-span-3 space-y-3">
            <h3 className="text-xs font-semibold text-white tracking-wide">
              Navigation &amp; Trust Pages
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-400">
              <li>
                <a
                  href="/"
                  onClick={(e) => handleLink(e, '/')}
                  className="hover:text-white transition-colors"
                >
                  PDF Form Filler Workspace
                </a>
              </li>
              <li>
                <a
                  href="/guides"
                  onClick={(e) => handleLink(e, '/guides')}
                  className="hover:text-white transition-colors"
                >
                  Complete Banking &amp; Crop Loan Guides
                </a>
              </li>
              <li>
                <a
                  href="/about"
                  onClick={(e) => handleLink(e, '/about')}
                  className="hover:text-white transition-colors"
                >
                  About Us &amp; Editorial Standards
                </a>
              </li>
              <li>
                <a
                  href="/contact"
                  onClick={(e) => handleLink(e, '/contact')}
                  className="hover:text-white transition-colors"
                >
                  Contact Help Desk
                </a>
              </li>
              <li>
                <a
                  href="/privacy-policy"
                  onClick={(e) => handleLink(e, '/privacy-policy')}
                  className="hover:text-white transition-colors"
                >
                  Privacy Policy &amp; AdSense Disclosure
                </a>
              </li>
              <li>
                <a
                  href="/terms"
                  onClick={(e) => handleLink(e, '/terms')}
                  className="hover:text-white transition-colors"
                >
                  Terms of Service &amp; Disclaimer
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Direct Contact */}
          <div className="md:col-span-4 space-y-3">
            <h3 className="text-xs font-semibold text-white tracking-wide">
              Proprietor &amp; Document Help Desk
            </h3>
            <div className="space-y-1 text-xs sm:text-sm">
              <p className="font-semibold text-white">Vinodsingh Arjunsingh Thakur</p>
              <p className="text-slate-400">Thakur Xerox · Maharashtra, India</p>
              <p className="text-slate-400">Mon – Sat · 9:30 AM – 8:00 PM IST</p>
              <p className="pt-0.5">
                <a
                  href="mailto:unnathakur923@gmail.com"
                  className="inline-flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
                >
                  <Mail className="w-3.5 h-3.5 shrink-0" />
                  <span>unnathakur923@gmail.com</span>
                </a>
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2.5 pt-1">
              <a
                href="tel:+919970996060"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-semibold transition-colors whitespace-nowrap"
              >
                <Phone className="w-3.5 h-3.5" />
                <span className="font-mono tabular-nums">9970996060</span>
              </a>
              <a
                href="https://wa.me/919970996060"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-colors whitespace-nowrap"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp Desk</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Copyright & Disclaimer */}
        <div className="mt-8 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Thakur Xerox (DocuFill Studio). Independent document preparation tool — not affiliated with SBI or Bank of Maharashtra.</p>
          <div className="flex items-center gap-4 shrink-0">
            <a
              href="/about"
              onClick={(e) => handleLink(e, '/about')}
              className="hover:text-slate-300 transition-colors"
            >
              About
            </a>
            <a
              href="/contact"
              onClick={(e) => handleLink(e, '/contact')}
              className="hover:text-slate-300 transition-colors"
            >
              Contact
            </a>
            <a
              href="/privacy-policy"
              onClick={(e) => handleLink(e, '/privacy-policy')}
              className="hover:text-slate-300 transition-colors"
            >
              Privacy Policy
            </a>
            <a
              href="/terms"
              onClick={(e) => handleLink(e, '/terms')}
              className="hover:text-slate-300 transition-colors"
            >
              Terms &amp; Disclaimer
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
