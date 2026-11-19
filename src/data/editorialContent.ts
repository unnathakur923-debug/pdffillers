import { FormTemplateType } from '../types/formTypes';

export interface HowItWorksStep {
  number: string;
  title: string;
  summary: string;
  detail: string;
}

export interface TemplateEditorialProfile {
  id: FormTemplateType;
  title: string;
  shortName: string;
  pagesLabel: string;
  audience: string;
  overview: string;
  requiredDocuments: string[];
  submissionTips: string[];
}

export interface PracticalUseCase {
  title: string;
  persona: string;
  scenario: string;
  outcome: string;
  templateId: FormTemplateType;
  ctaLabel: string;
}

export interface ConsolidatedGuidePillar {
  id: string;
  index: string;
  title: string;
  subtitle: string;
  templateId: FormTemplateType;
  summary: string;
  sections: Array<{
    heading: string;
    body: string;
    bullets?: string[];
  }>;
  documentsChecklist: string[];
}

export interface LetterCategoryGuide {
  category: string;
  count: number;
  typicalTurnaround: string;
  commonLetters: string[];
  requiredEnclosures: string;
  preparationNote: string;
}

export interface FaqEntry {
  question: string;
  answer: string;
  category: string;
}

export const HOW_IT_WORKS_STEPS: HowItWorksStep[] = [
  {
    number: '01',
    title: 'Choose the Official Form or Bank Letter Format',
    summary: 'Select the exact template required by your bank branch from the switcher bar.',
    detail:
      'DocuFill Studio includes five calibrated banking workflows: the 3-page SBI पीक कर्ज मागणी (Crop Loan, PMFBY Sowing Declaration & 4-Boundary Affidavit), the 13-page Bank of Maharashtra Account Opening form, the 7-page State Bank of India Account Opening & CIF form, the Mahabank VISA/RuPay Debit Card Form AR-35, and 51 standardized Bank Application Letters.',
  },
  {
    number: '02',
    title: 'Enter Applicant Details (With Automatic Marathi Support)',
    summary: 'Type directly in English or Marathi using structured input sections.',
    detail:
      'For the SBI Crop Loan & Peek Pera set, built-in phonetic transliteration converts English names, village names, crops, and boundary descriptions into clear Marathi Devanagari script automatically. For CIF and ATM forms, uppercase formatting and box-count validation prevent spelling truncation.',
  },
  {
    number: '03',
    title: 'Inspect Real-Time Box & Baseline Alignment',
    summary: 'Review every page in the live PDF preview before printing.',
    detail:
      'As you type, our coordinate engine places each character cleanly inside individual CIF letter-boxes or strictly above printed ruling lines using transparent high-DPI rendering. You can flip across all pages, switch between blue or black pen ink appearance, and verify that no digits overlap pre-printed text.',
  },
  {
    number: '04',
    title: 'Attach Passport Photograph (Optional) & Download A4 PDF',
    summary: 'Export a print-ready PDF directly inside your browser.',
    detail:
      'Upload a passport-size photo for automatic placement inside the designated photograph box on Page 1. Every calculation happens locally on your device—no personal data is sent to any cloud server. Click Download Filled PDF to save a crisp, high-resolution A4 file named with the applicant and date.',
  },
  {
    number: '05',
    title: 'Print at 100% Scale, Sign Physically & Submit at Branch',
    summary: 'Complete physical verification and attach self-attested KYC copies.',
    detail:
      'Print the downloaded PDF on standard A4 paper at Actual Size (100% scale, no fit-to-page shrinking) so grid spacing stays exact. Sign or affix a thumb impression in the physical signature box using a blue or black ballpoint pen, attach photocopies of supporting KYC/land records, and submit at your home branch.',
  },
];

