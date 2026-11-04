import React, { useState } from 'react';
import {
  CreditCard,
  Building2,
  Calendar,
  User,
  MapPin,
  Phone,
  Mail,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Info,
} from 'lucide-react';
import { SbiFormData } from '../../types/formTypes';

export interface AtmCardSectionProps {
  formData: SbiFormData;
  onChange: <K extends keyof SbiFormData>(key: K, value: SbiFormData[K]) => void;
}

const BOM_BRANCHES = [
  { name: 'Purna Branch, Purna', code: '0124' },
  { name: 'Shivajinagar (H.O.) Branch, Pune', code: '0001' },
  { name: 'Fort Branch, Mumbai', code: '0002' },
  { name: 'Sitabuldi Branch, Nagpur', code: '0015' },
  { name: 'Connaught Place Branch, New Delhi', code: '0032' },
  { name: 'Deccan Gymkhana, Pune', code: '0045' },
];

export const AtmCardSection: React.FC<AtmCardSectionProps> = ({ formData, onChange }) => {
  const [showSecondaryAccount, setShowSecondaryAccount] = useState(false);

  // Derived values
  const embossedName = (formData.atmEmbossedName || '').toUpperCase().slice(0, 19);
  const firstName = formData.firstName || '';
  const middleName = formData.middleName || '';
  const lastName = formData.lastName || '';

  const handleAutoFillEmbossed = () => {
    const combined = `${firstName} ${middleName ? middleName[0] + ' ' : ''}${lastName}`.trim().toUpperCase();
    onChange('atmEmbossedName', combined.slice(0, 19));
  };

  const handleBranchSelect = (branch: { name: string; code: string }) => {
    onChange('statementBranchName', branch.name);
    onChange('branchName', branch.name);
    onChange('statementBranchCode', branch.code);
    onChange('branchCode', branch.code);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Official Form Header Banner */}
      <div className="bg-linear-to-r from-blue-900 via-sky-800 to-blue-900 text-white p-4 rounded-xl shadow-xs border border-blue-700">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-amber-400 text-blue-950 text-[10px] font-black uppercase px-2 py-0.5 rounded tracking-wider">
                Form AR-35
              </span>
              <span className="text-xs text-sky-200 font-medium">Bank of Maharashtra</span>
            </div>
            <h2 className="text-base font-bold mt-1 text-white tracking-tight">
              Mahabank VISA Debit Card Application
            </h2>
            <p className="text-xs text-sky-100/90 mt-0.5">
              H.O.: Lokmangal 1501, Shivajinagar, Pune 411 005 • In Block Letters Only
            </p>
          </div>
          <div className="text-right shrink-0">
            <span className="inline-flex items-center gap-1 bg-white/10 backdrop-blur-xs text-white text-[11px] font-mono px-2.5 py-1 rounded border border-white/20">
              <CreditCard className="w-3.5 h-3.5 text-amber-300" />
              VISA Classic / Gold
            </span>
          </div>
        </div>
      </div>

      {/* 1. Branch & Application Details */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3.5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-sky-700" />
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Branch & Application Header
            </h3>
          </div>
          <span className="text-[11px] text-slate-500">To: The Branch Manager</span>
        </div>

        {/* Quick Branch Preset Badges */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-600 mb-1.5">
            Select Bank Branch Preset:
          </label>
          <div className="flex flex-wrap gap-1.5">
            {BOM_BRANCHES.map((b) => {
              const isSelected =
                (formData.statementBranchName || formData.branchName) === b.name;
              return (
                <button
                  key={b.code}
                  type="button"
                  onClick={() => handleBranchSelect(b)}
                  className={`text-xs px-2.5 py-1 rounded-md border font-medium transition-all ${
                    isSelected
                      ? 'bg-sky-600 text-white border-sky-600 shadow-2xs font-semibold'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {b.name.split(' ')[0]} ({b.code})
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Branch Name
            </label>
            <input
              type="text"
              value={formData.statementBranchName || formData.branchName || ''}
              onChange={(e) => {
                onChange('statementBranchName', e.target.value);
                onChange('branchName', e.target.value);
              }}
              placeholder="e.g. Purna Branch, Purna"
              className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Application No.
            </label>
            <input
              type="text"
              value={formData.atmApplicationNo || ''}
              onChange={(e) => onChange('atmApplicationNo', e.target.value)}
              placeholder="e.g. AR35/2026/8941"
              className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg font-mono focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Application Date (to be filled by customer - 8 digits DDMMYYYY)
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="text"
              maxLength={8}
              value={formData.atmDate || formData.applicationDate || '26102026'}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, '').slice(0, 8);
                onChange('atmDate', val);
                onChange('applicationDate', val);
              }}
              placeholder="DDMMYYYY (e.g. 26102026)"
              className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg font-mono tracking-wider focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
            />
            <div className="flex items-center gap-1.5 text-[11px] text-slate-500 bg-slate-50 p-2 rounded-lg border border-slate-200">
              <Calendar className="w-3.5 h-3.5 text-sky-600 shrink-0" />
              <span>Printed as 8 individual digits in the top header box strip</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Full Name of Applicant */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3.5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-sky-700" />
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Full Name of Applicant (In Block Letters)
            </h3>
          </div>
          <span className="text-[11px] text-slate-500">Form Section: Full Name</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Surname / Last Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.lastName || ''}
              onChange={(e) => onChange('lastName', e.target.value.toUpperCase())}
              placeholder="SHARMA"
              className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg uppercase font-medium focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              First Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.firstName || ''}
              onChange={(e) => onChange('firstName', e.target.value.toUpperCase())}
              placeholder="RAJESH"
              className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg uppercase font-medium focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Middle Name
            </label>
            <input
              type="text"
              value={formData.middleName || ''}
              onChange={(e) => onChange('middleName', e.target.value.toUpperCase())}
              placeholder="KUMAR"
              className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg uppercase font-medium focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
            />
          </div>
        </div>
      </div>

      {/* 3. Name to be Embossed on Card (19 Characters Max) */}
      <div className="bg-sky-50/70 p-4 rounded-xl border border-sky-200 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-sky-700" />
            <h3 className="text-xs font-bold text-sky-950 uppercase tracking-wider">
              1. Name to be Embossed on Card
            </h3>
          </div>
          <button
            type="button"
            onClick={handleAutoFillEmbossed}
            className="flex items-center gap-1 text-[11px] font-semibold text-sky-700 hover:text-sky-900 bg-white px-2 py-1 rounded border border-sky-300 shadow-2xs transition-colors"
          >
            <Sparkles className="w-3 h-3 text-sky-600" />
            Auto-format from Name
          </button>
        </div>

        <p className="text-xs text-sky-800">
          Must not exceed 19 characters including spaces (letters will be embossed onto the plastic card).
        </p>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-semibold text-slate-700">
              Card Embossed Name (Max 19 Chars)
            </label>
            <span
              className={`text-[11px] font-mono font-bold ${
                embossedName.length > 19 ? 'text-red-600' : 'text-sky-700'
              }`}
            >
              {embossedName.length} / 19
            </span>
          </div>
          <input
            type="text"
            maxLength={19}
            value={formData.atmEmbossedName ?? (formData.nameOnCard || 'RAJESH K SHARMA')}
            onChange={(e) => {
              const val = e.target.value.toUpperCase().slice(0, 19);
              onChange('atmEmbossedName', val);
              onChange('nameOnCard', val);
            }}
            placeholder="e.g. RAJESH K SHARMA"
            className="w-full text-xs px-3 py-2 border border-sky-300 rounded-lg uppercase font-mono tracking-widest bg-white focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
          />
        </div>

        {/* 19-Box Visual Character Strip */}
        <div>
          <div className="text-[10px] text-slate-500 font-semibold uppercase mb-1">
            Visual 19-Box Strip Preview on Form:
          </div>
          <div className="grid grid-cols-19 gap-0.5 max-w-full overflow-x-auto pb-1">
            {Array.from({ length: 19 }).map((_, i) => {
              const char = embossedName[i] || '';
              return (
                <div
                  key={i}
                  className={`h-7 w-5 sm:w-6 flex items-center justify-center border text-xs font-mono font-bold rounded-xs ${
                    char
                      ? 'bg-white border-sky-600 text-sky-900 shadow-2xs'
                      : 'bg-slate-100/80 border-slate-300 text-slate-300'
                  }`}
                >
                  {char || '·'}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 4. Date of Birth & Sex */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3.5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-sky-700" />
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              2. Date of Birth (DD-MM-YYYY) & Sex
            </h3>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Date of Birth (DDMMYYYY - 8 digits)
            </label>
            <input
              type="text"
              maxLength={8}
              value={formData.atmDob || formData.dob || '15081990'}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, '').slice(0, 8);
                onChange('atmDob', val);
                onChange('dob', val);
              }}
              placeholder="e.g. 15081990"
              className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg font-mono tracking-wider focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
            />
            <span className="text-[10px] text-slate-400 mt-0.5 block">
              15/08/1990 → 15081990
            </span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Sex (Check below box /)
            </label>
            <div className="flex items-center gap-4 mt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="atmGender"
                  checked={(formData.atmGender || formData.gender) !== 'female'}
                  onChange={() => {
                    onChange('atmGender', 'male');
                    onChange('gender', 'male');
                  }}
                  className="w-4 h-4 text-sky-600 focus:ring-sky-500"
                />
                <span className="text-xs font-medium text-slate-800">Male (M)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="atmGender"
                  checked={(formData.atmGender || formData.gender) === 'female'}
                  onChange={() => {
                    onChange('atmGender', 'female');
                    onChange('gender', 'female');
                  }}
                  className="w-4 h-4 text-sky-600 focus:ring-sky-500"
                />
                <span className="text-xs font-medium text-slate-800">Female (F)</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Address for Communication */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3.5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-sky-700" />
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              3. Address for Communication as per Bank Records
            </h3>
          </div>
          <span className="text-[11px] text-slate-500">For Card & PIN Mailer</span>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Address Line 1
            </label>
            <input
              type="text"
              value={formData.addressLine1 || ''}
              onChange={(e) => onChange('addressLine1', e.target.value.toUpperCase())}
              placeholder="FLAT 402, SEA GREEN APARTMENTS"
              className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg uppercase focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Address Line 2
            </label>
            <input
              type="text"
              value={formData.addressLine2 || ''}
              onChange={(e) => onChange('addressLine2', e.target.value.toUpperCase())}
              placeholder="MARINE DRIVE, NARIMAN POINT"
              className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg uppercase focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                City
              </label>
              <input
                type="text"
                value={formData.cityVillage || ''}
                onChange={(e) => onChange('cityVillage', e.target.value.toUpperCase())}
                placeholder="MUMBAI"
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg uppercase focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                State
              </label>
              <input
                type="text"
                value={formData.state || ''}
                onChange={(e) => onChange('state', e.target.value.toUpperCase())}
                placeholder="MAHARASHTRA"
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg uppercase focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                PIN Code (6 digits)
              </label>
              <input
                type="text"
                maxLength={6}
                value={formData.pincode || ''}
                onChange={(e) => onChange('pincode', e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="400020"
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg font-mono focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                STD Code & Tel No.
              </label>
              <input
                type="text"
                value={formData.telNo || ''}
                onChange={(e) => onChange('telNo', e.target.value)}
                placeholder="022-22819000"
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Mobile No. (10 digits) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                maxLength={10}
                value={formData.mobileNumber || ''}
                onChange={(e) => onChange('mobileNumber', e.target.value.replace(/\D/g, '').slice(0, 10))}
                placeholder="9820145679"
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg font-mono focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={formData.emailId || ''}
                onChange={(e) => onChange('emailId', e.target.value)}
                placeholder="rajesh.sharma@example.com"
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 6. Primary Account Details */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3.5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-sky-700" />
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              A. Primary Account Details (As on Passbook / Statement)
            </h3>
          </div>
          <span className="text-[11px] font-semibold text-sky-700">Primary Card Account</span>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Title of Account
            </label>
            <input
              type="text"
              value={formData.primaryAccountTitle || `${firstName} ${middleName} ${lastName}`.trim()}
              onChange={(e) => onChange('primaryAccountTitle', e.target.value.toUpperCase())}
              placeholder="RAJESH KUMAR SHARMA"
              className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg uppercase focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Account Type (Tick below box -/)
              </label>
              <select
                value={formData.primaryAccountType || 'savings'}
                onChange={(e) =>
                  onChange('primaryAccountType', e.target.value as 'savings' | 'current' | 'staff_cc')
                }
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
              >
                <option value="savings">Saving Account</option>
                <option value="current">Current Account</option>
                <option value="staff_cc">Staff CC</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Scheme Code
              </label>
              <input
                type="text"
                value={formData.primarySchemeCode || 'SB101'}
                onChange={(e) => onChange('primarySchemeCode', e.target.value.toUpperCase())}
                placeholder="e.g. SB101"
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg uppercase font-mono focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Account Number (17 Digits) <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              maxLength={17}
              value={formData.primaryAccountNumber ?? (formData.accountNumber || '60123456789')}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, '').slice(0, 17);
                onChange('primaryAccountNumber', val);
                onChange('accountNumber', val);
              }}
              placeholder="60123456789"
              className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg font-mono tracking-wider focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Balance of the Account
              </label>
              <input
                type="text"
                value={formData.primaryBalance || '75,000.00'}
                onChange={(e) => onChange('primaryBalance', e.target.value)}
                placeholder="e.g. 75,000.00"
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg font-mono focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Operating Instructions
              </label>
              <select
                value={formData.primaryOperatingInstructions || 'self'}
                onChange={(e) =>
                  onChange(
                    'primaryOperatingInstructions',
                    e.target.value as 'self' | 'either_or_survivor' | 'any_one' | 'survivor'
                  )
                }
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
              >
                <option value="self">SELF</option>
                <option value="either_or_survivor">E/S (Either or Survivor)</option>
                <option value="any_one">ANY ONE</option>
                <option value="survivor">SURVIVOR</option>
              </select>
            </div>
          </div>

          {/* Joint Holders & Add-on Cards */}
          <div className="pt-2 border-t border-slate-100 space-y-2.5">
            <span className="text-[11px] font-bold text-slate-600 uppercase block">
              Joint Holders & Add-on Cards (If Any):
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5 items-center">
              <div className="sm:col-span-3">
                <input
                  type="text"
                  value={formData.primaryJointHolder1 || ''}
                  onChange={(e) => onChange('primaryJointHolder1', e.target.value.toUpperCase())}
                  placeholder="1) Joint Holder 1 Name (e.g. SNEHA RAJESH SHARMA)"
                  className="w-full text-xs px-3 py-1.5 border border-slate-300 rounded-lg uppercase"
                />
              </div>
              <div>
                <label className="text-[11px] font-medium text-slate-600 flex items-center gap-1.5">
                  <span>Add-on Card:</span>
                  <select
                    value={formData.primaryAddOnCard1 || 'no'}
                    onChange={(e) =>
                      onChange('primaryAddOnCard1', e.target.value as 'yes' | 'no')
                    }
                    className="text-xs px-2 py-1 border border-slate-300 rounded bg-white"
                  >
                    <option value="no">No</option>
                    <option value="yes">Yes</option>
                  </select>
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5 items-center">
              <div className="sm:col-span-3">
                <input
                  type="text"
                  value={formData.primaryJointHolder2 || ''}
                  onChange={(e) => onChange('primaryJointHolder2', e.target.value.toUpperCase())}
                  placeholder="2) Joint Holder 2 Name (Optional)"
                  className="w-full text-xs px-3 py-1.5 border border-slate-300 rounded-lg uppercase"
                />
              </div>
              <div>
                <label className="text-[11px] font-medium text-slate-600 flex items-center gap-1.5">
                  <span>Add-on Card:</span>
                  <select
                    value={formData.primaryAddOnCard2 || 'no'}
                    onChange={(e) =>
                      onChange('primaryAddOnCard2', e.target.value as 'yes' | 'no')
                    }
                    className="text-xs px-2 py-1 border border-slate-300 rounded bg-white"
                  >
                    <option value="no">No</option>
                    <option value="yes">Yes</option>
                  </select>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 7. Secondary Account Details (Optional Accordion) */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <button
          type="button"
          onClick={() => setShowSecondaryAccount(!showSecondaryAccount)}
          className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 transition-colors text-left"
        >
          <div className="flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-slate-600" />
            <div>
              <div className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                B. Secondary Account Details (Optional)
              </div>
              <div className="text-[11px] text-slate-500">
                Link an additional account for ATM cash withdrawal & balance inquiry
              </div>
            </div>
          </div>
          {showSecondaryAccount ? (
            <ChevronUp className="w-4 h-4 text-slate-500" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-500" />
          )}
        </button>

        {showSecondaryAccount && (
          <div className="p-4 border-t border-slate-200 space-y-3 animate-fadeIn">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Title of Secondary Account
              </label>
              <input
                type="text"
                value={formData.secondaryAccountTitle || ''}
                onChange={(e) => onChange('secondaryAccountTitle', e.target.value.toUpperCase())}
                placeholder="e.g. M/S SHARMA ENTERPRISES"
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg uppercase"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Account Type
                </label>
                <select
                  value={formData.secondaryAccountType || 'current'}
                  onChange={(e) =>
                    onChange('secondaryAccountType', e.target.value as 'savings' | 'current' | 'staff_cc')
                  }
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg bg-white"
                >
                  <option value="current">Current Account</option>
                  <option value="savings">Saving Account</option>
                  <option value="staff_cc">Staff CC</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Scheme Code
                </label>
                <input
                  type="text"
                  value={formData.secondarySchemeCode || ''}
                  onChange={(e) => onChange('secondarySchemeCode', e.target.value.toUpperCase())}
                  placeholder="e.g. CA102"
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg uppercase font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Secondary Account Number
              </label>
              <input
                type="text"
                maxLength={17}
                value={formData.secondaryAccountNumber || ''}
                onChange={(e) =>
                  onChange('secondaryAccountNumber', e.target.value.replace(/\D/g, '').slice(0, 17))
                }
                placeholder="e.g. 60198765432"
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg font-mono"
              />
            </div>
          </div>
        )}
      </div>

      {/* Signature Note Info Box */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-start gap-2.5 text-xs text-amber-900">
        <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <div className="font-bold">Physical Applicant Signature</div>
          <div className="text-[11px] text-amber-800 mt-0.5">
            The printed Form AR-35 has an authentic signature area at the bottom right. As per Bank of Maharashtra guidelines, sign the printed copy in blue or black ballpoint pen before submitting it to the branch.
          </div>
        </div>
      </div>
    </div>
  );
};
