import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { SbiFormData, InkColor } from '../types/formTypes';
import { getInkRgb } from './sbiOverlay';
import { fetchAssetBytes } from './assetHelper';

const ATM_FORM_IMAGE_PATH = '/assets/aistudio/image_4197a1e_13d713a5.png';

// In-memory cache for the generated base PDF bytes to ensure instantaneous preview
let cachedAtmBasePdfBytes: Uint8Array | null = null;

// Exact box center X coordinates measured from the high-resolution Form AR-35 template
const EMBOSSED_BOX_CENTERS = [
  144, 183, 222, 261, 300.5, 341, 381, 421, 459.5, 498, 537, 576, 615.5, 656.5, 697.5, 737, 775.5, 814.5, 853,
];

const DOB_BOX_CENTERS = [336, 377, 419, 459, 499, 539, 579, 620];

const ADDR_COL_CENTERS = [
  295, 337, 379, 420.5, 461, 501.5, 542, 582.5, 624, 666.5, 709, 750, 790.5, 831.5, 863.5,
];

const ACC_NUM_BOX_CENTERS = [
  285.5, 313, 341.5, 370, 397.5, 424.5, 451.5, 478.5, 505, 531.5, 558.5, 585.5, 613, 641, 669.5, 697.5, 725,
  752, 778.5, 805, 831.5, 859.5,
];

/**
 * Creates or retrieves the base 1-page PDF document embedding the high-resolution
 * Bank of Maharashtra Mahabank VISA Debit Card Form AR-35 image with a clean white
 * backing rectangle.
 */
export async function getAtmBasePdf(): Promise<Uint8Array> {
  if (cachedAtmBasePdfBytes) {
    return cachedAtmBasePdfBytes;
  }

  const imgBytes = await fetchAssetBytes(ATM_FORM_IMAGE_PATH);

  const doc = await PDFDocument.create();
  // Standard A4 width 595.28 pt, height scaled exactly to 896:1200 aspect ratio = 797.25 pt
  const page = doc.addPage([595.28, 797.25]);

  // Clean white backing rectangle to eliminate transparency/alpha issues
  page.drawRectangle({
    x: 0,
    y: 0,
    width: 595.28,
    height: 797.25,
    color: rgb(1, 1, 1),
  });

  const pngImage = await doc.embedPng(imgBytes);
  page.drawImage(pngImage, {
    x: 0,
    y: 0,
    width: 595.28,
    height: 797.25,
  });

  cachedAtmBasePdfBytes = await doc.save();
  return cachedAtmBasePdfBytes;
}

/**
 * Overlays all user-filled form fields onto the Bank of Maharashtra ATM / Debit Card Form AR-35.
 * Calibrated with exact box center alignment:
 *   scale = 595.28 / 896 = 0.664375
 *   x_pdf = px * scale
 *   y_pdf = (1200 - py) * scale
 */
