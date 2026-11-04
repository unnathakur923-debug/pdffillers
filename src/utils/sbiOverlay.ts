import { PDFDocument, PDFPage, rgb, StandardFonts, PDFFont } from 'pdf-lib';
import { SbiFormData, InkColor } from '../types/formTypes';

// Colors
const COLOR_BLUE = rgb(0.04, 0.12, 0.42); // Official bank blue ballpoint ink
const COLOR_BLACK = rgb(0.08, 0.08, 0.08); // Official black ink

export function getInkRgb(inkColor: InkColor) {
  return inkColor === 'black' ? COLOR_BLACK : COLOR_BLUE;
}

/**
 * Draws text strictly ONE ALPHABET IN ONE BOX.
 * Each character is mathematically centered inside its corresponding box cell.
 * Single spaces between words advance by one box (leaving one empty cell).
 */
export function drawLetterBoxes(
  page: PDFPage,
  text: string,
  startX: number,
  startY: number,
  stepX: number,
  font: PDFFont,
  size: number = 8.0,
  color = COLOR_BLUE,
  maxLen: number = 30
) {
  if (!text) return;
  const clean = text.toUpperCase().replace(/\s+/g, ' ').trim();
  const len = Math.min(clean.length, maxLen);
  for (let i = 0; i < len; i++) {
    const char = clean[i];
    if (char && char !== ' ') {
      const boxCenter = startX + i * stepX + stepX / 2;
      const charWidth = font.widthOfTextAtSize(char, size);
      const drawX = boxCenter - charWidth / 2;
      page.drawText(char, {
        x: drawX,
        y: startY,
        size,
        font,
        color,
      });
    }
  }
}

/**
 * Draws 8-digit date with ONE DIGIT IN ONE BOX: [D][D][M][M][Y][Y][Y][Y]
 */
export function drawDateBoxes(
  page: PDFPage,
  dateStr: string,
  startX: number,
  startY: number,
  stepX: number,
  font: PDFFont,
  size: number = 8.5,
  color = COLOR_BLUE
) {
  if (!dateStr) return;
  const digits = dateStr.replace(/\D/g, '').slice(0, 8);
  for (let i = 0; i < digits.length; i++) {
    const char = digits[i];
    const boxCenter = startX + i * stepX + stepX / 2;
    const charWidth = font.widthOfTextAtSize(char, size);
    const drawX = boxCenter - charWidth / 2;
    page.drawText(char, {
      x: drawX,
      y: startY,
      size,
      font,
      color,
    });
  }
}

/**
 * Draws a sharp, authentic vector checkmark tick centered inside a checkbox square.
 * SBI checkbox squares are approx 12.8pt wide x 12.4pt high.
 */
export function drawCheckmark(
  page: PDFPage,
  boxX: number,
  boxY: number,
  checked: boolean,
  color = COLOR_BLUE
) {
  if (!checked) return;
  // Down-stroke: entry tail towards bottom pivot
  page.drawLine({
    start: { x: boxX + 2.4, y: boxY + 5.2 },
    end: { x: boxX + 4.8, y: boxY + 2.6 },
    thickness: 1.6,
    color,
  });
  // Up-stroke: confident upward tick
  page.drawLine({
    start: { x: boxX + 4.8, y: boxY + 2.6 },
    end: { x: boxX + 9.8, y: boxY + 9.8 },
    thickness: 1.9,
    color,
  });
}

/**
 * Draws normal running text for underlined fields.
 */
export function drawTextLine(
  page: PDFPage,
  text: string,
  x: number,
  y: number,
  font: PDFFont,
  size: number = 7.5,
  color = COLOR_BLUE,
  maxWidth?: number
) {
  if (!text) return;
  let str = text.toUpperCase();
  if (maxWidth) {
    while (str.length > 3 && font.widthOfTextAtSize(str, size) > maxWidth) {
      str = str.slice(0, -1);
    }
  }
  page.drawText(str, {
    x,
    y,
    size,
    font,
    color,
  });
}

/**
 * Draws applicant full name strictly adhering to bank grid sequential rules:
 * - Salutation (e.g. MR, MS, MRS, DR) in leading boxes
 * - Leaving ONE box blank after Salutation
 * - First Name
 * - Leaving ONE box blank after First Name
 * - Middle Name (if present)
 * - Leaving ONE box blank after Middle Name (or after First Name if no Middle Name)
 * - Last Name
 * Row 1 has 36 boxes (startX = 104.4, y = 603.5, stepX = 12.92)
 * If name overflows Row 1, wraps seamlessly to Row 2 (startX = 104.4, y = 586.5, stepX = 12.92)
 */
export function drawApplicantNameSequence(
  page: PDFPage,
  salutation: string,
  firstName: string,
  middleName: string,
  lastName: string,
  font: PDFFont,
  size: number = 8.0,
  color = COLOR_BLUE
) {
  const cleanSal = (salutation || '').toUpperCase().replace(/[^A-Z]/g, '');
  const cleanFirst = (firstName || '').toUpperCase().replace(/[^A-Z]/g, '');
  const cleanMiddle = (middleName || '').toUpperCase().replace(/[^A-Z]/g, '');
  const cleanLast = (lastName || '').toUpperCase().replace(/[^A-Z]/g, '');

  const tokens: string[] = [];
  if (cleanSal) tokens.push(cleanSal);
  if (cleanFirst) tokens.push(cleanFirst);
  if (cleanMiddle) tokens.push(cleanMiddle);
  if (cleanLast) tokens.push(cleanLast);

  let currentBox = 0;
  const ROW1_START_X = 104.4;
  const ROW1_Y = 606.5;
  const ROW2_START_X = 104.4;
  const ROW2_Y = 589.1;
  const STEP_X = 12.92;
  const MAX_ROW1_BOXES = 36;
  const MAX_TOTAL_BOXES = 72;

  for (let t = 0; t < tokens.length; t++) {
    const token = tokens[t];
    for (let c = 0; c < token.length; c++) {
      if (currentBox >= MAX_TOTAL_BOXES) break;
      const char = token[c];
      const isRow1 = currentBox < MAX_ROW1_BOXES;
      const boxIndexInRow = isRow1 ? currentBox : currentBox - MAX_ROW1_BOXES;
      const startX = isRow1 ? ROW1_START_X : ROW2_START_X;
      const drawY = isRow1 ? ROW1_Y : ROW2_Y;

      const boxCenter = startX + boxIndexInRow * STEP_X + STEP_X / 2;
      const charWidth = font.widthOfTextAtSize(char, size);
      const drawX = boxCenter - charWidth / 2;

      page.drawText(char, {
        x: drawX,
        y: drawY,
        size,
        font,
        color,
      });

      currentBox++;
    }

    // Leave 2 blank boxes after salutation, and 1 blank box between subsequent name parts
    if (t < tokens.length - 1) {
      if (t === 0 && cleanSal) {
        currentBox += 2;
      } else {
        currentBox += 1;
      }
    }
  }
}

