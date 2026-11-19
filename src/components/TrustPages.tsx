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
          About Thakur Xerox & DocuFill Studio
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          Practical, browser-first banking and agricultural form preparation built from real-world document counter experience in Maharashtra.
        </p>
      </div>

      <article className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 space-y-6 text-sm sm:text-base text-slate-700 leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900">
            Our Mission
          </h2>
          <p>
            <strong>DocuFill Studio</strong> was created by <strong>Thakur Xerox</strong> (Proprietor: <strong>Vinodsingh Arjunsingh Thakur</strong>) to solve a daily frustration faced by citizens, farmers, students, and senior citizens visiting public-sector bank branches: rejected or delayed applications caused by cramped handwriting, misaligned character boxes, missing enclosures, or incomplete Marathi crop loan declarations.
          </p>
          <p>
            Every day at local Xerox and citizen document centers across Maharashtra, applicants spend hours manually rewriting 7-page State Bank of India CIF forms, 13-page Bank of Maharashtra account opening booklets, ATM card requests, and 3-page SBI पीक कर्ज मागणी (Crop Loan, PMFBY Sowing Declaration & Four-Boundary Affidavit) files. DocuFill Studio brings the accuracy of structured digital form preparation directly to any mobile phone or desktop browser—completely free to use and without storing personal records online.
          </p>
        </section>

        <section className="space-y-3 pt-4 border-t border-slate-100">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900">
            How We Ensure Accuracy & Privacy
          </h2>
          <ul className="space-y-2.5 text-sm text-slate-700">
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-1" />
              <span>
                <strong>Measured Coordinate Calibration:</strong> Every form template is calibrated against actual A4 page geometry so letters center inside optical CIF boxes and Marathi text rests strictly above printed dashed ruling lines without clipping.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-1" />
              <span>
                <strong>100% Client-Side PDF Generation:</strong> All PDF creation, passport photograph placement, and Marathi transliteration occur inside your own device memory. We do not operate a user database and never collect, log, or transmit Aadhaar, PAN, or bank account numbers.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-1" />
              <span>
                <strong>Bilingual Accessibility:</strong> Built-in phonetic English-to-Marathi transliteration allows anyone comfortable with a standard English keyboard to generate crisp, branch-ready Marathi Devanagari agricultural loan applications.
              </span>
            </li>
          </ul>
        </section>

        <section className="space-y-3 pt-4 border-t border-slate-100">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900">
            Independent Utility & Non-Affiliation Notice
          </h2>
          <p className="text-sm text-slate-600">
            Thakur Xerox and DocuFill Studio operate as an independent document assistance service and web utility. We are <strong>not</strong> affiliated with, endorsed by, or officially connected to State Bank of India (SBI), Bank of Maharashtra (BOM), the Reserve Bank of India (RBI), or the Pradhan Mantri Fasal Bima Yojana (PMFBY) portal. All trademarks, bank names, and official form layouts belong to their respective institutions and are referenced solely to help customers prepare clean printed paperwork for submission at authorized bank branches.
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
            <span>Contact Thakur Xerox</span>
          </a>
        </div>
      </article>
    </div>
  );
};

/* ============================================================================
 * 3. CONTACT US PAGE (/contact)
 * ========================================================================== */
