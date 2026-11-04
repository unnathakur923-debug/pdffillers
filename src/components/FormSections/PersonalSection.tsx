import React from 'react';
import { SbiFormData } from '../../types/formTypes';
import { User, Phone, Mail, CreditCard, Briefcase, GraduationCap, DollarSign } from 'lucide-react';

interface Props {
  formData: SbiFormData;
  onChange: <K extends keyof SbiFormData>(key: K, value: SbiFormData[K]) => void;
}

export const PersonalSection: React.FC<Props> = ({ formData, onChange }) => {
  return (
    <div className="space-y-5">
      <div className="border-b border-slate-200 pb-2">
        <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
          <User className="w-4 h-4 text-indigo-600" />
          Section A: Personal & KYC Details (Page 1)
        </h3>
        <p className="text-xs text-slate-500 mt-0.5">
          All details will be aligned letter-by-letter into the official SBI grid boxes.
        </p>
      </div>

      {/* 1. Name */}
      <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700">1. Full Name (Same as ID Proof) *</span>
          <span className="text-[10px] text-slate-400">Block letters only</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              Salutation
            </label>
            <select
              value={formData.salutation}
              onChange={(e) => onChange('salutation', e.target.value as any)}
              className="w-full px-2 py-1.5 text-xs bg-white border border-slate-300 rounded focus:border-indigo-500 focus:outline-hidden"
            >
              <option value="Mr">MR.</option>
              <option value="Ms">MS.</option>
              <option value="Mrs">MRS.</option>
              <option value="Dr">DR.</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              First Name *
            </label>
            <input
              type="text"
              maxLength={15}
              value={formData.firstName}
              onChange={(e) => onChange('firstName', e.target.value.toUpperCase())}
              placeholder="RAJESH"
              className="w-full px-2.5 py-1.5 text-xs font-mono uppercase bg-white border border-slate-300 rounded focus:border-indigo-500 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              Middle Name
            </label>
            <input
              type="text"
              maxLength={10}
              value={formData.middleName}
              onChange={(e) => onChange('middleName', e.target.value.toUpperCase())}
              placeholder="KUMAR"
              className="w-full px-2.5 py-1.5 text-xs font-mono uppercase bg-white border border-slate-300 rounded focus:border-indigo-500 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              Last Name *
            </label>
            <input
              type="text"
              maxLength={15}
              value={formData.lastName}
              onChange={(e) => onChange('lastName', e.target.value.toUpperCase())}
              placeholder="SHARMA"
              className="w-full px-2.5 py-1.5 text-xs font-mono uppercase bg-white border border-slate-300 rounded focus:border-indigo-500 focus:outline-hidden"
            />
          </div>
        </div>
      </div>

      {/* Date of Birth, Gender, Marital Status */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            2. Date of Birth (DDMMYYYY) *
          </label>
          <input
            type="text"
            maxLength={8}
            value={formData.dob}
            onChange={(e) => onChange('dob', e.target.value.replace(/\D/g, ''))}
            placeholder="14081988"
            className="w-full px-2.5 py-1.5 text-xs font-mono tracking-wider bg-white border border-slate-300 rounded focus:border-indigo-500 focus:outline-hidden"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            3. Gender *
          </label>
          <div className="flex items-center gap-2 mt-1.5">
            <label className="flex items-center gap-1 text-xs cursor-pointer">
              <input
                type="radio"
                name="gender"
                checked={formData.gender === 'male'}
                onChange={() => onChange('gender', 'male')}
                className="text-indigo-600"
              />
              Male
            </label>
            <label className="flex items-center gap-1 text-xs cursor-pointer">
              <input
                type="radio"
                name="gender"
                checked={formData.gender === 'female'}
                onChange={() => onChange('gender', 'female')}
                className="text-indigo-600"
              />
              Female
            </label>
            <label className="flex items-center gap-1 text-xs cursor-pointer">
              <input
                type="radio"
                name="gender"
                checked={formData.gender === 'third'}
                onChange={() => onChange('gender', 'third')}
                className="text-indigo-600"
              />
              Third
            </label>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            4. Marital Status *
          </label>
          <div className="flex items-center gap-2 mt-1.5">
            <label className="flex items-center gap-1 text-xs cursor-pointer">
              <input
                type="radio"
                name="maritalStatus"
                checked={formData.maritalStatus === 'married'}
                onChange={() => onChange('maritalStatus', 'married')}
                className="text-indigo-600"
              />
              Married
            </label>
            <label className="flex items-center gap-1 text-xs cursor-pointer">
              <input
                type="radio"
                name="maritalStatus"
                checked={formData.maritalStatus === 'unmarried'}
                onChange={() => onChange('maritalStatus', 'unmarried')}
                className="text-indigo-600"
              />
              Unmarried
            </label>
          </div>
        </div>
      </div>

      {/* 6. Relative Name */}
      <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700">6. Name of Relative *</span>
          <div className="flex items-center gap-2">
            <label className="flex items-center gap-1 text-xs cursor-pointer">
              <input
                type="radio"
                name="relativeType"
                checked={formData.relativeType === 'father'}
                onChange={() => onChange('relativeType', 'father')}
                className="text-indigo-600"
              />
              Father
            </label>
            <label className="flex items-center gap-1 text-xs cursor-pointer">
              <input
                type="radio"
                name="relativeType"
                checked={formData.relativeType === 'mother'}
                onChange={() => onChange('relativeType', 'mother')}
                className="text-indigo-600"
              />
              Mother
            </label>
            <label className="flex items-center gap-1 text-xs cursor-pointer">
              <input
                type="radio"
                name="relativeType"
                checked={formData.relativeType === 'spouse'}
                onChange={() => onChange('relativeType', 'spouse')}
                className="text-indigo-600"
              />
              Spouse
            </label>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <input
            type="text"
            maxLength={14}
            value={formData.relativeFirstName}
            onChange={(e) => onChange('relativeFirstName', e.target.value.toUpperCase())}
            placeholder="Relative First Name"
            className="px-2.5 py-1.5 text-xs font-mono uppercase bg-white border border-slate-300 rounded focus:border-indigo-500 focus:outline-hidden"
          />
          <input
            type="text"
            maxLength={10}
            value={formData.relativeMiddleName}
            onChange={(e) => onChange('relativeMiddleName', e.target.value.toUpperCase())}
            placeholder="Relative Middle Name"
            className="px-2.5 py-1.5 text-xs font-mono uppercase bg-white border border-slate-300 rounded focus:border-indigo-500 focus:outline-hidden"
          />
          <input
            type="text"
            maxLength={14}
            value={formData.relativeLastName}
            onChange={(e) => onChange('relativeLastName', e.target.value.toUpperCase())}
            placeholder="Relative Last Name"
            className="px-2.5 py-1.5 text-xs font-mono uppercase bg-white border border-slate-300 rounded focus:border-indigo-500 focus:outline-hidden"
          />
        </div>
      </div>

      {/* PAN & Tax details */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center justify-between">
            <span className="flex items-center gap-1">
              <CreditCard className="w-3.5 h-3.5 text-indigo-600" />
              21. PAN (Permanent Account Number) *
            </span>
            <span className="text-[10px] text-slate-400 font-mono">10 Characters</span>
          </label>
          <input
            type="text"
            maxLength={10}
            value={formData.pan}
            onChange={(e) => onChange('pan', e.target.value.toUpperCase())}
            placeholder="ABCPS1234K"
            className="w-full px-2.5 py-1.5 text-xs font-mono uppercase tracking-wider bg-white border border-slate-300 rounded focus:border-indigo-500 focus:outline-hidden font-semibold text-indigo-950"
          />
          <span className="text-[10px] text-slate-400 mt-0.5 block">
            Fills directly into the 10 grid cells on Page 1 line 21
          </span>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            20. Tax Residence in India Only? *
          </label>
          <div className="flex items-center gap-3 mt-2">
            <label className="flex items-center gap-1.5 text-xs cursor-pointer">
              <input
                type="radio"
                name="taxResidence"
                checked={formData.taxResidenceIndiaOnly === 'yes'}
                onChange={() => onChange('taxResidenceIndiaOnly', 'yes')}
                className="text-indigo-600"
              />
              Yes (Resident Indian)
            </label>
            <label className="flex items-center gap-1.5 text-xs cursor-pointer">
              <input
                type="radio"
                name="taxResidence"
                checked={formData.taxResidenceIndiaOnly === 'no'}
                onChange={() => onChange('taxResidenceIndiaOnly', 'no')}
                className="text-indigo-600"
              />
              No (FATCA Applicable)
            </label>
          </div>
        </div>
      </div>

      {/* Section B: Contact Details */}
      <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
            <Phone className="w-3.5 h-3.5 text-indigo-600" />
            Section B: Contact Details (Page 1)
          </span>
          <span className="text-[10px] text-slate-400">SMS & Email Alerts</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              Mobile Number (10 Digits) *
            </label>
            <div className="flex">
              <span className="inline-flex items-center px-2.5 bg-slate-200 border border-r-0 border-slate-300 text-slate-600 text-xs font-mono rounded-l">
                +91
              </span>
              <input
                type="text"
                maxLength={10}
                value={formData.mobileNumber}
                onChange={(e) => onChange('mobileNumber', e.target.value.replace(/\D/g, ''))}
                placeholder="9820145678"
                className="w-full px-2.5 py-1.5 text-xs font-mono tracking-wider bg-white border border-slate-300 rounded-r focus:border-indigo-500 focus:outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1 flex items-center gap-1">
              <Mail className="w-3 h-3 text-slate-400" />
              Email ID *
            </label>
            <input
              type="email"
              value={formData.emailId}
              onChange={(e) => onChange('emailId', e.target.value.toLowerCase())}
              placeholder="user@example.com"
              className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded focus:border-indigo-500 focus:outline-hidden"
            />
          </div>

          <div className="sm:col-span-2 flex items-center gap-3 pt-1">
            <span className="text-xs font-medium text-slate-600">Mobile belongs to:</span>
            {(['self', 'father', 'mother', 'spouse'] as const).map((who) => (
              <label key={who} className="flex items-center gap-1 text-xs capitalize cursor-pointer">
                <input
                  type="radio"
                  name="mobileBelongsTo"
                  checked={formData.mobileBelongsTo === who}
                  onChange={() => onChange('mobileBelongsTo', who)}
                  className="text-indigo-600"
                />
                {who}
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Occupation, Income, Education */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            10. Occupation Type *
          </label>
          <select
            value={formData.occupationType}
            onChange={(e) => onChange('occupationType', e.target.value as any)}
            className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded focus:border-indigo-500 focus:outline-hidden"
          >
            <option value="pvt">Private Sector</option>
            <option value="state_govt">State Government</option>
            <option value="central_govt">Central Government</option>
            <option value="psu">Public Sector (PSU)</option>
            <option value="defence">Defence</option>
            <option value="business">Business / Trade</option>
            <option value="other_self">Self Employed</option>
            <option value="student">Student</option>
            <option value="retired">Retired</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            12. Annual Income (Rs.) *
          </label>
          <input
            type="text"
            value={formData.annualIncome}
            onChange={(e) => onChange('annualIncome', e.target.value.replace(/\D/g, ''))}
            placeholder="e.g. 1850000"
            className="w-full px-2.5 py-1.5 text-xs font-mono bg-white border border-slate-300 rounded focus:border-indigo-500 focus:outline-hidden"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            18. Educational Qualification
          </label>
          <select
            value={formData.education}
            onChange={(e) => onChange('education', e.target.value as any)}
            className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded focus:border-indigo-500 focus:outline-hidden"
          >
            <option value="graduate">Graduate (Gen.)</option>
            <option value="post_graduate">Post Graduate</option>
            <option value="engineering">Engineering Graduate</option>
            <option value="medical">Medical Graduate</option>
            <option value="law">Law Graduate</option>
            <option value="ca_mba">CA / ICWA / MBA</option>
            <option value="10th">10th Class</option>
          </select>
        </div>

        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            11. Organization Name
          </label>
          <input
            type="text"
            value={formData.organizationName}
            onChange={(e) => onChange('organizationName', e.target.value.toUpperCase())}
            placeholder="e.g. TATA CONSULTANCY SERVICES LTD"
            className="w-full px-2.5 py-1.5 text-xs uppercase bg-white border border-slate-300 rounded focus:border-indigo-500 focus:outline-hidden"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Designation
          </label>
          <input
            type="text"
            value={formData.designation}
            onChange={(e) => onChange('designation', e.target.value.toUpperCase())}
            placeholder="e.g. SYSTEMS ARCHITECT"
            className="w-full px-2.5 py-1.5 text-xs uppercase bg-white border border-slate-300 rounded focus:border-indigo-500 focus:outline-hidden"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Nature of Business
          </label>
          <input
            type="text"
            value={formData.natureOfBusiness}
            onChange={(e) => onChange('natureOfBusiness', e.target.value.toUpperCase())}
            placeholder="e.g. OTHERS"
            className="w-full px-2.5 py-1.5 text-xs uppercase bg-white border border-slate-300 rounded focus:border-indigo-500 focus:outline-hidden"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            13. Net Worth (Rs.)
          </label>
          <input
            type="text"
            value={formData.netWorth}
            onChange={(e) => onChange('netWorth', e.target.value.replace(/\D/g, ''))}
            placeholder="e.g. 1000000"
            className="w-full px-2.5 py-1.5 text-xs font-mono bg-white border border-slate-300 rounded focus:border-indigo-500 focus:outline-hidden"
          />
        </div>
      </div>

      {/* Religion, Category, Source of Funds */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            14. Source of Funds
          </label>
          <select
            value={formData.sourceOfFunds}
            onChange={(e) => onChange('sourceOfFunds', e.target.value as any)}
            className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded focus:border-indigo-500 focus:outline-hidden"
          >
            <option value="salary">Salary</option>
            <option value="business">Business Income</option>
            <option value="agriculture">Agriculture</option>
            <option value="investment">Investment</option>
            <option value="pension">Pension</option>
            <option value="others">Others</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            15. Religion
          </label>
          <select
            value={formData.religion}
            onChange={(e) => onChange('religion', e.target.value as any)}
            className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded focus:border-indigo-500 focus:outline-hidden"
          >
            <option value="hindu">Hindu</option>
            <option value="muslim">Muslim</option>
            <option value="christian">Christian</option>
            <option value="sikh">Sikh</option>
            <option value="others">Others</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            16. Category
          </label>
          <select
            value={formData.category}
            onChange={(e) => onChange('category', e.target.value as any)}
            className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded focus:border-indigo-500 focus:outline-hidden"
          >
            <option value="general">General</option>
            <option value="obc">OBC</option>
            <option value="sc">SC</option>
            <option value="st">ST</option>
          </select>
        </div>
      </div>
    </div>
  );
};
