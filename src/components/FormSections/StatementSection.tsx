import React, { useState } from 'react';
import { SbiFormData, LetterType } from '../../types/formTypes';
import {
  FileText,
  BookOpen,
  XCircle,
  UserCheck,
  Calendar,
  User,
  CreditCard,
  Phone,
  Mail,
  Building,
  Check,
  ShieldCheck,
  ArrowRightLeft,
  Edit3,
  UserMinus,
  UserPlus,
  Users,
  Home,
  PhoneCall,
  Fingerprint,
  MailCheck,
  PenTool,
  Lock,
  KeyRound,
  RefreshCw,
  FileCheck2,
  AlertTriangle,
  Copy,
  FileX2,
  Clock,
  ShieldAlert,
  Search,
  X,
  Smartphone,
  Send,
  Wallet,
  Receipt,
  History,
  FileCheck,
  CheckCircle2,
  ShieldOff,
  FileSpreadsheet,
  AlertCircle,
  HelpCircle,
  Ban,
  Landmark,
} from 'lucide-react';
import { resolveAssetUrl } from '../../utils/assetHelper';

const MAHABANK_LOGO_PATH = resolveAssetUrl('/assets/aistudio/MAHABANK.NS_BIG_2f06ae18.png');
const SBI_LOGO_PATH = resolveAssetUrl('/assets/aistudio/sbi_logo_clean.png');

interface StatementSectionProps {
  formData: SbiFormData;
  onChange: <K extends keyof SbiFormData>(key: K, value: SbiFormData[K]) => void;
}

type LetterCategory = 'all' | 'atm' | 'cheque' | 'statements' | 'digital' | 'account';

