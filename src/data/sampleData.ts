import { SbiFormData } from '../types/formTypes';

// Clean SVG-generated base64 PNG/data URLs for signature and photo
// Sample transparent stylish signature SVG data URL
export const SAMPLE_SIGNATURE_DATA_URL =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="320" height="120" viewBox="0 0 320 120">
  <path d="M 30,85 C 50,20 70,15 80,65 C 85,85 105,45 125,55 C 145,65 140,85 160,50 C 180,20 175,70 205,60 C 225,50 240,65 260,55 M 35,95 Q 160,90 280,75 M 150,88 L 190,82"
        fill="none" stroke="#000000" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`);

// Sample professional passport photo data URL
export const SAMPLE_PHOTO_DATA_URL =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="160" height="200" viewBox="0 0 160 200">
  <rect width="160" height="200" fill="#e2e8f0"/>
  <!-- Light studio gradient backdrop -->
  <circle cx="80" cy="72" r="38" fill="#cbd5e1"/>
  <!-- Head & Hair -->
  <ellipse cx="80" cy="72" rx="30" ry="36" fill="#f8d7b8"/>
  <path d="M 50,65 Q 80,30 110,65 Q 100,45 80,45 Q 60,45 50,65 Z" fill="#2d3748"/>
  <!-- Eyes & Eyebrows -->
  <circle cx="70" cy="70" r="3" fill="#2d3748"/>
  <circle cx="90" cy="70" r="3" fill="#2d3748"/>
  <path d="M 64,64 Q 70,61 76,64" stroke="#2d3748" stroke-width="1.5" fill="none"/>
  <path d="M 84,64 Q 90,61 96,64" stroke="#2d3748" stroke-width="1.5" fill="none"/>
  <!-- Nose & Smile -->
  <path d="M 80,72 L 78,80 L 82,80" stroke="#d49a6a" stroke-width="1.2" fill="none"/>
  <path d="M 74,88 Q 80,93 86,88" stroke="#a14949" stroke-width="1.5" fill="none"/>
  <!-- Formal Collar & Suit -->
  <path d="M 30,190 L 30,150 Q 80,120 130,150 L 130,190 Z" fill="#1e293b"/>
  <polygon points="80,125 65,160 95,160" fill="#ffffff"/>
  <polygon points="80,135 77,180 83,180" fill="#dc2626"/>
  <!-- Border -->
  <rect x="1" y="1" width="158" height="198" fill="none" stroke="#94a3b8" stroke-width="1.5"/>
</svg>
`);

