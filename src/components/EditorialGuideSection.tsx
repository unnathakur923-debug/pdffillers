import React, { useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  BookOpen,
  ArrowRight,
  FileCheck2,
  ShieldCheck,
  Printer,
  Users,
} from 'lucide-react';
import { FormTemplateType } from '../types/formTypes';
import {
  HOW_IT_WORKS_STEPS,
  TEMPLATE_PROFILES,
  PRACTICAL_USE_CASES,
  LETTER_CATEGORY_GUIDES,
  FAQ_ITEMS,
} from '../data/editorialContent';

interface EditorialGuideSectionProps {
  activeTemplate: FormTemplateType;
  onSelectTemplate: (template: FormTemplateType) => void;
  onNavigatePage: (path: string) => void;
}

export const EditorialGuideSection: React.FC<EditorialGuideSectionProps> = ({
  activeTemplate,
  onSelectTemplate,
  onNavigatePage,
}) => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const currentProfile = TEMPLATE_PROFILES[activeTemplate] || TEMPLATE_PROFILES.peek_karj;

  const handleLaunchTemplate = (templateId: FormTemplateType) => {
    onSelectTemplate(templateId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section
      id="editorial-guide"
      aria-label="How DocuFill Studio Works, Guides, Use Cases and FAQs"
      className="mt-10 pt-10 border-t border-slate-200 space-y-12"
    >
      {/* 1. Active Utility Overview & Publisher Guide */}
      <article className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 pb-5 border-b border-slate-100">
          <div className="space-y-2 max-w-3xl">
            <p className="text-xs font-semibold text-emerald-700 tracking-wide">
              Document Preparation Guide · {currentProfile.pagesLabel}
            </p>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight text-balance">
              {currentProfile.title}
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              {currentProfile.overview}
            </p>
          </div>
          <div className="shrink-0">
            <a
              href="/guides"
              onClick={(e) => {
                e.preventDefault();
                onNavigatePage('/guides');
              }}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors whitespace-nowrap"
            >
              <BookOpen className="w-4 h-4" />
              <span>Read All Consolidated Guides</span>
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <FileCheck2 className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>Required Supporting Documents Checklist</span>
            </h3>
            <p className="text-xs text-slate-500">
              Recommended audience: {currentProfile.audience}. Keep self-attested copies ready alongside originals for branch verification:
            </p>
            <ul className="space-y-2 text-sm text-slate-700 leading-relaxed">
              {currentProfile.requiredDocuments.map((doc, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{doc}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Printer className="w-4 h-4 text-slate-700 shrink-0" />
              <span>Branch Verification & Printing Checklist</span>
            </h3>
            <p className="text-xs text-slate-500">
              Follow these practical submission checks to avoid rework or counter rejections:
            </p>
            <ul className="space-y-2.5 text-sm text-slate-700 leading-relaxed">
              {currentProfile.submissionTips.map((tip, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <span className="font-mono tabular-nums text-xs font-semibold text-emerald-700 mt-0.5 shrink-0">
                    0{idx + 1}.
                  </span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </article>

      {/* 2. Step-by-Step Instructions: How DocuFill Studio Works */}
      <div className="space-y-5">
        <div className="max-w-3xl space-y-1.5">
          <p className="text-xs font-semibold text-slate-500">
            Step-by-Step Instructions · 100% Browser-Based Workflow
          </p>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight text-balance">
            How to Fill, Verify, and Print Banking & Crop Loan Forms Online
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            DocuFill Studio is engineered for citizens, farmers, and document centers who want clean, box-aligned Indian banking forms without handwriting mistakes or uploading sensitive KYC records to remote servers.
          </p>
        </div>

        <ol className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {HOW_IT_WORKS_STEPS.map((step) => (
            <li
              key={step.number}
              className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col justify-between space-y-3"
            >
              <div className="space-y-2">
                <span className="font-mono tabular-nums text-xs font-bold text-emerald-700">
                  Step {step.number}
                </span>
                <h3 className="text-sm font-bold text-slate-900 leading-snug">
                  {step.title}
                </h3>
                <p className="text-xs font-medium text-slate-700 leading-relaxed">
                  {step.summary}
                </p>
                <p className="text-xs text-slate-500 leading-relaxed pt-1">
                  {step.detail}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>

      {/* 3. Practical Real-World Use Cases */}
      <div className="space-y-5">
        <div className="max-w-3xl space-y-1.5">
          <p className="text-xs font-semibold text-slate-500">
            Practical Applications · Real-World Scenarios
          </p>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight text-balance">
            Who Uses DocuFill Studio and What Problems It Solves
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            From seasonal agricultural loan queues in Maharashtra to urgent ATM or UPI dispute filings at urban bank branches, clear documentation saves hours of standing in line.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {PRACTICAL_USE_CASES.map((useCase) => (
            <div
              key={useCase.title}
              className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2.5">
                <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                  <Users className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                  <span>{useCase.persona}</span>
                </div>
                <h3 className="text-base font-bold text-slate-900 leading-snug">
                  {useCase.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  <strong className="text-slate-800 font-semibold">Challenge:</strong> {useCase.scenario}
                </p>
                <p className="text-sm text-slate-600 leading-relaxed">
                  <strong className="text-slate-800 font-semibold">How this tool helps:</strong> {useCase.outcome}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => handleLaunchTemplate(useCase.templateId)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:text-emerald-900 transition-colors cursor-pointer"
                >
                  <span>{useCase.ctaLabel}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Consolidated 51 Bank Application Letters Reference Table */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1.5 max-w-3xl">
            <p className="text-xs font-semibold text-slate-500">
              Consolidated Directory · 51 SBI & Bank of Maharashtra Formats
            </p>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight text-balance">
              Complete Bank Application Letters Reference Guide
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              All 51 formal banking letter templates are grouped into five clear service categories below with typical branch processing windows and required enclosures.
            </p>
          </div>
          <button
            type="button"
            onClick={() => handleLaunchTemplate('statement')}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <span>Open Bank Letters Generator</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 font-semibold">
                <th className="py-3 pr-4">Service Category</th>
                <th className="py-3 px-3 text-right tabular-nums">Formats</th>
                <th className="py-3 px-4">Included Application Letters</th>
                <th className="py-3 px-4">Required Enclosures & Typical Turnaround</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {LETTER_CATEGORY_GUIDES.map((row) => (
                <tr key={row.category} className="align-top hover:bg-slate-50/70 transition-colors">
                  <td className="py-4 pr-4 font-semibold text-slate-900 whitespace-nowrap">
                    {row.category}
                  </td>
                  <td className="py-4 px-3 text-right font-mono tabular-nums font-semibold text-emerald-700">
                    {row.count}
                  </td>
                  <td className="py-4 px-4 leading-relaxed">
                    {row.commonLetters.join(' · ')}
                  </td>
                  <td className="py-4 px-4 space-y-1 leading-relaxed">
                    <p className="text-slate-700">{row.requiredEnclosures}</p>
                    <p className="text-xs text-slate-500">
                      Turnaround: {row.typicalTurnaround}. {row.preparationNote}
                    </p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. Frequently Asked Questions (Interactive Accordion) */}
      <div id="faq-section" className="space-y-5">
        <div className="max-w-3xl space-y-1.5">
          <p className="text-xs font-semibold text-slate-500">
            Frequently Asked Questions · Privacy, Marathi Typing & Printing
          </p>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight text-balance">
            Common Questions About Filling Banking Forms Online
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Clear answers on local browser privacy, branch acceptance, A4 print scaling, and Marathi transliteration.
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl divide-y divide-slate-200">
          {FAQ_ITEMS.map((item, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div key={item.question} className="px-5 sm:px-6">
                <button
                  type="button"
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  aria-expanded={isOpen}
                  className="w-full py-4 flex items-center justify-between gap-4 text-left cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 rounded"
                >
                  <div className="space-y-0.5">
                    <span className="text-xs text-slate-500 font-medium block">
                      {item.category}
                    </span>
                    <span className="text-sm sm:text-base font-semibold text-slate-900 block">
                      {item.question}
                    </span>
                  </div>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-slate-500 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="pb-5 pr-6 text-sm text-slate-600 leading-relaxed max-w-3xl">
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 6. Trust, Privacy & Independent Utility Notice */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
        <div className="flex items-start gap-3.5 max-w-3xl">
          <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-slate-900">
              Independent Document Preparation Utility — 100% Local Processing
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              DocuFill Studio is published by Thakur Xerox (Proprietor: Vinodsingh Arjunsingh Thakur) to help citizens prepare legible banking and crop loan paperwork. We are not affiliated with State Bank of India, Bank of Maharashtra, or any government agency. All entered form data stays strictly inside your browser.
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-4 text-xs font-semibold shrink-0">
          <a
            href="/about"
            onClick={(e) => {
              e.preventDefault();
              onNavigatePage('/about');
            }}
            className="text-emerald-700 hover:text-emerald-900 underline underline-offset-4 whitespace-nowrap"
          >
            About Us
          </a>
          <a
            href="/contact"
            onClick={(e) => {
              e.preventDefault();
              onNavigatePage('/contact');
            }}
            className="text-emerald-700 hover:text-emerald-900 underline underline-offset-4 whitespace-nowrap"
          >
            Contact Help Desk
          </a>
          <a
            href="/privacy-policy"
            onClick={(e) => {
              e.preventDefault();
              onNavigatePage('/privacy-policy');
            }}
            className="text-emerald-700 hover:text-emerald-900 underline underline-offset-4 whitespace-nowrap"
          >
            Privacy Policy
          </a>
        </div>
      </div>
    </section>
  );
};
