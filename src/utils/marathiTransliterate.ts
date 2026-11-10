/**
 * English to Marathi (Devanagari) Transliteration Engine
 * Converts English phonetic typing (e.g. "vinodsingh thakur", "waluj", "kapus", "gat kramank")
 * into authentic Marathi script.
 */

// Common vocabulary dictionary for high-precision Marathi banking, agriculture, and names
const DICTIONARY: Record<string, string> = {
  // Common Names & Surnames
  vinod: 'विनोद',
  vinodsingh: 'विनोदसिंह',
  vinodsing: 'विनोदसिंह',
  arjun: 'अर्जुन',
  arjunsingh: 'अर्जुनसिंह',
  thakur: 'ठाकूर',
  singh: 'सिंह',
  sing: 'सिंह',
  patil: 'पाटील',
  sharma: 'शर्मा',
  pawar: 'पवार',
  jadhav: 'जाधव',
  shinde: 'शिंदे',
  gaikwad: 'गायकवाड',
  kadam: 'कदम',
  chavan: 'चव्हाण',
  kale: 'काळे',
  deshmukh: 'देशमुख',
  more: 'मोरे',
  joshi: 'जोशी',
  kulkarni: 'कुलकर्णी',
  ghadge: 'घाडगे',
  raut: 'राऊत',
  bhosale: 'भोसले',
  bhonsle: 'भोसले',
  wagh: 'वाघ',
  salunke: 'साळुंके',
  salunkhe: 'साळुंखे',
  jagtap: 'जगतप',
  shelar: 'शेलार',
  sonawane: 'सोनवणे',
  nikam: 'निकम',
  mane: 'माने',
  pandit: 'पंडित',
  shaikh: 'शेख',
  sayyad: 'सय्यद',
  khan: 'खान',
  ram: 'राम',
  ramrao: 'रामराव',
  vitthal: 'विठ्ठल',
  dnyaneshwar: 'ज्ञानेश्वर',
  santosh: 'संतोष',
  sachin: 'सचिन',
  rahul: 'राहुल',
  sunil: 'सुनील',
  anil: 'अनिल',
  suresh: 'सुरेश',
  ramesh: 'रमेश',
  ganesh: 'गणेश',
  mahesh: 'महेश',
  dinesh: 'दिनेश',
  vijay: 'विजय',
  ajay: 'अजय',
  sanjay: 'संजय',
  prakash: 'प्रकाश',
  vikas: 'विकास',
  datta: 'दत्ता',
  dattatray: 'दत्तात्रय',
  dattatraya: 'दत्तात्रय',
  vishwanath: 'विश्वनाथ',
  vishvanath: 'विश्वनाथ',
  rengade: 'रेंगडे',
  rengde: 'रेंगडे',

  // Places, Districts & Talukas
  waluj: 'वाळूज',
  gangapur: 'गंगापूर',
  chhatrapati: 'छत्रपती',
  sambhajinagar: 'संभाजीनगर',
  aurangabad: 'औरंगाबाद',
  pune: 'पुणे',
  mumbai: 'मुंबई',
  nashik: 'नाशिक',
  nagpur: 'नागपूर',
  kolhapur: 'कोल्हापूर',
  solapur: 'सोलापूर',
  amravati: 'अमरावती',
  nanded: 'नांदेड',
  jalna: 'जालना',
  parbhani: 'परभणी',
  beed: 'बीड',
  bid: 'बीड',
  latur: 'लातूर',
  osmanabad: 'उस्मानाबाद',
  dharashiv: 'धाराशिव',
  ahmednagar: 'अहमदनगर',
  ahilyanagar: 'अहिल्यानगर',
  satara: 'सातारा',
  sangli: 'सांगली',
  ratnagiri: 'रत्नागिरी',
  sindhudurg: 'सिंधुदुर्ग',
  raigad: 'रायगड',
  thane: 'ठाणे',
  palghar: 'पालघर',
  dhule: 'धुळे',
  jalgaon: 'जळगाव',
  nandurbar: 'नंदुरबार',
  buldhana: 'बुलढाणा',
  akola: 'अकोला',
  washim: 'वाशीम',
  yavatmal: 'यवतमाळ',
  wardha: 'वर्धा',
  chandrapur: 'चंद्रपूर',
  gadchiroli: 'गडचिरोली',
  bhandara: 'भंडारा',
  gondia: 'गोंदिया',
  purna: 'पूर्णा',
  vaijapur: 'वैजापूर',
  paithan: 'पैठण',
  khuldabad: 'खुलताबाद',
  sillod: 'सिल्लोड',
  soegaon: 'सोयगाव',
  kannad: 'कन्नड',

  // Common Address & Land Terms
  mauje: 'मौजे',
  gav: 'गाव',
  gaon: 'गाव',
  at: 'मु.',
  post: 'पो.',
  taluka: 'ता.',
  ta: 'ता.',
  dist: 'जि.',
  district: 'जि.',
  gat: 'गट',
  gut: 'गट',
  kramank: 'क्रमांक',
  kr: 'क्र.',
  'kr.': 'क्र.',
  no: 'नं.',
  'no.': 'नं.',
  number: 'नंबर',
  survey: 'सर्व्हे',
  sarve: 'सर्व्हे',
  plot: 'प्लॉट',
  shet: 'शेत',
  shetkari: 'शेतकरी',
  pandan: 'पांदण',
  rasta: 'रस्ता',
  road: 'रस्ता',
  nala: 'नाला',
  odha: 'ओढा',
  nadi: 'नदी',
  sarkari: 'सरकारी',
  shejari: 'शेजारी',
  shejaril: 'शेजारील',
  yanchi: 'यांची',
  yanchya: 'यांच्या',
  yanche: 'यांचे',
  sheti: 'शेती',
  malmatta: 'मालमत्ता',
  kshetraphal: 'क्षेत्रफळ',
  kshetra: 'क्षेत्र',
  hectare: 'हेक्टर',
  he: 'हे.',
  'he.': 'हे.',
  aar: 'आर',
  r: 'आर',
  'r.': 'आर.',
  acre: 'एकर',
  guntha: 'गुंठे',
  gunthe: 'गुंठे',
  chou: 'चौ.',
  sq: 'चौ.',
  feet: 'फूट',
  foot: 'फूट',

  // Directions (चतुःसीमा)
  purva: 'पूर्व',
  east: 'पूर्व',
  pashchim: 'पश्चिम',
  west: 'पश्चिम',
  uttar: 'उत्तर',
  north: 'उत्तर',
  dakshin: 'दक्षिण',
  south: 'दक्षिण',
  sima: 'सीमा',
  chatusima: 'चतुःसीमा',
  chaturseema: 'चतुःसीमा',

  // Crops (पिके)
  kapus: 'कापूस',
  cotton: 'कापूस',
  soyabean: 'सोयाबीन',
  soybean: 'सोयाबीन',
  maka: 'मका',
  maize: 'मका',
  tur: 'तूर',
  toor: 'तूर',
  bajra: 'बाजरी',
  bajari: 'बाजरी',
  jowar: 'ज्वारी',
  jwari: 'ज्वारी',
  gehu: 'गहू',
  gahu: 'गहू',
  wheat: 'गहू',
  chana: 'हरभरा (चना)',
  harbhara: 'हरभरा',
  gram: 'हरभरा',
  kanda: 'कांदा',
  onion: 'कांदा',
  us: 'ऊस',
  oos: 'ऊस',
  sugarcane: 'ऊस',
  adrak: 'आले (अद्रक)',
  ginger: 'अद्रक',
  halad: 'हळद',
  turmeric: 'हळद',
  bhuimug: 'भुईमूग',
  groundnut: 'भुईमूग',
  mug: 'मूग',
  moong: 'मूग',
  udid: 'उडीद',
  urad: 'उडीद',
  til: 'तीळ',
  sesame: 'तीळ',
  mirchi: 'मिरची',
  chilli: 'मिरची',
  tomato: 'टोमॅटो',
  vangi: 'वांगी',
  tarbooj: 'टरबूज',
  dalimb: 'डाळिंब',
  pomegranate: 'डाळिंब',
  mosambi: 'मोसंबी',
  sweetlime: 'मोसंबी',
  santra: 'संत्रा',
  orange: 'संत्रा',
  peru: 'पेरू',
  guava: 'पेरू',
  draksh: 'द्राक्षे',
  grapes: 'द्राक्षे',

  // Banking & Loan terms
  bank: 'बँक',
  shakha: 'शाखा',
  branch: 'शाखा',
  karj: 'कर्ज',
  loan: 'कर्ज',
  peek: 'पीक',
  pik: 'पीक',
  crop: 'पीक',
  bachat: 'बचत',
  savings: 'बचत',
  khate: 'खाते',
  account: 'खाते',
  mudat: 'मुदत',
  term: 'मुदत',
  state: 'स्टेट',
  india: 'इंडिया',
  maharashtra: 'महाराष्ट्र',
  sbi: 'भारतीय स्टेट बँक',
  bom: 'बँक ऑफ महाराष्ट्र',
  kcc: 'केसीसी (KCC)',
  midc: 'एमआयडीसी (MIDC)',

  // Gender & Relations
  purush: 'पुरुष',
  male: 'पुरुष',
  stri: 'स्त्री',
  female: 'स्त्री',
  vadil: 'वडील',
  father: 'वडील',
  pati: 'पती',
  husband: 'पती',
  aai: 'आई',
  mother: 'आई',
  patni: 'पत्नी',
  wife: 'पत्नी',
  mulga: 'मुलगा',
  son: 'मुलगा',
  mulgi: 'मुलगी',
  daughter: 'मुलगी',
  svatah: 'स्वतः',
  self: 'स्वतः',

  // Documents
  aadhaar: 'आधारकार्ड',
  aadhaarcard: 'आधारकार्ड',
  pan: 'पॅन कार्ड',
  pancard: 'पॅन कार्ड',
  ferfar: 'फेरफार नक्कल',
  nakal: 'नक्कल',
  utara: 'उतारा',
  ghoshanapatra: 'घोषणापत्र',
  arja: 'अर्ज',
  namuna: 'नमुना',
};

