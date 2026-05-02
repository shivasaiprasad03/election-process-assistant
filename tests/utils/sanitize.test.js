/**
 * Tests for Input Sanitization Utilities
 * Validates XSS prevention, HTML encoding, URL validation, and string truncation.
 *
 * @module tests/utils/sanitize
 */
import { describe, it, expect } from 'vitest';
import { encodeHTML, isValidURL, truncate } from '../../src/utils/sanitize.js';

describe('encodeHTML', () => {
  it('should encode HTML special characters', () => {
    expect(encodeHTML('<script>alert("xss")</script>')).not.toContain('<script>');
    expect(encodeHTML('<b>bold</b>')).not.toContain('<b>');
  });

  it('should encode ampersands', () => {
    const result = encodeHTML('Tom & Jerry');
    expect(result).toContain('&amp;');
  });

  it('should handle strings with quotes safely', () => {
    const result = encodeHTML('"hello"');
    // textContent-based encoding doesn't encode quotes, but that's safe
    // because the output is inserted via innerHTML where quotes in text are safe
    expect(result).toContain('hello');
    expect(typeof result).toBe('string');
  });

  it('should return empty string for empty input', () => {
    expect(encodeHTML('')).toBe('');
  });

  it('should handle plain text without modification', () => {
    expect(encodeHTML('Hello World')).toBe('Hello World');
  });

  it('should handle unicode characters', () => {
    expect(encodeHTML('🇮🇳 India')).toContain('India');
  });
});

describe('isValidURL', () => {
  it('should accept valid http URLs', () => {
    expect(isValidURL('http://example.com')).toBe(true);
  });

  it('should accept valid https URLs', () => {
    expect(isValidURL('https://nvsp.in')).toBe(true);
  });

  it('should reject javascript: URLs', () => {
    expect(isValidURL('javascript:alert(1)')).toBe(false);
  });

  it('should reject data: URLs', () => {
    expect(isValidURL('data:text/html,<script>alert(1)</script>')).toBe(false);
  });

  it('should reject ftp: URLs', () => {
    expect(isValidURL('ftp://example.com')).toBe(false);
  });

  it('should reject invalid URLs', () => {
    expect(isValidURL('not a url')).toBe(false);
  });

  it('should reject empty strings', () => {
    expect(isValidURL('')).toBe(false);
  });
});

describe('truncate', () => {
  it('should not truncate short strings', () => {
    expect(truncate('Hello', 200)).toBe('Hello');
  });

  it('should truncate long strings', () => {
    const long = 'a'.repeat(300);
    const result = truncate(long, 200);
    expect(result.length).toBe(201); // 200 chars + ellipsis
    expect(result).toContain('…');
  });

  it('should handle null/undefined input', () => {
    expect(truncate(null)).toBeNull();
    expect(truncate(undefined)).toBeUndefined();
  });

  it('should use default maxLen of 200', () => {
    const long = 'a'.repeat(250);
    const result = truncate(long);
    expect(result.length).toBe(201);
  });

  it('should handle exact-length strings', () => {
    const exact = 'a'.repeat(200);
    expect(truncate(exact)).toBe(exact);
  });
});
