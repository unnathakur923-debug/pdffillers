import React, { useState, useEffect, useRef, useCallback } from 'react';
import { PDFDocument } from 'pdf-lib';
import { SbiFormData, InkColor, FormTemplateType } from './types/formTypes';
import { SAMPLE_SBI_FORM_DATA, EMPTY_FORM_DATA, getFreshApplicationData } from './data/sampleData';
import { applyStatementOverlay } from './utils/statementOverlay';
import { applyBomOverlay } from './utils/bomOverlay';
import { applySbiOverlay } from './utils/sbiOverlay';
import { getAtmBasePdf, applyAtmOverlay } from './utils/atmOverlay';
import { fetchAssetBytes } from './utils/assetHelper';
import { Navbar } from './components/Navbar';
import { PdfViewer } from './components/PdfViewer';
import { CustomPdfUploader } from './components/CustomPdfUploader';
import { StatementSection } from './components/FormSections/StatementSection';
import { AtmCardSection } from './components/FormSections/AtmCardSection';
import { BranchSection } from './components/FormSections/BranchSection';
import { PersonalSection } from './components/FormSections/PersonalSection';
import { AddressSection } from './components/FormSections/AddressSection';
import { ServicesSection } from './components/FormSections/ServicesSection';
import { NominationSection } from './components/FormSections/NominationSection';
import { PhotoUploader } from './components/PhotoUploader';
import { WelcomeFlashModal } from './components/WelcomeFlashModal';
import { AdSenseBanner } from './components/AdSenseBanner';
import { Footer } from './components/Footer';
import {
  CheckCircle2,
  Info,
  Download,
  PenTool,
  User,
  Building2,
  MapPin,
  Camera,
  Layers,
  ShieldCheck,
  FileText,
  CreditCard,
  FilePlus2,
  Phone,
  Eye,
} from 'lucide-react';

const STATEMENT_PDF_PATH = '/assets/aistudio/bank_account_statement_6b113566.pdf';
const BOM_PDF_PATH = '/assets/aistudio/bom_account_opening_form_c38c522e.pdf';
const SBI_PDF_PATH = '/assets/aistudio/sbi_account_opening_31b5c984.pdf';

type ActiveTab = 'statement' | 'atm' | 'branch' | 'personal' | 'address' | 'photo' | 'services' | 'nomination';