export async function dataUrlToPngBytes(dataUrl: string): Promise<Uint8Array | null> {
  if (!dataUrl) return null;
  if (typeof window === 'undefined' || typeof Image === 'undefined') {
    return null;
  }
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth || 300;
      canvas.height = img.naturalHeight || 300;
      const ctx = canvas.getContext('2d');
      if (!ctx) return resolve(null);
      ctx.drawImage(img, 0, 0);
      canvas.toBlob((blob) => {
        if (!blob) return resolve(null);
        const reader = new FileReader();
        reader.onloadend = () => {
          const res = reader.result as ArrayBuffer;
          resolve(new Uint8Array(res));
        };
        reader.readAsArrayBuffer(blob);
      }, 'image/png');
    };
    img.onerror = () => resolve(null);
    img.src = dataUrl;
  });
}

/**
 * Superimposes all form data onto the official SBI Account Opening Form
 * with exact one-alphabet-in-one-box precision.
 */
export async function applySbiOverlay(
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
      if (formData.photoDataUrl.startsWith('data:image/jpeg') || formData.photoDataUrl.startsWith('data:image/jpg')) {
        try {
          const base64 = formData.photoDataUrl.split(',')[1];
          const binStr = atob(base64);
          const bytes = new Uint8Array(binStr.length);
          for (let i = 0; i < binStr.length; i++) bytes[i] = binStr.charCodeAt(i);
          photoImg = await pdfDoc.embedJpg(bytes);
        } catch {
          const photoBytes = await dataUrlToPngBytes(formData.photoDataUrl);
          if (photoBytes) photoImg = await pdfDoc.embedPng(photoBytes);
        }
      } else if (formData.photoDataUrl.startsWith('data:image/png;base64,')) {
        try {
          const base64 = formData.photoDataUrl.split(',')[1];
          const binStr = atob(base64);
          const bytes = new Uint8Array(binStr.length);
          for (let i = 0; i < binStr.length; i++) bytes[i] = binStr.charCodeAt(i);
          photoImg = await pdfDoc.embedPng(bytes);
        } catch {
          const photoBytes = await dataUrlToPngBytes(formData.photoDataUrl);
          if (photoBytes) photoImg = await pdfDoc.embedPng(photoBytes);
        }
      } else {
        const photoBytes = await dataUrlToPngBytes(formData.photoDataUrl);
        if (photoBytes) {
          photoImg = await pdfDoc.embedPng(photoBytes);
        }
      }
    } catch (e) {
      console.warn('Could not embed photo:', e);
    }
  }

  let sigImg = null;
  if (formData.signatureDataUrl) {
    try {
      if (formData.signatureDataUrl.startsWith('data:image/png;base64,')) {
        try {
          const base64 = formData.signatureDataUrl.split(',')[1];
          const binStr = atob(base64);
          const bytes = new Uint8Array(binStr.length);
          for (let i = 0; i < binStr.length; i++) bytes[i] = binStr.charCodeAt(i);
          sigImg = await pdfDoc.embedPng(bytes);
        } catch {
          const sigBytes = await dataUrlToPngBytes(formData.signatureDataUrl);
          if (sigBytes) sigImg = await pdfDoc.embedPng(sigBytes);
        }
      } else {
        const sigBytes = await dataUrlToPngBytes(formData.signatureDataUrl);
        if (sigBytes) {
          sigImg = await pdfDoc.embedPng(sigBytes);
        }
      }
    } catch (e) {
      console.warn('Could not embed signature:', e);
    }
  }

  // ==========================================
  // PAGE 1: Part I - CIF Creation / Personal Details
  // ==========================================
  if (pages.length >= 1) {
    const p1 = pages[0];

    // Top Right Date: [D][D][M][M][Y][Y][Y][Y] (8 boxes starting at 444.5, step 12.75, baseline 734.5)
    drawDateBoxes(p1, formData.applicationDate, 444.5, 734.5, 12.75, font, 8.5, color);

    // Branch Name: 17 individual square boxes starting at 104.4, step 12.75, baseline 716.2 (one alphabet per box)
    drawLetterBoxes(p1, formData.branchName, 104.4, 716.2, 12.75, font, 8.0, color, 17);

    // Branch Code: 5 boxes starting at 365.5, step 12.80, baseline 716.2
    drawLetterBoxes(p1, formData.branchCode, 365.5, 716.2, 12.80, font, 8.5, color, 5);

    // Customer ID: 16 boxes starting at 104.4, step 12.76, baseline 682.0
    drawLetterBoxes(p1, formData.customerId, 104.4, 682.0, 12.76, font, 8.5, color, 16);

    // Application Type checkboxes:
    // New: box at 366.9, Update: box at 400.4, y=678.6
    drawCheckmark(p1, 366.9, 678.6, formData.applicationType === 'new', color);
    drawCheckmark(p1, 400.4, 678.6, formData.applicationType === 'update', color);

    // Account No.: 16 boxes starting at 104.4, step 12.76, baseline 665.6
    drawLetterBoxes(p1, formData.accountNumber, 104.4, 665.6, 12.76, font, 8.5, color, 16);

    // CKYC No.: 16 boxes starting at 365.5, step 12.76, baseline 665.6
    drawLetterBoxes(p1, formData.ckycNumber, 365.5, 665.6, 12.76, font, 8.5, color, 16);

    // Account Type checkboxes:
    // Normal (104.4, y=639.2), Small (150.1, y=639.2), Minor (195.7, y=639.2), Staff (365.5, y=638.0)
    drawCheckmark(p1, 104.4, 639.2, formData.accountType === 'normal', color);
    drawCheckmark(p1, 150.1, 639.2, formData.accountType === 'small', color);
    drawCheckmark(p1, 195.7, 639.2, formData.accountType === 'minor', color);
    drawCheckmark(p1, 365.5, 638.0, formData.accountType === 'staff', color);
    // PF Number: only drawn for staff accounts inside designated boxes
    if (formData.accountType === 'staff' && formData.pfNumber) {
      drawLetterBoxes(p1, formData.pfNumber, 442.1, 641.5, 12.75, font, 7.5, color, 10);
    }

    // Section A. Personal Details
    // 1. Full Name: Salutation, leaving 2 boxes, First Name, leaving 1 box, Middle Name, leaving 1 box, Last Name
    drawApplicantNameSequence(
      p1,
      formData.salutation,
      formData.firstName,
      formData.middleName,
      formData.lastName,
      font,
      8.0,
      color
    );

    // 2. Date of Birth: 8 boxes starting at 104.4, step 12.88, baseline 572.0
    drawDateBoxes(p1, formData.dob, 104.4, 572.0, 12.88, font, 8.5, color);

    // 3. Gender checkboxes (y = 568.6):
    // Male (259.4), Female (298.2), Third Gender (349.9)
    drawCheckmark(p1, 259.4, 568.6, formData.gender === 'male', color);
    drawCheckmark(p1, 298.2, 568.6, formData.gender === 'female', color);
    drawCheckmark(p1, 349.9, 568.6, formData.gender === 'third', color);

    // 4. Marital Status checkboxes (y = 552.1):
    // Married (104.4), Unmarried (156.1), Others (207.7)
    drawCheckmark(p1, 104.4, 552.1, formData.maritalStatus === 'married', color);
    drawCheckmark(p1, 156.1, 552.1, formData.maritalStatus === 'unmarried', color);
    drawCheckmark(p1, 207.7, 552.1, formData.maritalStatus === 'others', color);

    // 5. No. of Dependents: 2 boxes starting at 324.0, step 12.80, baseline 554.5
    if (formData.dependentsCount) {
      drawLetterBoxes(p1, formData.dependentsCount, 324.0, 554.5, 12.80, font, 8.5, color, 2);
    }

    // 6. Name of Relative checkboxes (y = 535.9):
    // Father (104.4), Mother (143.3), Spouse (183.8)
    drawCheckmark(p1, 104.4, 535.9, formData.relativeType === 'father', color);
    drawCheckmark(p1, 143.3, 535.9, formData.relativeType === 'mother', color);
    drawCheckmark(p1, 183.8, 535.9, formData.relativeType === 'spouse', color);

    // Relative Name Boxes (Line 6, baseline 524.7):
    // First Name: 10 boxes starting at 104.4, step 12.90
    drawLetterBoxes(p1, formData.relativeFirstName, 104.4, 524.7, 12.90, font, 8.0, color, 10);
    // Middle Name: 11 boxes starting at 246.5, step 12.90
    drawLetterBoxes(p1, formData.relativeMiddleName, 246.5, 524.7, 12.90, font, 8.0, color, 11);
    // Last Name: 13 boxes starting at 401.7, step 12.90
    drawLetterBoxes(p1, formData.relativeLastName, 401.7, 524.7, 12.90, font, 8.0, color, 13);

    // 8. Nationality checkboxes (y = 453.4):
    // In-Indian (104.4), Others (156.1)
    drawCheckmark(p1, 104.4, 453.4, formData.nationality === 'indian', color);
    drawCheckmark(p1, 156.1, 453.4, formData.nationality === 'others', color);
    if (formData.nationality === 'others' && formData.countryName) {
      drawTextLine(p1, formData.countryName, 230.0, 455.0, font, 7.5, color, 80);
    }
    // 9. Citizenship
    drawTextLine(p1, formData.citizenship || 'INDIAN', 405.0, 455.0, font, 7.5, color, 80);

    // 10. Occupation Type checkboxes:
    // State Govt (104.2), Central Govt (156.1), PSU (220.7), Defence (324.0), Pvt Sector (375.7) @ y = 432.8
    drawCheckmark(p1, 104.2, 432.8, formData.occupationType === 'state_govt', color);
    drawCheckmark(p1, 156.1, 432.8, formData.occupationType === 'central_govt', color);
    drawCheckmark(p1, 220.7, 432.8, formData.occupationType === 'psu', color);
    drawCheckmark(p1, 324.0, 432.8, formData.occupationType === 'defence', color);
    drawCheckmark(p1, 375.7, 432.8, formData.occupationType === 'pvt', color);
    // Business (104.4, y = 396.5), Other Self Employed (207.7, y = 380.4)
    drawCheckmark(p1, 104.4, 396.5, formData.occupationType === 'business', color);
    drawCheckmark(p1, 207.7, 380.4, formData.occupationType === 'other_self', color);
    // Student (156.1, y = 349.5), Housewife (104.4, y = 349.5), Retired (453.0, y = 365.0), Professional (302.5, y = 349.5)
    drawCheckmark(p1, 156.1, 349.5, formData.occupationType === 'student', color);
    drawCheckmark(p1, 104.4, 349.5, formData.occupationType === 'housewife', color);
    drawCheckmark(p1, 453.0, 365.0, formData.occupationType === 'retired', color);
    drawCheckmark(p1, 302.5, 349.5, formData.occupationType === 'professional', color);
    if (formData.employeeId) {
      drawTextLine(p1, formData.employeeId, 470.0, 436.0, font, 7.0, color, 80);
    }

    // 11. Organization Name, Designation, Nature of Business
    drawTextLine(p1, formData.organizationName, 105.0, 319.0, font, 7.5, color, 210);
    drawTextLine(p1, formData.designation, 410.0, 319.0, font, 7.5, color, 150);
    drawTextLine(p1, formData.natureOfBusiness, 105.0, 303.0, font, 7.5, color, 450);

    // 12. Annual Income & 13. Net Worth
    drawTextLine(p1, formData.annualIncome, 115.0, 285.5, font, 8.0, color, 160);
    drawTextLine(p1, formData.netWorth, 430.0, 285.5, font, 8.0, color, 130);

    // 14. Source of Funds checkboxes (y = 265.3):
    // Salary (104.4), Business (156.1), Agriculture (233.6), Investment (298.2), Pension (362.8), Others (427.4)
    drawCheckmark(p1, 104.4, 265.3, formData.sourceOfFunds === 'salary', color);
    drawCheckmark(p1, 156.1, 265.3, formData.sourceOfFunds === 'business', color);
    drawCheckmark(p1, 233.6, 265.3, formData.sourceOfFunds === 'agriculture', color);
    drawCheckmark(p1, 298.2, 265.3, formData.sourceOfFunds === 'investment', color);
    drawCheckmark(p1, 362.8, 265.3, formData.sourceOfFunds === 'pension', color);
    drawCheckmark(p1, 427.4, 265.3, formData.sourceOfFunds === 'others', color);

    // 15. Religion checkboxes (y = 249.3):
    // Hindu (104.4), Muslim (156.1), Christian (233.6), Sikh (298.2), Others (362.8)
    drawCheckmark(p1, 104.4, 249.3, formData.religion === 'hindu', color);
    drawCheckmark(p1, 156.1, 249.3, formData.religion === 'muslim', color);
    drawCheckmark(p1, 233.6, 249.3, formData.religion === 'christian', color);
    drawCheckmark(p1, 298.2, 249.3, formData.religion === 'sikh', color);
    drawCheckmark(p1, 362.8, 249.3, formData.religion === 'others', color);

    // 16. Category checkboxes (y = 233.6):
    // General (104.4), OBC (156.1), SC (233.6), ST (298.2)
    drawCheckmark(p1, 104.4, 233.6, formData.category === 'general', color);
    drawCheckmark(p1, 156.1, 233.6, formData.category === 'obc', color);
    drawCheckmark(p1, 233.6, 233.6, formData.category === 'sc', color);
    drawCheckmark(p1, 298.2, 233.6, formData.category === 'st', color);

    // 17. Person with Disability checkboxes (y = 217.1):
    // Yes (104.4), No (156.1)
    drawCheckmark(p1, 104.4, 217.1, formData.personWithDisability === 'yes', color);
    drawCheckmark(p1, 156.1, 217.1, formData.personWithDisability === 'no', color);

    // 18. Education checkboxes (y = 171.0 / 155.2 / 139.0):
    // Up to 9th (104.4, y=171.0), 10th (194.8, y=171.0), Graduate (272.3, y=171.0), Post Grad (349.9, y=171.0)
    // Medical (104.4, y=155.2), Engineering (233.6, y=155.2), Law (349.9, y=155.2), CA/MBA (466.1, y=155.5)
    drawCheckmark(p1, 104.4, 171.0, formData.education === 'other', color);
    drawCheckmark(p1, 194.8, 171.0, formData.education === '10th', color);
    drawCheckmark(p1, 272.3, 171.0, formData.education === 'graduate', color);
    drawCheckmark(p1, 349.9, 171.0, formData.education === 'post_graduate', color);
    drawCheckmark(p1, 104.4, 155.2, formData.education === 'medical', color);
    drawCheckmark(p1, 233.6, 155.2, formData.education === 'engineering', color);
    drawCheckmark(p1, 349.9, 155.2, formData.education === 'law', color);
    drawCheckmark(p1, 466.1, 155.5, formData.education === 'ca_mba', color);
    drawCheckmark(p1, 104.4, 139.0, formData.education === 'computer', color);

    // 19. PEP checkboxes (y = 122.6):
    // PEP (104.4), Related (233.6), None (349.9)
    drawCheckmark(p1, 104.4, 122.6, formData.pep === 'pep', color);
    drawCheckmark(p1, 233.6, 122.6, formData.pep === 'related', color);
    drawCheckmark(p1, 349.9, 122.6, formData.pep === 'none', color);

    // 20. Tax Residence in India Only checkboxes (y = 90.3):
    // Yes (298.2), No (349.9)
    drawCheckmark(p1, 298.2, 90.3, formData.taxResidenceIndiaOnly === 'yes', color);
    drawCheckmark(p1, 349.9, 90.3, formData.taxResidenceIndiaOnly === 'no', color);

    // 21. PAN: 10 boxes starting at 104.4, step 12.92, baseline 79.6
    drawLetterBoxes(p1, formData.pan, 104.4, 79.6, 12.92, font, 8.5, color, 10);

    // Section B. Contact Details:
    // Mobile No.: 10 boxes starting at 104.4, step 12.88, baseline 48.8
    drawLetterBoxes(p1, formData.mobileNumber, 104.4, 48.8, 12.88, font, 8.5, color, 10);

    // Email ID: text starting at 320.0, y=48.8
    drawTextLine(p1, formData.emailId.toLowerCase(), 320.0, 48.8, font, 7.5, color, 240);

    // Mobile belongs to checkboxes (y = 28.7):
    // Self (104.4), Father (142.9), Mother (187.4), Son (235.5), Daughter (274.6), Spouse (328.6)
    drawCheckmark(p1, 104.4, 28.7, formData.mobileBelongsTo === 'self', color);
    drawCheckmark(p1, 142.9, 28.7, formData.mobileBelongsTo === 'father', color);
    drawCheckmark(p1, 187.4, 28.7, formData.mobileBelongsTo === 'mother', color);
    drawCheckmark(p1, 235.5, 28.7, formData.mobileBelongsTo === 'son', color);
    drawCheckmark(p1, 274.6, 28.7, formData.mobileBelongsTo === 'daughter', color);
    drawCheckmark(p1, 328.6, 28.7, formData.mobileBelongsTo === 'spouse', color);
  }

  // ==========================================
  // PAGE 2: Section C, D, E, G (Address & Photo/Signature)
  // ==========================================
  if (pages.length >= 2) {
    const p2 = pages[1];

    // Section C. Proof of Identity checkboxes (y = 787.5):
    // Passport (25.5), Voter (104.4), Driving (202.1), Aadhaar (283.6), NREGA (25.5, y=772.0)
    drawCheckmark(p2, 25.5, 787.5, formData.idProofType === 'passport', color);
    drawCheckmark(p2, 104.4, 787.5, formData.idProofType === 'voter', color);
    drawCheckmark(p2, 202.1, 787.5, formData.idProofType === 'driving', color);
    drawCheckmark(p2, 283.6, 787.5, formData.idProofType === 'aadhaar', color);
    drawCheckmark(p2, 25.5, 772.0, formData.idProofType === 'nrega', color);

    // Document No. / Identification No.: 26 boxes starting at 104.4, step 12.92, baseline 743.0
    drawLetterBoxes(p2, formData.idDocumentNo, 104.4, 743.0, 12.92, font, 8.0, color, 26);

    // Issued By, Issue Date, Expiry Date (baseline 726.5)
    drawLetterBoxes(p2, formData.idIssuedBy || 'UIDAI', 104.4, 726.5, 12.92, font, 7.5, color, 13);
    drawDateBoxes(p2, formData.idIssueDate, 311.1, 726.5, 12.92, font, 8.0, color);
    drawDateBoxes(p2, formData.idExpiryDate, 466.1, 726.5, 12.92, font, 8.0, color);

    // Section D. Current Address Type checkboxes (y = 630.0):
    // Residential/Business (104.4), Residential (194.8), Business (259.4), Registered (324.0)
    drawCheckmark(p2, 104.4, 630.0, formData.addressType === 'residential_business', color);
    drawCheckmark(p2, 194.8, 630.0, formData.addressType === 'residential', color);
    drawCheckmark(p2, 259.4, 630.0, formData.addressType === 'business', color);
    drawCheckmark(p2, 324.0, 630.0, formData.addressType === 'registered', color);

    // Address Line 1: 36 boxes starting at 104.4, step 12.92, baseline 614.5
    drawLetterBoxes(p2, formData.addressLine1, 104.4, 614.5, 12.92, font, 7.5, color, 36);

    // Address Line 2: 36 boxes starting at 104.4, step 12.92, baseline 596.5
    drawLetterBoxes(p2, formData.addressLine2, 104.4, 596.5, 12.92, font, 7.5, color, 36);

    // City / Village: 15 boxes starting at 104.4, step 12.92, baseline 577.5
    drawLetterBoxes(p2, formData.cityVillage, 104.4, 577.5, 12.92, font, 7.5, color, 15);

    // District: 18 boxes starting at 324.0, step 12.92, baseline 577.5
    drawLetterBoxes(p2, formData.district, 324.0, 577.5, 12.92, font, 7.5, color, 18);

    // State: 12 boxes starting at 104.4, step 12.92, baseline 558.5
    drawLetterBoxes(p2, formData.state, 104.4, 558.5, 12.92, font, 7.5, color, 12);

    // PIN Code: 6 boxes starting at 273.3, step 12.76, baseline 558.5
    drawLetterBoxes(p2, formData.pincode, 273.3, 558.5, 12.76, font, 8.5, color, 6);

    // Country Name
    drawTextLine(p2, formData.country || 'INDIA', 405.0, 558.5, font, 7.5, color, 100);

    // Section E. Correspondence Address:
    // Same as Current Address checkbox at 175.2, y=536.0
    drawCheckmark(p2, 175.2, 536.0, formData.sameAsCurrentAddress, color);

    // When sameAsCurrentAddress is checked, correspondence address automatically mirrors Current Address
    const corrLine1 = formData.sameAsCurrentAddress
      ? (formData.addressLine1 || formData.corrAddressLine1)
      : formData.corrAddressLine1;
    const corrLine2 = formData.sameAsCurrentAddress
      ? (formData.addressLine2 || formData.corrAddressLine2)
      : formData.corrAddressLine2;
    const corrCity = formData.sameAsCurrentAddress
      ? (formData.cityVillage || formData.corrCityVillage)
      : formData.corrCityVillage;
    const corrDist = formData.sameAsCurrentAddress
      ? (formData.district || formData.corrDistrict)
      : formData.corrDistrict;
    const corrState = formData.sameAsCurrentAddress
      ? (formData.state || formData.corrState)
      : formData.corrState;
    const corrPin = formData.sameAsCurrentAddress
      ? (formData.pincode || formData.corrPincode)
      : formData.corrPincode;
    const corrCountry = formData.sameAsCurrentAddress
      ? (formData.country || formData.corrCountry || 'INDIA')
      : (formData.corrCountry || 'INDIA');

    // Fill correspondence address boxes cleanly letter-by-letter
    drawLetterBoxes(p2, corrLine1, 104.4, 501.5, 12.92, font, 7.5, color, 36);
    drawLetterBoxes(p2, corrLine2, 104.4, 483.5, 12.92, font, 7.5, color, 36);
    drawLetterBoxes(p2, corrCity, 104.4, 464.5, 12.92, font, 7.5, color, 15);
    drawLetterBoxes(p2, corrDist, 324.0, 464.5, 12.92, font, 7.5, color, 18);
    drawLetterBoxes(p2, corrState, 104.4, 445.5, 12.92, font, 7.5, color, 12);
    drawLetterBoxes(p2, corrPin, 273.3, 445.5, 12.76, font, 8.5, color, 6);
    drawTextLine(p2, corrCountry, 405.0, 445.5, font, 7.5, color, 100);

    // Section G. Declaration Cum Undertaking:
    // Aadhaar Consent: Yes (104.4), No (148.8) @ y=285.5
    drawCheckmark(p2, 104.4, 285.5, formData.aadhaarConsent === 'yes', color);
    drawCheckmark(p2, 148.8, 285.5, formData.aadhaarConsent === 'no', color);

    // Photo Placement in designated frame (Page 2 Section G: x=25.25..104.38, y=200.92..280.82)
    // Centered with 1.2pt border inset and strict aspect ratio preservation
    if (photoImg) {
      const boxX = 26.5;
      const boxY = 202.1;
      const boxW = 76.6;
      const boxH = 77.5;

      const imgW = photoImg.width;
      const imgH = photoImg.height;
      const imgRatio = imgW / imgH;
      const boxRatio = boxW / boxH;

      let drawW = boxW;
      let drawH = boxH;
      let drawX = boxX;
      let drawY = boxY;

      if (imgRatio > boxRatio) {
        // Wider image: fit width, center vertically
        drawW = boxW;
        drawH = boxW / imgRatio;
        drawY = boxY + (boxH - drawH) / 2;
      } else {
        // Taller image: fit height, center horizontally
        drawH = boxH;
        drawW = boxH * imgRatio;
        drawX = boxX + (boxW - drawW) / 2;
      }

      p2.drawImage(photoImg, {
        x: drawX,
        y: drawY,
        width: drawW,
        height: drawH,
      });
    }

    // Signature Placement in designated frame (Page 2 Section G: x=422.8..569.8, y=200.9..280.3)
    if (sigImg) {
      p2.drawImage(sigImg, {
        x: 426.0,
        y: 206.0,
        width: 140.0,
        height: 65.0,
      });
    }

    // Place & Date
    drawTextLine(p2, formData.place, 140.0, 186.5, font, 8.0, color, 120);
    // 8 boxes starting at 467.0, step 12.76, baseline 186.5
    drawDateBoxes(p2, formData.signatureDate || formData.applicationDate, 467.0, 186.5, 12.76, font, 8.5, color);
  }

  // ==========================================
  // PAGE 3: Part II - Account Type & Banking Services
  // ==========================================
  if (pages.length >= 3) {
    const p3 = pages[2];

    // Top Right Date: 8 boxes starting at 444.5, step 12.75, baseline 734.5
    drawDateBoxes(p3, formData.applicationDate, 444.5, 734.5, 12.75, font, 8.5, color);

    // Office Use Only section:
    // First Applicant Customer ID: 16 boxes starting at 104.4, step 12.76, baseline 722.2
    drawLetterBoxes(p3, formData.customerId, 104.4, 722.2, 12.76, font, 8.5, color, 16);

    // Account No.: 16 boxes starting at 104.4, step 12.76, baseline 692.6
    drawLetterBoxes(p3, formData.accountNumber, 104.4, 692.6, 12.76, font, 8.5, color, 16);

    // Section A. Type of A/C checkboxes (y = 644.5):
    // Savings (25.5), BSBDA (104.0), Small (144.5), Current (225.5), Fixed Deposit (322.0), Savings Plus (504.0)
    drawCheckmark(p3, 25.5, 644.5, formData.accountCategory === 'savings', color);
    drawCheckmark(p3, 104.0, 644.5, formData.accountCategory === 'bsbda', color);
    drawCheckmark(p3, 144.5, 644.5, formData.accountCategory === 'small', color);
    drawCheckmark(p3, 225.5, 644.5, formData.accountCategory === 'current', color);
    drawCheckmark(p3, 322.0, 644.5, formData.accountCategory === 'fixed_deposit', color);
    drawCheckmark(p3, 504.0, 644.5, formData.accountCategory === 'savings_plus', color);

    // Section B. Mode of Operation checkboxes (y = 602.5):
    // Self (25.5), Either or Survivor (104.4), Former or Survivor (195.0), Any one or Survivor (284.5), Jointly (381.8)
    drawCheckmark(p3, 25.5, 602.5, formData.modeOfOperation === 'self', color);
    drawCheckmark(p3, 104.4, 602.5, formData.modeOfOperation === 'either_or_survivor', color);
    drawCheckmark(p3, 195.0, 602.5, formData.modeOfOperation === 'former_or_survivor', color);
    drawCheckmark(p3, 284.5, 602.5, formData.modeOfOperation === 'any_one', color);
    drawCheckmark(p3, 381.8, 602.5, formData.modeOfOperation === 'jointly', color);

    // Section C. Services Required
    // ATM-CUM-DEBIT Card 1st Applicant: Yes (104.4, y=551.5), No (135.0, y=551.5)
    drawCheckmark(p3, 104.4, 551.5, formData.atmCardRequired, color);
    drawCheckmark(p3, 135.0, 551.5, !formData.atmCardRequired, color);

    if (formData.atmCardRequired) {
      // 19 individual square boxes starting at 179.5, step 12.75, baseline 554.0 (one alphabet per box)
      drawLetterBoxes(p3, formData.nameOnCard, 179.5, 554.0, 12.75, font, 7.5, color, 19);

      // Format (1st Applicant column at x=493.2): Physical (y=554.8), Virtual (y=544.1)
      drawCheckmark(p3, 493.2, 554.8, formData.cardFormat === 'physical', color);
      drawCheckmark(p3, 493.2, 544.1, formData.cardFormat === 'virtual', color);

      // Card Scheme (1st Applicant column at x=493.2): RuPay (y=531.9), Visa (y=520.2), Master (y=508.4)
      drawCheckmark(p3, 493.2, 531.9, formData.cardType === 'rupay', color);
      drawCheckmark(p3, 493.2, 520.2, formData.cardType === 'visa', color);
      drawCheckmark(p3, 493.2, 508.4, formData.cardType === 'master', color);
    }

    // Cheque Book: Yes (101.3), No (125.7) @ y=490.5
    drawCheckmark(p3, 101.3, 490.5, formData.chequeBookRequired, color);
    drawCheckmark(p3, 125.7, 490.5, !formData.chequeBookRequired, color);

    // Internet Banking (1st Applicant): Yes (101.3), No (125.7) @ y=445.5
    drawCheckmark(p3, 101.3, 445.5, formData.internetBankingRequired, color);
    drawCheckmark(p3, 125.7, 445.5, !formData.internetBankingRequired, color);

    // Right column services (items 4 to 10):
    // SMS Alerts: Yes (465.4), No (511.6) @ y=492.0
    drawCheckmark(p3, 465.4, 492.0, formData.smsAlertsRequired, color);
    drawCheckmark(p3, 511.6, 492.0, !formData.smsAlertsRequired, color);

    // INB (YONO Web): Yes (465.4), No (511.6) @ y=478.0
    drawCheckmark(p3, 465.4, 478.0, formData.internetBankingRequired, color);
    drawCheckmark(p3, 511.6, 478.0, !formData.internetBankingRequired, color);

    // MOBILE BANKING: Yes (465.4), No (511.6) @ y=464.0
    drawCheckmark(p3, 465.4, 464.0, formData.mobileBankingRequired, color);
    drawCheckmark(p3, 511.6, 464.0, !formData.mobileBankingRequired, color);

    // PASSBOOK: Yes (465.4), No (511.6) @ y=450.5
    drawCheckmark(p3, 465.4, 450.5, formData.passbookRequired, color);
    drawCheckmark(p3, 511.6, 450.5, !formData.passbookRequired, color);

    // e-Statement: Required (465.4), Not Required (511.6) @ y=436.5
    drawCheckmark(p3, 465.4, 436.5, formData.eStatementRequired, color);
    drawCheckmark(p3, 511.6, 436.5, !formData.eStatementRequired, color);

    // WhatsApp: Yes (465.4), No (511.6) @ y=422.8
    drawCheckmark(p3, 465.4, 422.8, formData.whatsappAlertsRequired, color);
    drawCheckmark(p3, 511.6, 422.8, !formData.whatsappAlertsRequired, color);

    // Email Alerts: Yes (465.4), No (511.6) @ y=409.0
    drawCheckmark(p3, 465.4, 409.0, formData.emailAlertsRequired, color);
    drawCheckmark(p3, 511.6, 409.0, !formData.emailAlertsRequired, color);

    if (formData.hasTermDeposit) {
      drawTextLine(p3, formData.termDepositAmount, 105.0, 335.0, font, 7.5, color, 120);
      drawTextLine(p3, formData.termDepositAmountInWords, 280.0, 335.0, font, 7.0, color, 250);
      drawTextLine(p3, formData.termDepositYears, 115.0, 318.0, font, 7.5, color, 30);
      drawTextLine(p3, formData.termDepositMonths, 195.0, 318.0, font, 7.5, color, 30);
      drawTextLine(p3, formData.termDepositDays, 275.0, 318.0, font, 7.5, color, 30);
    }
  }

  // ==========================================
  // PAGE 4: Section F (Nomination) & Section G (Declaration)
  // ==========================================
  if (pages.length >= 4) {
    const p4 = pages[3];

    // Section F. Nomination:
    // "I/ we do not want to nominate any person in this account": checkbox at x=25.3, y=295.1
    drawCheckmark(p4, 25.3, 295.1, !formData.nominationOpted, color);

    if (formData.nominationOpted) {
      drawTextLine(
        p4,
        formData.depositorName || `${formData.firstName} ${formData.lastName}`,
        120.0,
        628.0,
        font,
        7.5,
        color,
        350
      );

      // Nominee Details Row 1 (baseline 568.5)
      drawTextLine(p4, formData.nomineeName, 58.0, 568.5, font, 7.5, color, 120);
      drawTextLine(p4, formData.nomineeAddress, 180.0, 568.5, font, 6.5, color, 105);
      drawTextLine(p4, formData.nomineeMobile, 295.0, 568.5, font, 7.2, color, 60);
      drawTextLine(p4, formData.nomineeRelationship, 360.0, 568.5, font, 7.2, color, 50);
      drawTextLine(p4, formData.nomineeAge, 415.0, 568.5, font, 7.5, color, 35);
      drawTextLine(p4, formData.nomineeProportion || '100%', 535.0, 568.5, font, 7.5, color, 30);

      if (formData.nomineeIsMinor && formData.guardianName) {
        drawTextLine(p4, formData.nomineeName, 58.0, 440.0, font, 7.2, color, 90);
        drawTextLine(p4, formData.guardianName, 155.0, 440.0, font, 7.2, color, 85);
        drawTextLine(p4, formData.guardianRelationship, 245.0, 440.0, font, 7.2, color, 65);
        drawTextLine(p4, formData.guardianAddress, 315.0, 440.0, font, 6.5, color, 120);
        drawTextLine(p4, formData.guardianMobile, 445.0, 440.0, font, 7.0, color, 80);
      }
    }

    // Signature in Nomination Form
    if (sigImg) {
      p4.drawImage(sigImg, {
        x: 65.0,
        y: 345.0,
        width: 125.0,
        height: 38.0,
      });
    }

    // Date: 8 boxes starting at 380.0, step 12.80, baseline 309.5
    drawDateBoxes(p4, formData.signatureDate || formData.applicationDate, 380.0, 309.5, 12.80, font, 8.5, color);
    drawTextLine(p4, formData.place, 520.0, 309.5, font, 7.5, color, 60);

    // Section G. Declaration Cum Undertaking:
    drawTextLine(p4, formData.place, 68.0, 178.0, font, 7.5, color, 80);
    // Date: 8 boxes starting at 57.0, step 12.80, baseline 163.0
    drawDateBoxes(p4, formData.signatureDate || formData.applicationDate, 57.0, 163.0, 12.80, font, 8.5, color);

    if (sigImg) {
      p4.drawImage(sigImg, {
        x: 195.0,
        y: 145.0,
        width: 125.0,
        height: 38.0,
      });
    }
  }

  // ==========================================
  // PAGE 5: Terms & Conditions & Acknowledgement
  // ==========================================
  if (pages.length >= 5) {
    const p5 = pages[4];

    if (sigImg) {
      p5.drawImage(sigImg, {
        x: 65.0,
        y: 95.0,
        width: 130.0,
        height: 38.0,
      });
    }

    // Acknowledgement Receipt of Nomination:
    // Retain only "Received Nomination Form from..." (depositor name).
    // Account Number, Registration No., and Branch Official Date/Signature are left blank for the branch official.
    const depositor = formData.depositorName || `${formData.firstName} ${formData.lastName}`;
    drawTextLine(p5, depositor, 140.0, 71.5, font, 7.5, color, 280);
  }

  // ==========================================
  // PAGE 7: Form 97 & FATCA Declaration
  // ==========================================
  if (pages.length >= 7) {
    const p7 = pages[6];

    // Form 97: Annexure - I (In case PAN is not available)
    // 1. NAME (SAME AS ID PROOF): 37 individual character boxes starting at 82.75, step 12.85, baseline 727.75
    const fullName = [formData.firstName, formData.middleName, formData.lastName].filter(Boolean).join(' ');
    if (fullName) {
      drawLetterBoxes(p7, fullName, 82.75, 727.75, 12.85, font, 8.0, color, 37);
    }

    // 2. Date of application: 8 boxes starting at 83.1, step 12.76, baseline 682.1
    if (formData.applicationDate) {
      drawDateBoxes(p7, formData.applicationDate, 83.1, 682.1, 12.76, font, 8.5, color);
    }

    // 3. Date of Birth Proof: 13 boxes starting at 108.3, step 12.76, baseline 659.7
    if (formData.dob) {
      drawLetterBoxes(p7, formData.dob.replace(/\D/g, ''), 108.3, 659.7, 12.76, font, 8.5, color, 13);
    }

    // 4. Document Identification number: 13 boxes starting at 108.3, step 12.76, baseline 642.3
    if (formData.idDocumentNo) {
      drawLetterBoxes(p7, formData.idDocumentNo.replace(/\s+/g, ''), 108.3, 642.3, 12.76, font, 8.0, color, 13);
    }

    // Name of authority issuing document: 13 boxes starting at 392.5, step 12.76, baseline 659.7
    if (formData.idIssuedBy) {
      drawLetterBoxes(p7, formData.idIssuedBy, 392.5, 659.7, 12.76, font, 8.0, color, 13);
    }

    // Verification section:
    if (fullName) {
      drawTextLine(p7, fullName, 45.0, 608.0, font, 7.5, color, 120);
    }
    const fatherName = [formData.relativeFirstName, formData.relativeMiddleName, formData.relativeLastName].filter(Boolean).join(' ');
    if (fatherName) {
      drawTextLine(p7, fatherName, 245.0, 608.0, font, 7.5, color, 115);
    }

    // Verification Date & Signature:
    drawTextLine(p7, formData.signatureDate || formData.applicationDate, 55.0, 560.5, font, 7.5, color, 80);
    if (sigImg) {
      p7.drawImage(sigImg, {
        x: 375.0,
        y: 545.0,
        width: 120.0,
        height: 35.0,
      });
    }

    // POI checkboxes on Page 7 (Form 97 / Related person POI at y=405.0):
    // A-Passport (28.5), B-Voter (104.4), C-Driving (214.3), D-Aadhaar (302.0)
    drawCheckmark(p7, 28.5, 405.0, formData.idProofType === 'passport', color);
    drawCheckmark(p7, 104.4, 405.0, formData.idProofType === 'voter', color);
    drawCheckmark(p7, 214.3, 405.0, formData.idProofType === 'driving', color);
    drawCheckmark(p7, 302.0, 405.0, formData.idProofType === 'aadhaar', color);

    // Place/City of Birth: 13 boxes starting at 82.8, step 12.75, baseline 297.5
    drawLetterBoxes(p7, formData.cityOfBirth || formData.cityVillage, 82.8, 297.5, 12.75, font, 7.5, color, 13);
    // Country of Birth: 19 boxes starting at 317.6, step 12.75, baseline 297.5
    drawLetterBoxes(p7, formData.countryOfBirth || 'INDIA', 317.6, 297.5, 12.75, font, 7.5, color, 19);

    // Multiple Tax Residency Table Row 1 (y = 260.0):
    if (formData.taxResidenceIndiaOnly === 'yes') {
      drawTextLine(p7, 'INDIA', 88.0, 260.0, font, 7.5, color, 75);
      drawTextLine(p7, formData.pan ? `${formData.pan} (PAN)` : 'RESIDENT', 175.0, 260.0, font, 7.5, color, 180);
      drawTextLine(p7, 'INDIA', 368.0, 260.0, font, 7.5, color, 140);
    } else if (formData.foreignTaxResidence) {
      drawTextLine(p7, formData.foreignTaxResidence, 88.0, 260.0, font, 7.5, color, 75);
      drawTextLine(p7, formData.foreignTin || 'N/A', 175.0, 260.0, font, 7.5, color, 180);
      drawTextLine(p7, formData.foreignTaxResidence, 368.0, 260.0, font, 7.5, color, 140);
    }

    // FATCA / CRS Address Section (Page 7 bottom):
    // Address Row 1: 38 individual boxes starting at 82.75, step 12.76, baseline 191.6
    if (formData.addressLine1) {
      drawLetterBoxes(p7, formData.addressLine1, 82.75, 191.6, 12.76, font, 7.5, color, 38);
    }
    // Address Row 2: 38 individual boxes starting at 82.75, step 12.76, baseline 175.9
    if (formData.addressLine2) {
      drawLetterBoxes(p7, formData.addressLine2, 82.75, 175.9, 12.76, font, 7.5, color, 38);
    }

    // City / Village*: 14 boxes starting at 82.5, step 12.76, baseline 161.4
    if (formData.cityVillage) {
      drawLetterBoxes(p7, formData.cityVillage, 82.5, 161.4, 12.76, font, 7.5, color, 14);
    }

    // State*: 14 boxes starting at 312.1, step 12.76, baseline 161.4
    if (formData.state) {
      drawLetterBoxes(p7, formData.state, 312.1, 161.4, 12.76, font, 7.5, color, 14);
    }

    // Country Name*: 14 boxes starting at 82.5, step 12.76, baseline 146.6
    drawLetterBoxes(p7, formData.country || formData.countryName || 'INDIA', 82.5, 146.6, 12.76, font, 7.5, color, 14);

    // ZIP / Post Code*: 14 boxes starting at 312.1, step 12.76, baseline 146.6
    if (formData.pincode) {
      drawLetterBoxes(p7, formData.pincode, 312.1, 146.6, 12.76, font, 8.0, color, 14);
    }

    // Place & Date
    if (formData.place) {
      drawTextLine(p7, formData.place, 68.0, 129.0, font, 7.5, color, 120);
    }
    drawTextLine(p7, formData.signatureDate || formData.applicationDate, 68.0, 114.0, font, 7.5, color, 120);

    // Signature Box: x=312.1..490.7, y=101.8..134.5
    if (sigImg) {
      p7.drawImage(sigImg, {
        x: 325.0,
        y: 104.0,
        width: 150.0,
        height: 28.0,
      });
    }
  }
}
