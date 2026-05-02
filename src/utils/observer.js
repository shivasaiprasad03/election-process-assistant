/**
 * Shared IntersectionObserver Utility
 * Centralizes scroll-reveal functionality to avoid duplicate observers across components.
 * Improves memory efficiency by reusing a single observer instance.
 *
 * @module utils/observer
 */

/** @type {IntersectionObserver|null} Shared observer instance */
let sharedObserver = null;

/** @type {number} Reference count for cleanup tracking */
let observerRefCount = 0;

/**
 * Default configuration for the shared IntersectionObserver.
 * @type {IntersectionObserverInit}
 */
const DEFAULT_OPTIONS = {
  threshold: 0.1,
  rootMargin: '0px 0px -40px 0px',
};

/**
 * Returns the shared IntersectionObserver instance.
 * Creates one if it doesn't exist. Uses a singleton pattern
 * to avoid creating multiple observers for the same purpose.
 *
 * @returns {IntersectionObserver} The shared observer instance
 */
function getSharedObserver() {
  if (!sharedObserver) {
    sharedObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          sharedObserver.unobserve(entry.target);
        }
      });
    }, DEFAULT_OPTIONS);
  }
  observerRefCount++;
  return sharedObserver;
}

/**
 * Observe multiple elements for scroll-triggered reveal animations.
 * Uses the shared observer to minimize resource usage.
 *
 * @param {NodeListOf<Element>|Element[]} elements - Elements to observe
 * @returns {Function} Cleanup function to unobserve all elements
 */
export function observeRevealElements(elements) {
  const observer = getSharedObserver();
  const observed = [];

  elements.forEach((el) => {
    observer.observe(el);
    observed.push(el);
  });

  return function cleanup() {
    observed.forEach((el) => {
      if (sharedObserver) {
        sharedObserver.unobserve(el);
      }
    });
    observerRefCount--;
    if (observerRefCount <= 0 && sharedObserver) {
      sharedObserver.disconnect();
      sharedObserver = null;
      observerRefCount = 0;
    }
  };
}

/**
 * Create a custom IntersectionObserver for specific use cases
 * (e.g., different thresholds for counter animations).
 *
 * @param {IntersectionObserverCallback} callback - Observer callback
 * @param {IntersectionObserverInit} [options] - Observer options
 * @returns {IntersectionObserver} A new observer instance
 */
export function createObserver(callback, options = {}) {
  return new IntersectionObserver(callback, {
    ...DEFAULT_OPTIONS,
    ...options,
  });
}

/**
 * Debounce function for performance-sensitive operations.
 * Limits the rate at which a function can fire.
 *
 * @param {Function} fn - Function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} Debounced function with cancel method
 */
export function debounce(fn, delay = 250) {
  let timeoutId;

  /** @type {Function & { cancel: Function }} */
  const debounced = function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), delay);
  };

  debounced.cancel = () => clearTimeout(timeoutId);

  return debounced;
}

/**
 * Throttle function for scroll and resize handlers.
 * Ensures a function is called at most once per interval.
 *
 * @param {Function} fn - Function to throttle
 * @param {number} interval - Minimum interval between calls in ms
 * @returns {Function} Throttled function
 */
export function throttle(fn, interval = 100) {
  let lastTime = 0;
  let timeoutId;

  return function (...args) {
    const now = Date.now();
    const remaining = interval - (now - lastTime);

    if (remaining <= 0) {
      clearTimeout(timeoutId);
      lastTime = now;
      fn.apply(this, args);
    } else if (!timeoutId) {
      timeoutId = setTimeout(() => {
        lastTime = Date.now();
        timeoutId = null;
        fn.apply(this, args);
      }, remaining);
    }
  };
}