export const EMPTY_FORM_DATA: SbiFormData = {
  applicationDate: '',
  branchName: '',
  branchCode: '',
  customerId: '',
  accountNumber: '',
  ckycNumber: '',
  applicationType: 'new',
  accountType: 'normal',
  pfNumber: '',

  salutation: 'Mr',
  firstName: '',
  middleName: '',
  lastName: '',
  dob: '',
  gender: 'male',
  maritalStatus: 'unmarried',
  dependentsCount: '0',
  relativeType: 'father',
  relativeFirstName: '',
  relativeMiddleName: '',
  relativeLastName: '',
  minorGuardianName: '',
  minorGuardianRelationship: '',
  nationality: 'indian',
  countryName: 'INDIA',
  citizenship: 'INDIAN',
  occupationType: 'pvt',
  employeeId: '',
  organizationName: '',
  designation: '',
  natureOfBusiness: '',
  annualIncome: '',
  netWorth: '',
  sourceOfFunds: 'salary',
  religion: 'hindu',
  category: 'general',
  personWithDisability: 'no',
  disabilityType: '',
  education: 'graduate',
  pep: 'none',
  taxResidenceIndiaOnly: 'yes',
  pan: '',

  mobileNumber: '',
  emailId: '',
  mobileBelongsTo: 'self',

  idProofType: 'aadhaar',
  idDocumentNo: '',
  idIssuedBy: 'UIDAI',
  idIssueDate: '',
  idExpiryDate: '',

  addressType: 'residential_business',
  addressLine1: '',
  addressLine2: '',
  cityVillage: '',
  district: '',
  state: '',
  pincode: '',
  country: 'INDIA',

  sameAsCurrentAddress: true,
  corrAddressType: 'residential_business',
  corrAddressLine1: '',
  corrAddressLine2: '',
  corrCityVillage: '',
  corrDistrict: '',
  corrState: '',
  corrPincode: '',
  corrCountry: 'INDIA',

  aadhaarConsent: 'yes',
  photoDataUrl: '',
  signatureDataUrl: '',
  place: '',
  signatureDate: '',

  accountCategory: 'savings',
  modeOfOperation: 'self',
  atmCardRequired: true,
  cardApplicant: '1st',
  cardType: 'rupay',
  cardFormat: 'physical',
  nameOnCard: '',
  chequeBookRequired: true,
  internetBankingRequired: true,
  transactionRightsRequired: true,
  smsAlertsRequired: true,
  mobileBankingRequired: true,
  passbookRequired: true,
  eStatementRequired: true,
  whatsappAlertsRequired: true,
  emailAlertsRequired: true,

  hasTermDeposit: false,
  termDepositType: 'term',
  termDepositAmount: '',
  termDepositAmountInWords: '',
  termDepositYears: '',
  termDepositMonths: '',
  termDepositDays: '',
  interestPayout: 'quarterly',

  nominationOpted: true,
  depositorName: '',
  nomineeName: '',
  nomineeAddress: '',
  nomineeMobile: '',
  nomineeRelationship: '',
  nomineeAge: '',
  nomineeProportion: '100',
  nomineeIsMinor: false,
  guardianName: '',
  guardianRelationship: '',
  guardianAddress: '',
  guardianMobile: '',

  cityOfBirth: '',
  countryOfBirth: 'INDIA',
  foreignTaxResidence: '',
  foreignTin: '',

  letterType: 'statement',
  statementPeriodFrom: '01/04/2026',
  statementPeriodTo: '26/10/2026',
  statementAccountType: 'savings',
  statementBank: 'bom',
  statementBankName: 'Bank of Maharashtra',
  statementBranchName: 'Purna Branch, Purna',
  statementBranchCode: '0124',
  statementDate: '26/10/2026',

  passbookReason: 'exhausted',
  oldPassbookNumber: '',
  closureReason: 'relocation',
  closureReasonOther: '',
  surrenderAtmCard: true,
  surrenderChequeBook: true,
  refundMode: 'transfer',
  transferBankName: '',
  transferAccountNumber: '',
  transferIfscCode: '',
  dateOfMajority: '',
  minorDob: '',
  majorPanNumber: '',
  majorAadhaarNumber: '',

  janDhanReason: 'limits_upgrade',
  janDhanReasonOther: '',
  janDhanInitialDeposit: '1000',
  janDhanKycAadhaar: true,
  janDhanKycPan: true,
  janDhanKycPhoto: true,
  janDhanAgreeMinBalance: true,

  // Letter 5: Name Correction
  oldApplicantName: 'RAJESH SHARMA',
  newApplicantName: 'RAJESH KUMAR SHARMA',
  nameCorrectionReason: 'spelling_error',
  nameCorrectionReasonOther: '',
  nameCorrectionDocType: 'aadhaar',
  nameCorrectionDocNo: '4820 1948 5721',
  nameCorrectionEncloseAadhaar: true,
  nameCorrectionEnclosePan: true,
  nameCorrectionEncloseGazette: false,
  nameCorrectionEncloseSpecimenSign: true,

  // Letter 6: Remove Joint Account Holder's Name
  jointHolderNameToRemove: '',
  jointHolderRemovalReason: 'consent_given',
  jointHolderRemovalReasonOther: '',
  jointHolderDeathCertNo: '',
  jointHolderOperateSingle: true,

  // Letter 7: Add Nominee (Form DA-1)
  newNomineeName: '',
  newNomineeRelationship: 'Spouse',
  newNomineeAge: '32',
  newNomineeDob: '',
  newNomineeAddress: '',
  newNomineeGuardianName: '',

  // Letter 8: Change / Cancellation of Nominee (Form DA-2 / DA-3)
  existingNomineeName: '',
  revisedNomineeName: '',
  revisedNomineeRelationship: 'Son',
  revisedNomineeAge: '24',
  revisedNomineeAddress: '',

  // Letter 9: Change of Address
  newAddressLine1: '',
  newAddressLine2: '',
  newAddressCity: '',
  newAddressDistrict: '',
  newAddressState: 'MAHARASHTRA',
  newAddressPincode: '',
  addressProofDocType: 'aadhaar',
  addressProofDocNo: '',

  // Letter 10: Change of Mobile Number
  oldMobileNumber: '',
  newMobileNumber: '',
  mobileChangeReason: 'number_changed',

  // Letter 11: Aadhaar Linking & NPCI / DBT Mapping
  aadhaarNumberForLinking: '',
  enableDbtMapping: true,
  consentBiometricAuth: true,

  // Letter 12: PAN Linking Application
  panNumberForLinking: '',
  panCardHolderName: '',
  panDob: '',

  // Letter 13: Email ID Update
  oldEmailId: '',
  newEmailId: '',
  enableEStatement: true,

  // Letter 14: Signature Change Request
  oldSignatureReason: 'signature_mismatch',
  oldSignatureReasonOther: '',
  enclosedKycForSignature: true,
  provideNewSpecimen: true,

  // Letter 16: New ATM card request
  newAtmCardType: 'rupay_platinum',
  newAtmDeliveryMode: 'registered_address',
  newAtmCardEmbossName: '',

  // Letter 17: ATM card block request
  blockAtmCardNumber: '',
  blockAtmReason: 'card_lost',
  blockAtmIncidentDate: '',
  requestReplacementAfterBlock: true,

  // Letter 18: ATM PIN generation/reset
  pinResetCardNumber: '',
  pinResetReason: 'forgot_pin',
  pinDeliveryPreference: 'green_pin_sms',

  // Letter 19: ATM card replacement
  replacementCardNumber: '',
  replacementCardReason: 'damaged_chip',
  surrenderOldCardWithLetter: true,

  // Letter 20: Cheque book request
  chequeBookLeavesCount: '50',
  chequeBookType: 'personalized',
  chequeDeliveryMode: 'registered_address',

  // Letter 21: Stop cheque payment
  stopChequeNumber: '',
  stopChequeDate: '',
  stopChequeAmount: '',
  stopChequePayeeName: '',
  stopChequeReason: 'lost_in_transit',
  stopChequeConfirmSingleOrRange: 'single',
  stopChequeRangeTo: '',

  // Letter 22: Duplicate cheque issue request
  dupChequeOriginalNumber: '',
  dupChequeIssueDate: '',
  dupChequeAmount: '',
  dupChequeBeneficiaryName: '',
  dupChequeReason: 'lost_by_beneficiary',
  dupChequeIndemnitySubmitted: true,

  // Letter 23: Cancel cheque book request
  cancelChequeBookLeavesCount: '',
  cancelChequeBookReason: 'not_required',
  surrenderUnusedChequesToBranch: true,

  // Letter 24: Cheque clearing complaint
  clearingChequeNo: '',
  clearingDepositDate: '',
  clearingChequeAmount: '',
  clearingDrawnBankBranch: '',
  clearingPayeeDrawerName: '',
  clearingComplaintReason: 'delayed_credit',

  // Letter 25: ATM cash withdrawal failed complaint
  failedAtmTxnDate: '',
  failedAtmTxnTime: '',
  failedAtmTxnAmount: '',
  failedAtmTerminalId: '',
  failedAtmBankLocation: '',
  failedAtmTxnRefNo: '',
  failedAtmCardLast4: '',
  failedAtmSlipAvailable: true,

  // Additional Bank Letters
  lostAtmCardNumber: '',
  lostAtmDate: '',
  lostAtmPlace: '',
  policeComplaintNumber: '',

  expiringCardNumber: '',
  cardExpiryMonthYear: '',

  disputeTxnDate: '',
  disputeTxnAmount: '',
  disputeAtmLocation: '',
  disputeTxnRefNo: '',

  dupChequeBookLeavesCount: '50',
  dupChequeBookReason: 'misplaced_during_relocation',

  revalChequeNumber: '',
  revalChequeDate: '',
  revalChequeAmount: '',
  revalChequePayee: '',
  revalReason: 'validity_period_expired',

  chqDispatchRefNo: '',
  chqOrderDate: '',

  passbookDiscrepancyDetails: '',
  passbookEntryDate: '',

  miniStatementTxnCount: '10',

  balanceAsOnDate: '',
  balanceCertPurpose: 'visa_application',

  interestFinancialYear: '2025-2026',
  interestCertType: 'deposit',

  accountCertPurpose: 'employment_verification',
  accountCertAddressedTo: 'To Whomsoever It May Concern',

  loanAccountNoForNoc: '',
  loanClosureDate: '',

  loanAccountNo: '',
  loanStatementPeriod: 'current_financial_year',

  verificationPurpose: 'official_documentation',
  verificationAgency: '',

  netBankingRights: 'full_transaction',
  netBankingDeactReason: 'temporary_security_measure',

  mobileBankingAppChoice: 'Official Bank Mobile App',
  mobileBankingDeactReason: 'phone_handset_change',

  preferredVpaId: '',

  upiTxnId: '',
  upiFailedAmount: '',
  upiFailedDate: '',
  upiBeneficiaryVpa: '',

  wrongUpiTxnId: '',
  wrongUpiAmount: '',
  wrongUpiReceiverVpa: '',
  correctReceiverVpa: '',

  impsRrnNo: '',
  impsAmount: '',
  impsBeneficiaryAcc: '',
  impsBeneficiaryIfsc: '',

  neftUtrNo: '',
  neftAmount: '',
  neftBeneficiaryName: '',
  neftBeneficiaryAcc: '',
  neftBeneficiaryIfsc: '',

  rtgsUtrNo: '',
  rtgsAmount: '',
  rtgsBeneficiaryAcc: '',
  rtgsBeneficiaryIfsc: '',

  mobileBankingUserId: '',
  mobileBankingUnlockReason: 'multiple_wrong_pin_attempts',

  netBankingLoginId: '',
  passwordResetType: 'both',
};

