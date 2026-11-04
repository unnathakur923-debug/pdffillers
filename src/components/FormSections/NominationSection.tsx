import React from 'react';
import { SbiFormData } from '../../types/formTypes';
import { ShieldCheck, HeartHandshake, UserPlus } from 'lucide-react';

interface Props {
  formData: SbiFormData;
  onChange: <K extends keyof SbiFormData>(key: K, value: SbiFormData[K]) => void;
}

export const NominationSection: React.FC<Props> = ({ formData, onChange }) => {
  return (
    <div className="space-y-5">
      <div className="border-b border-slate-200 pb-2">
        <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-indigo-600" />
          Section F: Nomination Form (Page 4)
        </h3>
        <p className="text-xs text-slate-500 mt-0.5">
          Form DA-1 under Banking Regulation Act, 1949 for smooth settlement of deposits.
        </p>
      </div>

      {/* Nomination Opt-in/Opt-out */}
      <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 text-xs font-semibold text-slate-800 cursor-pointer">
            <input
              type="radio"
              name="nominationOpted"
              checked={formData.nominationOpted}
              onChange={() => onChange('nominationOpted', true)}
              className="text-indigo-600"
            />
            Yes, I wish to nominate a person (Recommended)
          </label>
          <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer">
            <input
              type="radio"
              name="nominationOpted"
              checked={!formData.nominationOpted}
              onChange={() => onChange('nominationOpted', false)}
              className="text-indigo-600"
            />
            I do not want to nominate any person
          </label>
        </div>
      </div>

      {formData.nominationOpted && (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Name of the Depositor *
            </label>
            <input
              type="text"
              value={formData.depositorName || `${formData.firstName} ${formData.lastName}`.trim()}
              onChange={(e) => onChange('depositorName', e.target.value.toUpperCase())}
              placeholder="RAJESH KUMAR SHARMA"
              className="w-full px-2.5 py-1.5 text-xs font-mono uppercase bg-white border border-slate-300 rounded focus:border-indigo-500 focus:outline-hidden"
            />
          </div>

          <div className="p-3 bg-white border border-slate-200 rounded-lg space-y-3 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <HeartHandshake className="w-3.5 h-3.5 text-indigo-600" />
                First Nominee Particulars
              </span>
              <span className="text-[10px] text-slate-400">Section F (i)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  (B) Name of Nominee *
                </label>
                <input
                  type="text"
                  value={formData.nomineeName}
                  onChange={(e) => onChange('nomineeName', e.target.value.toUpperCase())}
                  placeholder="e.g. SNEHA RAJESH SHARMA"
                  className="w-full px-2.5 py-1.5 text-xs font-mono uppercase bg-white border border-slate-300 rounded focus:border-indigo-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  (E) Relationship with Depositor *
                </label>
                <input
                  type="text"
                  value={formData.nomineeRelationship}
                  onChange={(e) => onChange('nomineeRelationship', e.target.value.toUpperCase())}
                  placeholder="e.g. SPOUSE / SON / MOTHER"
                  className="w-full px-2.5 py-1.5 text-xs font-mono uppercase bg-white border border-slate-300 rounded focus:border-indigo-500 focus:outline-hidden"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  (C) Full Address of Nominee *
                </label>
                <input
                  type="text"
                  value={formData.nomineeAddress}
                  onChange={(e) => onChange('nomineeAddress', e.target.value.toUpperCase())}
                  placeholder="e.g. FLAT 402, SEA GREEN APTS, MARINE DRIVE, MUMBAI"
                  className="w-full px-2.5 py-1.5 text-xs font-mono uppercase bg-white border border-slate-300 rounded focus:border-indigo-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  (D) Nominee Mobile Number
                </label>
                <input
                  type="text"
                  maxLength={10}
                  value={formData.nomineeMobile}
                  onChange={(e) => onChange('nomineeMobile', e.target.value.replace(/\D/g, ''))}
                  placeholder="e.g. 9820145679"
                  className="w-full px-2.5 py-1.5 text-xs font-mono bg-white border border-slate-300 rounded focus:border-indigo-500 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    (F) Age (Years) *
                  </label>
                  <input
                    type="text"
                    maxLength={3}
                    value={formData.nomineeAge}
                    onChange={(e) => onChange('nomineeAge', e.target.value.replace(/\D/g, ''))}
                    placeholder="34"
                    className="w-full px-2.5 py-1.5 text-xs font-mono bg-white border border-slate-300 rounded focus:border-indigo-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    (H) Share (%) *
                  </label>
                  <input
                    type="text"
                    value={formData.nomineeProportion}
                    onChange={(e) => onChange('nomineeProportion', e.target.value)}
                    placeholder="100%"
                    className="w-full px-2.5 py-1.5 text-xs font-mono bg-white border border-slate-300 rounded focus:border-indigo-500 focus:outline-hidden font-semibold"
                  />
                </div>
              </div>
            </div>

            {/* Minor Guardian Toggle */}
            <div className="pt-2 border-t border-slate-100">
              <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.nomineeIsMinor}
                  onChange={(e) => onChange('nomineeIsMinor', e.target.checked)}
                  className="rounded text-indigo-600"
                />
                Is nominee a minor (under 18 years)?
              </label>

              {formData.nomineeIsMinor && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 mt-2 bg-slate-50 p-2.5 rounded border border-slate-200">
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-600 mb-0.5">
                      Name of Guardian
                    </label>
                    <input
                      type="text"
                      value={formData.guardianName}
                      onChange={(e) => onChange('guardianName', e.target.value.toUpperCase())}
                      placeholder="GUARDIAN NAME"
                      className="w-full px-2 py-1 text-xs font-mono uppercase bg-white border border-slate-300 rounded"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-semibold text-slate-600 mb-0.5">
                      Relationship with Nominee
                    </label>
                    <input
                      type="text"
                      value={formData.guardianRelationship}
                      onChange={(e) => onChange('guardianRelationship', e.target.value.toUpperCase())}
                      placeholder="e.g. FATHER / MOTHER"
                      className="w-full px-2 py-1 text-xs font-mono uppercase bg-white border border-slate-300 rounded"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Terms and Conditions Confirmation */}
      <div className="p-3 bg-slate-100 border border-slate-200 rounded-lg space-y-1.5 text-xs text-slate-600">
        <span className="font-bold text-slate-700 block">
          Customer Undertaking & Attestation (Page 5)
        </span>
        <p className="leading-relaxed text-[11px]">
          By proceeding, the applicant's signature will be automatically stamped across all mandatory bank attestation blocks:
          Page 2 Section G (Self-declaration), Page 4 Section F & G (Nomination undertaking), and Page 5 (Rules & Conditions acceptance).
        </p>
      </div>
    </div>
  );
};
