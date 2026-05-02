/**
 * Input Sanitization Utilities
 * Uses DOMPurify for XSS prevention
 */

let DOMPurifyInstance = null;

async function getDOMPurify() {
  if (!DOMPurifyInstance) {
    const mod = await import('dompurify');
    DOMPurifyInstance = mod.default || mod;
  }
  return DOMPurifyInstance;
}

/**
 * Sanitize HTML string — removes XSS vectors
 */
export async function sanitizeHTML(dirty) {
  const DOMPurify = await getDOMPurify();
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br', 'ul', 'ol', 'li'],
    ALLOWED_ATTR: ['href', 'target', 'rel'],
  });
}

/**
 * Sanitize plain text — strip all HTML
 */
export async function sanitizeText(dirty) {
  const DOMPurify = await getDOMPurify();
  return DOMPurify.sanitize(dirty, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
}

/**
 * Encode HTML entities for safe display
 */
export function encodeHTML(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

/**
 * Validate URL — only allow http/https
 */
export function isValidURL(url) {
  try {
    const parsed = new URL(url);
    return ['http:', 'https:'].includes(parsed.protocol);
  } catch {
    return false;
  }
}

/**
 * Truncate string safely
 */
export function truncate(str, maxLen = 200) {
  if (!str || str.length <= maxLen) return str;
  return str.slice(0, maxLen) + '…';
}
