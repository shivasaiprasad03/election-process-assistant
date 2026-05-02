/**
 * Client-Side Security Utilities
 * Provides secure wrappers for storage, input validation,
 * and rate limiting to protect against common web vulnerabilities.
 *
 * @module utils/security
 */

/**
 * Safely read from localStorage with error handling.
 * Prevents crashes if storage is full or disabled (e.g., Safari private mode).
 *
 * @param {string} key - Storage key to read
 * @param {*} [defaultValue=null] - Default value if key doesn't exist
 * @returns {*} Parsed value or default
 */
export function safeGetStorage(key, defaultValue = null) {
  try {
    const item = localStorage.getItem(key);
    if (item === null) return defaultValue;
    return JSON.parse(item);
  } catch (_err) {
    console.warn(`[Security] Failed to read localStorage key "${key}"`);
    return defaultValue;
  }
}

/**
 * Safely write to localStorage with error handling.
 * Handles quota exceeded errors gracefully.
 *
 * @param {string} key - Storage key to write
 * @param {*} value - Value to store (will be JSON-stringified)
 * @returns {boolean} Whether the write was successful
 */
export function safeSetStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (_err) {
    console.warn(`[Security] Failed to write localStorage key "${key}"`);
    return false;
  }
}

/**
 * Validate and sanitize user input string.
 * Strips control characters and enforces length limits.
 *
 * @param {string} input - Raw user input
 * @param {number} [maxLength=500] - Maximum allowed length
 * @returns {string} Sanitized input string
 */
export function validateInput(input, maxLength = 500) {
  if (typeof input !== 'string') return '';

  // Remove control characters (except newline, tab)
  const cleaned = input.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');

  // Trim and enforce length limit
  return cleaned.trim().slice(0, maxLength);
}

/**
 * Simple client-side rate limiter using token bucket algorithm.
 * Prevents spam/abuse from the UI side (server-side rate limiting is separate).
 *
 * @param {number} maxRequests - Maximum requests per window
 * @param {number} windowMs - Time window in milliseconds
 * @returns {{ canProceed: () => boolean, reset: () => void }}
 */
export function createRateLimiter(maxRequests = 10, windowMs = 60000) {
  let tokens = maxRequests;
  let lastRefill = Date.now();

  return {
    /**
     * Check if a request can proceed under the rate limit.
     * @returns {boolean} Whether the request is allowed
     */
    canProceed() {
      const now = Date.now();
      const elapsed = now - lastRefill;

      // Refill tokens based on elapsed time
      if (elapsed >= windowMs) {
        tokens = maxRequests;
        lastRefill = now;
      }

      if (tokens > 0) {
        tokens--;
        return true;
      }

      return false;
    },

    /** Reset the rate limiter to full capacity */
    reset() {
      tokens = maxRequests;
      lastRefill = Date.now();
    },
  };
}

/**
 * Validate a URL for safe usage (only allow http/https protocols).
 * Enhanced version with additional checks for common attack patterns.
 *
 * @param {string} url - URL to validate
 * @returns {boolean} Whether the URL is safe to use
 */
export function isSecureURL(url) {
  try {
    const parsed = new URL(url);
    // Only allow http and https protocols
    if (!['http:', 'https:'].includes(parsed.protocol)) return false;
    // Block common XSS patterns in URLs
    if (url.includes('javascript:') || url.includes('data:')) return false;
    return true;
  } catch {
    return false;
  }
}

/**
 * Generate a simple nonce for CSP inline script allowlisting.
 *
 * @returns {string} Random nonce string
 */
export function generateNonce() {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return btoa(String.fromCharCode(...array));
}