// Phonetic consonant table (multi-char checked first)
const CONSONANTS: Array<[string, string]> = [
  ['ksha', 'क्ष'],
  ['ksh', 'क्ष'],
  ['dnya', 'ज्ञ'],
  ['dny', 'ज्ञ'],
  ['shra', 'श्र'],
  ['shr', 'श्र'],
  ['chha', 'छ'],
  ['chh', 'छ'],
  ['kh', 'ख'],
  ['gh', 'घ'],
  ['ch', 'च'],
  ['jh', 'झ'],
  ['Th', 'ठ'],
  ['th', 'थ'],
  ['Dh', 'ढ'],
  ['dh', 'ध'],
  ['ph', 'फ'],
  ['bh', 'भ'],
  ['sh', 'श'],
  ['Sh', 'ष'],
  ['zh', 'झ'],
  ['k', 'क'],
  ['g', 'ग'],
  ['j', 'ज'],
  ['t', 'त'],
  ['T', 'ट'],
  ['d', 'द'],
  ['D', 'ड'],
  ['n', 'न'],
  ['N', 'ण'],
  ['p', 'प'],
  ['f', 'फ'],
  ['b', 'ब'],
  ['m', 'म'],
  ['y', 'य'],
  ['r', 'र'],
  ['l', 'ल'],
  ['L', 'ळ'],
  ['v', 'व'],
  ['w', 'व'],
  ['s', 'स'],
  ['h', 'ह'],
];

