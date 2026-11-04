import { PDFDocument, StandardFonts, rgb, RGB } from 'pdf-lib';
import { SbiFormData, InkColor, LetterType } from '../types/formTypes';
import { getInkRgb } from './sbiOverlay';
import { fetchAssetBytes } from './assetHelper';

const MAHABANK_LOGO_PATH = '/assets/aistudio/MAHABANK.NS_BIG_2f06ae18.png';
const SBI_LOGO_PATH = '/assets/aistudio/sbi_logo_clean.png';

// In-memory cache for logo image bytes to prevent repeated network fetches
const logoBytesCache: Record<string, Uint8Array> = {};

async function getLogoBytes(path: string): Promise<Uint8Array | null> {
  if (logoBytesCache[path]) return logoBytesCache[path];
  try {
    const bytes = await fetchAssetBytes(path);
    logoBytesCache[path] = bytes;
    return bytes;
  } catch (err) {
    console.warn(`Could not load logo from ${path}:`, err);
    return null;
  }
}

/**
 * Main dispatcher for bank application letters:
 * - 'statement': Application for Issuance of Bank Account Statement
 * - 'passbook': Application for Issuance of New Passbook
 * - 'closure': Application for Closure of Bank Account
 * - 'minor_to_major': Application for Conversion of Minor Account to Major Account
 */
export async function applyStatementOverlay(
  pdfDoc: PDFDocument,
  formData: SbiFormData,
  inkColor: InkColor = 'blue'
) {
  const letterType = formData.letterType || 'statement';

  if (letterType === 'statement') {
    await applyStatementRequestOverlay(pdfDoc, formData, inkColor);
  } else {
    await renderGeneratedLetterPage(pdfDoc, formData, inkColor, letterType);
  }
}

/**
 * High-precision overlay on the 1-page Bank of Maharashtra Statement Request PDF
 */
async function applyStatementRequestOverlay(
  pdfDoc: PDFDocument,
  formData: SbiFormData,
  inkColor: InkColor
) {
  const pages = pdfDoc.getPages();
  if (pages.length === 0) return;
  const page = pages[0];

  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontNormal = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const color = getInkRgb(inkColor);

  const drawLineField = (
    text: string | undefined,
    x: number,
    y: number,
    size: number = 10.5,
    maxW: number = 340
  ) => {
    if (!text || !text.trim()) return;
    const clean = text.trim();
    let currentSize = size;
    let w = fontBold.widthOfTextAtSize(clean, currentSize);
    while (w > maxW && currentSize > 7.0) {
      currentSize -= 0.5;
      w = fontBold.widthOfTextAtSize(clean, currentSize);
    }
    page.drawText(clean, {
      x,
      y,
      size: currentSize,
      font: fontBold,
      color,
    });
  };

  const fullName = [formData.firstName, formData.middleName, formData.lastName]
    .filter(Boolean)
    .join(' ')
    .trim() || formData.depositorName || '';

  const addressParts = [
    formData.addressLine1,
    formData.addressLine2,
    formData.cityVillage,
    formData.district && formData.district !== formData.cityVillage ? formData.district : null,
    formData.state,
    formData.pincode,
  ].filter(Boolean);
  const fullAddress = addressParts.join(', ');

  // 1. Draw Bank Logo at Top Middle
  const selectedBank: 'bom' | 'sbi' =
    formData.statementBank ||
    (formData.statementBankName?.toLowerCase().includes('state bank') ? 'sbi' : 'bom');

  const logoPath = selectedBank === 'sbi' ? SBI_LOGO_PATH : MAHABANK_LOGO_PATH;

  try {
    const logoBytes = await getLogoBytes(logoPath);
    if (logoBytes) {
      const embeddedLogo = await pdfDoc.embedPng(logoBytes);
      const pageWidth = page.getWidth();

      let targetHeight = 36;
      let targetWidth = targetHeight * (embeddedLogo.width / embeddedLogo.height);
      if (targetWidth > 175) {
        targetWidth = 175;
        targetHeight = targetWidth / (embeddedLogo.width / embeddedLogo.height);
      }

      const logoX = (pageWidth - targetWidth) / 2;
      const logoY = 736;

      page.drawRectangle({
        x: logoX - 12,
        y: logoY - 4,
        width: targetWidth + 24,
        height: targetHeight + 8,
        color: rgb(1, 1, 1),
      });

      page.drawImage(embeddedLogo, {
        x: logoX,
        y: logoY,
        width: targetWidth,
        height: targetHeight,
      });
    }
  } catch (err) {
    console.warn('Error overlaying bank logo at top middle:', err);
  }

  // 2. Bank Name Header Customization
  const bankName =
    formData.statementBankName ||
    (selectedBank === 'sbi' ? 'State Bank of India' : 'Bank of Maharashtra');

  if (bankName && bankName !== 'Bank of Maharashtra') {
    page.drawRectangle({
      x: 71.0,
      y: 678.5,
      width: 260.0,
      height: 14.5,
      color: rgb(1, 1, 1),
    });
    page.drawText(bankName, {
      x: 72.0,
      y: 681.9,
      size: 11.0,
      font: fontBold,
      color,
    });
  }

  // 3. Branch / Date Header Customization
  if (formData.statementBranchName && formData.statementBranchName !== 'Purna Branch, Purna') {
    page.drawRectangle({
      x: 71.0,
      y: 665.0,
      width: 250.0,
      height: 15.0,
      color: rgb(1, 1, 1),
    });
    page.drawText(formData.statementBranchName, {
      x: 72.0,
      y: 667.8,
      size: 11.0,
      font: fontBold,
      color,
    });
  }

  if (formData.statementBranchCode && formData.statementBranchCode !== '0124') {
    page.drawRectangle({
      x: 71.0,
      y: 651.0,
      width: 180.0,
      height: 15.0,
      color: rgb(1, 1, 1),
    });
    page.drawText(`Branch Code: ${formData.statementBranchCode}`, {
      x: 72.0,
      y: 653.7,
      size: 11.0,
      font: fontBold,
      color,
    });
  }

  if (formData.statementDate && formData.statementDate !== '26/10/2026') {
    page.drawRectangle({
      x: 71.0,
      y: 623.0,
      width: 180.0,
      height: 15.0,
      color: rgb(1, 1, 1),
    });
    page.drawText(`Date: ${formData.statementDate}`, {
      x: 72.0,
      y: 625.9,
      size: 11.0,
      font: fontBold,
      color,
    });
  }

  // 4. Statement Period
  const periodFrom = formData.statementPeriodFrom || '01/04/2026';
  drawLineField(periodFrom, 344.0, 529.5, 10.5, 65);

  const periodTo = formData.statementPeriodTo || formData.statementDate || formData.applicationDate || '26/10/2026';
  drawLineField(periodTo, 419.0, 529.5, 10.5, 65);

  // 5. Account Details
  drawLineField(fullName, 245.0, 474.5, 10.5, 290);
  drawLineField(formData.accountNumber, 205.0, 460.5, 10.5, 290);

  const accountType =
    formData.statementAccountType ||
    (formData.accountCategory === 'current' ? 'current' : 'savings');

  if (accountType === 'current') {
    page.drawLine({
      start: { x: 234.0, y: 443.0 },
      end: { x: 276.0, y: 443.0 },
      thickness: 1.5,
      color,
    });
    page.drawLine({
      start: { x: 224.0, y: 448.0 },
      end: { x: 227.0, y: 444.0 },
      thickness: 1.5,
      color,
    });
    page.drawLine({
      start: { x: 227.0, y: 444.0 },
      end: { x: 232.0, y: 452.0 },
      thickness: 1.5,
      color,
    });
  } else {
    page.drawLine({
      start: { x: 186.0, y: 443.0 },
      end: { x: 226.0, y: 443.0 },
      thickness: 1.5,
      color,
    });
    page.drawLine({
      start: { x: 174.0, y: 448.0 },
      end: { x: 177.0, y: 444.0 },
      thickness: 1.5,
      color,
    });
    page.drawLine({
      start: { x: 177.0, y: 444.0 },
      end: { x: 182.0, y: 452.0 },
      thickness: 1.5,
      color,
    });
  }

  drawLineField(formData.mobileNumber, 256.0, 433.0, 10.5, 280);
  drawLineField(formData.emailId, 222.0, 419.0, 10.5, 300);

  // 6. Closing Applicant Details
  drawLineField(fullName, 173.0, 280.5, 10.5, 330);
  drawLineField(fullAddress, 124.0, 266.5, 9.5, 380);
  drawLineField(formData.mobileNumber, 163.0, 252.5, 10.5, 300);
  drawLineField(formData.emailId, 128.0, 239.0, 10.5, 320);
}

/**
 * Generates an official 1-page bank letter matching the exact style of the account statement
 * for:
 * 1. Issuance of New Passbook
 * 2. Closure of Bank Account
 * 3. Conversion of Minor to Major Account
 */
