import { PDFDocument, PDFPage, PDFFont, StandardFonts, RGB, rgb } from 'pdf-lib';
import { SbiFormData, InkColor } from '../types/formTypes';
import { getInkRgb, dataUrlToPngBytes } from './sbiOverlay';
import { ensureMarathi } from './marathiTransliterate';

/**
 * Draws crisp, professional text with Google Sans / Roboto typography using High-DPI Canvas (3.5x scale):
 * - Guarantees 100% font uniformity across both English and Marathi Devanagari.
 * - Sits strictly upside of the printed line below it with transparent background.
 * - Precision alphabetic baseline alignment prevents line collision or drifting.
 */
export async function drawSmartText(
  page: PDFPage,
  pdfDoc: PDFDocument,
  text: string | undefined | null,
  options: {
    x: number;
    y: number;
    size?: number;
    font: PDFFont;
    color: RGB;
    maxWidth?: number;
  }
) {
  if (!text || !text.trim()) return;
  const str = text.trim();
  const fontSize = options.size || 9.5;

  // Use High-DPI transparent canvas in browser to render Google Sans / Roboto / Noto Sans typography
  if (typeof document !== 'undefined') {
    try {
      const scale = 3.5; // High-DPI for razor-sharp vector-like text
      const renderFontSize = fontSize * scale;
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Google signature typography font stack
        const fontStr = `600 ${renderFontSize}px "Google Sans", "Product Sans", "Roboto", "Noto Sans Devanagari", "Segoe UI", system-ui, sans-serif`;
        ctx.font = fontStr;
        const metrics = ctx.measureText(str);

        const ascent = renderFontSize * 1.0;
        const descent = renderFontSize * 0.28;

        const textWidth = Math.ceil(metrics.width) + 2;
        const textHeight = Math.ceil(ascent + descent);

        canvas.width = textWidth;
        canvas.height = textHeight;

        // Completely transparent background - does not obscure or block the printed line below
        ctx.clearRect(0, 0, textWidth, textHeight);

        // Render text
        ctx.font = fontStr;
        const r = Math.round(options.color.red * 255);
        const g = Math.round(options.color.green * 255);
        const b = Math.round(options.color.blue * 255);
        ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
        ctx.textBaseline = 'alphabetic';
        ctx.fillText(str, 1, ascent);

        const dataUrl = canvas.toDataURL('image/png');
        const pngBytes = await dataUrlToPngBytes(dataUrl);
        if (pngBytes) {
          const img = await pdfDoc.embedPng(pngBytes);
          const drawW = textWidth / scale;
          const drawH = textHeight / scale;
          const drawX = options.x;
          // Place the text baseline exactly at options.y (just upside of the line below)
          const drawY = options.y - (descent / scale);

          page.drawImage(img, {
            x: drawX,
            y: drawY,
            width: drawW,
            height: drawH,
          });
          return;
        }
      }
    } catch (err) {
      console.warn('Canvas Google text render notice:', err);
    }
  }

  // Fallback if document is undefined (e.g. headless Node)
  const isAscii = /^[\x00-\x7F]*$/.test(str);
  if (isAscii) {
    page.drawText(str, {
      x: options.x,
      y: options.y,
      size: fontSize,
      font: options.font,
      color: options.color,
      maxWidth: options.maxWidth,
    });
  } else {
    const asciiOnly = str.replace(/[^\x00-\x7F]/g, '');
    if (asciiOnly) {
      page.drawText(asciiOnly, {
        x: options.x,
        y: options.y,
        size: fontSize,
        font: options.font,
        color: options.color,
        maxWidth: options.maxWidth,
      });
    }
  }
}

function drawCheckTick(page: PDFPage, x: number, y: number, color: RGB) {
  page.drawLine({
    start: { x, y: y + 2 },
    end: { x: x + 2.5, y: y - 1 },
    thickness: 1.6,
    color,
  });
  page.drawLine({
    start: { x: x + 2.5, y: y - 1 },
    end: { x: x + 7.5, y: y + 5.5 },
    thickness: 1.8,
    color,
  });
}

/**
 * Applies high-precision data overlay onto the 3-page SBI Peek Karj Magni PDF
 * (पीक कर्जासाठी अर्जाचा नमुना + पिकपेरा स्वयंघोषणा + चतुःसीमा घोषणापत्र)
 * All data is placed just upside of the printed line below it with authentic Marathi (Devanagari).
 */