// Vowels (stand-alone initial or after virama)
const INITIAL_VOWELS: Array<[string, string]> = [
  ['aaa', 'आ'],
  ['aa', 'आ'],
  ['A', 'आ'],
  ['ai', 'ऐ'],
  ['au', 'औ'],
  ['ou', 'औ'],
  ['ee', 'ई'],
  ['ii', 'ई'],
  ['oo', 'ऊ'],
  ['uu', 'ऊ'],
  ['a', 'अ'],
  ['i', 'इ'],
  ['u', 'उ'],
  ['e', 'ए'],
  ['o', 'ओ'],
  ['I', 'ई'],
  ['U', 'ऊ'],
];

// Vowel matras (after consonant)
const VOWEL_MATRAS: Array<[string, string]> = [
  ['aaa', 'ा'],
  ['aa', 'ा'],
  ['A', 'ा'],
  ['ai', 'ै'],
  ['au', 'ौ'],
  ['ou', 'ौ'],
  ['ee', 'ी'],
  ['ii', 'ी'],
  ['oo', 'ू'],
  ['uu', 'ू'],
  ['a', ''], // inherent 'a' removes virama
  ['i', 'ि'],
  ['u', 'ु'],
  ['e', 'े'],
  ['o', 'ो'],
  ['I', 'ी'],
  ['U', 'ू'],
];

/**
 * Phonetically transliterates a single English word into Marathi (Devanagari)
 */
