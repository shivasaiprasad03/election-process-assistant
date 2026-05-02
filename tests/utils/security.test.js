/**
 * Tests for Security Utilities
 * Validates localStorage wrappers, input validation, rate limiting, and URL security.
 *
 * @module tests/utils/security
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { safeGetStorage, safeSetStorage, validateInput, createRateLimiter, isSecureURL } from '../../src/utils/security.js';

describe('safeGetStorage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should return default for missing keys', () => {
    expect(safeGetStorage('nonexistent', 'default')).toBe('default');
  });

  it('should return stored value', () => {
    localStorage.setItem('test', JSON.stringify('hello'));
    expect(safeGetStorage('test')).toBe('hello');
  });

  it('should return default for invalid JSON', () => {
    localStorage.setItem('bad', '{invalid json');
    expect(safeGetStorage('bad', 'fallback')).toBe('fallback');
  });

  it('should return null as default when no default specified', () => {
    expect(safeGetStorage('missing')).toBeNull();
  });
});

describe('safeSetStorage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should store and retrieve values', () => {
    safeSetStorage('key', { a: 1 });
    expect(safeGetStorage('key')).toEqual({ a: 1 });
  });

  it('should return true on success', () => {
    expect(safeSetStorage('key', 'value')).toBe(true);
  });
});

describe('validateInput', () => {
  it('should trim whitespace', () => {
    expect(validateInput('  hello  ')).toBe('hello');
  });

  it('should enforce max length', () => {
    const long = 'a'.repeat(600);
    expect(validateInput(long, 500).length).toBe(500);
  });

  it('should remove control characters', () => {
    expect(validateInput('hello\x00world')).toBe('helloworld');
  });

  it('should return empty string for non-string input', () => {
    expect(validateInput(null)).toBe('');
    expect(validateInput(123)).toBe('');
    expect(validateInput(undefined)).toBe('');
  });

  it('should preserve normal text', () => {
    expect(validateInput('How do I register to vote?')).toBe('How do I register to vote?');
  });

  it('should preserve unicode', () => {
    expect(validateInput('🇮🇳 India')).toBe('🇮🇳 India');
  });
});

describe('createRateLimiter', () => {
  it('should allow requests within limit', () => {
    const limiter = createRateLimiter(3, 1000);
    expect(limiter.canProceed()).toBe(true);
    expect(limiter.canProceed()).toBe(true);
    expect(limiter.canProceed()).toBe(true);
  });

  it('should block requests exceeding limit', () => {
    const limiter = createRateLimiter(2, 60000);
    limiter.canProceed();
    limiter.canProceed();
    expect(limiter.canProceed()).toBe(false);
  });

  it('should reset correctly', () => {
    const limiter = createRateLimiter(1, 60000);
    limiter.canProceed();
    expect(limiter.canProceed()).toBe(false);
    limiter.reset();
    expect(limiter.canProceed()).toBe(true);
  });
});

describe('isSecureURL', () => {
  it('should accept https URLs', () => {
    expect(isSecureURL('https://eci.gov.in')).toBe(true);
  });

  it('should accept http URLs', () => {
    expect(isSecureURL('http://example.com')).toBe(true);
  });

  it('should reject javascript: protocol', () => {
    expect(isSecureURL('javascript:alert(1)')).toBe(false);
  });

  it('should reject data: protocol', () => {
    expect(isSecureURL('data:text/html,test')).toBe(false);
  });

  it('should reject invalid URLs', () => {
    expect(isSecureURL('not-a-url')).toBe(false);
  });
});