export const TEMPLATE_PROFILES: Record<FormTemplateType, TemplateEditorialProfile> = {
  peek_karj: {
    id: 'peek_karj',
    title: 'SBI पीक कर्ज मागणी, पिकपेरा स्वयंघोषणा व चतुःसीमा (3-Page Crop Loan Set)',
    shortName: 'SBI Crop Loan & Peek Pera',
    pagesLabel: '3 Pages · Marathi Devanagari',
    audience: 'Farmers applying for Kisan Credit Card (KCC) / Kharif & Rabi crop loans in Maharashtra',
    overview:
      'This consolidated 3-page package combines the SBI Crop Loan Demand Application (पीक कर्जासाठी अर्जाचा नमुना), the Pradhan Mantri Fasal Bima Yojana (PMFBY) Kharif Crop Sowing Self-Declaration (पिकपेरा स्वयंघोषणापत्र), and the Four-Boundary Land Declaration (चतुःसीमा स्वयंघोषणापत्र). All three pages automatically share core applicant details—farmer name, village, taluka, district, Gat/Survey number, and total area—eliminating repetitive handwriting and reducing branch return rates.',
    requiredDocuments: [
      'Latest digital 7/12 Utara (सातबारा उतारा) with updated crop entry (ई-पीक पाहणी)',
      '8-A Khata Utara (८-अ खाते उतारा) showing consolidated landholding',
      'Ferfar Nakkal (फेरफार नक्कल / Mutation Entry) if recently inherited or purchased',
      'Aadhaar Card photocopy (linked to mobile number for OTP & DBT verification)',
      'PAN Card photocopy (recommended for loan limits above ₹50,000)',
      'Savings Bank Passbook first page & two recent passport-size photographs',
    ],
    submissionTips: [
      'Confirm that the Gat/Survey number and Hectare-Are (हे.आर.) area match your latest 7/12 Utara exactly.',
      'List neighbouring farmer names or roads accurately for all four boundaries (East, West, North, South) on Page 3.',
      'Sign or affix a clear left-hand thumb impression above the farmer signature line on Pages 2 and 3 after printing.',
    ],
  },
  bom: {
    id: 'bom',
    title: 'Bank of Maharashtra Account Opening Form (13-Page Individual & KYC Set)',
    shortName: 'BOM Account Opening',
    pagesLabel: '13 Pages · Box-Aligned CIF & KYC',
    audience: 'Individuals opening new Savings, Basic Savings, or Salary accounts at Bank of Maharashtra',
    overview:
      'Bank of Maharashtra uses a detailed 13-page Account Opening Booklet covering Customer Information File (CIF) creation, Aadhaar/PAN KYC verification, FATCA/CRS tax residency declaration, banking service mandates (ATM card, cheque book, SMS alerts, internet banking), and Nomination Form DA-1. DocuFill Studio maps every character into its individual printed letter box across all pages so branch data-entry staff can read every letter without ambiguity.',
    requiredDocuments: [
      'Aadhaar Card or Passport / Voter ID / Driving Licence (Officially Valid Document)',
      'PAN Card (or Form 60 if applicant does not hold a PAN)',
      'Two recent colour passport-size photographs with white/light background',
      'Proof of current residential address if different from permanent OVD address',
      'Nominee identity details (name, relationship, and date of birth if minor)',
    ],
    submissionTips: [
      'Carry original KYC documents alongside self-attested photocopies for In-Person Verification (IPV) at the branch.',
      'Leave "For Office Use Only" and Branch Manager verification blocks blank for bank officials.',
      'Double-check your 10-digit mobile number and email address—OTP and debit card dispatch alerts depend on them.',
    ],
  },
  sbi: {
    id: 'sbi',
    title: 'State Bank of India Account Opening & CIF Form (7-Page Standard Set)',
    shortName: 'SBI Account Opening',
    pagesLabel: '7 Pages · Box-Aligned CIF & DA-1',
    audience: 'New SBI account applicants, students, salaried employees, and pensioners',
    overview:
      'The State Bank of India 7-page Account Opening Form consolidates Personal Details, Identity & Address KYC, Account Type selection, Channel Services (Debit Card, Cheque Book, Mobile Banking), Nomination Form DA-1, and FATCA declaration. Writing tightly into small optical-scan boxes by hand often causes misread characters during CBS entry; preparing the form digitally ensures uniform spacing and legible dates in DD/MM/YYYY boxes.',
    requiredDocuments: [
      'Aadhaar Card and PAN Card (mandatory for regular savings accounts; Form 60 where applicable)',
      'Two recent passport-size photographs',
      'Initial deposit amount or zero-balance eligibility confirmation (e.g., BSBDA / student scheme)',
      'Guardian KYC documents if opening a Minor (Pehla Kadam / Pehli Udaan) account',
    ],
    submissionTips: [
      'Ensure your full name matches your PAN and Aadhaar records exactly to avoid e-KYC mismatch.',
      'Review the Nomination Form DA-1 section carefully—nominating a family member simplifies future claim settlement.',
      'Sign consistently inside the specimen signature boxes using dark blue or black ink after printing.',
    ],
  },
  atm: {
    id: 'atm',
    title: 'Bank of Maharashtra Mahabank VISA / RuPay Debit Card Application (Form AR-35)',
    shortName: 'ATM / Debit Card (AR-35)',
    pagesLabel: '1 Page · Official Form AR-35',
    audience: 'BOM customers requesting a new, replacement, or add-on ATM/Debit card',
    overview:
      'Form AR-35 is the official Bank of Maharashtra application for issuing a Mahabank VISA or RuPay Debit Card. It captures the exact 19-character embossed name desired on the card face, primary and secondary linked account numbers, mobile number for Green PIN / SMS alerts, and delivery address. DocuFill Studio aligns every character directly inside the scanned Form AR-35 grid boxes.',
    requiredDocuments: [
      'Active Bank of Maharashtra Savings or Current Account Passbook photocopy',
      'Self-attested Aadhaar Card or PAN Card copy for branch verification',
      'Damaged card (if applying for physical card replacement at branch)',
    ],
    submissionTips: [
      'Keep the Card Embossed Name within 19 characters (including spaces) so it fits the physical card layout.',
      'Verify whether your branch offers Instant Personalized Kits or dispatches the card by Speed Post to your registered address.',
      'Never write your ATM PIN or OTP anywhere on the application form.',
    ],
  },
  statement: {
    id: 'statement',
    title: 'Official Bank Application Letters Suite (51 Standardized Formats for BOM & SBI)',
    shortName: '51 Bank Application Letters',
    pagesLabel: '1 Page · Clean Formal Letterhead',
    audience: 'Account holders submitting branch requests for KYC, ATM, cheques, certificates, or digital banking disputes',
    overview:
      'Instead of drafting ad-hoc handwritten letters that often miss essential CBS reference numbers, this module provides 51 branch-ready formal application formats organized across five banking categories: Account & KYC Updates, ATM/Debit Card Requests & Disputes, Cheque Book & Payment Controls, Statements & Certificates, and Digital/UPI/IMPS/NEFT/RTGS Complaints. Each letter dynamically adapts to State Bank of India or Bank of Maharashtra with accurate subject lines, transaction references, and enclosure checklists.',
    requiredDocuments: [
      'Copy of Savings/Current Account Passbook front page showing Account Number & CIF',
      'Self-attested Aadhaar or PAN photocopy for identity verification',
      'Supporting proof specific to the request (e.g., UTR/RRN screenshot for failed UPI/IMPS, FIR copy for lost ATM card, or new address proof)',
    ],
    submissionTips: [
      'Always request a stamped acknowledgement receipt (or inward register number) from the branch counter, especially for stop-payment, card-blocking, or failed-transaction dispute letters.',
      'For failed UPI, IMPS, NEFT, or ATM cash-not-dispensed disputes, mention the exact date, amount, and 12-digit RRN/UTR number to align with RBI Turnaround Time (TAT) auto-reversal rules.',
    ],
  },
  custom: {
    id: 'custom',
    title: 'Custom PDF Document Preview & Preparation',
    shortName: 'Custom PDF Template',
    pagesLabel: 'Custom Pages · Local Browser Preview',
    audience: 'Users inspecting or overlaying standard banking data onto a custom branch PDF',
    overview:
      'Upload any branch-specific PDF document directly in your browser to inspect pages and overlay standard applicant details locally. All custom PDF files remain strictly in your device memory and are cleared as soon as you close or refresh the browser tab.',
    requiredDocuments: [
      'Original unencrypted PDF form issued by your bank or institution',
      'Supporting identity documents requested by that specific form',
    ],
    submissionTips: [
      'Check every page in the live viewer before downloading to confirm alignment matches your custom document layout.',
    ],
  },
};

