import React from 'react';
import { SbiFormData } from '../../types/formTypes';
import { Building2, Calendar, Hash, FileText } from 'lucide-react';

interface Props {
  formData: SbiFormData;
  onChange: <K extends keyof SbiFormData>(key: K, value: SbiFormData[K]) => void;
}

export const BranchSection: React.FC<Props> = ({ formData, onChange }) => {
  return (
    <div className="space-y-4">
      <div className="border-b border-slate-200 pb-2">
        <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
          <Building2 className="w-4 h-4 text-indigo-600" />
          Branch & Application Header (Page 1)
        </h3>
        <p className="text-xs text-slate-500 mt-0.5">
          Enter branch details, application date, and customer reference IDs.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Application Date */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center justify-between">
            <span>Application Date (DDMMYYYY) *</span>
            <span className="font-mono text-[10px] text-slate-400">8 Digits</span>
          </label>
          <div className="relative">
            <input
              type="text"
              maxLength={8}
              value={formData.applicationDate}
              onChange={(e) => onChange('applicationDate', e.target.value.replace(/\D/g, ''))}
              placeholder="e.g. 22102026"
              className="w-full px-3 py-1.5 text-xs font-mono tracking-wider bg-white border border-slate-300 rounded focus:border-indigo-500 focus:outline-hidden"
            />
            <Calendar className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
          </div>
          <span className="text-[10px] text-slate-400 mt-0.5 block">
            Overlays into top right Date box: [D][D][M][M][Y][Y][Y][Y]
          </span>
        </div>

        {/* Branch Code */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center justify-between">
            <span>Branch Code *</span>
            <span className="font-mono text-[10px] text-slate-400">5 Digits</span>
          </label>
          <input
            type="text"
            maxLength={5}
            value={formData.branchCode}
            onChange={(e) => onChange('branchCode', e.target.value.toUpperCase())}
            placeholder="e.g. 00214"
            className="w-full px-3 py-1.5 text-xs font-mono tracking-wider bg-white border border-slate-300 rounded focus:border-indigo-500 focus:outline-hidden"
          />
        </div>

        {/* Branch Name */}
        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center justify-between">
            <span>Branch Name *</span>
            <span className="font-mono text-[10px] text-slate-400">17 Boxes (One alphabet per box)</span>
          </label>
          <input
            type="text"
            maxLength={17}
            value={formData.branchName}
            onChange={(e) => onChange('branchName', e.target.value.toUpperCase())}
            placeholder="e.g. NARIMAN POINT"
            className="w-full px-3 py-1.5 text-xs font-mono uppercase tracking-wider bg-white border border-slate-300 rounded focus:border-indigo-500 focus:outline-hidden font-semibold"
          />
          <span className="text-[10px] text-slate-400 mt-0.5 block">
            Each alphabet is fixed into its individual square box cell on Page 1
          </span>
        </div>

        {/* Application Type */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Application Type
          </label>
          <div className="flex items-center gap-3 mt-1.5">
            <label className="flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer">
              <input
                type="radio"
                name="applicationType"
                checked={formData.applicationType === 'new'}
                onChange={() => onChange('applicationType', 'new')}
                className="text-indigo-600 focus:ring-0"
              />
              New Application
            </label>
            <label className="flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer">
              <input
                type="radio"
                name="applicationType"
                checked={formData.applicationType === 'update'}
                onChange={() => onChange('applicationType', 'update')}
                className="text-indigo-600 focus:ring-0"
              />
              Update CIF
            </label>
          </div>
        </div>

        {/* Account Type Category */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Account Type
          </label>
          <select
            value={formData.accountType}
            onChange={(e) => onChange('accountType', e.target.value as any)}
            className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded focus:border-indigo-500 focus:outline-hidden"
          >
            <option value="normal">Normal Account</option>
            <option value="small">Small Account</option>
            <option value="minor">Minor Account</option>
            <option value="staff">Staff Account</option>
          </select>
        </div>

        {formData.accountType === 'staff' && (
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              PF Number (Staff Only)
            </label>
            <input
              type="text"
              maxLength={10}
              value={formData.pfNumber}
              onChange={(e) => onChange('pfNumber', e.target.value)}
              placeholder="e.g. 49102"
              className="w-full px-3 py-1.5 text-xs font-mono tracking-wider bg-white border border-slate-300 rounded focus:border-indigo-500 focus:outline-hidden"
            />
          </div>
        )}

        {/* Customer ID & Account No (If existing or pre-allocated) */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center justify-between">
            <span>Customer ID (CIF)</span>
            <span className="text-[10px] text-slate-400">Optional</span>
          </label>
          <input
            type="text"
            maxLength={12}
            value={formData.customerId}
            onChange={(e) => onChange('customerId', e.target.value.replace(/\D/g, ''))}
            placeholder="e.g. 874592014"
            className="w-full px-3 py-1.5 text-xs font-mono tracking-wider bg-white border border-slate-300 rounded focus:border-indigo-500 focus:outline-hidden"
          />
        </div>

        {/* Account Number */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center justify-between">
            <span>Account Number</span>
            <span className="text-[10px] text-slate-400">Optional</span>
          </label>
          <input
            type="text"
            maxLength={14}
            value={formData.accountNumber}
            onChange={(e) => onChange('accountNumber', e.target.value.replace(/\D/g, ''))}
            placeholder="e.g. 39482015849"
            className="w-full px-3 py-1.5 text-xs font-mono tracking-wider bg-white border border-slate-300 rounded focus:border-indigo-500 focus:outline-hidden"
          />
        </div>

        {/* CKYC Number */}
        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center justify-between">
            <span>CKYC Number (Central KYC Registry)</span>
            <span className="text-[10px] text-slate-400">14 Digits (If available)</span>
          </label>
          <input
            type="text"
            maxLength={14}
            value={formData.ckycNumber}
            onChange={(e) => onChange('ckycNumber', e.target.value.replace(/\D/g, ''))}
            placeholder="e.g. 50029481739281"
            className="w-full px-3 py-1.5 text-xs font-mono tracking-wider bg-white border border-slate-300 rounded focus:border-indigo-500 focus:outline-hidden"
          />
        </div>
      </div>
    </div>
  );
};
