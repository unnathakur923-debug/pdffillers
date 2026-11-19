export type SitePage = 'tool' | 'guides' | 'about' | 'contact' | 'privacy' | 'thin';

export interface RouteMeta {
  page: SitePage;
  title: string;
  description: string;
  canonicalPath: string;
  robots: 'index, follow' | 'noindex, follow';
}

const THIN_PATH_PREFIXES = [
  '/tag',
  '/tags',
  '/archive',
  '/archives',
  '/category',
  '/categories',
  '/author',
  '/search',
  '/page',
  '/preview',
  '/print',
];

const THIN_QUERY_KEYS = [
  'tag',
  'tags',
  'archive',
  'category',
  'filter',
  'search',
  'q',
  'page',
  'sort',
  'preview',
  'print',
];

export function resolveRouteFromLocation(pathname: string, search: string): RouteMeta {
  const normalizedPath = pathname.replace(/\/+$/, '') || '/';
  const params = new URLSearchParams(search);

  const hasThinQuery = THIN_QUERY_KEYS.some((key) => params.has(key));
  const isThinPath = THIN_PATH_PREFIXES.some(
    (prefix) => normalizedPath === prefix || normalizedPath.startsWith(`${prefix}/`)
  );

  if (isThinPath) {
    return {
      page: 'thin',
      title: 'Consolidated Banking & Form Guides | DocuFill Studio',
      description:
        'Tag and archive listings are consolidated into our main Banking & Crop Loan Form Guides for clarity and complete documentation.',
      canonicalPath: '/guides',
      robots: 'noindex, follow',
    };
  }

  switch (normalizedPath) {
    case '/guides':
      return {
        page: 'guides',
        title: 'Complete Banking & Crop Loan Form Guides | DocuFill Studio',
        description:
          'Comprehensive guides for SBI Peek Karj Magni crop loans, PMFBY sowing declarations, BOM & SBI account opening KYC forms, Debit Card Form AR-35, and 51 bank letters.',
        canonicalPath: '/guides',
        robots: hasThinQuery ? 'noindex, follow' : 'index, follow',
      };
    case '/about':
      return {
        page: 'about',
        title: 'About Us – Thakur Xerox & DocuFill Studio',
        description:
          'Learn about Thakur Xerox and DocuFill Studio, our browser-based PDF alignment engine for Indian banking and agricultural loan forms, and our editorial standards.',
        canonicalPath: '/about',
        robots: hasThinQuery ? 'noindex, follow' : 'index, follow',
      };
    case '/contact':
      return {
        page: 'contact',
        title: 'Contact Us – Thakur Xerox Document Assistance',
        description:
          'Contact Vinodsingh Arjunsingh Thakur at Thakur Xerox (9970996060) for banking form preparation guidance, Marathi crop loan sets, printing help, and feedback.',
        canonicalPath: '/contact',
        robots: hasThinQuery ? 'noindex, follow' : 'index, follow',
      };
    case '/privacy-policy':
    case '/privacy':
      return {
        page: 'privacy',
        title: 'Privacy Policy & AdSense Disclosure – DocuFill Studio',
        description:
          'Read how DocuFill Studio processes all banking forms 100% locally in your browser without cloud storage, alongside our Google AdSense and cookie policy.',
        canonicalPath: '/privacy-policy',
        robots: hasThinQuery ? 'noindex, follow' : 'index, follow',
      };
    case '/':
      return {
        page: 'tool',
        title: 'DocuFill Studio – Precision Banking & Crop Loan PDF Form Filler',
        description:
          'Fill official SBI Peek Karj Magni crop loan sets, Bank of Maharashtra & SBI account opening forms, ATM Card Form AR-35, and 51 bank letters with Marathi support and live PDF preview.',
        canonicalPath: '/',
        robots: hasThinQuery ? 'noindex, follow' : 'index, follow',
      };
    default:
      return {
        page: 'thin',
        title: 'Page Consolidated – DocuFill Studio by Thakur Xerox',
        description:
          'This URL has been consolidated into our primary banking form filler and comprehensive document guides.',
        canonicalPath: '/',
        robots: 'noindex, follow',
      };
  }
}

function upsertMetaTag(attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function upsertCanonicalLink(href: string) {
  let link = document.head.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    document.head.appendChild(link);
  }
  link.setAttribute('href', href);
}

export function applyDocumentSeo(meta: RouteMeta) {
  if (typeof document === 'undefined' || typeof window === 'undefined') return;

  document.title = meta.title;
  upsertMetaTag('name', 'description', meta.description);
  upsertMetaTag('name', 'robots', meta.robots);
  upsertMetaTag('property', 'og:title', meta.title);
  upsertMetaTag('property', 'og:description', meta.description);
  upsertMetaTag('name', 'twitter:title', meta.title);
  upsertMetaTag('name', 'twitter:description', meta.description);

  const canonicalUrl = `${window.location.origin}${meta.canonicalPath}`;
  upsertMetaTag('property', 'og:url', canonicalUrl);
  upsertCanonicalLink(canonicalUrl);
}