export const PRACTICAL_USE_CASES: PracticalUseCase[] = [
  {
    title: 'Kharif & Rabi Crop Loan (KCC) Preparation in Rural Maharashtra',
    persona: 'Farmers & Agricultural Families',
    scenario:
      'During May–July Kharif sowing season, bank branches experience heavy queues for SBI पीक कर्ज मागणी applications. Handwritten Marathi forms frequently get returned due to illegible Gat numbers, mismatched Hectare-Are totals across pages, or missing 4-boundary details.',
    outcome:
      'Enter farmer details once—even by typing phonetically in English—and generate all three synchronized pages (Crop Loan Application, PMFBY Sowing Declaration, and Chatusima Affidavit) cleanly aligned above the ruled lines in under five minutes.',
    templateId: 'peek_karj',
    ctaLabel: 'Open SBI Crop Loan Tool',
  },
  {
    title: 'Error-Free Savings Account & KYC Booklet Preparation',
    persona: 'Students, Salaried Employees & Senior Citizens',
    scenario:
      'Filling 7-page SBI or 13-page Bank of Maharashtra CIF booklets by hand requires writing one block letter per tiny grid box across dozens of fields. A single overwritten Aadhaar digit or misaligned date often forces starting over with a fresh booklet.',
    outcome:
      'Map every letter, date box, address line, and Nomination Form DA-1 detail digitally with real-time page-by-page verification, then print a spotless A4 set ready for physical signature and branch submission.',
    templateId: 'bom',
    ctaLabel: 'Open Account Opening Tool',
  },
  {
    title: 'Urgent Dispute Letters for Failed UPI, ATM Cash & Stop-Cheque Requests',
    persona: 'Everyday Bank Customers',
    scenario:
      'When an ATM debits cash without dispensing notes, a UPI/IMPS transfer gets stuck, or a cheque needs immediate stop-payment, branches require a formal written application containing the account number, exact date, amount, and transaction RRN/UTR reference.',
    outcome:
      'Pick the matching letter from 51 pre-structured BOM & SBI formats, enter the transaction details, and print a formal, RBI-guideline-aligned application letter with proper enclosures and acknowledgement space.',
    templateId: 'statement',
    ctaLabel: 'Open 51 Bank Letters Tool',
  },
  {
    title: 'High-Volume Document Desk Operations at Xerox & CSC Centers',
    persona: 'Xerox Shops, Maha-e-Seva & CSC Operators',
    scenario:
      'Document assistance desks serve dozens of citizens daily who need ATM card applications (Form AR-35), mobile/Aadhaar linking letters, nominee updates, and crop loan sets quickly without storing customer personal data on public PCs.',
    outcome:
      'Use the one-click Fresh Application reset between customers to clear previous inputs instantly, prepare clean print-ready PDFs locally in the browser, and uphold complete customer privacy.',
    templateId: 'atm',
    ctaLabel: 'Open ATM Card (AR-35) Tool',
  },
];

