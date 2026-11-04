export interface SbiFormData {
  // Page 1: Branch & Office Info
  applicationDate: string; // DDMMYYYY
  branchName: string;
  branchCode: string;
  customerId: string;
  accountNumber: string;
  ckycNumber: string;
  applicationType: 'new' | 'update';
  accountType: 'normal' | 'small' | 'minor' | 'staff';
  pfNumber: string;

  // Page 1: Section A - Personal Details
  salutation: 'Mr' | 'Ms' | 'Mrs' | 'Dr';
  firstName: string;
  middleName: string;
  lastName: string;
  dob: string; // DDMMYYYY
  gender: 'male' | 'female' | 'third';
  maritalStatus: 'married' | 'unmarried' | 'others';
  dependentsCount: string;
  relativeType: 'father' | 'mother' | 'spouse';
  relativeFirstName: string;
  relativeMiddleName: string;
  relativeLastName: string;
  minorGuardianName: string;
  minorGuardianRelationship: string;
  nationality: 'indian' | 'others';
  countryName: string;
  citizenship: string;
  occupationType:
    | 'pvt'
    | 'state_govt'
    | 'central_govt'
    | 'psu'
    | 'defence'
    | 'business'
    | 'other_self'
    | 'student'
    | 'housewife'
    | 'retired'
    | 'professional';
  employeeId: string;
  organizationName: string;
  designation: string;
  natureOfBusiness: string;
  annualIncome: string;
  netWorth: string;
  sourceOfFunds: 'salary' | 'business' | 'agriculture' | 'investment' | 'pension' | 'others';
  religion: 'hindu' | 'muslim' | 'christian' | 'sikh' | 'others';
  category: 'general' | 'obc' | 'sc' | 'st';
  personWithDisability: 'yes' | 'no';
  disabilityType: string;
  education:
    | 'graduate'
    | 'post_graduate'
    | 'engineering'
    | 'law'
    | 'medical'
    | 'ca_mba'
    | 'computer'
    | '10th'
    | 'other';
  pep: 'none' | 'pep' | 'related';
  taxResidenceIndiaOnly: 'yes' | 'no';
  pan: string;

  // Page 1: Section B - Contact Details
  mobileNumber: string;
  emailId: string;
  mobileBelongsTo: 'self' | 'father' | 'mother' | 'spouse' | 'son' | 'daughter';

  // Page 2: Section C - Proof of Identity / Address
  idProofType: 'aadhaar' | 'passport' | 'voter' | 'driving' | 'nrega';
  idDocumentNo: string;
  idIssuedBy: string;
  idIssueDate: string; // DDMMYYYY
  idExpiryDate: string; // DDMMYYYY

  // Page 2: Section D - Current Address
  addressType: 'residential_business' | 'residential' | 'business' | 'registered' | 'unspecified';
  addressLine1: string;
  addressLine2: string;
  cityVillage: string;
  district: string;
  state: string;
  pincode: string;
  country: string;

  // Page 2: Section E - Correspondence Address
  sameAsCurrentAddress: boolean;
  corrAddressType: 'residential_business' | 'residential' | 'business' | 'registered' | 'unspecified';
  corrAddressLine1: string;
  corrAddressLine2: string;
  corrCityVillage: string;
  corrDistrict: string;
  corrState: string;
  corrPincode: string;
  corrCountry: string;

  // Page 2: Section G - Declaration, Photo & Signature
  aadhaarConsent: 'yes' | 'no';
  photoDataUrl: string; // base64 jpeg/png
  signatureDataUrl: string; // base64 png
  place: string;
  signatureDate: string; // DDMMYYYY

  // Page 3: Account & Services (Part II)
  accountCategory: 'savings' | 'bsbda' | 'small' | 'current' | 'fixed_deposit' | 'savings_plus';
  modeOfOperation: 'self' | 'either_or_survivor' | 'former_or_survivor' | 'any_one' | 'jointly';
  atmCardRequired: boolean;
  cardApplicant: '1st' | '2nd' | 'both';
  cardType: 'rupay' | 'visa' | 'master';
  cardFormat: 'physical' | 'virtual';
  nameOnCard: string;
  chequeBookRequired: boolean;
  internetBankingRequired: boolean;
  transactionRightsRequired: boolean;
  smsAlertsRequired: boolean;
  mobileBankingRequired: boolean;
  passbookRequired: boolean;
  eStatementRequired: boolean;
  whatsappAlertsRequired: boolean;
  emailAlertsRequired: boolean;

  // Page 3: Optional Term Deposit / MOD details
  hasTermDeposit: boolean;
  termDepositType: 'term' | 'reinvestment' | 'annuity' | 'tax_saving';
  termDepositAmount: string;
  termDepositAmountInWords: string;
  termDepositYears: string;
  termDepositMonths: string;
  termDepositDays: string;
  interestPayout: 'monthly' | 'quarterly' | 'yearly';

  // Page 4: Section F - Nomination Details
  nominationOpted: boolean;
  depositorName: string;
  nomineeName: string;
  nomineeAddress: string;
  nomineeMobile: string;
  nomineeRelationship: string;
  nomineeAge: string;
  nomineeProportion: string;
  nomineeIsMinor: boolean;
  guardianName: string;
  guardianRelationship: string;
  guardianAddress: string;
  guardianMobile: string;

  // Page 7: FATCA details
  cityOfBirth: string;
  countryOfBirth: string;
  foreignTaxResidence: string;
  foreignTin: string;

  // Bank Letter Applications (Statement, Passbook, Closure, Minor to Major)
  letterType?: LetterType;
  statementPeriodFrom?: string;
  statementPeriodTo?: string;
  statementAccountType?: 'savings' | 'current';
  statementBranchName?: string;
  statementBranchCode?: string;
  statementDate?: string;
  statementBank?: 'bom' | 'sbi';
  statementBankName?: string;

  // Letter 1: Passbook Issuance
  passbookReason?: 'exhausted' | 'lost' | 'damaged';
  oldPassbookNumber?: string;

  // Letter 2: Account Closure
  closureReason?: 'relocation' | 'multiple_accounts' | 'better_services' | 'others';
  closureReasonOther?: string;
  surrenderAtmCard?: boolean;
  surrenderChequeBook?: boolean;
  refundMode?: 'transfer' | 'cash' | 'dd';
  transferBankName?: string;
  transferAccountNumber?: string;
  transferIfscCode?: string;

  // Letter 3: Minor to Major Conversion
  dateOfMajority?: string; // DD/MM/YYYY
  minorDob?: string; // DD/MM/YYYY
  majorPanNumber?: string;
  majorAadhaarNumber?: string;

  // Letter 4: Jan Dhan to Normal Savings Account Conversion
  janDhanReason?: 'limits_upgrade' | 'cheque_book' | 'salary_credits' | 'business_needs' | 'others';
  janDhanReasonOther?: string;
  janDhanInitialDeposit?: string;
  janDhanKycAadhaar?: boolean;
  janDhanKycPan?: boolean;
  janDhanKycPhoto?: boolean;
  janDhanAgreeMinBalance?: boolean;

  // Letter 5: Correction / Change of Name in Bank Records
  oldApplicantName?: string;
  newApplicantName?: string;
  nameCorrectionReason?: 'spelling_error' | 'marriage' | 'gazette' | 'aadhaar_pan_mismatch' | 'others';
  nameCorrectionReasonOther?: string;
  nameCorrectionDocType?: 'aadhaar' | 'pan' | 'gazette' | 'marriage_cert' | 'passport' | 'affidavit';
  nameCorrectionDocNo?: string;
  nameCorrectionEncloseAadhaar?: boolean;
  nameCorrectionEnclosePan?: boolean;
  nameCorrectionEncloseGazette?: boolean;
  nameCorrectionEncloseSpecimenSign?: boolean;

  // Letter 6: Remove Joint Account Holder's Name
  jointHolderNameToRemove?: string;
  jointHolderRemovalReason?: 'consent_given' | 'deceased' | 'mutual_agreement' | 'others';
  jointHolderRemovalReasonOther?: string;
  jointHolderDeathCertNo?: string;
  jointHolderOperateSingle?: boolean;

  // Letter 7: Add Nominee (Form DA-1)
  newNomineeName?: string;
  newNomineeRelationship?: string;
  newNomineeAge?: string;
  newNomineeDob?: string;
  newNomineeAddress?: string;
  newNomineeGuardianName?: string;

  // Letter 8: Change / Cancellation of Nominee (Form DA-2 / DA-3)
  existingNomineeName?: string;
  revisedNomineeName?: string;
  revisedNomineeRelationship?: string;
  revisedNomineeAge?: string;
  revisedNomineeAddress?: string;

  // Letter 9: Change of Address
  newAddressLine1?: string;
  newAddressLine2?: string;
  newAddressCity?: string;
  newAddressDistrict?: string;
  newAddressState?: string;
  newAddressPincode?: string;
  addressProofDocType?: 'aadhaar' | 'voter_id' | 'passport' | 'utility_bill' | 'rent_agreement' | 'driving_licence';
  addressProofDocNo?: string;

  // Letter 10: Change of Mobile Number
  oldMobileNumber?: string;
  newMobileNumber?: string;
  mobileChangeReason?: 'lost_sim' | 'number_changed' | 'never_registered' | 'others';

  // Letter 11: Aadhaar Linking & NPCI / DBT Mapping
  aadhaarNumberForLinking?: string;
  enableDbtMapping?: boolean;
  consentBiometricAuth?: boolean;

  // Letter 12: PAN Linking Application
  panNumberForLinking?: string;
  panCardHolderName?: string;
  panDob?: string;

  // Letter 13: Email ID Update
  oldEmailId?: string;
  newEmailId?: string;
  enableEStatement?: boolean;

  // Letter 14: Signature Change Request
  oldSignatureReason?: 'signature_mismatch' | 'change_due_to_age_health' | 'standardizing' | 'others';
  oldSignatureReasonOther?: string;
  enclosedKycForSignature?: boolean;
  provideNewSpecimen?: boolean;

  // Letter 16: New ATM card request
  newAtmCardType?: 'rupay_classic' | 'rupay_platinum' | 'visa_classic' | 'visa_gold' | 'mastercard_global';
  newAtmDeliveryMode?: 'branch' | 'registered_address';
  newAtmCardEmbossName?: string;

  // Letter 17: ATM card block request
  blockAtmCardNumber?: string;
  blockAtmReason?: 'card_lost' | 'card_stolen' | 'atm_machine_captured' | 'fraudulent_sms' | 'damaged';
  blockAtmIncidentDate?: string;
  requestReplacementAfterBlock?: boolean;

  // Letter 18: ATM PIN generation/reset
  pinResetCardNumber?: string;
  pinResetReason?: 'forgot_pin' | 'green_pin_expired' | 'first_time_generation' | 'security_precaution';
  pinDeliveryPreference?: 'green_pin_sms' | 'branch_physical_mailer';

  // Letter 19: ATM card replacement
  replacementCardNumber?: string;
  replacementCardReason?: 'damaged_chip' | 'magnetic_strip_worn' | 'broken_card' | 'name_correction' | 'expired';
  surrenderOldCardWithLetter?: boolean;

  // Letter 20: Cheque book request
  chequeBookLeavesCount?: '25' | '50' | '100';
  chequeBookType?: 'personalized' | 'bearer_order';
  chequeDeliveryMode?: 'branch' | 'registered_address';

  // Letter 21: Stop cheque payment
  stopChequeNumber?: string;
  stopChequeDate?: string;
  stopChequeAmount?: string;
  stopChequePayeeName?: string;
  stopChequeReason?: 'lost_in_transit' | 'stolen' | 'cheque_mutilated' | 'wrong_amount' | 'disputed_service' | 'cheque_book_lost';
  stopChequeConfirmSingleOrRange?: 'single' | 'range';
  stopChequeRangeTo?: string;

  // Letter 22: Duplicate cheque issue request
  dupChequeOriginalNumber?: string;
  dupChequeIssueDate?: string;
  dupChequeAmount?: string;
  dupChequeBeneficiaryName?: string;
  dupChequeReason?: 'lost_by_beneficiary' | 'mutilated_in_transit' | 'validity_expired' | 'damaged';
  dupChequeIndemnitySubmitted?: boolean;

  // Letter 23: Cancel cheque book request
  cancelChequeBookLeavesCount?: string;
  cancelChequeBookReason?: 'not_required' | 'closing_account' | 'ordered_by_mistake' | 'digital_only_account';
  surrenderUnusedChequesToBranch?: boolean;

  // Letter 24: Cheque clearing complaint
  clearingChequeNo?: string;
  clearingDepositDate?: string;
  clearingChequeAmount?: string;
  clearingDrawnBankBranch?: string;
  clearingPayeeDrawerName?: string;
  clearingComplaintReason?: 'delayed_credit' | 'wrongly_returned' | 'return_charges_debited' | 'lost_in_clearing';

  // Letter 25: ATM cash withdrawal failed complaint
  failedAtmTxnDate?: string;
  failedAtmTxnTime?: string;
  failedAtmTxnAmount?: string;
  failedAtmTerminalId?: string;
  failedAtmBankLocation?: string;
  failedAtmTxnRefNo?: string;
  failedAtmCardLast4?: string;
  failedAtmSlipAvailable?: boolean;

  // Additional Bank Letters (ATM, Cheques, Certificates, Digital Banking, UPI, Complaints)
  lostAtmCardNumber?: string;
  lostAtmDate?: string;
  lostAtmPlace?: string;
  lostCardLocation?: string;
  lostCardFirNo?: string;
  policeComplaintNumber?: string;

  expiringCardNumber?: string;
  cardExpiryDate?: string;
  cardExpiryMonthYear?: string;

  disputeTxnDate?: string;
  disputeTxnTime?: string;
  disputeTxnAmount?: string;
  disputedAmount?: string;
  disputeAtmLocation?: string;
  disputeAtmTerminalId?: string;
  disputeTxnRefNo?: string;
  disputeType?: 'incorrect_debit' | 'partial_cash' | 'fraudulent_charge';

  dupChequeBookLeavesCount?: '25' | '50' | '100';
  dupChequeBookReason?: string;
  previousChequeBookSeries?: string;

  revalChequeNumber?: string;
  revalChequeDate?: string;
  revalChequeAmount?: string;
  revalChequePayee?: string;
  revalReason?: string;

  chqDispatchRefNo?: string;
  chqRequisitionDate?: string;
  chqOrderDate?: string;

  passbookDiscrepancyType?: string;
  passbookDiscrepancyDate?: string;
  passbookDiscrepancyAmount?: string;
  passbookDiscrepancyDetails?: string;
  passbookEntryDate?: string;

  miniStatementTxnCount?: string;
  miniStatementDeliveryMode?: 'counter' | 'email_sms';

  balanceAsOnDate?: string;
  balanceCertPurpose?: string;
  balanceCertAddressedTo?: string;

  interestFinancialYear?: string;
  interestCertType?: 'deposit' | 'loan' | 'both';
  interestCertScope?: 'all_deposits' | 'savings_only' | 'fd_only';

  accountCertPurpose?: string;
  accountCertAddressedTo?: string;

  loanAccountNoForNoc?: string;
  loanTypeForNoc?: string;
  loanClosureDate?: string;

  loanAccountNo?: string;
  loanStatementFrom?: string;
  loanStatementTo?: string;
  loanStatementPurpose?: string;
  loanStatementPeriod?: string;

  verificationPurpose?: string;
  verificationAgency?: string;

  netBankingRights?: 'view_only' | 'full_transaction';
  netBankingLimit?: string;
  netBankingDeactReason?: string;

  mobileBankingAppChoice?: string;
  mobileDeviceModel?: string;
  mobileBankingDeactReason?: string;

  preferredVpaId?: string;

  upiTxnId?: string;
  upiFailedAmount?: string;
  upiFailedDate?: string;
  upiBeneficiaryVpa?: string;

  wrongUpiTxnId?: string;
  wrongUpiAmount?: string;
  wrongUpiReceiverVpa?: string;
  correctReceiverVpa?: string;

  impsRrnNo?: string;
  impsDate?: string;
  impsAmount?: string;
  impsBeneficiaryAcc?: string;
  impsBeneficiaryIfsc?: string;

  neftUtrNo?: string;
  neftDate?: string;
  neftAmount?: string;
  neftBeneficiaryName?: string;
  neftBeneficiaryAcc?: string;
  neftBeneficiaryIfsc?: string;
  neftBeneficiaryBank?: string;

  rtgsUtrNo?: string;
  rtgsDate?: string;
  rtgsAmount?: string;
  rtgsBeneficiaryName?: string;
  rtgsBeneficiaryAcc?: string;
  rtgsBeneficiaryIfsc?: string;

  mobileBankingUserId?: string;
  mobileBankingUnlockReason?: string;

  netBankingLoginId?: string;
  passwordResetType?: 'login' | 'transaction' | 'both';
  netBankingResetMode?: 'printed_mailer' | 'sms_otp';

  // Bank of Maharashtra ATM / VISA Debit Card Application (Form AR-35)
  atmApplicationNo?: string;
  atmDate?: string;
  atmEmbossedName?: string;
  atmDob?: string;
  atmGender?: 'male' | 'female';
  primaryAccountTitle?: string;
  primaryAccountType?: 'savings' | 'current' | 'staff_cc';
  primarySchemeCode?: string;
  primaryAccountNumber?: string;
  primaryBalance?: string;
  primaryOperatingInstructions?: 'self' | 'either_or_survivor' | 'any_one' | 'survivor';
  primaryJointHolder1?: string;
  primaryJointHolder2?: string;
  primaryAddOnCard1?: 'yes' | 'no';
  primaryAddOnCard2?: 'yes' | 'no';
  secondaryAccountTitle?: string;
  secondaryAccountType?: 'savings' | 'current' | 'staff_cc';
  secondarySchemeCode?: string;
  secondaryAccountNumber?: string;
  secondaryBalance?: string;
  secondaryOperatingInstructions?: 'self' | 'either_or_survivor' | 'any_one' | 'survivor';
  secondaryJointHolder1?: string;
  secondaryJointHolder2?: string;
  secondaryAddOnCard1?: 'yes' | 'no';
  secondaryAddOnCard2?: 'yes' | 'no';
  telNo?: string;
}