export function transliterateWord(rawWord: string): string {
  if (!rawWord || !rawWord.trim()) return '';

  // Preserve leading/trailing punctuation or numbers
  const match = rawWord.match(/^([^a-zA-Z]*)([a-zA-Z0-9_\-']+)([^a-zA-Z]*)$/);
  if (!match) return rawWord;

  const prefix = match[1];
  const word = match[2];
  const suffix = match[3];

  // Pure numbers or mixed digits like 7/12 or 142/1
  if (/^\d+([/-]\d+)*$/.test(word)) {
    return prefix + word + suffix;
  }

  const lowerWord = word.toLowerCase();

  // 1. Direct Dictionary Match
  if (DICTIONARY[lowerWord]) {
    return prefix + DICTIONARY[lowerWord] + suffix;
  }

  // 2. Rule-based phonetic transliteration
  let result = '';
  let i = 0;
  const len = word.length;
  let lastWasConsonant = false;

  while (i < len) {
    const remaining = word.slice(i);
    const lowerRem = remaining.toLowerCase();

    // Check for Anusvara: 'am' or 'an' before consonant
    if (
      (lowerRem.startsWith('am') || lowerRem.startsWith('an')) &&
      i + 2 < len &&
      !['a', 'e', 'i', 'o', 'u', 'A', 'E', 'I', 'O', 'U'].includes(word[i + 2])
    ) {
      if (lastWasConsonant) {
        result += 'ं';
      } else {
        result += 'अं';
      }
      i += 2;
      lastWasConsonant = false;
      continue;
    }

    // Check vowel matra if previous character was a consonant
    if (lastWasConsonant) {
      let matchedMatra = false;
      for (const [vStr, matra] of VOWEL_MATRAS) {
        if (remaining.startsWith(vStr) || lowerRem.startsWith(vStr)) {
          result += matra;
          i += vStr.length;
          matchedMatra = true;
          lastWasConsonant = false;
          break;
        }
      }
      if (matchedMatra) continue;
    }

    // Check stand-alone vowel (word start or after another vowel)
    let matchedInitialVowel = false;
    for (const [vStr, vChar] of INITIAL_VOWELS) {
      if (remaining.startsWith(vStr) || lowerRem.startsWith(vStr)) {
        result += vChar;
        i += vStr.length;
        matchedInitialVowel = true;
        lastWasConsonant = false;
        break;
      }
    }
    if (matchedInitialVowel) continue;

    // Check consonant
    let matchedConsonant = false;
    for (const [cStr, cChar] of CONSONANTS) {
      if (remaining.startsWith(cStr) || lowerRem.startsWith(cStr.toLowerCase())) {
        result += cChar;
        i += cStr.length;
        matchedConsonant = true;
        lastWasConsonant = true;
        break;
      }
    }
    if (matchedConsonant) continue;

    // Non-letter characters or unrecognized
    result += word[i];
    i++;
    lastWasConsonant = false;
  }

  return prefix + result + suffix;
}

/**
 * Transliterates an entire sentence or phrase from English into Marathi.
 * Already-Devanagari text and numbers are preserved untouched.
 */
export function transliterateToMarathi(text: string | undefined | null): string {
  if (!text) return '';
  const trimmed = text.trim();
  if (!trimmed) return '';

  // If text is already mostly Devanagari (more than 60% devanagari characters), return as-is
  const devanagariCount = (trimmed.match(/[\u0900-\u097F]/g) || []).length;
  const englishCount = (trimmed.match(/[a-zA-Z]/g) || []).length;
  if (devanagariCount > englishCount && englishCount === 0) {
    return trimmed;
  }

  // Tokenize preserving spaces, punctuation, hyphens, slashes
  return trimmed
    .split(/(\s+|[,/.\-():]+)/)
    .map((token) => {
      // If token is whitespace or punctuation, return directly
      if (!token || /^\s+$/.test(token) || /^[,/.\-():]+$/.test(token)) {
        return token;
      }
      // If token already has Devanagari, keep it
      if (/[\u0900-\u097F]/.test(token)) {
        return token;
      }
      return transliterateWord(token);
    })
    .join('');
}

/**
 * Ensures text intended for Marathi forms is returned in Marathi.
 * If typed in English, transliterates to Marathi.
 */
export function ensureMarathi(text: string | undefined | null): string {
  if (!text) return '';
  return transliterateToMarathi(text);
}
