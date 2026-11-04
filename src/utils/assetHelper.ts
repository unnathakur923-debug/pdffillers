/**
 * Universal Asset Helper for DocuFill Studio
 *
 * Ensures static assets (PDF templates, bank logos, high-res form scans)
 * load reliably across all environments:
 * - Hostinger root deployment (https://example.com/)
 * - Hostinger subfolder deployment (https://example.com/sbiform/)
 * - Local & AI Studio development servers
 * - Relative / static hosting environments
 */

/**
 * Resolves an asset path against the current base URL.
 * Handles leading slashes, relative bases, and absolute URLs.
 */
export function resolveAssetUrl(path: string): string {
  if (!path) return '';
  if (
    path.startsWith('http://') ||
    path.startsWith('https://') ||
    path.startsWith('data:') ||
    path.startsWith('blob:')
  ) {
    return path;
  }

  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  const baseUrl = import.meta.env.BASE_URL || '/';
  const prefix = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;

  return `${prefix}${cleanPath}`;
}

/**
 * Multi-fallback asset binary loader.
 * Attempts fetching the asset through multiple URL strategies in sequence:
 * 1. Base URL prefixed (e.g. /sbiform/assets/...)
 * 2. Absolute root path (e.g. /assets/...)
 * 3. Document-relative path (e.g. ./assets/...)
 * 4. Bare relative path (e.g. assets/...)
 */
export async function fetchAssetBytes(path: string): Promise<Uint8Array> {
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  const baseUrl = import.meta.env.BASE_URL || '/';
  const basePrefix = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;

  // Candidate URLs in priority order
  const candidates: string[] = [
    `${basePrefix}${cleanPath}`,
    `/${cleanPath}`,
    `./${cleanPath}`,
    cleanPath,
  ];

  // If running in browser and window.location is available, try relative to current pathname directory
  if (typeof window !== 'undefined' && window.location?.pathname) {
    const dir = window.location.pathname.replace(/\/[^/]*$/, '/');
    const dirPrefix = dir.endsWith('/') ? dir : `${dir}/`;
    candidates.push(`${dirPrefix}${cleanPath}`);
  }

  // Deduplicate candidates
  const uniqueCandidates = Array.from(new Set(candidates));

  let lastStatus = 0;
  let lastErrorMsg = '';

  for (const url of uniqueCandidates) {
    try {
      const res = await fetch(url);
      if (res.ok) {
        const buffer = await res.arrayBuffer();
        if (buffer && buffer.byteLength > 0) {
          return new Uint8Array(buffer);
        }
      } else {
        lastStatus = res.status;
        lastErrorMsg = res.statusText;
      }
    } catch (err: any) {
      lastErrorMsg = err?.message || String(err);
    }
  }

  throw new Error(
    `Failed to load asset "${path}". Tried URLs: [${uniqueCandidates.join(', ')}]. Last status: ${lastStatus} (${lastErrorMsg})`
  );
}