export const CONSOLIDATED_GUIDE_PILLARS: ConsolidatedGuidePillar[] = [
  {
    id: 'guide-peek-karj',
    index: '01',
    title: 'SBI पीक कर्ज मागणी (Crop Loan), PMFBY पिकपेरा & चतुःसीमा Complete Guide',
    subtitle: '3-Page Maharashtra Agricultural Loan & Sowing Self-Declaration Set',
    templateId: 'peek_karj',
    summary:
      'Farmers applying for Kisan Credit Card (KCC) or seasonal Kharif/Rabi crop loans at State Bank of India branches in Maharashtra typically submit three linked Marathi documents together. This consolidated guide walks through every required field and land-record detail so your file clears bank scrutiny on the first visit.',
    sections: [
      {
        heading: 'Page 1: पीक कर्जासाठी अर्जाचा नमुना (Crop Loan Demand Form)',
        body: 'Captures applicant identity (name, mobile, village, taluka, gender, Aadhaar), existing loan accounts at any bank or cooperative society, active savings account details, Survey/Gat number, total cultivable land area, and proposed crop cultivation area.',
        bullets: [
          'Always list any active crop loan or term loan accurately under Item 7; if you have no active loan, clearly state "नाही (Nil)".',
          'Record land area in Hectare-Are (हे.आर.) exactly as printed on your 7/12 Utara alongside optional acre equivalents.',
          'Attach a recent passport-size photograph in the bottom-right photo frame.',
        ],
      },
      {
        heading: 'Page 2: प्रधानमंत्री पीक विमा योजना (PMFBY) पिकपेरा स्वयंघोषणापत्र',
        body: 'Serves as the farmer self-declaration for Kharif sowing coverage, detailing village (मौजे), Gat/Survey number, sown crop name (e.g., कापूस, सोयाबीन, मका, तूर), sowing date, and exact Hectare & Are area per plot, along with Farmer ID (शेतकरी ओळखपत्र क्र.), Aadhaar, and mobile number.',
      },
      {
        heading: 'Page 3: चतुःसीमा स्वयंघोषणापत्र (Four-Boundary Land Affidavit)',
        body: 'Establishes the physical boundaries of the agricultural land parcel—East (पूर्व), West (पश्चिम), North (उत्तर), and South (दक्षिण)—using adjoining Gat numbers, neighbouring landowners, government cart tracks (पांदण रस्ता), or streams (नाला/ओढा) to support branch field inspection.',
      },
    ],
    documentsChecklist: [
      'Updated 7/12 Utara (सातबारा) and 8-A Khata Utara (८-अ) issued within the last 3 months',
      'Ferfar Nakkal (फेरफार) where ownership changed recently',
      'Aadhaar Card & PAN Card self-attested copies',
      'Bank Passbook front page copy & 2 passport photographs',
      'No-Dues Certificate (ना-हरकत प्रमाणपत्र) from neighbouring banks if requested by branch',
    ],
  },
  {
    id: 'guide-account-opening',
    index: '02',
    title: 'Bank of Maharashtra (13-Page) & SBI (7-Page) Account Opening & KYC Guide',
    subtitle: 'CIF Creation, Officially Valid Documents (OVD), FATCA & Nomination Form DA-1',
    templateId: 'bom',
    summary:
      'Opening a savings, salary, or Basic Savings Bank Deposit Account (BSBDA) at Bank of Maharashtra or State Bank of India requires complete Customer Information File (CIF) and KYC accuracy. Because bank CBS systems rely on character-by-character verification, legible block letters inside each printed grid box prevent delays in account activation and welcome-kit dispatch.',
    sections: [
      {
        heading: 'Name, Date of Birth & Relative Details Alignment',
        body: 'Ensure your first name, middle name, and surname match your Aadhaar and PAN records identically. If your PAN uses an expanded middle name, enter the same spelling across Page 1 and the KYC section so automated PAN-Aadhaar verification passes without manual intervention.',
      },
      {
        heading: 'Nomination Form DA-1 Best Practices',
        body: 'RBI strongly recommends registering a nominee at account opening. Enter the nominee full name, relationship, address, and—if the nominee is under 18 years of age—the nominee date of birth along with an adult appointee.',
      },
      {
        heading: 'Selecting Banking Channels Upfront',
        body: 'Ticking Debit Card, SMS Alerts, Cheque Book, and Internet/Mobile Banking during initial account opening avoids a separate follow-up branch visit later.',
      },
    ],
    documentsChecklist: [
      'PAN Card (or signed Form 60 if no PAN is allotted)',
      'One Officially Valid Document (Aadhaar, Passport, Voter ID, Driving Licence, or NREGA Job Card)',
      'Two recent passport-size photographs',
      'Current address proof (utility bill / rent agreement / employer letter) if correspondence address differs from OVD',
    ],
  },
  {
    id: 'guide-atm-ar35',
    index: '03',
    title: 'Mahabank VISA / RuPay Debit Card Application Guide (Form AR-35)',
    subtitle: 'New Issuance, Replacement, Card Embossing Rules & Account Linking',
    templateId: 'atm',
    summary:
      'Bank of Maharashtra account holders use Form AR-35 to apply for a Mahabank VISA Classic, Platinum, or RuPay Debit Card. Preparing this single-page form neatly guarantees the bank registers the exact embossed name and active mobile number required for instant Green PIN generation.',
    sections: [
      {
        heading: 'Card Name Embossing Limit (19 Characters)',
        body: 'Physical debit cards accommodate up to 19 characters including spaces. Use uppercase English letters only and avoid special symbols or punctuation marks.',
      },
      {
        heading: 'Primary & Secondary Account Linking',
        body: 'Write your 11-digit Bank of Maharashtra primary account number carefully and select the correct account type (Savings or Current). You may optionally link a second eligible account under the same CIF if permitted by branch policy.',
      },
    ],
    documentsChecklist: [
      'Bank of Maharashtra Passbook photocopy (front page with account number & CIF)',
      'Self-attested Aadhaar or PAN Card copy',
      'Existing damaged debit card (only if applying for physical replacement)',
    ],
  },
  {
    id: 'guide-bank-letters',
    index: '04',
    title: 'Consolidated Reference Guide to 51 Official Bank Application Letters',
    subtitle: 'Branch Request Formats for KYC, ATM Cards, Cheques, Certificates & Digital Disputes',
    templateId: 'statement',
    summary:
      'Rather than splitting every bank letter into repetitive thin pages, DocuFill Studio consolidates all 51 official SBI and Bank of Maharashtra branch correspondence formats into one structured reference and generator. Below is the complete breakdown of each category, standard enclosures, and practical branch tips.',
    sections: [
      {
        heading: 'Using Standardized Letters for Faster Branch Resolution',
        body: 'Branch officers process requests faster when the subject line clearly identifies the CBS service code (for example, Form DA-1 nominee addition, DBT Aadhaar seeding, or UPI failed transaction chargeback) and lists the Account Number, CIF, Mobile Number, and Date in a consistent header.',
      },
      {
        heading: 'Always Collect an Acknowledgement Copy',
        body: 'For time-sensitive requests—especially ATM card blocking, cheque stop-payment, or failed ATM/UPI/IMPS/NEFT transactions—print two copies or ask the counter clerk to stamp and date your photocopy with the branch inward number.',
      },
    ],
    documentsChecklist: [
      'Account Passbook front page photocopy',
      'Self-attested Photo ID (Aadhaar / PAN)',
      'Transaction proof (SMS alert, passbook entry, or RRN/UTR screenshot) for dispute letters',
    ],
  },
];

