import { PDFDocument, PDFPage, PDFFont, StandardFonts, rgb, RGB } from 'pdf-lib';
import { SbiFormData, InkColor } from '../types/formTypes';
import {
  getInkRgb,
  drawCheckmark,
  drawTextLine,
  drawDateBoxes,
  drawLetterBoxes,
  dataUrlToPngBytes,
} from './sbiOverlay';

function drawSmallCheckmark(
  page: PDFPage,
  boxX: number,
  boxY: number,
  checked: boolean,
  color: RGB
) {
  if (!checked) return;
  page.drawLine({
    start: { x: boxX + 1.8, y: boxY + 4.5 },
    end: { x: boxX + 4.0, y: boxY + 2.0 },
    thickness: 1.5,
    color,
  });
  page.drawLine({
    start: { x: boxX + 4.0, y: boxY + 2.0 },
    end: { x: boxX + 8.2, y: boxY + 7.8 },
    thickness: 1.6,
    color,
  });
}

/**
 * Superimposes all form data onto the Bank of Maharashtra (BOM) Account Opening Form
 * (13-page standard IBA / PSB Alliance format) with strict one-alphabet-in-one-box precision.
 */
export async function applyBomOverlay(
  pdfDoc: PDFDocument,
  formData: SbiFormData,
  inkColor: InkColor = 'blue'
) {
  const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const color = getInkRgb(inkColor);
  const pages = pdfDoc.getPages();

  let photoImg = null;
  if (formData.photoDataUrl) {
    try {
      const photoBytes = await dataUrlToPngBytes(formData.photoDataUrl);
      if (photoBytes) {
        photoImg = await pdfDoc.embedPng(photoBytes);
      }
    } catch (e) {
      console.warn('Could not embed photo:', e);
    }
  }

  let sigImg = null;
  if (formData.signatureDataUrl) {
    try {
      const sigBytes = await dataUrlToPngBytes(formData.signatureDataUrl);
      if (sigBytes) {
        sigImg = await pdfDoc.embedPng(sigBytes);
      }
    } catch (e) {
      console.warn('Could not embed signature:', e);
    }
  }

  // ==========================================
  // PAGE 1: PART - I: CIF Creation / Personal Details
  // ==========================================
  if (pages.length >= 1) {
    const p1 = pages[0];

    // Top Right Date: 8 boxes starting at 459.0, step 12.6, baseline 761.5
    drawDateBoxes(p1, formData.applicationDate, 459.0, 761.5, 12.6, font, 8.5, color);

    // Branch Name: 17 individual square boxes starting at 113.8, step 12.02, baseline 735.0 (vertically centered in boxes)
    drawLetterBoxes(p1, formData.branchName, 113.8, 735.0, 12.02, font, 8.0, color, 17);

    // Branch Code: 5 boxes starting at 361.0, step 12.02, baseline 735.0 (perfectly centered across all 5 boxes)
    drawLetterBoxes(p1, formData.branchCode, 361.0, 735.0, 12.02, font, 8.5, color, 5);

    // Customer ID: 17 boxes starting at 112.7, step 12.02, baseline 703.5
    drawLetterBoxes(p1, formData.customerId, 112.7, 703.5, 12.02, font, 8.5, color, 17);

    // Account No.: 17 boxes starting at 112.7, step 12.02, baseline 687.5
    drawLetterBoxes(p1, formData.accountNumber, 112.7, 687.5, 12.02, font, 8.5, color, 17);

    // Application Type checkboxes: New (377.0, 698.5), Update (414.5, 698.5)
    drawCheckmark(p1, 377.0, 698.5, formData.applicationType !== 'update', color);
    drawCheckmark(p1, 414.5, 698.5, formData.applicationType === 'update', color);

    // CKYC No.: 16 boxes starting at 379.0, step 12.02, baseline 687.5 (same row as Account No)
    drawLetterBoxes(p1, formData.ckycNumber, 379.0, 687.5, 12.02, font, 8.5, color, 16);

    // Customer Type checkboxes (y = 659.0):
    drawCheckmark(p1, 111.7, 659.0, formData.accountType !== 'staff' && formData.occupationType !== 'pvt', color);
    drawCheckmark(p1, 269.5, 659.0, formData.sourceOfFunds === 'salary' || formData.occupationType === 'pvt', color);
    drawCheckmark(p1, 350.3, 659.0, formData.accountType === 'staff', color);

    // Account Type checkboxes (y = 640.1):
    drawCheckmark(p1, 112.2, 640.1, formData.accountType === 'normal', color);
    drawCheckmark(p1, 153.6, 640.1, formData.accountType === 'small', color);
    drawCheckmark(p1, 194.4, 640.1, formData.accountType === 'minor', color);

    // 01. PERSONAL DETAILS
    // Name*: Prefix/Salutation starts at 114.0 (step 12.07).
    // First Name starts strictly 2 boxes after salutation.
    const cleanSal = (formData.salutation || '').toUpperCase().replace(/[^A-Z]/g, '');
    if (cleanSal) {
      drawLetterBoxes(p1, cleanSal, 114.0, 587.2, 12.07, font, 7.5, color, 3);
    }
    const salBoxes = cleanSal.length > 0 ? cleanSal.length : 2;
    // Leave 2 empty boxes after salutation:
    const firstBoxIndex = cleanSal ? salBoxes + 2 : 6;
    const firstNameStartX = 114.0 + firstBoxIndex * 12.07;
    const maxFirstBoxes = Math.max(1, Math.floor((295.1 - firstNameStartX) / 12.07));
    drawLetterBoxes(p1, formData.firstName, firstNameStartX, 587.2, 12.07, font, 7.5, color, maxFirstBoxes);
    // Middle Name starts at Box 16 (295.1), exactly on MIDDLE NAME watermark boxes
    drawLetterBoxes(p1, formData.middleName, 295.1, 587.2, 12.07, font, 7.5, color, 10);
    // Last Name starts at Box 27 (439.9), exactly on LAST NAME watermark boxes
    drawLetterBoxes(p1, formData.lastName, 439.9, 587.2, 12.07, font, 7.5, color, 9);

    // Date of Birth*: 8 boxes starting at 111.0, step 12.07, baseline 551.5 (vertically centered in boxes)
    drawDateBoxes(p1, formData.dob, 111.0, 551.5, 12.07, font, 8.5, color);

    // Gender*: Male (246.1), Female (282.2), Transgender (318.4) @ y = 547.7
    drawCheckmark(p1, 246.1, 547.7, formData.gender === 'male', color);
    drawCheckmark(p1, 282.2, 547.7, formData.gender === 'female', color);
    drawCheckmark(p1, 318.4, 547.7, formData.gender === 'third', color);

    // Marital Status*: Married (105.3), Unmarried (153.5), Others (214.3) @ y = 530.0
    drawCheckmark(p1, 105.3, 530.0, formData.maritalStatus === 'married', color);
    drawCheckmark(p1, 153.5, 530.0, formData.maritalStatus === 'unmarried', color);
    drawCheckmark(p1, 214.3, 530.0, formData.maritalStatus === 'others', color);

    // Name of*: Father* (105.3), Mother* (152.7), Spouse* (190.2) @ y = 514.0
    drawCheckmark(p1, 105.3, 514.0, formData.relativeType === 'father', color);
    drawCheckmark(p1, 152.7, 514.0, formData.relativeType === 'mother', color);
    drawCheckmark(p1, 190.2, 514.0, formData.relativeType === 'spouse', color);

    // Relative Name Boxes:
    // Watermark: PREFIX in boxes 0-5, FIRST NAME in boxes 6-15, MIDDLE NAME in boxes 16-26, LAST NAME in boxes 27-35
    // FIRST NAME: starts at Box 6 (186.5), baseline 499.5 centered in boxes
    drawLetterBoxes(p1, formData.relativeFirstName, 186.5, 499.5, 12.07, font, 7.5, color, 9);
    // MIDDLE NAME: starts at Box 16 (295.1), baseline 499.5
    drawLetterBoxes(p1, formData.relativeMiddleName, 295.1, 499.5, 12.07, font, 7.5, color, 10);
    // LAST NAME: starts at Box 27 (439.9), baseline 499.5
    drawLetterBoxes(p1, formData.relativeLastName, 439.9, 499.5, 12.07, font, 7.5, color, 9);

    // Nationality*: In-Indian (105.4), Others (153.9) @ y = 451.0
    drawCheckmark(p1, 105.4, 451.0, formData.nationality === 'indian', color);
    drawCheckmark(p1, 153.9, 451.0, formData.nationality === 'others', color);
    if (formData.nationality === 'others' && formData.countryName) {
      drawTextLine(p1, formData.countryName, 220.0, 453.0, font, 7.5, color, 80);
    }

    // Occupation Type*:
    drawCheckmark(p1, 153.5, 431.0, formData.occupationType === 'pvt', color);
    drawCheckmark(p1, 214.3, 431.0, formData.occupationType === 'psu', color);
    drawCheckmark(p1, 274.9, 430.5, formData.occupationType === 'state_govt' || formData.occupationType === 'central_govt', color);
    // Row 2:
    drawCheckmark(p1, 153.9, 413.3, formData.occupationType === 'professional', color);
    drawCheckmark(p1, 214.5, 413.3, formData.occupationType === 'other_self', color);
    drawCheckmark(p1, 275.1, 412.8, formData.occupationType === 'retired', color);
    drawCheckmark(p1, 322.3, 412.8, formData.occupationType === 'housewife', color);
    drawCheckmark(p1, 373.7, 412.8, formData.occupationType === 'student', color);
    drawCheckmark(p1, 424.4, 412.8, formData.occupationType === 'business', color);

    // Row 3: X-Not categorised-Please specify (checkbox at 105.4, 395.6)
    const isOtherOccupation = Boolean(formData.natureOfBusiness) || formData.occupationType === 'other_self';
    drawCheckmark(p1, 105.4, 395.6, isOtherOccupation, color);
    if (isOtherOccupation) {
      const bizText = formData.natureOfBusiness || 'OTHERS';
      const netWorthText = formData.netWorth ? ` (NET WORTH: RS. ${formData.netWorth})` : '';
      drawTextLine(p1, `${bizText}${netWorthText}`, 225.0, 395.0, font, 7.5, color, 300);
    }

    // Annual Income*: Boxes start at 102.5, step 14.7, baseline 361.0
    drawLetterBoxes(p1, formData.annualIncome, 102.5, 361.0, 14.7, font, 8.0, color, 12);

    // Religion: Hindu (106.9), Muslim (143.1), Christian (191.3), Sikh (241.3), Others (277.5) @ y = 342.5
    drawCheckmark(p1, 106.9, 342.5, formData.religion === 'hindu', color);
    drawCheckmark(p1, 143.1, 342.5, formData.religion === 'muslim', color);
    drawCheckmark(p1, 191.3, 342.5, formData.religion === 'christian', color);
    drawCheckmark(p1, 241.3, 342.5, formData.religion === 'sikh', color);
    drawCheckmark(p1, 277.5, 342.5, formData.religion === 'others', color);

    // Category: General (107.8), OBC (166.0), SC (213.1), ST (252.0) @ y = 324.7
    drawCheckmark(p1, 107.8, 324.7, formData.category === 'general', color);
    drawCheckmark(p1, 166.0, 324.7, formData.category === 'obc', color);
    drawCheckmark(p1, 213.1, 324.7, formData.category === 'sc', color);
    drawCheckmark(p1, 252.0, 324.7, formData.category === 'st', color);

    // Person with disability: Yes (107.4), No (143.4) @ y = 307.8
    drawCheckmark(p1, 107.4, 307.8, formData.personWithDisability === 'yes', color);
    drawCheckmark(p1, 143.4, 307.8, formData.personWithDisability === 'no', color);

    // Educational Qualification: Illiterate (107.4), Below SSC (161.3), SSC (215.2), HSC (248.2), Graduate (282.1), Post Graduate (331.8), Professional (396.7), Others (455.3) @ y = 274.1
    drawCheckmark(p1, 282.1, 274.1, formData.education === 'graduate', color);
    drawCheckmark(p1, 331.8, 274.1, formData.education === 'post_graduate', color);
    drawCheckmark(p1, 396.7, 274.1, formData.education === 'engineering' || formData.education === 'medical' || formData.education === 'ca_mba', color);

    // PEP: None @ y = 259.8 (x = 366.7)
    drawCheckmark(p1, 366.7, 259.8, formData.pep === 'none', color);

    // Place / City of birth: 10 boxes starting at 106.4, step 14.33, baseline 219.5
    drawLetterBoxes(p1, formData.cityOfBirth || formData.cityVillage, 106.4, 219.5, 14.33, font, 7.5, color, 10);
    // Country Code of Birth* (ISO 3166)
    drawTextLine(p1, 'IN', 362.0, 219.5, font, 7.5, color, 20);
    // Citizenship
    drawTextLine(p1, formData.citizenship || 'INDIAN', 415.0, 219.5, font, 7.5, color, 80);

    // Residential Status*: Resident Individual (95.2) @ y = 200.4
    drawCheckmark(p1, 95.2, 200.4, true, color);

    // Country of Tax Residence in India only: Yes (330.7), No (359.2) @ y = 184.1
    drawCheckmark(p1, 330.7, 184.1, formData.taxResidenceIndiaOnly === 'yes', color);
    drawCheckmark(p1, 359.2, 184.1, formData.taxResidenceIndiaOnly === 'no', color);

    // PAN*: 10 boxes starting at 260.5, step 13.05, baseline 167.3
    drawLetterBoxes(p1, formData.pan, 260.5, 167.3, 13.05, font, 8.0, color, 10);

    // 02. CONTACT DETAILS
    // Mobile No. (Upper Row): 10 boxes starting at 156.6, step 14.33, baseline 118.0
    drawLetterBoxes(p1, formData.mobileNumber, 156.6, 118.0, 14.33, font, 8.5, color, 10);
    // Email-ID: text starting at 336.0, baseline 118.5
    drawTextLine(p1, formData.emailId, 336.0, 118.5, font, 7.5, color, 200);
  }

  // ==========================================
  // PAGE 2: PART - I: Proof of Identity, Address, Photo & Signature
  // ==========================================
  if (pages.length >= 2) {
    const p2 = pages[1];

    // 03. PROOF OF IDENTITY / ADDRESS:
    drawCheckmark(p2, 330.7, 791.5, formData.idProofType === 'aadhaar', color);
    drawCheckmark(p2, 34.3, 791.5, formData.idProofType === 'passport', color);
    drawCheckmark(p2, 123.8, 791.5, formData.idProofType === 'voter', color);
    drawCheckmark(p2, 238.6, 791.5, formData.idProofType === 'driving', color);

    // Document No/Identification Number*:
    // Box strip starts at x=165.0, y=737.0, step=12.71
    drawLetterBoxes(p2, formData.idDocumentNo, 165.0, 737.0, 12.71, font, 8.0, color, 18);

    // 04. LOCAL ADDRESS DETAILS:
    // Address Type: Residential (266.2), Residential/Business (202.5) @ y = 702.0
    drawCheckmark(p2, 266.2, 702.1, formData.addressType === 'residential', color);
    drawCheckmark(p2, 202.5, 700.1, formData.addressType !== 'residential', color);

    // Single Address Line: 36 boxes starting at 110.1, step 12.07, baseline 690.5 (centered vertically)
    // Address Line 1 fits up to 36 boxes without overflowing into margins
    drawLetterBoxes(p2, formData.addressLine1, 110.1, 690.5, 12.07, font, 7.5, color, 36);

    // City / Village*: 14 boxes starting at 110.9, step 12.07, baseline 672.5 (centered vertically)
    drawLetterBoxes(p2, formData.cityVillage, 110.9, 672.5, 12.07, font, 7.5, color, 14);

    // District*: 14 boxes starting at 325.0, step 12.07, baseline 672.5 (centered vertically)
    drawLetterBoxes(p2, formData.district, 325.0, 672.5, 12.07, font, 7.5, color, 14);

    // State*: 14 boxes starting at 110.9, step 12.07, baseline 653.5 (centered vertically)
    drawLetterBoxes(p2, formData.state, 110.9, 653.5, 12.07, font, 7.5, color, 14);

    // ISO 3166 Country Code
    drawTextLine(p2, 'IN', 412.0, 653.5, font, 7.5, color, 20);

    // Pin*: 6 boxes starting at 485.0 (after Pin:* label), step 12.07, baseline 653.5 (centered vertically)
    drawLetterBoxes(p2, formData.pincode, 485.0, 653.5, 12.07, font, 8.5, color, 6);

    // 05. Permanent Address Details:
    const permLine1 = formData.sameAsCurrentAddress ? formData.addressLine1 : formData.corrAddressLine1;
    const permCity = formData.sameAsCurrentAddress ? formData.cityVillage : formData.corrCityVillage;
    const permDist = formData.sameAsCurrentAddress ? formData.district : formData.corrDistrict;
    const permState = formData.sameAsCurrentAddress ? formData.state : formData.corrState;
    const permPin = formData.sameAsCurrentAddress ? formData.pincode : formData.corrPincode;

    // Address Type: Residential (270.3), Residential/Business (206.6) @ y = 612.4
    drawCheckmark(p2, 270.3, 612.4, formData.corrAddressType === 'residential' || formData.sameAsCurrentAddress, color);
    drawCheckmark(p2, 206.6, 609.9, !formData.sameAsCurrentAddress && formData.corrAddressType !== 'residential', color);

    // Single Perm Address Line: 36 boxes starting at 111.7, step 12.07, baseline 600.0 (centered vertically)
    drawLetterBoxes(p2, permLine1, 111.7, 600.0, 12.07, font, 7.5, color, 36);

    // City / Village*: 14 boxes starting at 111.7, step 12.07, baseline 581.5 (centered vertically)
    drawLetterBoxes(p2, permCity, 111.7, 581.5, 12.07, font, 7.5, color, 14);

    // District*: 14 boxes starting at 325.0, step 12.07, baseline 581.5 (centered vertically)
    drawLetterBoxes(p2, permDist, 325.0, 581.5, 12.07, font, 7.5, color, 14);

    // State*: 14 boxes starting at 111.7, step 12.07, baseline 563.0 (centered vertically)
    drawLetterBoxes(p2, permState, 111.7, 563.0, 12.07, font, 7.5, color, 14);

    // Perm ISO 3166 Country Code
    drawTextLine(p2, 'IN', 412.0, 563.0, font, 7.5, color, 20);

    // Perm Pin*: 6 boxes starting at 485.0, step 12.07, baseline 563.0 (centered vertically)
    drawLetterBoxes(p2, permPin, 485.0, 563.0, 12.07, font, 8.5, color, 6);

    // 07. DECLARATION CUM UNDERTAKING:
    // e-KYC YES: checkbox at 162.0, y = 356.7
    drawCheckmark(p2, 162.0, 356.7, true, color);

    // PHOTO FRAME: x = 46.0, y = 224.5, w = 66.4, h = 78.9
    if (photoImg) {
      p2.drawImage(photoImg, {
        x: 48.0,
        y: 226.5,
        width: 62.0,
        height: 75.0,
      });
    }

    // SIGNATURE FRAME: x = 413.5, y = 243.3, w = 163.6, h = 56.3
    if (sigImg) {
      p2.drawImage(sigImg, {
        x: 430.0,
        y: 248.0,
        width: 135.0,
        height: 45.0,
      });
    }

    // Place & Date (y = 205.0):
    drawTextLine(p2, formData.place, 70.0, 205.0, font, 8.0, color, 120);
    // Date box strip [y=198.5, x=337.0, w=112.5, h=23.3]
    drawDateBoxes(p2, formData.signatureDate || formData.applicationDate, 340.0, 204.0, 13.5, font, 8.5, color);
  }

  // ==========================================
  // PAGE 3: PART - II: Account Type & Banking Services
  // ==========================================
  if (pages.length >= 3) {
    const p3 = pages[2];

    // Office Use Header:
    // Date: 8 boxes starting at 454.0, step 12.6, baseline 774.0
    drawDateBoxes(p3, formData.applicationDate, 454.0, 774.0, 12.6, font, 8.5, color);

    // First Applicant Customer ID (Upper Row): 16 boxes starting at 157.0, step 12.5, baseline 766.0
    drawLetterBoxes(p3, formData.customerId, 157.0, 766.0, 12.5, font, 8.5, color, 16);

    // Account No.: 16 boxes starting at 157.0, step 12.5, baseline 726.0
    drawLetterBoxes(p3, formData.accountNumber, 157.0, 726.0, 12.5, font, 8.5, color, 16);

    // 01. TYPE OF ACCOUNT:
    drawCheckmark(p3, 30.3, 653.3, formData.accountCategory === 'savings', color);
    drawCheckmark(p3, 337.0, 652.7, formData.accountCategory === 'current', color);
    drawCheckmark(p3, 438.8, 652.7, formData.accountCategory === 'fixed_deposit', color);

    // 02. Mode of Operation:
    drawCheckmark(p3, 25.2, 602.1, formData.modeOfOperation === 'self' || formData.modeOfOperation === 'either_or_survivor', color);

    // 03. Service Required:
    // 1 ATM-CUM-DEBIT CARD:
    // 1st Applicant Yes (106.6, 552.8)
    drawCheckmark(p3, 106.6, 552.8, formData.atmCardRequired, color);
    // Name as would appear on the card (1st Applicant Upper Row): 19 boxes starting at 181.8, step 13.27, baseline 557.5
    if (formData.atmCardRequired) {
      drawLetterBoxes(p3, formData.nameOnCard, 181.8, 557.5, 13.27, font, 7.5, color, 19);
      // RuPay classic card scheme: x = 482.3, y = 547.4
      drawCheckmark(p3, 482.3, 547.4, formData.cardType === 'rupay', color);
    }

    // 3. CHEQUE BOOK: Yes (107.2), No (147.7) @ y = 514.0
    drawCheckmark(p3, 107.2, 514.0, formData.chequeBookRequired, color);
    drawCheckmark(p3, 147.7, 514.0, !formData.chequeBookRequired, color);

    // 4. Internet Banking required: 1st Applicant Yes (107.7, 493.5)
    drawCheckmark(p3, 107.7, 493.5, formData.internetBankingRequired, color);

    // SMS Alerts: Yes (107.7, 455.0)
    drawCheckmark(p3, 107.7, 455.0, formData.smsAlertsRequired, color);
  }

  // ==========================================
  // PAGE 4: Term Deposit & MOD Details
  // ==========================================
  if (pages.length >= 4 && formData.hasTermDeposit) {
    const p4 = pages[3];
    // Standing instruction / Debit Account No
    drawLetterBoxes(p4, formData.accountNumber, 220.0, 745.0, 12.71, font, 8.0, color, 17);
    // On Maturity, credit proceeds to Account No
    drawLetterBoxes(p4, formData.accountNumber, 220.0, 727.0, 12.71, font, 8.0, color, 17);
    // TDS deduction Account No
    drawLetterBoxes(p4, formData.accountNumber, 320.0, 676.0, 12.71, font, 8.0, color, 17);
  }

  // ==========================================
  // PAGE 5: Form DA-1 (Nomination Form)
  // ==========================================
  if (pages.length >= 5) {
    const p5 = pages[4];

    // Branch Name and Branch Code:
    // Right column starts at x=300.2, draw inside right column at x=308.0
    const branchInfo = `${formData.branchName || ''} - ${formData.branchCode || ''}`.trim();
    drawTextLine(p5, branchInfo, 308.0, 721.0, font, 8.0, color, 240);

    // Customer ID/Account No.:
    const accInfo = `${formData.customerId || ''} / ${formData.accountNumber || ''}`.trim();
    drawTextLine(p5, accInfo, 308.0, 701.5, font, 8.0, color, 240);

    // Name of Depositor (row i, y = 624.0):
    const depositor = formData.depositorName || `${formData.firstName} ${formData.lastName}`;
    drawTextLine(p5, depositor, 100.0, 624.0, font, 8.0, color, 300);

    // Nominee Details Row 1 (y = 419.0):
    if (formData.nominationOpted) {
      drawTextLine(p5, formData.nomineeName, 75.0, 419.0, font, 6.5, color, 85);
      drawTextLine(p5, formData.nomineeAddress, 165.0, 419.0, font, 6.0, color, 75);
      drawTextLine(p5, formData.nomineeMobile, 245.0, 419.0, font, 7.0, color, 55);
      drawTextLine(p5, formData.nomineeRelationship, 305.0, 419.0, font, 7.0, color, 38);
      drawTextLine(p5, formData.nomineeAge, 345.0, 419.0, font, 7.5, color, 22);
      drawTextLine(p5, formData.nomineeProportion || '100%', 415.0, 419.0, font, 7.5, color, 35);

      if (formData.nomineeIsMinor && formData.guardianName) {
        drawTextLine(p5, formData.guardianName, 455.0, 419.0, font, 7.0, color, 55);
        drawTextLine(p5, formData.guardianRelationship, 515.0, 419.0, font, 7.0, color, 45);
      }
    }
  }

  // ==========================================
  // PAGE 6: Nomination Declaration & Acknowledgement
  // ==========================================
  if (pages.length >= 6) {
    const p6 = pages[5];

    // Signature in Nomination Form Box (x=100.0, y=645.0, w=120.0, h=35.0):
    if (sigImg) {
      p6.drawImage(sigImg, {
        x: 100.0,
        y: 645.0,
        width: 120.0,
        height: 35.0,
      });
    }

    // Name of Depositor(s) (Upper nomination section):
    const depositor =
      formData.depositorName ||
      [formData.firstName, formData.middleName, formData.lastName].filter(Boolean).join(' ') ||
      `${formData.firstName} ${formData.lastName}`.trim();
    drawTextLine(p6, depositor, 100.0, 610.0, font, 8.0, color, 150);

    // No nomination checkbox (if not opted): x=32.5, y=409.4
    drawCheckmark(p6, 32.5, 409.4, !formData.nominationOpted, color);

    // Signature in No-Nomination declaration table (x=105.0, y=345.0, w=105.0, h=35.0):
    if (sigImg) {
      p6.drawImage(sigImg, {
        x: 105.0,
        y: 345.0,
        width: 105.0,
        height: 35.0,
      });
    }

    // Name of Depositor(s) in declaration table (Column 1: box x=98..214, y=280..325, baseline 301.0):
    const depWidth = font.widthOfTextAtSize(depositor, 8.0);
    const depX = depWidth < 106 ? 98.0 + (116.0 - depWidth) / 2 : 102.0;
    drawTextLine(p6, depositor, depX, 301.0, font, 8.0, color, 108);

    // Date & Place (y = 259.0):
    drawTextLine(p6, formData.signatureDate || formData.applicationDate, 60.0, 259.0, font, 7.5, color, 80);
    drawTextLine(p6, formData.place, 255.0, 259.0, font, 7.5, color, 100);

    // Acknowledgement Receipt:
    // Only "Received Nomination Form from: " is populated with the depositor's name.
    // "Customer ID/ Account no. / Locker no." is populated with customer ID / account no.
    // Branch official signature/date/seal fields are strictly left blank for branch officials.
    drawTextLine(p6, depositor, 180.0, 127.0, font, 8.0, color, 280);
    const idAndAcc = [formData.customerId, formData.accountNumber].filter(Boolean).join(' / ');
    if (idAndAcc) {
      drawTextLine(p6, idAndAcc, 210.0, 111.0, font, 8.0, color, 280);
    }
  }

  // ==========================================
  // PAGE 7: Terms and Conditions Signature
  // ==========================================
  if (pages.length >= 7) {
    const p7 = pages[6];
    if (sigImg) {
      p7.drawImage(sigImg, {
        x: 90.0,
        y: 35.0,
        width: 140.0,
        height: 35.0,
      });
    }
  }

  // ==========================================
  // PAGE 9: Form 97 (In Case PAN is not Available)
  // ==========================================
  if (pages.length >= 9) {
    const p9 = pages[8];

    // NAME: (Same as ID Proof): Rect strip [y=751.1, x=78.6, w=447.9, h=14.3]
    const fullName = [formData.firstName, formData.middleName, formData.lastName].filter(Boolean).join(' ');
    if (fullName) {
      drawLetterBoxes(p9, fullName, 80.0, 754.0, 12.75, font, 8.0, color, 30);
    }

    // Date of Transaction / Application: in the dd/mm/yyyy row at baseline 670.0
    if (formData.applicationDate) {
      drawDateBoxes(p9, formData.applicationDate, 445.0, 670.0, 12.5, font, 8.0, color);
    }

    // ==========================================
    // Section B. Documents submitted as proof (Form 60 / Form 97)
    // ==========================================
    const idNumber = formData.idDocumentNo || formData.majorAadhaarNumber || formData.pan || '482019485721';
    const issuingAuthority = formData.idIssuedBy || 'UIDAI';
    const issuingAddress = 'GOVT OF INDIA';

    // 1. Proof of Identity (POI) (Row 1):
    // First box checkmark at x=298.7, y=514.6
    drawSmallCheckmark(p9, 298.7, 514.6, true, color);
    // Document Identification Number:
    drawTextLine(p9, idNumber, 285.0, 500.5, font, 8.0, color, 260);
    // Name of the authority issuing document:
    drawTextLine(p9, issuingAuthority, 285.0, 484.5, font, 8.0, color, 260);
    // Address of the authority issuing document):
    drawTextLine(p9, issuingAddress, 285.0, 468.5, font, 8.0, color, 260);

    // 2. Proof of Address (POA) (Row 2):
    // First box checkmark at x=299.2, y=450.8
    drawSmallCheckmark(p9, 299.2, 450.8, true, color);
    // Document Identification Number:
    drawTextLine(p9, idNumber, 285.0, 437.5, font, 8.0, color, 260);
    // Name of the authority issuing document:
    drawTextLine(p9, issuingAuthority, 285.0, 421.5, font, 8.0, color, 260);
    // Address of the authority issuing document:
    drawTextLine(p9, issuingAddress, 285.0, 405.5, font, 8.0, color, 260);

    // 3. Proof of Date of Birth (DoB) (Row 3):
    // First box checkmark at x=301.4, y=387.8
    drawSmallCheckmark(p9, 301.4, 387.8, true, color);
    // Document Identification Number:
    drawTextLine(p9, idNumber, 285.0, 374.5, font, 8.0, color, 260);
    // Name of the authority issuing document:
    drawTextLine(p9, issuingAuthority, 285.0, 358.5, font, 8.0, color, 260);
    // Address of the authority issuing document:
    drawTextLine(p9, issuingAddress, 285.0, 342.5, font, 8.0, color, 260);

    // Verification lines (at y = 308.0):
    // "1. I, [fullName], son or daughter or wife of Shri [fatherName]..."
    if (fullName) {
      drawTextLine(p9, fullName, 55.0, 308.0, font, 7.5, color, 180);
    }
    const fatherName = [formData.relativeFirstName, formData.relativeMiddleName, formData.relativeLastName].filter(Boolean).join(' ');
    if (fatherName) {
      drawTextLine(p9, fatherName, 320.0, 308.0, font, 7.5, color, 180);
    }

    // Verification Date & Place:
    drawTextLine(p9, formData.signatureDate || formData.applicationDate, 100.0, 192.5, font, 7.5, color, 80);
    if (formData.place) {
      drawTextLine(p9, formData.place, 60.0, 161.5, font, 7.5, color, 100);
    }

    // Declarant Signature Frame:
    if (sigImg) {
      p9.drawImage(sigImg, {
        x: 400.0,
        y: 145.0,
        width: 120.0,
        height: 30.0,
      });
    }

    // Declarant Name:
    if (fullName) {
      drawTextLine(p9, fullName, 435.0, 122.5, font, 7.5, color, 120);
    }
  }

  // ==========================================
  // PAGE 11: Annexure - III (FATCA Declaration Form)
  // ==========================================
  if (pages.length >= 11) {
    const p11 = pages[10];

    // Place / City of Birth: boxes at 110.0, baseline 560.5 (centered vertically)
    drawLetterBoxes(p11, formData.cityOfBirth || formData.cityVillage, 110.0, 560.5, 12.75, font, 7.5, color, 12);
    // Country of birth: boxes starting at 365.0, baseline 560.5 (centered vertically)
    drawLetterBoxes(p11, formData.countryOfBirth || 'INDIA', 365.0, 560.5, 12.75, font, 7.5, color, 15);

    // Tax Residency Table Row 1 (y = 485.0):
    if (formData.taxResidenceIndiaOnly === 'yes') {
      drawTextLine(p11, 'INDIA', 30.0, 485.0, font, 7.5, color, 80);
      drawTextLine(p11, formData.pan ? `${formData.pan}` : 'RESIDENT', 150.0, 485.0, font, 7.5, color, 150);
      drawTextLine(p11, 'PAN', 420.0, 485.0, font, 7.5, color, 80);
    } else if (formData.foreignTaxResidence) {
      drawTextLine(p11, formData.foreignTaxResidence, 30.0, 485.0, font, 7.5, color, 80);
      drawTextLine(p11, formData.foreignTin || 'N/A', 150.0, 485.0, font, 7.5, color, 150);
      drawTextLine(p11, 'TIN', 420.0, 485.0, font, 7.5, color, 80);
    }

    // FATCA Address Section (baselines and startX strictly aligned with box strip tiles):
    // Address Row 1: 36 individual boxes starting at 82.0, step 12.02, baseline 390.0
    if (formData.addressLine1) {
      drawLetterBoxes(p11, formData.addressLine1, 82.0, 390.0, 12.02, font, 7.5, color, 36);
    }
    // Address Row 2: 36 individual boxes starting at 82.0, step 12.02, baseline 377.0
    if (formData.addressLine2) {
      drawLetterBoxes(p11, formData.addressLine2, 82.0, 377.0, 12.02, font, 7.5, color, 36);
    }

    // City / Village: 14 boxes starting at 82.8, step 12.35, baseline 364.0
    if (formData.cityVillage) {
      drawLetterBoxes(p11, formData.cityVillage, 82.8, 364.0, 12.35, font, 7.5, color, 14);
    }

    // State*: 14 boxes starting at 360.6, step 12.35, baseline 364.0
    if (formData.state) {
      drawLetterBoxes(p11, formData.state, 360.6, 364.0, 12.35, font, 7.5, color, 14);
    }

    // Country Name*: 14 boxes starting at 82.8, step 12.35, baseline 351.0
    drawLetterBoxes(p11, formData.country || formData.countryName || 'INDIA', 82.8, 351.0, 12.35, font, 7.5, color, 14);

    // Zip / Post code*: 14 boxes starting at 360.6, step 12.35, baseline 351.0
    if (formData.pincode) {
      drawLetterBoxes(p11, formData.pincode, 360.6, 351.0, 12.35, font, 8.0, color, 14);
    }

    // Place & Date:
    if (formData.place) {
      drawTextLine(p11, formData.place, 60.0, 317.0, font, 7.5, color, 120);
    }
    drawTextLine(p11, formData.signatureDate || formData.applicationDate, 60.0, 295.0, font, 7.5, color, 120);

    // Signature Box: x=350..550, y=272..335
    if (sigImg) {
      p11.drawImage(sigImg, {
        x: 365.0,
        y: 286.0,
        width: 135.0,
        height: 40.0,
      });
    }

    // Applicant Name below Signature Box (centered horizontally at x=450, baseline y=258.0):
    const applicantName =
      [formData.firstName, formData.middleName, formData.lastName].filter(Boolean).join(' ') ||
      formData.depositorName ||
      '';
    if (applicantName) {
      const nameWidth = font.widthOfTextAtSize(applicantName, 8.0);
      const nameX = Math.max(350.0, 450.0 - nameWidth / 2);
      drawTextLine(p11, applicantName, nameX, 258.0, font, 8.0, color, 190);
    }
  }

  // ==========================================
  // PAGE 12: Annexure - V (Declaration for General EWS / General Non-EWS)
  // ==========================================
  if (pages.length >= 12) {
    const p12 = pages[11];

    // Default General Non-EWS (income > 8,00,000) checkbox at x=31.6, y=695.2:
    drawCheckmark(p12, 31.6, 695.2, true, color);

    // Place & Date:
    if (formData.place) {
      drawTextLine(p12, formData.place, 75.0, 655.3, font, 7.5, color, 120);
    }
    drawTextLine(p12, formData.signatureDate || formData.applicationDate, 75.0, 624.2, font, 7.5, color, 120);

    // Signature Box: x=333..565, y=598..665
    if (sigImg) {
      p12.drawImage(sigImg, {
        x: 375.0,
        y: 615.0,
        width: 140.0,
        height: 42.0,
      });
    }

    // Applicant Name below Signature Box (centered horizontally under box at x=449, baseline y=582.0):
    const applicantName =
      [formData.firstName, formData.middleName, formData.lastName].filter(Boolean).join(' ') ||
      formData.depositorName ||
      '';
    if (applicantName) {
      const nameWidth = font.widthOfTextAtSize(applicantName, 8.0);
      const nameX = Math.max(340.0, 449.0 - nameWidth / 2);
      drawTextLine(p12, applicantName, nameX, 582.0, font, 8.0, color, 200);
    }
  }
}