export default function App() {
  const [formData, setFormData] = useState<SbiFormData>(SAMPLE_SBI_FORM_DATA);
  const [inkColor, setInkColor] = useState<InkColor>('blue');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  // PDF template state
  const [pdfTemplateBytes, setPdfTemplateBytes] = useState<Uint8Array | null>(null);
  const [currentPdfName, setCurrentPdfName] = useState<string>('BOM_Mahabank_VISA_Debit_Card_AR35.pdf');
  const [activeTemplate, setActiveTemplate] = useState<FormTemplateType>('atm');
  const [isCustomPdf, setIsCustomPdf] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<ActiveTab>('atm');

  // Generated PDF blob URL
  const [pdfBlobUrl, setPdfBlobUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Flash welcome screen on app launch
  const [showFlash, setShowFlash] = useState<boolean>(true);

  // Mobile active tab view toggle: 'form' or 'pdf' preview
  const [mobileView, setMobileView] = useState<'form' | 'pdf'>('form');

  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Load Bank of Maharashtra ATM / VISA Debit Card Application (Form AR-35)
  const handleSelectAtm = useCallback(async () => {
    try {
      setIsGenerating(true);
      const bytes = await getAtmBasePdf();
      setPdfTemplateBytes(bytes);
      setCurrentPdfName('BOM_Mahabank_VISA_Debit_Card_AR35.pdf');
      setActiveTemplate('atm');
      setIsCustomPdf(false);
      setTotalPages(1);
      setCurrentPage(1);
      setActiveTab('atm');
      setStatusMessage('Switched to Bank of Maharashtra Mahabank VISA Debit Card Form AR-35');
      setTimeout(() => setStatusMessage(null), 3500);
    } catch (err) {
      console.error('Error loading ATM Form AR-35 PDF:', err);
    } finally {
      setIsGenerating(false);
    }
  }, []);

  // Load Statement PDF template
  const handleSelectStatement = useCallback(async () => {
    try {
      const bytes = await fetchAssetBytes(STATEMENT_PDF_PATH);
      setPdfTemplateBytes(bytes);
      setCurrentPdfName('bank_account_statement.pdf');
      setActiveTemplate('statement');
      setIsCustomPdf(false);
      setTotalPages(1);
      setCurrentPage(1);
      setActiveTab('statement');
      setStatusMessage('Switched to Bank of Maharashtra Statement Request (1 Page)');
      setTimeout(() => setStatusMessage(null), 3000);
    } catch (err) {
      console.error('Error loading Statement PDF:', err);
    }
  }, []);

  // Load Bank of Maharashtra 13-Page Account Opening PDF
  const handleSelectBom = useCallback(async () => {
    try {
      const bytes = await fetchAssetBytes(BOM_PDF_PATH);
      setPdfTemplateBytes(bytes);
      setCurrentPdfName('bom_account_opening_form.pdf');
      setActiveTemplate('bom');
      setIsCustomPdf(false);
      setTotalPages(13);
      setCurrentPage(1);
      setActiveTab('personal');
      setStatusMessage('Switched to Bank of Maharashtra Account Opening Form (13 Pages)');
      setTimeout(() => setStatusMessage(null), 3000);
    } catch (err) {
      console.error('Error loading BOM PDF:', err);
    }
  }, []);

  // Load SBI 7-Page Account Opening PDF
  const handleSelectSbi = useCallback(async () => {
    try {
      const bytes = await fetchAssetBytes(SBI_PDF_PATH);
      setPdfTemplateBytes(bytes);
      setCurrentPdfName('sbi_account_opening.pdf');
      setActiveTemplate('sbi');
      setIsCustomPdf(false);
      setTotalPages(7);
      setCurrentPage(1);
      setActiveTab('personal');
      setStatusMessage('Switched to State Bank of India Account Opening Form (7 Pages)');
      setTimeout(() => setStatusMessage(null), 3000);
    } catch (err) {
      console.error('Error loading SBI PDF:', err);
    }
  }, []);

  // Initial load: Default to Bank of Maharashtra ATM / VISA Debit Card Application
  useEffect(() => {
    handleSelectAtm();
  }, [handleSelectAtm]);

  // Generate / overlay filled PDF
  const generateFilledPdf = useCallback(
    async (currentData: SbiFormData, color: InkColor) => {
      if (!pdfTemplateBytes) return;

      setIsGenerating(true);
      try {
        const pdfDoc = await PDFDocument.load(pdfTemplateBytes);
        const pagesCount = pdfDoc.getPageCount();
        setTotalPages(pagesCount);

        // Apply ATM, statement, or full form overlay
        if (activeTemplate === 'atm') {
          await applyAtmOverlay(pdfDoc, currentData, color);
        } else if (activeTemplate === 'statement' || pagesCount === 1) {
          await applyStatementOverlay(pdfDoc, currentData, color);
        } else if (activeTemplate === 'bom' || pagesCount >= 10) {
          await applyBomOverlay(pdfDoc, currentData, color);
        } else {
          await applySbiOverlay(pdfDoc, currentData, color);
        }

        const pdfBytes = await pdfDoc.save();
        const blob = new Blob([pdfBytes as any], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);

        setPdfBlobUrl((prevUrl) => {
          if (prevUrl) {
            URL.revokeObjectURL(prevUrl);
          }
          return url;
        });
      } catch (err) {
        console.error('Error generating PDF:', err);
      } finally {
        setIsGenerating(false);
      }
    },
    [pdfTemplateBytes, activeTemplate]
  );

  // Debounced auto-generation on form change
  useEffect(() => {
    if (!pdfTemplateBytes) return;

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      generateFilledPdf(formData, inkColor);
    }, 300);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [formData, inkColor, pdfTemplateBytes, generateFilledPdf]);

  const handleFieldChange = <K extends keyof SbiFormData>(key: K, value: SbiFormData[K]) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleFillSample = () => {
    setFormData(SAMPLE_SBI_FORM_DATA);
    setStatusMessage('Sample data loaded! All form fields populated.');
    setTimeout(() => setStatusMessage(null), 4000);
  };

  const handleFreshApplication = () => {
    const fresh = getFreshApplicationData();
    setFormData(fresh);
    setStatusMessage('Started Fresh Application! Form is cleared with current date, ready for new applicant details.');
    setTimeout(() => setStatusMessage(null), 4000);
  };

  const handleClearForm = () => {
    setFormData(EMPTY_FORM_DATA);
    setStatusMessage('All form fields cleared.');
    setTimeout(() => setStatusMessage(null), 3000);
  };

  const handleDownload = () => {
    if (!pdfBlobUrl) return;
    const namePart = formData.firstName ? `${formData.firstName}_${formData.lastName}` : 'Applicant';
    const datePart = (formData.statementDate || formData.applicationDate || 'Form').replace(/[\/\s]/g, '');
    let prefix = 'Bank_Document';
    if (activeTemplate === 'atm') {
      prefix = 'BOM_ATM_Debit_Card_Application_AR35';
    } else if (activeTemplate === 'statement') {
      const bankPrefix = formData.statementBank === 'sbi' ? 'SBI' : 'BOM';
      let letterPrefix = 'Letter_43_Bank_Statement';
      switch (formData.letterType) {
        case 'remove_joint_holder':
          letterPrefix = 'Letter_01_Remove_Joint_Holder';
          break;
        case 'add_nominee':
          letterPrefix = 'Letter_02_Add_Nominee_DA1';
          break;
        case 'change_nominee':
          letterPrefix = 'Letter_03_Change_Nominee_DA3';
          break;
        case 'change_address':
          letterPrefix = 'Letter_04_Change_of_Address';
          break;
        case 'change_mobile':
          letterPrefix = 'Letter_05_Change_Mobile_Number';
          break;
        case 'aadhaar_linking':
          letterPrefix = 'Letter_06_Aadhaar_DBT_Linking';
          break;
        case 'pan_linking':
          letterPrefix = 'Letter_07_PAN_Card_Linking';
          break;
        case 'email_update':
          letterPrefix = 'Letter_08_Email_ID_Update';
          break;
        case 'signature_change':
          letterPrefix = 'Letter_09_Signature_Change';
          break;
        case 'name_correction':
          letterPrefix = 'Letter_10_Name_Correction';
          break;
        case 'closure':
          letterPrefix = 'Letter_11_Account_Closure';
          break;
        case 'minor_to_major':
          letterPrefix = 'Letter_12_Minor_to_Major';
          break;
        case 'jandhan_conversion':
          letterPrefix = 'Letter_13_JanDhan_to_Normal_Savings';
          break;
        case 'new_atm_card':
          letterPrefix = 'Letter_25_New_ATM_Debit_Card';
          break;
        case 'block_atm_card':
          letterPrefix = 'Letter_26_ATM_Card_Block';
          break;
        case 'lost_atm_card_complaint':
          letterPrefix = 'Letter_27_Lost_ATM_Card_Complaint';
          break;
        case 'atm_replacement':
          letterPrefix = 'Letter_28_Damaged_ATM_Replacement';
          break;
        case 'atm_pin_reset':
          letterPrefix = 'Letter_29_ATM_PIN_Generation_Reset';
          break;
        case 'atm_card_renewal':
          letterPrefix = 'Letter_30_ATM_Card_Renewal';
          break;
        case 'atm_txn_dispute':
          letterPrefix = 'Letter_31_ATM_Transaction_Dispute';
          break;
        case 'atm_failed_withdrawal':
          letterPrefix = 'Letter_32_ATM_Cash_Not_Dispensed';
          break;
        case 'cheque_book_request':
          letterPrefix = 'Letter_33_New_Cheque_Book';
          break;
        case 'duplicate_cheque_book':
          letterPrefix = 'Letter_34_Duplicate_Cheque_Book';
          break;
        case 'stop_cheque_payment':
          letterPrefix = 'Letter_35_Stop_Cheque_Payment';
          break;
        case 'cancel_cheque_request':
          letterPrefix = 'Letter_36_Cheque_Cancellation';
          break;
        case 'cheque_revalidation':
          letterPrefix = 'Letter_37_Cheque_Revalidation';
          break;
        case 'cheque_book_not_received':
          letterPrefix = 'Letter_38_Cheque_Book_Not_Received';
          break;
        case 'duplicate_cheque_request':
          letterPrefix = 'Letter_39_Duplicate_Cheque_Bankers_Draft';
          break;
        case 'cheque_clearing_complaint':
          letterPrefix = 'Letter_40_Cheque_Clearing_Complaint';
          break;
        case 'passbook':
          letterPrefix = 'Letter_41_New_Passbook_Issuance';
          break;
        case 'passbook_correction':
          letterPrefix = 'Letter_42_Passbook_Correction';
          break;
        case 'statement':
          letterPrefix = 'Letter_43_Bank_Statement_Request';
          break;
        case 'mini_statement_request':
          letterPrefix = 'Letter_44_Mini_Statement_Request';
          break;
        case 'balance_certificate':
          letterPrefix = 'Letter_45_Balance_Certificate';
          break;
        case 'interest_certificate':
          letterPrefix = 'Letter_46_Interest_Certificate';
          break;
        case 'account_confirmation_cert':
          letterPrefix = 'Letter_47_Account_Confirmation_Cert';
          break;
        case 'no_dues_certificate':
          letterPrefix = 'Letter_48_No_Dues_Certificate_NOC';
          break;
        case 'loan_statement_request':
          letterPrefix = 'Letter_49_Loan_Account_Statement';
          break;
        case 'bank_account_verification':
          letterPrefix = 'Letter_50_Bank_Account_Verification';
          break;
        case 'netbanking_activation':
          letterPrefix = 'Letter_51_Internet_Banking_Activation';
          break;
        case 'netbanking_deactivation':
          letterPrefix = 'Letter_52_Internet_Banking_Deactivation';
          break;
        case 'mobilebanking_activation':
          letterPrefix = 'Letter_53_Mobile_Banking_Activation';
          break;
        case 'mobilebanking_deactivation':
          letterPrefix = 'Letter_54_Mobile_Banking_Deactivation';
          break;
        case 'upi_activation':
          letterPrefix = 'Letter_55_UPI_Activation_Registration';
          break;
        case 'upi_failed_complaint':
          letterPrefix = 'Letter_56_UPI_Failed_Transaction_Complaint';
          break;
        case 'wrong_upi_complaint':
          letterPrefix = 'Letter_57_Wrong_UPI_Transaction_Complaint';
          break;
        case 'failed_imps_complaint':
          letterPrefix = 'Letter_58_Failed_IMPS_Transaction';
          break;
        case 'failed_neft_complaint':
          letterPrefix = 'Letter_59_Failed_NEFT_Transaction';
          break;
        case 'failed_rtgs_complaint':
          letterPrefix = 'Letter_60_Failed_RTGS_Transaction';
          break;
        case 'mobilebanking_unlock':
          letterPrefix = 'Letter_61_Mobile_Banking_ID_Unlock';
          break;
        case 'netbanking_password_reset':
          letterPrefix = 'Letter_62_Internet_Banking_Password_Reset';
          break;
        default:
          letterPrefix = 'Letter_43_Bank_Statement';
      }
      prefix = `${bankPrefix}_${letterPrefix}`;
    } else if (activeTemplate === 'bom') prefix = 'BOM_Account_Opening';
    else if (activeTemplate === 'sbi') prefix = 'SBI_Account_Opening';
    const filename = `${prefix}_${namePart}_${datePart}.pdf`.replace(/\s+/g, '_');

    const link = document.createElement('a');
    link.href = pdfBlobUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setStatusMessage(`Downloaded ${filename} successfully!`);
    setTimeout(() => setStatusMessage(null), 4000);
  };


  const handleCustomPdfLoaded = (bytes: Uint8Array, fileName: string) => {
    setPdfTemplateBytes(bytes);
    setCurrentPdfName(fileName);
    setActiveTemplate('custom');
    setIsCustomPdf(true);
    setStatusMessage(`Loaded custom PDF: ${fileName}`);
    setTimeout(() => setStatusMessage(null), 4000);
  };

  // Tabs configuration based on active template
  const isAtmMode = activeTemplate === 'atm';
  const isStatementMode = activeTemplate === 'statement';

  const tabs: Array<{ id: ActiveTab; label: string; icon: React.ComponentType<{ className?: string }> }> = isAtmMode
    ? [
        { id: 'atm', label: 'ATM / Debit Card (AR-35)', icon: CreditCard },
        { id: 'address', label: 'Address & Contact', icon: MapPin },
      ]
    : isStatementMode
    ? [
        { id: 'statement', label: 'Bank Letters (51 Formats)', icon: FileText },
        { id: 'address', label: 'Address & Contact', icon: MapPin },
      ]
    : [
        { id: 'personal', label: 'Personal & KYC', icon: User },
        { id: 'branch', label: 'Branch Header', icon: Building2 },
        { id: 'address', label: 'ID & Address', icon: MapPin },
        { id: 'photo', label: 'Photograph', icon: Camera },
        { id: 'services', label: 'Banking Services', icon: Layers },
        { id: 'nomination', label: 'Nomination (DA-1)', icon: ShieldCheck },
        { id: 'statement', label: 'Bank Letters (51 Formats)', icon: FileText },
        { id: 'atm', label: 'ATM Card (AR-35)', icon: CreditCard },
      ];

  // Field stats
  const filledFieldsCount = [
    formData.statementPeriodFrom,
    formData.statementPeriodTo,
    formData.firstName,
    formData.lastName,
    formData.accountNumber,
    formData.primaryAccountNumber,
    formData.atmEmbossedName,
    formData.statementAccountType || formData.accountCategory || formData.primaryAccountType,
    formData.mobileNumber,
    formData.emailId,
    formData.addressLine1,
    formData.cityVillage,
    formData.state,
    formData.pincode,
    formData.statementBranchName || formData.branchName,
    formData.statementBranchCode || formData.branchCode,
    formData.statementDate || formData.applicationDate || formData.atmDate,
  ].filter((v) => typeof v === 'string' && v.trim().length > 0).length;

  const getTemplateDisplayName = () => {
    if (activeTemplate === 'atm') {
      return 'Bank of Maharashtra — Mahabank VISA Debit Card Application (Form AR-35)';
    }
    if (activeTemplate === 'statement') {
      const bankTitle = formData.statementBank === 'sbi' ? 'State Bank of India' : 'Bank of Maharashtra';
      let letterTitle = 'Letter #43: Bank Statement Request Application';
      switch (formData.letterType) {
        case 'remove_joint_holder':
          letterTitle = "Letter #01: Remove Joint Account Holder's Name Application";
          break;
        case 'add_nominee':
          letterTitle = 'Letter #02: Add Nominee Application (Form DA-1)';
          break;
        case 'change_nominee':
          letterTitle = 'Letter #03: Change / Cancel Nominee Application (Form DA-3)';
          break;
        case 'change_address':
          letterTitle = 'Letter #04: Change of Address Application';
          break;
        case 'change_mobile':
          letterTitle = 'Letter #05: Change of Mobile Number Application';
          break;
        case 'aadhaar_linking':
          letterTitle = 'Letter #06: Aadhaar Linking with Bank Account';
          break;
        case 'pan_linking':
          letterTitle = 'Letter #07: PAN Linking Application';
          break;
        case 'email_update':
          letterTitle = 'Letter #08: Email ID Update Application';
          break;
        case 'signature_change':
          letterTitle = 'Letter #09: Signature Change Request';
          break;
        case 'name_correction':
          letterTitle = 'Letter #10: Name Correction in Account Application';
          break;
        case 'closure':
          letterTitle = 'Letter #11: Account Closure Application';
          break;
        case 'minor_to_major':
          letterTitle = 'Letter #12: Minor to Major Conversion Application';
          break;
        case 'jandhan_conversion':
          letterTitle = 'Letter #13: Jan Dhan to Normal Account Conversion';
          break;
        case 'new_atm_card':
          letterTitle = 'Letter #25: New ATM / Debit Card Request Application';
          break;
        case 'block_atm_card':
          letterTitle = 'Letter #26: ATM Card Blocking Application';
          break;
        case 'lost_atm_card_complaint':
          letterTitle = 'Letter #27: Lost ATM Card Complaint Application';
          break;
        case 'atm_replacement':
          letterTitle = 'Letter #28: Damaged ATM Card Replacement Application';
          break;
        case 'atm_pin_reset':
          letterTitle = 'Letter #29: ATM PIN Generation / Reset Request';
          break;
        case 'atm_card_renewal':
          letterTitle = 'Letter #30: ATM Card Renewal Application';
          break;
        case 'atm_txn_dispute':
          letterTitle = 'Letter #31: ATM Transaction Dispute Application';
          break;
        case 'atm_failed_withdrawal':
          letterTitle = 'Letter #32: ATM Cash Not Dispensed Complaint';
          break;
        case 'cheque_book_request':
          letterTitle = 'Letter #33: New Cheque Book Request Application';
          break;
        case 'duplicate_cheque_book':
          letterTitle = 'Letter #34: Duplicate Cheque Book Request Application';
          break;
        case 'stop_cheque_payment':
          letterTitle = 'Letter #35: Stop Cheque Payment Application';
          break;
        case 'cancel_cheque_request':
          letterTitle = 'Letter #36: Cheque Cancellation Application';
          break;
        case 'cheque_revalidation':
          letterTitle = 'Letter #37: Cheque Revalidation Application';
          break;
        case 'cheque_book_not_received':
          letterTitle = 'Letter #38: Cheque Book Not Received Complaint';
          break;
        case 'duplicate_cheque_request':
          letterTitle = "Letter #39: Duplicate Cheque / Banker's Draft Application";
          break;
        case 'cheque_clearing_complaint':
          letterTitle = 'Letter #40: Cheque Clearing Complaint Application';
          break;
        case 'passbook':
          letterTitle = 'Letter #41: New Passbook Issuance Application';
          break;
        case 'passbook_correction':
          letterTitle = 'Letter #42: Passbook Correction Application';
          break;
        case 'statement':
          letterTitle = 'Letter #43: Bank Statement Request Application';
          break;
        case 'mini_statement_request':
          letterTitle = 'Letter #44: Mini Statement Request';
          break;
        case 'balance_certificate':
          letterTitle = 'Letter #45: Balance Certificate Request';
          break;
        case 'interest_certificate':
          letterTitle = 'Letter #46: Interest Certificate Request';
          break;
        case 'account_confirmation_cert':
          letterTitle = 'Letter #47: Account Confirmation Certificate Request';
          break;
        case 'no_dues_certificate':
          letterTitle = 'Letter #48: No Dues Certificate Request (NOC)';
          break;
        case 'loan_statement_request':
          letterTitle = 'Letter #49: Loan Account Statement Request';
          break;
        case 'bank_account_verification':
          letterTitle = 'Letter #50: Bank Account Verification Letter Request';
          break;
        case 'netbanking_activation':
          letterTitle = 'Letter #51: Internet Banking Activation Application';
          break;
        case 'netbanking_deactivation':
          letterTitle = 'Letter #52: Internet Banking Deactivation Application';
          break;
        case 'mobilebanking_activation':
          letterTitle = 'Letter #53: Mobile Banking Activation Application';
          break;
        case 'mobilebanking_deactivation':
          letterTitle = 'Letter #54: Mobile Banking Deactivation Application';
          break;
        case 'upi_activation':
          letterTitle = 'Letter #55: UPI Activation / Registration Request';
          break;
        case 'upi_failed_complaint':
          letterTitle = 'Letter #56: UPI Transaction Failed Complaint';
          break;
        case 'wrong_upi_complaint':
          letterTitle = 'Letter #57: Wrong UPI Transaction Complaint';
          break;
        case 'failed_imps_complaint':
          letterTitle = 'Letter #58: Failed IMPS Transaction Complaint';
          break;
        case 'failed_neft_complaint':
          letterTitle = 'Letter #59: Failed NEFT Transaction Complaint';
          break;
        case 'failed_rtgs_complaint':
          letterTitle = 'Letter #60: Failed RTGS Transaction Complaint';
          break;
        case 'mobilebanking_unlock':
          letterTitle = 'Letter #61: Mobile Banking User ID Unlock Request';
          break;
        case 'netbanking_password_reset':
          letterTitle = 'Letter #62: Internet Banking Password Reset Request';
          break;
        default:
          letterTitle = 'Letter #43: Bank Statement Request Application';
      }
      return `${letterTitle} (${bankTitle})`;
    }
    if (activeTemplate === 'bom') return 'Bank of Maharashtra — Account Opening Form';
    if (activeTemplate === 'sbi') return 'State Bank of India — Account Opening Form';
    return `Custom PDF: ${currentPdfName}`;
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col text-slate-800">
      {/* Flash Welcome Screen on app launch / clicking link */}
      <WelcomeFlashModal
        isOpen={showFlash}
        onEnter={() => setShowFlash(false)}
      />

      {/* Top Header */}
      <Navbar
        onDownload={handleDownload}
        onFillSample={handleFillSample}
        onClear={handleClearForm}
        onFreshApplication={handleFreshApplication}
        onOpenWelcome={() => setShowFlash(true)}
        hasData={Boolean(formData.firstName || formData.accountNumber || formData.primaryAccountNumber)}
        activeTemplate={activeTemplate}
        customSubtitle={getTemplateDisplayName()}
      />

      {/* Main Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-6 space-y-4">
        {/* Flashing Announcement & Contact Header */}
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-amber-500 via-rose-500 to-emerald-500 p-[2px] shadow-sm animate-pulse">
          <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900 px-4 py-2.5 rounded-[10px] text-white">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
              </span>
              <div className="text-xs font-bold tracking-wide truncate">
                <span className="text-amber-300 font-extrabold uppercase">Thakur Xerox Welcomes You:</span>{' '}
                <span className="text-slate-100">Contact Vinodsingh Arjunsingh Thakur</span>{' '}
                <span className="text-amber-300 font-extrabold">— 9970996060</span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <a
                href="tel:9970996060"
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black shadow-xs transition-transform active:scale-95"
              >
                <Phone className="w-3.5 h-3.5 fill-slate-950" />
                <span>Call 9970996060</span>
              </a>
              <button
                type="button"
                onClick={() => setShowFlash(true)}
                className="text-[11px] text-slate-300 hover:text-white underline decoration-slate-500 underline-offset-2 ml-1 cursor-pointer"
              >
                Flash Intro
              </button>
            </div>
          </div>
        </div>

        {/* AdSense Placement 1: Header Area */}
        <AdSenseBanner
          slot="header-banner"
          format="horizontal"
          className="bg-white/80 border border-slate-200/90 rounded-xl"
        />

        {/* Banner with status and stats */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-white px-4 py-3 border border-slate-200 rounded-xl shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
            <div>
              <h1 className="text-sm font-bold text-slate-900">
                {getTemplateDisplayName()}
              </h1>
              <p className="text-xs text-slate-500">
                Direct field mapping, authentic line alignment, live PDF preview, and instant download.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5 text-slate-600 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{filledFieldsCount} Fields Mapped</span>
            </div>
            <span className="text-slate-300">|</span>
            <div className="flex items-center gap-1.5 text-slate-600 font-medium">
              <span>{totalPages} {totalPages === 1 ? 'Page' : 'Pages'}</span>
            </div>
            <span className="text-slate-300">|</span>
            <div className="flex items-center gap-1 text-[11px] text-slate-600 font-medium bg-slate-100 px-2.5 py-1 rounded">
              <PenTool className="w-3 h-3 text-slate-500" />
              <span>Physical Signature on Printed Copy</span>
            </div>
          </div>
        </div>

        {/* Template Switcher Grid Buttons */}
        <CustomPdfUploader
          currentPdfName={currentPdfName}
          isCustomPdf={isCustomPdf}
          activeTemplate={activeTemplate}
          onSelectBom={handleSelectBom}
          onSelectSbi={handleSelectSbi}
          onSelectStatement={handleSelectStatement}
          onSelectAtm={handleSelectAtm}
          onCustomPdfLoaded={handleCustomPdfLoaded}
          onFreshApplication={handleFreshApplication}
        />

        {/* Status Toast */}
        {statusMessage && (
          <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-lg text-xs font-medium animate-fadeIn">
            <Info className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{statusMessage}</span>
          </div>
        )}

        {/* AdSense Placement 2: Below PDF Upload Section */}
        <AdSenseBanner
          slot="below-upload-banner"
          format="auto"
          className="bg-white/80 border border-slate-200/90 rounded-xl"
        />

        {/* Mobile View Toggle (visible only on < lg screens for optimal phone UX) */}
        <div className="lg:hidden flex items-center bg-slate-200/80 p-1 rounded-xl shadow-inner text-xs font-semibold">
          <button
            type="button"
            onClick={() => setMobileView('form')}
            className={`flex-1 py-2.5 px-3 rounded-lg flex items-center justify-center gap-2 transition-all min-h-[44px] ${
              mobileView === 'form'
                ? 'bg-white text-slate-900 shadow-xs font-bold ring-1 ring-slate-300'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <PenTool className="w-4 h-4 text-emerald-600" />
            <span>1. Form Fields</span>
            {filledFieldsCount > 0 && (
              <span className="bg-emerald-100 text-emerald-800 text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                {filledFieldsCount}
              </span>
            )}
          </button>
          <button
            type="button"
            onClick={() => setMobileView('pdf')}
            className={`flex-1 py-2.5 px-3 rounded-lg flex items-center justify-center gap-2 transition-all min-h-[44px] ${
              mobileView === 'pdf'
                ? 'bg-white text-slate-900 shadow-xs font-bold ring-1 ring-slate-300'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Eye className="w-4 h-4 text-sky-600" />
            <span>2. Live PDF Preview</span>
            <span className="bg-sky-100 text-sky-800 text-[10px] px-1.5 py-0.5 rounded-full font-bold">
              p. {currentPage}/{totalPages}
            </span>
          </button>
        </div>

        {/* Workspace 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Form Controls (5 cols on lg) */}
          <div
            className={`lg:col-span-5 bg-white border border-slate-200 rounded-xl p-3 sm:p-5 shadow-xs space-y-4 ${
              mobileView === 'form' ? 'block' : 'hidden lg:block'
            }`}
          >
            {/* Form Header with Quick Fresh Application action */}
            <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-100">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Application Form Details
              </span>
              <button
                type="button"
                onClick={handleFreshApplication}
                className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-md border border-emerald-300 transition-colors shadow-2xs hover:shadow-xs active:scale-98"
                title="Start a fresh application for a new customer"
              >
                <FilePlus2 className="w-3.5 h-3.5 text-emerald-700" />
                <span>+ Fresh Application</span>
              </button>
            </div>

            {/* Form Section Navigation Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-slate-200 scrollbar-none">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isSelected = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors shrink-0 ${
                      isSelected
                        ? 'bg-sky-50 text-sky-800 border border-sky-300 font-semibold shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Active Section Content */}
            <div className="pt-1">
              {activeTab === 'atm' && (
                <AtmCardSection formData={formData} onChange={handleFieldChange} />
              )}
              {activeTab === 'statement' && (
                <StatementSection formData={formData} onChange={handleFieldChange} />
              )}
              {activeTab === 'branch' && (
                <BranchSection formData={formData} onChange={handleFieldChange} />
              )}
              {activeTab === 'personal' && (
                <PersonalSection formData={formData} onChange={handleFieldChange} />
              )}
              {activeTab === 'address' && (
                <AddressSection formData={formData} onChange={handleFieldChange} />
              )}
              {activeTab === 'photo' && (
                <div className="space-y-4">
                  <PhotoUploader
                    photoDataUrl={formData.photoDataUrl}
                    onPhotoChange={(url) => handleFieldChange('photoDataUrl', url)}
                  />
                </div>
              )}
              {activeTab === 'services' && (
                <ServicesSection formData={formData} onChange={handleFieldChange} />
              )}
              {activeTab === 'nomination' && (
                <NominationSection formData={formData} onChange={handleFieldChange} />
              )}
            </div>

            {/* AdSense Placement 3: Between Content Sections */}
            <AdSenseBanner
              slot="between-content-banner"
              format="auto"
              className="bg-slate-50/80 border border-slate-200/90 rounded-lg my-2"
            />

            {/* Mobile-only shortcut to switch to PDF preview */}
            <div className="lg:hidden pt-2">
              <button
                type="button"
                onClick={() => setMobileView('pdf')}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-sky-50 hover:bg-sky-100 border border-sky-300 text-sky-900 font-bold text-xs transition-colors shadow-2xs"
              >
                <Eye className="w-4 h-4 text-sky-700" />
                <span>Preview Output PDF (Page {currentPage}/{totalPages})</span>
              </button>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleFillSample}
                className="text-xs text-emerald-700 hover:text-emerald-900 font-semibold"
              >
                Reset to Sample Values
              </button>
              <button
                type="button"
                onClick={handleDownload}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-sm hover:shadow transition-all"
              >
                <Download className="w-3.5 h-3.5" />
                Download Filled PDF
              </button>
            </div>
          </div>

          {/* Right Column: High-Precision PDF Viewer (7 cols on lg) */}
          <div
            className={`lg:col-span-7 min-h-[520px] h-[calc(100vh-160px)] sm:h-[800px] lg:h-[840px] sticky top-20 ${
              mobileView === 'pdf' ? 'block' : 'hidden lg:block'
            }`}
          >
            {/* Mobile-only back button */}
            <div className="lg:hidden mb-2">
              <button
                type="button"
                onClick={() => setMobileView('form')}
                className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-900 font-bold text-xs transition-colors shadow-2xs"
              >
                <PenTool className="w-3.5 h-3.5 text-emerald-700" />
                <span>← Back to Form Input Fields</span>
              </button>
            </div>

            <PdfViewer
              pdfBlobUrl={pdfBlobUrl}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => setCurrentPage(page)}
              onDownload={handleDownload}
              onRefresh={() => generateFilledPdf(formData, inkColor)}
              isGenerating={isGenerating}
              inkColor={inkColor}
              onInkColorChange={(c) => setInkColor(c)}
              fileName={
                formData.firstName
                  ? `${activeTemplate.toUpperCase()}_Form_${formData.firstName}_${formData.lastName}.pdf`
                  : `${activeTemplate.toUpperCase()}_Form.pdf`
              }
            />
          </div>
        </div>
      </main>

      {/* Footer Area with AdSense Banner 4 and Thakur Xerox Contact / Privacy Policy */}
      <Footer />
    </div>
  );
}