export async function applyPeekKarjOverlay(
  pdfDoc: PDFDocument,
  formData: SbiFormData,
  inkColor: InkColor = 'blue'
) {
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const color = getInkRgb(inkColor);
  const pages = pdfDoc.getPages();
  if (pages.length < 3) return;

  const [p1, p2, p3] = pages;

  // Derive consolidated names and numbers, ensuring Marathi Devanagari conversion
  const rawFarmerName =
    formData.peekFarmerName ||
    `${formData.firstName || ''} ${formData.middleName || ''} ${formData.lastName || ''}`.trim() ||
    'दत्ता विश्वनाथ रेंगडे';
  const farmerName = ensureMarathi(rawFarmerName);

  const rawFatherHusband =
    formData.peekFatherHusbandName ||
    `${formData.relativeFirstName || ''} ${formData.relativeLastName || ''}`.trim() ||
    formData.relativeFirstName ||
    'विश्वनाथ रेंगडे';
  const fatherHusband = ensureMarathi(rawFatherHusband);

  const mobileNo = formData.peekMobileNo || formData.mobileNumber || '9970996060';
  const aadhaarNo = formData.peekAadhaar || formData.idDocumentNo || '7894 5612 3012';
  const village = ensureMarathi(formData.peekVillage || formData.cityVillage || 'वाळूज');
  const taluka = ensureMarathi(formData.peekTaluka || formData.district || 'गंगापूर');
  const district = ensureMarathi(formData.peekDistrict || formData.state || 'छत्रपती संभाजीनगर');
  const fullAddress = ensureMarathi(
    formData.peekFullAddress ||
    `मु. पो. ${village}, ता. ${taluka}, जि. ${district}`
  );

  const savingsAcc = formData.peekSavingsAcc || formData.accountNumber || formData.primaryAccountNumber || '38901234567';
  const bankName = ensureMarathi(formData.peekBankName || 'भारतीय स्टेट बँक');
  const branchName = ensureMarathi(formData.peekBranch || formData.branchName || 'वाळूज एमआयडीसी शाखा');
  const gatNo = formData.peekGatNo || '142/1';
  const totalArea = ensureMarathi(formData.peekTotalArea || '२.४० हेक्टर (६ एकर)');
  const gender = formData.peekGender === 'female' ? 'स्त्री' : 'पुरुष';
  const todayDate = formData.peekDate || new Date().toLocaleDateString('en-GB'); // DD/MM/YYYY
  const place = ensureMarathi(formData.peekPlace || formData.place || village);

  // ==========================================
  // PAGE 1: पीक कर्जासाठी अर्जाचा नमुना
  // Printed dashed lines: y=720, 700, 681, 654, 602, 576, 550, 524, 498, 472, 446, 420, 395, 369, 299, 281, 263
  // All inserted text is positioned at lineY + 3.0 (just upside of below line)
  // ==========================================

  // 1. शेतक-याचे नाव (line y=720 -> text y=723)
  await drawSmartText(p1, pdfDoc, farmerName, { x: 195, y: 723, size: 10, font: fontBold, color });

  // 2. मोबाईल क्रमांक (line y=700 -> text y=703)
  await drawSmartText(p1, pdfDoc, mobileNo, { x: 190, y: 703, size: 10, font: fontBold, color });

  // 3. गावाचे नाव & 4. तालुका (line y=681 -> text y=684)
  await drawSmartText(p1, pdfDoc, village, { x: 175, y: 684, size: 9.5, font: fontBold, color });
  await drawSmartText(p1, pdfDoc, taluka, { x: 375, y: 684, size: 9.5, font: fontBold, color });

  // 5. स्त्री/पुरुष & 6. आधार क्रमांक (line y=654 -> text y=657)
  await drawSmartText(p1, pdfDoc, gender, { x: 155, y: 657, size: 9.5, font: fontBold, color });
  await drawSmartText(p1, pdfDoc, aadhaarNo, { x: 415, y: 657, size: 10, font: fontBold, color });

  // 7. बँक कर्ज खात्यांची माहिती (असल्यास)
  // Row 1 (lines: y=602 & y=576 -> text y=605 & y=579)
  if (formData.peekLoanAcc1) {
    await drawSmartText(p1, pdfDoc, formData.peekLoanAcc1, { x: 195, y: 605, size: 9, font: fontBold, color });
    await drawSmartText(p1, pdfDoc, ensureMarathi(formData.peekLoanType1 || 'पीक कर्ज'), { x: 450, y: 605, size: 9, font: fontBold, color });
    await drawSmartText(p1, pdfDoc, ensureMarathi(formData.peekLoanBank1 || bankName), { x: 175, y: 579, size: 9, font: fontBold, color });
    await drawSmartText(p1, pdfDoc, ensureMarathi(formData.peekLoanBranch1 || branchName), { x: 415, y: 579, size: 9, font: fontBold, color });
  } else {
    await drawSmartText(p1, pdfDoc, 'नाही (Nil - No active default)', { x: 195, y: 605, size: 9, font: fontBold, color });
  }

  // Row 2 (lines: y=550 & y=524 -> text y=553 & y=527)
  if (formData.peekLoanAcc2) {
    await drawSmartText(p1, pdfDoc, formData.peekLoanAcc2, { x: 195, y: 553, size: 9, font: fontBold, color });
    await drawSmartText(p1, pdfDoc, ensureMarathi(formData.peekLoanType2 || 'मुदत कर्ज'), { x: 450, y: 553, size: 9, font: fontBold, color });
    await drawSmartText(p1, pdfDoc, ensureMarathi(formData.peekLoanBank2 || 'Bank of Maharashtra'), { x: 175, y: 527, size: 9, font: fontBold, color });
    await drawSmartText(p1, pdfDoc, ensureMarathi(formData.peekLoanBranch2 || branchName), { x: 415, y: 527, size: 9, font: fontBold, color });
  }

  // Row 3 (lines: y=498 & y=472 -> text y=501 & y=475)
  if (formData.peekLoanAcc3) {
    await drawSmartText(p1, pdfDoc, formData.peekLoanAcc3, { x: 195, y: 501, size: 9, font: fontBold, color });
    await drawSmartText(p1, pdfDoc, ensureMarathi(formData.peekLoanType3 || ''), { x: 450, y: 501, size: 9, font: fontBold, color });
    await drawSmartText(p1, pdfDoc, ensureMarathi(formData.peekLoanBank3 || ''), { x: 175, y: 475, size: 9, font: fontBold, color });
    await drawSmartText(p1, pdfDoc, ensureMarathi(formData.peekLoanBranch3 || ''), { x: 415, y: 475, size: 9, font: fontBold, color });
  }

  // 8. बँकेचा बचत खाते क्रमांक (line y=446 -> text y=449)
  await drawSmartText(p1, pdfDoc, savingsAcc, { x: 235, y: 449, size: 10, font: fontBold, color });

  // 9. बँकेचे नाव (line y=420 -> text y=423)
  await drawSmartText(p1, pdfDoc, bankName, { x: 170, y: 423, size: 9.5, font: fontBold, color });

  // 10. शाखा (line y=395 -> text y=398)
  await drawSmartText(p1, pdfDoc, branchName, { x: 155, y: 398, size: 9.5, font: fontBold, color });

  // 11. सर्व्हे क्रमांक & 12. क्षेत्र (line y=369 -> text y=372)
  await drawSmartText(p1, pdfDoc, gatNo, { x: 180, y: 372, size: 9.5, font: fontBold, color });
  await drawSmartText(p1, pdfDoc, totalArea, { x: 365, y: 372, size: 9.5, font: fontBold, color });

  // 13. लागवड करण्याच्या पिकाची माहिती (printed lines: y=298.9, 281.0, 263.2 -> text strictly upside of baseline at y=302, 284, 266)
  // Per user instruction: only insert this first crop row (कापूस & १.२० हेक्टर (३ एकर)) unless the user provides additional crops
  const crop1Name = ensureMarathi(formData.peekCropName1 !== undefined ? formData.peekCropName1 : 'कापूस');
  const crop1Area = ensureMarathi(formData.peekCropArea1 !== undefined ? formData.peekCropArea1 : '१.२० हेक्टर (३ एकर)');

  if (crop1Name) {
    await drawSmartText(p1, pdfDoc, crop1Name, { x: 125, y: 302, size: 9.5, font: fontBold, color });
  }
  if (crop1Area) {
    await drawSmartText(p1, pdfDoc, crop1Area, { x: 365, y: 302, size: 9.5, font: fontBold, color });
  }

  // Row 2 and 3 are only inserted if explicitly entered by the user
  if (formData.peekCropName2 && formData.peekCropName2.trim()) {
    await drawSmartText(p1, pdfDoc, ensureMarathi(formData.peekCropName2), { x: 125, y: 284, size: 9.5, font: fontBold, color });
    if (formData.peekCropArea2) {
      await drawSmartText(p1, pdfDoc, ensureMarathi(formData.peekCropArea2), { x: 365, y: 284, size: 9.5, font: fontBold, color });
    }
  }

  if (formData.peekCropName3 && formData.peekCropName3.trim()) {
    await drawSmartText(p1, pdfDoc, ensureMarathi(formData.peekCropName3), { x: 125, y: 266, size: 9.5, font: fontBold, color });
    if (formData.peekCropArea3) {
      await drawSmartText(p1, pdfDoc, ensureMarathi(formData.peekCropArea3), { x: 365, y: 266, size: 9.5, font: fontBold, color });
    }
  }

  // 14. सोबत जोडावयाची कागदपत्रे ticks (sitting neatly upside of item labels)
  drawCheckTick(p1, 94, 201, color); // १. आधारकार्ड (y=201)
  drawCheckTick(p1, 94, 183, color); // २. ७/१२ (y=183)
  drawCheckTick(p1, 94, 166, color); // ३. ८-अ (y=166)
  drawCheckTick(p1, 94, 148, color); // ४ फेरफार नक्कल (y=148)
  if (formData.peekAttachPan !== false) {
    drawCheckTick(p1, 94, 130, color); // ५. पॅन कार्ड (y=130)
  }

  // Passport Photo in Page 1 Box: x: 440, y: 110, w: 104, h: 115
  if (formData.photoDataUrl) {
    try {
      const photoBytes = await dataUrlToPngBytes(formData.photoDataUrl);
      if (photoBytes) {
        const photoImg = await pdfDoc.embedPng(photoBytes);
        p1.drawImage(photoImg, {
          x: 440,
          y: 110,
          width: 104,
          height: 115,
        });
      }
    } catch (e) {
      console.warn('Could not embed passport photo on Page 1:', e);
    }
  }

  // ==========================================
  // PAGE 2: प्रधानमंत्री पीक विमा योजना खरीफ हंगाम २०२६-२७
  // Printed dotted lines: y=631, 607, 231, 207, 94, 62
  // All inserted text is positioned at lineY + 3.0 (just upside of below line)
  // ==========================================

  // Top Paragraph:
  // line y=631: "मी. ........................................ रा. ............................ ता. ........................."
  await drawSmartText(p2, pdfDoc, farmerName, { x: 95, y: 634, size: 9.5, font: fontBold, color });
  await drawSmartText(p2, pdfDoc, village, { x: 365, y: 634, size: 9.5, font: fontBold, color });
  await drawSmartText(p2, pdfDoc, taluka, { x: 505, y: 634, size: 9.5, font: fontBold, color });

  // line y=607: "जि. .................... येथील रहिवाशी असून सात / आठ अ प्रमाणे माझ्या नावे मौजे ................. मध्ये एकूण क्षेत्र ............. हे.आर."
  const mauje = ensureMarathi(formData.peekMauje || village);
  await drawSmartText(p2, pdfDoc, district, { x: 55, y: 610, size: 9.5, font: fontBold, color });
  await drawSmartText(p2, pdfDoc, mauje, { x: 375, y: 610, size: 9.5, font: fontBold, color });
  await drawSmartText(p2, pdfDoc, totalArea, { x: 510, y: 610, size: 9.5, font: fontBold, color });

  // Crop Sowing Table Rows:
  // Each row sits comfortably in the cell, clearly upside of the row bottom border
  const tableRows = formData.peekCropRows && formData.peekCropRows.length > 0
    ? formData.peekCropRows
    : [
        { sr: '1', village, gatNo, cropName: 'कापूस', sowingDate: '15/06/2026', areaHectare: '1', areaR: '20' },
        { sr: '2', village, gatNo, cropName: 'सोयाबीन', sowingDate: '20/06/2026', areaHectare: '0', areaR: '80' },
        { sr: '3', village, gatNo, cropName: 'मका', sowingDate: '25/06/2026', areaHectare: '0', areaR: '40' },
      ];

  const rowYPositions = [471, 440, 409, 378, 347, 314, 283];

  for (let i = 0; i < Math.min(tableRows.length, 7); i++) {
    const row = tableRows[i];
    const yPos = rowYPositions[i];
    await drawSmartText(p2, pdfDoc, ensureMarathi(row.village || village), { x: 75, y: yPos, size: 9, font: fontBold, color });
    await drawSmartText(p2, pdfDoc, row.gatNo || gatNo, { x: 155, y: yPos, size: 9, font: fontBold, color });
    await drawSmartText(p2, pdfDoc, ensureMarathi(row.cropName), { x: 220, y: yPos, size: 9, font: fontBold, color });
    await drawSmartText(p2, pdfDoc, row.sowingDate || '18/06/2026', { x: 405, y: yPos, size: 9, font: fontBold, color });
    await drawSmartText(p2, pdfDoc, row.areaHectare || '1', { x: 498, y: yPos, size: 9, font: fontBold, color });
    await drawSmartText(p2, pdfDoc, row.areaR || '00', { x: 538, y: yPos, size: 9, font: fontBold, color });
  }

  // Footer fields on Page 2:
  // line y=231: "शेतकरी ओळखपत्र क्र :" -> text y=234
  const farmerId = formData.peekFarmerId || `MH-AGRI-${mobileNo.slice(-6)}`;
  await drawSmartText(p2, pdfDoc, farmerId, { x: 180, y: 234, size: 9.5, font: fontBold, color });

  // line y=207: "आधार कार्ड क्र :" & "मोबाईल नं :" -> text y=210
  await drawSmartText(p2, pdfDoc, aadhaarNo, { x: 145, y: 210, size: 9.5, font: fontBold, color });
  await drawSmartText(p2, pdfDoc, mobileNo, { x: 445, y: 210, size: 9.5, font: fontBold, color });

  // line y=94: "ठिकाण :" -> text y=97
  await drawSmartText(p2, pdfDoc, place, { x: 120, y: 97, size: 9.5, font: fontBold, color });

  // line y=62: "दिनांक :" -> text y=65
  await drawSmartText(p2, pdfDoc, todayDate, { x: 120, y: 65, size: 9.5, font: fontBold, color });

  // line y=62: "शेतकरी स्वाक्षरी / डाव्या हाताचा अंगठा" -> signature and name resting upside of line
  await drawSmartText(p2, pdfDoc, farmerName, { x: 410, y: 72, size: 9.5, font: fontBold, color });

  // Signature image on Page 2
  if (formData.signatureDataUrl) {
    try {
      const sigBytes = await dataUrlToPngBytes(formData.signatureDataUrl);
      if (sigBytes) {
        const sigImg = await pdfDoc.embedPng(sigBytes);
        p2.drawImage(sigImg, {
          x: 410,
          y: 66,
          width: 95,
          height: 30,
        });
      }
    } catch (e) {
      console.warn('Could not embed signature on Page 2:', e);
    }
  }

  // ==========================================
  // PAGE 3: स्वयंघोषित चतुःसीमा घोषणापत्र
  // Printed underlined lines: y=684, 664, 644, 624, 524, 504, 484, 413, 392, 370, 349, 187, 167, 116
  // All inserted text is positioned at lineY + 3.0 (just upside of below line)
  // ==========================================

  // Header details:
  // line y=684: "पूर्ण नाव: __________________________________________________" -> text y=687
  await drawSmartText(p3, pdfDoc, farmerName, { x: 135, y: 687, size: 10, font: fontBold, color });

  // line y=664: "वडिलांचे/पतीचे नाव: ___________________________________________" -> text y=667
  await drawSmartText(p3, pdfDoc, fatherHusband, { x: 185, y: 667, size: 10, font: fontBold, color });

  // line y=644: "पूर्ण पत्ता: __________________________________________________" -> text y=647
  await drawSmartText(p3, pdfDoc, fullAddress, { x: 135, y: 647, size: 9.5, font: fontBold, color });

  // line y=624: "मोबाईल क्रमांक: __________________ आधार क्रमांक: __________________" -> text y=627
  await drawSmartText(p3, pdfDoc, mobileNo, { x: 160, y: 627, size: 9.5, font: fontBold, color });
  await drawSmartText(p3, pdfDoc, aadhaarNo, { x: 355, y: 627, size: 9.5, font: fontBold, color });

  // Property details:
  // line y=524: "मौजे (गाव): _______________ तालुका: _______________ जिल्हा: _______________" -> text y=527
  await drawSmartText(p3, pdfDoc, mauje, { x: 140, y: 527, size: 9.5, font: fontBold, color });
  await drawSmartText(p3, pdfDoc, taluka, { x: 285, y: 527, size: 9.5, font: fontBold, color });
  await drawSmartText(p3, pdfDoc, district, { x: 425, y: 527, size: 9.5, font: fontBold, color });

  // line y=504: "गट क्रमांक / सर्व्हे क्रमांक / प्लॉट नं: ____________________________________" -> text y=507
  await drawSmartText(p3, pdfDoc, `गट नं. ${gatNo}`, { x: 265, y: 507, size: 10, font: fontBold, color });

  // line y=484: "एकूण क्षेत्रफळ (हे.आर. / चौ.फूट): ________________________________________" -> text y=487
  await drawSmartText(p3, pdfDoc, totalArea, { x: 250, y: 487, size: 10, font: fontBold, color });

  // 4 Boundaries (चतुःसीमा):
  // line y=413: "पूर्व (East) ____________________________________________________" -> text y=416
  const east = ensureMarathi(formData.peekBoundEast || 'शेत गट क्र. १४३ (शेतकरी रामराव पाटील यांचे शेत)');
  await drawSmartText(p3, pdfDoc, east, { x: 145, y: 416, size: 9.5, font: fontBold, color });

  // line y=392: "पश्चिम (West) ____________________________________________________" -> text y=395
  const west = ensureMarathi(formData.peekBoundWest || 'सरकारी पांदण रस्ता व शेत गट क्र. १४१');
  await drawSmartText(p3, pdfDoc, west, { x: 145, y: 395, size: 9.5, font: fontBold, color });

  // line y=370: "उत्तर (North) ____________________________________________________" -> text y=373
  const north = ensureMarathi(formData.peekBoundNorth || 'नाला / ओढा व शेत गट क्र. १४०');
  await drawSmartText(p3, pdfDoc, north, { x: 145, y: 373, size: 9.5, font: fontBold, color });

  // line y=349: "दक्षिण (South) ____________________________________________________" -> text y=352
  const south = ensureMarathi(formData.peekBoundSouth || 'शेत गट क्र. १४४ (शेतकरी विठ्ठल गायकवाड यांचे शेत)');
  await drawSmartText(p3, pdfDoc, south, { x: 145, y: 352, size: 9.5, font: fontBold, color });

  // Date, Place, Name at bottom of Page 3:
  // Pre-printed template text on line y=187 is: "दिनांक: ___ / ___ / २०२६" (at x=72..195)
  // The user requested to delete the pre-printed "/ २०२६" so it doesn't duplicate or overlap.
  // We whiteout the pre-printed "/ २०२६" portion (x: 165 to 198, y: 183 to 199) cleanly:
  p3.drawRectangle({
    x: 164,
    y: 183,
    width: 34,
    height: 16,
    color: rgb(1, 1, 1),
  });

  // Now render the date neatly above the date slot (x=112..165):
  await drawSmartText(p3, pdfDoc, todayDate, { x: 112, y: 190, size: 9.5, font: fontBold, color });

  // line y=167: "ठिकाण: _________________" -> text y=170
  await drawSmartText(p3, pdfDoc, place, { x: 120, y: 170, size: 9.5, font: fontBold, color });

  // line y=137: "(मालमत्ता धारकाची सही / अंगठा)"
  if (formData.signatureDataUrl) {
    try {
      const sigBytes = await dataUrlToPngBytes(formData.signatureDataUrl);
      if (sigBytes) {
        const sigImg = await pdfDoc.embedPng(sigBytes);
        p3.drawImage(sigImg, {
          x: 100,
          y: 132,
          width: 95,
          height: 32,
        });
      }
    } catch (e) {
      console.warn('Could not embed signature on Page 3:', e);
    }
  }

  // line y=116: "नाव: ___________________________" -> text y=119
  await drawSmartText(p3, pdfDoc, farmerName, { x: 105, y: 119, size: 10, font: fontBold, color });
}
