import React, { useState } from 'react';
import {
  FileText,
  User,
  Phone,
  CreditCard,
  MapPin,
  Calendar,
  Building2,
  CheckCircle2,
  Sparkles,
  Layers,
  Compass,
  FileCheck2,
  Plus,
  Trash2,
  Camera,
  PenTool,
  Languages,
} from 'lucide-react';
import { SbiFormData } from '../../types/formTypes';
import { ensureMarathi, transliterateToMarathi } from '../../utils/marathiTransliterate';

export interface PeekKarjSectionProps {
  formData: SbiFormData;
  onChange: <K extends keyof SbiFormData>(key: K, value: SbiFormData[K]) => void;
}

type PeekSubTab = 'page1' | 'page2' | 'page3';

export const PeekKarjSection: React.FC<PeekKarjSectionProps> = ({ formData, onChange }) => {
  const [activeSubTab, setActiveSubTab] = useState<PeekSubTab>('page1');
  const [autoTransliterate, setAutoTransliterate] = useState<boolean>(true);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Smart text handlers for English -> Marathi transliteration
  const handleSmartTextChange = <K extends keyof SbiFormData>(key: K, rawVal: string) => {
    if (autoTransliterate && (rawVal.endsWith(' ') || rawVal.endsWith(',') || rawVal.endsWith('.'))) {
      const converted = transliterateToMarathi(rawVal);
      onChange(key, converted as SbiFormData[K]);
    } else {
      onChange(key, rawVal as SbiFormData[K]);
    }
  };

  const handleSmartTextBlur = <K extends keyof SbiFormData>(key: K, rawVal: string | undefined) => {
    if (autoTransliterate && rawVal && /[a-zA-Z]/.test(rawVal)) {
      const converted = ensureMarathi(rawVal);
      onChange(key, converted as SbiFormData[K]);
    }
  };

  // Helper to sync crop row changes in Page 2 PMFBY Table
  const cropRows = formData.peekCropRows && formData.peekCropRows.length > 0
    ? formData.peekCropRows
    : [
        { sr: '1', village: formData.peekVillage || 'वाळूज', gatNo: formData.peekGatNo || '142/1', cropName: 'कापूस (Cotton)', sowingDate: '15/06/2026', areaHectare: '1', areaR: '20' },
        { sr: '2', village: formData.peekVillage || 'वाळूज', gatNo: formData.peekGatNo || '142/1', cropName: 'सोयाबीन (Soybean)', sowingDate: '20/06/2026', areaHectare: '0', areaR: '80' },
        { sr: '3', village: formData.peekVillage || 'वाळूज', gatNo: formData.peekGatNo || '142/1', cropName: 'मका (Maize)', sowingDate: '25/06/2026', areaHectare: '0', areaR: '40' },
      ];

  const updateCropRowSmart = (index: number, field: string, val: string) => {
    let finalVal = val;
    if (autoTransliterate && (field === 'village' || field === 'cropName')) {
      if (val.endsWith(' ') || val.endsWith(',') || val.endsWith('.')) {
        finalVal = transliterateToMarathi(val);
      }
    }
    const updated = [...cropRows];
    updated[index] = { ...updated[index], [field]: finalVal };
    onChange('peekCropRows', updated);
  };

  const blurCropRowSmart = (index: number, field: string, val: string) => {
    if (autoTransliterate && (field === 'village' || field === 'cropName') && /[a-zA-Z]/.test(val)) {
      const converted = ensureMarathi(val);
      const updated = [...cropRows];
      updated[index] = { ...updated[index], [field]: converted };
      onChange('peekCropRows', updated);
    }
  };

  const addCropRow = () => {
    if (cropRows.length >= 7) return;
    const nextSr = String(cropRows.length + 1);
    const newRow = {
      sr: nextSr,
      village: formData.peekVillage || '',
      gatNo: formData.peekGatNo || '',
      cropName: '',
      sowingDate: '20/06/2026',
      areaHectare: '0',
      areaR: '00',
    };
    onChange('peekCropRows', [...cropRows, newRow]);
  };

  const removeCropRow = (index: number) => {
    if (cropRows.length <= 1) return;
    const updated = cropRows.filter((_, idx) => idx !== index);
    onChange('peekCropRows', updated);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) onChange('photoDataUrl', result);
    };
    reader.readAsDataURL(file);
  };

  const handleSyncToAllPages = () => {
    const rawName = formData.peekFarmerName || 'दत्ता विश्वनाथ रेंगडे';
    const rawVillage = formData.peekVillage || 'वाळूज';
    const rawTaluka = formData.peekTaluka || 'गंगापूर';
    const rawDistrict = formData.peekDistrict || 'छत्रपती संभाजीनगर';
    const mob = formData.peekMobileNo || '9970996060';
    const aadh = formData.peekAadhaar || '7894 5612 3012';
    const gat = formData.peekGatNo || '142/1';
    const area = formData.peekTotalArea || '2.40 हेक्टर (6.00 एकर)';

    const name = autoTransliterate ? ensureMarathi(rawName) : rawName;
    const village = autoTransliterate ? ensureMarathi(rawVillage) : rawVillage;
    const taluka = autoTransliterate ? ensureMarathi(rawTaluka) : rawTaluka;
    const district = autoTransliterate ? ensureMarathi(rawDistrict) : rawDistrict;

    onChange('peekFarmerName', name);
    onChange('peekVillage', village);
    onChange('peekResidenceVillage', village);
    onChange('peekMauje', village);
    onChange('peekTaluka', taluka);
    onChange('peekDistrict', district);
    onChange('peekMobileNo', mob);
    onChange('peekAadhaar', aadh);
    onChange('peekGatNo', gat);
    onChange('peekTotalArea', area);
    onChange('peekFullAddress', `मु. पो. ${village}, ता. ${taluka}, जि. ${district}`);
    onChange('peekPlace', village);

    setToastMsg('माहिती ३ पानांवर समक्रमित (Synced) झाली!');
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleConvertAllToMarathi = () => {
    if (formData.peekFarmerName) onChange('peekFarmerName', ensureMarathi(formData.peekFarmerName));
    if (formData.peekFatherHusbandName) onChange('peekFatherHusbandName', ensureMarathi(formData.peekFatherHusbandName));
    if (formData.peekVillage) onChange('peekVillage', ensureMarathi(formData.peekVillage));
    if (formData.peekResidenceVillage) onChange('peekResidenceVillage', ensureMarathi(formData.peekResidenceVillage));
    if (formData.peekMauje) onChange('peekMauje', ensureMarathi(formData.peekMauje));
    if (formData.peekTaluka) onChange('peekTaluka', ensureMarathi(formData.peekTaluka));
    if (formData.peekDistrict) onChange('peekDistrict', ensureMarathi(formData.peekDistrict));
    if (formData.peekFullAddress) onChange('peekFullAddress', ensureMarathi(formData.peekFullAddress));
    if (formData.peekBankName) onChange('peekBankName', ensureMarathi(formData.peekBankName));
    if (formData.peekBranch) onChange('peekBranch', ensureMarathi(formData.peekBranch));
    if (formData.peekPlace) onChange('peekPlace', ensureMarathi(formData.peekPlace));
    if (formData.peekCropName1) onChange('peekCropName1', ensureMarathi(formData.peekCropName1));
    if (formData.peekCropArea1) onChange('peekCropArea1', ensureMarathi(formData.peekCropArea1));
    if (formData.peekCropName2) onChange('peekCropName2', ensureMarathi(formData.peekCropName2));
    if (formData.peekCropArea2) onChange('peekCropArea2', ensureMarathi(formData.peekCropArea2));
    if (formData.peekCropName3) onChange('peekCropName3', ensureMarathi(formData.peekCropName3));
    if (formData.peekCropArea3) onChange('peekCropArea3', ensureMarathi(formData.peekCropArea3));
    if (formData.peekBoundEast) onChange('peekBoundEast', ensureMarathi(formData.peekBoundEast));
    if (formData.peekBoundWest) onChange('peekBoundWest', ensureMarathi(formData.peekBoundWest));
    if (formData.peekBoundNorth) onChange('peekBoundNorth', ensureMarathi(formData.peekBoundNorth));
    if (formData.peekBoundSouth) onChange('peekBoundSouth', ensureMarathi(formData.peekBoundSouth));

    const updatedRows = cropRows.map(r => ({
      ...r,
      village: ensureMarathi(r.village),
      cropName: ensureMarathi(r.cropName),
    }));
    onChange('peekCropRows', updatedRows);

    setToastMsg('सर्व मजकूर मराठीत रूपांतरित झाला! (All text converted to Marathi)');
    setTimeout(() => setToastMsg(null), 3500);
  };

  return (
    <div className="space-y-5 animate-fadeIn">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="bg-emerald-600 text-white px-4 py-2.5 rounded-xl shadow-lg flex items-center justify-between text-xs font-bold animate-bounce">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-200" />
            <span>{toastMsg}</span>
          </div>
          <button type="button" onClick={() => setToastMsg(null)} className="text-emerald-200 hover:text-white cursor-pointer">✕</button>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-800 to-emerald-950 text-white p-4 rounded-xl shadow-xs border border-emerald-700">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-amber-400 text-emerald-950 text-[10px] font-black uppercase px-2 py-0.5 rounded tracking-wider">
                Official Marathi Format
              </span>
              <span className="text-emerald-200 text-xs font-semibold">3-Page Set</span>
            </div>
            <h2 className="text-base sm:text-lg font-black tracking-tight text-white mt-1">
              SBI पीक कर्ज मागणी, पिकपेरा स्वयंघोषणा व चतुःसीमा घोषणापत्र
            </h2>
            <p className="text-xs text-emerald-200/90 mt-0.5">
              Crop Loan Application Form • PMFBY Kharif 2026-27 Sowing Declaration • 4 Boundaries Affidavit
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Auto Transliteration Toggle */}
            <button
              type="button"
              onClick={() => setAutoTransliterate(!autoTransliterate)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-xs active:scale-95 border cursor-pointer ${
                autoTransliterate
                  ? 'bg-amber-400 text-emerald-950 border-amber-300 shadow-amber-400/20'
                  : 'bg-emerald-900/80 text-emerald-200 border-emerald-700'
              }`}
              title="इंग्रजीत टाईप केल्यास आपोआप मराठीत रूपांतर होईल (Auto Transliterate English to Marathi)"
            >
              <Languages className="w-3.5 h-3.5" />
              <span>{autoTransliterate ? '🔤 इंग्रजी ➔ मराठी: चालू' : '🔤 इंग्रजी ➔ मराठी: बंद'}</span>
            </button>

            {/* Convert All to Marathi Button */}
            <button
              type="button"
              onClick={handleConvertAllToMarathi}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold transition-all shadow-xs active:scale-95 border border-teal-400/50 cursor-pointer"
              title="सर्व इंग्रजी मजकूर एका क्लिकमध्ये मराठीत करा"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>सर्व मराठीत करा</span>
            </button>

            {/* Sync Across 3 Pages Button */}
            <button
              type="button"
              onClick={handleSyncToAllPages}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold transition-all shadow-xs active:scale-95 border border-emerald-500/50 cursor-pointer"
              title="Auto-synchronize farmer name and land details across all 3 pages"
            >
              <Layers className="w-3.5 h-3.5 text-amber-300" />
              <span>३ पानांवर सिंक करा</span>
            </button>
          </div>
        </div>

        {/* Informative Helper Tip */}
        <div className="mt-3 p-2 bg-emerald-950/60 rounded-lg border border-emerald-600/40 text-[11px] flex items-center justify-between text-emerald-200">
          <div className="flex items-center gap-1.5">
            <span className="text-amber-300 font-bold">💡 टीप:</span>
            <span>तुम्ही इंग्रजीत (उदा. <em>vinod thakur</em>, <em>waluj</em>, <em>gangapur</em>, <em>kapus</em>) टाईप केले तरी ते आपोआप मराठीत रूपांतरित होईल व PDF वर अस्सल मराठीत दिसेल!</span>
          </div>
        </div>

        {/* 3 Pages Navigation Sub-Tabs */}
        <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-emerald-700/60">
          <button
            type="button"
            onClick={() => setActiveSubTab('page1')}
            className={`flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'page1'
                ? 'bg-amber-400 text-slate-950 shadow-xs'
                : 'bg-emerald-800/80 text-white hover:bg-emerald-700/80'
            }`}
          >
            <FileText className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">पान १: पीक कर्ज अर्ज</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('page2')}
            className={`flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'page2'
                ? 'bg-amber-400 text-slate-950 shadow-xs'
                : 'bg-emerald-800/80 text-white hover:bg-emerald-700/80'
            }`}
          >
            <FileCheck2 className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">पान २: पिकपेरा घोषणा</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('page3')}
            className={`flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'page3'
                ? 'bg-amber-400 text-slate-950 shadow-xs'
                : 'bg-emerald-800/80 text-white hover:bg-emerald-700/80'
            }`}
          >
            <Compass className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">पान ३: चतुःसीमा</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SUB-TAB 1: पीक कर्जासाठी अर्जाचा नमुना (Page 1) */}
      {/* ========================================================================= */}
      {activeSubTab === 'page1' && (
        <div className="space-y-5 animate-fadeIn">
          {/* Farmer Identity & Contact */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-2.5 text-slate-900 font-extrabold text-sm">
              <User className="w-4 h-4 text-emerald-700" />
              <span>१ ते ६. शेतकऱ्याची वैयक्तिक माहिती (Farmer Identity & Contact)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
              <div className="sm:col-span-2">
                <label className="block font-bold text-slate-700 mb-1">
                  १. शेतक-याचे नाव (Farmer Full Name):
                </label>
                <input
                  type="text"
                  value={formData.peekFarmerName || ''}
                  onChange={(e) => handleSmartTextChange('peekFarmerName', e.target.value)}
                  onBlur={(e) => handleSmartTextBlur('peekFarmerName', e.target.value)}
                  placeholder="उदा. vinod thakur ➔ विनोद ठाकूर"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-semibold text-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  २. मोबाईल क्रमांक (Mobile Number):
                </label>
                <input
                  type="text"
                  maxLength={10}
                  value={formData.peekMobileNo || ''}
                  onChange={(e) => onChange('peekMobileNo', e.target.value)}
                  placeholder="9970996060"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-semibold text-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  ६. आधार क्रमांक (Aadhaar Number):
                </label>
                <input
                  type="text"
                  maxLength={14}
                  value={formData.peekAadhaar || ''}
                  onChange={(e) => onChange('peekAadhaar', e.target.value)}
                  placeholder="7894 5612 3012"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-semibold text-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  ३. गावाचे नाव (Village):
                </label>
                <input
                  type="text"
                  value={formData.peekVillage || ''}
                  onChange={(e) => handleSmartTextChange('peekVillage', e.target.value)}
                  onBlur={(e) => handleSmartTextBlur('peekVillage', e.target.value)}
                  placeholder="waluj ➔ वाळूज"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-medium text-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  ४. तालुका (Taluka):
                </label>
                <input
                  type="text"
                  value={formData.peekTaluka || ''}
                  onChange={(e) => handleSmartTextChange('peekTaluka', e.target.value)}
                  onBlur={(e) => handleSmartTextBlur('peekTaluka', e.target.value)}
                  placeholder="gangapur ➔ गंगापूर"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-medium text-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  जिल्हा (District):
                </label>
                <input
                  type="text"
                  value={formData.peekDistrict || ''}
                  onChange={(e) => handleSmartTextChange('peekDistrict', e.target.value)}
                  onBlur={(e) => handleSmartTextBlur('peekDistrict', e.target.value)}
                  placeholder="छत्रपती संभाजीनगर"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-medium text-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  ५. स्त्री/पुरुष (Gender):
                </label>
                <select
                  value={formData.peekGender || 'male'}
                  onChange={(e) => onChange('peekGender', e.target.value as 'male' | 'female')}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-medium text-slate-900 bg-white"
                >
                  <option value="male">पुरुष (Male)</option>
                  <option value="female">स्त्री (Female)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Bank Accounts Details */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-2.5 text-slate-900 font-extrabold text-sm">
              <Building2 className="w-4 h-4 text-emerald-700" />
              <span>७ ते १०. बँक खाते व जुनी कर्ज माहिती (Bank Account Details)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  ८. बँकेचा बचत खाते क्रमांक:
                </label>
                <input
                  type="text"
                  value={formData.peekSavingsAcc || ''}
                  onChange={(e) => onChange('peekSavingsAcc', e.target.value)}
                  placeholder="38901234567"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  ९. बँकेचे नाव:
                </label>
                <input
                  type="text"
                  value={formData.peekBankName || ''}
                  onChange={(e) => handleSmartTextChange('peekBankName', e.target.value)}
                  onBlur={(e) => handleSmartTextBlur('peekBankName', e.target.value)}
                  placeholder="State Bank of India (SBI)"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-medium text-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  १०. शाखा (Branch):
                </label>
                <input
                  type="text"
                  value={formData.peekBranch || ''}
                  onChange={(e) => handleSmartTextChange('peekBranch', e.target.value)}
                  onBlur={(e) => handleSmartTextBlur('peekBranch', e.target.value)}
                  placeholder="Waluj MIDC Branch"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-medium text-slate-900"
                />
              </div>
            </div>

            {/* Existing Loan Accounts Row 1 */}
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80 space-y-2">
              <span className="text-[11px] font-bold text-slate-700 block">
                ७. बँक कर्ज खात्यांची माहिती (असल्यास १ - Active Loan 1):
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div>
                  <input
                    type="text"
                    value={formData.peekLoanAcc1 || ''}
                    onChange={(e) => onChange('peekLoanAcc1', e.target.value)}
                    placeholder="कर्ज खाते क्र."
                    className="w-full px-2.5 py-1.5 rounded border border-slate-300 bg-white text-xs"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    value={formData.peekLoanType1 || ''}
                    onChange={(e) => onChange('peekLoanType1', e.target.value)}
                    placeholder="कर्जाचा प्रकार (पीक कर्ज)"
                    className="w-full px-2.5 py-1.5 rounded border border-slate-300 bg-white text-xs"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    value={formData.peekLoanBank1 || ''}
                    onChange={(e) => onChange('peekLoanBank1', e.target.value)}
                    placeholder="बँकेचे नाव"
                    className="w-full px-2.5 py-1.5 rounded border border-slate-300 bg-white text-xs"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    value={formData.peekLoanBranch1 || ''}
                    onChange={(e) => onChange('peekLoanBranch1', e.target.value)}
                    placeholder="शाखा"
                    className="w-full px-2.5 py-1.5 rounded border border-slate-300 bg-white text-xs"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Land & Crop Details */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-2.5 text-slate-900 font-extrabold text-sm">
              <Layers className="w-4 h-4 text-emerald-700" />
              <span>११ ते १३. जमीन व लागवड पिकांची माहिती (Land & Crop Sowing)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  ११. सर्व्हे / गट क्रमांक:
                </label>
                <input
                  type="text"
                  value={formData.peekGatNo || ''}
                  onChange={(e) => onChange('peekGatNo', e.target.value)}
                  placeholder="उदा. 142/1"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  १२. एकूण क्षेत्र (Total Land Area):
                </label>
                <input
                  type="text"
                  value={formData.peekTotalArea || ''}
                  onChange={(e) => onChange('peekTotalArea', e.target.value)}
                  placeholder="2.40 हेक्टर (6.00 एकर)"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-bold text-slate-900"
                />
              </div>
            </div>

            {/* 3 Crops Sowing Rows */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <span className="text-xs font-bold text-slate-800 block">
                १३. लागवड करण्याच्या पिकाची माहिती (Crops to be cultivated):
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div>
                  <label className="text-[11px] font-semibold text-slate-600">१. पिकाचे नाव:</label>
                  <input
                    type="text"
                    value={formData.peekCropName1 || ''}
                    onChange={(e) => handleSmartTextChange('peekCropName1', e.target.value)}
                    onBlur={(e) => handleSmartTextBlur('peekCropName1', e.target.value)}
                    placeholder="kapus ➔ कापूस"
                    className="w-full px-2.5 py-1.5 rounded border border-slate-300 font-medium"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-600">क्षेत्र:</label>
                  <input
                    type="text"
                    value={formData.peekCropArea1 || ''}
                    onChange={(e) => handleSmartTextChange('peekCropArea1', e.target.value)}
                    onBlur={(e) => handleSmartTextBlur('peekCropArea1', e.target.value)}
                    placeholder="1.20 हेक्टर (3 एकर)"
                    className="w-full px-2.5 py-1.5 rounded border border-slate-300 font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div>
                  <label className="text-[11px] font-semibold text-slate-600">२. पिकाचे नाव:</label>
                  <input
                    type="text"
                    value={formData.peekCropName2 || ''}
                    onChange={(e) => handleSmartTextChange('peekCropName2', e.target.value)}
                    onBlur={(e) => handleSmartTextBlur('peekCropName2', e.target.value)}
                    placeholder="soyabean ➔ सोयाबीन"
                    className="w-full px-2.5 py-1.5 rounded border border-slate-300 font-medium"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-600">क्षेत्र:</label>
                  <input
                    type="text"
                    value={formData.peekCropArea2 || ''}
                    onChange={(e) => handleSmartTextChange('peekCropArea2', e.target.value)}
                    onBlur={(e) => handleSmartTextBlur('peekCropArea2', e.target.value)}
                    placeholder="0.80 हेक्टर (2 एकर)"
                    className="w-full px-2.5 py-1.5 rounded border border-slate-300 font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div>
                  <label className="text-[11px] font-semibold text-slate-600">३. पिकाचे नाव:</label>
                  <input
                    type="text"
                    value={formData.peekCropName3 || ''}
                    onChange={(e) => handleSmartTextChange('peekCropName3', e.target.value)}
                    onBlur={(e) => handleSmartTextBlur('peekCropName3', e.target.value)}
                    placeholder="maka ➔ मका"
                    className="w-full px-2.5 py-1.5 rounded border border-slate-300 font-medium"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-600">क्षेत्र:</label>
                  <input
                    type="text"
                    value={formData.peekCropArea3 || ''}
                    onChange={(e) => handleSmartTextChange('peekCropArea3', e.target.value)}
                    onBlur={(e) => handleSmartTextBlur('peekCropArea3', e.target.value)}
                    placeholder="0.40 हेक्टर (1 एकर)"
                    className="w-full px-2.5 py-1.5 rounded border border-slate-300 font-medium"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Enclosed Documents & Passport Photo */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-2.5 text-slate-900 font-extrabold text-sm">
              <Camera className="w-4 h-4 text-emerald-700" />
              <span>१४. सोबत जोडावयाची कागदपत्रे व पासपोर्ट फोटो (Documents & Photo)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Checkboxes */}
              <div className="space-y-2 text-xs font-semibold text-slate-700">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.peekAttachAadhaar !== false}
                    onChange={(e) => onChange('peekAttachAadhaar', e.target.checked)}
                    className="rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>१. आधारकार्ड (Aadhaar Card)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.peekAttach712 !== false}
                    onChange={(e) => onChange('peekAttach712', e.target.checked)}
                    className="rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>२. ७/१२ उतारा (7/12 Extract)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.peekAttach8A !== false}
                    onChange={(e) => onChange('peekAttach8A', e.target.checked)}
                    className="rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>३. ८-अ नोंद (8-A Holding)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.peekAttachFerfar !== false}
                    onChange={(e) => onChange('peekAttachFerfar', e.target.checked)}
                    className="rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>४. फेरफार नक्कल (Mutation Entry)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.peekAttachPan !== false}
                    onChange={(e) => onChange('peekAttachPan', e.target.checked)}
                    className="rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>५. पॅन कार्ड असल्यास (PAN Card)</span>
                </label>
              </div>

              {/* Passport Photo Upload */}
              <div className="flex flex-col items-center justify-center p-3 border-2 border-dashed border-slate-300 rounded-lg bg-slate-50 text-center">
                {formData.photoDataUrl ? (
                  <div className="relative group">
                    <img
                      src={formData.photoDataUrl}
                      alt="Farmer Passport Photo"
                      className="w-24 h-28 object-cover rounded shadow-xs border border-slate-300"
                    />
                    <label className="mt-2 block text-[11px] text-emerald-700 font-bold hover:underline cursor-pointer">
                      Change Photo
                      <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                    </label>
                  </div>
                ) : (
                  <div>
                    <Camera className="w-8 h-8 text-slate-400 mx-auto mb-1" />
                    <span className="text-xs font-bold text-slate-700 block">पासपोर्ट आकाराचा फोटो</span>
                    <span className="text-[10px] text-slate-500 block mb-2">JPG किंवा PNG अपलोड करा</span>
                    <label className="px-3 py-1 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded cursor-pointer shadow-2xs">
                      Upload Photo
                      <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                    </label>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-TAB 2: पिकपेरा स्वयंघोषणा (Page 2 - PMFBY खरीफ २०२६-२७) */}
      {/* ========================================================================= */}
      {activeSubTab === 'page2' && (
        <div className="space-y-5 animate-fadeIn">
          {/* Declaration Statement Header */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-2.5 text-slate-900 font-extrabold text-sm">
              <FileCheck2 className="w-4 h-4 text-emerald-700" />
              <span>पिकपेरा बाबत स्वयंघोषणा (PMFBY Kharif 2026-27)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">रा. (Residence):</label>
                <input
                  type="text"
                  value={formData.peekResidenceVillage || formData.peekVillage || ''}
                  onChange={(e) => handleSmartTextChange('peekResidenceVillage', e.target.value)}
                  onBlur={(e) => handleSmartTextBlur('peekResidenceVillage', e.target.value)}
                  placeholder="waluj ➔ वाळूज"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 font-medium text-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">मौजे (Mauje):</label>
                <input
                  type="text"
                  value={formData.peekMauje || formData.peekVillage || ''}
                  onChange={(e) => handleSmartTextChange('peekMauje', e.target.value)}
                  onBlur={(e) => handleSmartTextBlur('peekMauje', e.target.value)}
                  placeholder="waluj ➔ वाळूज"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 font-medium text-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">शेतकरी ओळखपत्र क्र. (Farmer ID):</label>
                <input
                  type="text"
                  value={formData.peekFarmerId || ''}
                  onChange={(e) => onChange('peekFarmerId', e.target.value)}
                  placeholder="MH-AGRI-996060"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 font-medium text-slate-900"
                />
              </div>
            </div>
          </div>

          {/* 7-Row Crop Table */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="font-extrabold text-slate-900 text-sm">
                पिकपेरा तपशील तक्ता (Crop Sowing Declaration Table - Max 7 Rows)
              </span>
              {cropRows.length < 7 && (
                <button
                  type="button"
                  onClick={addCropRow}
                  className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold rounded border border-emerald-300 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Row</span>
                </button>
              )}
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-300">
                    <th className="p-2 w-10">अ.क्र</th>
                    <th className="p-2">गाव</th>
                    <th className="p-2">गट क्रमांक</th>
                    <th className="p-2">पिकाचे नाव</th>
                    <th className="p-2">पेरणी दिनांक</th>
                    <th className="p-2 w-16">हेक्टर</th>
                    <th className="p-2 w-16">आर</th>
                    <th className="p-2 w-8"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {cropRows.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="p-2 font-bold text-center text-slate-700">{idx + 1}</td>
                      <td className="p-1">
                        <input
                          type="text"
                          value={row.village}
                          onChange={(e) => updateCropRowSmart(idx, 'village', e.target.value)}
                          onBlur={(e) => blurCropRowSmart(idx, 'village', e.target.value)}
                          className="w-full px-2 py-1 border border-slate-200 rounded text-xs"
                        />
                      </td>
                      <td className="p-1">
                        <input
                          type="text"
                          value={row.gatNo}
                          onChange={(e) => updateCropRowSmart(idx, 'gatNo', e.target.value)}
                          className="w-full px-2 py-1 border border-slate-200 rounded text-xs"
                        />
                      </td>
                      <td className="p-1">
                        <input
                          type="text"
                          value={row.cropName}
                          onChange={(e) => updateCropRowSmart(idx, 'cropName', e.target.value)}
                          onBlur={(e) => blurCropRowSmart(idx, 'cropName', e.target.value)}
                          placeholder="उदा. कापूस / सोयाबीन"
                          className="w-full px-2 py-1 border border-slate-200 rounded text-xs font-medium"
                        />
                      </td>
                      <td className="p-1">
                        <input
                          type="text"
                          value={row.sowingDate}
                          onChange={(e) => updateCropRowSmart(idx, 'sowingDate', e.target.value)}
                          placeholder="DD/MM/YYYY"
                          className="w-full px-2 py-1 border border-slate-200 rounded text-xs"
                        />
                      </td>
                      <td className="p-1">
                        <input
                          type="text"
                          value={row.areaHectare}
                          onChange={(e) => updateCropRowSmart(idx, 'areaHectare', e.target.value)}
                          className="w-full px-1.5 py-1 border border-slate-200 rounded text-xs text-center"
                        />
                      </td>
                      <td className="p-1">
                        <input
                          type="text"
                          value={row.areaR}
                          onChange={(e) => updateCropRowSmart(idx, 'areaR', e.target.value)}
                          className="w-full px-1.5 py-1 border border-slate-200 rounded text-xs text-center"
                        />
                      </td>
                      <td className="p-1 text-center">
                        {cropRows.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeCropRow(idx)}
                            className="text-rose-600 hover:text-rose-800 p-1 cursor-pointer"
                            title="Delete row"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Declaration Place & Date */}
            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-100 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">ठिकाण (Place):</label>
                <input
                  type="text"
                  value={formData.peekPlace || formData.peekVillage || ''}
                  onChange={(e) => handleSmartTextChange('peekPlace', e.target.value)}
                  onBlur={(e) => handleSmartTextBlur('peekPlace', e.target.value)}
                  placeholder="waluj ➔ वाळूज"
                  className="w-full px-3 py-1.5 rounded border border-slate-300"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">दिनांक (Date):</label>
                <input
                  type="text"
                  value={formData.peekDate || ''}
                  onChange={(e) => onChange('peekDate', e.target.value)}
                  placeholder="26/10/2026"
                  className="w-full px-3 py-1.5 rounded border border-slate-300"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-TAB 3: स्वयंघोषित चतुःसीमा घोषणापत्र (Page 3) */}
      {/* ========================================================================= */}
      {activeSubTab === 'page3' && (
        <div className="space-y-5 animate-fadeIn">
          {/* Declarant Details */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-2.5 text-slate-900 font-extrabold text-sm">
              <Compass className="w-4 h-4 text-emerald-700" />
              <span>घोषणापत्र माहिती व मालमत्ता तपशील (Property Details)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  वडिलांचे / पतीचे नाव:
                </label>
                <input
                  type="text"
                  value={formData.peekFatherHusbandName || ''}
                  onChange={(e) => handleSmartTextChange('peekFatherHusbandName', e.target.value)}
                  onBlur={(e) => handleSmartTextBlur('peekFatherHusbandName', e.target.value)}
                  placeholder="arjunsingh thakur ➔ अर्जुनसिंह ठाकूर"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 font-medium text-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  पूर्ण पत्ता (Full Address):
                </label>
                <input
                  type="text"
                  value={formData.peekFullAddress || ''}
                  onChange={(e) => handleSmartTextChange('peekFullAddress', e.target.value)}
                  onBlur={(e) => handleSmartTextBlur('peekFullAddress', e.target.value)}
                  placeholder="मु. पो. वाळूज, ता. गंगापूर, जि. छत्रपती संभाजीनगर"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 font-medium text-slate-900"
                />
              </div>
            </div>
          </div>

          {/* 4 Boundaries (चतुःसीमा) */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-2.5 text-slate-900 font-extrabold text-sm">
              <Compass className="w-4 h-4 text-emerald-700" />
              <span>२. मालमत्तेच्या चतुःसीमा (Boundaries - शेजारील गट क्र. किंवा व्यक्तीचे नाव)</span>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  पूर्व (East) सीमा / वर्णन:
                </label>
                <input
                  type="text"
                  value={formData.peekBoundEast || ''}
                  onChange={(e) => handleSmartTextChange('peekBoundEast', e.target.value)}
                  onBlur={(e) => handleSmartTextBlur('peekBoundEast', e.target.value)}
                  placeholder="shet gat kr. 143 ramrao patil ➔ शेत गट क्र. १४३ (शेतकरी रामराव पाटील यांचे शेत)"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 font-medium text-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  पश्चिम (West) सीमा / वर्णन:
                </label>
                <input
                  type="text"
                  value={formData.peekBoundWest || ''}
                  onChange={(e) => handleSmartTextChange('peekBoundWest', e.target.value)}
                  onBlur={(e) => handleSmartTextBlur('peekBoundWest', e.target.value)}
                  placeholder="sarkari pandan rasta ➔ सरकारी पांदण रस्ता व शेत गट क्र. १४१"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 font-medium text-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  उत्तर (North) सीमा / वर्णन:
                </label>
                <input
                  type="text"
                  value={formData.peekBoundNorth || ''}
                  onChange={(e) => handleSmartTextChange('peekBoundNorth', e.target.value)}
                  onBlur={(e) => handleSmartTextBlur('peekBoundNorth', e.target.value)}
                  placeholder="nala / odha ➔ नाला / ओढा व शेत गट क्र. १४०"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 font-medium text-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  दक्षिण (South) सीमा / वर्णन:
                </label>
                <input
                  type="text"
                  value={formData.peekBoundSouth || ''}
                  onChange={(e) => handleSmartTextChange('peekBoundSouth', e.target.value)}
                  onBlur={(e) => handleSmartTextBlur('peekBoundSouth', e.target.value)}
                  placeholder="shet gat kr. 144 vitthal gaikwad ➔ शेत गट क्र. १४४ (शेतकरी विठ्ठल गायकवाड यांचे शेत)"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 font-medium text-slate-900"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
