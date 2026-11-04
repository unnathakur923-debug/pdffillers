import React, { useState } from 'react';
import { Phone, MessageCircle, ShieldCheck, Printer, FileText, CheckCircle2 } from 'lucide-react';
import { AdSenseBanner } from './AdSenseBanner';

export const Footer: React.FC = () => {
  const [showPrivacy, setShowPrivacy] = useState(false);

  return (
    <footer className="mt-12 bg-slate-900 border-t border-slate-800 text-slate-300">
      {/* Responsive Footer Ad Placement (AdSense Requirement 3) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <AdSenseBanner
          slot="footer-banner"
          format="auto"
          label="Advertisement"
          className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-2"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Column 1: Store Branding */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-black text-base shadow-xs">
                <Printer className="w-5 h-5 text-amber-300" />
              </div>
              <div>
                <span className="text-lg font-black tracking-tight text-white block leading-tight">
                  Thakur Xerox
                </span>
                <span className="text-xs text-emerald-400 font-semibold block">
                  Precision Banking Forms & Digital Document Center
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-400 max-w-md leading-relaxed">
              Official printing and digital assistance center for Bank of Maharashtra, State Bank of India, ATM Debit Card applications (Form AR-35), and bank correspondence letters with pixel-perfect box centering.
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-slate-400">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700/60">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>100% Client-Side Privacy</span>
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700/60">
                <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
                <span>Zero Cloud Storage of Customer Data</span>
              </span>
            </div>
          </div>

          {/* Column 2: Contact Person */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400">
              Proprietor & Help Desk
            </h4>
            <div className="space-y-1">
              <p className="text-sm font-extrabold text-white">
                Vinodsingh Arjunsingh Thakur
              </p>
              <p className="text-xs text-slate-400">
                Thakur Xerox Services
              </p>
            </div>

            <div className="flex flex-col gap-2 pt-1">
              <a
                href="tel:9970996060"
                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold shadow-xs transition-transform active:scale-95 w-fit"
              >
                <Phone className="w-3.5 h-3.5 fill-slate-950" />
                <span>Call: 9970996060</span>
              </a>

              <a
                href="https://wa.me/919970996060"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-xs transition-transform active:scale-95 w-fit"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp: 9970996060</span>
              </a>
            </div>
          </div>

          {/* Column 3: Services & Legal */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Services & Policies
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-400">
              <li>• Bank of Maharashtra Account Opening</li>
              <li>• State Bank of India CIF Forms</li>
              <li>• BOM Mahabank VISA Debit Card (AR-35)</li>
              <li>• Bank Application Letters & Affidavits</li>
              <li>• Photostat, Color Print & Lamination</li>
            </ul>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => setShowPrivacy(true)}
                className="text-xs text-amber-400 hover:text-amber-300 underline underline-offset-2 cursor-pointer"
              >
                Privacy Policy & AdSense Notice
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
          <p>© {new Date().getFullYear()} Thakur Xerox. All rights reserved.</p>
          <p className="text-center sm:text-right">
            Contact: Vinodsingh Arjunsingh Thakur (9970996060) • Designed for Mobile & Desktop
          </p>
        </div>
      </div>

      {/* Privacy Policy & AdSense Disclosure Modal */}
      {showPrivacy && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 overflow-y-auto"
        >
          <div className="bg-slate-900 border border-slate-700 text-slate-200 rounded-xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Privacy Policy & Google AdSense Disclosure
              </h3>
              <button
                type="button"
                onClick={() => setShowPrivacy(false)}
                className="text-slate-400 hover:text-white text-sm font-bold px-2 py-1"
              >
                ✕
              </button>
            </div>

            <div className="text-xs space-y-3 leading-relaxed text-slate-300 max-h-[60vh] overflow-y-auto pr-1">
              <p>
                <strong>Thakur Xerox Form Filler</strong> operates entirely within your browser. All form field filling, coordinate calculations, and PDF rendering are processed locally on your device. None of your entered personal details, PAN numbers, Aadhaar numbers, or photographs are ever uploaded, recorded, or transmitted to any server.
              </p>
              <p>
                <strong>Google AdSense Advertising:</strong> This website partners with Google AdSense to serve advertisements. Google and its partners may use cookies to serve ads based on your visits to this or other websites. You may opt out of personalized advertising by visiting Google Ads Settings.
              </p>
              <p>
                <strong>Third-Party Vendors:</strong> Google&apos;s use of advertising cookies enables it and its partners to serve ads based on user visits. You can opt out of a third-party vendor&apos;s use of cookies for personalized advertising by visiting www.aboutads.info.
              </p>
              <p>
                <strong>Proprietor Contact:</strong> For inquiries or assistance, please reach Vinodsingh Arjunsingh Thakur at 9970996060.
              </p>
            </div>

            <div className="pt-2 text-right">
              <button
                type="button"
                onClick={() => setShowPrivacy(false)}
                className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold cursor-pointer"
              >
                Close Notice
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};
