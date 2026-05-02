/**
 * Tests for Observer Utility
 * Validates debounce, throttle, and shared observer functionality.
 *
 * @module tests/utils/observer
 */
import { describe, it, expect, vi } from 'vitest';
import { debounce, throttle } from '../../src/utils/observer.js';

describe('debounce', () => {
  it('should delay function execution', async () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 100);

    debounced();
    expect(fn).not.toHaveBeenCalled();

    await new Promise((r) => setTimeout(r, 150));
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('should only execute once for rapid calls', async () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 100);

    debounced();
    debounced();
    debounced();

    await new Promise((r) => setTimeout(r, 150));
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('should support cancel', async () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 100);

    debounced();
    debounced.cancel();

    await new Promise((r) => setTimeout(r, 150));
    expect(fn).not.toHaveBeenCalled();
  });
});

describe('throttle', () => {
  it('should execute immediately on first call', () => {
    const fn = vi.fn();
    const throttled = throttle(fn, 100);

    throttled();
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('should limit execution frequency', async () => {
    const fn = vi.fn();
    const throttled = throttle(fn, 100);

    throttled();
    throttled();
    throttled();

    // First call executes immediately, rest are throttled
    expect(fn).toHaveBeenCalledTimes(1);

    await new Promise((r) => setTimeout(r, 150));
    // The last call should have executed after the interval
    expect(fn).toHaveBeenCalledTimes(2);
  });
});