export const LETTER_CATEGORY_GUIDES: LetterCategoryGuide[] = [
  {
    category: 'Account & KYC Maintenance',
    count: 13,
    typicalTurnaround: '1–5 working days',
    commonLetters: [
      'Remove Joint Account Holder',
      'Add / Change / Cancel Nominee (DA-1 / DA-3)',
      'Change of Address & Mobile Number Update',
      'Aadhaar DBT Linking & PAN Seeding',
      'Email Update, Signature Change & Name Correction',
      'Account Closure, Minor-to-Major & Jan Dhan Conversion',
    ],
    requiredEnclosures: 'Passbook copy + relevant self-attested KYC proof (Aadhaar/PAN/Gazette/Age Proof).',
    preparationNote: 'For Minor-to-Major conversion, attach fresh specimen signature and 18+ age proof.',
  },
  {
    category: 'ATM & Debit Card Requests',
    count: 8,
    typicalTurnaround: 'Immediate (blocking) · 5–7 working days (issuance/dispute)',
    commonLetters: [
      'New ATM / Debit Card Request',
      'Immediate ATM Card Blocking & Lost Card Complaint',
      'Damaged Card Replacement & Card Renewal',
      'ATM PIN Generation / Reset Request',
      'ATM Transaction Dispute & Cash Not Dispensed Complaint',
    ],
    requiredEnclosures: 'Passbook copy, masked last 4 card digits, ATM ID/date/amount/RRN (for disputes).',
    preparationNote: 'Under RBI guidelines, failed ATM cash withdrawals must be auto-reversed within T+5 calendar days.',
  },
  {
    category: 'Cheque Book & Payment Controls',
    count: 8,
    typicalTurnaround: 'Same day (stop payment) · 5–10 working days (dispatch)',
    commonLetters: [
      'New & Duplicate Cheque Book Request',
      'Stop Cheque Payment & Cheque Cancellation',
      'Cheque Revalidation & Cheque Book Not Received',
      'Duplicate Cheque / Banker Draft & Clearing Delay Complaint',
    ],
    requiredEnclosures: 'Exact cheque number(s), issue date, payee name, and amount for stop-payment/clearing requests.',
    preparationNote: 'Submit stop-payment letters immediately before the cheque enters CTS clearing.',
  },
  {
    category: 'Statements, Passbooks & Certificates',
    count: 10,
    typicalTurnaround: 'Same day to 2 working days',
    commonLetters: [
      'New Passbook Issuance & Passbook Entry Correction',
      'Bank Account Statement & Mini Statement Request',
      'Balance Certificate & Annual Interest Certificate',
      'Account Confirmation Certificate & Bank Verification Letter',
      'Loan Closure No-Dues Certificate (NOC) & Loan Statement',
    ],
    requiredEnclosures: 'Passbook copy + exact date range (DD/MM/YYYY to DD/MM/YYYY) or financial year.',
    preparationNote: 'Specify whether you need a stamped physical copy for visa, scholarship, or tax filing.',
  },
  {
    category: 'Digital Banking, UPI, IMPS, NEFT & RTGS',
    count: 12,
    typicalTurnaround: 'T+1 to T+5 working days (RBI TAT)',
    commonLetters: [
      'Internet Banking & Mobile Banking Activation / Deactivation',
      'Mobile Banking User ID Unlock & NetBanking Password Reset',
      'UPI Activation / Registration Request',
      'Failed UPI & Wrong UPI Transfer Complaint',
      'Failed IMPS, NEFT & RTGS Transaction Complaints',
    ],
    requiredEnclosures: '12-digit UTR/RRN reference number, transaction timestamp, amount, and debit screenshot.',
    preparationNote: 'Never share your login password, MPIN, or OTP inside any written branch letter.',
  },
];