export const StatementSection: React.FC<StatementSectionProps> = ({ formData, onChange }) => {
  const [categoryFilter, setCategoryFilter] = useState<LetterCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const activeLetter: LetterType = formData.letterType || 'statement';

  const selectedBank: 'bom' | 'sbi' =
    formData.statementBank ||
    (formData.statementBankName?.toLowerCase().includes('state bank') ? 'sbi' : 'bom');

  const handleBankSelect = (bank: 'bom' | 'sbi') => {
    onChange('statementBank', bank);
    if (bank === 'bom') {
      onChange('statementBankName', 'Bank of Maharashtra');
      if (formData.statementBranchName?.includes('Nariman Point') || !formData.statementBranchName) {
        onChange('statementBranchName', 'Purna Branch, Purna');
        onChange('statementBranchCode', '0124');
      }
    } else {
      onChange('statementBankName', 'State Bank of India');
      if (formData.statementBranchName?.includes('Purna Branch') || !formData.statementBranchName) {
        onChange('statementBranchName', 'Nariman Point Branch, Mumbai');
        onChange('statementBranchCode', '00214');
      }
    }
  };

  const bomBranchPresets = [
    { name: 'Purna Branch, Purna', code: '0124', label: 'Purna (0124)' },
    { name: 'Pune Main Branch, Pune', code: '00004', label: 'Pune Main (00004)' },
    { name: 'Mumbai Fort Branch, Mumbai', code: '00012', label: 'Mumbai Fort (00012)' },
    { name: 'Shivajinagar Branch, Pune', code: '00035', label: 'Shivajinagar (00035)' },
  ];

  const sbiBranchPresets = [
    { name: 'Nariman Point Branch, Mumbai', code: '00214', label: 'Nariman Point (00214)' },
    { name: 'New Delhi Main Branch, New Delhi', code: '00691', label: 'New Delhi Main (00691)' },
    { name: 'Bengaluru Main Branch, Bengaluru', code: '00008', label: 'Bengaluru Main (00008)' },
    { name: 'Kolkata Main Branch, Kolkata', code: '00001', label: 'Kolkata Main (00001)' },
  ];

  const handlePreset = (preset: 'last_3_months' | 'last_6_months' | 'fy_2025_2026' | 'current_month') => {
    if (preset === 'last_3_months') {
      onChange('statementPeriodFrom', '01/08/2026');
      onChange('statementPeriodTo', '26/10/2026');
    } else if (preset === 'last_6_months') {
      onChange('statementPeriodFrom', '01/05/2026');
      onChange('statementPeriodTo', '26/10/2026');
    } else if (preset === 'fy_2025_2026') {
      onChange('statementPeriodFrom', '01/04/2026');
      onChange('statementPeriodTo', '26/10/2026');
    } else if (preset === 'current_month') {
      onChange('statementPeriodFrom', '01/10/2026');
      onChange('statementPeriodTo', '26/10/2026');
    }
  };

  const accountType =
    formData.statementAccountType ||
    (formData.accountCategory === 'current' ? 'current' : 'savings');

  const letterOptions: Array<{
    id: LetterType;
    num: number;
    category: LetterCategory;
    title: string;
    subtitle: string;
    icon: React.ComponentType<{ className?: string }>;
    tag: string;
  }> = [
    // 1 to 13: KYC & Account Modifications
    {
      id: 'remove_joint_holder',
      num: 1,
      category: 'account',
      title: "1. Remove Joint Account Holder's Name",
      subtitle: "Delete / remove joint holder's name",
      icon: UserMinus,
      tag: 'Joint #01',
    },
    {
      id: 'add_nominee',
      num: 2,
      category: 'account',
      title: '2. Add Nominee Application (Form DA-1)',
      subtitle: 'Register nominee under Form DA-1',
      icon: UserPlus,
      tag: 'Nominee #02',
    },
    {
      id: 'change_nominee',
      num: 3,
      category: 'account',
      title: '3. Change / Cancel Nominee Application',
      subtitle: 'Cancel old & register new nominee (DA-2/DA-3)',
      icon: Users,
      tag: 'Nominee #03',
    },
    {
      id: 'change_address',
      num: 4,
      category: 'account',
      title: '4. Change of Address Application',
      subtitle: 'Update residential & communication address',
      icon: Home,
      tag: 'Address #04',
    },
    {
      id: 'change_mobile',
      num: 5,
      category: 'account',
      title: '5. Change of Mobile Number Application',
      subtitle: 'Update phone for OTPs & SMS alerts',
      icon: PhoneCall,
      tag: 'Mobile #05',
    },
    {
      id: 'aadhaar_linking',
      num: 6,
      category: 'account',
      title: '6. Aadhaar Linking with Bank Account',
      subtitle: 'Link Aadhaar & map for NPCI / DBT',
      icon: Fingerprint,
      tag: 'Aadhaar #06',
    },
    {
      id: 'pan_linking',
      num: 7,
      category: 'account',
      title: '7. PAN Linking Application',
      subtitle: 'Seed 10-character PAN Card in CBS',
      icon: CreditCard,
      tag: 'PAN #07',
    },
    {
      id: 'email_update',
      num: 8,
      category: 'account',
      title: '8. Email ID Update Application',
      subtitle: 'Register email for e-statements & notices',
      icon: MailCheck,
      tag: 'Email #08',
    },
    {
      id: 'signature_change',
      num: 9,
      category: 'account',
      title: '9. Signature Change Request',
      subtitle: 'Update specimen signature in records',
      icon: PenTool,
      tag: 'Signature #09',
    },
    {
      id: 'name_correction',
      num: 10,
      category: 'account',
      title: '10. Name Correction in Account',
      subtitle: 'Old name & new name rectification',
      icon: Edit3,
      tag: 'Correction #10',
    },
    {
      id: 'closure',
      num: 11,
      category: 'account',
      title: '11. Account Closure Application',
      subtitle: 'Close account & transfer balance',
      icon: XCircle,
      tag: 'Closure #11',
    },
    {
      id: 'minor_to_major',
      num: 12,
      category: 'account',
      title: '12. Minor to Major Conversion',
      subtitle: 'Attained 18 years / independent operation',
      icon: UserCheck,
      tag: 'Conversion #12',
    },
    {
      id: 'jandhan_conversion',
      num: 13,
      category: 'account',
      title: '13. Jan Dhan to Normal Account',
      subtitle: 'PMJDY to regular savings account',
      icon: ArrowRightLeft,
      tag: 'PMJDY #13',
    },

    // 25 to 32: ATM & Debit Cards
    {
      id: 'new_atm_card',
      num: 25,
      category: 'atm',
      title: '25. New ATM / Debit Card Request Application',
      subtitle: 'Fresh debit card request',
      icon: CreditCard,
      tag: 'Card #25',
    },
    {
      id: 'block_atm_card',
      num: 26,
      category: 'atm',
      title: '26. ATM Card Blocking Application',
      subtitle: 'Urgent hotlisting & blocking',
      icon: Lock,
      tag: 'Security #26',
    },
    {
      id: 'lost_atm_card_complaint',
      num: 27,
      category: 'atm',
      title: '27. Lost ATM Card Complaint Application',
      subtitle: 'Report lost card with FIR/NCR ref',
      icon: ShieldAlert,
      tag: 'Grievance #27',
    },
    {
      id: 'atm_replacement',
      num: 28,
      category: 'atm',
      title: '28. Damaged ATM Card Replacement Application',
      subtitle: 'Replace chip/broken debit card',
      icon: RefreshCw,
      tag: 'Card #28',
    },
    {
      id: 'atm_pin_reset',
      num: 29,
      category: 'atm',
      title: '29. ATM PIN Generation / Reset Request',
      subtitle: 'Green PIN OTP & mailer request',
      icon: KeyRound,
      tag: 'PIN #29',
    },
    {
      id: 'atm_card_renewal',
      num: 30,
      category: 'atm',
      title: '30. ATM Card Renewal Application',
      subtitle: 'Renew expiring debit card',
      icon: History,
      tag: 'Card #30',
    },
    {
      id: 'atm_txn_dispute',
      num: 31,
      category: 'atm',
      title: '31. ATM Transaction Dispute Application',
      subtitle: 'Wrong debit / unauthorized POS charge',
      icon: AlertCircle,
      tag: 'Dispute #31',
    },
    {
      id: 'atm_failed_withdrawal',
      num: 32,
      category: 'atm',
      title: '32. ATM Cash Not Dispensed Complaint',
      subtitle: 'Cash debited but not dispensed (RBI TAT)',
      icon: ShieldAlert,
      tag: 'Complaint #32',
    },

    // 33 to 40: Cheque Books, Drafts & Clearing
    {
      id: 'cheque_book_request',
      num: 33,
      category: 'cheque',
      title: '33. New Cheque Book Request Application',
      subtitle: '25 / 50 / 100 leaves CTS-2010 book',
      icon: FileCheck2,
      tag: 'Cheque #33',
    },
    {
      id: 'duplicate_cheque_book',
      num: 34,
      category: 'cheque',
      title: '34. Duplicate Cheque Book Request Application',
      subtitle: 'Re-issue exhausted or lost book',
      icon: Copy,
      tag: 'Cheque #34',
    },
    {
      id: 'stop_cheque_payment',
      num: 35,
      category: 'cheque',
      title: '35. Stop Cheque Payment Application',
      subtitle: 'Urgent stop instruction on issued cheque',
      icon: AlertTriangle,
      tag: 'Cheque #35',
    },
    {
      id: 'cancel_cheque_request',
      num: 36,
      category: 'cheque',
      title: '36. Cheque Cancellation Application',
      subtitle: 'Cancel requisition or void leaves',
      icon: FileX2,
      tag: 'Cheque #36',
    },
    {
      id: 'cheque_revalidation',
      num: 37,
      category: 'cheque',
      title: '37. Cheque Revalidation Application',
      subtitle: 'Revalidate stale/expired cheque',
      icon: Clock,
      tag: 'Cheque #37',
    },
    {
      id: 'cheque_book_not_received',
      num: 38,
      category: 'cheque',
      title: '38. Cheque Book Not Received Complaint',
      subtitle: 'Tracking complaint for delayed delivery',
      icon: HelpCircle,
      tag: 'Complaint #38',
    },
    {
      id: 'duplicate_cheque_request',
      num: 39,
      category: 'cheque',
      title: "39. Duplicate Cheque / Banker's Draft Application",
      subtitle: 'Reissue lost DD or banker cheque',
      icon: Copy,
      tag: 'Draft #39',
    },
    {
      id: 'cheque_clearing_complaint',
      num: 40,
      category: 'cheque',
      title: '40. Cheque Clearing Complaint Application',
      subtitle: 'Delayed clearing & non-credit complaint',
      icon: Clock,
      tag: 'Complaint #40',
    },

    // 41 to 50: Passbooks, Statements & Certificates
    {
      id: 'passbook',
      num: 41,
      category: 'statements',
      title: '41. New Passbook Issuance Application',
      subtitle: 'Exhausted, lost, or damaged passbook',
      icon: BookOpen,
      tag: 'Passbook #41',
    },
    {
      id: 'passbook_correction',
      num: 42,
      category: 'statements',
      title: '42. Passbook Correction Application',
      subtitle: 'Rectify balance or wrong entry',
      icon: Edit3,
      tag: 'Passbook #42',
    },
    {
      id: 'statement',
      num: 43,
      category: 'statements',
      title: '43. Bank Statement Request Application',
      subtitle: 'Period statement for records / visa / ITR',
      icon: FileText,
      tag: 'Statement #43',
    },
    {
      id: 'mini_statement_request',
      num: 44,
      category: 'statements',
      title: '44. Mini Statement Request',
      subtitle: 'Recent 5 to 20 transactions summary',
      icon: Receipt,
      tag: 'Mini #44',
    },
    {
      id: 'balance_certificate',
      num: 45,
      category: 'statements',
      title: '45. Balance Certificate Request',
      subtitle: 'Attested balance as on date for visa / audit',
      icon: Landmark,
      tag: 'Certificate #45',
    },
    {
      id: 'interest_certificate',
      num: 46,
      category: 'statements',
      title: '46. Interest Certificate Request',
      subtitle: 'Annual interest earned for ITR & tax audit',
      icon: FileSpreadsheet,
      tag: 'Tax #46',
    },
    {
      id: 'account_confirmation_cert',
      num: 47,
      category: 'statements',
      title: '47. Account Confirmation Certificate Request',
      subtitle: 'Verify account active status & credentials',
      icon: CheckCircle2,
      tag: 'Verification #47',
    },
    {
      id: 'no_dues_certificate',
      num: 48,
      category: 'statements',
      title: '48. No Dues Certificate Request',
      subtitle: 'Loan closure NOC & release documents',
      icon: FileCheck,
      tag: 'NOC #48',
    },
    {
      id: 'loan_statement_request',
      num: 49,
      category: 'statements',
      title: '49. Loan Account Statement Request',
      subtitle: 'EMI ledger & interest statement for 80C/24',
      icon: FileText,
      tag: 'Loan #49',
    },
    {
      id: 'bank_account_verification',
      num: 50,
      category: 'statements',
      title: '50. Bank Account Verification Letter Request',
      subtitle: 'Official letterhead verification for scheme',
      icon: ShieldCheck,
      tag: 'Verification #50',
    },

    // 51 to 62: Digital, UPI & NetBanking
    {
      id: 'netbanking_activation',
      num: 51,
      category: 'digital',
      title: '51. Internet Banking Activation Application',
      subtitle: 'Enable net banking with transaction rights',
      icon: Smartphone,
      tag: 'Net Banking #51',
    },
    {
      id: 'netbanking_deactivation',
      num: 52,
      category: 'digital',
      title: '52. Internet Banking Deactivation Application',
      subtitle: 'Emergency suspension of net banking login',
      icon: Ban,
      tag: 'Security #52',
    },
    {
      id: 'mobilebanking_activation',
      num: 53,
      category: 'digital',
      title: '53. Mobile Banking Activation Application',
      subtitle: 'Register mobile banking & app access',
      icon: Smartphone,
      tag: 'Mobile App #53',
    },
    {
      id: 'mobilebanking_deactivation',
      num: 54,
      category: 'digital',
      title: '54. Mobile Banking Deactivation Application',
      subtitle: 'Deactivate app binding & mobile access',
      icon: ShieldOff,
      tag: 'Security #54',
    },
    {
      id: 'upi_activation',
      num: 55,
      category: 'digital',
      title: '55. UPI Activation / Registration Request',
      subtitle: 'Link VPA & register NPCI 24x7 transfers',
      icon: Send,
      tag: 'UPI #55',
    },
    {
      id: 'upi_failed_complaint',
      num: 56,
      category: 'digital',
      title: '56. UPI Transaction Failed Complaint',
      subtitle: 'Money debited but not credited (T+1 TAT)',
      icon: AlertCircle,
      tag: 'UPI #56',
    },
    {
      id: 'wrong_upi_complaint',
      num: 57,
      category: 'digital',
      title: '57. Wrong UPI Transaction Complaint',
      subtitle: 'Fund recall from incorrect VPA transfer',
      icon: ArrowRightLeft,
      tag: 'UPI #57',
    },
    {
      id: 'failed_imps_complaint',
      num: 58,
      category: 'digital',
      title: '58. Failed IMPS Transaction Complaint',
      subtitle: 'Instant remittance debited but pending',
      icon: Clock,
      tag: 'IMPS #58',
    },
    {
      id: 'failed_neft_complaint',
      num: 59,
      category: 'digital',
      title: '59. Failed NEFT Transaction Complaint',
      subtitle: 'Batch transfer delayed / uncredited',
      icon: Clock,
      tag: 'NEFT #59',
    },
    {
      id: 'failed_rtgs_complaint',
      num: 60,
      category: 'digital',
      title: '60. Failed RTGS Transaction Complaint',
      subtitle: 'High-value real-time gross settlement issue',
      icon: Landmark,
      tag: 'RTGS #60',
    },
    {
      id: 'mobilebanking_unlock',
      num: 61,
      category: 'digital',
      title: '61. Mobile Banking User ID Unlock Request',
      subtitle: 'Unlock user ID after wrong MPIN attempts',
      icon: KeyRound,
      tag: 'Unlock #61',
    },
    {
      id: 'netbanking_password_reset',
      num: 62,
      category: 'digital',
      title: '62. Internet Banking Password Reset Request',
      subtitle: 'Reset login / transaction password credentials',
      icon: Lock,
      tag: 'Password #62',
    },
  ];

  const filteredLetters = letterOptions
    .filter((opt) => {
      const matchesCategory = categoryFilter === 'all' || opt.category === categoryFilter;
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        opt.title.toLowerCase().includes(q) ||
        opt.subtitle.toLowerCase().includes(q) ||
        opt.tag.toLowerCase().includes(q) ||
        String(opt.num).includes(q);
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => a.num - b.num);

  const getLetterHeading = () => {
    switch (activeLetter) {
      case 'remove_joint_holder':
        return "Letter #01: Application for Removal of Joint Account Holder's Name";
      case 'add_nominee':
        return 'Letter #02: Application for Adding Nominee (Form DA-1) to Bank Account';
      case 'change_nominee':
        return 'Letter #03: Application for Cancellation / Change of Nominee (Form DA-2 / DA-3)';
      case 'change_address':
        return 'Letter #04: Application for Change of Address in Bank Account Records';
      case 'change_mobile':
        return 'Letter #05: Application for Change / Update of Registered Mobile Number';
      case 'aadhaar_linking':
        return 'Letter #06: Application for Linking Aadhaar Card (UIDAI) and Enabling NPCI / DBT Mapping';
      case 'pan_linking':
        return 'Letter #07: Application for Linking Permanent Account Number (PAN Card) with Bank Account';
      case 'email_update':
        return 'Letter #08: Application for Update / Registration of Email ID for E-Statements and Alerts';
      case 'signature_change':
        return 'Letter #09: Application for Updating / Changing Specimen Signature in Bank Records';
      case 'name_correction':
        return 'Letter #10: Application for Correction / Rectification of Name in Bank Account';
      case 'closure':
        return 'Letter #11: Application for Closure of Bank Account';
      case 'minor_to_major':
        return 'Letter #12: Application for Conversion of Minor to Major Account';
      case 'jandhan_conversion':
        return 'Letter #13: Application for Conversion of Jan Dhan (PMJDY) Account to Normal Savings Account';
      case 'new_atm_card':
        return 'Letter #25: Application for Issuance of New ATM / Debit Card';
      case 'block_atm_card':
        return 'Letter #26: Urgent Request for Blocking / Hotlisting of ATM Debit Card';
      case 'lost_atm_card_complaint':
        return 'Letter #27: Complaint for Lost ATM Debit Card with Police NCR Reference';
      case 'atm_replacement':
        return 'Letter #28: Application for Replacement of Damaged / Expired ATM Debit Card';
      case 'atm_pin_reset':
        return 'Letter #29: Application for ATM PIN Generation / Reset (Green PIN)';
      case 'atm_card_renewal':
        return 'Letter #30: Application for Renewal of Expiring ATM / Debit Card';
      case 'atm_txn_dispute':
        return 'Letter #31: Dispute Form for Unauthorized or Incorrect ATM Transaction';
      case 'atm_failed_withdrawal':
        return 'Letter #32: Complaint Regarding Failed ATM Cash Withdrawal (Amount Debited Not Dispensed)';
      case 'cheque_book_request':
        return 'Letter #33: Application for Issuance of Fresh Cheque Book';
      case 'duplicate_cheque_book':
        return 'Letter #34: Application for Issuance of Duplicate Cheque Book';
      case 'stop_cheque_payment':
        return 'Letter #35: Urgent Request to Stop Payment of Cheque';
      case 'cancel_cheque_request':
        return 'Letter #36: Application for Cancellation of Cheque Book Requisition';
      case 'cheque_revalidation':
        return 'Letter #37: Application for Revalidation / Re-issuance of Expired Cheque';
      case 'cheque_book_not_received':
        return 'Letter #38: Complaint Regarding Non-Receipt of Dispatched Cheque Book';
      case 'duplicate_cheque_request':
        return "Letter #39: Application for Issuance of Duplicate Cheque / Banker's Draft";
      case 'cheque_clearing_complaint':
        return 'Letter #40: Complaint Regarding Delayed Clearing / Non-Credit of Cheque';
      case 'passbook':
        return 'Letter #41: Application for Issuance of New Passbook';
      case 'passbook_correction':
        return 'Letter #42: Application for Correction / Rectification in Bank Passbook';
      case 'statement':
        return 'Letter #43: Application for Issuance of Bank Account Statement';
      case 'mini_statement_request':
        return 'Letter #44: Application for Issuance of Mini Statement';
      case 'balance_certificate':
        return 'Letter #45: Application for Issuance of Bank Balance Certificate';
      case 'interest_certificate':
        return 'Letter #46: Application for Issuance of Bank Interest Certificate (ITR Compliance)';
      case 'account_confirmation_cert':
        return 'Letter #47: Application for Issuance of Account Confirmation Certificate';
      case 'no_dues_certificate':
        return 'Letter #48: Application for Issuance of No Dues Certificate (NOC) on Loan Account';
      case 'loan_statement_request':
        return 'Letter #49: Application for Issuance of Loan Account Detailed Statement';
      case 'bank_account_verification':
        return 'Letter #50: Application for Official Bank Account Verification Letter';
      case 'netbanking_activation':
        return 'Letter #51: Application for Activation of Internet Banking Facility';
      case 'netbanking_deactivation':
        return 'Letter #52: Application for Urgent Deactivation / Suspension of Internet Banking';
      case 'mobilebanking_activation':
        return 'Letter #53: Application for Registration & Activation of Mobile Banking';
      case 'mobilebanking_deactivation':
        return 'Letter #54: Application for Deactivation of Mobile Banking Services';
      case 'upi_activation':
        return 'Letter #55: Application for UPI Activation & Virtual Payment Address Registration';
      case 'upi_failed_complaint':
        return 'Letter #56: Complaint for Failed UPI Transaction (Amount Debited Not Credited)';
      case 'wrong_upi_complaint':
        return 'Letter #57: Urgent Complaint for Recall of Misdirected Wrong UPI Transaction';
      case 'failed_imps_complaint':
        return 'Letter #58: Complaint Regarding Failed IMPS Fund Transfer (RRN Tracking)';
      case 'failed_neft_complaint':
        return 'Letter #59: Complaint Regarding Uncredited NEFT Transaction (UTR Tracking)';
      case 'failed_rtgs_complaint':
        return 'Letter #60: Urgent Complaint Regarding Uncredited RTGS High-Value Transfer';
      case 'mobilebanking_unlock':
        return 'Letter #61: Application for Unlocking Mobile Banking User ID / Access';
      case 'netbanking_password_reset':
        return 'Letter #62: Application for Resetting Internet Banking Password Credentials';
      default:
        return 'Bank Application Letter';
    }
  };

  const categoriesList: Array<{ id: LetterCategory; label: string; count: number }> = [
    { id: 'all', label: 'All Letters', count: 51 },
    { id: 'atm', label: 'ATM & Cards', count: 8 },
    { id: 'cheque', label: 'Cheques', count: 8 },
    { id: 'statements', label: 'Statements & Certs', count: 10 },
    { id: 'digital', label: 'Digital & UPI', count: 12 },
    { id: 'account', label: 'KYC & Account', count: 13 },
  ];

  return (
    <div className="space-y-5">
      {/* 1. Letter Type Selector Grid with Search & Categories */}
      <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-800">
              Select Bank Letter Application
            </span>
            <p className="text-[10px] text-slate-500">
              Official legal format adhering to RBI guidelines & CTS-2010 standards
            </p>
          </div>
          <span className="self-start sm:self-auto text-[10px] text-emerald-800 font-bold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-300">
            51 Official Bank Letters Ready
          </span>
        </div>

        {/* Category Pills Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {categoriesList.map((cat) => {
            const isActive = categoryFilter === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setCategoryFilter(cat.id)}
                className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-emerald-700 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200/80'
                }`}
              >
                <span>{cat.label}</span>
                <span
                  className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold ${
                    isActive ? 'bg-white/20 text-white' : 'bg-white text-slate-600 border border-slate-200'
                  }`}
                >
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search letter by subject, number, or keyword (e.g. UPI, ATM, Cheque, NOC, Statement)..."
            className="w-full pl-8 pr-8 py-1.5 text-xs bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 focus:border-emerald-500 rounded-lg transition-all focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2 top-2 p-0.5 rounded text-slate-400 hover:text-slate-600"
              title="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Letters Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 max-h-[380px] overflow-y-auto pr-1">
          {filteredLetters.map((opt) => {
            const Icon = opt.icon;
            const isSelected = activeLetter === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => onChange('letterType', opt.id)}
                className={`p-2.5 rounded-lg border text-left transition-all relative flex flex-col justify-between ${
                  isSelected
                    ? 'border-emerald-600 bg-emerald-50/70 ring-2 ring-emerald-500/20 shadow-xs text-emerald-950 font-medium'
                    : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between gap-1 w-full">
                  <div
                    className={`w-7 h-7 rounded-md flex items-center justify-center shrink-0 ${
                      isSelected ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <span
                    className={`text-[9px] font-black px-1.5 py-0.5 rounded shrink-0 flex items-center gap-1 ${
                      isSelected
                        ? 'text-emerald-900 bg-emerald-200/90 shadow-2xs'
                        : 'text-slate-600 bg-slate-100 border border-slate-200/70'
                    }`}
                  >
                    <span>#{String(opt.num).padStart(2, '0')}</span>
                    {isSelected && <Check className="w-2.5 h-2.5 text-emerald-700 stroke-[3]" />}
                  </span>
                </div>
                <div className="mt-2 min-w-0">
                  <div className="text-xs font-bold truncate leading-tight">{opt.title}</div>
                  <div className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">
                    {opt.subtitle}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {filteredLetters.length === 0 && (
          <div className="p-4 text-center text-xs text-slate-500 bg-slate-50 rounded-lg border border-dashed border-slate-300">
            No bank letters match &quot;{searchQuery}&quot;. Try searching for &quot;ATM&quot;, &quot;Cheque&quot;, &quot;UPI&quot;, or &quot;Statement&quot;.
          </div>
        )}
      </div>

      {/* Top Middle Bank Logo Preview Banner */}
      <div className="p-3 bg-white border border-slate-200 rounded-xl shadow-xs space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Bank Letterhead Logo (Placed at Top Middle of Document)
          </span>
          <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1">
            <Check className="w-3 h-3" /> Auto-positioned on PDF
          </span>
        </div>
        <div className="flex items-center justify-center p-2.5 bg-slate-50/80 border border-slate-200 rounded-lg">
          <img
            src={selectedBank === 'sbi' ? SBI_LOGO_PATH : MAHABANK_LOGO_PATH}
            alt={selectedBank === 'sbi' ? 'State Bank of India Logo' : 'Bank of Maharashtra Logo'}
            className="h-9 max-w-[200px] object-contain drop-shadow-2xs transition-all duration-300"
          />
        </div>
        <p className="text-[11px] text-center text-slate-600 font-medium">
          {getLetterHeading()} • {selectedBank === 'sbi' ? 'State Bank of India' : 'Bank of Maharashtra'}
        </p>
      </div>

      {/* 2. Branch & Bank Selection (Top Header) with Grid Buttons */}
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5 space-y-3.5">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
            <Building className="w-3.5 h-3.5 text-blue-600" />
            Branch & Bank Selection (Top Header)
          </h4>
          <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
            Click to Switch Bank
          </span>
        </div>

        {/* 2-Column Grid Button for Bank Selection with Official Logos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {/* Bank of Maharashtra Button */}
          <button
            type="button"
            onClick={() => handleBankSelect('bom')}
            className={`p-3 rounded-lg border text-left transition-all relative flex flex-col justify-between gap-2.5 ${
              selectedBank === 'bom'
                ? 'border-blue-600 bg-white ring-2 ring-blue-500/20 shadow-xs text-blue-950'
                : 'border-slate-200 bg-white/70 hover:bg-white text-slate-700 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between gap-2 w-full">
              <div className="h-8 flex items-center px-2 py-0.5 bg-slate-50 border border-slate-200 rounded overflow-hidden">
                <img
                  src={MAHABANK_LOGO_PATH}
                  alt="Bank of Maharashtra Logo"
                  className="h-6 max-w-[130px] object-contain"
                />
              </div>
              {selectedBank === 'bom' ? (
                <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-1.5 py-0.5 rounded flex items-center gap-0.5 shrink-0">
                  <Check className="w-3 h-3" /> Selected
                </span>
              ) : (
                <span className="text-[10px] text-slate-400">Click to Select</span>
              )}
            </div>
            <div>
              <span className="text-xs font-bold block truncate">Bank of Maharashtra</span>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Default: Purna Branch (0124)
              </p>
              <div className="mt-1 text-[10px] font-semibold text-blue-700 flex items-center gap-1">
                <span>✓ Logo placed at top middle of PDF</span>
              </div>
            </div>
          </button>

          {/* State Bank of India Button */}
          <button
            type="button"
            onClick={() => handleBankSelect('sbi')}
            className={`p-3 rounded-lg border text-left transition-all relative flex flex-col justify-between gap-2.5 ${
              selectedBank === 'sbi'
                ? 'border-indigo-600 bg-white ring-2 ring-indigo-500/20 shadow-xs text-indigo-950'
                : 'border-slate-200 bg-white/70 hover:bg-white text-slate-700 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between gap-2 w-full">
              <div className="h-8 flex items-center px-2 py-0.5 bg-slate-50 border border-slate-200 rounded overflow-hidden">
                <img
                  src={SBI_LOGO_PATH}
                  alt="State Bank of India Logo"
                  className="h-6 max-w-[130px] object-contain"
                />
              </div>
              {selectedBank === 'sbi' ? (
                <span className="text-[10px] font-bold text-indigo-700 bg-indigo-100 px-1.5 py-0.5 rounded flex items-center gap-0.5 shrink-0">
                  <Check className="w-3 h-3" /> Selected
                </span>
              ) : (
                <span className="text-[10px] text-slate-400">Click to Select</span>
              )}
            </div>
            <div>
              <span className="text-xs font-bold block truncate">State Bank of India</span>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Default: Nariman Point (00214)
              </p>
              <div className="mt-1 text-[10px] font-semibold text-indigo-700 flex items-center gap-1">
                <span>✓ Logo placed at top middle of PDF</span>
              </div>
            </div>
          </button>
        </div>

        {/* Branch Quick Presets */}
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-600">
              Branch Presets for {selectedBank === 'sbi' ? 'State Bank of India' : 'Bank of Maharashtra'}:
            </span>
            <span className="text-[10px] text-slate-400">Click to auto-fill</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {(selectedBank === 'sbi' ? sbiBranchPresets : bomBranchPresets).map((preset) => (
              <button
                key={preset.code}
                type="button"
                onClick={() => {
                  onChange('statementBranchName', preset.name);
                  onChange('statementBranchCode', preset.code);
                }}
                className={`px-2.5 py-1 text-[11px] font-medium rounded-md border transition-colors ${
                  formData.statementBranchCode === preset.code
                    ? 'bg-blue-100 text-blue-900 border-blue-300 font-semibold'
                    : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* Branch Name, Code, Application Date Input Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
          <div>
            <label className="block text-[11px] font-medium text-slate-600 mb-1">
              Branch Name & City
            </label>
            <input
              type="text"
              value={formData.statementBranchName || (selectedBank === 'sbi' ? 'Nariman Point Branch, Mumbai' : 'Purna Branch, Purna')}
              onChange={(e) => onChange('statementBranchName', e.target.value)}
              placeholder={selectedBank === 'sbi' ? 'Nariman Point Branch, Mumbai' : 'Purna Branch, Purna'}
              className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium text-slate-800"
            />
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-600 mb-1">
              Branch Code
            </label>
            <input
              type="text"
              value={formData.statementBranchCode || (selectedBank === 'sbi' ? '00214' : '0124')}
              onChange={(e) => onChange('statementBranchCode', e.target.value)}
              placeholder={selectedBank === 'sbi' ? '00214' : '0124'}
              className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-600 mb-1">
              Application Date
            </label>
            <input
              type="text"
              value={formData.statementDate || '26/10/2026'}
              onChange={(e) => onChange('statementDate', e.target.value)}
              placeholder="26/10/2026"
              className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
            />
          </div>
        </div>
      </div>

      {/* 3. Active Bank Letter Indicator Banner with Updated Number */}
      {(() => {
        const currentLetterMeta = letterOptions.find((l) => l.id === activeLetter);
        const letterNum = currentLetterMeta?.num || 43;
        const letterNumStr = `#${String(letterNum).padStart(2, '0')}`;
        return (
          <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white rounded-xl p-3 sm:p-3.5 shadow-xs border border-emerald-700/50 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center font-black text-sm text-emerald-300 shadow-inner shrink-0">
                {letterNumStr}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-300 bg-emerald-800/80 px-2 py-0.5 rounded border border-emerald-600/50">
                    Letter {letterNumStr} Active
                  </span>
                  <span className="text-[11px] text-emerald-200/90 font-medium hidden sm:inline">
                    • {selectedBank === 'sbi' ? 'State Bank of India' : 'Bank of Maharashtra'}
                  </span>
                </div>
                <h3 className="text-xs sm:text-sm font-bold text-white truncate mt-1">
                  {currentLetterMeta?.title || getLetterHeading()}
                </h3>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-300 bg-white/10 px-2.5 py-1 rounded-md border border-white/10 shrink-0">
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span>Standard Format Ready</span>
            </div>
          </div>
        );
      })()}

      {/* 4. Letter-Specific Details Section */}
      {/* CASE A: Statement Request */}
      {activeLetter === 'statement' && (
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5 space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-blue-600" />
              Statement Period (From - To)
            </label>
          </div>

          <div className="flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={() => handlePreset('last_6_months')}
              className="px-2.5 py-1 text-[11px] font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-md transition-colors"
            >
              Last 6 Months
            </button>
            <button
              type="button"
              onClick={() => handlePreset('fy_2025_2026')}
              className="px-2.5 py-1 text-[11px] font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-md transition-colors"
            >
              Current Financial Year
            </button>
            <button
              type="button"
              onClick={() => handlePreset('last_3_months')}
              className="px-2.5 py-1 text-[11px] font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-md transition-colors"
            >
              Last 3 Months
            </button>
            <button
              type="button"
              onClick={() => handlePreset('current_month')}
              className="px-2.5 py-1 text-[11px] font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-md transition-colors"
            >
              October 2026
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Period From (DD/MM/YYYY)
              </label>
              <input
                type="text"
                value={formData.statementPeriodFrom || '01/04/2026'}
                onChange={(e) => onChange('statementPeriodFrom', e.target.value)}
                placeholder="01/04/2026"
                className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Period To (DD/MM/YYYY)
              </label>
              <input
                type="text"
                value={formData.statementPeriodTo || '26/10/2026'}
                onChange={(e) => onChange('statementPeriodTo', e.target.value)}
                placeholder="26/10/2026"
                className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
              />
            </div>
          </div>
        </div>
      )}

      {/* CASE B: Issuance of New Passbook */}
      {activeLetter === 'passbook' && (
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5 space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-blue-600" />
              Reason for Issuing New Passbook
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {[
              { id: 'exhausted', label: '1. Fully Used / Exhausted', desc: 'Old passbook pages are completely filled' },
              { id: 'lost', label: '2. Lost / Misplaced', desc: 'Passbook is lost or missing' },
              { id: 'damaged', label: '3. Damaged / Torn', desc: 'Passbook pages are mutilated or illegible' },
            ].map((r) => (
              <label
                key={r.id}
                className={`p-2.5 border rounded-lg cursor-pointer transition-all flex flex-col justify-between ${
                  formData.passbookReason === r.id
                    ? 'border-blue-600 bg-white shadow-xs font-medium text-blue-900 ring-1 ring-blue-500/20'
                    : 'border-slate-200 bg-white/70 hover:bg-white text-slate-700'
                }`}
              >
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="passbookReason"
                    value={r.id}
                    checked={formData.passbookReason === r.id}
                    onChange={() => onChange('passbookReason', r.id as any)}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-xs font-bold">{r.label}</span>
                </div>
                <span className="text-[10px] text-slate-500 mt-1 block pl-5">{r.desc}</span>
              </label>
            ))}
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-600 mb-1">
              Previous Passbook Number / Particulars (Optional)
            </label>
            <input
              type="text"
              value={formData.oldPassbookNumber || ''}
              onChange={(e) => onChange('oldPassbookNumber', e.target.value.toUpperCase())}
              placeholder="e.g. PB-904812"
              className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
            />
          </div>
        </div>
      )}

      {/* CASE C: Closure of Account */}
      {activeLetter === 'closure' && (
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5 space-y-3.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <XCircle className="w-3.5 h-3.5 text-rose-600" />
              Account Closure Details & Remaining Balance Refund
            </label>
          </div>

          {/* Reason */}
          <div>
            <label className="block text-[11px] font-medium text-slate-600 mb-1.5">
              Reason for Account Closure *
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'relocation', label: 'Relocation to another city' },
                { id: 'multiple_accounts', label: 'Multiple accounts elsewhere' },
                { id: 'better_services', label: 'Personal convenience' },
                { id: 'others', label: 'Other custom reason' },
              ].map((reason) => (
                <label
                  key={reason.id}
                  className={`p-2 border rounded-md text-xs cursor-pointer transition-all ${
                    formData.closureReason === reason.id
                      ? 'border-rose-600 bg-white text-rose-900 font-semibold shadow-2xs'
                      : 'border-slate-200 bg-white/70 hover:bg-white text-slate-700'
                  }`}
                >
                  <input
                    type="radio"
                    name="closureReason"
                    value={reason.id}
                    checked={formData.closureReason === reason.id}
                    onChange={() => onChange('closureReason', reason.id as any)}
                    className="mr-1.5 text-rose-600"
                  />
                  {reason.label}
                </label>
              ))}
            </div>
            {formData.closureReason === 'others' && (
              <input
                type="text"
                value={formData.closureReasonOther || ''}
                onChange={(e) => onChange('closureReasonOther', e.target.value)}
                placeholder="Specify your reason for account closure"
                className="mt-2 w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-rose-500"
              />
            )}
          </div>

          {/* Balance Refund Mode */}
          <div className="p-3 bg-white border border-slate-200 rounded-lg space-y-2">
            <span className="text-xs font-bold text-slate-800 flex items-center gap-1">
              <ArrowRightLeft className="w-3.5 h-3.5 text-blue-600" />
              Refund of Remaining Account Balance:
            </span>
            <div className="flex gap-4">
              <label className="flex items-center gap-1.5 text-xs font-medium text-slate-700 cursor-pointer">
                <input
                  type="radio"
                  name="refundMode"
                  value="transfer"
                  checked={formData.refundMode !== 'cash' && formData.refundMode !== 'dd'}
                  onChange={() => onChange('refundMode', 'transfer')}
                  className="text-blue-600"
                />
                Electronic Transfer (NEFT/RTGS)
              </label>
              <label className="flex items-center gap-1.5 text-xs font-medium text-slate-700 cursor-pointer">
                <input
                  type="radio"
                  name="refundMode"
                  value="cash"
                  checked={formData.refundMode === 'cash'}
                  onChange={() => onChange('refundMode', 'cash')}
                  className="text-blue-600"
                />
                Cash at Counter
              </label>
              <label className="flex items-center gap-1.5 text-xs font-medium text-slate-700 cursor-pointer">
                <input
                  type="radio"
                  name="refundMode"
                  value="dd"
                  checked={formData.refundMode === 'dd'}
                  onChange={() => onChange('refundMode', 'dd')}
                  className="text-blue-600"
                />
                Demand Draft
              </label>
            </div>

            {formData.refundMode !== 'cash' && formData.refundMode !== 'dd' && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                <div>
                  <label className="block text-[10px] text-slate-500 mb-0.5">Beneficiary Bank Name</label>
                  <input
                    type="text"
                    value={formData.transferBankName || ''}
                    onChange={(e) => onChange('transferBankName', e.target.value)}
                    placeholder="e.g. State Bank of India"
                    className="w-full px-2 py-1 text-xs border border-slate-300 rounded"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-500 mb-0.5">Beneficiary Account No.</label>
                  <input
                    type="text"
                    value={formData.transferAccountNumber || ''}
                    onChange={(e) => onChange('transferAccountNumber', e.target.value.replace(/\D/g, ''))}
                    placeholder="e.g. 20481928471"
                    className="w-full px-2 py-1 text-xs font-mono border border-slate-300 rounded"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-500 mb-0.5">IFSC Code</label>
                  <input
                    type="text"
                    value={formData.transferIfscCode || ''}
                    onChange={(e) => onChange('transferIfscCode', e.target.value.toUpperCase())}
                    placeholder="e.g. SBIN0000214"
                    className="w-full px-2 py-1 text-xs font-mono uppercase border border-slate-300 rounded"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Surrendered Items */}
          <div className="flex flex-wrap gap-4 text-xs font-medium text-slate-700">
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.surrenderChequeBook ?? true}
                onChange={(e) => onChange('surrenderChequeBook', e.target.checked)}
                className="rounded text-rose-600"
              />
              Surrendering unused cheque leaves
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.surrenderAtmCard ?? true}
                onChange={(e) => onChange('surrenderAtmCard', e.target.checked)}
                className="rounded text-rose-600"
              />
              Surrendering ATM / Debit Card
            </label>
          </div>
        </div>
      )}

      {/* CASE D: Minor to Major Conversion */}
      {activeLetter === 'minor_to_major' && (
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5 space-y-3.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
              Attainment of Majority & Guardian Relief Details
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Date of Birth of Account Holder *
              </label>
              <input
                type="text"
                value={formData.minorDob || formData.dob || '14/08/2008'}
                onChange={(e) => onChange('minorDob', e.target.value)}
                placeholder="DD/MM/YYYY (e.g. 14/08/2008)"
                className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Date of Attaining Majority (18 Years) *
              </label>
              <input
                type="text"
                value={formData.dateOfMajority || '14/08/2026'}
                onChange={(e) => onChange('dateOfMajority', e.target.value)}
                placeholder="DD/MM/YYYY (e.g. 14/08/2026)"
                className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Guardian to be Relieved (Full Name) *
              </label>
              <input
                type="text"
                value={formData.minorGuardianName || 'RAMESH SHARMA'}
                onChange={(e) => onChange('minorGuardianName', e.target.value.toUpperCase())}
                placeholder="e.g. RAMESH SHARMA"
                className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-500 uppercase font-medium"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Relationship with Account Holder
              </label>
              <select
                value={formData.minorGuardianRelationship || 'Father'}
                onChange={(e) => onChange('minorGuardianRelationship', e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-500"
              >
                <option value="Father">Father</option>
                <option value="Mother">Mother</option>
                <option value="Legal Guardian">Court-Appointed Legal Guardian</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 border-t border-slate-200">
            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Major Account Holder PAN Card *
              </label>
              <input
                type="text"
                maxLength={10}
                value={formData.majorPanNumber || formData.pan || 'ABCPS1234K'}
                onChange={(e) => onChange('majorPanNumber', e.target.value.toUpperCase())}
                placeholder="ABCPS1234K"
                className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-md font-mono uppercase font-medium"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Major Account Holder Aadhaar Number *
              </label>
              <input
                type="text"
                maxLength={14}
                value={formData.majorAadhaarNumber || formData.idDocumentNo || '4820 1948 5721'}
                onChange={(e) => onChange('majorAadhaarNumber', e.target.value)}
                placeholder="4820 1948 5721"
                className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-md font-mono font-medium"
              />
            </div>
          </div>

          <div className="p-2.5 bg-emerald-50/80 border border-emerald-200 rounded-md flex items-center gap-2 text-xs text-emerald-900 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Fresh specimen signature & self-attested KYC documents enclosed for independent operation.</span>
          </div>
        </div>
      )}

      {/* 3e. Jan Dhan (PMJDY) to Normal Savings Conversion Panel */}
      {activeLetter === 'jandhan_conversion' && (
        <div className="bg-amber-50/60 border border-amber-200 rounded-lg p-3.5 space-y-3.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
              <ArrowRightLeft className="w-3.5 h-3.5 text-amber-600" />
              Jan Dhan (PMJDY / BSBDA) to Regular Savings Account Conversion
            </label>
            <span className="text-[10px] font-semibold text-amber-800 bg-amber-100 px-2 py-0.5 rounded border border-amber-300">
              PMJDY Upgrade
            </span>
          </div>

          <p className="text-[11px] text-amber-900 leading-relaxed bg-white/80 p-2.5 rounded border border-amber-200">
            Converts your PMJDY (BSBDA) account to a fully operational Regular Savings Account. This lifts the ₹50,000 maximum balance ceiling and 4 withdrawals/month restriction, enables issuance of personalized Cheque Book, and activates full Internet Banking features.
          </p>

          {/* Reason for Conversion */}
          <div>
            <label className="block text-[11px] font-medium text-slate-700 mb-1.5">
              Primary Reason for Conversion *
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[
                { id: 'limits_upgrade', label: 'Transaction & Deposit Limits Upgrade (Remove PMJDY caps)' },
                { id: 'cheque_book', label: 'Requirement of Cheque Book & Full Net Banking' },
                { id: 'salary_credits', label: 'Salary / Recurring Institutional Direct Credits' },
                { id: 'business_needs', label: 'Commercial & Higher Turnover Requirements' },
                { id: 'others', label: 'Other Custom Reason' },
              ].map((reason) => (
                <label
                  key={reason.id}
                  className={`p-2 border rounded-md text-xs cursor-pointer transition-all flex items-start gap-2 ${
                    (formData.janDhanReason || 'limits_upgrade') === reason.id
                      ? 'border-amber-600 bg-white text-amber-950 font-semibold shadow-2xs'
                      : 'border-slate-200 bg-white/70 hover:bg-white text-slate-700'
                  }`}
                >
                  <input
                    type="radio"
                    name="janDhanReason"
                    value={reason.id}
                    checked={(formData.janDhanReason || 'limits_upgrade') === reason.id}
                    onChange={() => onChange('janDhanReason', reason.id as any)}
                    className="mt-0.5 text-amber-600"
                  />
                  <span>{reason.label}</span>
                </label>
              ))}
            </div>

            {formData.janDhanReason === 'others' && (
              <input
                type="text"
                value={formData.janDhanReasonOther || ''}
                onChange={(e) => onChange('janDhanReasonOther', e.target.value)}
                placeholder="Specify your specific reason for converting your Jan Dhan account"
                className="mt-2 w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            )}
          </div>

          {/* Initial Deposit for Minimum Balance */}
          <div className="p-3 bg-white border border-amber-200 rounded-lg space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <label className="text-xs font-bold text-slate-800">
                Initial Deposit for Minimum Balance (₹) *
              </label>
              <div className="flex gap-1.5">
                {['1000', '2000', '3000', '5000'].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => onChange('janDhanInitialDeposit', amt)}
                    className={`px-2 py-0.5 text-[10px] rounded border transition-colors ${
                      formData.janDhanInitialDeposit === amt
                        ? 'bg-amber-600 text-white border-amber-600 font-bold'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    ₹{amt}
                  </button>
                ))}
              </div>
            </div>
            <div className="relative">
              <span className="absolute left-2.5 top-1.5 text-xs font-bold text-slate-500">₹</span>
              <input
                type="text"
                value={formData.janDhanInitialDeposit || '1000'}
                onChange={(e) => onChange('janDhanInitialDeposit', e.target.value.replace(/\D/g, ''))}
                placeholder="1000"
                className="w-full pl-6 pr-2.5 py-1.5 text-xs border border-slate-300 rounded-md font-mono font-medium focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>
            <p className="text-[10px] text-slate-500">
              Amount tendered at the branch counter or already present in account towards opening minimum average balance.
            </p>
          </div>

          {/* Full KYC Document Checklist */}
          <div className="p-3 bg-white border border-amber-200 rounded-lg space-y-2">
            <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Enclosed Full-KYC Documents Checklist:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <label className="flex items-center gap-2 p-1.5 bg-slate-50 rounded border border-slate-200 cursor-pointer hover:bg-slate-100">
                <input
                  type="checkbox"
                  checked={formData.janDhanKycAadhaar !== false}
                  onChange={(e) => onChange('janDhanKycAadhaar', e.target.checked)}
                  className="rounded text-emerald-600"
                />
                <span className="font-medium text-slate-700">Self-attested Aadhaar Card copy</span>
              </label>

              <label className="flex items-center gap-2 p-1.5 bg-slate-50 rounded border border-slate-200 cursor-pointer hover:bg-slate-100">
                <input
                  type="checkbox"
                  checked={formData.janDhanKycPan !== false}
                  onChange={(e) => onChange('janDhanKycPan', e.target.checked)}
                  className="rounded text-emerald-600"
                />
                <span className="font-medium text-slate-700">Self-attested PAN Card / Form 60</span>
              </label>

              <label className="flex items-center gap-2 p-1.5 bg-slate-50 rounded border border-slate-200 cursor-pointer hover:bg-slate-100">
                <input
                  type="checkbox"
                  checked={formData.janDhanKycPhoto !== false}
                  onChange={(e) => onChange('janDhanKycPhoto', e.target.checked)}
                  className="rounded text-emerald-600"
                />
                <span className="font-medium text-slate-700">2 Recent Passport Size Photographs</span>
              </label>

              <label className="flex items-center gap-2 p-1.5 bg-slate-50 rounded border border-slate-200 cursor-pointer hover:bg-slate-100">
                <input
                  type="checkbox"
                  checked={true}
                  readOnly
                  className="rounded text-emerald-600"
                />
                <span className="font-medium text-slate-700">Fresh Specimen Signature Sheet</span>
              </label>
            </div>
          </div>

          {/* Terms & Conditions Acceptance */}
          <label className="p-2.5 bg-amber-100/70 border border-amber-300 rounded-md flex items-start gap-2 text-xs text-amber-950 font-medium cursor-pointer">
            <input
              type="checkbox"
              checked={formData.janDhanAgreeMinBalance !== false}
              onChange={(e) => onChange('janDhanAgreeMinBalance', e.target.checked)}
              className="mt-0.5 rounded text-amber-700"
            />
            <span>
              I agree to abide by the Minimum Balance requirements, quarterly Average Monthly Balance (AMB), and scheduled banking service charges as applicable to Regular Savings Accounts.
            </span>
          </label>
        </div>
      )}

      {/* 3e. Letter Specific Options: Name Correction */}
      {activeLetter === 'name_correction' && (
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3.5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Edit3 className="w-4 h-4 text-emerald-600" />
              Name Correction / Rectification in Bank Records
            </h4>
            <span className="text-[10px] text-emerald-800 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Old & New Name Tracking
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Existing (Old) Name in Bank Records *
              </label>
              <input
                type="text"
                value={formData.oldApplicantName || ''}
                onChange={(e) => onChange('oldApplicantName', e.target.value.toUpperCase())}
                placeholder="e.g. RAJESH SHARMA"
                className="w-full px-2.5 py-1.5 text-xs uppercase bg-white border border-slate-300 rounded focus:border-emerald-500 focus:outline-hidden font-semibold"
              />
              <p className="text-[10px] text-slate-500 mt-0.5">
                The name currently printed on your passbook / account records
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-[11px] font-semibold text-slate-700">
                  Correct (New) Name to be Updated *
                </label>
                <button
                  type="button"
                  onClick={() => {
                    const full = [formData.firstName, formData.middleName, formData.lastName].filter(Boolean).join(' ');
                    if (full) onChange('newApplicantName', full.toUpperCase());
                  }}
                  className="text-[9px] text-emerald-700 hover:underline font-medium"
                >
                  Use Applicant Name
                </button>
              </div>
              <input
                type="text"
                value={formData.newApplicantName || ''}
                onChange={(e) => onChange('newApplicantName', e.target.value.toUpperCase())}
                placeholder="e.g. RAJESH KUMAR SHARMA"
                className="w-full px-2.5 py-1.5 text-xs uppercase bg-white border border-slate-300 rounded focus:border-emerald-500 focus:outline-hidden font-semibold"
              />
              <p className="text-[10px] text-slate-500 mt-0.5">
                Exact full legal name as per supporting KYC identity proof
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Reason for Name Correction *
              </label>
              <select
                value={formData.nameCorrectionReason || 'spelling_error'}
                onChange={(e) => onChange('nameCorrectionReason', e.target.value as any)}
                className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded focus:border-emerald-500 focus:outline-hidden font-medium"
              >
                <option value="spelling_error">Typographical / Spelling Discrepancy</option>
                <option value="marriage">Post-Marriage Surname / Marital Name Change</option>
                <option value="gazette">Government Gazette Notification</option>
                <option value="aadhaar_pan_mismatch">Alignment with Aadhaar & PAN Card</option>
                <option value="others">Other Justified Reason</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Supporting Identity Document *
              </label>
              <select
                value={formData.nameCorrectionDocType || 'aadhaar'}
                onChange={(e) => onChange('nameCorrectionDocType', e.target.value as any)}
                className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded focus:border-emerald-500 focus:outline-hidden font-medium"
              >
                <option value="aadhaar">Aadhaar Card (UIDAI)</option>
                <option value="pan">PAN Card (Income Tax Dept)</option>
                <option value="marriage_cert">Marriage Certificate</option>
                <option value="gazette">Official Government Gazette Copy</option>
                <option value="passport">Indian Passport</option>
                <option value="affidavit">Notarized Legal Affidavit</option>
              </select>
            </div>
          </div>

          {formData.nameCorrectionReason === 'others' && (
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Specify Reason Details
              </label>
              <input
                type="text"
                value={formData.nameCorrectionReasonOther || ''}
                onChange={(e) => onChange('nameCorrectionReasonOther', e.target.value)}
                placeholder="Explain the reason for name modification..."
                className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded focus:border-emerald-500 focus:outline-hidden"
              />
            </div>
          )}

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
              Document Number *
            </label>
            <input
              type="text"
              value={formData.nameCorrectionDocNo || formData.idDocumentNo || ''}
              onChange={(e) => onChange('nameCorrectionDocNo', e.target.value.toUpperCase())}
              placeholder="e.g. 4820 1948 5721 / ABCPS1234K"
              className="w-full sm:w-1/2 px-2.5 py-1.5 text-xs font-mono uppercase bg-white border border-slate-300 rounded focus:border-emerald-500 focus:outline-hidden font-medium"
            />
          </div>

          {/* Checklist */}
          <div className="pt-2 border-t border-slate-100">
            <span className="text-[11px] font-bold text-slate-700 block mb-1.5 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Enclosed Supporting Documents:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <label className="flex items-center gap-2 p-1.5 bg-slate-50 rounded border border-slate-200 cursor-pointer hover:bg-slate-100">
                <input
                  type="checkbox"
                  checked={formData.nameCorrectionEncloseAadhaar !== false}
                  onChange={(e) => onChange('nameCorrectionEncloseAadhaar', e.target.checked)}
                  className="rounded text-emerald-600"
                />
                <span className="font-medium text-slate-700">Self-attested Identity Proof (Aadhaar / Passport)</span>
              </label>

              <label className="flex items-center gap-2 p-1.5 bg-slate-50 rounded border border-slate-200 cursor-pointer hover:bg-slate-100">
                <input
                  type="checkbox"
                  checked={formData.nameCorrectionEnclosePan !== false}
                  onChange={(e) => onChange('nameCorrectionEnclosePan', e.target.checked)}
                  className="rounded text-emerald-600"
                />
                <span className="font-medium text-slate-700">Self-attested PAN Card Copy</span>
              </label>

              <label className="flex items-center gap-2 p-1.5 bg-slate-50 rounded border border-slate-200 cursor-pointer hover:bg-slate-100">
                <input
                  type="checkbox"
                  checked={formData.nameCorrectionEncloseGazette === true}
                  onChange={(e) => onChange('nameCorrectionEncloseGazette', e.target.checked)}
                  className="rounded text-emerald-600"
                />
                <span className="font-medium text-slate-700">Gazette Copy / Marriage Certificate (if applicable)</span>
              </label>

              <label className="flex items-center gap-2 p-1.5 bg-slate-50 rounded border border-slate-200 cursor-pointer hover:bg-slate-100">
                <input
                  type="checkbox"
                  checked={formData.nameCorrectionEncloseSpecimenSign !== false}
                  onChange={(e) => onChange('nameCorrectionEncloseSpecimenSign', e.target.checked)}
                  className="rounded text-emerald-600"
                />
                <span className="font-medium text-slate-700">Fresh Specimen Signature & Photographs</span>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* CASE G: Remove Joint Account Holder's Name */}
      {activeLetter === 'remove_joint_holder' && (
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5 space-y-3.5">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <UserMinus className="w-3.5 h-3.5 text-rose-600" />
              Remove Joint Account Holder Details
            </h4>
            <span className="text-[10px] text-rose-700 font-semibold bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
              Joint Holder Removal
            </span>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-600 mb-1">
              Full Name of Joint Account Holder to be Removed *
            </label>
            <input
              type="text"
              value={formData.jointHolderNameToRemove || ''}
              onChange={(e) => onChange('jointHolderNameToRemove', e.target.value.toUpperCase())}
              placeholder="e.g. PRIYA RAMESH SHARMA"
              className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 font-semibold"
            />
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-600 mb-1">
              Reason for Removal of Joint Holder *
            </label>
            <select
              value={formData.jointHolderRemovalReason || 'consent_given'}
              onChange={(e) => onChange('jointHolderRemovalReason', e.target.value as any)}
              className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
            >
              <option value="consent_given">Mutual Signed Consent / Request of Joint Holder</option>
              <option value="deceased">Demise of Joint Holder (Death Certificate Attached)</option>
              <option value="mutual_agreement">Separation / Family Settlement / Mutual Relinquishment</option>
              <option value="others">Other Specific Reason</option>
            </select>
          </div>

          {formData.jointHolderRemovalReason === 'deceased' && (
            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Death Certificate Registration / Document Number
              </label>
              <input
                type="text"
                value={formData.jointHolderDeathCertNo || ''}
                onChange={(e) => onChange('jointHolderDeathCertNo', e.target.value.toUpperCase())}
                placeholder="e.g. DC/MUM/2026/89412"
                className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
              />
            </div>
          )}

          <div className="pt-1">
            <label className="flex items-center gap-2 p-2 bg-white rounded border border-slate-200 cursor-pointer hover:bg-slate-50 text-xs">
              <input
                type="checkbox"
                checked={formData.jointHolderOperateSingle !== false}
                onChange={(e) => onChange('jointHolderOperateSingle', e.target.checked)}
                className="rounded text-blue-600"
              />
              <span className="font-semibold text-slate-800">
                Request to convert operation mode to Single / Self (Sole Operating Authority)
              </span>
            </label>
          </div>
        </div>
      )}

      {/* CASE H: Add Nominee (Form DA-1) */}
      {activeLetter === 'add_nominee' && (
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5 space-y-3.5">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <UserPlus className="w-3.5 h-3.5 text-emerald-600" />
              Add Nominee Details (Form DA-1)
            </h4>
            <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Form DA-1
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Full Name of Nominee *
              </label>
              <input
                type="text"
                value={formData.newNomineeName || ''}
                onChange={(e) => onChange('newNomineeName', e.target.value.toUpperCase())}
                placeholder="e.g. SNEHA RAJESH SHARMA"
                className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 font-semibold"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Relationship with Account Holder *
              </label>
              <input
                type="text"
                value={formData.newNomineeRelationship || ''}
                onChange={(e) => onChange('newNomineeRelationship', e.target.value)}
                placeholder="e.g. Spouse / Son / Daughter / Mother"
                className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Age of Nominee (Years)
              </label>
              <input
                type="text"
                value={formData.newNomineeAge || ''}
                onChange={(e) => onChange('newNomineeAge', e.target.value.replace(/\D/g, ''))}
                placeholder="e.g. 32"
                maxLength={3}
                className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Date of Birth (if Minor)
              </label>
              <input
                type="text"
                value={formData.newNomineeDob || ''}
                onChange={(e) => onChange('newNomineeDob', e.target.value)}
                placeholder="DD/MM/YYYY (if minor)"
                className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-600 mb-1">
              Nominee Residential Address
            </label>
            <input
              type="text"
              value={formData.newNomineeAddress || ''}
              onChange={(e) => onChange('newNomineeAddress', e.target.value.toUpperCase())}
              placeholder="Leave blank to use Account Holder Address automatically"
              className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>
      )}

      {/* CASE I: Change / Cancellation of Nominee (Form DA-2 / DA-3) */}
      {activeLetter === 'change_nominee' && (
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5 space-y-3.5">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-amber-600" />
              Change / Cancellation of Nominee (DA-2 / DA-3)
            </h4>
            <span className="text-[10px] text-amber-700 font-semibold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
              Form DA-2 & DA-3
            </span>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-600 mb-1">
              Existing / Previous Nominee Name to be Cancelled (Form DA-2) *
            </label>
            <input
              type="text"
              value={formData.existingNomineeName || ''}
              onChange={(e) => onChange('existingNomineeName', e.target.value.toUpperCase())}
              placeholder="e.g. RAMESH CHANDRA SHARMA"
              className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 font-semibold"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                New Nominee Name to Register (Form DA-3) *
              </label>
              <input
                type="text"
                value={formData.revisedNomineeName || ''}
                onChange={(e) => onChange('revisedNomineeName', e.target.value.toUpperCase())}
                placeholder="e.g. AARAV RAJESH SHARMA"
                className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 font-semibold"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Relationship with Account Holder *
              </label>
              <input
                type="text"
                value={formData.revisedNomineeRelationship || ''}
                onChange={(e) => onChange('revisedNomineeRelationship', e.target.value)}
                placeholder="e.g. Son / Daughter / Spouse"
                className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Age of New Nominee (Years)
              </label>
              <input
                type="text"
                value={formData.revisedNomineeAge || ''}
                onChange={(e) => onChange('revisedNomineeAge', e.target.value.replace(/\D/g, ''))}
                placeholder="e.g. 14"
                maxLength={3}
                className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                New Nominee Address
              </label>
              <input
                type="text"
                value={formData.revisedNomineeAddress || ''}
                onChange={(e) => onChange('revisedNomineeAddress', e.target.value.toUpperCase())}
                placeholder="Leave blank for same as account holder"
                className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      )}

      {/* CASE J: Change of Address */}
      {activeLetter === 'change_address' && (
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5 space-y-3.5">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Home className="w-3.5 h-3.5 text-sky-600" />
              New Address Details
            </h4>
            <span className="text-[10px] text-sky-700 font-semibold bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
              Address Update
            </span>
          </div>

          <div className="space-y-2">
            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                New Flat / Building / Street Address Line 1 *
              </label>
              <input
                type="text"
                value={formData.newAddressLine1 || ''}
                onChange={(e) => onChange('newAddressLine1', e.target.value.toUpperCase())}
                placeholder="e.g. FLAT 701, HIGH BREEZE TOWERS"
                className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 font-semibold"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Landmark / Area / Road Address Line 2
              </label>
              <input
                type="text"
                value={formData.newAddressLine2 || ''}
                onChange={(e) => onChange('newAddressLine2', e.target.value.toUpperCase())}
                placeholder="e.g. NEAR CITY MALL, SENAPATI BAPAT MARG"
                className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">City *</label>
              <input
                type="text"
                value={formData.newAddressCity || ''}
                onChange={(e) => onChange('newAddressCity', e.target.value.toUpperCase())}
                placeholder="MUMBAI"
                className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">State *</label>
              <input
                type="text"
                value={formData.newAddressState || 'MAHARASHTRA'}
                onChange={(e) => onChange('newAddressState', e.target.value.toUpperCase())}
                placeholder="MAHARASHTRA"
                className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">PIN Code *</label>
              <input
                type="text"
                value={formData.newAddressPincode || ''}
                onChange={(e) => onChange('newAddressPincode', e.target.value.replace(/\D/g, ''))}
                placeholder="400013"
                maxLength={6}
                className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono font-semibold"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Address Proof Document Type
              </label>
              <select
                value={formData.addressProofDocType || 'aadhaar'}
                onChange={(e) => onChange('addressProofDocType', e.target.value as any)}
                className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="aadhaar">Aadhaar Card</option>
                <option value="voter_id">Voter ID Card (EPIC)</option>
                <option value="passport">Passport</option>
                <option value="utility_bill">Electricity / Utility Bill</option>
                <option value="rent_agreement">Registered Rent Agreement</option>
                <option value="driving_licence">Driving Licence</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Document / Proof Number
              </label>
              <input
                type="text"
                value={formData.addressProofDocNo || ''}
                onChange={(e) => onChange('addressProofDocNo', e.target.value.toUpperCase())}
                placeholder="e.g. 4820 1948 5721"
                className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
              />
            </div>
          </div>
        </div>
      )}

      {/* CASE K: Change of Mobile Number */}
      {activeLetter === 'change_mobile' && (
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5 space-y-3.5">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <PhoneCall className="w-3.5 h-3.5 text-emerald-600" />
              Mobile Number Change Details
            </h4>
            <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Mobile Registration
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Previous / Old Registered Mobile Number *
              </label>
              <input
                type="text"
                value={formData.oldMobileNumber || ''}
                onChange={(e) => onChange('oldMobileNumber', e.target.value.replace(/\D/g, ''))}
                placeholder="e.g. 9820145678"
                maxLength={10}
                className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                New Mobile Number to Register *
              </label>
              <input
                type="text"
                value={formData.newMobileNumber || ''}
                onChange={(e) => onChange('newMobileNumber', e.target.value.replace(/\D/g, ''))}
                placeholder="e.g. 9970996060"
                maxLength={10}
                className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono font-bold text-emerald-950 ring-1 ring-emerald-300"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-600 mb-1">
              Reason for Mobile Update
            </label>
            <select
              value={formData.mobileChangeReason || 'number_changed'}
              onChange={(e) => onChange('mobileChangeReason', e.target.value as any)}
              className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="number_changed">Mobile Number Changed</option>
              <option value="lost_sim">SIM Card Lost / Damaged</option>
              <option value="never_registered">Fresh Mobile Number Registration</option>
              <option value="others">Other Reasons</option>
            </select>
          </div>
        </div>
      )}

      {/* CASE L: Aadhaar Linking & NPCI / DBT Mapping */}
      {activeLetter === 'aadhaar_linking' && (
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5 space-y-3.5">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Fingerprint className="w-3.5 h-3.5 text-indigo-600" />
              Aadhaar Seeding & NPCI / DBT Mapping
            </h4>
            <span className="text-[10px] text-indigo-700 font-semibold bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
              UIDAI & NPCI
            </span>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-600 mb-1">
              12-Digit Aadhaar Number *
            </label>
            <input
              type="text"
              value={formData.aadhaarNumberForLinking || ''}
              onChange={(e) => onChange('aadhaarNumberForLinking', e.target.value)}
              placeholder="e.g. 4820 1948 5721"
              maxLength={14}
              className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono font-bold tracking-widest"
            />
          </div>

          <div className="space-y-2 pt-1">
            <label className="flex items-center gap-2 p-2 bg-white rounded border border-slate-200 cursor-pointer hover:bg-slate-50 text-xs">
              <input
                type="checkbox"
                checked={formData.enableDbtMapping !== false}
                onChange={(e) => onChange('enableDbtMapping', e.target.checked)}
                className="rounded text-indigo-600"
              />
              <span className="font-semibold text-slate-800">
                Map bank account with NPCI Mapper for receiving Direct Benefit Transfer (DBT) & Subsidies
              </span>
            </label>

            <label className="flex items-center gap-2 p-2 bg-white rounded border border-slate-200 cursor-pointer hover:bg-slate-50 text-xs">
              <input
                type="checkbox"
                checked={formData.consentBiometricAuth !== false}
                onChange={(e) => onChange('consentBiometricAuth', e.target.checked)}
                className="rounded text-indigo-600"
              />
              <span className="text-slate-700">
                I give voluntary consent to the bank to verify and seed my Aadhaar number for KYC
              </span>
            </label>
          </div>
        </div>
      )}

      {/* CASE M: PAN Linking Application */}
      {activeLetter === 'pan_linking' && (
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5 space-y-3.5">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <CreditCard className="w-3.5 h-3.5 text-blue-600" />
              PAN Card Linking Details
            </h4>
            <span className="text-[10px] text-blue-700 font-semibold bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              Tax Compliance
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                10-Character Permanent Account Number (PAN) *
              </label>
              <input
                type="text"
                value={formData.panNumberForLinking || ''}
                onChange={(e) => onChange('panNumberForLinking', e.target.value.toUpperCase())}
                placeholder="e.g. ABCPS1234K"
                maxLength={10}
                className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono font-bold tracking-wider"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Name Exactly as printed on PAN Card
              </label>
              <input
                type="text"
                value={formData.panCardHolderName || ''}
                onChange={(e) => onChange('panCardHolderName', e.target.value.toUpperCase())}
                placeholder="e.g. RAJESH KUMAR SHARMA"
                className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 font-semibold"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-600 mb-1">
              Date of Birth as per PAN Card (DD/MM/YYYY)
            </label>
            <input
              type="text"
              value={formData.panDob || ''}
              onChange={(e) => onChange('panDob', e.target.value)}
              placeholder="e.g. 14/08/1988"
              className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
            />
          </div>
        </div>
      )}

      {/* CASE N: Email ID Update */}
      {activeLetter === 'email_update' && (
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5 space-y-3.5">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <MailCheck className="w-3.5 h-3.5 text-teal-600" />
              Email ID Registration & E-Statement Activation
            </h4>
            <span className="text-[10px] text-teal-700 font-semibold bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
              E-Statements
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Previous Email ID (if any)
              </label>
              <input
                type="email"
                value={formData.oldEmailId || ''}
                onChange={(e) => onChange('oldEmailId', e.target.value)}
                placeholder="e.g. old.email@example.com"
                className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                New Email ID to Register *
              </label>
              <input
                type="email"
                value={formData.newEmailId || ''}
                onChange={(e) => onChange('newEmailId', e.target.value)}
                placeholder="e.g. rajesh.sharma@tcs.com"
                className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500 font-semibold"
              />
            </div>
          </div>

          <div className="pt-1">
            <label className="flex items-center gap-2 p-2 bg-white rounded border border-slate-200 cursor-pointer hover:bg-slate-50 text-xs">
              <input
                type="checkbox"
                checked={formData.enableEStatement !== false}
                onChange={(e) => onChange('enableEStatement', e.target.checked)}
                className="rounded text-teal-600"
              />
              <span className="font-semibold text-slate-800">
                Activate monthly password-protected electronic account statements (E-Statements)
              </span>
            </label>
          </div>
        </div>
      )}

      {/* CASE O: Signature Change Request */}
      {activeLetter === 'signature_change' && (
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5 space-y-3.5">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <PenTool className="w-3.5 h-3.5 text-purple-600" />
              Specimen Signature Change Details
            </h4>
            <span className="text-[10px] text-purple-700 font-semibold bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
              Signature Update
            </span>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-600 mb-1">
              Reason for Changing Specimen Signature *
            </label>
            <select
              value={formData.oldSignatureReason || 'signature_mismatch'}
              onChange={(e) => onChange('oldSignatureReason', e.target.value as any)}
              className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
            >
              <option value="signature_mismatch">Signature Mismatch / Natural Discrepancy with Records</option>
              <option value="change_due_to_age_health">Change in Handwriting due to Age / Medical Condition</option>
              <option value="standardizing">Standardizing Signature across All Identity Documents</option>
              <option value="others">Other Reason</option>
            </select>
          </div>

          <div className="space-y-2 pt-1">
            <label className="flex items-center gap-2 p-2 bg-white rounded border border-slate-200 cursor-pointer hover:bg-slate-50 text-xs">
              <input
                type="checkbox"
                checked={formData.enclosedKycForSignature !== false}
                onChange={(e) => onChange('enclosedKycForSignature', e.target.checked)}
                className="rounded text-purple-600"
              />
              <span className="font-semibold text-slate-800">
                Self-attested identity proof (PAN & Aadhaar) submitted in person at branch
              </span>
            </label>

            <label className="flex items-center gap-2 p-2 bg-white rounded border border-slate-200 cursor-pointer hover:bg-slate-50 text-xs">
              <input
                type="checkbox"
                checked={formData.provideNewSpecimen !== false}
                onChange={(e) => onChange('provideNewSpecimen', e.target.checked)}
                className="rounded text-purple-600"
              />
              <span className="text-slate-700">
                Fresh Specimen Signature Card signed in presence of Bank Officer
              </span>
            </label>
          </div>
        </div>
      )}

      {/* Case P: Letter 16 - New ATM Card Request */}
      {activeLetter === 'new_atm_card' && (
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5 space-y-3.5">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <CreditCard className="w-3.5 h-3.5 text-blue-600" />
              New ATM / Debit Card Issuance Details
            </h4>
            <span className="text-[10px] text-blue-700 font-semibold bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              New Debit Card
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Preferred Card Scheme / Variant *
              </label>
              <select
                value={formData.newAtmCardType || 'rupay_platinum'}
                onChange={(e) => onChange('newAtmCardType', e.target.value as any)}
                className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
              >
                <option value="rupay_platinum">RuPay Platinum (High Limit & Airport Lounge)</option>
                <option value="rupay_classic">RuPay Classic (Standard Domestic)</option>
                <option value="visa_classic">VISA Classic Contactless</option>
                <option value="visa_gold">VISA Gold International</option>
                <option value="mastercard_global">MasterCard Global International</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Name to Emboss on Card (Max 21 chars) *
              </label>
              <input
                type="text"
                value={formData.newAtmCardEmbossName || ''}
                onChange={(e) => onChange('newAtmCardEmbossName', e.target.value.toUpperCase())}
                placeholder={formData.firstName ? `${formData.firstName} ${formData.lastName}` : 'RAJESH K SHARMA'}
                maxLength={21}
                className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono uppercase"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-600 mb-1">
              Card Delivery Destination *
            </label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                <input
                  type="radio"
                  name="newAtmDeliveryMode"
                  value="registered_address"
                  checked={formData.newAtmDeliveryMode !== 'branch'}
                  onChange={() => onChange('newAtmDeliveryMode', 'registered_address')}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span>Speed Post to Registered Address</span>
              </label>
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                <input
                  type="radio"
                  name="newAtmDeliveryMode"
                  value="branch"
                  checked={formData.newAtmDeliveryMode === 'branch'}
                  onChange={() => onChange('newAtmDeliveryMode', 'branch')}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span>Collect at Branch Counter</span>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Case Q: Letter 17 - ATM Card Block Request */}
      {activeLetter === 'block_atm_card' && (
        <div className="bg-rose-50/50 border border-rose-200 rounded-lg p-3.5 space-y-3.5">
          <div className="flex items-center justify-between border-b border-rose-200 pb-2">
            <h4 className="text-xs font-bold text-rose-900 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-rose-600" />
              Urgent ATM Card Hotlisting / Blocking Details
            </h4>
            <span className="text-[10px] text-rose-700 font-semibold bg-rose-100 px-2 py-0.5 rounded border border-rose-300">
              Urgent Security Action
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Debit Card Number to Block (16 digits or Last 4) *
              </label>
              <input
                type="text"
                value={formData.blockAtmCardNumber || ''}
                onChange={(e) => onChange('blockAtmCardNumber', e.target.value)}
                placeholder="e.g. 6071 8900 1234 5678"
                className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-rose-500 font-mono tracking-wider"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Reason for Blocking *
              </label>
              <select
                value={formData.blockAtmReason || 'card_lost'}
                onChange={(e) => onChange('blockAtmReason', e.target.value as any)}
                className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-rose-500 font-medium"
              >
                <option value="card_lost">Card Lost / Misplaced</option>
                <option value="card_stolen">Card Stolen / Pickpocketing</option>
                <option value="atm_machine_captured">Card Captured in ATM Machine</option>
                <option value="fraudulent_sms">Suspicious / Unauthorized SMS Alerts</option>
                <option value="damaged">Severely Damaged / Compromised</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Date & Time of Incident / Loss *
              </label>
              <input
                type="text"
                value={formData.blockAtmIncidentDate || ''}
                onChange={(e) => onChange('blockAtmIncidentDate', e.target.value)}
                placeholder="DD/MM/YYYY or today"
                className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-rose-500 font-mono"
              />
            </div>

            <div className="pt-4">
              <label className="flex items-center gap-2 p-2 bg-white rounded border border-rose-200 cursor-pointer hover:bg-rose-50 text-xs">
                <input
                  type="checkbox"
                  checked={formData.requestReplacementAfterBlock !== false}
                  onChange={(e) => onChange('requestReplacementAfterBlock', e.target.checked)}
                  className="rounded text-rose-600"
                />
                <span className="font-semibold text-slate-800">
                  Issue replacement debit card automatically after blocking
                </span>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Case R: Letter 18 - ATM PIN Reset / Generation */}
      {activeLetter === 'atm_pin_reset' && (
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5 space-y-3.5">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-amber-600" />
              ATM PIN Generation / Reset (Green PIN)
            </h4>
            <span className="text-[10px] text-amber-700 font-semibold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
              PIN Reset
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Debit Card Number *
              </label>
              <input
                type="text"
                value={formData.pinResetCardNumber || ''}
                onChange={(e) => onChange('pinResetCardNumber', e.target.value)}
                placeholder="6071 8900 1234 5678"
                className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-amber-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Reason for PIN Generation / Reset *
              </label>
              <select
                value={formData.pinResetReason || 'forgot_pin'}
                onChange={(e) => onChange('pinResetReason', e.target.value as any)}
                className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-amber-500 font-medium"
              >
                <option value="forgot_pin">Forgot 4-Digit ATM PIN</option>
                <option value="green_pin_expired">Green PIN OTP Expired before ATM Setup</option>
                <option value="first_time_generation">First Time PIN Setup for Fresh Card</option>
                <option value="security_precaution">Security Precaution / Periodic Update</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-600 mb-1">
              Preferred Mode of PIN Delivery *
            </label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                <input
                  type="radio"
                  name="pinDeliveryPreference"
                  value="green_pin_sms"
                  checked={formData.pinDeliveryPreference !== 'branch_physical_mailer'}
                  onChange={() => onChange('pinDeliveryPreference', 'green_pin_sms')}
                  className="text-amber-600 focus:ring-amber-500"
                />
                <span>Green PIN OTP via SMS on Registered Mobile</span>
              </label>
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                <input
                  type="radio"
                  name="pinDeliveryPreference"
                  value="branch_physical_mailer"
                  checked={formData.pinDeliveryPreference === 'branch_physical_mailer'}
                  onChange={() => onChange('pinDeliveryPreference', 'branch_physical_mailer')}
                  className="text-amber-600 focus:ring-amber-500"
                />
                <span>Physical Sealed PIN Mailer at Branch</span>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Case S: Letter 19 - ATM Card Replacement */}
      {activeLetter === 'atm_replacement' && (
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5 space-y-3.5">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <RefreshCw className="w-3.5 h-3.5 text-blue-600" />
              Damaged / Defective ATM Card Replacement
            </h4>
            <span className="text-[10px] text-blue-700 font-semibold bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              Card Replacement
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Existing Defective Card Number *
              </label>
              <input
                type="text"
                value={formData.replacementCardNumber || ''}
                onChange={(e) => onChange('replacementCardNumber', e.target.value)}
                placeholder="6071 8900 1234 5678"
                className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Nature of Card Damage / Defect *
              </label>
              <select
                value={formData.replacementCardReason || 'damaged_chip'}
                onChange={(e) => onChange('replacementCardReason', e.target.value as any)}
                className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
              >
                <option value="damaged_chip">EMV Microchip Malfunction / Terminal Read Failure</option>
                <option value="magnetic_strip_worn">Magnetic Strip Worn Out / Swiping Errors</option>
                <option value="broken_card">Card Broken / Cracked / Bent</option>
                <option value="name_correction">Name Correction on Plastic Card</option>
                <option value="expired">Card Validity Period Expired</option>
              </select>
            </div>
          </div>

          <div className="pt-1">
            <label className="flex items-center gap-2 p-2 bg-white rounded border border-slate-200 cursor-pointer hover:bg-slate-50 text-xs">
              <input
                type="checkbox"
                checked={formData.surrenderOldCardWithLetter !== false}
                onChange={(e) => onChange('surrenderOldCardWithLetter', e.target.checked)}
                className="rounded text-blue-600"
              />
              <span className="font-semibold text-slate-800">
                Old damaged / defective card cut in half and enclosed with application
              </span>
            </label>
          </div>
        </div>
      )}

      {/* Case T: Letter 20 - Cheque Book Request */}
      {activeLetter === 'cheque_book_request' && (
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5 space-y-3.5">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <FileCheck2 className="w-3.5 h-3.5 text-emerald-600" />
              New Cheque Book Requisition Details
            </h4>
            <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Cheque Book
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Number of Leaves *
              </label>
              <select
                value={formData.chequeBookLeavesCount || '50'}
                onChange={(e) => onChange('chequeBookLeavesCount', e.target.value as any)}
                className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium"
              >
                <option value="25">25 Leaves (CTS-2010 Standard)</option>
                <option value="50">50 Leaves (CTS-2010 Standard)</option>
                <option value="100">100 Leaves (CTS-2010 Standard)</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Cheque Personalization *
              </label>
              <select
                value={formData.chequeBookType || 'personalized'}
                onChange={(e) => onChange('chequeBookType', e.target.value as any)}
                className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium"
              >
                <option value="personalized">Personalized (Name Printed on Leaves)</option>
                <option value="bearer_order">Standard Bearer / Non-Personalized</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Delivery Mode *
              </label>
              <select
                value={formData.chequeDeliveryMode || 'registered_address'}
                onChange={(e) => onChange('chequeDeliveryMode', e.target.value as any)}
                className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium"
              >
                <option value="registered_address">Speed Post to Registered Address</option>
                <option value="branch">Collect from Branch Counter</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Case U: Letter 21 - Stop Cheque Payment */}
      {activeLetter === 'stop_cheque_payment' && (
        <div className="bg-amber-50/50 border border-amber-200 rounded-lg p-3.5 space-y-3.5">
          <div className="flex items-center justify-between border-b border-amber-200 pb-2">
            <h4 className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
              Stop Payment of Issued Cheque Instruction
            </h4>
            <span className="text-[10px] text-amber-700 font-semibold bg-amber-100 px-2 py-0.5 rounded border border-amber-300">
              Stop Payment
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Cheque Number *
              </label>
              <input
                type="text"
                value={formData.stopChequeNumber || ''}
                onChange={(e) => onChange('stopChequeNumber', e.target.value.replace(/\D/g, ''))}
                placeholder="000412"
                maxLength={6}
                className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-amber-500 font-mono font-bold"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Cheque Date *
              </label>
              <input
                type="text"
                value={formData.stopChequeDate || ''}
                onChange={(e) => onChange('stopChequeDate', e.target.value)}
                placeholder="DD/MM/YYYY"
                className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-amber-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Amount (Rs.) *
              </label>
              <input
                type="text"
                value={formData.stopChequeAmount || ''}
                onChange={(e) => onChange('stopChequeAmount', e.target.value)}
                placeholder="15,000.00"
                className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-amber-500 font-mono font-bold"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Drawn in Favor of (Payee Name) *
              </label>
              <input
                type="text"
                value={formData.stopChequePayeeName || ''}
                onChange={(e) => onChange('stopChequePayeeName', e.target.value.toUpperCase())}
                placeholder="e.g. MAHESH TRADERS"
                className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Reason for Stopping Payment *
              </label>
              <select
                value={formData.stopChequeReason || 'lost_in_transit'}
                onChange={(e) => onChange('stopChequeReason', e.target.value as any)}
                className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-amber-500 font-medium"
              >
                <option value="lost_in_transit">Cheque Lost in Postal Transit / Courier</option>
                <option value="stolen">Cheque Stolen from Office / Residence</option>
                <option value="wrong_amount">Discrepancy in Filled Amount / Clerical Error</option>
                <option value="disputed_service">Commercial / Contractual Dispute with Payee</option>
                <option value="cheque_mutilated">Instrument Mutilated / Invalidated</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Case V: Letter 22 - Duplicate Cheque / DD Request */}
      {activeLetter === 'duplicate_cheque_request' && (
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5 space-y-3.5">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Copy className="w-3.5 h-3.5 text-blue-600" />
              Duplicate Cheque / Demand Draft Reissue Request
            </h4>
            <span className="text-[10px] text-blue-700 font-semibold bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              Duplicate Instrument
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Original Instrument No. *
              </label>
              <input
                type="text"
                value={formData.dupChequeOriginalNumber || ''}
                onChange={(e) => onChange('dupChequeOriginalNumber', e.target.value)}
                placeholder="000389"
                className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono font-bold"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Date of Original Issue *
              </label>
              <input
                type="text"
                value={formData.dupChequeIssueDate || ''}
                onChange={(e) => onChange('dupChequeIssueDate', e.target.value)}
                placeholder="DD/MM/YYYY"
                className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Amount (Rs.) *
              </label>
              <input
                type="text"
                value={formData.dupChequeAmount || ''}
                onChange={(e) => onChange('dupChequeAmount', e.target.value)}
                placeholder="25,000.00"
                className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono font-bold"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Beneficiary / Payee Name *
              </label>
              <input
                type="text"
                value={formData.dupChequeBeneficiaryName || ''}
                onChange={(e) => onChange('dupChequeBeneficiaryName', e.target.value.toUpperCase())}
                placeholder="e.g. SUNSHINE ENTERPRISES"
                className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Reason for Reissue *
              </label>
              <select
                value={formData.dupChequeReason || 'lost_by_beneficiary'}
                onChange={(e) => onChange('dupChequeReason', e.target.value as any)}
                className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
              >
                <option value="lost_by_beneficiary">Instrument Lost by Payee / Beneficiary</option>
                <option value="mutilated_in_transit">Mutilated / Torn / Washed Out</option>
                <option value="validity_expired">Validity Expired (&gt; 3 Months Old)</option>
                <option value="damaged">Damaged in Transit</option>
              </select>
            </div>
          </div>

          <div className="pt-1">
            <label className="flex items-center gap-2 p-2 bg-white rounded border border-slate-200 cursor-pointer hover:bg-slate-50 text-xs">
              <input
                type="checkbox"
                checked={formData.dupChequeIndemnitySubmitted !== false}
                onChange={(e) => onChange('dupChequeIndemnitySubmitted', e.target.checked)}
                className="rounded text-blue-600"
              />
              <span className="font-semibold text-slate-800">
                Executed Letter of Indemnity Bond on non-judicial stamp paper enclosed
              </span>
            </label>
          </div>
        </div>
      )}

      {/* Case W: Letter 23 - Cancel Cheque Book Request */}
      {activeLetter === 'cancel_cheque_request' && (
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5 space-y-3.5">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <FileX2 className="w-3.5 h-3.5 text-rose-600" />
              Cancel Cheque Book Requisition Details
            </h4>
            <span className="text-[10px] text-rose-700 font-semibold bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
              Cancel Requisition
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Number of Leaves in Cancelled Book *
              </label>
              <input
                type="text"
                value={formData.cancelChequeBookLeavesCount || '25'}
                onChange={(e) => onChange('cancelChequeBookLeavesCount', e.target.value)}
                placeholder="25 or 50 leaves"
                className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-rose-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Reason for Cancellation *
              </label>
              <select
                value={formData.cancelChequeBookReason || 'not_required'}
                onChange={(e) => onChange('cancelChequeBookReason', e.target.value as any)}
                className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-rose-500 font-medium"
              >
                <option value="not_required">No Longer Required for Account Operations</option>
                <option value="closing_account">Account Closure in Progress</option>
                <option value="digital_only_account">Exclusively using UPI and Net Banking</option>
                <option value="ordered_by_mistake">Requisition Placed Inadvertently</option>
              </select>
            </div>
          </div>

          <div className="pt-1">
            <label className="flex items-center gap-2 p-2 bg-white rounded border border-slate-200 cursor-pointer hover:bg-slate-50 text-xs">
              <input
                type="checkbox"
                checked={formData.surrenderUnusedChequesToBranch !== false}
                onChange={(e) => onChange('surrenderUnusedChequesToBranch', e.target.checked)}
                className="rounded text-rose-600"
              />
              <span className="font-semibold text-slate-800">
                Confirm no cheque leaves have been issued to third parties & surrender unused leaves
              </span>
            </label>
          </div>
        </div>
      )}

      {/* Case X: Letter 24 - Cheque Clearing Complaint */}
      {activeLetter === 'cheque_clearing_complaint' && (
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5 space-y-3.5">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-indigo-600" />
              Cheque Clearing Delay / Non-Credit Complaint
            </h4>
            <span className="text-[10px] text-indigo-700 font-semibold bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
              Clearing Grievance
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Deposited Cheque No. *
              </label>
              <input
                type="text"
                value={formData.clearingChequeNo || ''}
                onChange={(e) => onChange('clearingChequeNo', e.target.value.replace(/\D/g, ''))}
                placeholder="000552"
                maxLength={6}
                className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono font-bold"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Date of Deposit *
              </label>
              <input
                type="text"
                value={formData.clearingDepositDate || ''}
                onChange={(e) => onChange('clearingDepositDate', e.target.value)}
                placeholder="DD/MM/YYYY"
                className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Amount (Rs.) *
              </label>
              <input
                type="text"
                value={formData.clearingChequeAmount || ''}
                onChange={(e) => onChange('clearingChequeAmount', e.target.value)}
                placeholder="42,500.00"
                className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono font-bold"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Drawn Bank & Branch *
              </label>
              <input
                type="text"
                value={formData.clearingDrawnBankBranch || ''}
                onChange={(e) => onChange('clearingDrawnBankBranch', e.target.value.toUpperCase())}
                placeholder="e.g. HDFC BANK, DADAR BRANCH"
                className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Drawer / Payer Name *
              </label>
              <input
                type="text"
                value={formData.clearingPayeeDrawerName || ''}
                onChange={(e) => onChange('clearingPayeeDrawerName', e.target.value.toUpperCase())}
                placeholder="e.g. KIRAN PATEL"
                className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>
      )}

      {/* Case Y: Letter 25 - ATM Cash Withdrawal Failed Complaint */}
      {activeLetter === 'atm_failed_withdrawal' && (
        <div className="bg-rose-50/50 border border-rose-200 rounded-lg p-3.5 space-y-3.5">
          <div className="flex items-center justify-between border-b border-rose-200 pb-2">
            <h4 className="text-xs font-bold text-rose-900 flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
              Failed ATM Cash Withdrawal Complaint (RBI Mandate)
            </h4>
            <span className="text-[10px] text-rose-700 font-semibold bg-rose-100 px-2 py-0.5 rounded border border-rose-300">
              Cash Debited Not Dispensed
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Date of Failed Txn *
              </label>
              <input
                type="text"
                value={formData.failedAtmTxnDate || ''}
                onChange={(e) => onChange('failedAtmTxnDate', e.target.value)}
                placeholder="DD/MM/YYYY"
                className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-rose-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Time of Txn *
              </label>
              <input
                type="text"
                value={formData.failedAtmTxnTime || ''}
                onChange={(e) => onChange('failedAtmTxnTime', e.target.value)}
                placeholder="11:45 AM"
                className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-rose-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Debited Amount (Rs.) *
              </label>
              <input
                type="text"
                value={formData.failedAtmTxnAmount || ''}
                onChange={(e) => onChange('failedAtmTxnAmount', e.target.value)}
                placeholder="10,000.00"
                className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-rose-500 font-mono font-bold"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                ATM Location / Address *
              </label>
              <input
                type="text"
                value={formData.failedAtmBankLocation || ''}
                onChange={(e) => onChange('failedAtmBankLocation', e.target.value.toUpperCase())}
                placeholder="e.g. SBI ATM, WORLI NAKA"
                className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-rose-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                ATM Terminal ID (from slip/SMS) *
              </label>
              <input
                type="text"
                value={formData.failedAtmTerminalId || ''}
                onChange={(e) => onChange('failedAtmTerminalId', e.target.value.toUpperCase())}
                placeholder="e.g. S1AN00412"
                className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-rose-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Txn Ref No. / RRN *
              </label>
              <input
                type="text"
                value={formData.failedAtmTxnRefNo || ''}
                onChange={(e) => onChange('failedAtmTxnRefNo', e.target.value)}
                placeholder="e.g. TXN849102941"
                className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-rose-500 font-mono"
              />
            </div>
          </div>

          <div className="pt-1">
            <label className="flex items-center gap-2 p-2 bg-white rounded border border-rose-200 cursor-pointer hover:bg-rose-50 text-xs">
              <input
                type="checkbox"
                checked={formData.failedAtmSlipAvailable !== false}
                onChange={(e) => onChange('failedAtmSlipAvailable', e.target.checked)}
                className="rounded text-rose-600"
              />
              <span className="font-semibold text-slate-800">
                ATM Transaction Slip / SMS debit screenshot attached with this complaint
              </span>
            </label>
          </div>
        </div>
      )}

      {/* 27. Lost ATM Card Complaint Application */}
      {activeLetter === 'lost_atm_card_complaint' && (
        <div className="p-3.5 bg-rose-50/50 border border-rose-200 rounded-xl space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-rose-900 flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
              Lost ATM Card Complaint & Blocking Requisition
            </h4>
            <span className="text-[10px] text-rose-800 font-semibold bg-rose-100 px-2 py-0.5 rounded border border-rose-200">
              Immediate Hotlisting
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Lost Debit Card Number (16 Digits) *
              </label>
              <input
                type="text"
                value={formData.lostAtmCardNumber || ''}
                onChange={(e) => onChange('lostAtmCardNumber', e.target.value)}
                placeholder="6071 8900 1234 5678"
                maxLength={19}
                className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-rose-500 font-mono font-bold"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Police / NCR / Lost Report Number
              </label>
              <input
                type="text"
                value={formData.lostCardFirNo || ''}
                onChange={(e) => onChange('lostCardFirNo', e.target.value.toUpperCase())}
                placeholder="e.g. NCR/2026/89412"
                className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-rose-500 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Date Card Was Lost *
              </label>
              <input
                type="text"
                value={formData.blockAtmIncidentDate || ''}
                onChange={(e) => onChange('blockAtmIncidentDate', e.target.value)}
                placeholder="DD/MM/YYYY"
                className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-rose-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Place / Location Where Lost *
              </label>
              <input
                type="text"
                value={formData.lostCardLocation || ''}
                onChange={(e) => onChange('lostCardLocation', e.target.value.toUpperCase())}
                placeholder="e.g. In Transit / Main Market, Purna"
                className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-rose-500"
              />
            </div>
          </div>

          <div className="pt-1">
            <label className="flex items-center gap-2 p-2 bg-white rounded border border-rose-200 cursor-pointer hover:bg-rose-50 text-xs">
              <input
                type="checkbox"
                checked={formData.requestReplacementAfterBlock !== false}
                onChange={(e) => onChange('requestReplacementAfterBlock', e.target.checked)}
                className="rounded text-rose-600"
              />
              <span className="font-semibold text-slate-800">
                Also issue and dispatch a fresh replacement EMV chip debit card to my address
              </span>
            </label>
          </div>
        </div>
      )}

      {/* 30. ATM Card Renewal Application */}
      {activeLetter === 'atm_card_renewal' && (
        <div className="p-3.5 bg-blue-50/50 border border-blue-200 rounded-xl space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
              <History className="w-3.5 h-3.5 text-blue-600" />
              ATM / Debit Card Renewal Application
            </h4>
            <span className="text-[10px] text-blue-800 font-semibold bg-blue-100 px-2 py-0.5 rounded border border-blue-200">
              Expiry Renewal
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Expiring Card Number *
              </label>
              <input
                type="text"
                value={formData.expiringCardNumber || ''}
                onChange={(e) => onChange('expiringCardNumber', e.target.value)}
                placeholder="6071 8900 1234 5678"
                className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono font-bold"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Card Expiry Date (MM/YY) *
              </label>
              <input
                type="text"
                value={formData.cardExpiryDate || ''}
                onChange={(e) => onChange('cardExpiryDate', e.target.value)}
                placeholder="MM/YY (e.g. 10/26)"
                maxLength={5}
                className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-600 mb-1">
              Preferred Card Scheme
            </label>
            <select
              value={formData.newAtmCardType || 'rupay_classic'}
              onChange={(e) => onChange('newAtmCardType', e.target.value as any)}
              className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
            >
              <option value="rupay_classic">RuPay Classic Domestic EMV Chip</option>
              <option value="rupay_platinum">RuPay Platinum International</option>
              <option value="visa_gold">VISA Gold Contactless</option>
              <option value="mastercard_global">MasterCard Global International</option>
            </select>
          </div>
        </div>
      )}

      {/* 31. ATM Transaction Dispute Application */}
      {activeLetter === 'atm_txn_dispute' && (
        <div className="p-3.5 bg-amber-50/50 border border-amber-200 rounded-xl space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
              ATM / POS Transaction Dispute Application
            </h4>
            <span className="text-[10px] text-amber-800 font-semibold bg-amber-100 px-2 py-0.5 rounded border border-amber-200">
              Chargeback Dispute
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Disputed Date *
              </label>
              <input
                type="text"
                value={formData.disputeTxnDate || ''}
                onChange={(e) => onChange('disputeTxnDate', e.target.value)}
                placeholder="DD/MM/YYYY"
                className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-amber-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Disputed Time
              </label>
              <input
                type="text"
                value={formData.disputeTxnTime || ''}
                onChange={(e) => onChange('disputeTxnTime', e.target.value)}
                placeholder="e.g. 02:30 PM"
                className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Disputed Amount (Rs.) *
              </label>
              <input
                type="text"
                value={formData.disputedAmount || ''}
                onChange={(e) => onChange('disputedAmount', e.target.value)}
                placeholder="5,000.00"
                className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-amber-500 font-mono font-bold"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                ATM Terminal ID & Bank
              </label>
              <input
                type="text"
                value={formData.disputeAtmTerminalId || ''}
                onChange={(e) => onChange('disputeAtmTerminalId', e.target.value.toUpperCase())}
                placeholder="e.g. ATM-0412"
                className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-amber-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Dispute Reason *
              </label>
              <select
                value={formData.disputeType || 'incorrect_debit'}
                onChange={(e) => onChange('disputeType', e.target.value as any)}
                className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-amber-500 font-medium"
              >
                <option value="incorrect_debit">Incorrect Amount Debited</option>
                <option value="partial_cash">Partial Cash Dispensed by Machine</option>
                <option value="fraudulent_charge">Unauthorized / Fraudulent POS Charge</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* 34. Duplicate Cheque Book Request Application */}
      {activeLetter === 'duplicate_cheque_book' && (
        <div className="p-3.5 bg-blue-50/50 border border-blue-200 rounded-xl space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
              <Copy className="w-3.5 h-3.5 text-blue-600" />
              Duplicate Cheque Book Request Application
            </h4>
            <span className="text-[10px] text-blue-800 font-semibold bg-blue-100 px-2 py-0.5 rounded border border-blue-200">
              CTS-2010 Reissue
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Number of Leaves *
              </label>
              <select
                value={formData.dupChequeBookLeavesCount || '25'}
                onChange={(e) => onChange('dupChequeBookLeavesCount', e.target.value as any)}
                className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
              >
                <option value="25">25 Leaves (CTS-2010 Standard)</option>
                <option value="50">50 Leaves (CTS-2010 Standard)</option>
                <option value="100">100 Leaves (CTS-2010 Standard)</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Previous Cheque Series Ref
              </label>
              <input
                type="text"
                value={formData.previousChequeBookSeries || ''}
                onChange={(e) => onChange('previousChequeBookSeries', e.target.value)}
                placeholder="e.g. 000401 to 000425"
                className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-600 mb-1">
              Reason for Duplicate Cheque Book *
            </label>
            <input
              type="text"
              value={formData.dupChequeBookReason || ''}
              onChange={(e) => onChange('dupChequeBookReason', e.target.value)}
              placeholder="e.g. Original Cheque Book Damaged in Transit / Exhausted"
              className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>
      )}

      {/* 37. Cheque Revalidation Application */}
      {activeLetter === 'cheque_revalidation' && (
        <div className="p-3.5 bg-blue-50/50 border border-blue-200 rounded-xl space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-blue-600" />
              Cheque Revalidation / Stale Cheque Application
            </h4>
            <span className="text-[10px] text-blue-800 font-semibold bg-blue-100 px-2 py-0.5 rounded border border-blue-200">
              Validity Re-issue
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Cheque Number *
              </label>
              <input
                type="text"
                value={formData.revalChequeNumber || ''}
                onChange={(e) => onChange('revalChequeNumber', e.target.value)}
                placeholder="000341"
                className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono font-bold"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Original Date *
              </label>
              <input
                type="text"
                value={formData.revalChequeDate || ''}
                onChange={(e) => onChange('revalChequeDate', e.target.value)}
                placeholder="DD/MM/YYYY"
                className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Amount (Rs.) *
              </label>
              <input
                type="text"
                value={formData.revalChequeAmount || ''}
                onChange={(e) => onChange('revalChequeAmount', e.target.value)}
                placeholder="18,500.00"
                className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono font-bold"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Drawn In Favor Of (Payee) *
              </label>
              <input
                type="text"
                value={formData.revalChequePayee || ''}
                onChange={(e) => onChange('revalChequePayee', e.target.value.toUpperCase())}
                placeholder="e.g. SNEHA ENTERPRISES"
                className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Revalidation Reason
              </label>
              <input
                type="text"
                value={formData.revalReason || ''}
                onChange={(e) => onChange('revalReason', e.target.value)}
                placeholder="Validity Expired (>3 Months Old)"
                className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      )}

      {/* 38. Cheque Book Not Received Complaint */}
      {activeLetter === 'cheque_book_not_received' && (
        <div className="p-3.5 bg-amber-50/50 border border-amber-200 rounded-xl space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
              Cheque Book Not Received Complaint
            </h4>
            <span className="text-[10px] text-amber-800 font-semibold bg-amber-100 px-2 py-0.5 rounded border border-amber-200">
              TAT Grievance
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Requisition Date *
              </label>
              <input
                type="text"
                value={formData.chqRequisitionDate || ''}
                onChange={(e) => onChange('chqRequisitionDate', e.target.value)}
                placeholder="DD/MM/YYYY"
                className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-amber-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Postal / Courier Tracking Ref
              </label>
              <input
                type="text"
                value={formData.chqDispatchRefNo || ''}
                onChange={(e) => onChange('chqDispatchRefNo', e.target.value.toUpperCase())}
                placeholder="e.g. SP/MH/2026/894120"
                className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-amber-500 font-mono"
              />
            </div>
          </div>
        </div>
      )}

      {/* 42. Passbook Correction Application */}
      {activeLetter === 'passbook_correction' && (
        <div className="p-3.5 bg-blue-50/50 border border-blue-200 rounded-xl space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
              <Edit3 className="w-3.5 h-3.5 text-blue-600" />
              Passbook Entry Correction Application
            </h4>
            <span className="text-[10px] text-blue-800 font-semibold bg-blue-100 px-2 py-0.5 rounded border border-blue-200">
              Ledger Rectification
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Discrepancy Nature *
              </label>
              <select
                value={formData.passbookDiscrepancyType || 'Incorrect Balance / Entry'}
                onChange={(e) => onChange('passbookDiscrepancyType', e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
              >
                <option value="Incorrect Balance / Entry">Incorrect Balance / Entry</option>
                <option value="Missing Transaction Entry">Missing Transaction Entry</option>
                <option value="Double Debit Entry">Double Debit Entry</option>
                <option value="Spelling / Name Discrepancy">Spelling / Name Discrepancy</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Discrepancy Date
              </label>
              <input
                type="text"
                value={formData.passbookDiscrepancyDate || ''}
                onChange={(e) => onChange('passbookDiscrepancyDate', e.target.value)}
                placeholder="DD/MM/YYYY"
                className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Amount Involved (Rs.)
              </label>
              <input
                type="text"
                value={formData.passbookDiscrepancyAmount || ''}
                onChange={(e) => onChange('passbookDiscrepancyAmount', e.target.value)}
                placeholder="2,500.00"
                className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono font-bold"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-600 mb-1">
              Details of Correction Needed *
            </label>
            <input
              type="text"
              value={formData.passbookDiscrepancyDetails || ''}
              onChange={(e) => onChange('passbookDiscrepancyDetails', e.target.value)}
              placeholder="e.g. Kindly reconcile ledger entry and reprint passbook with corrected balance"
              className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>
      )}

      {/* 44. Mini Statement Request */}
      {activeLetter === 'mini_statement_request' && (
        <div className="p-3.5 bg-blue-50/50 border border-blue-200 rounded-xl space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
              <Receipt className="w-3.5 h-3.5 text-blue-600" />
              Mini Statement Request Application
            </h4>
            <span className="text-[10px] text-blue-800 font-semibold bg-blue-100 px-2 py-0.5 rounded border border-blue-200">
              Quick Statement
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Number of Recent Transactions
              </label>
              <select
                value={formData.miniStatementTxnCount || '10'}
                onChange={(e) => onChange('miniStatementTxnCount', e.target.value as any)}
                className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
              >
                <option value="5">Last 5 Transactions</option>
                <option value="10">Last 10 Transactions</option>
                <option value="15">Last 15 Transactions</option>
                <option value="20">Last 20 Transactions</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Delivery Preference
              </label>
              <select
                value={formData.miniStatementDeliveryMode || 'counter'}
                onChange={(e) => onChange('miniStatementDeliveryMode', e.target.value as any)}
                className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
              >
                <option value="counter">Physical Printout at Branch Counter</option>
                <option value="email_sms">E-mail / SMS Transmission</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* 45. Balance Certificate Request */}
      {activeLetter === 'balance_certificate' && (
        <div className="p-3.5 bg-blue-50/50 border border-blue-200 rounded-xl space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
              <Landmark className="w-3.5 h-3.5 text-blue-600" />
              Bank Balance Certificate Request
            </h4>
            <span className="text-[10px] text-blue-800 font-semibold bg-blue-100 px-2 py-0.5 rounded border border-blue-200">
              Official Attestation
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Balance As On Date *
              </label>
              <input
                type="text"
                value={formData.balanceAsOnDate || ''}
                onChange={(e) => onChange('balanceAsOnDate', e.target.value)}
                placeholder="DD/MM/YYYY"
                className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Purpose of Certificate *
              </label>
              <input
                type="text"
                value={formData.balanceCertPurpose || ''}
                onChange={(e) => onChange('balanceCertPurpose', e.target.value)}
                placeholder="Visa Application / Financial Audit / Tender"
                className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-600 mb-1">
              Addressed To / Submitting Entity
            </label>
            <input
              type="text"
              value={formData.balanceCertAddressedTo || ''}
              onChange={(e) => onChange('balanceCertAddressedTo', e.target.value)}
              placeholder="e.g. The Embassy / Consulate of Germany / Statutory Auditors"
              className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>
      )}

      {/* 46. Interest Certificate Request */}
      {activeLetter === 'interest_certificate' && (
        <div className="p-3.5 bg-blue-50/50 border border-blue-200 rounded-xl space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
              <FileSpreadsheet className="w-3.5 h-3.5 text-blue-600" />
              Bank Interest Certificate Request (ITR / Tax Compliance)
            </h4>
            <span className="text-[10px] text-blue-800 font-semibold bg-blue-100 px-2 py-0.5 rounded border border-blue-200">
              Tax Certificate
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Financial Year *
              </label>
              <select
                value={formData.interestFinancialYear || 'FY 2025-2026 (AY 2026-2027)'}
                onChange={(e) => onChange('interestFinancialYear', e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
              >
                <option value="FY 2025-2026 (AY 2026-2027)">FY 2025-2026 (AY 2026-2027)</option>
                <option value="FY 2024-2025 (AY 2025-2026)">FY 2024-2025 (AY 2025-2026)</option>
                <option value="FY 2023-2024 (AY 2024-2025)">FY 2023-2024 (AY 2024-2025)</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Certificate Scope
              </label>
              <select
                value={formData.interestCertScope || 'all_deposits'}
                onChange={(e) => onChange('interestCertScope', e.target.value as any)}
                className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
              >
                <option value="all_deposits">All Accounts (Savings, Term Deposits FD & RD)</option>
                <option value="savings_only">Savings Account Interest Only</option>
                <option value="fd_only">Fixed / Term Deposits (FD/RD) Interest Only</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* 47. Account Confirmation Certificate Request */}
      {activeLetter === 'account_confirmation_cert' && (
        <div className="p-3.5 bg-blue-50/50 border border-blue-200 rounded-xl space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
              Account Confirmation Certificate Request
            </h4>
            <span className="text-[10px] text-blue-800 font-semibold bg-blue-100 px-2 py-0.5 rounded border border-blue-200">
              Active Verification
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Purpose of Confirmation *
              </label>
              <input
                type="text"
                value={formData.accountCertPurpose || ''}
                onChange={(e) => onChange('accountCertPurpose', e.target.value)}
                placeholder="Tender / Vendor Onboarding / Departmental Submission"
                className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Addressed To / Submitting Agency
              </label>
              <input
                type="text"
                value={formData.accountCertAddressedTo || ''}
                onChange={(e) => onChange('accountCertAddressedTo', e.target.value)}
                placeholder="e.g. Railway Department / Procurement Cell"
                className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      )}

      {/* 48. No Dues Certificate Request (NOC) */}
      {activeLetter === 'no_dues_certificate' && (
        <div className="p-3.5 bg-emerald-50/50 border border-emerald-200 rounded-xl space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
              <FileCheck className="w-3.5 h-3.5 text-emerald-600" />
              No Dues Certificate (NOC) Request Application
            </h4>
            <span className="text-[10px] text-emerald-800 font-semibold bg-emerald-100 px-2 py-0.5 rounded border border-emerald-200">
              Loan Closure NOC
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Loan Account Number *
              </label>
              <input
                type="text"
                value={formData.loanAccountNoForNoc || ''}
                onChange={(e) => onChange('loanAccountNoForNoc', e.target.value)}
                placeholder="9876543210"
                className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono font-bold"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Loan Type / Scheme *
              </label>
              <input
                type="text"
                value={formData.loanTypeForNoc || ''}
                onChange={(e) => onChange('loanTypeForNoc', e.target.value)}
                placeholder="Home Loan / Auto / Personal"
                className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Full Closure Date
              </label>
              <input
                type="text"
                value={formData.loanClosureDate || ''}
                onChange={(e) => onChange('loanClosureDate', e.target.value)}
                placeholder="DD/MM/YYYY"
                className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono"
              />
            </div>
          </div>
        </div>
      )}

      {/* 49. Loan Account Statement Request */}
      {activeLetter === 'loan_statement_request' && (
        <div className="p-3.5 bg-blue-50/50 border border-blue-200 rounded-xl space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-blue-600" />
              Loan Account Statement Request Application
            </h4>
            <span className="text-[10px] text-blue-800 font-semibold bg-blue-100 px-2 py-0.5 rounded border border-blue-200">
              EMI & Interest Ledger
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Loan Account Number *
              </label>
              <input
                type="text"
                value={formData.loanAccountNo || ''}
                onChange={(e) => onChange('loanAccountNo', e.target.value)}
                placeholder="9876543210"
                className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono font-bold"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Period From
              </label>
              <input
                type="text"
                value={formData.loanStatementFrom || ''}
                onChange={(e) => onChange('loanStatementFrom', e.target.value)}
                placeholder="01/04/2025"
                className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Period To
              </label>
              <input
                type="text"
                value={formData.loanStatementTo || ''}
                onChange={(e) => onChange('loanStatementTo', e.target.value)}
                placeholder="DD/MM/YYYY"
                className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
              />
            </div>
          </div>
        </div>
      )}

      {/* 50. Bank Account Verification Letter Request */}
      {activeLetter === 'bank_account_verification' && (
        <div className="p-3.5 bg-blue-50/50 border border-blue-200 rounded-xl space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
              Bank Account Verification Letter Request
            </h4>
            <span className="text-[10px] text-blue-800 font-semibold bg-blue-100 px-2 py-0.5 rounded border border-blue-200">
              Branch Attestation
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Purpose of Verification *
              </label>
              <input
                type="text"
                value={formData.verificationPurpose || ''}
                onChange={(e) => onChange('verificationPurpose', e.target.value)}
                placeholder="Government Scheme / DBT / Employment Salary Seeding"
                className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Verifying Agency / Department
              </label>
              <input
                type="text"
                value={formData.verificationAgency || ''}
                onChange={(e) => onChange('verificationAgency', e.target.value)}
                placeholder="e.g. Department of Agriculture / Employer HR"
                className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      )}

      {/* 51. Internet Banking Activation Application */}
      {activeLetter === 'netbanking_activation' && (
        <div className="p-3.5 bg-blue-50/50 border border-blue-200 rounded-xl space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
              <Smartphone className="w-3.5 h-3.5 text-blue-600" />
              Internet Banking Activation Application
            </h4>
            <span className="text-[10px] text-blue-800 font-semibold bg-blue-100 px-2 py-0.5 rounded border border-blue-200">
              Net Banking
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Requested Transaction Rights *
              </label>
              <select
                value={formData.netBankingRights || 'full_transaction'}
                onChange={(e) => onChange('netBankingRights', e.target.value as any)}
                className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
              >
                <option value="full_transaction">Full Transaction Rights (Financial & Non-Financial)</option>
                <option value="view_only">View Only Rights (Inquiry Only)</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Requested Daily Limit (Rs.)
              </label>
              <input
                type="text"
                value={formData.netBankingLimit || ''}
                onChange={(e) => onChange('netBankingLimit', e.target.value)}
                placeholder="e.g. 1,00,000.00"
                className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
              />
            </div>
          </div>
        </div>
      )}

      {/* 52. Internet Banking Deactivation Application */}
      {activeLetter === 'netbanking_deactivation' && (
        <div className="p-3.5 bg-rose-50/50 border border-rose-200 rounded-xl space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-rose-900 flex items-center gap-1.5">
              <Ban className="w-3.5 h-3.5 text-rose-600" />
              Internet Banking Deactivation Application
            </h4>
            <span className="text-[10px] text-rose-800 font-semibold bg-rose-100 px-2 py-0.5 rounded border border-rose-200">
              Urgent Suspension
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Internet Banking User ID / Login ID
              </label>
              <input
                type="text"
                value={formData.netBankingLoginId || ''}
                onChange={(e) => onChange('netBankingLoginId', e.target.value)}
                placeholder="registered user id"
                className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-rose-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Reason for Deactivation *
              </label>
              <input
                type="text"
                value={formData.netBankingDeactReason || ''}
                onChange={(e) => onChange('netBankingDeactReason', e.target.value)}
                placeholder="Security precaution / suspicious phishing SMS"
                className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-rose-500"
              />
            </div>
          </div>
        </div>
      )}

      {/* 53. Mobile Banking Activation Application */}
      {activeLetter === 'mobilebanking_activation' && (
        <div className="p-3.5 bg-blue-50/50 border border-blue-200 rounded-xl space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
              <Smartphone className="w-3.5 h-3.5 text-blue-600" />
              Mobile Banking Activation Application
            </h4>
            <span className="text-[10px] text-blue-800 font-semibold bg-blue-100 px-2 py-0.5 rounded border border-blue-200">
              Mobile App Access
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Bank Mobile App Choice
              </label>
              <input
                type="text"
                value={formData.mobileBankingAppChoice || ''}
                onChange={(e) => onChange('mobileBankingAppChoice', e.target.value)}
                placeholder="Official Bank Mobile Banking App (YONO / MahaMobile)"
                className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Mobile Handset Model
              </label>
              <input
                type="text"
                value={formData.mobileDeviceModel || ''}
                onChange={(e) => onChange('mobileDeviceModel', e.target.value)}
                placeholder="Personal Android / iOS Smartphone"
                className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      )}

      {/* 54. Mobile Banking Deactivation Application */}
      {activeLetter === 'mobilebanking_deactivation' && (
        <div className="p-3.5 bg-rose-50/50 border border-rose-200 rounded-xl space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-rose-900 flex items-center gap-1.5">
              <ShieldOff className="w-3.5 h-3.5 text-rose-600" />
              Mobile Banking Deactivation Application
            </h4>
            <span className="text-[10px] text-rose-800 font-semibold bg-rose-100 px-2 py-0.5 rounded border border-rose-200">
              Deactivate Device
            </span>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-600 mb-1">
              Reason for Deactivation *
            </label>
            <input
              type="text"
              value={formData.mobileBankingDeactReason || ''}
              onChange={(e) => onChange('mobileBankingDeactReason', e.target.value)}
              placeholder="Handset lost / SIM lost / Changed mobile device"
              className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-rose-500"
            />
          </div>
        </div>
      )}

      {/* 55. UPI Activation / Registration Request */}
      {activeLetter === 'upi_activation' && (
        <div className="p-3.5 bg-blue-50/50 border border-blue-200 rounded-xl space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
              <Send className="w-3.5 h-3.5 text-blue-600" />
              UPI Activation & Virtual Payment Address (VPA) Request
            </h4>
            <span className="text-[10px] text-blue-800 font-semibold bg-blue-100 px-2 py-0.5 rounded border border-blue-200">
              NPCI 24x7
            </span>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-600 mb-1">
              Preferred UPI VPA ID / Handle *
            </label>
            <input
              type="text"
              value={formData.preferredVpaId || ''}
              onChange={(e) => onChange('preferredVpaId', e.target.value)}
              placeholder="e.g. rajesh.sharma@mahaph"
              className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
            />
          </div>
        </div>
      )}

      {/* 56. UPI Transaction Failed Complaint */}
      {activeLetter === 'upi_failed_complaint' && (
        <div className="p-3.5 bg-rose-50/50 border border-rose-200 rounded-xl space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-rose-900 flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
              UPI Failed Transaction Complaint (Amount Debited Not Credited)
            </h4>
            <span className="text-[10px] text-rose-800 font-semibold bg-rose-100 px-2 py-0.5 rounded border border-rose-200">
              RBI T+1 TAT
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                UPI Txn ID / Ref (12 Digits) *
              </label>
              <input
                type="text"
                value={formData.upiTxnId || ''}
                onChange={(e) => onChange('upiTxnId', e.target.value)}
                placeholder="UPI/2026/894019241"
                className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-rose-500 font-mono font-bold"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Date of Transaction *
              </label>
              <input
                type="text"
                value={formData.upiFailedDate || ''}
                onChange={(e) => onChange('upiFailedDate', e.target.value)}
                placeholder="DD/MM/YYYY"
                className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-rose-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Amount Debited (Rs.) *
              </label>
              <input
                type="text"
                value={formData.upiFailedAmount || ''}
                onChange={(e) => onChange('upiFailedAmount', e.target.value)}
                placeholder="3,200.00"
                className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-rose-500 font-mono font-bold"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-600 mb-1">
              Beneficiary UPI VPA
            </label>
            <input
              type="text"
              value={formData.upiBeneficiaryVpa || ''}
              onChange={(e) => onChange('upiBeneficiaryVpa', e.target.value)}
              placeholder="e.g. merchant.pay@upi"
              className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-rose-500 font-mono"
            />
          </div>
        </div>
      )}

      {/* 57. Wrong UPI Transaction Complaint */}
      {activeLetter === 'wrong_upi_complaint' && (
        <div className="p-3.5 bg-rose-50/50 border border-rose-200 rounded-xl space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-rose-900 flex items-center gap-1.5">
              <ArrowRightLeft className="w-3.5 h-3.5 text-rose-600" />
              Wrong UPI Transaction Complaint & Fund Recall
            </h4>
            <span className="text-[10px] text-rose-800 font-semibold bg-rose-100 px-2 py-0.5 rounded border border-rose-200">
              Misdirected Recall
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                UPI Transaction ID *
              </label>
              <input
                type="text"
                value={formData.wrongUpiTxnId || ''}
                onChange={(e) => onChange('wrongUpiTxnId', e.target.value)}
                placeholder="UPI/2026/784192031"
                className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-rose-500 font-mono font-bold"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Amount Transferred (Rs.) *
              </label>
              <input
                type="text"
                value={formData.wrongUpiAmount || ''}
                onChange={(e) => onChange('wrongUpiAmount', e.target.value)}
                placeholder="4,500.00"
                className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-rose-500 font-mono font-bold"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Wrong UPI VPA Credited *
              </label>
              <input
                type="text"
                value={formData.wrongUpiReceiverVpa || ''}
                onChange={(e) => onChange('wrongUpiReceiverVpa', e.target.value)}
                placeholder="wrong.recipient@upi"
                className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-rose-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Intended UPI VPA
              </label>
              <input
                type="text"
                value={formData.correctReceiverVpa || ''}
                onChange={(e) => onChange('correctReceiverVpa', e.target.value)}
                placeholder="correct.recipient@upi"
                className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-rose-500 font-mono"
              />
            </div>
          </div>
        </div>
      )}

      {/* 58. Failed IMPS Transaction Complaint */}
      {activeLetter === 'failed_imps_complaint' && (
        <div className="p-3.5 bg-rose-50/50 border border-rose-200 rounded-xl space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-rose-900 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-rose-600" />
              Failed IMPS Transaction Complaint (RRN Tracking)
            </h4>
            <span className="text-[10px] text-rose-800 font-semibold bg-rose-100 px-2 py-0.5 rounded border border-rose-200">
              IMPS Reconciliation
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                IMPS RRN / Ref No. *
              </label>
              <input
                type="text"
                value={formData.impsRrnNo || ''}
                onChange={(e) => onChange('impsRrnNo', e.target.value)}
                placeholder="629810294819"
                className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-rose-500 font-mono font-bold"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Date *
              </label>
              <input
                type="text"
                value={formData.impsDate || ''}
                onChange={(e) => onChange('impsDate', e.target.value)}
                placeholder="DD/MM/YYYY"
                className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-rose-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Amount (Rs.) *
              </label>
              <input
                type="text"
                value={formData.impsAmount || ''}
                onChange={(e) => onChange('impsAmount', e.target.value)}
                placeholder="12,000.00"
                className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-rose-500 font-mono font-bold"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Beneficiary Account Number
              </label>
              <input
                type="text"
                value={formData.impsBeneficiaryAcc || ''}
                onChange={(e) => onChange('impsBeneficiaryAcc', e.target.value)}
                placeholder="Beneficiary Account Number"
                className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-rose-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Beneficiary IFSC Code
              </label>
              <input
                type="text"
                value={formData.impsBeneficiaryIfsc || ''}
                onChange={(e) => onChange('impsBeneficiaryIfsc', e.target.value.toUpperCase())}
                placeholder="SBIN0000214"
                className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-rose-500 font-mono"
              />
            </div>
          </div>
        </div>
      )}

      {/* 59. Failed NEFT Transaction Complaint */}
      {activeLetter === 'failed_neft_complaint' && (
        <div className="p-3.5 bg-rose-50/50 border border-rose-200 rounded-xl space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-rose-900 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-rose-600" />
              Failed NEFT Transaction Complaint (UTR Tracking)
            </h4>
            <span className="text-[10px] text-rose-800 font-semibold bg-rose-100 px-2 py-0.5 rounded border border-rose-200">
              NEFT Settlement
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                NEFT UTR Number *
              </label>
              <input
                type="text"
                value={formData.neftUtrNo || ''}
                onChange={(e) => onChange('neftUtrNo', e.target.value.toUpperCase())}
                placeholder="SBIN22681920491"
                className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-rose-500 font-mono font-bold"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Date *
              </label>
              <input
                type="text"
                value={formData.neftDate || ''}
                onChange={(e) => onChange('neftDate', e.target.value)}
                placeholder="DD/MM/YYYY"
                className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-rose-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Amount (Rs.) *
              </label>
              <input
                type="text"
                value={formData.neftAmount || ''}
                onChange={(e) => onChange('neftAmount', e.target.value)}
                placeholder="45,000.00"
                className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-rose-500 font-mono font-bold"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Beneficiary Name & Account
              </label>
              <input
                type="text"
                value={formData.neftBeneficiaryName || ''}
                onChange={(e) => onChange('neftBeneficiaryName', e.target.value.toUpperCase())}
                placeholder="Beneficiary Name"
                className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-rose-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Beneficiary Bank & IFSC
              </label>
              <input
                type="text"
                value={formData.neftBeneficiaryIfsc || ''}
                onChange={(e) => onChange('neftBeneficiaryIfsc', e.target.value.toUpperCase())}
                placeholder="e.g. HDFC0000123"
                className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-rose-500 font-mono"
              />
            </div>
          </div>
        </div>
      )}

      {/* 60. Failed RTGS Transaction Complaint */}
      {activeLetter === 'failed_rtgs_complaint' && (
        <div className="p-3.5 bg-rose-50/50 border border-rose-200 rounded-xl space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-rose-900 flex items-center gap-1.5">
              <Landmark className="w-3.5 h-3.5 text-rose-600" />
              Failed RTGS Transaction Complaint (Real-Time Settlement)
            </h4>
            <span className="text-[10px] text-rose-800 font-semibold bg-rose-100 px-2 py-0.5 rounded border border-rose-200">
              RTGS Gateway
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                RTGS UTR Number *
              </label>
              <input
                type="text"
                value={formData.rtgsUtrNo || ''}
                onChange={(e) => onChange('rtgsUtrNo', e.target.value.toUpperCase())}
                placeholder="MAHB22684910294"
                className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-rose-500 font-mono font-bold"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Date *
              </label>
              <input
                type="text"
                value={formData.rtgsDate || ''}
                onChange={(e) => onChange('rtgsDate', e.target.value)}
                placeholder="DD/MM/YYYY"
                className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-rose-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Amount (Rs.) *
              </label>
              <input
                type="text"
                value={formData.rtgsAmount || ''}
                onChange={(e) => onChange('rtgsAmount', e.target.value)}
                placeholder="25,00,000.00"
                className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-rose-500 font-mono font-bold"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Beneficiary Name & Account
              </label>
              <input
                type="text"
                value={formData.rtgsBeneficiaryName || ''}
                onChange={(e) => onChange('rtgsBeneficiaryName', e.target.value.toUpperCase())}
                placeholder="Beneficiary Name"
                className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-rose-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Beneficiary IFSC Code
              </label>
              <input
                type="text"
                value={formData.rtgsBeneficiaryIfsc || ''}
                onChange={(e) => onChange('rtgsBeneficiaryIfsc', e.target.value.toUpperCase())}
                placeholder="e.g. SBIN0000001"
                className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-rose-500 font-mono"
              />
            </div>
          </div>
        </div>
      )}

      {/* 61. Mobile Banking User ID Unlock Request */}
      {activeLetter === 'mobilebanking_unlock' && (
        <div className="p-3.5 bg-blue-50/50 border border-blue-200 rounded-xl space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-blue-600" />
              Mobile Banking User ID Unlock Request
            </h4>
            <span className="text-[10px] text-blue-800 font-semibold bg-blue-100 px-2 py-0.5 rounded border border-blue-200">
              Access Restoration
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Locked User ID / Registered Mobile *
              </label>
              <input
                type="text"
                value={formData.mobileBankingUserId || ''}
                onChange={(e) => onChange('mobileBankingUserId', e.target.value)}
                placeholder="registered user id or mobile"
                className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Reason for Lockout
              </label>
              <input
                type="text"
                value={formData.mobileBankingUnlockReason || ''}
                onChange={(e) => onChange('mobileBankingUnlockReason', e.target.value)}
                placeholder="Repeated incorrect MPIN attempts / System lock"
                className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      )}

      {/* 62. Internet Banking Password Reset Request */}
      {activeLetter === 'netbanking_password_reset' && (
        <div className="p-3.5 bg-blue-50/50 border border-blue-200 rounded-xl space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-blue-600" />
              Internet Banking Password Reset Request
            </h4>
            <span className="text-[10px] text-blue-800 font-semibold bg-blue-100 px-2 py-0.5 rounded border border-blue-200">
              Credential Reset
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Internet Banking User ID *
              </label>
              <input
                type="text"
                value={formData.netBankingLoginId || ''}
                onChange={(e) => onChange('netBankingLoginId', e.target.value)}
                placeholder="registered user login ID"
                className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Password Reset Scope *
              </label>
              <select
                value={formData.passwordResetType || 'both'}
                onChange={(e) => onChange('passwordResetType', e.target.value as any)}
                className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
              >
                <option value="both">Both Login & Transaction Passwords</option>
                <option value="login">Login Password Only</option>
                <option value="transaction">Transaction Password Only</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* 4. Common Account Details */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
          <CreditCard className="w-3.5 h-3.5 text-blue-600" />
          Account Details
        </h4>

        {/* 1. Name of Account Holder */}
        <div>
          <label className="block text-[11px] font-medium text-slate-600 mb-1">
            1. Name of Account Holder *
          </label>
          <div className="grid grid-cols-3 gap-2">
            <input
              type="text"
              value={formData.firstName}
              onChange={(e) => onChange('firstName', e.target.value.toUpperCase())}
              placeholder="First Name"
              className="px-2.5 py-1.5 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <input
              type="text"
              value={formData.middleName}
              onChange={(e) => onChange('middleName', e.target.value.toUpperCase())}
              placeholder="Middle Name"
              className="px-2.5 py-1.5 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <input
              type="text"
              value={formData.lastName}
              onChange={(e) => onChange('lastName', e.target.value.toUpperCase())}
              placeholder="Last Name"
              className="px-2.5 py-1.5 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* 2. Account Number */}
        <div>
          <label className="block text-[11px] font-medium text-slate-600 mb-1">
            2. Account Number *
          </label>
          <input
            type="text"
            value={formData.accountNumber}
            onChange={(e) => onChange('accountNumber', e.target.value.replace(/\D/g, ''))}
            placeholder="e.g. 39482015849"
            maxLength={17}
            className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono tracking-wider font-semibold"
          />
        </div>

        {/* 3. Account Type */}
        <div>
          <label className="block text-[11px] font-medium text-slate-600 mb-1">
            3. Account Type *
          </label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
              <input
                type="radio"
                name="statementAccountType"
                value="savings"
                checked={accountType === 'savings'}
                onChange={() => onChange('statementAccountType', 'savings')}
                className="text-blue-600 focus:ring-blue-500"
              />
              <span>Savings Account</span>
            </label>
            <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
              <input
                type="radio"
                name="statementAccountType"
                value="current"
                checked={accountType === 'current'}
                onChange={() => onChange('statementAccountType', 'current')}
                className="text-blue-600 focus:ring-blue-500"
              />
              <span>Current Account</span>
            </label>
          </div>
        </div>

        {/* 4. Registered Mobile & 5. Email ID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-medium text-slate-600 mb-1">
              4. Registered Mobile Number *
            </label>
            <div className="relative">
              <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                value={formData.mobileNumber}
                onChange={(e) => onChange('mobileNumber', e.target.value.replace(/\D/g, ''))}
                placeholder="9820145678"
                maxLength={10}
                className="w-full pl-8 pr-2.5 py-1.5 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-600 mb-1">
              5. Registered Email ID *
            </label>
            <div className="relative">
              <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="email"
                value={formData.emailId}
                onChange={(e) => onChange('emailId', e.target.value)}
                placeholder="name@email.com"
                className="w-full pl-8 pr-2.5 py-1.5 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 5. Applicant Closing Details */}
      <div className="space-y-3 pt-3 border-t border-slate-200">
        <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
          <User className="w-3.5 h-3.5 text-blue-600" />
          Applicant & Signatory Details
        </h4>

        {/* Address */}
        <div>
          <label className="block text-[11px] font-medium text-slate-600 mb-1">
            Applicant Address *
          </label>
          <div className="space-y-2">
            <input
              type="text"
              value={formData.addressLine1}
              onChange={(e) => onChange('addressLine1', e.target.value.toUpperCase())}
              placeholder="Flat / House / Street"
              className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <div className="grid grid-cols-3 gap-2">
              <input
                type="text"
                value={formData.cityVillage}
                onChange={(e) => onChange('cityVillage', e.target.value.toUpperCase())}
                placeholder="City / Village"
                className="px-2.5 py-1.5 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <input
                type="text"
                value={formData.state}
                onChange={(e) => onChange('state', e.target.value.toUpperCase())}
                placeholder="State"
                className="px-2.5 py-1.5 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <input
                type="text"
                value={formData.pincode}
                onChange={(e) => onChange('pincode', e.target.value.replace(/\D/g, ''))}
                placeholder="PIN Code"
                maxLength={6}
                className="px-2.5 py-1.5 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