async function renderGeneratedLetterPage(
  pdfDoc: PDFDocument,
  formData: SbiFormData,
  inkColor: InkColor,
  letterType: LetterType
) {
  // Replace page 0 with fresh page
  if (pdfDoc.getPageCount() > 0) {
    pdfDoc.removePage(0);
  }
  const page = pdfDoc.addPage([612, 792]);

  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontNormal = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const color = getInkRgb(inkColor);
  const textColor = rgb(0.08, 0.1, 0.14);

  const selectedBank: 'bom' | 'sbi' =
    formData.statementBank ||
    (formData.statementBankName?.toLowerCase().includes('state bank') ? 'sbi' : 'bom');

  const bankName =
    formData.statementBankName ||
    (selectedBank === 'sbi' ? 'State Bank of India' : 'Bank of Maharashtra');

  const branchName =
    formData.statementBranchName ||
    (selectedBank === 'sbi' ? 'Nariman Point Branch, Mumbai' : 'Purna Branch, Purna');

  const branchCode =
    formData.statementBranchCode || (selectedBank === 'sbi' ? '00214' : '0124');

  const appDate = formData.statementDate || '26/10/2026';

  const fullName = [formData.firstName, formData.middleName, formData.lastName]
    .filter(Boolean)
    .join(' ')
    .trim() || formData.depositorName || 'RAJESH KUMAR SHARMA';

  const addressParts = [
    formData.addressLine1,
    formData.addressLine2,
    formData.cityVillage,
    formData.district && formData.district !== formData.cityVillage ? formData.district : null,
    formData.state,
    formData.pincode,
  ].filter(Boolean);
  const fullAddress = addressParts.join(', ') || 'FLAT 402, SEA GREEN APARTMENTS, MUMBAI, MAHARASHTRA 400020';

  const accountTypeDisplay =
    formData.statementAccountType === 'current' ? 'Current Account' : 'Savings Account';

  // 1. Draw Bank Logo at Top Middle
  const logoPath = selectedBank === 'sbi' ? SBI_LOGO_PATH : MAHABANK_LOGO_PATH;
  try {
    const logoBytes = await getLogoBytes(logoPath);
    if (logoBytes) {
      const embeddedLogo = await pdfDoc.embedPng(logoBytes);
      let targetHeight = 36;
      let targetWidth = targetHeight * (embeddedLogo.width / embeddedLogo.height);
      if (targetWidth > 175) {
        targetWidth = 175;
        targetHeight = targetWidth / (embeddedLogo.width / embeddedLogo.height);
      }
      const logoX = (612 - targetWidth) / 2;
      const logoY = 736;
      page.drawImage(embeddedLogo, {
        x: logoX,
        y: logoY,
        width: targetWidth,
        height: targetHeight,
      });
    }
  } catch (err) {
    console.warn('Error drawing letter logo:', err);
  }

  // 2. Recipient Header
  let y = 705;
  const headerLines = [
    'To,',
    'The Branch Manager',
    bankName,
    branchName,
    `Branch Code: ${branchCode}`,
  ];
  for (const line of headerLines) {
    page.drawText(line, {
      x: 72,
      y,
      size: 11,
      font: fontBold,
      color: textColor,
    });
    y -= 14.5;
  }
  y -= 4;

  // Date
  page.drawText(`Date: ${appDate}`, {
    x: 72,
    y,
    size: 11,
    font: fontBold,
    color: textColor,
  });
  y -= 23;

  // Subject Line
  let subjectText = '';
  if (letterType === 'passbook') {
    subjectText = 'Subject: Application for Issuance of New Passbook';
  } else if (letterType === 'closure') {
    subjectText = 'Subject: Application for Closure of Bank Account';
  } else if (letterType === 'minor_to_major') {
    subjectText = 'Subject: Application for Conversion of Minor Account to Major Account';
  } else if (letterType === 'name_correction') {
    subjectText = 'Subject: Application for Correction / Rectification of Name in Bank Account';
  } else if (letterType === 'jandhan_conversion') {
    subjectText = 'Subject: Application for Conversion of Jan Dhan (PMJDY) Account to Normal Savings Account';
  } else if (letterType === 'remove_joint_holder') {
    subjectText = "Subject: Application for Removal of Joint Account Holder's Name";
  } else if (letterType === 'add_nominee') {
    subjectText = 'Subject: Application for Adding Nominee (Form DA-1) to Bank Account';
  } else if (letterType === 'change_nominee') {
    subjectText = 'Subject: Application for Cancellation / Change of Nominee (Form DA-2 / DA-3)';
  } else if (letterType === 'change_address') {
    subjectText = 'Subject: Application for Change of Address in Bank Account Records';
  } else if (letterType === 'change_mobile') {
    subjectText = 'Subject: Application for Change / Update of Registered Mobile Number';
  } else if (letterType === 'aadhaar_linking') {
    subjectText = 'Subject: Application for Linking Aadhaar Card (UIDAI) and Enabling NPCI / DBT Mapping';
  } else if (letterType === 'pan_linking') {
    subjectText = 'Subject: Application for Linking Permanent Account Number (PAN Card) with Bank Account';
  } else if (letterType === 'email_update') {
    subjectText = 'Subject: Application for Update / Registration of Email ID for E-Statements and Alerts';
  } else if (letterType === 'signature_change') {
    subjectText = 'Subject: Application for Updating / Changing Specimen Signature in Bank Records';
  } else if (letterType === 'new_atm_card') {
    subjectText = 'Subject: Application for Issuance of New ATM / Debit Card';
  } else if (letterType === 'block_atm_card') {
    subjectText = 'Subject: Urgent Request for Blocking / Hotlisting of ATM Debit Card';
  } else if (letterType === 'atm_pin_reset') {
    subjectText = 'Subject: Application for ATM PIN Generation / Reset (Green PIN)';
  } else if (letterType === 'atm_replacement') {
    subjectText = 'Subject: Application for Replacement of Damaged / Expired ATM Debit Card';
  } else if (letterType === 'cheque_book_request') {
    subjectText = 'Subject: Application for Issuance of Fresh Cheque Book';
  } else if (letterType === 'stop_cheque_payment') {
    subjectText = 'Subject: Urgent Request to Stop Payment of Cheque';
  } else if (letterType === 'duplicate_cheque_request') {
    subjectText = "Subject: Application for Issuance of Duplicate Cheque / Banker's Draft";
  } else if (letterType === 'cancel_cheque_request') {
    subjectText = 'Subject: Application for Cancellation of Cheque Book Requisition';
  } else if (letterType === 'cheque_clearing_complaint') {
    subjectText = 'Subject: Complaint Regarding Delayed Clearing / Non-Credit of Cheque';
  } else if (letterType === 'atm_failed_withdrawal') {
    subjectText = 'Subject: Complaint Regarding Failed ATM Cash Withdrawal (Amount Debited Not Dispensed)';
  } else if (letterType === 'lost_atm_card_complaint') {
    subjectText = 'Subject: Complaint Regarding Lost / Stolen ATM Debit Card & Request for Immediate Blocking';
  } else if (letterType === 'atm_card_renewal') {
    subjectText = 'Subject: Application for Renewal of Expired / Expiring ATM Debit Card';
  } else if (letterType === 'atm_txn_dispute') {
    subjectText = 'Subject: Application for Disputing Erroneous / Unauthorized ATM Cash Transaction';
  } else if (letterType === 'duplicate_cheque_book') {
    subjectText = 'Subject: Application for Issuance of Duplicate Cheque Book';
  } else if (letterType === 'cheque_revalidation') {
    subjectText = 'Subject: Application for Revalidation of Stale / Expired Cheque';
  } else if (letterType === 'cheque_book_not_received') {
    subjectText = 'Subject: Complaint Regarding Non-Receipt of Dispatched Cheque Book';
  } else if (letterType === 'passbook_correction') {
    subjectText = 'Subject: Application for Correction / Rectification in Passbook Entries';
  } else if (letterType === 'mini_statement_request') {
    subjectText = 'Subject: Request for Issuance of Mini Statement / Recent Account Transactions';
  } else if (letterType === 'balance_certificate') {
    subjectText = 'Subject: Application for Issuance of Bank Balance Certificate';
  } else if (letterType === 'interest_certificate') {
    subjectText = 'Subject: Application for Issuance of Interest Certificate for Income Tax / TDS';
  } else if (letterType === 'account_confirmation_cert') {
    subjectText = 'Subject: Application for Issuance of Account Confirmation Certificate';
  } else if (letterType === 'no_dues_certificate') {
    subjectText = 'Subject: Application for Issuance of No Dues Certificate (NOC) on Closed Loan Account';
  } else if (letterType === 'loan_statement_request') {
    subjectText = 'Subject: Application for Issuance of Loan Account Statement';
  } else if (letterType === 'bank_account_verification') {
    subjectText = 'Subject: Application for Bank Account Verification Letter / Proof of Account';
  } else if (letterType === 'netbanking_activation') {
    subjectText = 'Subject: Application for Activation / Registration of Internet Banking Facility';
  } else if (letterType === 'netbanking_deactivation') {
    subjectText = 'Subject: Application for Deactivation / Discontinuation of Internet Banking Facility';
  } else if (letterType === 'mobilebanking_activation') {
    subjectText = 'Subject: Application for Activation / Registration of Mobile Banking Services';
  } else if (letterType === 'mobilebanking_deactivation') {
    subjectText = 'Subject: Application for Deactivation of Mobile Banking Services';
  } else if (letterType === 'upi_activation') {
    subjectText = 'Subject: Application for Registration / Activation of UPI & VPA Setup';
  } else if (letterType === 'upi_failed_complaint') {
    subjectText = 'Subject: Complaint Regarding Failed UPI Transaction (Amount Debited Not Credited)';
  } else if (letterType === 'wrong_upi_complaint') {
    subjectText = 'Subject: Urgent Complaint Regarding Money Transferred to Wrong UPI ID / VPA';
  } else if (letterType === 'failed_imps_complaint') {
    subjectText = 'Subject: Complaint Regarding Failed IMPS Fund Transfer (Remittance Not Credited)';
  } else if (letterType === 'failed_neft_complaint') {
    subjectText = 'Subject: Complaint Regarding Failed / Delayed NEFT Transaction';
  } else if (letterType === 'failed_rtgs_complaint') {
    subjectText = 'Subject: Complaint Regarding Delayed / Failed RTGS Remittance';
  } else if (letterType === 'mobilebanking_unlock') {
    subjectText = 'Subject: Application for Unlocking Mobile Banking User ID / MPIN Reset';
  } else if (letterType === 'netbanking_password_reset') {
    subjectText = 'Subject: Application for Reset of Internet Banking Login / Transaction Password';
  } else {
    subjectText = 'Subject: Application to the Branch Manager';
  }

  let subSize = 10.5;
  while (fontBold.widthOfTextAtSize(subjectText, subSize) > 468 && subSize > 8.0) {
    subSize -= 0.5;
  }

  page.drawText(subjectText, {
    x: 72,
    y,
    size: subSize,
    font: fontBold,
    color: textColor,
  });
  y -= 20;

  // Salutation
  page.drawText('Respected Sir/Madam,', {
    x: 72,
    y,
    size: 10,
    font: fontNormal,
    color: textColor,
  });
  y -= 16;

  // Body Paragraphs based on letter type
  if (letterType === 'passbook') {
    const reasonLabel =
      formData.passbookReason === 'lost'
        ? 'lost / misplaced'
        : formData.passbookReason === 'damaged'
        ? 'damaged / torn'
        : 'completely filled up / exhausted';

    page.drawText(
      'With due respect, I wish to state that I am an account holder at your branch. I kindly request you',
      { x: 72, y, size: 10, font: fontNormal, color: textColor }
    );
    y -= 14;
    page.drawText(
      `to issue a new passbook for my bank account as my previous passbook is ${reasonLabel}.`,
      { x: 72, y, size: 10, font: fontNormal, color: textColor }
    );
    y -= 20;
  } else if (letterType === 'closure') {
    const reasonLabel =
      formData.closureReason === 'multiple_accounts'
        ? 'holding multiple accounts'
        : formData.closureReason === 'better_services'
        ? 'personal convenience'
        : formData.closureReason === 'others' && formData.closureReasonOther
        ? formData.closureReasonOther
        : 'relocation to another location';

    page.drawText(
      'With due respect, I wish to state that I am an account holder at your branch. Due to',
      { x: 72, y, size: 10, font: fontNormal, color: textColor }
    );
    y -= 14;
    page.drawText(
      `${reasonLabel}, I request you to kindly close my below-mentioned bank account and refund the balance.`,
      { x: 72, y, size: 10, font: fontNormal, color: textColor }
    );
    y -= 20;
  } else if (letterType === 'minor_to_major') {
    const majorityDate = formData.dateOfMajority || '14/08/2026';
    const guardianName = formData.minorGuardianName || 'RAMESH SHARMA';
    const relationship = formData.minorGuardianRelationship || 'Father';

    page.drawText(
      `With due respect, I state that I hold a minor savings account at your branch under the guardianship of`,
      { x: 72, y, size: 10, font: fontNormal, color: textColor }
    );
    y -= 14;
    page.drawText(
      `${guardianName} (${relationship}). Having attained the age of majority (18 years) on ${majorityDate}, I kindly request you`,
      { x: 72, y, size: 10, font: fontNormal, color: textColor }
    );
    y -= 14;
    page.drawText(
      'to convert my account status from Minor to Major and allow me to operate the account independently.',
      { x: 72, y, size: 10, font: fontNormal, color: textColor }
    );
    y -= 20;
  } else if (letterType === 'name_correction') {
    const oldName = formData.oldApplicantName || 'RAJESH SHARMA';
    const newName = formData.newApplicantName || fullName || 'RAJESH KUMAR SHARMA';
    const reasonDesc =
      formData.nameCorrectionReason === 'marriage'
        ? 'due to post-marriage surname / marital name change'
        : formData.nameCorrectionReason === 'gazette'
        ? 'pursuant to official name change published in Government Gazette'
        : formData.nameCorrectionReason === 'aadhaar_pan_mismatch'
        ? 'to align my account name with official Aadhaar and PAN card records'
        : formData.nameCorrectionReason === 'others' && formData.nameCorrectionReasonOther
        ? formData.nameCorrectionReasonOther
        : 'due to an inadvertent spelling discrepancy / clerical mistake in bank records';

    page.drawText(
      `With due respect, I wish to state that I maintain an active ${accountTypeDisplay} bearing account number`,
      { x: 72, y, size: 10, font: fontNormal, color: textColor }
    );
    y -= 14;
    page.drawText(
      `${formData.accountNumber || '39482015849'} with your branch. In your records, my name is currently recorded as "${oldName}",`,
      { x: 72, y, size: 10, font: fontNormal, color: textColor }
    );
    y -= 14;
    page.drawText(
      `which requires correction ${reasonDesc}. My correct and legal name is "${newName}".`,
      { x: 72, y, size: 10, font: fontNormal, color: textColor }
    );
    y -= 20;
  } else if (letterType === 'jandhan_conversion') {
    const reasonText =
      formData.janDhanReason === 'cheque_book'
        ? 'to avail cheque book, internet banking, and full digital transactional facilities'
        : formData.janDhanReason === 'salary_credits'
        ? 'due to monthly salary and direct institutional credits exceeding PMJDY caps'
        : formData.janDhanReason === 'business_needs'
        ? 'for business transactions requiring higher turnover limits and overdraft facilities'
        : formData.janDhanReason === 'others' && formData.janDhanReasonOther
        ? formData.janDhanReasonOther
        : 'due to transaction limits, deposit caps, and requirement of full regular savings services';

    page.drawText(
      'With due respect, I wish to state that I currently hold a Pradhan Mantri Jan Dhan Yojana (PMJDY / BSBDA)',
      { x: 72, y, size: 10, font: fontNormal, color: textColor }
    );
    y -= 14;
    page.drawText(
      `account at your branch. I request you to kindly convert this account into a Regular / Normal Savings Account`,
      { x: 72, y, size: 10, font: fontNormal, color: textColor }
    );
    y -= 14;
    page.drawText(
      `${reasonText}. I agree to maintain the required minimum balance.`,
      { x: 72, y, size: 10, font: fontNormal, color: textColor }
    );
    y -= 20;
  } else if (letterType === 'remove_joint_holder') {
    const jointName = formData.jointHolderNameToRemove || 'PRIYA RAMESH SHARMA';
    const reasonText =
      formData.jointHolderRemovalReason === 'deceased'
        ? 'due to the unfortunate demise of the joint holder (Death Certificate enclosed)'
        : formData.jointHolderRemovalReason === 'mutual_agreement'
        ? 'pursuant to mutual settlement and agreement between account holders'
        : formData.jointHolderRemovalReason === 'others' && formData.jointHolderRemovalReasonOther
        ? formData.jointHolderRemovalReasonOther
        : 'with the mutual signed consent of both joint account holders';

    page.drawText(
      `With due respect, I state that I maintain a joint ${accountTypeDisplay} bearing account number`,
      { x: 72, y, size: 10, font: fontNormal, color: textColor }
    );
    y -= 14;
    page.drawText(
      `${formData.accountNumber || '39482015849'} at your branch. I kindly request you to delete and remove the name of`,
      { x: 72, y, size: 10, font: fontNormal, color: textColor }
    );
    y -= 14;
    page.drawText(
      `joint holder, "${jointName}", from bank records ${reasonText}, and permit single operation mode.`,
      { x: 72, y, size: 10, font: fontNormal, color: textColor }
    );
    y -= 20;
  } else if (letterType === 'add_nominee') {
    const nomineeName = formData.newNomineeName || 'SNEHA RAJESH SHARMA';
    const relationship = formData.newNomineeRelationship || 'Spouse';

    page.drawText(
      `With due respect, I wish to state that I maintain ${accountTypeDisplay} bearing account number`,
      { x: 72, y, size: 10, font: fontNormal, color: textColor }
    );
    y -= 14;
    page.drawText(
      `${formData.accountNumber || '39482015849'} with your branch. In accordance with Section 45ZA of the Banking Regulation`,
      { x: 72, y, size: 10, font: fontNormal, color: textColor }
    );
    y -= 14;
    page.drawText(
      `Act, 1949, I hereby nominate ${nomineeName} (${relationship}) under Form DA-1 to receive account funds in case of demise.`,
      { x: 72, y, size: 10, font: fontNormal, color: textColor }
    );
    y -= 20;
  } else if (letterType === 'change_nominee') {
    const oldNominee = formData.existingNomineeName || 'RAMESH CHANDRA SHARMA';
    const newNominee = formData.revisedNomineeName || 'AARAV RAJESH SHARMA';
    const relationship = formData.revisedNomineeRelationship || 'Son';

    page.drawText(
      `With due respect, I wish to state that I maintain ${accountTypeDisplay} bearing account number`,
      { x: 72, y, size: 10, font: fontNormal, color: textColor }
    );
    y -= 14;
    page.drawText(
      `${formData.accountNumber || '39482015849'} with your branch. I request you to cancel the previous nomination registered in favor of`,
      { x: 72, y, size: 10, font: fontNormal, color: textColor }
    );
    y -= 14;
    page.drawText(
      `"${oldNominee}" (Form DA-2) and record a fresh nomination in favor of "${newNominee}" (${relationship}) under Form DA-3.`,
      { x: 72, y, size: 10, font: fontNormal, color: textColor }
    );
    y -= 20;
  } else if (letterType === 'change_address') {
    page.drawText(
      `With due respect, I wish to state that I maintain ${accountTypeDisplay} bearing account number`,
      { x: 72, y, size: 10, font: fontNormal, color: textColor }
    );
    y -= 14;
    page.drawText(
      `${formData.accountNumber || '39482015849'} at your branch. I have recently relocated to a new residence and request you to`,
      { x: 72, y, size: 10, font: fontNormal, color: textColor }
    );
    y -= 14;
    page.drawText(
      'kindly update my residential and correspondence address in your core banking system records as detailed below.',
      { x: 72, y, size: 10, font: fontNormal, color: textColor }
    );
    y -= 20;
  } else if (letterType === 'change_mobile') {
    const oldMob = formData.oldMobileNumber || '9820145678';
    const newMob = formData.newMobileNumber || '9970996060';

    page.drawText(
      `With due respect, I wish to state that I maintain ${accountTypeDisplay} bearing account number`,
      { x: 72, y, size: 10, font: fontNormal, color: textColor }
    );
    y -= 14;
    page.drawText(
      `${formData.accountNumber || '39482015849'} with your branch. I request you to update my registered mobile number from ${oldMob}`,
      { x: 72, y, size: 10, font: fontNormal, color: textColor }
    );
    y -= 14;
    page.drawText(
      `to ${newMob} for receiving OTPs, transaction SMS alerts, UPI authentication, and mobile banking services.`,
      { x: 72, y, size: 10, font: fontNormal, color: textColor }
    );
    y -= 20;
  } else if (letterType === 'aadhaar_linking') {
    const aadhaarNo = formData.aadhaarNumberForLinking || formData.idDocumentNo || '4820 1948 5721';

    page.drawText(
      `With due respect, I state that I maintain ${accountTypeDisplay} bearing account number ${formData.accountNumber || '39482015849'}`,
      { x: 72, y, size: 10, font: fontNormal, color: textColor }
    );
    y -= 14;
    page.drawText(
      `with your branch. In accordance with RBI and Government directives, I request you to link my 12-digit Aadhaar Card`,
      { x: 72, y, size: 10, font: fontNormal, color: textColor }
    );
    y -= 14;
    page.drawText(
      `(UIDAI: ${aadhaarNo}) with my bank account and map it with NPCI for receiving Direct Benefit Transfer (DBT) subsidies.`,
      { x: 72, y, size: 10, font: fontNormal, color: textColor }
    );
    y -= 20;
  } else if (letterType === 'pan_linking') {
    const panNo = formData.panNumberForLinking || formData.pan || 'ABCPS1234K';

    page.drawText(
      `With due respect, I state that I maintain ${accountTypeDisplay} bearing account number ${formData.accountNumber || '39482015849'}`,
      { x: 72, y, size: 10, font: fontNormal, color: textColor }
    );
    y -= 14;
    page.drawText(
      `with your branch. I request you to register and link my Permanent Account Number (PAN Card: ${panNo}) in your`,
      { x: 72, y, size: 10, font: fontNormal, color: textColor }
    );
    y -= 14;
    page.drawText(
      'core banking system records for income tax compliance, TDS certification, and seamless banking transactions.',
      { x: 72, y, size: 10, font: fontNormal, color: textColor }
    );
    y -= 20;
  } else if (letterType === 'email_update') {
    const newMail = formData.newEmailId || formData.emailId || 'rajesh.sharma@tcs.com';

    page.drawText(
      `With due respect, I state that I maintain ${accountTypeDisplay} bearing account number ${formData.accountNumber || '39482015849'}`,
      { x: 72, y, size: 10, font: fontNormal, color: textColor }
    );
    y -= 14;
    page.drawText(
      `with your branch. I request you to register / update my official email address as "${newMail}" in your records`,
      { x: 72, y, size: 10, font: fontNormal, color: textColor }
    );
    y -= 14;
    page.drawText(
      'and activate password-protected monthly electronic account statements (E-Statements) and digital transaction alerts.',
      { x: 72, y, size: 10, font: fontNormal, color: textColor }
    );
    y -= 20;
  } else if (letterType === 'signature_change') {
    const reasonText =
      formData.oldSignatureReason === 'change_due_to_age_health'
        ? 'due to changes caused by age / medical condition'
        : formData.oldSignatureReason === 'standardizing'
        ? 'to standardize my signature across all official identity documents'
        : formData.oldSignatureReason === 'others' && formData.oldSignatureReasonOther
        ? formData.oldSignatureReasonOther
        : 'due to inadvertent signature variation and mismatch with old records';

    page.drawText(
      `With due respect, I state that I maintain ${accountTypeDisplay} bearing account number ${formData.accountNumber || '39482015849'}`,
      { x: 72, y, size: 10, font: fontNormal, color: textColor }
    );
    y -= 14;
    page.drawText(
      `with your branch. I request you to replace and update my specimen signature on record ${reasonText}.`,
      { x: 72, y, size: 10, font: fontNormal, color: textColor }
    );
    y -= 14;
    page.drawText(
      'I am present in person and have provided fresh specimen signatures along with self-attested KYC identity proofs.',
      { x: 72, y, size: 10, font: fontNormal, color: textColor }
    );
    y -= 20;
  } else if (letterType === 'new_atm_card') {
    const cardVariant =
      formData.newAtmCardType === 'rupay_classic'
        ? 'RuPay Classic'
        : formData.newAtmCardType === 'rupay_platinum'
        ? 'RuPay Platinum'
        : formData.newAtmCardType === 'visa_gold'
        ? 'VISA Gold International'
        : formData.newAtmCardType === 'mastercard_global'
        ? 'MasterCard Global'
        : 'VISA Classic';
    const delivery =
      formData.newAtmDeliveryMode === 'branch' ? 'branch counter collection' : 'my registered postal address';

    page.drawText(
      `With due respect, I state that I maintain an active ${accountTypeDisplay} bearing account number`,
      { x: 72, y, size: 10, font: fontNormal, color: textColor }
    );
    y -= 14;
    page.drawText(
      `${formData.accountNumber || '39482015849'} with your branch. I request you to kindly issue a fresh ${cardVariant} Debit Card`,
      { x: 72, y, size: 10, font: fontNormal, color: textColor }
    );
    y -= 14;
    page.drawText(
      `for seamless ATM cash withdrawals, POS shopping, and e-commerce transactions, with dispatch to ${delivery}.`,
      { x: 72, y, size: 10, font: fontNormal, color: textColor }
    );
    y -= 20;
  } else if (letterType === 'block_atm_card') {
    const cardNo = formData.blockAtmCardNumber || '6071 8900 1234 5678';
    const blockReason =
      formData.blockAtmReason === 'card_stolen'
        ? 'card theft'
        : formData.blockAtmReason === 'atm_machine_captured'
        ? 'card captured in ATM terminal'
        : formData.blockAtmReason === 'fraudulent_sms'
        ? 'suspicious transaction activity'
        : 'loss / misplacement of debit card';
    const incidentDate = formData.blockAtmIncidentDate || 'recent date';

    page.drawText(
      `URGENT: I maintain ${accountTypeDisplay} No. ${formData.accountNumber || '39482015849'} at your branch. I request you to`,
      { x: 72, y, size: 10, font: fontNormal, color: textColor }
    );
    y -= 14;
    page.drawText(
      `immediately block / hotlist my ATM Debit Card No. ${cardNo} in the central banking system due to`,
      { x: 72, y, size: 10, font: fontNormal, color: textColor }
    );
    y -= 14;
    page.drawText(
      `${blockReason} on ${incidentDate}, in order to safeguard my funds and prevent any unauthorized misuse.`,
      { x: 72, y, size: 10, font: fontNormal, color: textColor }
    );
    y -= 20;
  } else if (letterType === 'atm_pin_reset') {
    const cardNo = formData.pinResetCardNumber || formData.blockAtmCardNumber || '6071 8900 1234 5678';
    const pinReason =
      formData.pinResetReason === 'green_pin_expired'
        ? 'expiry of Green PIN OTP validity'
        : formData.pinResetReason === 'first_time_generation'
        ? 'initial activation of newly issued card'
        : formData.pinResetReason === 'security_precaution'
        ? 'routine periodic security update'
        : 'having forgotten my 4-digit ATM PIN';

    page.drawText(
      `With due respect, I state that I hold an ATM Debit Card (${cardNo}) linked to my ${accountTypeDisplay}`,
      { x: 72, y, size: 10, font: fontNormal, color: textColor }
    );
    y -= 14;
    page.drawText(
      `No. ${formData.accountNumber || '39482015849'} with your branch. Due to ${pinReason}, I request you to kindly`,
      { x: 72, y, size: 10, font: fontNormal, color: textColor }
    );
    y -= 14;
    page.drawText(
      'regenerate and reset my ATM PIN / transmit a fresh Green PIN OTP to my registered mobile number.',
      { x: 72, y, size: 10, font: fontNormal, color: textColor }
    );
    y -= 20;
  } else if (letterType === 'atm_replacement') {
    const cardNo = formData.replacementCardNumber || '6071 8900 1234 5678';
    const repReason =
      formData.replacementCardReason === 'magnetic_strip_worn'
        ? 'wear and tear of magnetic strip causing read errors'
        : formData.replacementCardReason === 'broken_card'
        ? 'physical breakage of plastic card'
        : formData.replacementCardReason === 'expired'
        ? 'expiry of valid card date'
        : 'malfunction of the embedded EMV chip at terminals';

    page.drawText(
      `With due respect, I state that my ATM Debit Card No. ${cardNo} linked to ${accountTypeDisplay}`,
      { x: 72, y, size: 10, font: fontNormal, color: textColor }
    );
    y -= 14;
    page.drawText(
      `No. ${formData.accountNumber || '39482015849'} has become unserviceable due to ${repReason}.`,
      { x: 72, y, size: 10, font: fontNormal, color: textColor }
    );
    y -= 14;
    page.drawText(
      'I request you to cancel the defective card and issue a replacement contactless EMV chip card.',
      { x: 72, y, size: 10, font: fontNormal, color: textColor }
    );
    y -= 20;
  } else if (letterType === 'cheque_book_request') {
    const leaves = formData.chequeBookLeavesCount || '50';
    const chqType = formData.chequeBookType === 'personalized' ? 'Personalized with printed name' : 'Standard Bearer';
    const delivery =
      formData.chequeDeliveryMode === 'branch' ? 'branch counter collection' : 'my registered postal address';

    page.drawText(
      `With due respect, I state that I maintain ${accountTypeDisplay} bearing account number`,
      { x: 72, y, size: 10, font: fontNormal, color: textColor }
    );
    y -= 14;
    page.drawText(
      `${formData.accountNumber || '39482015849'} with your branch. I request you to issue a fresh Cheque Book containing`,
      { x: 72, y, size: 10, font: fontNormal, color: textColor }
    );
    y -= 14;
    page.drawText(
      `${leaves} leaves (${chqType}) complying with CTS-2010 standards, and arrange dispatch to ${delivery}.`,
      { x: 72, y, size: 10, font: fontNormal, color: textColor }
    );
    y -= 20;
  } else if (letterType === 'stop_cheque_payment') {
    const chqNo = formData.stopChequeNumber || '000412';
    const chqDate = formData.stopChequeDate || '20/10/2026';
    const chqAmt = formData.stopChequeAmount ? `Rs. ${formData.stopChequeAmount}` : 'Rs. 15,000.00';
    const payee = formData.stopChequePayeeName || 'MAHESH TRADERS';
    const reason =
      formData.stopChequeReason === 'stolen'
        ? 'stolen cheque'
        : formData.stopChequeReason === 'wrong_amount'
        ? 'inadvertent wrong amount filled'
        : formData.stopChequeReason === 'disputed_service'
        ? 'dispute in commercial transaction'
        : 'loss of instrument in transit';

    page.drawText(
      `URGENT INSTRUCTION: Please stop payment of Cheque No. ${chqNo} dated ${chqDate} for ${chqAmt}`,
      { x: 72, y, size: 10, font: fontNormal, color: textColor }
    );
    y -= 14;
    page.drawText(
      `drawn in favor of "${payee}" on my ${accountTypeDisplay} No. ${formData.accountNumber || '39482015849'}.`,
      { x: 72, y, size: 10, font: fontNormal, color: textColor }
    );
    y -= 14;
    page.drawText(
      `The stop payment is mandated due to ${reason}. I agree to debit applicable bank charges for stop instruction.`,
      { x: 72, y, size: 10, font: fontNormal, color: textColor }
    );
    y -= 20;
  } else if (letterType === 'duplicate_cheque_request') {
    const origNo = formData.dupChequeOriginalNumber || '000389';
    const origDate = formData.dupChequeIssueDate || '10/09/2026';
    const origAmt = formData.dupChequeAmount ? `Rs. ${formData.dupChequeAmount}` : 'Rs. 25,000.00';
    const beneficiary = formData.dupChequeBeneficiaryName || 'SUNSHINE ENTERPRISES';
    const dupReason =
      formData.dupChequeReason === 'validity_expired'
        ? 'validity expiry after 3 months'
        : formData.dupChequeReason === 'mutilated_in_transit'
        ? 'mutilation / tearing of physical draft'
        : 'loss by the payee / beneficiary';

    page.drawText(
      `With due respect, I state that Cheque / Demand Draft No. ${origNo} dated ${origDate} for ${origAmt}`,
      { x: 72, y, size: 10, font: fontNormal, color: textColor }
    );
    y -= 14;
    page.drawText(
      `issued in favor of "${beneficiary}" on my ${accountTypeDisplay} No. ${formData.accountNumber || '39482015849'} has been reported as ${dupReason}.`,
      { x: 72, y, size: 10, font: fontNormal, color: textColor }
    );
    y -= 14;
    page.drawText(
      'I request you to cancel the original instrument and issue a duplicate cheque / draft. Indemnity letter is attached.',
      { x: 72, y, size: 10, font: fontNormal, color: textColor }
    );
    y -= 20;
  } else if (letterType === 'cancel_cheque_request') {
    const leaves = formData.cancelChequeBookLeavesCount || '25';
    const cancelReason =
      formData.cancelChequeBookReason === 'closing_account'
        ? 'account closure formalities'
        : formData.cancelChequeBookReason === 'digital_only_account'
        ? 'migrating exclusively to net banking & UPI'
        : 'cheque book requisition placed inadvertently';

    page.drawText(
      `With due respect, I refer to the cheque book requested for my ${accountTypeDisplay} bearing account number`,
      { x: 72, y, size: 10, font: fontNormal, color: textColor }
    );
    y -= 14;
    page.drawText(
      `${formData.accountNumber || '39482015849'} with your branch. Due to ${cancelReason}, I no longer require`,
      { x: 72, y, size: 10, font: fontNormal, color: textColor }
    );
    y -= 14;
    page.drawText(
      `the cheque book (${leaves} leaves) and request you to cancel the requisition / void the cheque series in system.`,
      { x: 72, y, size: 10, font: fontNormal, color: textColor }
    );
    y -= 20;
  } else if (letterType === 'cheque_clearing_complaint') {
    const chqNo = formData.clearingChequeNo || '000552';
    const depDate = formData.clearingDepositDate || '21/10/2026';
    const amt = formData.clearingChequeAmount ? `Rs. ${formData.clearingChequeAmount}` : 'Rs. 42,500.00';
    const drawnBank = formData.clearingDrawnBankBranch || 'HDFC BANK, DADAR BRANCH';

    page.drawText(
      `With due respect, I register an urgent complaint regarding delayed clearing of Cheque No. ${chqNo}`,
      { x: 72, y, size: 10, font: fontNormal, color: textColor }
    );
    y -= 14;
    page.drawText(
      `for an amount of ${amt} drawn on ${drawnBank}, which was deposited at your branch counter on ${depDate}`,
      { x: 72, y, size: 10, font: fontNormal, color: textColor }
    );
    y -= 14;
    page.drawText(
      `for credit to my ${accountTypeDisplay} No. ${formData.accountNumber || '39482015849'}. The funds remain uncredited beyond CTS clearing timelines.`,
      { x: 72, y, size: 10, font: fontNormal, color: textColor }
    );
    y -= 20;
  } else if (letterType === 'atm_failed_withdrawal') {
    const txnDate = formData.failedAtmTxnDate || '26/10/2026';
    const txnTime = formData.failedAtmTxnTime || '11:45 AM';
    const amt = formData.failedAtmTxnAmount ? `Rs. ${formData.failedAtmTxnAmount}` : 'Rs. 10,000.00';
    const atmLoc = formData.failedAtmBankLocation || 'SBI ATM, WORLI NAKA';

    page.drawText(
      `COMPLAINT: On ${txnDate} at ${txnTime}, I attempted a cash withdrawal of ${amt} at ATM terminal located at`,
      { x: 72, y, size: 10, font: fontNormal, color: textColor }
    );
    y -= 14;
    page.drawText(
      `${atmLoc}. The ATM failed to dispense cash, yet my ${accountTypeDisplay} No. ${formData.accountNumber || '39482015849'}`,
      { x: 72, y, size: 10, font: fontNormal, color: textColor }
    );
    y -= 14;
    page.drawText(
      `was debited. Pursuant to RBI mandate (DPSS.PD.No.2632/02.10.002/2010-2011), I request immediate re-credit of ${amt}.`,
      { x: 72, y, size: 10, font: fontNormal, color: textColor }
    );
    y -= 20;
  } else if (letterType === 'lost_atm_card_complaint') {
    const cardNo = formData.lostAtmCardNumber || formData.blockAtmCardNumber || '6071 8900 1234 5678';
    const lDate = formData.lostAtmDate || '24/10/2026';
    const lPlace = formData.lostAtmPlace || 'local market';
    const fir = formData.policeComplaintNumber ? ` (Police Diary Entry: ${formData.policeComplaintNumber})` : '';

    page.drawText(
      `URGENT NOTICE: I maintain ${accountTypeDisplay} No. ${formData.accountNumber || '39482015849'} with your branch. My ATM Debit Card`,
      { x: 72, y, size: 10, font: fontNormal, color: textColor }
    );
    y -= 14;
    page.drawText(
      `No. ${cardNo} was unfortunately lost / misplaced on ${lDate} at ${lPlace}${fir}.`,
      { x: 72, y, size: 10, font: fontNormal, color: textColor }
    );
    y -= 14;
    page.drawText(
      'I request you to permanently block this card in the central switch to prevent any unauthorized financial fraud.',
      { x: 72, y, size: 10, font: fontNormal, color: textColor }
    );
    y -= 20;
  } else if (letterType === 'atm_card_renewal') {
    const cardNo = formData.expiringCardNumber || '6071 8900 1234 5678';
    const expDate = formData.cardExpiryMonthYear || '11/2026';

    page.drawText(
      `With due respect, I state that my ATM Debit Card No. ${cardNo} linked to ${accountTypeDisplay}`,
      { x: 72, y, size: 10, font: fontNormal, color: textColor }
    );
    y -= 14;
    page.drawText(
      `No. ${formData.accountNumber || '39482015849'} is expiring in ${expDate}. In order to continue uninterrupted ATM withdrawals`,
      { x: 72, y, size: 10, font: fontNormal, color: textColor }
    );
    y -= 14;
    page.drawText(
      'and online payments, I request you to kindly issue a renewed Contactless EMV Chip Debit Card.',
      { x: 72, y, size: 10, font: fontNormal, color: textColor }
    );
    y -= 20;
  } else if (letterType === 'atm_txn_dispute') {
    const dDate = formData.disputeTxnDate || '22/10/2026';
    const dAmt = formData.disputeTxnAmount ? `Rs. ${formData.disputeTxnAmount}` : 'Rs. 5,000.00';
    const dLoc = formData.disputeAtmLocation || 'ATM terminal';
    const dRef = formData.disputeTxnRefNo ? ` (Ref: ${formData.disputeTxnRefNo})` : '';

    page.drawText(
      `TRANSACTION DISPUTE: I lodge this formal dispute regarding an unauthorized / erroneous debit of ${dAmt}`,
      { x: 72, y, size: 10, font: fontNormal, color: textColor }
    );
    y -= 14;
    page.drawText(
      `on ${dDate} from my ${accountTypeDisplay} No. ${formData.accountNumber || '39482015849'} reported at ${dLoc}${dRef}.`,
      { x: 72, y, size: 10, font: fontNormal, color: textColor }
    );
    y -= 14;
    page.drawText(
      'I confirm that I did not receive or authorize this transaction and request CCTV verification and chargeback refund.',
      { x: 72, y, size: 10, font: fontNormal, color: textColor }
    );
    y -= 20;
  } else if (letterType === 'duplicate_cheque_book') {
    const leaves = formData.dupChequeBookLeavesCount || '50';
    const reason = formData.dupChequeBookReason || 'misplacement during shifting';

    page.drawText(
      `With due respect, I state that my previously issued cheque book for ${accountTypeDisplay} No.`,
      { x: 72, y, size: 10, font: fontNormal, color: textColor }
    );
    y -= 14;
    page.drawText(
      `${formData.accountNumber || '39482015849'} has been lost / misplaced due to ${reason}.`,
      { x: 72, y, size: 10, font: fontNormal, color: textColor }
    );
    y -= 14;
    page.drawText(
      `I request you to stop all unused leaves of the old book and issue a Duplicate Cheque Book containing ${leaves} leaves.`,
      { x: 72, y, size: 10, font: fontNormal, color: textColor }
    );
    y -= 20;
  } else if (letterType === 'cheque_revalidation') {
    const chqNo = formData.revalChequeNumber || '000341';
    const chqDate = formData.revalChequeDate || '15/06/2026';
    const chqAmt = formData.revalChequeAmount ? `Rs. ${formData.revalChequeAmount}` : 'Rs. 18,500.00';
    const payee = formData.revalChequePayee || 'the payee';

    page.drawText(
      `With due respect, Cheque No. ${chqNo} dated ${chqDate} for ${chqAmt} issued in favor of "${payee}"`,
      { x: 72, y, size: 10, font: fontNormal, color: textColor }
    );
    y -= 14;
    page.drawText(
      `on my ${accountTypeDisplay} No. ${formData.accountNumber || '39482015849'} could not be presented within the 3-month validity period.`,
      { x: 72, y, size: 10, font: fontNormal, color: textColor }
    );
    y -= 14;
    page.drawText(
      'The original stale cheque is enclosed herewith. I request you to revalidate the cheque with fresh date authorization.',
      { x: 72, y, size: 10, font: fontNormal, color: textColor }
    );
    y -= 20;
  } else if (letterType === 'cheque_book_not_received') {
    const oDate = formData.chqOrderDate || '05/10/2026';
    const refNo = formData.chqDispatchRefNo ? ` (Postal / Courier Ref: ${formData.chqDispatchRefNo})` : '';

    page.drawText(
      `With due respect, I refer to my Cheque Book requisition placed on ${oDate}${refNo} for my`,
      { x: 72, y, size: 10, font: fontNormal, color: textColor }
    );
    y -= 14;
    page.drawText(
      `${accountTypeDisplay} No. ${formData.accountNumber || '39482015849'} with your branch. Despite the expiry of standard delivery timelines,`,
      { x: 72, y, size: 10, font: fontNormal, color: textColor }
    );
    y -= 14;
    page.drawText(
      'the cheque book has not been received at my registered address. I request you to track and expedite delivery.',
      { x: 72, y, size: 10, font: fontNormal, color: textColor }
    );
    y -= 20;
  } else if (letterType === 'passbook_correction') {
    const details = formData.passbookDiscrepancyDetails || 'discrepancy in recorded transaction credit';
    const eDate = formData.passbookEntryDate || 'recent date';

    page.drawText(
      `With due respect, I submit my physical passbook for ${accountTypeDisplay} No. ${formData.accountNumber || '39482015849'}.`,
      { x: 72, y, size: 10, font: fontNormal, color: textColor }
    );
    y -= 14;
    page.drawText(
      `I noticed an error / discrepancy regarding entry dated ${eDate} (${details}).`,
      { x: 72, y, size: 10, font: fontNormal, color: textColor }
    );
    y -= 14;
    page.drawText(
      'I request you to verify the ledger records in your CBS system and print the corrected entry in my passbook.',
      { x: 72, y, size: 10, font: fontNormal, color: textColor }
    );
    y -= 20;
  } else if (letterType === 'mini_statement_request') {
    const count = formData.miniStatementTxnCount || '10';

    page.drawText(
      `With due respect, I maintain ${accountTypeDisplay} bearing account number ${formData.accountNumber || '39482015849'}`,
      { x: 72, y, size: 10, font: fontNormal, color: textColor }
    );
    y -= 14;
    page.drawText(
      `with your branch. I kindly request you to provide a printed Mini Statement of my last ${count} transactions`,
      { x: 72, y, size: 10, font: fontNormal, color: textColor }
    );
    y -= 14;
    page.drawText(
      'reflecting recent debits, credits, and current clear balance for my immediate reference.',
      { x: 72, y, size: 10, font: fontNormal, color: textColor }
    );
    y -= 20;
  } else if (letterType === 'balance_certificate') {
    const asOn = formData.balanceAsOnDate || appDate;
    const purpose = formData.balanceCertPurpose || 'official financial solvency verification';

    page.drawText(
      `With due respect, I state that I maintain ${accountTypeDisplay} bearing account number`,
      { x: 72, y, size: 10, font: fontNormal, color: textColor }
    );
    y -= 14;
    page.drawText(
      `${formData.accountNumber || '39482015849'} with your branch. For the purpose of ${purpose}, I kindly request you`,
      { x: 72, y, size: 10, font: fontNormal, color: textColor }
    );
    y -= 14;
    page.drawText(
      `to issue an official Bank Balance Certificate on bank letterhead certifying my credit balance as on ${asOn}.`,
      { x: 72, y, size: 10, font: fontNormal, color: textColor }
    );
    y -= 20;
  } else if (letterType === 'interest_certificate') {
    const fy = formData.interestFinancialYear || '2025-2026';
    const cType = formData.interestCertType === 'loan' ? 'Loan Interest Paid' : formData.interestCertType === 'both' ? 'Deposit & Loan Interest' : 'Deposit Interest Earned';

    page.drawText(
      `With due respect, I maintain ${accountTypeDisplay} No. ${formData.accountNumber || '39482015849'} with your branch.`,
      { x: 72, y, size: 10, font: fontNormal, color: textColor }
    );
    y -= 14;
    page.drawText(
      `I request you to kindly issue an official Interest Certificate (${cType}) for Financial Year ${fy}`,
      { x: 72, y, size: 10, font: fontNormal, color: textColor }
    );
    y -= 14;
    page.drawText(
      'for Income Tax Return filing, Form 16A / 26AS reconciliation, and TDS compliance purposes.',
      { x: 72, y, size: 10, font: fontNormal, color: textColor }
    );
    y -= 20;
  } else if (letterType === 'account_confirmation_cert') {
    const purpose = formData.accountCertPurpose || 'official administrative submission';

    page.drawText(
      `With due respect, I maintain ${accountTypeDisplay} No. ${formData.accountNumber || '39482015849'} at your branch.`,
      { x: 72, y, size: 10, font: fontNormal, color: textColor }
    );
    y -= 14;
    page.drawText(
      `I request you to kindly issue an Account Confirmation Certificate for ${purpose}, certifying`,
      { x: 72, y, size: 10, font: fontNormal, color: textColor }
    );
    y -= 14;
    page.drawText(
      'that I maintain an active, fully KYC-compliant account with your institution since opening.',
      { x: 72, y, size: 10, font: fontNormal, color: textColor }
    );
    y -= 20;
  } else if (letterType === 'no_dues_certificate') {
    const loanNo = formData.loanAccountNoForNoc || '98401928410';
    const cDate = formData.loanClosureDate || 'recent date';

    page.drawText(
      `With due respect, I state that I have fully cleared and repaid all outstanding dues on Loan Account No.`,
      { x: 72, y, size: 10, font: fontNormal, color: textColor }
    );
    y -= 14;
    page.drawText(
      `${loanNo} closed on ${cDate}. I kindly request you to issue a formal No Dues Certificate (NOC)`,
      { x: 72, y, size: 10, font: fontNormal, color: textColor }
    );
    y -= 14;
    page.drawText(
      'and release all underlying hypothecation / original property title documents and update CIBIL records.',
      { x: 72, y, size: 10, font: fontNormal, color: textColor }
    );
    y -= 20;
  } else if (letterType === 'loan_statement_request') {
    const loanNo = formData.loanAccountNo || '98401928410';
    const period = formData.loanStatementPeriod || 'the current financial year';

    page.drawText(
      `With due respect, I request you to kindly generate and issue a detailed Loan Account Statement for Loan`,
      { x: 72, y, size: 10, font: fontNormal, color: textColor }
    );
    y -= 14;
    page.drawText(
      `Account No. ${loanNo} covering ${period}, reflecting all EMI debits, principal repayments,`,
      { x: 72, y, size: 10, font: fontNormal, color: textColor }
    );
    y -= 14;
    page.drawText(
      'and interest amortisation for personal accounting and tax deduction purposes under Section 24/80C.',
      { x: 72, y, size: 10, font: fontNormal, color: textColor }
    );
    y -= 20;
  } else if (letterType === 'bank_account_verification') {
    const purpose = formData.verificationPurpose || 'official verification';
    const agency = formData.verificationAgency ? ` to ${formData.verificationAgency}` : '';

    page.drawText(
      `With due respect, I request you to issue an official Bank Account Verification Letter on bank letterhead`,
      { x: 72, y, size: 10, font: fontNormal, color: textColor }
    );
    y -= 14;
    page.drawText(
      `verifying my account number ${formData.accountNumber || '39482015849'}, IFSC, registered address, and signature for submission${agency}`,
      { x: 72, y, size: 10, font: fontNormal, color: textColor }
    );
    y -= 14;
    page.drawText(
      `for ${purpose}. I authorize the bank to verify my account credentials.`,
      { x: 72, y, size: 10, font: fontNormal, color: textColor }
    );
    y -= 20;
  } else if (letterType === 'netbanking_activation') {
    const rights = formData.netBankingRights === 'view_only' ? 'View Only (Inquiry)' : 'Full Transaction Rights';

    page.drawText(
      `With due respect, I maintain ${accountTypeDisplay} bearing account number ${formData.accountNumber || '39482015849'}`,
      { x: 72, y, size: 10, font: fontNormal, color: textColor }
    );
    y -= 14;
    page.drawText(
      `with your branch. I request you to kindly activate Internet Banking facility with ${rights}`,
      { x: 72, y, size: 10, font: fontNormal, color: textColor }
    );
    y -= 14;
    page.drawText(
      'and transmit my confidential User ID and temporary login credentials to my registered contact details.',
      { x: 72, y, size: 10, font: fontNormal, color: textColor }
    );
    y -= 20;
  } else if (letterType === 'netbanking_deactivation') {
    const reason = formData.netBankingDeactReason || 'security precautions';

    page.drawText(
      `URGENT REQUEST: I request you to immediately deactivate / suspend Internet Banking facility on my`,
      { x: 72, y, size: 10, font: fontNormal, color: textColor }
    );
    y -= 14;
    page.drawText(
      `${accountTypeDisplay} bearing account number ${formData.accountNumber || '39482015849'} with immediate effect.`,
      { x: 72, y, size: 10, font: fontNormal, color: textColor }
    );
    y -= 14;
    page.drawText(
      `The deactivation is mandated due to ${reason} in order to prevent any unauthorized electronic transactions.`,
      { x: 72, y, size: 10, font: fontNormal, color: textColor }
    );
    y -= 20;
  } else if (letterType === 'mobilebanking_activation') {
    const app = formData.mobileBankingAppChoice || 'Official Mobile Banking Application';

    page.drawText(
      `With due respect, I request you to register and activate Mobile Banking services (${app}) on my`,
      { x: 72, y, size: 10, font: fontNormal, color: textColor }
    );
    y -= 14;
    page.drawText(
      `${accountTypeDisplay} No. ${formData.accountNumber || '39482015849'} linked with registered mobile number ${formData.mobileNumber || '9970996060'}.`,
      { x: 72, y, size: 10, font: fontNormal, color: textColor }
    );
    y -= 14;
    page.drawText(
      'I agree to adhere to all terms, transaction limits, and security conditions of mobile banking.',
      { x: 72, y, size: 10, font: fontNormal, color: textColor }
    );
    y -= 20;
  } else if (letterType === 'mobilebanking_deactivation') {
    const reason = formData.mobileBankingDeactReason || 'change of mobile handset';

    page.drawText(
      `With due respect, I request you to deactivate Mobile Banking services linked to my mobile number`,
      { x: 72, y, size: 10, font: fontNormal, color: textColor }
    );
    y -= 14;
    page.drawText(
      `${formData.mobileNumber || '9970996060'} for ${accountTypeDisplay} No. ${formData.accountNumber || '39482015849'} due to ${reason}.`,
      { x: 72, y, size: 10, font: fontNormal, color: textColor }
    );
    y -= 14;
    page.drawText(
      'Kindly disable all mobile app transactional permissions until further written notice.',
      { x: 72, y, size: 10, font: fontNormal, color: textColor }
    );
    y -= 20;
  } else if (letterType === 'upi_activation') {
    const vpa = formData.preferredVpaId || 'name@bank';

    page.drawText(
      `With due respect, I request you to enable Unified Payments Interface (UPI) facility on my`,
      { x: 72, y, size: 10, font: fontNormal, color: textColor }
    );
    y -= 14;
    page.drawText(
      `${accountTypeDisplay} No. ${formData.accountNumber || '39482015849'} and register my preferred VPA (${vpa}) with NPCI`,
      { x: 72, y, size: 10, font: fontNormal, color: textColor }
    );
    y -= 14;
    page.drawText(
      'linked to my registered mobile number for instant 24x7 fund transfers.',
      { x: 72, y, size: 10, font: fontNormal, color: textColor }
    );
    y -= 20;
  } else if (letterType === 'upi_failed_complaint') {
    const txnId = formData.upiTxnId || 'UPI/2026/894019241';
    const amt = formData.upiFailedAmount ? `Rs. ${formData.upiFailedAmount}` : 'Rs. 3,200.00';
    const fDate = formData.upiFailedDate || '25/10/2026';
    const vpa = formData.upiBeneficiaryVpa || 'merchant.pay@upi';

    page.drawText(
      `COMPLAINT: On ${fDate}, a UPI transfer of ${amt} (Txn ID: ${txnId}) was initiated from my`,
      { x: 72, y, size: 10, font: fontNormal, color: textColor }
    );
    y -= 14;
    page.drawText(
      `${accountTypeDisplay} No. ${formData.accountNumber || '39482015849'} to beneficiary VPA "${vpa}". The amount was debited`,
      { x: 72, y, size: 10, font: fontNormal, color: textColor }
    );
    y -= 14;
    page.drawText(
      'from my account but not credited to beneficiary. Pursuant to RBI turnaround time, I request immediate refund.',
      { x: 72, y, size: 10, font: fontNormal, color: textColor }
    );
    y -= 20;
  } else if (letterType === 'wrong_upi_complaint') {
    const txnId = formData.wrongUpiTxnId || 'UPI/2026/784192031';
    const amt = formData.wrongUpiAmount ? `Rs. ${formData.wrongUpiAmount}` : 'Rs. 4,500.00';
    const wVpa = formData.wrongUpiReceiverVpa || 'wrong.recipient@upi';
    const cVpa = formData.correctReceiverVpa || 'correct.recipient@upi';

    page.drawText(
      `URGENT COMPLAINT: On ${appDate}, an amount of ${amt} (Txn ID: ${txnId}) was mistakenly transferred`,
      { x: 72, y, size: 10, font: fontNormal, color: textColor }
    );
    y -= 14;
    page.drawText(
      `from my account ${formData.accountNumber || '39482015849'} to wrong UPI VPA "${wVpa}" instead of intended "${cVpa}".`,
      { x: 72, y, size: 10, font: fontNormal, color: textColor }
    );
    y -= 14;
    page.drawText(
      'As per RBI / NPCI standard operating procedure for misdirected UPI transfers, I request an urgent fund recall.',
      { x: 72, y, size: 10, font: fontNormal, color: textColor }
    );
    y -= 20;
  } else if (letterType === 'failed_imps_complaint') {
    const rrn = formData.impsRrnNo || '629810294819';
    const amt = formData.impsAmount ? `Rs. ${formData.impsAmount}` : 'Rs. 12,000.00';
    const beneAcc = formData.impsBeneficiaryAcc || 'beneficiary account';

    page.drawText(
      `COMPLAINT: An IMPS transfer of ${amt} (RRN: ${rrn}) initiated from my ${accountTypeDisplay}`,
      { x: 72, y, size: 10, font: fontNormal, color: textColor }
    );
    y -= 14;
    page.drawText(
      `No. ${formData.accountNumber || '39482015849'} to beneficiary A/C ${beneAcc} was debited but remains uncredited.`,
      { x: 72, y, size: 10, font: fontNormal, color: textColor }
    );
    y -= 14;
    page.drawText(
      'I request you to trace the transaction with the beneficiary bank through NPCI switch and re-credit the funds.',
      { x: 72, y, size: 10, font: fontNormal, color: textColor }
    );
    y -= 20;
  } else if (letterType === 'failed_neft_complaint') {
    const utr = formData.neftUtrNo || 'SBIN22681920491';
    const amt = formData.neftAmount ? `Rs. ${formData.neftAmount}` : 'Rs. 45,000.00';
    const beneName = formData.neftBeneficiaryName || 'Beneficiary';

    page.drawText(
      `COMPLAINT: A NEFT remittance of ${amt} (UTR No: ${utr}) initiated from my account`,
      { x: 72, y, size: 10, font: fontNormal, color: textColor }
    );
    y -= 14;
    page.drawText(
      `${formData.accountNumber || '39482015849'} in favor of "${beneName}" has not been credited despite passage of RBI settlement batches.`,
      { x: 72, y, size: 10, font: fontNormal, color: textColor }
    );
    y -= 14;
    page.drawText(
      'Pursuant to RBI NEFT procedural guidelines, I request urgent reconciliation and confirmation of credit / reversal.',
      { x: 72, y, size: 10, font: fontNormal, color: textColor }
    );
    y -= 20;
  } else if (letterType === 'failed_rtgs_complaint') {
    const utr = formData.rtgsUtrNo || 'MAHB22684910294';
    const amt = formData.rtgsAmount ? `Rs. ${formData.rtgsAmount}` : 'Rs. 2,500,000.00';

    page.drawText(
      `URGENT COMPLAINT: A high-value RTGS transfer of ${amt} (UTR: ${utr}) debited from my`,
      { x: 72, y, size: 10, font: fontNormal, color: textColor }
    );
    y -= 14;
    page.drawText(
      `${accountTypeDisplay} No. ${formData.accountNumber || '39482015849'} has failed to reach the beneficiary within RTGS real-time window.`,
      { x: 72, y, size: 10, font: fontNormal, color: textColor }
    );
    y -= 14;
    page.drawText(
      'Kindly investigate with the RBI RTGS Gateway and arrange immediate credit or funds return with applicable penal interest.',
      { x: 72, y, size: 10, font: fontNormal, color: textColor }
    );
    y -= 20;
  } else if (letterType === 'mobilebanking_unlock') {
    const userId = formData.mobileBankingUserId || 'registered user';
    const reason = formData.mobileBankingUnlockReason || 'accidental wrong MPIN attempts';

    page.drawText(
      `With due respect, my Mobile Banking access (User ID: ${userId}) for ${accountTypeDisplay}`,
      { x: 72, y, size: 10, font: fontNormal, color: textColor }
    );
    y -= 14;
    page.drawText(
      `No. ${formData.accountNumber || '39482015849'} has been locked due to ${reason}.`,
      { x: 72, y, size: 10, font: fontNormal, color: textColor }
    );
    y -= 14;
    page.drawText(
      'I am present with valid identity documents and request you to unlock my user account and permit MPIN reset.',
      { x: 72, y, size: 10, font: fontNormal, color: textColor }
    );
    y -= 20;
  } else if (letterType === 'netbanking_password_reset') {
    const userId = formData.netBankingLoginId || 'registered user';
    const pType = formData.passwordResetType === 'login' ? 'Login Password' : formData.passwordResetType === 'transaction' ? 'Transaction Password' : 'Login & Transaction Passwords';

    page.drawText(
      `With due respect, I state that I have forgotten / misplaced my Internet Banking ${pType} for User ID`,
      { x: 72, y, size: 10, font: fontNormal, color: textColor }
    );
    y -= 14;
    page.drawText(
      `"${userId}" linked to ${accountTypeDisplay} No. ${formData.accountNumber || '39482015849'}.`,
      { x: 72, y, size: 10, font: fontNormal, color: textColor }
    );
    y -= 14;
    page.drawText(
      'I request you to reset my password credentials and transmit an activation OTP / temporary password to my registered phone.',
      { x: 72, y, size: 10, font: fontNormal, color: textColor }
    );
    y -= 20;
  }

  // Reference Intro
  page.drawText('My account details and requested updates are mentioned below for your reference:', {
    x: 72,
    y,
    size: 10,
    font: fontNormal,
    color: textColor,
  });
  y -= 16;

  // Numbered Details List
  const detailItems: Array<[string, string]> = [
    ['1. Name of Account Holder: ', fullName],
    ['2. Account Number: ', formData.accountNumber || '39482015849'],
    ['3. Account Type: ', accountTypeDisplay],
    ['4. Registered Mobile Number: ', formData.mobileNumber || '9820145678'],
    ['5. Registered Email ID: ', formData.emailId || 'name@example.com'],
  ];

  if (letterType === 'passbook') {
    const reasonText =
      formData.passbookReason === 'lost'
        ? 'Lost / Misplaced'
        : formData.passbookReason === 'damaged'
        ? 'Damaged / Torn'
        : 'Exhausted / Fully Used';
    detailItems.push(['6. Reason for Request: ', reasonText]);
    if (formData.oldPassbookNumber) {
      detailItems.push(['7. Old Passbook Number: ', formData.oldPassbookNumber]);
    }
  } else if (letterType === 'closure') {
    const reasonText =
      formData.closureReason === 'multiple_accounts'
        ? 'Maintaining multiple accounts elsewhere'
        : formData.closureReason === 'better_services'
        ? 'Operational / Personal convenience'
        : formData.closureReason === 'others' && formData.closureReasonOther
        ? formData.closureReasonOther
        : 'Relocation to another city';
    detailItems.push(['6. Reason for Account Closure: ', reasonText]);

    let refundText = 'Electronic Transfer (NEFT/RTGS)';
    if (formData.refundMode === 'cash') refundText = 'Cash withdrawal at branch counter';
    else if (formData.refundMode === 'dd') refundText = "Demand Draft / Banker's Cheque";
    else if (formData.transferAccountNumber) {
      refundText = `NEFT to A/C: ${formData.transferAccountNumber} (${formData.transferBankName || 'Bank'}, IFSC: ${formData.transferIfscCode || 'IFSC'})`;
    }
    detailItems.push(['7. Balance Remittance Mode: ', refundText]);
    detailItems.push([
      '8. Surrendered Items: ',
      'Unused Cheque Leaves and ATM / Debit Card enclosed for cancellation',
    ]);
  } else if (letterType === 'minor_to_major') {
    const dob = formData.minorDob || formData.dob || '14/08/2008';
    const majorityDate = formData.dateOfMajority || '14/08/2026';
    const guardian = `${formData.minorGuardianName || 'RAMESH SHARMA'} (${formData.minorGuardianRelationship || 'Father'})`;
    const pan = formData.majorPanNumber || formData.pan || 'ABCPS1234K';
    const aadhaar = formData.majorAadhaarNumber || formData.idDocumentNo || '4820 1948 5721';

    detailItems.push(['6. Date of Birth / Majority: ', `DOB: ${dob} (Attained 18 years on ${majorityDate})`]);
    detailItems.push(['7. Guardian to be Relieved: ', guardian]);
    detailItems.push(['8. Fresh KYC Documents: ', `PAN: ${pan} | Aadhaar: ${aadhaar} (Specimen sign enclosed)`]);
  } else if (letterType === 'name_correction') {
    const oldName = formData.oldApplicantName || 'RAJESH SHARMA';
    const newName = formData.newApplicantName || fullName || 'RAJESH KUMAR SHARMA';
    const docTypeLabel =
      formData.nameCorrectionDocType === 'pan'
        ? 'PAN Card'
        : formData.nameCorrectionDocType === 'gazette'
        ? 'Official Gazette Notification'
        : formData.nameCorrectionDocType === 'marriage_cert'
        ? 'Marriage Certificate'
        : formData.nameCorrectionDocType === 'passport'
        ? 'Passport'
        : formData.nameCorrectionDocType === 'affidavit'
        ? 'Notarized Affidavit'
        : 'Aadhaar Card';

    const docNo = formData.nameCorrectionDocNo || formData.idDocumentNo || '4820 1948 5721';
    detailItems.push(['6. Existing Name in Bank Records: ', oldName]);
    detailItems.push(['7. Correct Name to be Updated: ', newName]);
    detailItems.push(['8. Supporting Document: ', `${docTypeLabel} (No: ${docNo})`]);
  } else if (letterType === 'jandhan_conversion') {
    detailItems.push(['6. Existing Scheme: ', 'PMJDY / BSBDA (Basic Savings Bank Deposit Account)']);
    detailItems.push(['7. Requested Conversion: ', 'Regular / Normal Savings Bank Account (Full KYC)']);
    const initDeposit = formData.janDhanInitialDeposit ? `Rs. ${formData.janDhanInitialDeposit}` : 'Rs. 1,000.00';
    detailItems.push(['8. Initial Minimum Deposit: ', `${initDeposit} (Deposited herewith)`]);
  } else if (letterType === 'remove_joint_holder') {
    const jointName = formData.jointHolderNameToRemove || 'PRIYA RAMESH SHARMA';
    const reasonLabel =
      formData.jointHolderRemovalReason === 'deceased'
        ? `Demise of Joint Holder (Death Cert: ${formData.jointHolderDeathCertNo || 'DC/2026/8941'})`
        : formData.jointHolderRemovalReason === 'mutual_agreement'
        ? 'Mutual Settlement & Relinquishment'
        : 'Joint Account Holder Signed Consent Provided';

    detailItems.push(["6. Joint Holder Name to be Removed: ", jointName]);
    detailItems.push(['7. Reason for Removal: ', reasonLabel]);
    detailItems.push(['8. Revised Account Operation Mode: ', 'Single / Self (Sole Operating Authority)']);
  } else if (letterType === 'add_nominee') {
    const nomineeName = formData.newNomineeName || 'SNEHA RAJESH SHARMA';
    const relationship = formData.newNomineeRelationship || 'Spouse';
    const age = formData.newNomineeAge ? `${formData.newNomineeAge} years` : '32 years';
    const address = formData.newNomineeAddress || fullAddress;

    detailItems.push(['6. Registered Nominee Name: ', nomineeName]);
    detailItems.push(['7. Relationship with Account Holder: ', relationship]);
    detailItems.push(['8. Nominee Age / DOB: ', age]);
    detailItems.push(['9. Nominee Permanent Address: ', address]);
    detailItems.push(['10. Statutory Nomination Form: ', 'Form DA-1 (Banking Regulation Act, 1949)']);
  } else if (letterType === 'change_nominee') {
    const oldNominee = formData.existingNomineeName || 'RAMESH CHANDRA SHARMA';
    const newNominee = formData.revisedNomineeName || 'AARAV RAJESH SHARMA';
    const relationship = formData.revisedNomineeRelationship || 'Son';
    const age = formData.revisedNomineeAge ? `${formData.revisedNomineeAge} years` : '14 years';

    detailItems.push(['6. Previous Nominee Cancelled (DA-2): ', oldNominee]);
    detailItems.push(['7. Fresh Nominee Registered (DA-3): ', `${newNominee} (${relationship}, Age: ${age})`]);
    detailItems.push(['8. Fresh Nominee Address: ', formData.revisedNomineeAddress || fullAddress]);
  } else if (letterType === 'change_address') {
    const addr1 = formData.newAddressLine1 || 'FLAT 701, HIGH BREEZE TOWERS';
    const addr2 = formData.newAddressLine2 || 'NEAR CITY MALL, SENAPATI BAPAT MARG';
    const city = `${formData.newAddressCity || 'MUMBAI'}, ${formData.newAddressState || 'MAHARASHTRA'} - ${formData.newAddressPincode || '400013'}`;
    const proofLabel = (formData.addressProofDocType || 'aadhaar').toUpperCase();
    const proofNo = formData.addressProofDocNo || formData.idDocumentNo || '4820 1948 5721';

    detailItems.push(['6. New Address Line: ', `${addr1}, ${addr2}`]);
    detailItems.push(['7. City, State & PIN: ', city]);
    detailItems.push(['8. Address Proof Submitted: ', `${proofLabel} (Doc No: ${proofNo})`]);
  } else if (letterType === 'change_mobile') {
    const oldMob = formData.oldMobileNumber || '9820145678';
    const newMob = formData.newMobileNumber || '9970996060';
    const reasonLabel =
      formData.mobileChangeReason === 'lost_sim'
        ? 'SIM Card Lost / Damaged'
        : formData.mobileChangeReason === 'never_registered'
        ? 'Fresh Mobile Registration'
        : 'Phone Number Changed';

    detailItems.push(['6. Previous Mobile Number: ', oldMob]);
    detailItems.push(['7. New Mobile Number to Register: ', newMob]);
    detailItems.push(['8. Reason for Mobile Update: ', reasonLabel]);
    detailItems.push(['9. Services Activated: ', 'OTP Alerts, SMS Banking, UPI Verification, Net Banking']);
  } else if (letterType === 'aadhaar_linking') {
    const aadhaarNo = formData.aadhaarNumberForLinking || formData.idDocumentNo || '4820 1948 5721';

    detailItems.push(['6. 12-Digit Aadhaar Number: ', aadhaarNo]);
    detailItems.push(['7. Aadhaar Holder Name: ', fullName]);
    detailItems.push(['8. NPCI / DBT Mapping: ', 'Enabled (Direct Benefit Transfer & Subsidy Seeding)']);
    detailItems.push(['9. Consent & Biometrics: ', 'Customer voluntarily consents to Aadhaar seeding in CBS']);
  } else if (letterType === 'pan_linking') {
    const panNo = formData.panNumberForLinking || formData.pan || 'ABCPS1234K';
    const panName = formData.panCardHolderName || fullName;
    const panDob = formData.panDob || formData.dob || '14/08/1988';

    detailItems.push(['6. 10-Character PAN Number: ', panNo]);
    detailItems.push(['7. Name as per PAN Card: ', panName]);
    detailItems.push(['8. Date of Birth on PAN: ', panDob]);
    detailItems.push(['9. Purpose of Seeding: ', 'Income Tax Compliance, TDS Exemption & CBS Record Update']);
  } else if (letterType === 'email_update') {
    const oldMail = formData.oldEmailId || 'None / Not Registered';
    const newMail = formData.newEmailId || formData.emailId || 'rajesh.sharma@tcs.com';

    detailItems.push(['6. Previous Email ID: ', oldMail]);
    detailItems.push(['7. New Email ID to Register: ', newMail]);
    detailItems.push(['8. Digital Services: ', 'Monthly E-Statements (Password Protected) & Transaction Alerts']);
  } else if (letterType === 'signature_change') {
    const reasonLabel =
      formData.oldSignatureReason === 'change_due_to_age_health'
        ? 'Change due to Age / Health Condition'
        : formData.oldSignatureReason === 'standardizing'
        ? 'Standardizing signature across all identity documents'
        : 'Discrepancy / Signature Mismatch with old records';

    detailItems.push(['6. Reason for Specimen Update: ', reasonLabel]);
    detailItems.push(['7. Fresh Specimen Card: ', 'Appeared in person & provided 3 specimen signatures']);
    detailItems.push(['8. Identity Documents Verified: ', 'Self-attested PAN Card & Aadhaar Card submitted']);
  } else if (letterType === 'new_atm_card') {
    const cardVariant =
      formData.newAtmCardType === 'rupay_classic'
        ? 'RuPay Classic Debit Card'
        : formData.newAtmCardType === 'rupay_platinum'
        ? 'RuPay Platinum International'
        : formData.newAtmCardType === 'visa_gold'
        ? 'VISA Gold International'
        : formData.newAtmCardType === 'mastercard_global'
        ? 'MasterCard Global International'
        : 'VISA Classic Debit Card';
    const embName = formData.newAtmCardEmbossName || fullName;
    const deliv =
      formData.newAtmDeliveryMode === 'branch' ? 'Collect from Branch Counter' : 'Speed Post to Registered Address';

    detailItems.push(['6. Requested Debit Card Scheme: ', cardVariant]);
    detailItems.push(['7. Embossing Name on Card: ', embName]);
    detailItems.push(['8. Card Delivery Destination: ', deliv]);
    detailItems.push(['9. Security & Transaction Flags: ', 'Domestic ATM / POS / E-Commerce Enabled']);
  } else if (letterType === 'block_atm_card') {
    const cardNo = formData.blockAtmCardNumber || '6071 8900 1234 5678';
    const reason =
      formData.blockAtmReason === 'card_stolen'
        ? 'Card Stolen / Theft'
        : formData.blockAtmReason === 'atm_machine_captured'
        ? 'Captured inside ATM Machine'
        : formData.blockAtmReason === 'fraudulent_sms'
        ? 'Suspicious / Fraudulent Transaction Alert'
        : 'Lost / Misplaced by Cardholder';
    const rep = formData.requestReplacementAfterBlock !== false ? 'Yes, please issue replacement card' : 'No';

    detailItems.push(['6. Debit Card Number to Block: ', cardNo]);
    detailItems.push(['7. Reason for Blocking: ', reason]);
    detailItems.push(['8. Incident Date & Time: ', formData.blockAtmIncidentDate || '25/10/2026']);
    detailItems.push(['9. Issue Replacement Card: ', rep]);
  } else if (letterType === 'atm_pin_reset') {
    const cardNo = formData.pinResetCardNumber || formData.blockAtmCardNumber || '6071 8900 1234 5678';
    const reason =
      formData.pinResetReason === 'green_pin_expired'
        ? 'Green PIN OTP Expired'
        : formData.pinResetReason === 'first_time_generation'
        ? 'First Time Card Activation'
        : formData.pinResetReason === 'security_precaution'
        ? 'Security Precaution / Periodic Update'
        : 'Forgot 4-Digit ATM PIN';
    const mode =
      formData.pinDeliveryPreference === 'branch_physical_mailer'
        ? 'Physical PIN Mailer at Branch'
        : 'Green PIN OTP on Registered Mobile Number';

    detailItems.push(['6. Debit Card Number: ', cardNo]);
    detailItems.push(['7. Reason for PIN Reset: ', reason]);
    detailItems.push(['8. Preferred Generation Channel: ', mode]);
    detailItems.push(['9. Cardholder Mobile for OTP: ', formData.mobileNumber || '9970996060']);
  } else if (letterType === 'atm_replacement') {
    const cardNo = formData.replacementCardNumber || '6071 8900 1234 5678';
    const reason =
      formData.replacementCardReason === 'magnetic_strip_worn'
        ? 'Magnetic Strip Worn Out / Read Error'
        : formData.replacementCardReason === 'broken_card'
        ? 'Plastic Card Physically Damaged / Broken'
        : formData.replacementCardReason === 'expired'
        ? 'Card Validity Expired'
        : 'EMV Microchip Malfunction at POS / ATM';

    detailItems.push(['6. Defective Card Number: ', cardNo]);
    detailItems.push(['7. Nature of Card Damage: ', reason]);
    detailItems.push(['8. Replacement Card Type: ', 'Contactless EMV Chip Debit Card']);
    detailItems.push(['9. Surrender of Old Card: ', 'Enclosed herewith for cancellation']);
  } else if (letterType === 'cheque_book_request') {
    const leaves = formData.chequeBookLeavesCount || '50';
    const chqType = formData.chequeBookType === 'personalized' ? 'Personalized (Name Printed)' : 'Standard Bearer';
    const deliv =
      formData.chequeDeliveryMode === 'branch' ? 'Collect from Branch Counter' : 'Speed Post to Registered Address';

    detailItems.push(['6. Number of Cheque Leaves: ', `${leaves} Leaves (CTS-2010 Standard)`]);
    detailItems.push(['7. Cheque Book Personalization: ', chqType]);
    detailItems.push(['8. Dispatch / Delivery Mode: ', deliv]);
    detailItems.push(['9. Account Balance Eligibility: ', 'Sufficient balance available for applicable charges']);
  } else if (letterType === 'stop_cheque_payment') {
    const chqNo = formData.stopChequeNumber || '000412';
    const chqDate = formData.stopChequeDate || '20/10/2026';
    const amt = formData.stopChequeAmount ? `Rs. ${formData.stopChequeAmount}` : 'Rs. 15,000.00';
    const payee = formData.stopChequePayeeName || 'MAHESH TRADERS';
    const reason =
      formData.stopChequeReason === 'stolen'
        ? 'Cheque Stolen'
        : formData.stopChequeReason === 'wrong_amount'
        ? 'Incorrect Amount / Disputed Details'
        : formData.stopChequeReason === 'disputed_service'
        ? 'Commercial Transaction Dispute'
        : 'Cheque Lost in Transit';

    detailItems.push(['6. Cheque Number to Stop: ', chqNo]);
    detailItems.push(['7. Cheque Date & Amount: ', `${chqDate} | ${amt}`]);
    detailItems.push(['8. Drawn in Favor of (Payee): ', payee]);
    detailItems.push(['9. Reason for Stop Instruction: ', reason]);
  } else if (letterType === 'duplicate_cheque_request') {
    const origNo = formData.dupChequeOriginalNumber || '000389';
    const origDate = formData.dupChequeIssueDate || '10/09/2026';
    const amt = formData.dupChequeAmount ? `Rs. ${formData.dupChequeAmount}` : 'Rs. 25,000.00';
    const beneficiary = formData.dupChequeBeneficiaryName || 'SUNSHINE ENTERPRISES';
    const reason =
      formData.dupChequeReason === 'validity_expired'
        ? 'Instrument Expired (>3 Months)'
        : formData.dupChequeReason === 'mutilated_in_transit'
        ? 'Instrument Torn / Mutilated'
        : 'Lost by Payee / Beneficiary';

    detailItems.push(['6. Original Instrument No. & Date: ', `${origNo} (Dated: ${origDate})`]);
    detailItems.push(['7. Instrument Amount & Payee: ', `${amt} in favor of ${beneficiary}`]);
    detailItems.push(['8. Reason for Duplicate Request: ', reason]);
    detailItems.push(['9. Letter of Indemnity Undertaking: ', 'Executed & submitted herewith']);
  } else if (letterType === 'cancel_cheque_request') {
    const leaves = formData.cancelChequeBookLeavesCount || '25';
    const reason =
      formData.cancelChequeBookReason === 'closing_account'
        ? 'Account Closure Formalities'
        : formData.cancelChequeBookReason === 'digital_only_account'
        ? 'Using Net Banking & UPI Exclusively'
        : 'Requisition Placed Inadvertently';

    detailItems.push(['6. Cheque Requisition Details: ', `${leaves} Leaves Cheque Book`]);
    detailItems.push(['7. Reason for Cancellation: ', reason]);
    detailItems.push(['8. Status of Issued Cheques: ', 'No leaves used / Voided in system']);
    detailItems.push(['9. Unused Leaves Surrender: ', 'Enclosed herewith for physical cancellation']);
  } else if (letterType === 'cheque_clearing_complaint') {
    const chqNo = formData.clearingChequeNo || '000552';
    const depDate = formData.clearingDepositDate || '21/10/2026';
    const amt = formData.clearingChequeAmount ? `Rs. ${formData.clearingChequeAmount}` : 'Rs. 42,500.00';
    const drawnBank = formData.clearingDrawnBankBranch || 'HDFC Bank, Dadar Branch';

    detailItems.push(['6. Deposited Cheque Number: ', chqNo]);
    detailItems.push(['7. Deposit Date & Amount: ', `${depDate} | ${amt}`]);
    detailItems.push(['8. Drawn On Bank & Branch: ', drawnBank]);
    detailItems.push(['9. Drawer / Payer Name: ', formData.clearingPayeeDrawerName || 'KIRAN PATEL']);
  } else if (letterType === 'atm_failed_withdrawal') {
    const txnDate = formData.failedAtmTxnDate || '26/10/2026';
    const txnTime = formData.failedAtmTxnTime || '11:45 AM';
    const amt = formData.failedAtmTxnAmount ? `Rs. ${formData.failedAtmTxnAmount}` : 'Rs. 10,000.00';
    const atmLoc = formData.failedAtmBankLocation || 'SBI ATM, Worli Naka';
    const termId = formData.failedAtmTerminalId || 'S1AN00412';
    const refNo = formData.failedAtmTxnRefNo || 'TXN849102941';

    detailItems.push(['6. Transaction Date & Time: ', `${txnDate} at ${txnTime}`]);
    detailItems.push(['7. Debited Amount (No Cash): ', amt]);
    detailItems.push(['8. ATM Terminal ID & Location: ', `${termId} | ${atmLoc}`]);
    detailItems.push(['9. Transaction Reference / RRN: ', refNo]);
    detailItems.push(['10. Debit Card Last 4 Digits: ', formData.failedAtmCardLast4 || '5678']);
  } else if (letterType === 'lost_atm_card_complaint') {
    const cardNo = formData.lostAtmCardNumber || '6071 8900 1234 5678';
    const loc = formData.lostCardLocation || 'Market / Transit';
    const dateLost = formData.blockAtmIncidentDate || '25/10/2026';
    const fir = formData.lostCardFirNo || 'NCR/2026/89412';

    detailItems.push(['6. Lost Debit Card Number: ', cardNo]);
    detailItems.push(['7. Date & Location of Loss: ', `${dateLost} at ${loc}`]);
    detailItems.push(['8. Police Report / NCR Number: ', fir]);
    detailItems.push(['9. Action Requested: ', 'Immediate Card Blocking & Issue Replacement']);
  } else if (letterType === 'atm_card_renewal') {
    const cardNo = formData.expiringCardNumber || '6071 8900 1234 5678';
    const expiry = formData.cardExpiryDate || '10/2026';

    detailItems.push(['6. Expiring Debit Card Number: ', cardNo]);
    detailItems.push(['7. Expiry Date (MM/YY): ', expiry]);
    detailItems.push(['8. Preferred Scheme: ', 'Contactless EMV Chip Debit Card']);
    detailItems.push(['9. Dispatch Destination: ', 'Speed Post to Registered Address']);
  } else if (letterType === 'atm_txn_dispute') {
    const dDate = formData.disputeTxnDate || '25/10/2026';
    const dTime = formData.disputeTxnTime || '02:30 PM';
    const dAmt = formData.disputedAmount ? `Rs. ${formData.disputedAmount}` : 'Rs. 5,000.00';
    const dTerm = formData.disputeAtmTerminalId || 'ATM-0412';
    const dLoc = formData.disputeAtmLocation || 'Bank ATM';
    const dType =
      formData.disputeType === 'incorrect_debit'
        ? 'Incorrect Amount Debited'
        : formData.disputeType === 'fraudulent_charge'
        ? 'Unauthorized / Fraudulent POS Charge'
        : 'Partial Cash Dispensed';

    detailItems.push(['6. Disputed Transaction: ', `${dDate} at ${dTime} | ${dAmt}`]);
    detailItems.push(['7. ATM Terminal & Location: ', `${dTerm} | ${dLoc}`]);
    detailItems.push(['8. Nature of Dispute: ', dType]);
    detailItems.push(['9. Debit Card Last 4 Digits: ', formData.failedAtmCardLast4 || '5678']);
  } else if (letterType === 'duplicate_cheque_book') {
    const leaves = formData.dupChequeBookLeavesCount || '25';
    const prevSeries = formData.previousChequeBookSeries || 'Previous Series Exhausted / Damaged';
    const reason = formData.dupChequeBookReason || 'Original Cheque Book Damaged in Transit';

    detailItems.push(['6. Requested Cheque Book: ', `${leaves} Leaves CTS-2010 Standard`]);
    detailItems.push(['7. Previous Series Reference: ', prevSeries]);
    detailItems.push(['8. Reason for Duplicate: ', reason]);
    detailItems.push(['9. Dispatch Destination: ', 'Speed Post to Registered Address']);
  } else if (letterType === 'cheque_revalidation') {
    const cNo = formData.revalChequeNumber || '000341';
    const cDate = formData.revalChequeDate || '15/06/2026';
    const cAmt = formData.revalChequeAmount ? `Rs. ${formData.revalChequeAmount}` : 'Rs. 18,500.00';
    const cPayee = formData.revalChequePayee || 'Beneficiary';

    detailItems.push(['6. Expired Cheque Number: ', cNo]);
    detailItems.push(['7. Cheque Date & Amount: ', `${cDate} | ${cAmt}`]);
    detailItems.push(['8. Drawn In Favor Of: ', cPayee]);
    detailItems.push(['9. Revalidation Action: ', 'Revalidate Cheque / Issue Fresh Instrument']);
  } else if (letterType === 'cheque_book_not_received') {
    const reqDate = formData.chqRequisitionDate || '10/10/2026';
    const refNo = formData.chqDispatchRefNo || 'SP/MH/2026/894120';

    detailItems.push(['6. Requisition Date: ', reqDate]);
    detailItems.push(['7. Postal Dispatch / Ref No: ', refNo]);
    detailItems.push(['8. Delivery Address on File: ', fullAddress]);
    detailItems.push(['9. Grievance Status: ', 'Undelivered beyond TAT; request fresh issuance or counter handover']);
  } else if (letterType === 'passbook_correction') {
    const dType = formData.passbookDiscrepancyType || 'Incorrect Balance / Entry';
    const dDate = formData.passbookDiscrepancyDate || '20/10/2026';
    const dAmt = formData.passbookDiscrepancyAmount ? `Rs. ${formData.passbookDiscrepancyAmount}` : 'Rs. 2,500.00';

    detailItems.push(['6. Discrepancy Nature: ', dType]);
    detailItems.push(['7. Affected Date & Amount: ', `${dDate} | ${dAmt}`]);
    detailItems.push(['8. Rectification Requested: ', formData.passbookDiscrepancyDetails || 'Rectify entry and reprint updated passbook']);
  } else if (letterType === 'mini_statement_request') {
    const count = formData.miniStatementTxnCount || '10';
    const mode = formData.miniStatementDeliveryMode === 'counter' ? 'Physical Slip at Counter' : 'SMS / Email Transmission';

    detailItems.push(['6. Statement Scope: ', `Last ${count} Recent Transactions`]);
    detailItems.push(['7. Delivery Preference: ', mode]);
    detailItems.push(['8. Information Required: ', 'Date, Particulars, Debit, Credit, and Clear Balance']);
  } else if (letterType === 'balance_certificate') {
    const bDate = formData.balanceAsOnDate || appDate;
    const purpose = formData.balanceCertPurpose || 'Visa Application / Financial Audit';
    const entity = formData.balanceCertAddressedTo || 'Consulate / Visa Authority / Auditors';

    detailItems.push(['6. Balance As On Date: ', bDate]);
    detailItems.push(['7. Purpose of Certificate: ', purpose]);
    detailItems.push(['8. Addressed To: ', entity]);
    detailItems.push(['9. Certificate Format: ', 'Official Bank Letterhead with Seal & Signatures']);
  } else if (letterType === 'interest_certificate') {
    const fy = formData.interestFinancialYear || 'FY 2025-2026 (AY 2026-2027)';
    const scope =
      formData.interestCertScope === 'fd_only'
        ? 'Term Deposits (FD/RD) Interest Only'
        : formData.interestCertScope === 'savings_only'
        ? 'Savings Bank Interest Only'
        : 'All Accounts (Savings, FD, RD) & TDS Certificate';

    detailItems.push(['6. Financial Year / AY: ', fy]);
    detailItems.push(['7. Certificate Scope: ', scope]);
    detailItems.push(['8. Purpose: ', 'Income Tax Return Filing & Statutory Audit']);
  } else if (letterType === 'account_confirmation_cert') {
    const purpose = formData.accountCertPurpose || 'Tender / Vendor Registration / Statutory Compliance';
    const entity = formData.accountCertAddressedTo || 'Concerned Authority / Department';

    detailItems.push(['6. Purpose of Confirmation: ', purpose]);
    detailItems.push(['7. Parameters Certified: ', 'Account Name, Number, IFSC, MICR, Opening Date & Status']);
    detailItems.push(['8. Addressed To: ', entity]);
  } else if (letterType === 'no_dues_certificate') {
    const loanAcc = formData.loanAccountNoForNoc || '9876543210';
    const lType = formData.loanTypeForNoc || 'Personal / Auto / Home Loan';
    const cDate = formData.loanClosureDate || appDate;

    detailItems.push(['6. Loan Account Number: ', loanAcc]);
    detailItems.push(['7. Facility / Loan Type: ', lType]);
    detailItems.push(['8. Date of Full Repayment: ', cDate]);
    detailItems.push(['9. Deliverables Requested: ', 'No Dues Certificate (NOC) and Release of Original Documents']);
  } else if (letterType === 'loan_statement_request') {
    const loanAcc = formData.loanAccountNo || '9876543210';
    const from = formData.loanStatementFrom || '01/04/2025';
    const to = formData.loanStatementTo || appDate;
    const purpose = formData.loanStatementPurpose || 'Income Tax Rebate (Section 24 / 80C) / Audit';

    detailItems.push(['6. Loan Account Number: ', loanAcc]);
    detailItems.push(['7. Statement Period: ', `${from} to ${to}`]);
    detailItems.push(['8. Particulars Required: ', 'Principal, Interest, EMI Schedule & Outstanding Balance']);
    detailItems.push(['9. Purpose: ', purpose]);
  } else if (letterType === 'bank_account_verification') {
    const purpose = formData.verificationPurpose || 'Government Scheme / Direct Benefit / Commercial Vendor';
    const entity = formData.verificationAgency || 'Employer / Government Department';

    detailItems.push(['6. Verification Purpose: ', purpose]);
    detailItems.push(['7. Verifying Agency / Body: ', entity]);
    detailItems.push(['8. Enclosed Documents: ', 'Passbook Copy, Cancelled Cheque & Identity Proof']);
  } else if (letterType === 'netbanking_activation') {
    const rights = formData.netBankingRights === 'view_only' ? 'View Only (Inquiry)' : 'Full Transaction Rights';
    const limit = formData.netBankingLimit ? `Rs. ${formData.netBankingLimit}` : 'Default Standard Limit';

    detailItems.push(['6. Facility Requested: ', `Internet Banking (${rights})`]);
    detailItems.push(['7. Registered Mobile for OTP: ', formData.mobileNumber || '9970996060']);
    detailItems.push(['8. Daily Transaction Limit: ', limit]);
  } else if (letterType === 'netbanking_deactivation') {
    const userId = formData.netBankingLoginId || 'registered_user';
    const reason = formData.netBankingDeactReason || 'Security Precaution / Unused Facility';

    detailItems.push(['6. Internet Banking User ID: ', userId]);
    detailItems.push(['7. Reason for Deactivation: ', reason]);
    detailItems.push(['8. Action Requested: ', 'Immediate Deactivation of Web / Net Banking Access']);
  } else if (letterType === 'mobilebanking_activation') {
    const app = formData.mobileBankingAppChoice || 'Official Mobile Banking Application';

    detailItems.push(['6. Mobile Banking Application: ', app]);
    detailItems.push(['7. Registered Mobile for App: ', formData.mobileNumber || '9970996060']);
    detailItems.push(['8. Transaction Rights: ', 'Full Mobile Fund Transfer & Utility Payments Enabled']);
  } else if (letterType === 'mobilebanking_deactivation') {
    const reason = formData.mobileBankingDeactReason || 'Change of Smartphone / Lost Device';

    detailItems.push(['6. Mobile Linked to App: ', formData.mobileNumber || '9970996060']);
    detailItems.push(['7. Reason for Deactivation: ', reason]);
    detailItems.push(['8. Action Requested: ', 'Deregister device binding and suspend mobile banking']);
  } else if (letterType === 'upi_activation') {
    const vpa = formData.preferredVpaId || 'name@bank';

    detailItems.push(['6. Preferred UPI VPA Handle: ', vpa]);
    detailItems.push(['7. Registered Mobile Number: ', formData.mobileNumber || '9970996060']);
    detailItems.push(['8. NPCI Mapping: ', 'Enabled for Instant 24x7 Real-Time Transfers']);
  } else if (letterType === 'upi_failed_complaint') {
    const txnId = formData.upiTxnId || 'UPI/2026/894019241';
    const amt = formData.upiFailedAmount ? `Rs. ${formData.upiFailedAmount}` : 'Rs. 3,200.00';
    const fDate = formData.upiFailedDate || appDate;
    const vpa = formData.upiBeneficiaryVpa || 'merchant.pay@upi';

    detailItems.push(['6. UPI Transaction ID / Ref: ', txnId]);
    detailItems.push(['7. Date & Amount Debited: ', `${fDate} | ${amt}`]);
    detailItems.push(['8. Beneficiary VPA: ', vpa]);
    detailItems.push(['9. Grievance Status: ', 'Debited but beneficiary uncredited; refund requested per RBI TAT']);
  } else if (letterType === 'wrong_upi_complaint') {
    const txnId = formData.wrongUpiTxnId || 'UPI/2026/784192031';
    const amt = formData.wrongUpiAmount ? `Rs. ${formData.wrongUpiAmount}` : 'Rs. 4,500.00';
    const wVpa = formData.wrongUpiReceiverVpa || 'wrong.recipient@upi';
    const cVpa = formData.correctReceiverVpa || 'correct.recipient@upi';

    detailItems.push(['6. Misdirected UPI Txn ID: ', txnId]);
    detailItems.push(['7. Transferred Amount: ', amt]);
    detailItems.push(['8. Incorrect VPA Credited: ', wVpa]);
    detailItems.push(['9. Intended VPA: ', cVpa]);
  } else if (letterType === 'failed_imps_complaint') {
    const rrn = formData.impsRrnNo || '629810294819';
    const amt = formData.impsAmount ? `Rs. ${formData.impsAmount}` : 'Rs. 12,000.00';
    const beneAcc = formData.impsBeneficiaryAcc || 'Beneficiary Account';

    detailItems.push(['6. IMPS RRN / Ref Number: ', rrn]);
    detailItems.push(['7. Date & Amount Debited: ', `${formData.impsDate || appDate} | ${amt}`]);
    detailItems.push(['8. Beneficiary Account & IFSC: ', `${beneAcc} (${formData.impsBeneficiaryIfsc || 'IFSC'})`]);
    detailItems.push(['9. Status: ', 'Amount debited but uncredited; immediate reconciliation requested']);
  } else if (letterType === 'failed_neft_complaint') {
    const utr = formData.neftUtrNo || 'SBIN22681920491';
    const amt = formData.neftAmount ? `Rs. ${formData.neftAmount}` : 'Rs. 45,000.00';
    const bName = formData.neftBeneficiaryName || 'Beneficiary';

    detailItems.push(['6. NEFT UTR Number: ', utr]);
    detailItems.push(['7. Transfer Date & Amount: ', `${formData.neftDate || appDate} | ${amt}`]);
    detailItems.push(['8. Beneficiary Name & A/C: ', `${bName} | A/C: ${formData.neftBeneficiaryAcc || 'Account'}`]);
    detailItems.push(['9. Beneficiary IFSC & Bank: ', `${formData.neftBeneficiaryIfsc || 'IFSC'} (${formData.neftBeneficiaryBank || 'Bank'})`]);
  } else if (letterType === 'failed_rtgs_complaint') {
    const utr = formData.rtgsUtrNo || 'MAHB22684910294';
    const amt = formData.rtgsAmount ? `Rs. ${formData.rtgsAmount}` : 'Rs. 2,500,000.00';
    const bName = formData.rtgsBeneficiaryName || 'Beneficiary';

    detailItems.push(['6. RTGS UTR Number: ', utr]);
    detailItems.push(['7. Transfer Date & Amount: ', `${formData.rtgsDate || appDate} | ${amt}`]);
    detailItems.push(['8. Beneficiary Name & A/C: ', `${bName} | A/C: ${formData.rtgsBeneficiaryAcc || 'Account'}`]);
    detailItems.push(['9. Beneficiary IFSC: ', formData.rtgsBeneficiaryIfsc || 'IFSC']);
  } else if (letterType === 'mobilebanking_unlock') {
    const userId = formData.mobileBankingUserId || 'registered_user';
    const reason = formData.mobileBankingUnlockReason || 'Repeated incorrect PIN attempts';

    detailItems.push(['6. Mobile Banking User ID: ', userId]);
    detailItems.push(['7. Linked Mobile Number: ', formData.mobileNumber || '9970996060']);
    detailItems.push(['8. Reason for Account Lockout: ', reason]);
    detailItems.push(['9. Verification: ', 'Self-attested identity proof submitted for instant unlocking']);
  } else if (letterType === 'netbanking_password_reset') {
    const userId = formData.netBankingLoginId || 'registered_user';
    const pType =
      formData.passwordResetType === 'login'
        ? 'Login Password Only'
        : formData.passwordResetType === 'transaction'
        ? 'Transaction Password Only'
        : 'Both Login & Transaction Passwords';

    detailItems.push(['6. Internet Banking User ID: ', userId]);
    detailItems.push(['7. Password Reset Scope: ', pType]);
    detailItems.push(['8. Delivery Mode: ', 'OTP / Temporary Credentials to Registered Mobile']);
  }

  for (const [lbl, val] of detailItems) {
    page.drawText(lbl, {
      x: 84,
      y,
      size: 9.5,
      font: fontNormal,
      color: textColor,
    });
    const lw = fontNormal.widthOfTextAtSize(lbl, 9.5);
    page.drawText(val, {
      x: 84 + lw,
      y,
      size: 9.5,
      font: fontBold,
      color,
    });
    y -= 13.5;
  }
  y -= 6;

  // Closing Paragraph based on letter type
  let closingP1 = 'Kindly process my application at the earliest and update your bank records.';
  let closingP2 = 'All necessary supporting documents are enclosed herewith for your verification.';

  if (letterType === 'passbook') {
    closingP1 = 'I request you to kindly issue the new passbook at the earliest. The necessary formalities';
    closingP2 = 'and old passbook (if applicable) are submitted herewith for your verification and record.';
  } else if (letterType === 'closure') {
    closingP1 = 'I request you to kindly process the closure of the account, remit the closing proceeds,';
    closingP2 = 'and provide an account closure confirmation certificate at the earliest.';
  } else if (letterType === 'minor_to_major') {
    closingP1 = 'I request you to kindly update your records, relieve the guardian from operating the account,';
    closingP2 = 'and allow me to operate independently. Enclosed are my self-attested KYC documents.';
  } else if (letterType === 'remove_joint_holder') {
    closingP1 = 'Kindly delete the joint holder name from your CBS system, issue a fresh chequebook reflecting';
    closingP2 = 'single operation, and provide written acknowledgement of single operation status.';
  } else if (letterType === 'add_nominee' || letterType === 'change_nominee') {
    closingP1 = 'Kindly register the nomination in your records pursuant to Banking Companies Rules';
    closingP2 = 'and provide an official nomination registration acknowledgement slip for my records.';
  } else if (letterType === 'change_address') {
    closingP1 = 'Kindly update my correspondence and residential address in your records with immediate effect';
    closingP2 = 'so all bank correspondence, debit cards, and statements reach my correct address.';
  } else if (letterType === 'change_mobile') {
    closingP1 = 'Kindly update the new mobile number in the core banking system at the earliest and send';
    closingP2 = 'an SMS confirmation on my new number once the update is completed.';
  } else if (letterType === 'aadhaar_linking') {
    closingP1 = 'Kindly seed my Aadhaar in your CBS records, map it with NPCI for DBT subsidy credits,';
    closingP2 = 'and issue an Aadhaar seeding confirmation receipt.';
  } else if (letterType === 'pan_linking') {
    closingP1 = 'Kindly link my PAN in your CBS records and ensure tax compliance is updated in Form 26AS.';
    closingP2 = 'A self-attested copy of my PAN card is enclosed herewith.';
  } else if (letterType === 'email_update') {
    closingP1 = 'Kindly register the new email ID in the bank database and activate monthly e-statement dispatch.';
    closingP2 = 'Please send a verification link/confirmation to the newly registered email address.';
  } else if (letterType === 'signature_change') {
    closingP1 = 'Kindly replace my old specimen signature with my fresh specimen signature in your system';
    closingP2 = 'and authorize all future cheques, withdrawals, and instructions accordingly.';
  } else if (letterType === 'new_atm_card') {
    closingP1 = 'Kindly process the issuance of the new debit card and notify me via SMS upon dispatch.';
    closingP2 = 'I authorize the bank to debit applicable issuance and annual maintenance charges.';
  } else if (letterType === 'block_atm_card') {
    closingP1 = 'Kindly confirm the hotlisting of this card immediately and provide a card blocking reference number.';
    closingP2 = 'I hold no liability for transactions occurring subsequent to this written notification.';
  } else if (letterType === 'atm_pin_reset') {
    closingP1 = 'Kindly issue the Green PIN OTP / new PIN mailer and confirm once active on my mobile.';
    closingP2 = 'I shall immediately update my confidential PIN at the nearest bank ATM terminal.';
  } else if (letterType === 'atm_replacement') {
    closingP1 = 'Kindly expedite the replacement debit card dispatch. The defective card is enclosed herewith.';
    closingP2 = 'I request you to waive replacement charges if due to technical EMV chip defect.';
  } else if (letterType === 'cheque_book_request') {
    closingP1 = 'Kindly arrange for dispatch of the cheque book through registered speed post or courier.';
    closingP2 = 'I agree to the debit of standard cheque book charges from my account.';
  } else if (letterType === 'stop_cheque_payment') {
    closingP1 = 'Kindly mark the stop payment flag in your clearing system immediately upon receipt of this letter.';
    closingP2 = 'I undertake to indemnify the bank against any consequence arising out of this stop order.';
  } else if (letterType === 'duplicate_cheque_request') {
    closingP1 = 'Kindly cancel the original instrument and issue the duplicate instrument at the earliest.';
    closingP2 = 'Enclosed please find the executed Letter of Indemnity and applicable re-issuance fee.';
  } else if (letterType === 'cancel_cheque_request') {
    closingP1 = 'Kindly void the cheque series in your core banking system and stop further dispatch.';
    closingP2 = 'Written confirmation acknowledging the cancellation of this cheque book is requested.';
  } else if (letterType === 'cheque_clearing_complaint') {
    closingP1 = 'Kindly investigate the reason for clearing delay with the clearing house / presenting bank.';
    closingP2 = 'I request immediate credit of the funds along with interest for delayed period as per RBI rules.';
  } else if (letterType === 'atm_failed_withdrawal') {
    closingP1 = 'Pursuant to RBI circular on failed ATM transactions, kindly re-credit the funds within turnaround time';
    closingP2 = 'of T+5 banking days to avoid auto-compensation liability of Rs. 100/- per day of delay.';
  } else if (letterType === 'lost_atm_card_complaint') {
    closingP1 = 'I request you to immediately block the lost card to prevent unauthorized misuse';
    closingP2 = 'and issue a new replacement debit card to my registered address at the earliest.';
  } else if (letterType === 'atm_card_renewal') {
    closingP1 = 'Kindly process the renewal and dispatch the new EMV chip card before the expiry date.';
    closingP2 = 'I authorize the bank to debit the standard annual debit card charges from my account.';
  } else if (letterType === 'atm_txn_dispute') {
    closingP1 = 'Kindly examine ATM electronic journal logs and CCTV footage for the disputed transaction.';
    closingP2 = 'I request you to reverse the erroneous debit and credit my account within RBI TAT.';
  } else if (letterType === 'duplicate_cheque_book') {
    closingP1 = 'Kindly stop any unused leaves from the previous series and issue the duplicate cheque book.';
    closingP2 = 'I authorize the debit of applicable cheque book charges from my bank account.';
  } else if (letterType === 'cheque_revalidation') {
    closingP1 = 'Kindly revalidate the enclosed original cheque or cancel it and issue a fresh instrument.';
    closingP2 = 'All requisite revalidation and handling charges may be debited from my account.';
  } else if (letterType === 'cheque_book_not_received') {
    closingP1 = 'Kindly investigate the postal tracking status with the dispatch agency immediately.';
    closingP2 = 'If lost in transit, please cancel the dispatched series and issue a fresh cheque book.';
  } else if (letterType === 'passbook_correction') {
    closingP1 = 'Kindly reconcile the ledger with my account statement and correct the erroneous entry.';
    closingP2 = 'An updated passbook with accurate balances may kindly be provided to me.';
  } else if (letterType === 'mini_statement_request') {
    closingP1 = 'Kindly provide the mini statement showing recent transaction credits and debits.';
    closingP2 = 'I thank you for your prompt assistance in verifying my recent account activity.';
  } else if (letterType === 'balance_certificate') {
    closingP1 = 'Kindly issue the official Balance Certificate bearing the bank stamp and authorized signature.';
    closingP2 = 'I authorize the debit of prescribed bank certificate charges from my account.';
  } else if (letterType === 'interest_certificate') {
    closingP1 = 'Kindly issue the Interest Certificate covering all deposits and savings for the mentioned FY.';
    closingP2 = 'This document is urgently required for timely income tax filing and tax compliance.';
  } else if (letterType === 'account_confirmation_cert') {
    closingP1 = 'Kindly furnish an official Bank Account Confirmation Letter with IFSC, MICR, and branch seal.';
    closingP2 = 'I appreciate your prompt assistance in providing this verification document.';
  } else if (letterType === 'no_dues_certificate') {
    closingP1 = 'Kindly issue the No Dues Certificate (NOC) confirming full and final repayment of the loan';
    closingP2 = 'and release all original pledged documents and charge securities at the earliest.';
  } else if (letterType === 'loan_statement_request') {
    closingP1 = 'Kindly provide the complete detailed loan statement showing EMI, principal, and interest.';
    closingP2 = 'I agree to the debit of nominal statement printing fees from my account if applicable.';
  } else if (letterType === 'bank_account_verification') {
    closingP1 = 'Kindly verify and attest the enclosed account verification document on bank letterhead.';
    closingP2 = 'The official verification with authorized bank seal is required for official submission.';
  } else if (letterType === 'netbanking_activation') {
    closingP1 = 'Kindly activate the Internet Banking facility and dispatch the confidential login credentials.';
    closingP2 = 'I agree to comply with all security guidelines and electronic banking terms and conditions.';
  } else if (letterType === 'netbanking_deactivation') {
    closingP1 = 'Kindly deactivate all internet banking credentials immediately and confirm by SMS/email.';
    closingP2 = 'I request written acknowledgement that internet banking access has been blocked.';
  } else if (letterType === 'mobilebanking_activation') {
    closingP1 = 'Kindly activate the mobile banking facility on my registered number and grant app access.';
    closingP2 = 'I agree to abide by all RBI and bank guidelines governing mobile banking operations.';
  } else if (letterType === 'mobilebanking_deactivation') {
    closingP1 = 'Kindly deactivate mobile banking immediately to prevent any unauthorized access.';
    closingP2 = 'Please confirm deregistration of my mobile device via SMS to my registered number.';
  } else if (letterType === 'upi_activation') {
    closingP1 = 'Kindly register my account for UPI services and enable instant payment transfers via NPCI.';
    closingP2 = 'I agree to maintain confidential UPI MPIN and comply with all transaction guidelines.';
  } else if (letterType === 'upi_failed_complaint') {
    closingP1 = 'Pursuant to RBI circular on failed digital transactions, kindly re-credit the funds within T+1 day';
    closingP2 = 'to avoid auto-compensation liability of Rs. 100/- per day of delay payable to the customer.';
  } else if (letterType === 'wrong_upi_complaint') {
    closingP1 = 'Kindly initiate an immediate chargeback/recall request with the beneficiary PSP and NPCI.';
    closingP2 = 'I am ready to provide any further declaration or indemnity needed to recover the funds.';
  } else if (letterType === 'failed_imps_complaint') {
    closingP1 = 'Kindly trace the transaction status with NPCI switch and effect immediate credit or refund.';
    closingP2 = 'Pursuant to RBI guidelines, compensation of Rs. 100/day applies for delay beyond T+1 day.';
  } else if (letterType === 'failed_neft_complaint') {
    closingP1 = 'Kindly coordinate with the beneficiary bank through RBI NEFT clearing cell to resolve the credit.';
    closingP2 = 'In case of settlement failure, kindly ensure instantaneous reversal of the funds to my account.';
  } else if (letterType === 'failed_rtgs_complaint') {
    closingP1 = 'Kindly investigate the RTGS transfer immediately and provide the official RBI gateway status.';
    closingP2 = 'Since RTGS operates in real-time, any undue delay must be compensated as per RBI rules.';
  } else if (letterType === 'mobilebanking_unlock') {
    closingP1 = 'Kindly verify my physical identity documents, unlock the mobile user ID, and permit MPIN reset.';
    closingP2 = 'I thank you for your quick support in restoring my digital banking access.';
  } else if (letterType === 'netbanking_password_reset') {
    closingP1 = 'Kindly reset my password credentials and send the activation token/OTP to my mobile number.';
    closingP2 = 'I shall immediately set a new confidential password upon receiving the reset confirmation.';
  }

  page.drawText(closingP1, {
    x: 72,
    y,
    size: 10,
    font: fontNormal,
    color: textColor,
  });
  y -= 13.5;
  page.drawText(closingP2, {
    x: 72,
    y,
    size: 10,
    font: fontNormal,
    color: textColor,
  });
  y -= 19;

  // Signoff & Signature
  page.drawText('Thank you for your kind cooperation.', {
    x: 72,
    y,
    size: 10,
    font: fontNormal,
    color: textColor,
  });
  y -= 17;

  page.drawText('Yours faithfully,', {
    x: 72,
    y,
    size: 10,
    font: fontNormal,
    color: textColor,
  });
  y -= 28;

  // Signature line left blank for physical signature
  page.drawText('Signature: __________________________', {
    x: 72,
    y,
    size: 10,
    font: fontBold,
    color: textColor,
  });
  y -= 15;

  // Applicant sign details
  const signDetails: Array<[string, string]> = [
    ["Applicant's Name: ", fullName],
    ['Address: ', fullAddress],
    ['Mobile Number: ', formData.mobileNumber || '9820145678'],
    ['Email ID: ', formData.emailId || 'name@example.com'],
  ];

  for (const [lbl, val] of signDetails) {
    page.drawText(lbl, {
      x: 72,
      y,
      size: 9.5,
      font: fontBold,
      color: textColor,
    });
    const lw = fontBold.widthOfTextAtSize(lbl, 9.5);
    page.drawText(val, {
      x: 72 + lw,
      y,
      size: 9.5,
      font: fontBold,
      color,
    });
    y -= 13.5;
  }
}

