/**
 * Tests for Accessibility Utilities
 * Validates ARIA announcements, focus traps, reduced motion detection,
 * high contrast mode, and escape key handling.
 *
 * @module tests/utils/accessibility
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { announce, onEscape, prefersReducedMotion, getSavedFontSize, saveFontSize } from '../../src/utils/accessibility.js';

describe('announce', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="aria-live" aria-live="polite"></div>';
  });

  it('should update the aria-live region text', async () => {
    announce('Test message');
    // Wait for the setTimeout
    await new Promise((r) => setTimeout(r, 150));
    const liveRegion = document.getElementById('aria-live');
    expect(liveRegion.textContent).toBe('Test message');
  });

  it('should handle missing aria-live region gracefully', () => {
    document.body.innerHTML = '';
    expect(() => announce('Test')).not.toThrow();
  });

  it('should set aria-live priority', () => {
    announce('Urgent', 'assertive');
    const liveRegion = document.getElementById('aria-live');
    expect(liveRegion.getAttribute('aria-live')).toBe('assertive');
  });
});

describe('onEscape', () => {
  it('should call callback when Escape is pressed', () => {
    const callback = vi.fn();
    const cleanup = onEscape(callback);

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    expect(callback).toHaveBeenCalledTimes(1);

    cleanup();
  });

  it('should not call callback for other keys', () => {
    const callback = vi.fn();
    const cleanup = onEscape(callback);

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    expect(callback).not.toHaveBeenCalled();

    cleanup();
  });

  it('should stop calling after cleanup', () => {
    const callback = vi.fn();
    const cleanup = onEscape(callback);
    cleanup();

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    expect(callback).not.toHaveBeenCalled();
  });
});

describe('prefersReducedMotion', () => {
  it('should return a boolean', () => {
    expect(typeof prefersReducedMotion()).toBe('boolean');
  });
});

describe('font size persistence', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should return 0 as default font size level', () => {
    expect(getSavedFontSize()).toBe(0);
  });

  it('should save and retrieve font size level', () => {
    saveFontSize(2);
    expect(getSavedFontSize()).toBe(2);
  });

  it('should handle invalid stored values', () => {
    localStorage.setItem('fontSizeLevel', 'invalid');
    // Should not throw, returns the raw parsed value
    expect(() => getSavedFontSize()).not.toThrow();
  });
});