export const ContactPage: React.FC<{ onNavigatePage: (path: string) => void }> = ({
  onNavigatePage,
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [topic, setTopic] = useState('SBI Peek Karj Magni / Crop Loan Help');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) {
      setErrorMsg('Please enter your name and message so we can assist you.');
      return;
    }
    setErrorMsg(null);
    setSubmitted(true);
  };

  const whatsappInquiryUrl = `https://wa.me/919970996060?text=${encodeURIComponent(
    `Hello Vinodsingh Thakur,\nName: ${name || 'Visitor'}\nPhone: ${phone || 'Not provided'}\nTopic: ${topic}\nMessage: ${message || 'I need assistance with DocuFill Studio banking forms.'}`
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
          Contact Thakur Xerox & DocuFill Studio Support
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-3xl">
          Have a question about aligning a specific banking form, preparing a Marathi crop loan file, reporting a template correction, or requesting printing assistance? Reach our help desk directly.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Direct Contact Information */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-6 space-y-5">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-emerald-700">Proprietor & Help Desk</p>
            <h2 className="text-lg font-bold text-slate-900">
              Vinodsingh Arjunsingh Thakur
            </h2>
            <p className="text-xs text-slate-500">
              Thakur Xerox — Digital Printing, Xerox & Banking Documentation Center
            </p>
          </div>

          <dl className="space-y-4 text-sm text-slate-700 pt-2 border-t border-slate-100">
            <div className="flex items-start gap-3">
              <Phone className="w-4 h-4 text-emerald-700 shrink-0 mt-1" />
              <div>
                <dt className="text-xs font-semibold text-slate-500">Direct Phone</dt>
                <dd className="font-mono tabular-nums font-semibold text-slate-900">
                  <a href="tel:+919970996060" className="hover:text-emerald-700">
                    +91 9970996060
                  </a>
                </dd>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MessageCircle className="w-4 h-4 text-emerald-700 shrink-0 mt-1" />
              <div>
                <dt className="text-xs font-semibold text-slate-500">WhatsApp Document Desk</dt>
                <dd>
                  <a
                    href="https://wa.me/919970996060"
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
              <Clock className="w-4 h-4 text-emerald-700 shrink-0 mt-1" />
              <div>
                <dt className="text-xs font-semibold text-slate-500">Assistance Hours</dt>
                <dd className="text-slate-800">Monday – Saturday · 9:30 AM – 8:00 PM IST</dd>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-emerald-700 shrink-0 mt-1" />
              <div>
                <dt className="text-xs font-semibold text-slate-500">Service Region</dt>
                <dd className="text-slate-800">Maharashtra, India (Online worldwide browser access)</dd>
              </div>
            </div>
          </dl>

          <div className="pt-4 border-t border-slate-100 space-y-2 text-xs text-slate-600 leading-relaxed">
            <p className="font-semibold text-slate-800">Security Reminder:</p>
            <p>
              Never send OTPs, ATM PINs, NetBanking passwords, or confidential CVV numbers by phone, WhatsApp, or contact forms. For account balance, loan sanction status, or disputed funds, always contact your official SBI or Bank of Maharashtra home branch directly.
            </p>
          </div>
        </div>

        {/* Interactive Support & Feedback Form */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-6 space-y-5">
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-slate-900">
              Send a Question or Template Feedback
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Report a PDF alignment issue, suggest a new Marathi or English banking form, or ask about printing instructions.
            </p>
          </div>

          {errorMsg && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {submitted ? (
            <div className="p-5 rounded-xl bg-emerald-50 border border-emerald-200 space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-emerald-950">
                    Your inquiry is ready to send
                  </h3>
                  <p className="text-xs sm:text-sm text-emerald-900 leading-relaxed">
                    Because DocuFill Studio operates without storing personal form submissions on remote servers, choose WhatsApp or phone below to transmit your prepared message directly to Vinodsingh Thakur.
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <a
                  href={whatsappInquiryUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Send via WhatsApp</span>
                </a>
                <a
                  href="tel:+919970996060"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white hover:bg-slate-50 text-slate-900 border border-slate-300 text-xs font-semibold transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  <span>Call 9970996060</span>
                </a>
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setName('');
                    setPhone('');
                    setMessage('');
                  }}
                  className="text-xs font-semibold text-slate-600 hover:text-slate-900 underline underline-offset-4 cursor-pointer"
                >
                  Write Another Inquiry
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
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
                  <option>Privacy or General Inquiry</option>
                </select>
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
                  placeholder="Describe your question or which form template you need help with (do not include Aadhaar, PAN, or OTPs)."
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <button
                type="submit"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
              >
                <Mail className="w-4 h-4" />
                <span>Prepare Direct Inquiry</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

/* ============================================================================
 * 4. PRIVACY POLICY & ADSENSE DISCLOSURE PAGE (/privacy-policy)
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
          Privacy Policy, Cookie Notice & Terms of Use
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Publisher: Thakur Xerox (DocuFill Studio) · Effective Date: November 2026
        </p>
      </div>

      <article className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 space-y-6 text-sm text-slate-700 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900">
            1. 100% Client-Side Form & PDF Processing (Zero Personal Data Collection)
          </h2>
          <p>
            Your privacy is fundamental to DocuFill Studio. Every interactive banking form—including SBI पीक कर्ज मागणी (Crop Loan & PMFBY Declaration), Bank of Maharashtra and SBI Account Opening forms, Debit Card Form AR-35, custom uploaded PDFs, and all 51 Bank Application Letters—is processed strictly inside your local web browser.
          </p>
          <p>
            When you type personal details (such as your name, address, mobile number, Aadhaar number, PAN number, land Gat/Survey number, or bank account number) or select a passport photograph, that data stays exclusively in your browser memory to generate the downloadable PDF. <strong>We do not transmit, upload, log, sell, or store any form inputs, photos, or generated PDFs on any server.</strong> Closing or refreshing the browser tab clears your session data immediately.
          </p>
        </section>

        <section className="space-y-2 pt-4 border-t border-slate-100">
          <h2 className="text-lg font-bold text-slate-900">
            2. Google AdSense & Third-Party Advertising Cookies
          </h2>
          <p>
            To keep DocuFill Studio free for citizens, farmers, and students, this website uses <strong>Google AdSense</strong> (Publisher ID: <code className="font-mono text-xs bg-slate-100 px-1.5 py-0.5 rounded">ca-pub-3166168589952262</code>) to display advertisements.
          </p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>
              Third-party vendors, including Google, use cookies to serve ads based on a user&apos;s prior visits to this website or other websites on the internet.
            </li>
            <li>
              Google&apos;s use of advertising cookies enables it and its partners to serve ads to users based on their visit to this site and/or other sites on the internet.
            </li>
            <li>
              Users may opt out of personalized advertising at any time by visiting{' '}
              <a
                href="https://www.google.com/settings/ads"
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-700 underline underline-offset-2 font-medium"
              >
                Google Ads Settings
              </a>
              . Alternatively, you may opt out of a third-party vendor&apos;s use of cookies for personalized advertising by visiting{' '}
              <a
                href="https://www.aboutads.info/choices/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-700 underline underline-offset-2 font-medium"
              >
                www.aboutads.info
              </a>
              .
            </li>
          </ul>
        </section>

        <section className="space-y-2 pt-4 border-t border-slate-100">
          <h2 className="text-lg font-bold text-slate-900">
            3. Standard Technical Logs & Browser Storage
          </h2>
          <p>
            Like standard websites, our web hosting infrastructure may automatically record basic non-identifying technical logs (such as anonymized IP address, browser type, requested URL path, and timestamp) strictly to maintain uptime, prevent abuse, and diagnose loading errors. We do not link technical access logs to any personal banking form inputs.
          </p>
        </section>

        <section className="space-y-2 pt-4 border-t border-slate-100">
          <h2 className="text-lg font-bold text-slate-900">
            4. Terms of Use & Non-Affiliation Disclaimer
          </h2>
          <p>
            DocuFill Studio is an independent formatting and document preparation utility provided on an &ldquo;as-is&rdquo; basis. While we regularly verify coordinate alignment and letter formats against branch standards, bank branches may update their forms or supporting document policies at any time. Users are solely responsible for reviewing their printed PDF carefully, verifying all numbers and spellings before signing physically, and confirming branch-specific requirements with their bank officer.
          </p>
          <p>
            We are not an official portal of State Bank of India, Bank of Maharashtra, or any government department, and we do not provide banking, lending, legal, or financial advisory services.
          </p>
        </section>

        <section className="space-y-2 pt-4 border-t border-slate-100">
          <h2 className="text-lg font-bold text-slate-900">
            5. Children&apos;s Privacy
          </h2>
          <p>
            This website is a general-audience utility intended for adult bank account holders, parents/guardians preparing minor account forms, and document desk operators. We do not knowingly collect personally identifiable information from children under 13 years of age.
          </p>
        </section>

        <section className="space-y-2 pt-4 border-t border-slate-100">
          <h2 className="text-lg font-bold text-slate-900">
            6. Contact for Privacy Questions
          </h2>
          <p>
            If you have any questions about this Privacy Policy or our advertising disclosures, please contact <strong>Vinodsingh Arjunsingh Thakur</strong> at Thakur Xerox via phone at{' '}
            <a href="tel:+919970996060" className="text-emerald-700 font-semibold underline underline-offset-2">
              +91 9970996060
            </a>{' '}
            or visit our{' '}
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