export const FAQ_ITEMS: FaqEntry[] = [
  {
    category: 'Privacy & Security',
    question: 'Is my Aadhaar, PAN, bank account number, or photo uploaded to any server?',
    answer:
      'No. DocuFill Studio runs 100% locally inside your web browser using client-side PDF rendering (pdf-lib and pdf.js). Your personal details, financial numbers, uploaded passport photos, and generated PDF files never leave your device and are never stored in any cloud database.',
  },
  {
    category: 'SBI Crop Loan (Marathi)',
    question: 'How does English-to-Marathi typing work on the SBI पीक कर्ज मागणी form?',
    answer:
      'When the Marathi transliteration toggle is enabled inside the SBI Peek Karj section, typing familiar phonetic English words (such as farmer names, village names, taluka, district, or crop names like kapus, soyabean, maka) automatically converts them into clean Marathi Devanagari script. You can also click "सर्व मराठीत करा" to convert all fields in one step, and the PDF renders them in uniform high-DPI typography sitting cleanly above every ruled line.',
  },
  {
    category: 'Printing & Acceptance',
    question: 'Will State Bank of India and Bank of Maharashtra branches accept PDFs printed from this tool?',
    answer:
      'Yes. The tool overlays your entered information onto standard official form layouts and formal banking letter templates. To ensure smooth acceptance at your branch, print the downloaded PDF on standard A4 paper at 100% Actual Size (do not choose "Shrink to Fit"), sign physically in pen in the signature spaces, and attach self-attested copies of your required KYC or land documents.',
  },
  {
    category: 'Printing & Acceptance',
    question: 'Why does the tool recommend signing physically after printing?',
    answer:
      'Indian banks verify customer signatures live against CBS specimen signatures during In-Person Verification (IPV) and require an original wet-ink signature (or witnessed thumb impression) on Account Opening forms, Form DA-1, Form AR-35, and branch service requests.',
  },
  {
    category: 'Using the Tool',
    question: 'Can I clear sample data and start a completely blank application for a new customer?',
    answer:
      'Yes. Click the "Fresh Application" button in the workspace toolbar at any time to clear all pre-filled sample values and initialize today’s date automatically. If you want to test how alignment looks first, click "Fill Sample" to repopulate example values.',
  },
  {
    category: 'Bank Letters',
    question: 'How do I switch a Bank Application Letter between State Bank of India and Bank of Maharashtra?',
    answer:
      'Select the "Bank Letters (51 Formats)" template, then choose either Bank of Maharashtra or State Bank of India at the top of the letter editor. The PDF preview immediately updates the bank header, branch details, and formatting while preserving your applicant details.',
  },
  {
    category: 'Printing & Alignment',
    question: 'What print settings prevent box or line misalignment on multi-page CIF forms?',
    answer:
      'In your browser or PDF reader print dialog, select Paper Size: A4, Scale: 100% (or Actual Size), and Margins: Default/None. Enabling "Fit to Printable Area" can shrink a 13-page CIF form by 4–6%, which shifts characters slightly relative to printed boxes.',
  },
  {
    category: 'Affiliation & Disclaimer',
    question: 'Is Thakur Xerox / DocuFill Studio an official website of SBI or Bank of Maharashtra?',
    answer:
      'No. DocuFill Studio is an independent digital document preparation utility operated by Thakur Xerox to help citizens, farmers, and students prepare clean, legible, print-ready banking forms and application letters. Always submit final signed paperwork directly at your authorized bank branch.',
  },
  {
    category: 'Technical',
    question: 'Can I use DocuFill Studio on a mobile phone as well as a desktop computer?',
    answer:
      'Yes. On mobile devices, a dedicated toggle lets you switch cleanly between "1. Form Fields" for comfortable typing and "2. Live PDF Preview" to inspect every page before tapping Download Filled PDF.',
  },
  {
    category: 'Support',
    question: 'Who can I contact if I need help preparing a form or printing at Thakur Xerox?',
    answer:
      'You can email our support desk at unnathakur923@gmail.com or contact proprietor Vinodsingh Arjunsingh Thakur at +91 9970996060 (Phone or WhatsApp) during business hours (Monday to Saturday, 9:30 AM – 8:00 PM IST), or submit an inquiry on our Contact Us page.',
  },
];
