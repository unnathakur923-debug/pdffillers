import JSZip from 'jszip';

/**
 * Triggers a browser download of a string or Blob as a named file.
 */
export function triggerFileDownload(content: string | Blob, filename: string, mimeType = 'text/html;charset=utf-8') {
  const blob = typeof content === 'string' ? new Blob([content], { type: mimeType }) : content;
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

/**
 * Generates the complete, standalone, self-contained single-page HTML application.
 * Contains all 51+ Bank Application Letters, real-time live preview, editable fields,
 * copy to clipboard, A4 print engine, Thakur Xerox branding, and offline-compatible styles.
 */
export function generateStandaloneHtml(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>DocuFill Studio - Bank Application Letters & Forms | Thakur Xerox</title>
  <meta name="description" content="Official Bank Application Letters & Forms Generator by Thakur Xerox Center. Contact: Vinodsingh Thakur (9970996060). Generate 51+ official bank letters with instant copy, print, and PDF preview.">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
  <!-- Google AdSense -->
  <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3166168589952262" crossorigin="anonymous"></script>
  <style>
    :root {
      --primary: #047857;
      --primary-dark: #065f46;
      --primary-light: #ecfdf5;
      --accent: #d97706;
      --text: #0f172a;
      --muted: #64748b;
      --border: #cbd5e1;
      --bg: #f8fafc;
      --card-bg: #ffffff;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
      background-color: var(--bg);
      color: var(--text);
      line-height: 1.5;
    }
    header {
      background: #ffffff;
      border-bottom: 1px solid var(--border);
      position: sticky;
      top: 0;
      z-index: 50;
      box-shadow: 0 1px 3px rgba(0,0,0,0.05);
    }
    .header-inner {
      max-width: 1400px;
      margin: 0 auto;
      padding: 0.75rem 1.25rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      flex-wrap: wrap;
    }
    .brand-wrap {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
    .logo-badge {
      width: 40px;
      height: 40px;
      background: linear-gradient(135deg, #059669, #065f46);
      color: #fff;
      font-weight: 800;
      font-size: 1.25rem;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 2px 4px rgba(4,120,87,0.2);
    }
    .brand-title {
      font-weight: 800;
      font-size: 1.15rem;
      color: #0f172a;
      line-height: 1.2;
    }
    .brand-sub {
      font-size: 0.75rem;
      color: #047857;
      font-weight: 600;
    }
    .contact-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      background: #fef3c7;
      color: #78350f;
      padding: 0.4rem 0.85rem;
      border-radius: 6px;
      border: 1px solid #fde68a;
      font-size: 0.8rem;
      font-weight: 700;
      text-decoration: none;
    }
    .container {
      max-width: 1400px;
      margin: 1.5rem auto;
      padding: 0 1rem;
      display: grid;
      grid-template-columns: 1fr;
      gap: 1.5rem;
    }
    @media (min-width: 1024px) {
      .container {
        grid-template-columns: 460px 1fr;
      }
    }
    .card {
      background: var(--card-bg);
      border-radius: 12px;
      border: 1px solid var(--border);
      padding: 1.25rem;
      box-shadow: 0 1px 3px rgba(0,0,0,0.05);
    }
    .form-group {
      margin-bottom: 0.9rem;
    }
    label {
      display: block;
      font-size: 0.78rem;
      font-weight: 600;
      color: #334155;
      margin-bottom: 0.25rem;
    }
    input, select, textarea {
      width: 100%;
      padding: 0.55rem 0.75rem;
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      font-size: 0.85rem;
      font-family: inherit;
      color: #0f172a;
      background: #fff;
      transition: border-color 0.15s;
    }
    input:focus, select:focus, textarea:focus {
      outline: none;
      border-color: #059669;
      box-shadow: 0 0 0 2px rgba(5,150,105,0.15);
    }
    .grid-2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.75rem;
    }
    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.4rem;
      padding: 0.55rem 1rem;
      border-radius: 6px;
      font-size: 0.82rem;
      font-weight: 700;
      cursor: pointer;
      border: none;
      transition: all 0.15s;
    }
    .btn-primary { background: #047857; color: #fff; }
    .btn-primary:hover { background: #065f46; }
    .btn-secondary { background: #e2e8f0; color: #1e293b; }
    .btn-secondary:hover { background: #cbd5e1; }
    .btn-amber { background: #d97706; color: #fff; }
    .btn-amber:hover { background: #b45309; }

    /* Letter preview paper */
    .letter-paper {
      background: #fff;
      border: 1px solid #e2e8f0;
      box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1);
      padding: 2.5rem;
      min-height: 800px;
      font-family: 'Times New Roman', Times, serif;
      font-size: 1.05rem;
      line-height: 1.7;
      color: #111827;
      border-radius: 4px;
    }
    .letter-header {
      border-bottom: 2px solid #047857;
      padding-bottom: 0.75rem;
      margin-bottom: 1.5rem;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
    }
    .letter-title {
      font-size: 1.2rem;
      font-weight: bold;
      color: #047857;
      letter-spacing: 0.5px;
    }
    .letter-date {
      font-size: 0.95rem;
      font-weight: 600;
    }
    .letter-subj {
      font-weight: bold;
      text-decoration: underline;
      margin: 1.25rem 0;
      font-size: 1.1rem;
    }
    .letter-body {
      text-align: justify;
      margin-bottom: 1.25rem;
    }
    .letter-highlight {
      font-weight: bold;
      color: #0f172a;
    }
    .letter-table {
      width: 100%;
      border-collapse: collapse;
      margin: 1rem 0;
      font-size: 0.95rem;
    }
    .letter-table td, .letter-table th {
      border: 1px solid #cbd5e1;
      padding: 0.4rem 0.75rem;
    }
    .letter-table th {
      background: #f1f5f9;
      text-align: left;
    }
    .letter-sign {
      margin-top: 3rem;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
    }
    .sign-box {
      border-top: 1px solid #334155;
      padding-top: 0.5rem;
      width: 200px;
      text-align: center;
      font-size: 0.9rem;
    }

    /* Print styles */
    @media print {
      body { background: #fff; color: #000; }
      header, .no-print, .left-col { display: none !important; }
      .container { display: block; margin: 0; padding: 0; }
      .card { border: none; box-shadow: none; padding: 0; }
      .letter-paper {
        border: none;
        box-shadow: none;
        padding: 0;
        min-height: auto;
      }
    }
    .toast {
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: #065f46;
      color: #fff;
      padding: 0.75rem 1.25rem;
      border-radius: 8px;
      font-size: 0.85rem;
      font-weight: 600;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      z-index: 100;
      display: none;
    }
  </style>
</head>
<body>

  <header class="no-print">
    <div class="header-inner">
      <div class="brand-wrap">
        <div class="logo-badge">TX</div>
        <div>
          <div class="brand-title">Thakur Xerox Center</div>
          <div class="brand-sub">51+ Official Bank Application Letters & Forms Generator</div>
        </div>
      </div>
      <div style="display:flex; gap:0.5rem; align-items:center;">
        <a href="tel:9970996060" class="contact-badge">
          📞 Vinodsingh Thakur: 9970996060
        </a>
      </div>
    </div>
  </header>

  <div class="container">
    <!-- Left Column: Controls & Form Inputs -->
    <div class="left-col no-print">
      <div class="card" style="margin-bottom: 1rem;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
          <h2 style="font-size: 0.95rem; font-weight: 700; color: #0f172a;">Select Bank & Letter Type</h2>
          <button type="button" class="btn btn-secondary" style="font-size: 0.72rem; padding: 0.3rem 0.6rem;" onclick="fillSample()">Fill Sample</button>
        </div>

        <div class="form-group">
          <label>Target Bank</label>
          <select id="bankSelect" onchange="updateLetter()">
            <option value="Bank of Maharashtra" selected>Bank of Maharashtra</option>
            <option value="State Bank of India">State Bank of India (SBI)</option>
            <option value="Bank of Baroda">Bank of Baroda</option>
            <option value="Punjab National Bank">Punjab National Bank (PNB)</option>
            <option value="Canara Bank">Canara Bank</option>
            <option value="Union Bank of India">Union Bank of India</option>
            <option value="HDFC Bank">HDFC Bank</option>
            <option value="ICICI Bank">ICICI Bank</option>
            <option value="Axis Bank">Axis Bank</option>
          </select>
        </div>

        <div class="form-group">
          <label>Search 51+ Letter Formats</label>
          <input type="text" id="letterSearch" placeholder="Search ATM, Cheque, Passbook, Statement, UPI..." oninput="filterLetters()" />
        </div>

        <div class="form-group">
          <label>Letter Format</label>
          <select id="letterSelect" onchange="updateLetter()" size="8" style="height: auto; max-height: 200px;">
            <!-- Group 1: ATM & Debit Cards (25-32) -->
            <optgroup label="ATM & Debit Cards">
              <option value="25" selected>25. New ATM / Debit Card Request Application</option>
              <option value="26">26. ATM Card Blocking Application</option>
              <option value="27">27. Lost ATM Card Complaint Application</option>
              <option value="28">28. Damaged ATM Card Replacement Application</option>
              <option value="29">29. ATM PIN Generation / Reset Request</option>
              <option value="30">30. ATM Card Renewal Application</option>
              <option value="31">31. ATM Transaction Dispute Application</option>
              <option value="32">32. ATM Cash Not Dispensed Complaint</option>
            </optgroup>
            <!-- Group 2: Cheques (33-38) -->
            <optgroup label="Cheque Book & Clearing">
              <option value="33">33. New Cheque Book Request Application</option>
              <option value="34">34. Duplicate Cheque Book Request Application</option>
              <option value="35">35. Stop Cheque Payment Application</option>
              <option value="36">36. Cheque Cancellation Application</option>
              <option value="37">37. Cheque Revalidation Application</option>
              <option value="38">38. Cheque Book Not Received Complaint</option>
            </optgroup>
            <!-- Group 3: Passbook, Statements & Certificates (42-50) -->
            <optgroup label="Passbook, Statements & Certificates">
              <option value="42">42. Passbook Correction Application</option>
              <option value="43">43. Bank Statement Request Application</option>
              <option value="44">44. Mini Statement Request</option>
              <option value="45">45. Balance Certificate Request</option>
              <option value="46">46. Interest Certificate Request</option>
              <option value="47">47. Account Confirmation Certificate Request</option>
              <option value="48">48. No Dues Certificate Request</option>
              <option value="49">49. Loan Account Statement Request</option>
              <option value="50">50. Bank Account Verification Letter Request</option>
            </optgroup>
            <!-- Group 4: NetBanking, Mobile Banking & UPI (51-62) -->
            <optgroup label="Digital, NetBanking & UPI">
              <option value="51">51. Internet Banking Activation Application</option>
              <option value="52">52. Internet Banking Deactivation Application</option>
              <option value="53">53. Mobile Banking Activation Application</option>
              <option value="54">54. Mobile Banking Deactivation Application</option>
              <option value="55">55. UPI Activation / Registration Request</option>
              <option value="56">56. UPI Transaction Failed Complaint</option>
              <option value="57">57. Wrong UPI Transaction Complaint</option>
              <option value="58">58. Failed IMPS Transaction Complaint</option>
              <option value="59">59. Failed NEFT Transaction Complaint</option>
              <option value="60">60. Failed RTGS Transaction Complaint</option>
              <option value="61">61. Mobile Banking User ID Unlock Request</option>
              <option value="62">62. Internet Banking Password Reset Request</option>
            </optgroup>
            <!-- Group 5: Account Operations & KYC -->
            <optgroup label="Account Operations & KYC">
              <option value="01">01. Account Transfer to Another Branch</option>
              <option value="02">02. Mobile Number Update Application</option>
              <option value="03">03. Email ID Update Application</option>
              <option value="04">04. Address Change Application</option>
              <option value="05">05. Signature Change / Update Application</option>
              <option value="06">06. Re-KYC / KYC Update Application</option>
              <option value="07">07. Aadhaar Card Linking Request</option>
              <option value="08">08. PAN Card Linking Application</option>
              <option value="09">09. Dormant / Inactive Account Reactivation</option>
              <option value="10">10. Minor to Major Account Conversion</option>
              <option value="11">11. Bank Account Closure Application</option>
              <option value="12">12. Add / Update Nominee Application</option>
            </optgroup>
          </select>
        </div>
      </div>

      <!-- Applicant Details -->
      <div class="card">
        <h2 style="font-size: 0.95rem; font-weight: 700; color: #0f172a; margin-bottom: 0.75rem;">Applicant & Account Information</h2>
        
        <div class="form-group">
          <label>Full Applicant Name</label>
          <input type="text" id="applicantName" value="Rahul Ramesh Patil" oninput="updateLetter()" />
        </div>

        <div class="grid-2">
          <div class="form-group">
            <label>Account Number</label>
            <input type="text" id="accountNo" value="60123456789" oninput="updateLetter()" />
          </div>
          <div class="form-group">
            <label>CIF / Customer ID</label>
            <input type="text" id="cifNo" value="9876543210" oninput="updateLetter()" />
          </div>
        </div>

        <div class="grid-2">
          <div class="form-group">
            <label>Branch Name</label>
            <input type="text" id="branchName" value="Shivajinagar Branch, Pune" oninput="updateLetter()" />
          </div>
          <div class="form-group">
            <label>Branch IFSC</label>
            <input type="text" id="ifscCode" value="MAHB0000045" oninput="updateLetter()" />
          </div>
        </div>

        <div class="grid-2">
          <div class="form-group">
            <label>Mobile Number</label>
            <input type="text" id="mobileNo" value="9876543210" oninput="updateLetter()" />
          </div>
          <div class="form-group">
            <label>Email Address</label>
            <input type="text" id="emailId" value="rahul.patil@example.com" oninput="updateLetter()" />
          </div>
        </div>

        <div class="form-group">
          <label>Residential Address</label>
          <input type="text" id="address" value="Flat No 402, Shree Ganesh Residency, FC Road, Pune - 411005" oninput="updateLetter()" />
        </div>

        <div class="form-group">
          <label>Application Date</label>
          <input type="date" id="appDate" oninput="updateLetter()" />
        </div>

        <div class="form-group">
          <label>Specific Reference / Transaction No / Cheque No / Card No (if applicable)</label>
          <input type="text" id="specRef" value="TXN/2026/04/991823" oninput="updateLetter()" />
        </div>

        <div class="form-group">
          <label>Additional Particulars / Reason</label>
          <textarea id="particulars" rows="2" oninput="updateLetter()">Due to magnetic strip wear and tear on existing card.</textarea>
        </div>
      </div>
    </div>

    <!-- Right Column: Live Letter Paper Preview -->
    <div class="right-col">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;" class="no-print">
        <div>
          <span style="font-size: 0.82rem; font-weight: 700; color: #047857; background: #ecfdf5; padding: 0.25rem 0.6rem; border-radius: 4px; border: 1px solid #a7f3d0;">
            A4 Official Formal Format
          </span>
        </div>
        <div style="display: flex; gap: 0.5rem;">
          <button type="button" class="btn btn-secondary" onclick="copyLetterText()">📋 Copy Text</button>
          <button type="button" class="btn btn-amber" onclick="downloadLetterDoc()">💾 Save .DOC</button>
          <button type="button" class="btn btn-primary" onclick="window.print()">🖨️ Print / Save PDF</button>
        </div>
      </div>

      <!-- Formal Letter Paper -->
      <div class="letter-paper" id="letterContainer">
        <!-- Dynamically populated via JS -->
      </div>
    </div>
  </div>

  <div class="toast" id="toast">Copied to clipboard!</div>

  <script>
    // Set today's date
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('appDate').value = today;

    const letterTemplates = {
      "25": {
        subject: "Application for Issuance of New ATM / Debit Card",
        body: (d) => \`I am holding a Savings Bank Account No. <span class="letter-highlight">\${d.accountNo}</span> with your branch. I request you to kindly issue a new ATM / Debit Card for my account as I currently do not possess an active debit card for cash withdrawals and online transactions. My details are registered as: Mobile No: <span class="letter-highlight">\${d.mobileNo}</span>, Email: <span class="letter-highlight">\${d.emailId}</span>. Please deliver the card to my registered address.\`
      },
      "26": {
        subject: "Urgent Application for Blocking ATM / Debit Card",
        body: (d) => \`I am maintaining Savings Account No. <span class="letter-highlight">\${d.accountNo}</span> at your branch. I urgently request you to block my ATM / Debit card ending with digits <span class="letter-highlight">\${d.specRef || 'XXXX'}</span> with immediate effect due to suspicious unauthorized activity / misplaced card. Kindly ensure no further debits occur on this card.\`
      },
      "27": {
        subject: "Complaint and Application regarding Lost ATM Card",
        body: (d) => \`I regret to inform you that I have lost my ATM / Debit Card linked with my Account No. <span class="letter-highlight">\${d.accountNo}</span> on or around <span class="letter-highlight">\${d.formattedDate}</span>. Card reference: <span class="letter-highlight">\${d.specRef}</span>. I request you to kindly register this complaint, permanently hotlist/block the lost card, and issue a fresh replacement debit card.\`
      },
      "28": {
        subject: "Application for Replacement of Damaged / Unreadable ATM Card",
        body: (d) => \`I hold Account No. <span class="letter-highlight">\${d.accountNo}</span> with your esteemed branch. My existing ATM card has been physically damaged and the chip/magnetic strip is no longer being read at ATM machines or PoS terminals. Particulars: <span class="letter-highlight">\${d.particulars}</span>. I surrender the old card and request a replacement card.\`
      },
      "29": {
        subject: "Request for Generation / Reset of ATM PIN",
        body: (d) => \`I maintain Savings Account No. <span class="letter-highlight">\${d.accountNo}</span> at your branch. I have forgotten the PIN of my ATM Card (Card No: <span class="letter-highlight">\${d.specRef}</span>) / the green PIN generation was uncompleted. I request you to kindly generate a duplicate PIN or send an OTP green PIN to my registered mobile number <span class="letter-highlight">\${d.mobileNo}</span>.\`
      },
      "30": {
        subject: "Application for ATM Card Renewal on Expiry",
        body: (d) => \`I am writing to notify you that my ATM / Debit Card linked with Account No. <span class="letter-highlight">\${d.accountNo}</span> is expiring / expired on <span class="letter-highlight">\${d.specRef || 'this month'}</span>. I request you to kindly renew and issue a new debit card linked to my account and send it to my registered residential address.\`
      },
      "31": {
        subject: "Dispute Complaint for Erroneous ATM Transaction",
        body: (d) => \`I wish to lodge a formal dispute regarding an unauthorized / erroneous ATM transaction from my Account No. <span class="letter-highlight">\${d.accountNo}</span>. On date <span class="letter-highlight">\${d.formattedDate}</span>, an amount of Rs. <span class="letter-highlight">\${d.specRef}</span> was debited without my knowledge / without cash delivery. Transaction Ref: <span class="letter-highlight">\${d.particulars}</span>. Kindly investigate and reverse the debited amount.\`
      },
      "32": {
        subject: "Complaint: Cash Not Dispensed but Amount Debited from ATM",
        body: (d) => \`I attempted to withdraw cash from ATM on <span class="letter-highlight">\${d.formattedDate}</span> using my debit card linked with Account No. <span class="letter-highlight">\${d.accountNo}</span>. The ATM machine failed to dispense the requested amount of <span class="letter-highlight">\${d.specRef}</span>, however the amount was debited from my bank account. ATM location/ID: <span class="letter-highlight">\${d.particulars}</span>. As per RBI guidelines, kindly reverse the debited funds.\`
      },
      "33": {
        subject: "Application for Issuance of New Cheque Book",
        body: (d) => \`I am holding Account No. <span class="letter-highlight">\${d.accountNo}</span> with your branch. I request you to kindly issue a new personalized CTS-2010 cheque book containing <span class="letter-highlight">\${d.specRef || '25 / 50'}</span> leaves for my account. Please deliver the cheque book to my registered residential address.\`
      },
      "34": {
        subject: "Application for Duplicate Cheque Book",
        body: (d) => \`I hold Account No. <span class="letter-highlight">\${d.accountNo}</span> at your branch. My previous cheque book was exhausted / misplaced. Particulars: <span class="letter-highlight">\${d.particulars}</span>. I request you to kindly issue a duplicate cheque book for my account at the earliest.\`
      },
      "35": {
        subject: "Urgent Instruction to Stop Payment of Cheque",
        body: (d) => \`I request you to kindly stop payment of Cheque No. <span class="letter-highlight">\${d.specRef}</span> dated <span class="letter-highlight">\${d.formattedDate}</span> drawn on my Account No. <span class="letter-highlight">\${d.accountNo}</span>. Reason for stop payment: <span class="letter-highlight">\${d.particulars || 'Misplaced by bearer / cancellation of transaction'}</span>. Kindly ensure the cheque is not honored upon presentment.\`
      },
      "36": {
        subject: "Application for Cheque Cancellation",
        body: (d) => \`I wish to cancel Cheque No. <span class="letter-highlight">\${d.specRef}</span> issued from my Account No. <span class="letter-highlight">\${d.accountNo}</span>. The cheque has been returned by payee / voided. I attach the original cancelled cheque leaflet herewith and request you to mark the same as cancelled in bank records.\`
      },
      "37": {
        subject: "Application for Cheque Revalidation",
        body: (d) => \`I am enclosing Cheque / Banker Cheque No. <span class="letter-highlight">\${d.specRef}</span> dated <span class="letter-highlight">\${d.formattedDate}</span> drawn in my favor / by me. As the 3-month validity period has expired, I request you to kindly revalidate the said cheque or issue a fresh instrument.\`
      },
      "38": {
        subject: "Complaint: Cheque Book Dispatched but Not Received",
        body: (d) => \`I applied for a new cheque book for my Account No. <span class="letter-highlight">\${d.accountNo}</span> on <span class="letter-highlight">\${d.formattedDate}</span>. According to bank SMS notification, the cheque book was dispatched via speed post (Tracking No: <span class="letter-highlight">\${d.specRef}</span>), but I have not yet received it. Kindly track and expedite delivery.\`
      },
      "42": {
        subject: "Application for Passbook Correction / Updating",
        body: (d) => \`I hold Account No. <span class="letter-highlight">\${d.accountNo}</span> at your branch. I noticed a clerical discrepancy in my passbook regarding <span class="letter-highlight">\${d.particulars || 'name spelling / entry printing'}</span>. I request you to rectify the entry in bank records and update my passbook.\`
      },
      "43": {
        subject: "Application for Bank Account Statement",
        body: (d) => \`I request you to provide a certified Bank Account Statement for my Account No. <span class="letter-highlight">\${d.accountNo}</span> for the period from <span class="letter-highlight">\${d.specRef || 'Last 6 Months'}</span>. The statement is urgently required for <span class="letter-highlight">\${d.particulars || 'official audit / visa / loan application'}</span>.\`
      },
      "44": {
        subject: "Request for Mini Statement and Balance Confirmation",
        body: (d) => \`I am holding Account No. <span class="letter-highlight">\${d.accountNo}</span> at your branch. I request you to kindly issue a printed mini statement of recent transactions along with balance verification stamp.\`
      },
      "45": {
        subject: "Application for Issuance of Balance Certificate",
        body: (d) => \`I am holding Account No. <span class="letter-highlight">\${d.accountNo}</span> with your branch. I require an official Bank Balance Certificate stating the credit balance in my account as of date for <span class="letter-highlight">\${d.particulars || 'visa filing / financial verification'}</span>.\`
      },
      "46": {
        subject: "Application for Annual Interest Certificate (Form 16A / IT)",
        body: (d) => \`I request you to kindly issue the Interest Certificate (Savings & Term Deposit) for the Financial Year <span class="letter-highlight">\${d.specRef || '2025-2026'}</span> for my Account No. <span class="letter-highlight">\${d.accountNo}</span> for Income Tax Return filing purposes.\`
      },
      "47": {
        subject: "Application for Account Confirmation Certificate",
        body: (d) => \`I hold Savings / Current Account No. <span class="letter-highlight">\${d.accountNo}</span> at your branch. I request you to issue a formal Account Confirmation Certificate with bank seal certifying my account status, IFSC code, and registered address.\`
      },
      "48": {
        subject: "Application for Issuance of No Dues Certificate (NDC)",
        body: (d) => \`I had availed a loan / credit facility (Loan A/c No: <span class="letter-highlight">\${d.specRef}</span>) from your branch. The entire loan amount has been paid in full. I request you to kindly issue a No Dues Certificate and return all original security documents.\`
      },
      "49": {
        subject: "Request for Loan Account Statement",
        body: (d) => \`I maintain Loan Account No. <span class="letter-highlight">\${d.specRef}</span> with your branch. I request you to kindly provide a complete Loan Statement showing principal balance, EMI amortization, and interest paid for the current financial year.\`
      },
      "50": {
        subject: "Application for Bank Account Verification Letter",
        body: (d) => \`I request you to issue an official Bank Account Verification Letter with authorized signature and bank stamp for Account No. <span class="letter-highlight">\${d.accountNo}</span>, confirming my photograph, signature, and account details for <span class="letter-highlight">\${d.particulars || 'government / employer verification'}</span>.\`
      },
      "51": {
        subject: "Application for Internet Banking Activation",
        body: (d) => \`I hold Account No. <span class="letter-highlight">\${d.accountNo}</span> at your branch. I request you to activate Internet Banking facility with transaction rights for my account. My registered mobile number is <span class="letter-highlight">\${d.mobileNo}</span> and email is <span class="letter-highlight">\${d.emailId}</span>.\`
      },
      "52": {
        subject: "Application for Internet Banking Deactivation",
        body: (d) => \`I request you to immediately deactivate the Internet Banking facility linked to my Account No. <span class="letter-highlight">\${d.accountNo}</span> due to security reasons / non-usage. Particulars: <span class="letter-highlight">\${d.particulars}</span>.\`
      },
      "53": {
        subject: "Application for Mobile Banking Activation",
        body: (d) => \`I maintain Account No. <span class="letter-highlight">\${d.accountNo}</span> at your branch. I request you to enable Mobile Banking facility for my registered mobile number <span class="letter-highlight">\${d.mobileNo}</span> so that I may access mobile banking app services.\`
      },
      "54": {
        subject: "Application for Mobile Banking Deactivation",
        body: (d) => \`I request you to deactivate Mobile Banking services linked with my Account No. <span class="letter-highlight">\${d.accountNo}</span> on mobile number <span class="letter-highlight">\${d.mobileNo}</span> with immediate effect.\`
      },
      "55": {
        subject: "Application for UPI Activation / Registration",
        body: (d) => \`I am holding Account No. <span class="letter-highlight">\${d.accountNo}</span> with your branch. I request you to enable UPI registration and set my mobile number <span class="letter-highlight">\${d.mobileNo}</span> as the authorized primary UPI mobile number.\`
      },
      "56": {
        subject: "Complaint: Failed UPI Transaction - Amount Debited but Not Credited",
        body: (d) => \`I made a UPI transaction on <span class="letter-highlight">\${d.formattedDate}</span> for Rs. <span class="letter-highlight">\${d.specRef}</span> from my Account No. <span class="letter-highlight">\${d.accountNo}</span>. The transaction failed at beneficiary end, but funds were debited from my account. UPI Ref / UTR: <span class="letter-highlight">\${d.particulars}</span>. Kindly reverse the amount back to my account.\`
      },
      "57": {
        subject: "Complaint regarding Erroneous / Wrong UPI Transaction",
        body: (d) => \`I inadvertently initiated a UPI transfer of Rs. <span class="letter-highlight">\${d.specRef}</span> to a wrong UPI VPA / Account on <span class="letter-highlight">\${d.formattedDate}</span> from Account No. <span class="letter-highlight">\${d.accountNo}</span>. UTR Number: <span class="letter-highlight">\${d.particulars}</span>. I request your prompt intervention to recall the erroneously transferred funds.\`
      },
      "58": {
        subject: "Complaint for Failed IMPS Transaction",
        body: (d) => \`I attempted an IMPS remittance on <span class="letter-highlight">\${d.formattedDate}</span> for Rs. <span class="letter-highlight">\${d.specRef}</span> from my Account No. <span class="letter-highlight">\${d.accountNo}</span>. Beneficiary has not received the funds while my account stands debited. RRN / Reference: <span class="letter-highlight">\${d.particulars}</span>. Kindly reverse the amount.\`
      },
      "59": {
        subject: "Complaint for Failed NEFT Transaction",
        body: (d) => \`I initiated an NEFT transfer of Rs. <span class="letter-highlight">\${d.specRef}</span> from Account No. <span class="letter-highlight">\${d.accountNo}</span> on <span class="letter-highlight">\${d.formattedDate}</span>. The funds have neither reached beneficiary nor bounced back to my account. UTR Ref: <span class="letter-highlight">\${d.particulars}</span>. Kindly track and resolve.\`
      },
      "60": {
        subject: "Complaint for Failed RTGS Transaction",
        body: (d) => \`An RTGS transfer of Rs. <span class="letter-highlight">\${d.specRef}</span> from my Account No. <span class="letter-highlight">\${d.accountNo}</span> initiated on <span class="letter-highlight">\${d.formattedDate}</span> has not been credited to beneficiary bank. UTR: <span class="letter-highlight">\${d.particulars}</span>. Kindly escalate and ensure immediate credit or return of funds.\`
      },
      "61": {
        subject: "Application to Unlock Mobile Banking User ID",
        body: (d) => \`My Mobile Banking User ID for Account No. <span class="letter-highlight">\${d.accountNo}</span> has been locked due to consecutive incorrect MPIN / password attempts. I request you to unlock my credentials and send a temporary login PIN to my registered mobile <span class="letter-highlight">\${d.mobileNo}</span>.\`
      },
      "62": {
        subject: "Request for Internet Banking Password Reset",
        body: (d) => \`I am holding Account No. <span class="letter-highlight">\${d.accountNo}</span> at your branch. I have forgotten my Internet Banking login / profile password. I request you to reset my password and dispatch a printed PIN / send reset link to my registered email <span class="letter-highlight">\${d.emailId}</span>.\`
      },
      "01": {
        subject: "Application for Account Transfer to Another Branch",
        body: (d) => \`I hold Savings Account No. <span class="letter-highlight">\${d.accountNo}</span> at your branch. Due to change of residence / job transfer, I request you to kindly transfer my bank account to <span class="letter-highlight">\${d.particulars || 'the destination branch'}</span>. All my KYC documents are attached.\`
      },
      "02": {
        subject: "Application for Updating Registered Mobile Number",
        body: (d) => \`I maintain Account No. <span class="letter-highlight">\${d.accountNo}</span> with your branch. I request you to update my registered mobile number to <span class="letter-highlight">\${d.mobileNo}</span> for SMS alerts, OTPs, and transaction alerts. Identity proof is enclosed.\`
      },
      "03": {
        subject: "Application for Updating Email Address",
        body: (d) => \`I request you to register my email address <span class="letter-highlight">\${d.emailId}</span> with my Account No. <span class="letter-highlight">\${d.accountNo}</span> for receiving monthly e-statements and notifications.\`
      },
      "04": {
        subject: "Application for Change of Residential Address",
        body: (d) => \`I hold Account No. <span class="letter-highlight">\${d.accountNo}</span> at your branch. I have relocated to a new address: <span class="letter-highlight">\${d.address}</span>. Enclosed herewith is valid address proof for your verification and update in bank records.\`
      },
      "05": {
        subject: "Application for Change / Update of Signature",
        body: (d) => \`I request you to update my specimen signature for Account No. <span class="letter-highlight">\${d.accountNo}</span>. My new specimen signatures are attested below along with valid identity proof.\`
      },
      "06": {
        subject: "Application for Re-KYC / KYC Update",
        body: (d) => \`In compliance with RBI Periodic KYC guidelines, I am submitting my updated KYC documents (Aadhaar, PAN, Recent Photograph) for Account No. <span class="letter-highlight">\${d.accountNo}</span>. Kindly update my KYC status to fully compliant.\`
      },
      "07": {
        subject: "Application for Linking Aadhaar Card with Bank Account",
        body: (d) => \`I hold Account No. <span class="letter-highlight">\${d.accountNo}</span> at your branch. I request you to link my Aadhaar Card (enclosed copy) with my account and enable NPCI mapping for receiving Direct Benefit Transfers (DBT).\`
      },
      "08": {
        subject: "Application for Linking PAN Card with Bank Account",
        body: (d) => \`I hold Account No. <span class="letter-highlight">\${d.accountNo}</span> at your branch. I request you to link my Permanent Account Number (PAN) with my bank account. A self-attested photocopy of my PAN card is attached.\`
      },
      "09": {
        subject: "Application for Reactivation of Inactive / Dormant Account",
        body: (d) => \`My Savings Account No. <span class="letter-highlight">\${d.accountNo}</span> has become dormant due to lack of transactions. I request you to reactivate my account. I am ready to deposit the required operating amount and have enclosed updated KYC documents.\`
      },
      "10": {
        subject: "Application for Conversion of Minor Account to Major Account",
        body: (d) => \`I hold Minor Account No. <span class="letter-highlight">\${d.accountNo}</span> operated by my guardian. Having attained 18 years of age, I request you to convert my account to a regular individual major savings account. Age proof and signature specimen are attached.\`
      },
      "11": {
        subject: "Application for Closure of Bank Account",
        body: (d) => \`I maintain Savings Account No. <span class="letter-highlight">\${d.accountNo}</span> with your branch. Due to <span class="letter-highlight">\${d.particulars || 'unavoidable personal reasons'}</span>, I am unable to continue maintaining this account. I surrender my unused cheque leaves, passbook, and debit card. Kindly close the account and pay remaining balance via cash/NEFT.\`
      },
      "12": {
        subject: "Application for Adding / Modifying Nominee (Form DA-1)",
        body: (d) => \`I hold Account No. <span class="letter-highlight">\${d.accountNo}</span> at your branch. I request you to register / update nominee details under Banking Companies (Nomination) Rules for my account as per details in enclosed Form DA-1.\`
      }
    };

    function getFormData() {
      const dateVal = document.getElementById('appDate').value;
      const formattedDate = dateVal ? new Date(dateVal).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' }) : 'As on Date';
      return {
        bankName: document.getElementById('bankSelect').value,
        applicantName: document.getElementById('applicantName').value || 'Applicant Name',
        accountNo: document.getElementById('accountNo').value || 'XXXXXXXXXXX',
        cifNo: document.getElementById('cifNo').value || 'XXXXXXXXXX',
        branchName: document.getElementById('branchName').value || 'Branch Name',
        ifscCode: document.getElementById('ifscCode').value || 'XXXX0000000',
        mobileNo: document.getElementById('mobileNo').value || 'XXXXXXXXXX',
        emailId: document.getElementById('emailId').value || 'applicant@example.com',
        address: document.getElementById('address').value || 'Applicant Address',
        specRef: document.getElementById('specRef').value || '',
        particulars: document.getElementById('particulars').value || '',
        formattedDate: formattedDate
      };
    }

    function updateLetter() {
      const data = getFormData();
      const letterCode = document.getElementById('letterSelect').value;
      const template = letterTemplates[letterCode] || letterTemplates["25"];
      const bodyHtml = template.body(data);

      const html = \`
        <div class="letter-header">
          <div>
            <div class="letter-title">\${data.bankName.toUpperCase()}</div>
            <div style="font-size: 0.9rem; color: #4b5563;">Official Customer Service Application</div>
          </div>
          <div class="letter-date">Date: \${data.formattedDate}</div>
        </div>

        <div>
          <p><strong>To,</strong></p>
          <p><strong>The Branch Manager,</strong></p>
          <p>\${data.bankName},</p>
          <p>\${data.branchName}</p>
          <p style="font-size: 0.9rem; color: #4b5563;">IFSC Code: \${data.ifscCode}</p>
        </div>

        <div class="letter-subj">
          SUBJECT: \${template.subject.toUpperCase()}
        </div>

        <p style="margin-bottom: 0.75rem;">Respected Sir / Madam,</p>

        <div class="letter-body">
          \${bodyHtml}
        </div>

        <table class="letter-table">
          <tr>
            <th width="35%">Account Holder Name</th>
            <td>\${data.applicantName}</td>
          </tr>
          <tr>
            <th>Account Number</th>
            <td style="font-family: 'JetBrains Mono', monospace; font-weight: bold;">\${data.accountNo}</td>
          </tr>
          <tr>
            <th>CIF / Customer ID</th>
            <td style="font-family: 'JetBrains Mono', monospace;">\${data.cifNo}</td>
          </tr>
          <tr>
            <th>Registered Mobile No.</th>
            <td>+91 \${data.mobileNo}</td>
          </tr>
          <tr>
            <th>Registered Email ID</th>
            <td>\${data.emailId}</td>
          </tr>
          <tr>
            <th>Communication Address</th>
            <td>\${data.address}</td>
          </tr>
        </table>

        <div class="letter-body" style="margin-top: 1rem;">
          I declare that the information provided above is true and correct to the best of my knowledge. I request you to kindly process my application at the earliest.
        </div>

        <p style="margin-top: 1rem;">Thanking you,</p>
        <p>Yours faithfully,</p>

        <div class="letter-sign">
          <div>
            <p><strong>Date:</strong> \${data.formattedDate}</p>
            <p><strong>Place:</strong> \${data.branchName.split(',')[1] || data.branchName}</p>
          </div>
          <div class="sign-box">
            <p>(\${data.applicantName})</p>
            <p style="font-size: 0.8rem; color: #64748b;">Signature of Account Holder</p>
          </div>
        </div>
      \`;

      document.getElementById('letterContainer').innerHTML = html;
    }

    function filterLetters() {
      const q = document.getElementById('letterSearch').value.toLowerCase();
      const select = document.getElementById('letterSelect');
      const optgroups = select.getElementsByTagName('optgroup');

      for (let group of optgroups) {
        let hasVisible = false;
        const options = group.getElementsByTagName('option');
        for (let opt of options) {
          const match = opt.text.toLowerCase().includes(q);
          opt.style.display = match ? '' : 'none';
          if (match) hasVisible = true;
        }
        group.style.display = hasVisible ? '' : 'none';
      }
    }

    function showToast(msg) {
      const t = document.getElementById('toast');
      t.innerText = msg;
      t.style.display = 'block';
      setTimeout(() => { t.style.display = 'none'; }, 3000);
    }

    function copyLetterText() {
      const text = document.getElementById('letterContainer').innerText;
      navigator.clipboard.writeText(text).then(() => {
        showToast('Full letter text copied to clipboard!');
      });
    }

    function downloadLetterDoc() {
      const content = document.getElementById('letterContainer').innerHTML;
      const fullDoc = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40"><head><meta charset="utf-8"><title>Bank Letter</title><style>body{font-family:Times New Roman;font-size:12pt;}</style></head><body>' + content + '</body></html>';
      const blob = new Blob(['\\ufeff' + fullDoc], { type: 'application/msword' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'Bank_Application_Letter.doc';
      a.click();
      URL.revokeObjectURL(url);
      showToast('Downloaded Word (.DOC) file!');
    }

    function fillSample() {
      document.getElementById('applicantName').value = 'Rahul Ramesh Patil';
      document.getElementById('accountNo').value = '60123456789';
      document.getElementById('cifNo').value = '9876543210';
      document.getElementById('branchName').value = 'Shivajinagar Branch, Pune';
      document.getElementById('ifscCode').value = 'MAHB0000045';
      document.getElementById('mobileNo').value = '9876543210';
      document.getElementById('emailId').value = 'rahul.patil@example.com';
      document.getElementById('address').value = 'Flat No 402, Shree Ganesh Residency, FC Road, Pune - 411005';
      document.getElementById('specRef').value = 'TXN/2026/04/991823';
      document.getElementById('particulars').value = 'Due to magnetic strip wear and tear on existing card.';
      updateLetter();
      showToast('Sample data populated!');
    }

    // Initialize on load
    updateLetter();
  </script>
</body>
</html>`;
}

/**
 * Creates a complete Hostinger ready-to-upload ZIP file containing:
 * 1. index.html (self-contained production application)
 * 2. .htaccess (Apache & LiteSpeed rewrites for Hostinger)
 * 3. ads.txt (user's approved AdSense verification line)
 * 4. manifest.json (PWA configuration)
 * 5. README_HOSTINGER_DEPLOYMENT.txt (step-by-step upload instructions)
 */
export async function generateHostingerZip(): Promise<Blob> {
  const zip = new JSZip();

  // 1. Single-page offline HTML app as index.html
  const standaloneHtml = generateStandaloneHtml();
  zip.file('index.html', standaloneHtml);

  // 2. .htaccess for Hostinger Apache/LiteSpeed web server
  const htaccessContent = `# Hostinger Apache / LiteSpeed Web Server Configuration for DocuFill Studio
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /

  # Serve existing files and directories directly
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]

  # Fallback all other requests to index.html for Single Page Application (SPA) routing
  RewriteRule ^ index.html [L]
</IfModule>

# Caching and MIME Types for Static Assets
<IfModule mod_headers.c>
  <FilesMatch "\\.(ico|pdf|jpg|jpeg|png|gif|svg|webp|woff|woff2|ttf|eot)$">
    Header set Cache-Control "max-age=31536000, public"
  </FilesMatch>

  <FilesMatch "(index\\.html|manifest\\.json|ads\\.txt)$">
    Header set Cache-Control "no-cache, no-store, must-revalidate"
    Header set Pragma "no-cache"
    Header set Expires 0
  </FilesMatch>
</IfModule>

# Ensure correct MIME types
<IfModule mod_mime.c>
  AddType application/pdf .pdf
  AddType image/png .png
  AddType image/jpeg .jpg .jpeg
  AddType application/manifest+json .webmanifest .json
  AddType text/plain .txt
</IfModule>
`;
  zip.file('.htaccess', htaccessContent);

  // 3. ads.txt
  const adsTxtContent = 'google.com, pub-3166168589952262, DIRECT, f08c47fec0942fa0\n';
  zip.file('ads.txt', adsTxtContent);

  // 4. manifest.json
  const manifestContent = JSON.stringify({
    short_name: "DocuFill",
    name: "DocuFill Studio - Bank Application Forms",
    icons: [],
    start_url: "./index.html",
    background_color: "#ffffff",
    theme_color: "#047857",
    display: "standalone"
  }, null, 2);
  zip.file('manifest.json', manifestContent);

  // 5. Hostinger deployment instructions
  const readmeContent = `======================================================================
  HOSTINGER 1-MINUTE DEPLOYMENT INSTRUCTIONS
  DocuFill Studio & Bank Letters Portal - Thakur Xerox Center
======================================================================

HOW TO DEPLOY TO YOUR HOSTINGER DOMAIN:

Option A: Deploy to your Main Domain (e.g., https://yourdomain.com/)
----------------------------------------------------------------------
1. Log into your Hostinger hPanel (https://hpanel.hostinger.com).
2. Go to "Websites" -> Click "Manage" next to your domain.
3. Open "File Manager" -> Click "Access files of yourdomain.com".
4. Double-click to open the folder: public_html
5. Upload this ZIP file, or upload the extracted contents:
   - index.html
   - .htaccess
   - ads.txt
   - manifest.json
6. If you uploaded the ZIP file, right-click it and choose "Extract".
   Extract directly into public_html.
7. Open https://yourdomain.com/ in your browser. Your portal is live!

Option B: Deploy to a Subfolder (e.g., https://yourdomain.com/sbiform/)
----------------------------------------------------------------------
1. In Hostinger File Manager, inside public_html, create a folder named:
   sbiform
2. Open public_html/sbiform/
3. Extract or upload:
   - index.html
   - .htaccess
   - ads.txt
   - manifest.json
4. Open https://yourdomain.com/sbiform/ in your browser. Done!

ADSENSE VERIFICATION:
The ads.txt file is included with your publisher ID:
google.com, pub-3166168589952262, DIRECT, f08c47fec0942fa0
Verify at: https://yourdomain.com/ads.txt

For support, contact Vinodsingh Thakur at 9970996060.
======================================================================
`;
  zip.file('README_HOSTINGER_DEPLOYMENT.txt', readmeContent);

  // Generate zip as blob
  return await zip.generateAsync({ type: 'blob' });
}