export const SAMPLE_SBI_FORM_DATA: SbiFormData = {
  // Page 1
  applicationDate: '22102026',
  branchName: 'NARIMAN POINT',
  branchCode: '00214',
  customerId: '874592014',
  accountNumber: '39482015849',
  ckycNumber: '50029481739281',
  applicationType: 'new',
  accountType: 'normal',
  pfNumber: '',

  // Section A
  salutation: 'Mr',
  firstName: 'RAJESH',
  middleName: 'KUMAR',
  lastName: 'SHARMA',
  dob: '14081988',
  gender: 'male',
  maritalStatus: 'married',
  dependentsCount: '2',
  relativeType: 'father',
  relativeFirstName: 'RAMESH',
  relativeMiddleName: 'CHANDRA',
  relativeLastName: 'SHARMA',
  minorGuardianName: '',
  minorGuardianRelationship: '',
  nationality: 'indian',
  countryName: 'INDIA',
  citizenship: 'INDIAN',
  occupationType: 'pvt',
  employeeId: 'EMP-98201',
  organizationName: 'TATA CONSULTANCY SERVICES LTD',
  designation: 'SENIOR SYSTEMS ARCHITECT',
  natureOfBusiness: 'OTHERS',
  annualIncome: '1850000',
  netWorth: '1000000',
  sourceOfFunds: 'salary',
  religion: 'hindu',
  category: 'general',
  personWithDisability: 'no',
  disabilityType: '',
  education: 'engineering',
  pep: 'none',
  taxResidenceIndiaOnly: 'yes',
  pan: 'ABCPS1234K',

  // Section B
  mobileNumber: '9820145678',
  emailId: 'rajesh.sharma88@email.com',
  mobileBelongsTo: 'self',

  // Page 2: Section C
  idProofType: 'aadhaar',
  idDocumentNo: '482019485721',
  idIssuedBy: 'UIDAI',
  idIssueDate: '12052019',
  idExpiryDate: '01012099',

  // Section D
  addressType: 'residential',
  addressLine1: 'FLAT 402, SEA GREEN APARTMENTS',
  addressLine2: 'NETAJI SUBHASH ROAD, MARINE DRIVE',
  cityVillage: 'MUMBAI',
  district: 'MUMBAI CITY',
  state: 'MAHARASHTRA',
  pincode: '400020',
  country: 'INDIA',

  // Section E
  sameAsCurrentAddress: true,
  corrAddressType: 'residential',
  corrAddressLine1: 'FLAT 402, SEA GREEN APARTMENTS',
  corrAddressLine2: 'NETAJI SUBHASH ROAD, MARINE DRIVE',
  corrCityVillage: 'MUMBAI',
  corrDistrict: 'MUMBAI CITY',
  corrState: 'MAHARASHTRA',
  corrPincode: '400020',
  corrCountry: 'INDIA',

  // Section G
  aadhaarConsent: 'yes',
  photoDataUrl: SAMPLE_PHOTO_DATA_URL,
  signatureDataUrl: '',
  place: 'MUMBAI',
  signatureDate: '22102026',

  // Page 3: Part II
  accountCategory: 'savings',
  modeOfOperation: 'self',
  atmCardRequired: true,
  cardApplicant: '1st',
  cardType: 'rupay',
  cardFormat: 'physical',
  nameOnCard: 'RAJESH K SHARMA',
  chequeBookRequired: true,
  internetBankingRequired: true,
  transactionRightsRequired: true,
  smsAlertsRequired: true,
  mobileBankingRequired: true,
  passbookRequired: true,
  eStatementRequired: true,
  whatsappAlertsRequired: true,
  emailAlertsRequired: true,

  hasTermDeposit: false,
  termDepositType: 'term',
  termDepositAmount: '50000',
  termDepositAmountInWords: 'FIFTY THOUSAND ONLY',
  termDepositYears: '1',
  termDepositMonths: '0',
  termDepositDays: '0',
  interestPayout: 'quarterly',

  // Page 4: Section F
  nominationOpted: true,
  depositorName: 'RAJESH KUMAR SHARMA',
  nomineeName: 'SNEHA RAJESH SHARMA',
  nomineeAddress: 'FLAT 402, SEA GREEN APTS, MARINE DRIVE, MUMBAI',
  nomineeMobile: '9820145679',
  nomineeRelationship: 'SPOUSE',
  nomineeAge: '34',
  nomineeProportion: '100%',
  nomineeIsMinor: false,
  guardianName: '',
  guardianRelationship: '',
  guardianAddress: '',
  guardianMobile: '',

  // Page 7
  cityOfBirth: 'MUMBAI',
  countryOfBirth: 'INDIA',
  foreignTaxResidence: '',
  foreignTin: '',

  letterType: 'statement',
  statementPeriodFrom: '01/04/2026',
  statementPeriodTo: '26/10/2026',
  statementAccountType: 'savings',
  statementBank: 'bom',
  statementBankName: 'Bank of Maharashtra',
  statementBranchName: 'Purna Branch, Purna',
  statementBranchCode: '0124',
  statementDate: '26/10/2026',

  passbookReason: 'exhausted',
  oldPassbookNumber: 'PB-904812',
  closureReason: 'relocation',
  closureReasonOther: '',
  surrenderAtmCard: true,
  surrenderChequeBook: true,
  refundMode: 'transfer',
  transferBankName: 'State Bank of India',
  transferAccountNumber: '20481928471',
  transferIfscCode: 'SBIN0000214',
  dateOfMajority: '14/08/2026',
  minorDob: '14/08/2008',
  majorPanNumber: 'ABCPS1234K',
  majorAadhaarNumber: '4820 1948 5721',

  // Letter 4: Jan Dhan to Normal Savings Account Conversion
  janDhanReason: 'limits_upgrade',
  janDhanReasonOther: '',
  janDhanInitialDeposit: '1000',
  janDhanKycAadhaar: true,
  janDhanKycPan: true,
  janDhanKycPhoto: true,
  janDhanAgreeMinBalance: true,

  // Letter 5: Name Correction
  oldApplicantName: 'RAJESH SHARMA',
  newApplicantName: 'RAJESH KUMAR SHARMA',
  nameCorrectionReason: 'spelling_error',
  nameCorrectionReasonOther: '',
  nameCorrectionDocType: 'aadhaar',
  nameCorrectionDocNo: '4820 1948 5721',
  nameCorrectionEncloseAadhaar: true,
  nameCorrectionEnclosePan: true,
  nameCorrectionEncloseGazette: false,
  nameCorrectionEncloseSpecimenSign: true,

  // Letter 6: Remove Joint Account Holder's Name
  jointHolderNameToRemove: 'PRIYA RAMESH SHARMA',
  jointHolderRemovalReason: 'consent_given',
  jointHolderRemovalReasonOther: '',
  jointHolderDeathCertNo: '',
  jointHolderOperateSingle: true,

  // Letter 7: Add Nominee (Form DA-1)
  newNomineeName: 'SNEHA RAJESH SHARMA',
  newNomineeRelationship: 'Spouse',
  newNomineeAge: '32',
  newNomineeDob: '19051994',
  newNomineeAddress: 'FLAT 402, SEA GREEN APARTMENTS, WORLI, MUMBAI 400020',
  newNomineeGuardianName: '',

  // Letter 8: Change / Cancellation of Nominee (Form DA-2 / DA-3)
  existingNomineeName: 'RAMESH CHANDRA SHARMA',
  revisedNomineeName: 'AARAV RAJESH SHARMA',
  revisedNomineeRelationship: 'Son',
  revisedNomineeAge: '14',
  revisedNomineeAddress: 'FLAT 402, SEA GREEN APARTMENTS, WORLI, MUMBAI 400020',

  // Letter 9: Change of Address
  newAddressLine1: 'FLAT 701, HIGH BREEZE TOWERS',
  newAddressLine2: 'NEAR CITY MALL, SENAPATI BAPAT MARG',
  newAddressCity: 'MUMBAI',
  newAddressDistrict: 'MUMBAI CITY',
  newAddressState: 'MAHARASHTRA',
  newAddressPincode: '400013',
  addressProofDocType: 'aadhaar',
  addressProofDocNo: '4820 1948 5721',

  // Letter 10: Change of Mobile Number
  oldMobileNumber: '9820145678',
  newMobileNumber: '9970996060',
  mobileChangeReason: 'number_changed',

  // Letter 11: Aadhaar Linking & NPCI / DBT Mapping
  aadhaarNumberForLinking: '4820 1948 5721',
  enableDbtMapping: true,
  consentBiometricAuth: true,

  // Letter 12: PAN Linking Application
  panNumberForLinking: 'ABCPS1234K',
  panCardHolderName: 'RAJESH KUMAR SHARMA',
  panDob: '14/08/1988',

  // Letter 13: Email ID Update
  oldEmailId: 'rajesh.sharma.old@gmail.com',
  newEmailId: 'rajesh.sharma@tcs.com',
  enableEStatement: true,

  // Letter 14: Signature Change Request
  oldSignatureReason: 'signature_mismatch',
  oldSignatureReasonOther: '',
  enclosedKycForSignature: true,
  provideNewSpecimen: true,

  // Letter 16: New ATM card request
  newAtmCardType: 'rupay_platinum',
  newAtmDeliveryMode: 'registered_address',
  newAtmCardEmbossName: 'RAJESH K SHARMA',

  // Letter 17: ATM card block request
  blockAtmCardNumber: '6071 8900 1234 5678',
  blockAtmReason: 'card_lost',
  blockAtmIncidentDate: '25/10/2026',
  requestReplacementAfterBlock: true,

  // Letter 18: ATM PIN generation/reset
  pinResetCardNumber: '6071 8900 1234 5678',
  pinResetReason: 'forgot_pin',
  pinDeliveryPreference: 'green_pin_sms',

  // Letter 19: ATM card replacement
  replacementCardNumber: '6071 8900 1234 5678',
  replacementCardReason: 'damaged_chip',
  surrenderOldCardWithLetter: true,

  // Letter 20: Cheque book request
  chequeBookLeavesCount: '50',
  chequeBookType: 'personalized',
  chequeDeliveryMode: 'registered_address',

  // Letter 21: Stop cheque payment
  stopChequeNumber: '000412',
  stopChequeDate: '20/10/2026',
  stopChequeAmount: '15,000.00',
  stopChequePayeeName: 'MAHESH TRADERS',
  stopChequeReason: 'lost_in_transit',
  stopChequeConfirmSingleOrRange: 'single',
  stopChequeRangeTo: '',

  // Letter 22: Duplicate cheque issue request
  dupChequeOriginalNumber: '000389',
  dupChequeIssueDate: '10/09/2026',
  dupChequeAmount: '25,000.00',
  dupChequeBeneficiaryName: 'SUNSHINE ENTERPRISES',
  dupChequeReason: 'lost_by_beneficiary',
  dupChequeIndemnitySubmitted: true,

  // Letter 23: Cancel cheque book request
  cancelChequeBookLeavesCount: '25',
  cancelChequeBookReason: 'not_required',
  surrenderUnusedChequesToBranch: true,

  // Letter 24: Cheque clearing complaint
  clearingChequeNo: '000552',
  clearingDepositDate: '21/10/2026',
  clearingChequeAmount: '42,500.00',
  clearingDrawnBankBranch: 'HDFC BANK, DADAR BRANCH',
  clearingPayeeDrawerName: 'KIRAN PATEL',
  clearingComplaintReason: 'delayed_credit',

  // Letter 25: ATM cash withdrawal failed complaint
  failedAtmTxnDate: '26/10/2026',
  failedAtmTxnTime: '11:45 AM',
  failedAtmTxnAmount: '10,000.00',
  failedAtmTerminalId: 'S1AN00412',
  failedAtmBankLocation: 'SBI ATM, NEAR WORLI NAKA, MUMBAI',
  failedAtmTxnRefNo: 'TXN849102941',
  failedAtmCardLast4: '5678',
  failedAtmSlipAvailable: true,

  // Additional Bank Letters
  lostAtmCardNumber: '6071 8900 1234 5678',
  lostAtmDate: '24/10/2026',
  lostAtmPlace: 'Worli Market, Mumbai',
  policeComplaintNumber: 'FIR/WR/2026/0942',

  expiringCardNumber: '6071 8900 1234 5678',
  cardExpiryMonthYear: '11/2026',

  disputeTxnDate: '22/10/2026',
  disputeTxnAmount: '5,000.00',
  disputeAtmLocation: 'Off-site ATM, Dadar Station',
  disputeTxnRefNo: 'TXN778192031',

  dupChequeBookLeavesCount: '50',
  dupChequeBookReason: 'Lost during residence shifting',

  revalChequeNumber: '000341',
  revalChequeDate: '15/06/2026',
  revalChequeAmount: '18,500.00',
  revalChequePayee: 'Apex Infotech Solutions',
  revalReason: 'Cheque expired validity (>3 months)',

  chqDispatchRefNo: 'EM948192014IN',
  chqOrderDate: '05/10/2026',

  passbookDiscrepancyDetails: 'Omission of interest credit entry for Q2 FY2026',
  passbookEntryDate: '30/09/2026',

  miniStatementTxnCount: '10',

  balanceAsOnDate: '26/10/2026',
  balanceCertPurpose: 'Visa Application & Financial Solvency Proof',

  interestFinancialYear: '2025-2026',
  interestCertType: 'deposit',

  accountCertPurpose: 'Employment Background & Salary Credit Verification',
  accountCertAddressedTo: 'To Whomsoever It May Concern',

  loanAccountNoForNoc: '98401928410',
  loanClosureDate: '15/10/2026',

  loanAccountNo: '98401928410',
  loanStatementPeriod: 'FY 2025-2026 (Full Year)',

  verificationPurpose: 'Government Tender & Vendor Registration',
  verificationAgency: 'M/s Maharashtra State Power Generation Co.',

  netBankingRights: 'full_transaction',
  netBankingDeactReason: 'Temporary security pause during international travel',

  mobileBankingAppChoice: 'Official Bank Mobile App (YONO / MahaMobile)',
  mobileBankingDeactReason: 'Handset upgrade and SIM migration',

  preferredVpaId: 'rajesh.sharma@upi',

  upiTxnId: 'UPI/2026/894019241',
  upiFailedAmount: '3,200.00',
  upiFailedDate: '25/10/2026',
  upiBeneficiaryVpa: 'merchant.pay@upi',

  wrongUpiTxnId: 'UPI/2026/784192031',
  wrongUpiAmount: '4,500.00',
  wrongUpiReceiverVpa: 'rohit.sharma@okhdfcbank',
  correctReceiverVpa: 'rajesh.sharma@okhdfcbank',

  impsRrnNo: '629810294819',
  impsAmount: '12,000.00',
  impsBeneficiaryAcc: '50100491829410',
  impsBeneficiaryIfsc: 'HDFC0000060',

  neftUtrNo: 'SBIN22681920491',
  neftAmount: '45,000.00',
  neftBeneficiaryName: 'RAMESH INFRASTRUCTURE PVT LTD',
  neftBeneficiaryAcc: '9180201948102',
  neftBeneficiaryIfsc: 'ICIC0000104',

  rtgsUtrNo: 'MAHB22684910294',
  rtgsAmount: '2,50,000.00',
  rtgsBeneficiaryAcc: '002148102941',
  rtgsBeneficiaryIfsc: 'SBIN0000214',

  mobileBankingUserId: 'RAJESH_S2026',
  mobileBankingUnlockReason: 'Account locked due to 3 consecutive wrong MPIN inputs',

  netBankingLoginId: 'RAJESHKUMAR2026',
  passwordResetType: 'both',

  // Bank of Maharashtra ATM / VISA Debit Card Application (Form AR-35)
  atmApplicationNo: 'AR35/2026/8941',
  atmDate: '26102026',
  atmEmbossedName: 'RAJESH K SHARMA',
  atmDob: '15081990',
  atmGender: 'male',
  primaryAccountTitle: 'RAJESH KUMAR SHARMA',
  primaryAccountType: 'savings',
  primarySchemeCode: 'SB101',
  primaryAccountNumber: '60123456789',
  primaryBalance: '75,000.00',
  primaryOperatingInstructions: 'self',
  primaryJointHolder1: 'SNEHA RAJESH SHARMA',
  primaryJointHolder2: '',
  primaryAddOnCard1: 'yes',
  primaryAddOnCard2: 'no',
  secondaryAccountTitle: '',
  secondaryAccountType: 'current',
  secondarySchemeCode: '',
  secondaryAccountNumber: '',
  secondaryBalance: '',
  secondaryOperatingInstructions: 'self',
  secondaryJointHolder1: '',
  secondaryJointHolder2: '',
  secondaryAddOnCard1: 'no',
  secondaryAddOnCard2: 'no',
  telNo: '022-22819000',

  // SBI Peek Karj Magni (Crop Loan & Declaration)
  peekFarmerName: 'दत्ता विश्वनाथ रेंगडे',
  peekFatherHusbandName: 'विश्वनाथ रेंगडे',
  peekMobileNo: '9970996060',
  peekVillage: 'वाळूज',
  peekTaluka: 'गंगापूर',
  peekDistrict: 'छत्रपती संभाजीनगर',
  peekGender: 'male',
  peekAadhaar: '7894 5612 3012',
  peekLoanAcc1: '60123456789',
  peekLoanType1: 'पीक कर्ज',
  peekLoanBank1: 'भारतीय स्टेट बँक',
  peekLoanBranch1: 'वाळूज एमआयडीसी',
  peekLoanAcc2: '',
  peekLoanType2: '',
  peekLoanBank2: '',
  peekLoanBranch2: '',
  peekLoanAcc3: '',
  peekLoanType3: '',
  peekLoanBank3: '',
  peekLoanBranch3: '',
  peekSavingsAcc: '38901234567',
  peekBankName: 'भारतीय स्टेट बँक',
  peekBranch: 'वाळूज एमआयडीसी शाखा',
  peekGatNo: '142/1',
  peekTotalArea: '२.४० हेक्टर (६ एकर)',
  peekCropName1: 'कापूस',
  peekCropArea1: '१.२० हेक्टर (३ एकर)',
  peekCropName2: '',
  peekCropArea2: '',
  peekCropName3: '',
  peekCropArea3: '',
  peekAttachAadhaar: true,
  peekAttach712: true,
  peekAttach8A: true,
  peekAttachFerfar: true,
  peekAttachPan: true,

  // Page 2: PMFBY
  peekResidenceVillage: 'वाळूज',
  peekMauje: 'वाळूज',
  peekFarmerId: 'MH-AGRI-996060',
  peekPlace: 'वाळूज',
  peekDate: '06/11/2026',
  peekCropRows: [
    { sr: '1', village: 'वाळूज', gatNo: '142/1', cropName: 'कापूस', sowingDate: '15/06/2026', areaHectare: '1', areaR: '20' },
    { sr: '2', village: 'वाळूज', gatNo: '142/1', cropName: 'सोयाबीन', sowingDate: '20/06/2026', areaHectare: '0', areaR: '80' },
    { sr: '3', village: 'वाळूज', gatNo: '142/1', cropName: 'मका', sowingDate: '25/06/2026', areaHectare: '0', areaR: '40' },
  ],

  // Page 3: Boundaries
  peekFullAddress: 'मु. पो. वाळूज, ता. गंगापूर, जि. छत्रपती संभाजीनगर - ४३११३६',
  peekBoundEast: 'शेत गट क्र. १४३ (शेतकरी रामराव पाटील यांचे शेत)',
  peekBoundWest: 'सरकारी पांदण रस्ता व शेत गट क्र. १४१',
  peekBoundNorth: 'नाला / ओढा व शेत गट क्र. १४०',
  peekBoundSouth: 'शेत गट क्र. १४४ (शेतकरी विठ्ठल गायकवाड यांचे शेत)',
};

/**
 * Returns a clean, blank application form state initialized with today's date
 * ready for new applicant data entry.
 */
export function getFreshApplicationData(): SbiFormData {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const year = String(now.getFullYear());
  const dateCompact = `${day}${month}${year}`;
  const dateSlash = `${day}/${month}/${year}`;

  return {
    ...EMPTY_FORM_DATA,
    applicationDate: dateCompact,
    signatureDate: dateCompact,
    statementDate: dateSlash,
    atmDate: dateCompact,
    countryOfBirth: 'INDIA',
    countryName: 'INDIA',
    citizenship: 'INDIAN',
    country: 'INDIA',
    corrCountry: 'INDIA',
    taxResidenceIndiaOnly: 'yes',
    aadhaarConsent: 'yes',
    sameAsCurrentAddress: true,
    photoDataUrl: '',
    signatureDataUrl: '',
  };
}
