import React, { useRef } from 'react';
import { Upload, FileText, Building2, Landmark, CreditCard, Check, FilePlus2, Sprout } from 'lucide-react';
import { FormTemplateType } from '../types/formTypes';

export interface CustomPdfUploaderProps {
  currentPdfName: string;
  isCustomPdf: boolean;
  activeTemplate: FormTemplateType;
  onSelectBom: () => void;
  onSelectSbi: () => void;
  onSelectStatement: () => void;
  onSelectAtm: () => void;
  onSelectPeekKarj: () => void;
  onCustomPdfLoaded: (bytes: Uint8Array, fileName: string) => void;
  onFreshApplication?: () => void;
}

export const CustomPdfUploader: React.FC<CustomPdfUploaderProps> = ({
  currentPdfName,
  isCustomPdf,
  activeTemplate,
  onSelectBom,
  onSelectSbi,
  onSelectStatement,
  onSelectAtm,
  onSelectPeekKarj,
  onCustomPdfLoaded,
  onFreshApplication,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const buffer = await file.arrayBuffer();
      onCustomPdfLoaded(new Uint8Array(buffer), file.name);
    } catch (err) {
      console.error('Error loading custom PDF:', err);
    }
  };

  const templates = [
    {
      id: 'peek_karj' as FormTemplateType,
      title: 'SBI पीक कर्ज मागणी',
      subtitle: 'पीक कर्ज, पिकपेरा, चतुःसीमा',
      tag: '3 Pgs (मराठी)',
      icon: Sprout,
      activeColor: 'border-emerald-600 bg-emerald-50/80 text-emerald-950 ring-2 ring-emerald-500',
      tagColor: 'bg-emerald-100 text-emerald-900 border-emerald-300 font-bold',
      onClick: onSelectPeekKarj,
    },
    {
      id: 'statement' as FormTemplateType,
      title: 'Bank Application Letters',
      subtitle: 'Statement, Passbook, Closure, Minor, Jan Dhan',
      tag: '5 Letters',
      icon: FileText,
      activeColor: 'border-emerald-600 bg-emerald-50/70 text-emerald-950',
      tagColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      onClick: onSelectStatement,
    },
    {
      id: 'atm' as FormTemplateType,
      title: 'BOM ATM / Debit Card',
      subtitle: 'Mahabank Visa Card (Form AR-35)',
      tag: 'AR-35',
      icon: CreditCard,
      activeColor: 'border-sky-600 bg-sky-50/70 text-sky-950',
      tagColor: 'bg-sky-100 text-sky-800 border-sky-300',
      onClick: onSelectAtm,
    },
    {
      id: 'bom' as FormTemplateType,
      title: 'BOM Account Opening',
      subtitle: 'Official 13-Page Form',
      tag: '13 Pgs',
      icon: Building2,
      activeColor: 'border-blue-600 bg-blue-50/70 text-blue-950',
      tagColor: 'bg-blue-100 text-blue-800 border-blue-300',
      onClick: onSelectBom,
    },
    {
      id: 'sbi' as FormTemplateType,
      title: 'SBI Account Opening',
      subtitle: 'State Bank of India (7 Pages)',
      tag: '7 Pgs',
      icon: Landmark,
      activeColor: 'border-indigo-600 bg-indigo-50/70 text-indigo-950',
      tagColor: 'bg-indigo-100 text-indigo-800 border-indigo-300',
      onClick: onSelectSbi,
    },
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-xs space-y-2.5">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
          Select Bank Form Template / Upload PDF
        </span>
        <div className="flex items-center gap-2">
          {onFreshApplication && (
            <button
              type="button"
              onClick={onFreshApplication}
              className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100/90 rounded border border-emerald-300 transition-colors shadow-2xs hover:shadow-xs"
              title="Start a fresh, clean application for this form"
            >
              <FilePlus2 className="w-3.5 h-3.5 text-emerald-700" />
              <span>+ Fresh Application</span>
            </button>
          )}
          <span className="text-[11px] text-slate-400 hidden sm:inline">
            Switch template or upload custom PDF
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-2.5">
        {templates.map((t) => {
          const Icon = t.icon;
          const isActive = activeTemplate === t.id && !isCustomPdf;
          return (
            <button
              key={t.id}
              type="button"
              onClick={t.onClick}
              className={`flex items-center justify-between p-2.5 rounded-lg border text-left transition-all relative ${
                isActive
                  ? `${t.activeColor} shadow-2xs ring-1 ring-emerald-500/20`
                  : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100/80 text-slate-700 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div
                  className={`w-8 h-8 rounded-md flex items-center justify-center shrink-0 ${
                    isActive ? 'bg-white shadow-2xs text-emerald-700' : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold truncate leading-tight">{t.title}</div>
                  <div className="text-[10px] text-slate-500 truncate mt-0.5">{t.subtitle}</div>
                </div>
              </div>
              <div className="flex flex-col items-end shrink-0 ml-2">
                <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-medium border ${t.tagColor}`}>
                  {t.tag}
                </span>
                {isActive && (
                  <span className="text-[9px] font-semibold text-emerald-700 flex items-center gap-0.5 mt-1">
                    <Check className="w-3 h-3" /> Active
                  </span>
                )}
              </div>
            </button>
          );
        })}

        {/* Custom PDF Upload Button */}
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className={`w-full h-full flex items-center justify-between p-2.5 rounded-lg border text-left transition-all ${
              isCustomPdf
                ? 'border-purple-600 bg-purple-50/70 text-purple-950 shadow-2xs ring-1 ring-purple-500/20'
                : 'border-dashed border-slate-300 bg-white hover:bg-slate-50 text-slate-700 hover:border-slate-400'
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div
                className={`w-8 h-8 rounded-md flex items-center justify-center shrink-0 ${
                  isCustomPdf ? 'bg-white shadow-2xs text-purple-700' : 'bg-slate-100 text-slate-500'
                }`}
              >
                <Upload className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold truncate leading-tight">
                  {isCustomPdf ? 'Custom Upload' : 'Upload Other PDF'}
                </div>
                <div className="text-[10px] text-slate-500 truncate mt-0.5">
                  {isCustomPdf ? currentPdfName : 'Any user PDF'}
                </div>
              </div>
            </div>
            <div className="flex flex-col items-end shrink-0 ml-2">
              <span className="text-[10px] px-1.5 py-0.5 rounded font-medium border bg-slate-100 text-slate-600 border-slate-200">
                Custom
              </span>
              {isCustomPdf && (
                <span className="text-[9px] font-semibold text-purple-700 flex items-center gap-0.5 mt-1">
                  <Check className="w-3 h-3" /> Active
                </span>
              )}
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
