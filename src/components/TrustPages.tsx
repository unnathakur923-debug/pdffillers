import React, { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Phone,
  MessageCircle,
  Clock,
  MapPin,
  BookOpen,
  FileCheck2,
  Mail,
  AlertCircle,
  Copy,
  Check,
  ExternalLink,
  Scale,
  Building2,
} from 'lucide-react';
import { FormTemplateType } from '../types/formTypes';
import {
  CONSOLIDATED_GUIDE_PILLARS,
  LETTER_CATEGORY_GUIDES,
  FAQ_ITEMS,
} from '../data/editorialContent';

interface PageActionProps {
  onNavigatePage: (path: string) => void;
  onLaunchTemplate: (templateId: FormTemplateType) => void;
}

/* ============================================================================
 * 1. CONSOLIDATED BANKING & FORM GUIDES PAGE (/guides)
 * ========================================================================== */
export const GuidesPage: React.FC<PageActionProps> = ({
  onNavigatePage,
  onLaunchTemplate,
}) => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      {/* Breadcrumb & Header */}
      <div className="space-y-4 pb-6 border-b border-slate-200">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              onNavigatePage('/');
            }}
            className="hover:text-emerald-700 transition-colors"
          >
            Home
          </a>
          <span aria-hidden="true">/</span>
          <span className="text-slate-800 font-medium">Banking & Crop Loan Guides</span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-bold text-slate-900 tracking-tight text-balance">
          Complete Banking & Agricultural Form Preparation Guides
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-3xl">
          Every document checklist, page-by-page field walkthrough, and branch submission guideline has been consolidated into this single comprehensive reference so you can prepare SBI Crop Loan sets, Account Opening booklets, Debit Card Form AR-35, and 51 formal bank letters accurately on the first attempt.
        </p>

        {/* Quick In-Page Jump Links */}
        <nav aria-label="Guide sections" className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-2 text-xs sm:text-sm font-medium text-emerald-800">
          {CONSOLIDATED_GUIDE_PILLARS.map((pillar) => (
            <a
              key={pillar.id}
              href={`#${pillar.id}`}
              className="hover:underline underline-offset-4 whitespace-nowrap"
            >
              {pillar.index}. {pillar.title.split('(')[0].trim()}
            </a>
          ))}
        </nav>
      </div>

      {/* Pillar Guide Articles */}
      <div className="space-y-8">
        {CONSOLIDATED_GUIDE_PILLARS.map((pillar) => (
          <article
            key={pillar.id}
            id={pillar.id}
            className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 space-y-6 scroll-mt-24"
          >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-5 border-b border-slate-100">
              <div className="space-y-1.5 max-w-2xl">
                <p className="text-xs font-mono font-semibold text-emerald-700">
                  Guide {pillar.index} · {pillar.subtitle}
                </p>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                  {pillar.title}
                </h2>
                <p className="text-sm text-slate-600 leading-relaxed pt-1">
                  {pillar.summary}
                </p>
              </div>
              <button
                type="button"
                onClick={() => onLaunchTemplate(pillar.templateId)}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <span>Open in Form Filler</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-5">
              {pillar.sections.map((sec) => (
                <div key={sec.heading} className="space-y-2">
                  <h3 className="text-base font-bold text-slate-900">
                    {sec.heading}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed max-w-3xl">
                    {sec.body}
                  </p>
                  {sec.bullets && (
                    <ul className="space-y-1.5 pt-1 text-sm text-slate-700">
                      {sec.bullets.map((b, i) => (
                        <li key={i} className="flex items-start gap-2.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>

            <div className="pt-5 border-t border-slate-100 space-y-2.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <FileCheck2 className="w-4 h-4 text-emerald-700" />
                <span>Mandatory Supporting Documents Checklist</span>
              </h4>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-slate-700">
                {pillar.documentsChecklist.map((doc, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-emerald-700 font-bold">·</span>
                    <span>{doc}</span>
                  </li>
                ))}
              </ul>
            </div>
          </article>
        ))}
      </div>

      {/* Categorized 51 Letters Reference */}
      <section className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 space-y-5">
        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-slate-500">
            Complete Format Matrix · SBI & Bank of Maharashtra
          </p>
          <h2 className="text-xl font-bold text-slate-900">
            All 51 Bank Application Letter Categories at a Glance
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 font-semibold">
                <th className="py-3 pr-4">Category</th>
                <th className="py-3 px-3 text-right tabular-nums">Count</th>
                <th className="py-3 px-4">Key Request Formats</th>
                <th className="py-3 px-4">Branch Notes & Turnaround</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {LETTER_CATEGORY_GUIDES.map((row) => (
                <tr key={row.category} className="align-top">
                  <td className="py-3.5 pr-4 font-semibold text-slate-900 whitespace-nowrap">
                    {row.category}
                  </td>
                  <td className="py-3.5 px-3 text-right font-mono tabular-nums font-semibold text-emerald-700">
                    {row.count}
                  </td>
                  <td className="py-3.5 px-4 leading-relaxed">
                    {row.commonLetters.join(' · ')}
                  </td>
                  <td className="py-3.5 px-4 leading-relaxed">
                    <span className="block text-slate-700">{row.requiredEnclosures}</span>
                    <span className="block text-xs text-slate-500 mt-0.5">
                      {row.typicalTurnaround} — {row.preparationNote}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Consolidated FAQ Snapshot */}
      <section className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 space-y-5">
        <h2 className="text-xl font-bold text-slate-900">
          Frequently Asked Questions
        </h2>
        <div className="divide-y divide-slate-100">
          {FAQ_ITEMS.slice(0, 6).map((faq) => (
            <div key={faq.question} className="py-4 space-y-1.5">
              <h3 className="text-sm sm:text-base font-semibold text-slate-900">
                {faq.question}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed max-w-3xl">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

/* ============================================================================
 * 2. ABOUT US PAGE (/about)
 * ========================================================================== */
export const AboutPage: React.FC<PageActionProps> = ({
  onNavigatePage,
  onLaunchTemplate,
}) => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      <div className="space-y-3 pb-6 border-b border-slate-200">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              onNavigatePage('/');
            }}
            className="hover:text-emerald-700 transition-colors"
          >
            Home
          </a>
          <span aria-hidden="true">/</span>
          <span className="text-slate-800 font-medium">About Us</span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-bold text-slate-900 tracking-tight text-balance">
          About Thakur Xerox &amp; DocuFill Studio
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          Who operates this platform, our real-world banking documentation background in Maharashtra, and why we built a free, privacy-first PDF form preparation utility.
        </p>
      </div>

      {/* Operator & Publisher Identity Summary */}
      <section className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700">
          <Building2 className="w-4 h-4" />
          <span>Site Operator &amp; Publisher Details</span>
        </div>
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200/80">
            <dt className="text-xs font-semibold text-slate-500">Operated By</dt>
            <dd className="font-bold text-slate-900 mt-0.5">Thakur Xerox</dd>
            <dd className="text-xs text-slate-600 mt-0.5">
              Digital Printing, Xerox &amp; Citizen Banking Documentation Center
            </dd>
          </div>
          <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200/80">
            <dt className="text-xs font-semibold text-slate-500">Proprietor &amp; Lead Publisher</dt>
            <dd className="font-bold text-slate-900 mt-0.5">Vinodsingh Arjunsingh Thakur</dd>
            <dd className="text-xs text-slate-600 mt-0.5">Maharashtra, India</dd>
          </div>
          <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200/80">
            <dt className="text-xs font-semibold text-slate-500">Official Support Email</dt>
            <dd className="mt-0.5">
              <a
                href="mailto:unnathakur923@gmail.com"
                className="font-semibold text-emerald-700 hover:underline underline-offset-4 break-all"
              >
                unnathakur923@gmail.com
              </a>
            </dd>
          </div>
          <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200/80">
            <dt className="text-xs font-semibold text-slate-500">Help Desk Phone &amp; WhatsApp</dt>
            <dd className="mt-0.5 font-mono tabular-nums font-semibold text-slate-900">
              <a href="tel:+919970996060" className="hover:text-emerald-700">
                +91 9970996060
              </a>
            </dd>
          </div>
        </dl>
      </section>

      <article className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 space-y-7 text-sm sm:text-base text-slate-700 leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900">
            1. Who Operates DocuFill Studio
          </h2>
          <p>
            <strong>DocuFill Studio</strong> is independently owned, maintained, and published by <strong>Thakur Xerox</strong> under the proprietorship of <strong>Vinodsingh Arjunsingh Thakur</strong> in Maharashtra, India. Unlike anonymous form-download websites that republish blurry scanned PDFs without context, DocuFill Studio is backed by a real citizen documentation counter that prepares printed banking and agricultural loan files every day.
          </p>
        </section>

        <section className="space-y-3 pt-5 border-t border-slate-100">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900">
            2. Our Background &amp; Domain Expertise
          </h2>
          <p>
            Running a dedicated Xerox, printing, and banking documentation desk in Maharashtra has given us years of firsthand experience with the exact paperwork requirements at public-sector bank branches—particularly <strong>State Bank of India (SBI)</strong> and <strong>Bank of Maharashtra (BOM)</strong>.
          </p>
          <p>
            Every week, farmers, students, pensioners, and salaried applicants visit document counters with returned applications caused by cramped handwriting, letters spilling outside optical CIF boxes, missing 7/12 (Satbara) or 8A crop-area entries, or incomplete Marathi self-declarations. Our practical understanding of these recurring branch checkpoints directly informs every feature of this platform:
          </p>
          <ul className="space-y-2.5 text-sm text-slate-700 pt-1">
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-1" />
              <span>
                <strong>Agricultural &amp; Crop Loan Expertise:</strong> Accurate 3-page Marathi formatting for SBI पीक कर्ज मागणी (Crop Loan Application), PMFBY पीक पेरा स्वयंघोषणापत्र (Sowing Declaration), and चतुःसीमा प्रतिज्ञापत्र (Four-Boundary Affidavit) aligned cleanly above printed ruling lines.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-1" />
              <span>
                <strong>Optical Box Calibration for KYC &amp; Account Booklets:</strong> Point-by-point A4 geometry mapping for 7-page SBI CIF/Account Opening forms, 13-page Bank of Maharashtra Account Opening kits, and Mahabank ATM/Debit Card Form AR-35.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-1" />
              <span>
                <strong>Formal Bank Letter Standards:</strong> 51 structured branch request letters covering KYC updates, Aadhaar/PAN seeding, mobile number changes, account transfers, cheque books, passbooks, and loan certificates—complete with branch enclosure checklists.
              </span>
            </li>
          </ul>
        </section>

        <section className="space-y-3 pt-5 border-t border-slate-100">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900">
            3. Purpose of the Platform
          </h2>
          <p>
            Our purpose is simple: <strong>help citizens prepare legible, complete, branch-ready banking and crop loan paperwork on the first attempt—for free, and without exposing personal identity details to cloud servers.</strong>
          </p>
          <p>
            Whether you are a farmer typing a Marathi crop loan application using a standard English keyboard, a student preparing a new savings account kit, a senior citizen drafting a bank letter, or a local Xerox/CSC operator helping customers print clean A4 sets, DocuFill Studio removes guesswork and handwriting errors.
          </p>
        </section>

        <section className="space-y-3 pt-5 border-t border-slate-100">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900">
            4. Privacy Architecture &amp; Editorial Integrity
          </h2>
          <ul className="space-y-2.5 text-sm text-slate-700">
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-1" />
              <span>
                <strong>100% Client-Side PDF Generation:</strong> All PDF rendering, ink color switching (Blue, Black, Red), passport photograph placement, and Marathi transliteration execute locally inside your browser memory. We never store Aadhaar, PAN, land records, or bank account numbers on a server.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-1" />
              <span>
                <strong>Original Guides &amp; Regular Verification:</strong> All walkthroughs, checklists, and FAQs on this site are written originally from practical branch experience and updated whenever form layouts or document expectations evolve.
              </span>
            </li>
          </ul>
        </section>

        <section className="space-y-3 pt-5 border-t border-slate-100">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900">
            5. Independent Utility &amp; Non-Affiliation Notice
          </h2>
          <p className="text-sm text-slate-600">
            Thakur Xerox and DocuFill Studio operate strictly as an independent document assistance service and web utility. We are <strong>not</strong> affiliated with, sponsored by, endorsed by, or officially connected to State Bank of India (SBI), Bank of Maharashtra (BOM), the Reserve Bank of India (RBI), NPCI, or the Pradhan Mantri Fasal Bima Yojana (PMFBY) portal. All bank names, logos, and official form formats belong to their respective institutions.
          </p>
        </section>

        <div className="pt-5 border-t border-slate-100 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => onLaunchTemplate('peek_karj')}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold transition-colors cursor-pointer"
          >
            <span>Start Using Form Filler</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <a
            href="/contact"
            onClick={(e) => {
              e.preventDefault();
              onNavigatePage('/contact');
            }}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition-colors"
          >
            <span>Contact Us</span>
          </a>
          <a
            href="/privacy-policy"
            onClick={(e) => {
              e.preventDefault();
              onNavigatePage('/privacy-policy');
            }}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition-colors"
          >
            <span>Privacy Policy</span>
          </a>
          <a
            href="/terms"
            onClick={(e) => {
              e.preventDefault();
              onNavigatePage('/terms');
            }}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition-colors"
          >
            <span>Terms &amp; Disclaimer</span>
          </a>
        </div>
      </article>
    </div>
  );
};

/* ============================================================================
 * 3. CONTACT US PAGE (/contact)
 * ========================================================================== */
const SUPPORT_EMAIL = 'unnathakur923@gmail.com';
const SUPPORT_PHONE_DISPLAY = '+91 9970996060';
const SUPPORT_PHONE_RAW = '919970996060';

export const ContactPage: React.FC<{ onNavigatePage: (path: string) => void }> = ({
  onNavigatePage,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [topic, setTopic] = useState('SBI Peek Karj Magni / Crop Loan Help');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [ticketId, setTicketId] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedMessage, setCopiedMessage] = useState(false);

  const buildFormattedBody = (refId: string) =>
    [
      `Reference ID: ${refId}`,
      `Name: ${name.trim()}`,
      `Reply Email: ${email.trim()}`,
      `Mobile: ${phone.trim() || 'Not provided'}`,
      `Topic: ${topic}`,
      '',
      'Message:',
      message.trim(),
    ].join('\n');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedMessage = message.trim();

    if (!trimmedName) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    if (!trimmedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setErrorMsg('Please enter a valid email address so we can reply to your inquiry.');
      return;
    }
    if (trimmedMessage.length < 10) {
      setErrorMsg('Please enter a brief message (at least 10 characters) describing how we can help.');
      return;
    }

    const generatedRef = `TX-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    setTicketId(generatedRef);
    setErrorMsg(null);
    setSubmitted(true);
  };

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(SUPPORT_EMAIL);
      setCopiedEmail(true);
      window.setTimeout(() => setCopiedEmail(false), 2500);
    } catch {
      setCopiedEmail(false);
    }
  };

  const handleCopyInquiry = async () => {
    try {
      await navigator.clipboard.writeText(
        `To: ${SUPPORT_EMAIL}\nSubject: [DocuFill Studio - ${ticketId}] ${topic}\n\n${buildFormattedBody(ticketId)}`
      );
      setCopiedMessage(true);
      window.setTimeout(() => setCopiedMessage(false), 2500);
    } catch {
      setCopiedMessage(false);
    }
  };

  const emailSubject = `[DocuFill Studio${ticketId ? ` · ${ticketId}` : ''}] ${topic}`;
  const mailtoInquiryUrl = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(
    emailSubject
  )}&body=${encodeURIComponent(buildFormattedBody(ticketId || 'DIRECT'))}`;

  const whatsappInquiryUrl = `https://wa.me/${SUPPORT_PHONE_RAW}?text=${encodeURIComponent(
    `Hello Vinodsingh Thakur,\n${buildFormattedBody(ticketId || 'DIRECT')}`
  )}`;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      <div className="space-y-3 pb-6 border-b border-slate-200">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              onNavigatePage('/');
            }}
            className="hover:text-emerald-700 transition-colors"
          >
            Home
          </a>
          <span aria-hidden="true">/</span>
          <span className="text-slate-800 font-medium">Contact Us</span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-bold text-slate-900 tracking-tight text-balance">
          Contact Thakur Xerox &amp; DocuFill Studio Support
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-3xl">
          Need help aligning a banking PDF, preparing a Marathi crop loan application, reporting a template correction, or asking a privacy/policy question? Reach our support team directly by email, phone, WhatsApp, or the contact form below.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Direct Contact Information & Business Details */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-6 space-y-5">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-emerald-700">Business &amp; Support Details</p>
            <h2 className="text-lg font-bold text-slate-900">
              Thakur Xerox (DocuFill Studio)
            </h2>
            <p className="text-xs text-slate-500">
              Proprietor: <strong className="text-slate-700">Vinodsingh Arjunsingh Thakur</strong> · Digital Printing, Xerox &amp; Banking Documentation Center
            </p>
          </div>

          <dl className="space-y-4 text-sm text-slate-700 pt-2 border-t border-slate-100">
            <div className="flex items-start gap-3">
              <Mail className="w-4 h-4 text-emerald-700 shrink-0 mt-1" />
              <div className="min-w-0 flex-1">
                <dt className="text-xs font-semibold text-slate-500">Support Email Address</dt>
                <dd className="flex flex-wrap items-center gap-2 mt-0.5">
                  <a
                    href={`mailto:${SUPPORT_EMAIL}`}
                    className="font-semibold text-emerald-700 hover:underline underline-offset-4 break-all"
                  >
                    {SUPPORT_EMAIL}
                  </a>
                  <button
                    type="button"
                    onClick={handleCopyEmail}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded border border-slate-200 bg-slate-50 hover:bg-slate-100 text-[11px] font-medium text-slate-700 cursor-pointer"
                    title="Copy support email address"
                  >
                    {copiedEmail ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-600" />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </dd>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="w-4 h-4 text-emerald-700 shrink-0 mt-1" />
              <div>
                <dt className="text-xs font-semibold text-slate-500">Direct Phone</dt>
                <dd className="font-mono tabular-nums font-semibold text-slate-900 mt-0.5">
                  <a href={`tel:+${SUPPORT_PHONE_RAW}`} className="hover:text-emerald-700">
                    {SUPPORT_PHONE_DISPLAY}
                  </a>
                </dd>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MessageCircle className="w-4 h-4 text-emerald-700 shrink-0 mt-1" />
              <div>
                <dt className="text-xs font-semibold text-slate-500">WhatsApp Document Desk</dt>
                <dd className="mt-0.5">
                  <a
                    href={`https://wa.me/${SUPPORT_PHONE_RAW}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-emerald-700 hover:underline underline-offset-4"
                  >
                    Chat on WhatsApp (9970996060)
                  </a>
                </dd>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-emerald-700 shrink-0 mt-1" />
              <div>
                <dt className="text-xs font-semibold text-slate-500">Business Location &amp; Service Area</dt>
                <dd className="text-slate-800 mt-0.5">
                  Thakur Xerox, Maharashtra, India
                </dd>
                <dd className="text-xs text-slate-500 mt-0.5">
                  Local counter support in Maharashtra &amp; free online tool access across India.
                </dd>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="w-4 h-4 text-emerald-700 shrink-0 mt-1" />
              <div>
                <dt className="text-xs font-semibold text-slate-500">Business Hours &amp; Response Time</dt>
                <dd className="text-slate-800 mt-0.5">Monday – Saturday · 9:30 AM – 8:00 PM IST</dd>
                <dd className="text-xs text-slate-500 mt-0.5">
                  Email replies within 24–48 business hours; phone/WhatsApp typically same day.
                </dd>
              </div>
            </div>
          </dl>

          <div className="pt-4 border-t border-slate-100 space-y-2 text-xs text-slate-600 leading-relaxed">
            <p className="font-semibold text-slate-800">Important Banking Security Notice:</p>
            <p>
              Never share OTPs, ATM PINs, NetBanking passwords, CVV codes, or full Aadhaar/PAN images via email, WhatsApp, or contact forms. For account balances, transaction disputes, or loan sanction status, always contact your official SBI or Bank of Maharashtra home branch directly.
            </p>
          </div>
        </div>

        {/* Working Contact & Support Form */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-6 space-y-5">
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-slate-900">
              Send Us a Message
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Ask about form alignment, Marathi crop loan entries, new banking letter requests, or privacy and advertising disclosures.
            </p>
          </div>

          {errorMsg && (
            <div
              role="alert"
              className="flex items-center gap-2 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium"
            >
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {submitted ? (
            <div className="p-5 rounded-xl bg-emerald-50 border border-emerald-200 space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-xs font-mono font-semibold text-emerald-800">
                    Inquiry Reference: {ticketId}
                  </p>
                  <h3 className="text-sm font-bold text-emerald-950">
                    Your support inquiry is formatted and ready to dispatch
                  </h3>
                  <p className="text-xs sm:text-sm text-emerald-900 leading-relaxed">
                    To protect your privacy, DocuFill Studio does not store contact form data in a remote database. Click <strong>Send via Email</strong> below to deliver your pre-filled inquiry directly to{' '}
                    <span className="font-semibold">{SUPPORT_EMAIL}</span>, or choose WhatsApp / Copy Message.
                  </p>
                </div>
              </div>

              <div className="bg-white/90 border border-emerald-200/80 rounded-lg p-3.5 text-xs text-slate-700 space-y-1 font-mono whitespace-pre-wrap">
                {buildFormattedBody(ticketId)}
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <a
                  href={mailtoInquiryUrl}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  <span>Send via Email ({SUPPORT_EMAIL})</span>
                </a>
                <a
                  href={whatsappInquiryUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Send via WhatsApp</span>
                </a>
                <button
                  type="button"
                  onClick={handleCopyInquiry}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-lg bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 text-xs font-semibold transition-colors cursor-pointer"
                >
                  {copiedMessage ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Copied Message</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Text</span>
                    </>
                  )}
                </button>
              </div>

              <div className="pt-2 border-t border-emerald-200/70">
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setTicketId('');
                    setName('');
                    setEmail('');
                    setPhone('');
                    setMessage('');
                  }}
                  className="text-xs font-semibold text-emerald-900 hover:text-emerald-700 underline underline-offset-4 cursor-pointer"
                >
                  Submit Another Inquiry
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="contact-name" className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Your Full Name *
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., Rajesh Patil"
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
                <div>
                  <label htmlFor="contact-email" className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Your Email Address *
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="contact-phone" className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Mobile Number (Optional)
                  </label>
                  <input
                    id="contact-phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="10-digit mobile number"
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
                <div>
                  <label htmlFor="contact-topic" className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Inquiry Topic
                  </label>
                  <select
                    id="contact-topic"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  >
                    <option>SBI Peek Karj Magni / Crop Loan Help</option>
                    <option>Bank of Maharashtra / SBI Account Opening Form</option>
                    <option>ATM / Debit Card Form AR-35</option>
                    <option>Bank Application Letters (51 Formats)</option>
                    <option>Report Alignment Issue or Suggest a New Form</option>
                    <option>Privacy Policy, AdSense or Terms Inquiry</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="contact-message" className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Message *
                </label>
                <textarea
                  id="contact-message"
                  rows={4}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Describe your question or which form template you need help with (do not include Aadhaar, PAN, account numbers, or OTPs)."
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
                >
                  <Mail className="w-4 h-4" />
                  <span>Submit &amp; Prepare Direct Message</span>
                </button>
                <p className="text-[11px] text-slate-500">
                  Direct email:{' '}
                  <a href={`mailto:${SUPPORT_EMAIL}`} className="text-emerald-700 font-medium hover:underline">
                    {SUPPORT_EMAIL}
                  </a>
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

/* ============================================================================
 * 4. PRIVACY POLICY & GOOGLE ADSENSE DISCLOSURE PAGE (/privacy-policy)
 * ========================================================================== */
export const PrivacyPolicyPage: React.FC<{ onNavigatePage: (path: string) => void }> = ({
  onNavigatePage,
}) => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      <div className="space-y-3 pb-6 border-b border-slate-200">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              onNavigatePage('/');
            }}
            className="hover:text-emerald-700 transition-colors"
          >
            Home
          </a>
          <span aria-hidden="true">/</span>
          <span className="text-slate-800 font-medium">Privacy Policy</span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-bold text-slate-900 tracking-tight text-balance">
          Privacy Policy &amp; Google AdSense Cookie Disclosure
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Publisher: Thakur Xerox (DocuFill Studio) · Proprietor: Vinodsingh Arjunsingh Thakur · Last Updated: November 2026
        </p>
      </div>

      <article className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 space-y-7 text-sm text-slate-700 leading-relaxed">
        <section className="space-y-2.5">
          <h2 className="text-lg font-bold text-slate-900">
            1. How User Data &amp; Form Inputs Are Handled (100% Local Processing)
          </h2>
          <p>
            At <strong>DocuFill Studio</strong> (operated by <strong>Thakur Xerox</strong>), protecting sensitive personal and financial information is our top priority. Every interactive tool on this site—including SBI पीक कर्ज मागणी (Crop Loan &amp; PMFBY Sowing Declaration), Bank of Maharashtra &amp; SBI Account Opening forms, Mahabank ATM/Debit Card Form AR-35, custom uploaded PDF overlays, and all 51 Bank Application Letters—executes <strong>entirely inside your own web browser</strong>.
          </p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>
              <strong>Zero Server Storage of Form Inputs:</strong> Any information you type into form fields (such as applicant name, address, mobile number, Aadhaar number, PAN number, 7/12 Gat/Survey number, crop area, nominee details, or bank account number) as well as uploaded passport photos and custom PDF files remain strictly in local browser memory while generating your PDF.
            </li>
            <li>
              <strong>No Selling or Sharing of Personal Records:</strong> We do not transmit, upload, log, sell, rent, or store any filled form inputs or generated PDFs on remote servers or databases.
            </li>
            <li>
              <strong>Instant Session Reset:</strong> Closing or refreshing the browser tab—or clicking the &ldquo;Fresh Application&rdquo; button—immediately clears your active form inputs from device memory.
            </li>
            <li>
              <strong>Voluntary Support Communications:</strong> If you choose to email us at{' '}
              <a href={`mailto:${SUPPORT_EMAIL}`} className="text-emerald-700 font-medium underline underline-offset-2">
                {SUPPORT_EMAIL}
              </a>{' '}
              or contact us by phone/WhatsApp, we use your contact details solely to answer your support question and never share them with third-party marketers.
            </li>
          </ul>
        </section>

        <section className="space-y-3 pt-5 border-t border-slate-100">
          <h2 className="text-lg font-bold text-slate-900">
            2. Google AdSense &amp; Third-Party Cookies (DoubleClick DART Cookie)
          </h2>
          <p>
            To keep DocuFill Studio completely free to use for farmers, students, senior citizens, and document operators, this website displays advertisements served by <strong>Google AdSense</strong> (Publisher ID:{' '}
            <code className="font-mono text-xs bg-slate-100 px-1.5 py-0.5 rounded">ca-pub-3166168589952262</code>).
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>Google DoubleClick DART Cookie:</strong> Google, as a third-party vendor, uses cookies—including the <strong>DoubleClick DART cookie</strong>—to serve ads to visitors based on their prior visits to DocuFill Studio and/or other websites across the Internet.
            </li>
            <li>
              <strong>Personalized Advertising Cookies:</strong> Google&apos;s use of advertising cookies enables Google and its partners to serve relevant advertisements to users based on their browsing activity on this site and other sites on the web.
            </li>
            <li>
              <strong>Third-Party Ad Networks &amp; Web Beacons:</strong> Third-party ad servers or ad networks participating in Google AdSense may also use cookies, JavaScript, or web beacons within their advertisements and links. These technologies automatically receive your browser&apos;s IP address to measure ad effectiveness and personalize advertising content. Thakur Xerox has no access to or control over cookies placed by third-party advertisers.
            </li>
            <li>
              <strong>Strict Separation from Form Data:</strong> Advertising scripts never receive, read, or inspect the banking or personal details you type into our local PDF form fields.
            </li>
          </ul>
        </section>

        <section className="space-y-3 pt-5 border-t border-slate-100">
          <h2 className="text-lg font-bold text-slate-900">
            3. How to Opt Out of Personalized Advertising &amp; Manage Cookies
          </h2>
          <p>
            You are always in control of your advertising and cookie preferences. You may opt out of personalized advertising and the DoubleClick DART cookie at any time using any of the following official controls:
          </p>
          <ul className="space-y-2.5 pt-1">
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                <strong>Google Ads Settings (Opt Out of DoubleClick DART Cookie):</strong> Visit{' '}
                <a
                  href="https://adssettings.google.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-emerald-700 underline underline-offset-2 font-medium"
                >
                  <span>Google Ads Settings</span>
                  <ExternalLink className="w-3 h-3" />
                </a>{' '}
                to turn off personalized advertising across Google services and AdSense partner websites.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                <strong>Google Advertising Privacy Policy:</strong> Review how Google uses cookies and data on partner sites at{' '}
                <a
                  href="https://policies.google.com/technologies/ads"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-emerald-700 underline underline-offset-2 font-medium"
                >
                  <span>policies.google.com/technologies/ads</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
                .
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                <strong>Industry-Wide Third-Party Opt-Out Tools:</strong> Opt out of third-party vendor personalized ad cookies via the Digital Advertising Alliance at{' '}
                <a
                  href="https://www.aboutads.info/choices/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-emerald-700 underline underline-offset-2 font-medium"
                >
                  <span>www.aboutads.info/choices</span>
                  <ExternalLink className="w-3 h-3" />
                </a>{' '}
                or the Network Advertising Initiative at{' '}
                <a
                  href="https://optout.networkadvertising.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-emerald-700 underline underline-offset-2 font-medium"
                >
                  <span>optout.networkadvertising.org</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
                .
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                <strong>Browser Cookie Controls:</strong> You can disable or clear third-party cookies directly in Chrome, Firefox, Edge, or Safari settings. Disabling cookies will never block or restrict the local PDF form filler from generating your documents.
              </span>
            </li>
          </ul>
        </section>

        <section className="space-y-2.5 pt-5 border-t border-slate-100">
          <h2 className="text-lg font-bold text-slate-900">
            4. Standard Server Access Logs &amp; Security
          </h2>
          <p>
            Like standard websites, our web hosting infrastructure may automatically record basic non-identifying technical logs (such as anonymized IP address, browser user-agent, requested page URL, referring domain, and timestamp) strictly to maintain uptime, defend against automated abuse, and troubleshoot loading errors. These technical logs are never linked to your local PDF form inputs.
          </p>
        </section>

        <section className="space-y-2.5 pt-5 border-t border-slate-100">
          <h2 className="text-lg font-bold text-slate-900">
            5. Children&apos;s Privacy
          </h2>
          <p>
            DocuFill Studio is a general-audience document preparation utility designed for adult bank account holders, parents or legal guardians preparing minor account forms, and document desk operators. We do not knowingly collect personally identifiable information from children under 13 years of age.
          </p>
        </section>

        <section className="space-y-2.5 pt-5 border-t border-slate-100">
          <h2 className="text-lg font-bold text-slate-900">
            6. Changes to This Policy &amp; Privacy Contact
          </h2>
          <p>
            We may update this Privacy Policy periodically to reflect regulatory updates or site improvements. Any revisions will be posted on this page with an updated effective date. For usage rules and limitations, please also read our{' '}
            <a
              href="/terms"
              onClick={(e) => {
                e.preventDefault();
                onNavigatePage('/terms');
              }}
              className="text-emerald-700 font-semibold underline underline-offset-2"
            >
              Terms of Service &amp; Disclaimer
            </a>
            .
          </p>
          <p>
            If you have any questions about this Privacy Policy, cookie usage, or data handling, please contact <strong>Vinodsingh Arjunsingh Thakur</strong> at Thakur Xerox via email at{' '}
            <a
              href={`mailto:${SUPPORT_EMAIL}`}
              className="text-emerald-700 font-semibold underline underline-offset-2"
            >
              {SUPPORT_EMAIL}
            </a>
            , by phone at{' '}
            <a
              href={`tel:+${SUPPORT_PHONE_RAW}`}
              className="text-emerald-700 font-semibold underline underline-offset-2"
            >
              {SUPPORT_PHONE_DISPLAY}
            </a>
            , or through our{' '}
            <a
              href="/contact"
              onClick={(e) => {
                e.preventDefault();
                onNavigatePage('/contact');
              }}
              className="text-emerald-700 font-semibold underline underline-offset-2"
            >
              Contact Us
            </a>{' '}
            page.
          </p>
        </section>
      </article>
    </div>
  );
};

/* ============================================================================
 * 5. TERMS OF SERVICE & DISCLAIMER PAGE (/terms)
 * ========================================================================== */
export const TermsPage: React.FC<{ onNavigatePage: (path: string) => void }> = ({
  onNavigatePage,
}) => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      <div className="space-y-3 pb-6 border-b border-slate-200">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              onNavigatePage('/');
            }}
            className="hover:text-emerald-700 transition-colors"
          >
            Home
          </a>
          <span aria-hidden="true">/</span>
          <span className="text-slate-800 font-medium">Terms of Service &amp; Disclaimer</span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-bold text-slate-900 tracking-tight text-balance">
          Terms of Service &amp; Platform Disclaimer
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Operator: Thakur Xerox (DocuFill Studio) · Effective Date: November 2026
        </p>
      </div>

      {/* Prominent Non-Affiliation & Tool Limitation Callout */}
      <section className="bg-amber-50 border border-amber-200/90 rounded-xl p-5 sm:p-6 space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-900">
          <Scale className="w-4 h-4 text-amber-700 shrink-0" />
          <span>Important Non-Affiliation Disclaimer</span>
        </div>
        <p className="text-xs sm:text-sm text-amber-950 leading-relaxed">
          DocuFill Studio is an <strong>independent document preparation and PDF formatting utility</strong> operated by Thakur Xerox. We are <strong>not</strong> affiliated with, authorized by, or endorsed by State Bank of India (SBI), Bank of Maharashtra (BOM), the Reserve Bank of India (RBI), NPCI, or any Central or State Government agency (including PMFBY). We do not process bank accounts, sanction crop loans, or act as a banking correspondent.
        </p>
      </section>

      <article className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 space-y-7 text-sm text-slate-700 leading-relaxed">
        <section className="space-y-2.5">
          <h2 className="text-lg font-bold text-slate-900">
            1. Acceptance of Terms
          </h2>
          <p>
            By accessing or using DocuFill Studio (including our PDF Form Filler workspace, Marathi transliteration helper, downloadable templates, and written banking guides), you agree to comply with and be bound by these Terms of Service and Disclaimer. If you do not agree with any part of these terms, please discontinue using the platform.
          </p>
        </section>

        <section className="space-y-2.5 pt-5 border-t border-slate-100">
          <h2 className="text-lg font-bold text-slate-900">
            2. Permitted Use &amp; Usage Rules
          </h2>
          <p>
            You may use DocuFill Studio free of charge for lawful personal, family, agricultural, educational, or legitimate local Xerox/CSC document preparation purposes. When using this platform, you agree <strong>not</strong> to:
          </p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>
              Enter fabricated, falsified, or fraudulent identity numbers, land records (7/12 or 8A), crop declarations, or impersonate another account holder.
            </li>
            <li>
              Attempt to forge signatures—all printed bank forms and affidavits must be physically signed or thumb-impressed by the actual applicant before submission at the branch.
            </li>
            <li>
              Copy, scrape, reverse-engineer, mirror, or redistribute our calibrated coordinate mappings, Marathi transliteration dictionaries, or editorial guides as a competing commercial service without prior written permission from Thakur Xerox.
            </li>
            <li>
              Disrupt website availability, bypass security controls, or upload malicious files into the custom PDF uploader.
            </li>
          </ul>
        </section>

        <section className="space-y-2.5 pt-5 border-t border-slate-100">
          <h2 className="text-lg font-bold text-slate-900">
            3. Tool &amp; Content Limitations
          </h2>
          <p>
            While we take extensive care to keep templates calibrated and editorial checklists accurate, users must understand the inherent limitations of an automated browser-based formatting tool:
          </p>
          <ul className="space-y-2.5 pt-1">
            <li className="flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                <strong>Bank Form Revisions &amp; Branch Discretion:</strong> Public-sector banks periodically revise their CIF booklets, KCC/Crop Loan annexures, ATM forms, and supporting document lists. Final acceptance of any printed form or application letter always rests with the receiving bank branch manager or officer.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                <strong>Automated Marathi Transliteration Accuracy:</strong> Our built-in English-to-Marathi phonetic conversion is a convenience aid. Village names, talukas, surnames, and regional crop spellings can vary—you must always verify the rendered Devanagari text against your official 7/12 extract, Aadhaar card, and bank passbook before printing.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                <strong>Print Scaling &amp; Hardware Variance:</strong> Box and baseline alignment are calibrated for standard A4 paper (210 × 297 mm) printed at <strong>100% / Actual Size</strong>. Enabling &ldquo;Fit to Page&rdquo;, &ldquo;Shrink to Printable Area&rdquo;, or using non-A4 paper trays may cause text offsets.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                <strong>Informational Content Only (No Legal or Financial Advice):</strong> The guides, checklists, and FAQs published on DocuFill Studio are provided strictly for general informational and documentation-assistance purposes. They do not constitute legal, tax, credit, agricultural insurance, or financial advice, and using this tool does not guarantee account approval or crop loan sanction.
              </span>
            </li>
          </ul>
        </section>

        <section className="space-y-2.5 pt-5 border-t border-slate-100">
          <h2 className="text-lg font-bold text-slate-900">
            4. User Responsibility for Final Verification
          </h2>
          <p>
            You are solely responsible for reviewing every single page of the generated PDF—including account numbers, IFSC codes, Aadhaar/PAN digits, mobile numbers, Gat/Survey numbers, sowing area figures, ink color readability, and Marathi spellings—before printing, signing, and submitting documents to any financial institution.
          </p>
        </section>

        <section className="space-y-2.5 pt-5 border-t border-slate-100">
          <h2 className="text-lg font-bold text-slate-900">
            5. Intellectual Property Rights
          </h2>
          <p>
            All original application code, user interface designs, PDF overlay calibration logic, Marathi transliteration helpers, and editorial guide text on DocuFill Studio are the intellectual property of <strong>Thakur Xerox</strong>. Official bank names, trademarks, emblems, and statutory form layouts remain the exclusive property of their respective banks and government authorities.
          </p>
        </section>

        <section className="space-y-2.5 pt-5 border-t border-slate-100">
          <h2 className="text-lg font-bold text-slate-900">
            6. &ldquo;As-Is&rdquo; Service &amp; Limitation of Liability
          </h2>
          <p>
            DocuFill Studio is provided strictly on an <strong>&ldquo;as-is&rdquo;</strong> and <strong>&ldquo;as-available&rdquo;</strong> basis without warranties of any kind, whether express or implied. Because all processing occurs locally in your browser without cloud persistence, closing or refreshing your browser tab will clear unsaved inputs; please download your PDF immediately after completing a form.
          </p>
          <p>
            To the fullest extent permitted by applicable law, Thakur Xerox and proprietor Vinodsingh Arjunsingh Thakur shall not be liable for any direct, indirect, incidental, or consequential damages arising from form rejections, bank processing delays, typographical errors entered by the user, printing misconfigurations, or temporary website downtime.
          </p>
        </section>

        <section className="space-y-2.5 pt-5 border-t border-slate-100">
          <h2 className="text-lg font-bold text-slate-900">
            7. Third-Party Links &amp; Advertisements
          </h2>
          <p>
            This website displays third-party advertisements via Google AdSense and may link to external informational resources (such as Google Ads Settings or official opt-out tools). We do not control or endorse the content, services, or privacy practices of third-party websites. For details on advertising cookies and opt-out options, please review our{' '}
            <a
              href="/privacy-policy"
              onClick={(e) => {
                e.preventDefault();
                onNavigatePage('/privacy-policy');
              }}
              className="text-emerald-700 font-semibold underline underline-offset-2"
            >
              Privacy Policy
            </a>
            .
          </p>
        </section>

        <section className="space-y-2.5 pt-5 border-t border-slate-100">
          <h2 className="text-lg font-bold text-slate-900">
            8. Governing Law &amp; Contact Information
          </h2>
          <p>
            These Terms of Service and Disclaimer are governed by the laws of India, with jurisdiction in Maharashtra, India. We reserve the right to update these terms at any time by posting the revised version on this page.
          </p>
          <p>
            For questions regarding these terms or to report a template issue, please email{' '}
            <a
              href={`mailto:${SUPPORT_EMAIL}`}
              className="text-emerald-700 font-semibold underline underline-offset-2"
            >
              {SUPPORT_EMAIL}
            </a>
            , call{' '}
            <a
              href={`tel:+${SUPPORT_PHONE_RAW}`}
              className="text-emerald-700 font-semibold underline underline-offset-2"
            >
              {SUPPORT_PHONE_DISPLAY}
            </a>
            , or visit our{' '}
            <a
              href="/contact"
              onClick={(e) => {
                e.preventDefault();
                onNavigatePage('/contact');
              }}
              className="text-emerald-700 font-semibold underline underline-offset-2"
            >
              Contact Us
            </a>{' '}
            page.
          </p>
        </section>
      </article>
    </div>
  );
};

/* ============================================================================
 * 5. THIN / ARCHIVE / TAG CONSOLIDATED REDIRECT VIEW (noindex, follow)
 * ========================================================================== */
export const ConsolidatedNoticePage: React.FC<{
  pathname: string;
  onNavigatePage: (path: string) => void;
}> = ({ pathname, onNavigatePage }) => {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
      <div className="bg-white border border-slate-200 rounded-xl p-8 space-y-5">
        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700">
          <BookOpen className="w-4 h-4" />
          <span>Consolidated Resource Hub</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          All Guides & Form Tools Are Consolidated for Easier Access
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed">
          The URL <code className="font-mono text-xs bg-slate-100 px-1.5 py-0.5 rounded">{pathname}</code> is marked <code className="font-mono text-xs bg-slate-100 px-1.5 py-0.5 rounded">noindex</code> because all tag, archive, and individual letter pages have been merged into our comprehensive primary Form Filler and Consolidated Guides.
        </p>
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              onNavigatePage('/');
            }}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Open Form Filler Workspace</span>
          </a>
          <a
            href="/guides"
            onClick={(e) => {
              e.preventDefault();
              onNavigatePage('/guides');
            }}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition-colors"
          >
            <span>Browse Complete Guides</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
};