export async function applyAtmOverlay(
  pdfDoc: PDFDocument,
  formData: SbiFormData,
  inkColor: InkColor = 'blue'
) {
  const pages = pdfDoc.getPages();
  if (pages.length === 0) return;
  const page = pages[0];

  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontNormal = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const color = getInkRgb(inkColor);

  const scale = 595.28 / 896;
  const toPdf = (px: number, py: number) => ({
    x: px * scale,
    y: (1200 - py) * scale,
  });

  // Helper: Draw single text string with auto size reduction if over maxW
  const drawText = (
    text: string | undefined,
    px: number,
    py: number,
    size: number = 11,
    isBold: boolean = true,
    maxW?: number
  ) => {
    if (!text || !text.trim()) return;
    const clean = text.trim();
    const font = isBold ? fontBold : fontNormal;
    let s = size;
    if (maxW) {
      let w = font.widthOfTextAtSize(clean, s);
      while (w > maxW && s > 7.5) {
        s -= 0.5;
        w = font.widthOfTextAtSize(clean, s);
      }
    }
    const pt = toPdf(px, py);
    page.drawText(clean, {
      x: pt.x,
      y: pt.y,
      size: s,
      font,
      color,
    });
  };

  // Helper: Draw a single character dead-center in a box
  const drawCenteredChar = (char: string, centerX: number, py: number, size: number = 11) => {
    if (!char || char === ' ') return;
    const charW = fontBold.widthOfTextAtSize(char, size);
    const pt = toPdf(centerX - (charW / 2) / scale, py);
    page.drawText(char, {
      x: pt.x,
      y: pt.y,
      size,
      font: fontBold,
      color,
    });
  };

  // Helper: Draw tick mark (slash) in a checkbox
  const drawCheck = (px: number, py: number) => {
    const pt = toPdf(px, py);
    page.drawText('/', {
      x: pt.x,
      y: pt.y,
      size: 14,
      font: fontBold,
      color,
    });
  };

  // 1. Top Right: Application No
  const appNo = formData.atmApplicationNo || '';
  if (appNo) {
    drawText(appNo, 785, 88, 10, true, 85);
  }

  // 2. Branch Name (placed right before the printed word "Branch")
  const rawBranch =
    formData.statementBranchName ||
    formData.branchName ||
    'Purna';
  const cleanBranch = rawBranch
    .replace(/\s*branch\b/gi, '')
    .replace(/,\s*.*$/, '')
    .trim()
    .toUpperCase();
  drawText(cleanBranch || 'PURNA', 145, 210, 11, true, 130);

  // 3. Date (to be filled by the customer) - 8 boxes (DDMMYYYY)
  const rawDate = (formData.atmDate || formData.applicationDate || formData.statementDate || '26102026').replace(/\D/g, '');
  const paddedDate = rawDate.padEnd(8, ' ');
  for (let i = 0; i < 8; i++) {
    if (paddedDate[i] && paddedDate[i] !== ' ') {
      const pt = toPdf(724 + i * 20.3, 240);
      page.drawText(paddedDate[i], {
        x: pt.x,
        y: pt.y,
        size: 11,
        font: fontBold,
        color,
      });
    }
  }

  // 4. FULL NAME OF APPLICANT (SURNAME | FIRST NAME | MIDDLE NAME)
  const surname = (formData.lastName || 'SHARMA').toUpperCase();
  const firstName = (formData.firstName || 'RAJESH').toUpperCase();
  const middleName = (formData.middleName || 'KUMAR').toUpperCase();
  drawText(surname, 150, 335, 11.5, true, 220);
  drawText(firstName, 410, 335, 11.5, true, 240);
  drawText(middleName, 680, 335, 11.5, true, 200);

  // 5. 1. NAME TO BE EMBOSSED ON THE CARD (not exceed 19 characters)
  // Perfectly centered inside each of the 19 boxes
  const defaultEmbossed = `${firstName} ${middleName ? middleName[0] + ' ' : ''}${surname}`.trim();
  const embossed = (formData.atmEmbossedName || formData.nameOnCard || defaultEmbossed).toUpperCase().slice(0, 19);
  for (let i = 0; i < embossed.length; i++) {
    if (embossed[i] && embossed[i] !== ' ' && EMBOSSED_BOX_CENTERS[i]) {
      drawCenteredChar(embossed[i], EMBOSSED_BOX_CENTERS[i], 375, 11);
    }
  }

  // 6. 2. Date of birth (DD-MM-YYYY) & Sex
  // Perfectly centered inside the 8 DOB boxes
  const rawDob = (formData.atmDob || formData.dob || '15081990').replace(/\D/g, '');
  const paddedDob = rawDob.padEnd(8, ' ');
  for (let i = 0; i < 8; i++) {
    if (paddedDob[i] && paddedDob[i] !== ' ' && DOB_BOX_CENTERS[i]) {
      drawCenteredChar(paddedDob[i], DOB_BOX_CENTERS[i], 393, 11);
    }
  }

  // Sex checkbox: Male (px = 788) or Female (px = 826)
  const gender = formData.atmGender || (formData.gender === 'female' ? 'female' : 'male');
  if (gender === 'female') {
    drawCheck(826, 393);
  } else {
    drawCheck(788, 393);
  }

  // 7. 3. ADDRESS FOR COMMUNICATION AS PER THE BANK RECORDS
  const addr1 = (formData.addressLine1 || 'FLAT 402, SEA GREEN APARTMENTS').toUpperCase();
  const addr2 = (formData.addressLine2 || 'MARINE DRIVE, NARIMAN POINT').toUpperCase();
  const city = (formData.cityVillage || 'MUMBAI').toUpperCase();
  const state = (formData.state || 'MAHARASHTRA').toUpperCase();
  const pin = (formData.pincode || '400020').replace(/\D/g, '');
  const tel = (formData.telNo || '022-22819000').toUpperCase();
  const mobile = (formData.mobileNumber || '9820145679').replace(/\D/g, '');
  const email = (formData.emailId || 'rajesh.sharma@example.com').toLowerCase();

  // Address lines (Rows 1 to 4)
  drawText(addr1, 285, 448, 10.5, true, 580);
  drawText(addr2, 285, 469, 10.5, true, 580);
  drawText(city, 285, 489, 10.5, true, 580);
  drawText(state, 285, 510, 10.5, true, 580);

  // PIN Code: 6 digits centered inside first 6 columns
  for (let i = 0; i < Math.min(pin.length, 6); i++) {
    drawCenteredChar(pin[i], ADDR_COL_CENTERS[i], 532, 11);
  }

  // STD Code & Tel No: Row 6
  drawText(tel, 285, 555, 10.5, true, 580);

  // Mobile No: 10 digits centered inside first 10 columns
  for (let i = 0; i < Math.min(mobile.length, 10); i++) {
    drawCenteredChar(mobile[i], ADDR_COL_CENTERS[i], 578, 11);
  }

  // Email: Row 8
  drawText(email, 285, 601, 10, true, 580);

  // 8. A PRIMARY ACCOUNT DETAILS
  const titleA = (formData.primaryAccountTitle || `${firstName} ${middleName} ${surname}`.trim()).toUpperCase();
  drawText(titleA, 310, 661, 11, true, 560);

  // Account Type tick: Saving (286), Current (533), Staff CC (710)
  const accTypeA = formData.primaryAccountType || 'savings';
  if (accTypeA === 'savings') {
    drawCheck(286, 698);
  } else if (accTypeA === 'current') {
    drawCheck(533, 698);
  } else if (accTypeA === 'staff_cc') {
    drawCheck(710, 698);
  }

  // Scheme Code inside the box under SCHEME CODE
  const schemeA = (formData.primarySchemeCode || 'SB101').toUpperCase();
  const schemeW = fontBold.widthOfTextAtSize(schemeA, 10);
  const schemePt = toPdf(820 - (schemeW / 2) / scale, 717);
  page.drawText(schemeA, {
    x: schemePt.x,
    y: schemePt.y,
    size: 10,
    font: fontBold,
    color,
  });

  // Account Number: 17 digits centered in each of the 17 boxes
  const accNumA = (formData.primaryAccountNumber || formData.accountNumber || '60123456789').replace(/\D/g, '');
  for (let i = 0; i < Math.min(accNumA.length, 17); i++) {
    if (ACC_NUM_BOX_CENTERS[i]) {
      drawCenteredChar(accNumA[i], ACC_NUM_BOX_CENTERS[i], 738, 11);
    }
  }

  // Balance & Operating Instructions
  const balA = formData.primaryBalance ? `Rs. ${formData.primaryBalance}` : 'Rs. 75,000.00';
  drawText(balA, 350, 760, 10.5, true, 180);

  const opInstA = (formData.primaryOperatingInstructions || 'SELF').toUpperCase();
  drawText(opInstA, 750, 760, 10.5, true, 180);

  // Joint Holders
  if (formData.primaryJointHolder1) {
    drawText(formData.primaryJointHolder1.toUpperCase(), 370, 782, 9.5, true, 460);
    const addOn1 = formData.primaryAddOnCard1 === 'yes' ? 'YES' : 'NO';
    drawText(addOn1, 880, 782, 9.5, true, 30);
  }
  if (formData.primaryJointHolder2) {
    drawText(formData.primaryJointHolder2.toUpperCase(), 370, 807, 9.5, true, 460);
    const addOn2 = formData.primaryAddOnCard2 === 'yes' ? 'YES' : 'NO';
    drawText(addOn2, 880, 807, 9.5, true, 30);
  }

  // 9. B SECONDARY ACCOUNT DETAILS (if provided)
  if (formData.secondaryAccountNumber) {
    if (formData.secondaryAccountTitle) {
      drawText(formData.secondaryAccountTitle.toUpperCase(), 310, 855, 11, true, 560);
    }
    const accTypeB = formData.secondaryAccountType || 'current';
    if (accTypeB === 'savings') drawCheck(286, 888);
    else if (accTypeB === 'current') drawCheck(533, 888);
    else if (accTypeB === 'staff_cc') drawCheck(710, 888);

    if (formData.secondarySchemeCode) {
      const schemeB = formData.secondarySchemeCode.toUpperCase();
      const sW = fontBold.widthOfTextAtSize(schemeB, 10);
      const sPt = toPdf(820 - (sW / 2) / scale, 907);
      page.drawText(schemeB, {
        x: sPt.x,
        y: sPt.y,
        size: 10,
        font: fontBold,
        color,
      });
    }

    const accNumB = formData.secondaryAccountNumber.replace(/\D/g, '');
    for (let i = 0; i < Math.min(accNumB.length, 17); i++) {
      if (ACC_NUM_BOX_CENTERS[i]) {
        drawCenteredChar(accNumB[i], ACC_NUM_BOX_CENTERS[i], 928, 11);
      }
    }

    if (formData.secondaryBalance) {
      drawText(`Rs. ${formData.secondaryBalance}`, 350, 950, 10.5, true, 180);
    }
    if (formData.secondaryOperatingInstructions) {
      drawText(formData.secondaryOperatingInstructions.toUpperCase(), 750, 950, 10.5, true, 180);
    }
    if (formData.secondaryJointHolder1) {
      drawText(formData.secondaryJointHolder1.toUpperCase(), 370, 975, 9.5, true, 460);
    }
    if (formData.secondaryJointHolder2) {
      drawText(formData.secondaryJointHolder2.toUpperCase(), 370, 1000, 9.5, true, 460);
    }
  }

  // 10. APPLICANT SIGNATURE (Bottom Right)
  if (formData.signatureDataUrl && formData.signatureDataUrl.startsWith('data:image/')) {
    try {
      const base64Data = formData.signatureDataUrl.split(',')[1];
      const sigBytes = Uint8Array.from(atob(base64Data), (c) => c.charCodeAt(0));
      const sigImage = await pdfDoc.embedPng(sigBytes);
      const sigPt = toPdf(700, 1050);
      page.drawImage(sigImage, {
        x: sigPt.x,
        y: sigPt.y,
        width: 120,
        height: 38,
      });
    } catch {
      drawText(`${firstName} ${surname}`, 730, 1050, 10.5, true, 140);
    }
  } else {
    drawText(`${firstName} ${surname}`, 720, 1050, 11, true, 150);
  }
}