export type LetterType =
  | 'statement'
  | 'passbook'
  | 'closure'
  | 'minor_to_major'
  | 'jandhan_conversion'
  | 'name_correction'
  | 'remove_joint_holder'
  | 'add_nominee'
  | 'change_nominee'
  | 'change_address'
  | 'change_mobile'
  | 'aadhaar_linking'
  | 'pan_linking'
  | 'email_update'
  | 'signature_change'
  | 'new_atm_card'
  | 'block_atm_card'
  | 'atm_pin_reset'
  | 'atm_replacement'
  | 'cheque_book_request'
  | 'stop_cheque_payment'
  | 'duplicate_cheque_request'
  | 'cancel_cheque_request'
  | 'cheque_clearing_complaint'
  | 'atm_failed_withdrawal'
  | 'lost_atm_card_complaint'
  | 'atm_card_renewal'
  | 'atm_txn_dispute'
  | 'duplicate_cheque_book'
  | 'cheque_revalidation'
  | 'cheque_book_not_received'
  | 'passbook_correction'
  | 'mini_statement_request'
  | 'balance_certificate'
  | 'interest_certificate'
  | 'account_confirmation_cert'
  | 'no_dues_certificate'
  | 'loan_statement_request'
  | 'bank_account_verification'
  | 'netbanking_activation'
  | 'netbanking_deactivation'
  | 'mobilebanking_activation'
  | 'mobilebanking_deactivation'
  | 'upi_activation'
  | 'upi_failed_complaint'
  | 'wrong_upi_complaint'
  | 'failed_imps_complaint'
  | 'failed_neft_complaint'
  | 'failed_rtgs_complaint'
  | 'mobilebanking_unlock'
  | 'netbanking_password_reset';
export type FormTemplateType = 'bom' | 'sbi' | 'statement' | 'atm' | 'custom';
export type InkColor = 'blue' | 'black';

export interface FieldCoordinate {
  id: string;
  page: number;
  label: string;
  type: 'box_text' | 'line_text' | 'checkbox' | 'image';
  x: number;
  y: number;
  stepX?: number;
  width?: number;
  height?: number;
  fontSize?: number;
}
