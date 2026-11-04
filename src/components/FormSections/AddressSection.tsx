import React from 'react';
import { SbiFormData } from '../../types/formTypes';
import { MapPin, FileCheck, CheckSquare } from 'lucide-react';

interface Props {
  formData: SbiFormData;
  onChange: <K extends keyof SbiFormData>(key: K, value: SbiFormData[K]) => void;
}

export const AddressSection: React.FC<Props> = ({ formData, onChange }) => {
  return (
    <div className="space-y-5">
      <div className="border-b border-slate-200 pb-2">
        <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
          <FileCheck className="w-4 h-4 text-indigo-600" />
          Section C: Proof of Identity & Address (Page 2)
        </h3>
        <p className="text-xs text-slate-500 mt-0.5">
          Officially Valid Documents (OVD) and verification details.
        </p>
      </div>

      {/* Proof of Identity Type */}
      <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-3">
        <label className="block text-xs font-semibold text-slate-700">
          Select Officially Valid Document (OVD) *
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {[
            { id: 'aadhaar', label: 'D-Aadhaar Card' },
            { id: 'passport', label: 'A-Passport' },
            { id: 'voter', label: 'B-Voter ID' },
            { id: 'driving', label: 'C-Driving Licence' },
          ].map((doc) => (
            <label
              key={doc.id}
              className={`flex items-center gap-2 p-2 border rounded cursor-pointer transition-colors text-xs ${
                formData.idProofType === doc.id
                  ? 'bg-indigo-50 border-indigo-500 text-indigo-900 font-semibold'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <input
                type="radio"
                name="idProofType"
                checked={formData.idProofType === doc.id}
                onChange={() => onChange('idProofType', doc.id as any)}
                className="text-indigo-600"
              />
              {doc.label}
            </label>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Document No. / Identification No. *
            </label>
            <input
              type="text"
              maxLength={18}
              value={formData.idDocumentNo}
              onChange={(e) => onChange('idDocumentNo', e.target.value.toUpperCase())}
              placeholder="e.g. 482019485721"
              className="w-full px-2.5 py-1.5 text-xs font-mono tracking-wider uppercase bg-white border border-slate-300 rounded focus:border-indigo-500 focus:outline-hidden font-semibold"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Issued By
            </label>
            <input
              type="text"
              value={formData.idIssuedBy}
              onChange={(e) => onChange('idIssuedBy', e.target.value.toUpperCase())}
              placeholder="UIDAI / GOVT OF INDIA"
              className="w-full px-2.5 py-1.5 text-xs uppercase bg-white border border-slate-300 rounded focus:border-indigo-500 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Issue Date (DDMMYYYY)
            </label>
            <input
              type="text"
              maxLength={8}
              value={formData.idIssueDate}
              onChange={(e) => onChange('idIssueDate', e.target.value.replace(/\D/g, ''))}
              placeholder="12052019"
              className="w-full px-2.5 py-1.5 text-xs font-mono tracking-wider bg-white border border-slate-300 rounded focus:border-indigo-500 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Expiry Date (DDMMYYYY)
            </label>
            <input
              type="text"
              maxLength={8}
              value={formData.idExpiryDate}
              onChange={(e) => onChange('idExpiryDate', e.target.value.replace(/\D/g, ''))}
              placeholder="01012099"
              className="w-full px-2.5 py-1.5 text-xs font-mono tracking-wider bg-white border border-slate-300 rounded focus:border-indigo-500 focus:outline-hidden"
            />
          </div>
        </div>
      </div>

      {/* Section D: Current Address */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-indigo-600" />
            Section D: Current Address Details (Page 2)
          </h3>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500">Address Type:</span>
            <label className="flex items-center gap-1 cursor-pointer">
              <input
                type="radio"
                name="addressType"
                checked={formData.addressType === 'residential'}
                onChange={() => onChange('addressType', 'residential')}
                className="text-indigo-600"
              />
              Residential
            </label>
            <label className="flex items-center gap-1 cursor-pointer">
              <input
                type="radio"
                name="addressType"
                checked={formData.addressType === 'business'}
                onChange={() => onChange('addressType', 'business')}
                className="text-indigo-600"
              />
              Business
            </label>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Address Line 1 *
            </label>
            <input
              type="text"
              maxLength={35}
              value={formData.addressLine1}
              onChange={(e) => onChange('addressLine1', e.target.value.toUpperCase())}
              placeholder="FLAT 402, SEA GREEN APARTMENTS"
              className="w-full px-2.5 py-1.5 text-xs font-mono uppercase bg-white border border-slate-300 rounded focus:border-indigo-500 focus:outline-hidden"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Address Line 2
            </label>
            <input
              type="text"
              maxLength={35}
              value={formData.addressLine2}
              onChange={(e) => onChange('addressLine2', e.target.value.toUpperCase())}
              placeholder="NETAJI SUBHASH ROAD, MARINE DRIVE"
              className="w-full px-2.5 py-1.5 text-xs font-mono uppercase bg-white border border-slate-300 rounded focus:border-indigo-500 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              City / Village *
            </label>
            <input
              type="text"
              maxLength={14}
              value={formData.cityVillage}
              onChange={(e) => onChange('cityVillage', e.target.value.toUpperCase())}
              placeholder="MUMBAI"
              className="w-full px-2.5 py-1.5 text-xs font-mono uppercase bg-white border border-slate-300 rounded focus:border-indigo-500 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              District *
            </label>
            <input
              type="text"
              maxLength={18}
              value={formData.district}
              onChange={(e) => onChange('district', e.target.value.toUpperCase())}
              placeholder="MUMBAI CITY"
              className="w-full px-2.5 py-1.5 text-xs font-mono uppercase bg-white border border-slate-300 rounded focus:border-indigo-500 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              State *
            </label>
            <input
              type="text"
              maxLength={14}
              value={formData.state}
              onChange={(e) => onChange('state', e.target.value.toUpperCase())}
              placeholder="MAHARASHTRA"
              className="w-full px-2.5 py-1.5 text-xs font-mono uppercase bg-white border border-slate-300 rounded focus:border-indigo-500 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center justify-between">
              <span>PIN Code *</span>
              <span className="text-[10px] text-slate-400 font-mono">6 Digits</span>
            </label>
            <input
              type="text"
              maxLength={6}
              value={formData.pincode}
              onChange={(e) => onChange('pincode', e.target.value.replace(/\D/g, ''))}
              placeholder="400020"
              className="w-full px-2.5 py-1.5 text-xs font-mono tracking-wider bg-white border border-slate-300 rounded focus:border-indigo-500 focus:outline-hidden font-semibold"
            />
          </div>
        </div>
      </div>

      {/* Section E: Correspondence Address */}
      <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700">
            Section E: Correspondence Address (Page 2)
          </span>
          <label className="flex items-center gap-1.5 text-xs font-semibold text-indigo-700 cursor-pointer bg-white px-2.5 py-1 border border-indigo-200 rounded shadow-2xs hover:bg-indigo-50 transition-colors">
            <input
              type="checkbox"
              checked={formData.sameAsCurrentAddress}
              onChange={(e) => onChange('sameAsCurrentAddress', e.target.checked)}
              className="rounded text-indigo-600 focus:ring-indigo-500"
            />
            Same as Current Address
          </label>
        </div>

        {formData.sameAsCurrentAddress && (
          <div className="p-2.5 bg-indigo-50/80 border border-indigo-200 rounded-md flex items-center justify-between text-xs text-indigo-900">
            <span className="flex items-center gap-1.5 font-medium">
              <CheckSquare className="w-4 h-4 text-indigo-600 shrink-0" />
              Correspondence address is currently mirrored from Current Address.
            </span>
            <span className="text-[11px] text-indigo-700 font-semibold bg-white px-2 py-0.5 rounded border border-indigo-200">
              Auto-synced
            </span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Correspondence Address Line 1
            </label>
            <input
              type="text"
              maxLength={35}
              value={formData.sameAsCurrentAddress ? formData.addressLine1 : formData.corrAddressLine1}
              onChange={(e) => {
                if (!formData.sameAsCurrentAddress) {
                  onChange('corrAddressLine1', e.target.value.toUpperCase());
                }
              }}
              readOnly={formData.sameAsCurrentAddress}
              placeholder="ADDRESS LINE 1"
              className={`w-full px-2.5 py-1.5 text-xs font-mono uppercase border rounded focus:outline-hidden ${
                formData.sameAsCurrentAddress
                  ? 'bg-slate-100 text-slate-700 border-slate-200 cursor-default font-medium'
                  : 'bg-white border-slate-300 focus:border-indigo-500'
              }`}
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Correspondence Address Line 2
            </label>
            <input
              type="text"
              maxLength={35}
              value={formData.sameAsCurrentAddress ? formData.addressLine2 : formData.corrAddressLine2}
              onChange={(e) => {
                if (!formData.sameAsCurrentAddress) {
                  onChange('corrAddressLine2', e.target.value.toUpperCase());
                }
              }}
              readOnly={formData.sameAsCurrentAddress}
              placeholder="ADDRESS LINE 2"
              className={`w-full px-2.5 py-1.5 text-xs font-mono uppercase border rounded focus:outline-hidden ${
                formData.sameAsCurrentAddress
                  ? 'bg-slate-100 text-slate-700 border-slate-200 cursor-default font-medium'
                  : 'bg-white border-slate-300 focus:border-indigo-500'
              }`}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              City / Village
            </label>
            <input
              type="text"
              maxLength={14}
              value={formData.sameAsCurrentAddress ? formData.cityVillage : formData.corrCityVillage}
              onChange={(e) => {
                if (!formData.sameAsCurrentAddress) {
                  onChange('corrCityVillage', e.target.value.toUpperCase());
                }
              }}
              readOnly={formData.sameAsCurrentAddress}
              placeholder="CITY"
              className={`w-full px-2.5 py-1.5 text-xs font-mono uppercase border rounded focus:outline-hidden ${
                formData.sameAsCurrentAddress
                  ? 'bg-slate-100 text-slate-700 border-slate-200 cursor-default font-medium'
                  : 'bg-white border-slate-300 focus:border-indigo-500'
              }`}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              District
            </label>
            <input
              type="text"
              maxLength={18}
              value={formData.sameAsCurrentAddress ? formData.district : formData.corrDistrict}
              onChange={(e) => {
                if (!formData.sameAsCurrentAddress) {
                  onChange('corrDistrict', e.target.value.toUpperCase());
                }
              }}
              readOnly={formData.sameAsCurrentAddress}
              placeholder="DISTRICT"
              className={`w-full px-2.5 py-1.5 text-xs font-mono uppercase border rounded focus:outline-hidden ${
                formData.sameAsCurrentAddress
                  ? 'bg-slate-100 text-slate-700 border-slate-200 cursor-default font-medium'
                  : 'bg-white border-slate-300 focus:border-indigo-500'
              }`}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              State
            </label>
            <input
              type="text"
              maxLength={14}
              value={formData.sameAsCurrentAddress ? formData.state : formData.corrState}
              onChange={(e) => {
                if (!formData.sameAsCurrentAddress) {
                  onChange('corrState', e.target.value.toUpperCase());
                }
              }}
              readOnly={formData.sameAsCurrentAddress}
              placeholder="STATE"
              className={`w-full px-2.5 py-1.5 text-xs font-mono uppercase border rounded focus:outline-hidden ${
                formData.sameAsCurrentAddress
                  ? 'bg-slate-100 text-slate-700 border-slate-200 cursor-default font-medium'
                  : 'bg-white border-slate-300 focus:border-indigo-500'
              }`}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              PIN Code
            </label>
            <input
              type="text"
              maxLength={6}
              value={formData.sameAsCurrentAddress ? formData.pincode : formData.corrPincode}
              onChange={(e) => {
                if (!formData.sameAsCurrentAddress) {
                  onChange('corrPincode', e.target.value.replace(/\D/g, ''));
                }
              }}
              readOnly={formData.sameAsCurrentAddress}
              placeholder="PIN CODE"
              className={`w-full px-2.5 py-1.5 text-xs font-mono tracking-wider border rounded focus:outline-hidden ${
                formData.sameAsCurrentAddress
                  ? 'bg-slate-100 text-slate-700 border-slate-200 cursor-default font-semibold'
                  : 'bg-white border-slate-300 focus:border-indigo-500'
              }`}
            />
          </div>
        </div>
      </div>

      {/* Place & Date for Declaration */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Place of Declaration *
          </label>
          <input
            type="text"
            value={formData.place}
            onChange={(e) => onChange('place', e.target.value.toUpperCase())}
            placeholder="e.g. MUMBAI"
            className="w-full px-2.5 py-1.5 text-xs uppercase bg-white border border-slate-300 rounded focus:border-indigo-500 focus:outline-hidden"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Signature Date (DDMMYYYY) *
          </label>
          <input
            type="text"
            maxLength={8}
            value={formData.signatureDate || formData.applicationDate}
            onChange={(e) => onChange('signatureDate', e.target.value.replace(/\D/g, ''))}
            placeholder="e.g. 22102026"
            className="w-full px-2.5 py-1.5 text-xs font-mono tracking-wider bg-white border border-slate-300 rounded focus:border-indigo-500 focus:outline-hidden"
          />
        </div>
      </div>
    </div>
  );
};
