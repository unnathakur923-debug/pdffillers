import React, { useEffect, useRef } from 'react';
import {
  ArrowRight,
  Printer,
  FileCheck2,
  CreditCard,
  Building2,
  ShieldCheck,
  PhoneCall,
  MessageCircle,
  Zap,
  X,
} from 'lucide-react';

interface WelcomeFlashModalProps {
  isOpen: boolean;
  onEnter: () => void;
}

export const WelcomeFlashModal: React.FC<WelcomeFlashModalProps> = ({ isOpen, onEnter }) => {
  const enterButtonRef = useRef<HTMLButtonElement | null>(null);

  // Lock background body scroll while modal is active
  useEffect(() => {
    if (!isOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Focus the primary action button
    const timer = setTimeout(() => {
      enterButtonRef.current?.focus();
    }, 100);

    return () => {
      document.body.style.overflow = originalOverflow;
      clearTimeout(timer);
    };
  }, [isOpen]);

  // Listen for Enter and Escape keys to dismiss
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === 'Escape') {
        e.preventDefault();
        onEnter();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onEnter]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Thakur Xerox Welcome and Contact Screen"
      onClick={(e) => {
        // Dismiss if clicking directly on the backdrop
        if (e.target === e.currentTarget) {
          onEnter();
        }
      }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-3 sm:p-5 md:p-6 overflow-y-auto overscroll-contain animate-in fade-in duration-200"
    >
      {/* Background ambient lighting */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden flex items-center justify-center">
        <div className="w-[550px] h-[550px] bg-gradient-to-tr from-amber-500/20 via-rose-500/15 to-emerald-500/20 rounded-full blur-3xl opacity-80 animate-pulse" />
      </div>

      {/* Main Flash Welcome Card - Fully Mobile & Desktop Responsive */}
      <div className="relative w-full max-w-2xl bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border-2 border-amber-400/80 rounded-2xl shadow-[0_0_50px_rgba(245,158,11,0.25)] p-4 sm:p-7 md:p-8 text-center text-white my-auto max-h-[92vh] overflow-y-auto overscroll-contain">
        {/* Animated flashing top accent bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 sm:h-2 bg-gradient-to-r from-amber-400 via-rose-500 to-emerald-400 animate-pulse" />

        {/* Top Close (Dismiss) Button */}
        <button
          type="button"
          onClick={onEnter}
          aria-label="Close welcome screen"
          title="Close (or press Esc / Enter)"
          className="absolute top-3.5 right-3.5 sm:top-4 sm:right-4 p-1.5 sm:p-2 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/80 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-400 z-10"
        >
          <X className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        {/* Flashing Notice Badges */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 mb-3 pt-1 pr-6 sm:pr-0">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/60 text-amber-300 text-[11px] sm:text-xs font-black tracking-wider uppercase shadow-xs">
            <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400 animate-bounce" />
            <span>FLASH ANNOUNCEMENT</span>
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/60 text-emerald-300 text-[11px] sm:text-xs font-bold tracking-wide uppercase">
            <Printer className="w-3.5 h-3.5 text-emerald-400" />
            <span>Digital Printing & Banking Center</span>
          </span>
        </div>

        {/* Main Welcome Heading */}
        <div className="space-y-1.5 mb-4">
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight text-white leading-tight">
            <span className="bg-gradient-to-r from-amber-200 via-white to-emerald-200 bg-clip-text text-transparent drop-shadow-sm">
              Thakur Xerox
            </span>{' '}
            <span className="text-emerald-400 block sm:inline">Welcomes You</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto font-normal px-2">
            Your trusted center for Bank of Maharashtra & SBI account opening forms, debit card applications, and official banking letters.
          </p>
        </div>

        {/* PROMINENT CONTACT BOX */}
        <div className="my-3.5 sm:my-5 p-3.5 sm:p-5 rounded-xl bg-gradient-to-r from-amber-950/70 via-slate-900 to-emerald-950/70 border-2 border-amber-400/90 shadow-[0_0_25px_rgba(251,191,36,0.3)] transition-all">
          <div className="flex items-center justify-center gap-2 text-amber-400 text-[10px] sm:text-xs font-bold tracking-widest uppercase mb-1">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
            <span>Official Proprietor & Assistance</span>
          </div>

          <div className="text-base sm:text-2xl font-black tracking-tight text-white mt-1 break-words">
            Contact:{' '}
            <span className="text-amber-300 underline decoration-amber-400/50 underline-offset-4 block sm:inline mt-0.5 sm:mt-0">
              Vinodsingh Arjunsingh Thakur
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 sm:gap-3 mt-3 pt-2.5 border-t border-slate-700/60">
            <a
              href="tel:9970996060"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-sm sm:text-base font-extrabold shadow-md hover:shadow-lg transition-transform active:scale-95 cursor-pointer min-h-[44px]"
              title="Click to Call 9970996060"
            >
              <PhoneCall className="w-4 h-4 fill-slate-950" />
              <span>Call: 9970996060</span>
            </a>

            <a
              href="https://wa.me/919970996060?text=Hello%20Vinodsingh%20Thakur,%20I%20am%20visiting%20Thakur%20Xerox%20DocuFill%20Studio%20and%20need%20assistance%20with%20banking%20forms."
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-transform active:scale-95 cursor-pointer min-h-[44px]"
              title="Chat on WhatsApp"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Chat on WhatsApp</span>
            </a>
          </div>
        </div>

        {/* 3 Quick Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-2.5 my-3.5 sm:my-5 text-left text-xs">
          <div className="p-2.5 sm:p-3 rounded-lg bg-slate-800/60 border border-slate-700/60">
            <div className="flex items-center gap-2 text-emerald-400 font-bold mb-1">
              <Building2 className="w-4 h-4 shrink-0" />
              <span>BOM & SBI Forms</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-snug">
              Official 13-page BOM & 7-page SBI Account Opening CIF forms with exact box centering.
            </p>
          </div>

          <div className="p-2.5 sm:p-3 rounded-lg bg-slate-800/60 border border-slate-700/60">
            <div className="flex items-center gap-2 text-sky-400 font-bold mb-1">
              <CreditCard className="w-4 h-4 shrink-0" />
              <span>ATM Debit Card</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-snug">
              Bank of Maharashtra Mahabank VISA / RuPay Debit Card Form AR-35 preparation.
            </p>
          </div>

          <div className="p-2.5 sm:p-3 rounded-lg bg-slate-800/60 border border-slate-700/60">
            <div className="flex items-center gap-2 text-amber-400 font-bold mb-1">
              <FileCheck2 className="w-4 h-4 shrink-0" />
              <span>51 Bank Letters</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-snug">
              ATM cards, cheques, complaints, nominee, address/mobile change, Aadhaar, PAN & more.
            </p>
          </div>
        </div>

        {/* Enter Site Button (Prominent Call-To-Action) */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3">
          <button
            ref={enterButtonRef}
            type="button"
            onClick={onEnter}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-3.5 text-base sm:text-lg font-black text-slate-950 bg-gradient-to-r from-amber-400 via-emerald-400 to-emerald-300 hover:from-amber-300 hover:to-emerald-200 rounded-xl shadow-lg shadow-emerald-500/25 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.99] cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 focus:ring-offset-slate-900 min-h-[48px]"
          >
            <span>Enter Site</span>
            <ArrowRight className="w-5 h-5 text-slate-950" />
          </button>
        </div>

        <p className="mt-2 text-[10px] sm:text-[11px] text-slate-400">
          Press <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-200 font-mono text-[10px]">Enter ↵</kbd> or <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-200 font-mono text-[10px]">Esc</kbd> to enter immediately
        </p>

        {/* Footer Note */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-center gap-2 text-[10px] sm:text-[11px] text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span>Thakur Xerox • Quality Xerox, Color Printing, Lamination & Banking Applications</span>
        </div>
      </div>
    </div>
  );
};
