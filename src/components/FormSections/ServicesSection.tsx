import React from 'react';
import { SbiFormData } from '../../types/formTypes';
import { CreditCard, Smartphone, CheckSquare, Layers } from 'lucide-react';

interface Props {
  formData: SbiFormData;
  onChange: <K extends keyof SbiFormData>(key: K, value: SbiFormData[K]) => void;
}

export const ServicesSection: React.FC<Props> = ({ formData, onChange }) => {
  return (
    <div className="space-y-5">
      <div className="border-b border-slate-200 pb-2">
        <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
          <Layers className="w-4 h-4 text-indigo-600" />
          Part II: Account Type & Banking Services (Page 3)
        </h3>
        <p className="text-xs text-slate-500 mt-0.5">
          Select account class, debit card preferences, digital banking, and alerts.
        </p>
      </div>

      {/* Account Category & Mode */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Account Category *
          </label>
          <select
            value={formData.accountCategory}
            onChange={(e) => onChange('accountCategory', e.target.value as any)}
            className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded focus:border-indigo-500 focus:outline-hidden font-medium"
          >
            <option value="savings">Savings Bank Account</option>
            <option value="savings_plus">Savings Plus Account (Auto Sweep)</option>
            <option value="current">Current Account (Individual)</option>
            <option value="bsbda">BSBDA Account</option>
            <option value="fixed_deposit">Fixed Deposit / MOD / RD</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Mode of Operation *
          </label>
          <select
            value={formData.modeOfOperation}
            onChange={(e) => onChange('modeOfOperation', e.target.value as any)}
            className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded focus:border-indigo-500 focus:outline-hidden font-medium"
          >
            <option value="self">Self (Single Operator)</option>
            <option value="either_or_survivor">Either or Survivor</option>
            <option value="former_or_survivor">Former or Survivor</option>
            <option value="jointly">Jointly Operated</option>
          </select>
        </div>
      </div>

      {/* ATM-CUM-DEBIT Card */}
      <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
            <CreditCard className="w-3.5 h-3.5 text-indigo-600" />
            1. ATM-cum-Debit Card Facility
          </span>
          <label className="flex items-center gap-1.5 text-xs font-medium cursor-pointer">
            <input
              type="checkbox"
              checked={formData.atmCardRequired}
              onChange={(e) => onChange('atmCardRequired', e.target.checked)}
              className="rounded text-indigo-600"
            />
            Issue Debit Card
          </label>
        </div>

        {formData.atmCardRequired && (
          <div className="space-y-3 pt-1">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div className="sm:col-span-2">
                <label className="block text-[11px] font-semibold text-slate-600 mb-1 flex items-center justify-between">
                  <span>Name as would appear on the card *</span>
                  <span className="font-mono text-[10px] text-slate-400">19 Boxes (One alphabet per box)</span>
                </label>
                <input
                  type="text"
                  maxLength={19}
                  value={formData.nameOnCard}
                  onChange={(e) => onChange('nameOnCard', e.target.value.toUpperCase())}
                  placeholder="e.g. RAJESH K SHARMA"
                  className="w-full px-2.5 py-1.5 text-xs font-mono uppercase tracking-wider bg-white border border-slate-300 rounded focus:border-indigo-500 focus:outline-hidden font-semibold"
                />
                <span className="text-[10px] text-slate-400 mt-0.5 block">
                  Fixed into the 19 individual square boxes on Page 3 (ATM-CUM-DEBIT CARD row)
                </span>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Card Format
                </label>
                <div className="flex items-center gap-3 mt-1.5">
                  <label className="flex items-center gap-1 text-xs cursor-pointer">
                    <input
                      type="radio"
                      name="cardFormat"
                      checked={formData.cardFormat === 'physical'}
                      onChange={() => onChange('cardFormat', 'physical')}
                      className="text-indigo-600"
                    />
                    Physical
                  </label>
                  <label className="flex items-center gap-1 text-xs cursor-pointer">
                    <input
                      type="radio"
                      name="cardFormat"
                      checked={formData.cardFormat === 'virtual'}
                      onChange={() => onChange('cardFormat', 'virtual')}
                      className="text-indigo-600"
                    />
                    Virtual
                  </label>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Card Scheme Network
              </label>
              <div className="flex items-center gap-4">
                {(['rupay', 'visa', 'master'] as const).map((scheme) => (
                  <label key={scheme} className="flex items-center gap-1.5 text-xs uppercase cursor-pointer">
                    <input
                      type="radio"
                      name="cardType"
                      checked={formData.cardType === scheme}
                      onChange={() => onChange('cardType', scheme)}
                      className="text-indigo-600"
                    />
                    {scheme === 'master' ? 'Mastercard' : scheme}
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Digital Banking & Alerts Checklist */}
      <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-2.5">
        <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
          <Smartphone className="w-3.5 h-3.5 text-indigo-600" />
          Banking Channels & Value Added Services
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
          {[
            { key: 'internetBankingRequired', label: '3. Internet Banking (INB / YONO Web)' },
            { key: 'transactionRightsRequired', label: 'Transaction Rights for Internet Banking' },
            { key: 'mobileBankingRequired', label: '6. Mobile Banking (YONO App)' },
            { key: 'smsAlertsRequired', label: '4. SMS Alerts on Registered Mobile' },
            { key: 'chequeBookRequired', label: '2. Cheque Book Required (25 Leaves)' },
            { key: 'passbookRequired', label: '7. Passbook Required' },
            { key: 'eStatementRequired', label: '8. Monthly e-Statement via Email' },
            { key: 'whatsappAlertsRequired', label: '9. WhatsApp Banking Alerts' },
            { key: 'emailAlertsRequired', label: '10. Email Transaction Alerts' },
          ].map((item) => (
            <label
              key={item.key}
              className="flex items-center gap-2 p-1.5 bg-white border border-slate-200 rounded text-xs text-slate-700 cursor-pointer hover:bg-slate-100 transition-colors"
            >
              <input
                type="checkbox"
                checked={Boolean(formData[item.key as keyof SbiFormData])}
                onChange={(e) => onChange(item.key as keyof SbiFormData, e.target.checked as any)}
                className="rounded text-indigo-600"
              />
              <span className="truncate">{item.label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};
