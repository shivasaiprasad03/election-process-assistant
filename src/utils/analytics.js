/**
 * Google Analytics 4 Integration
 * Full event tracking with privacy controls and performance monitoring.
 * Honors Do Not Track preferences.
 *
 * @module utils/analytics
 */

/**
 * Google Analytics Measurement ID.
 * Set via environment or replace this placeholder with your GA4 ID.
 * Format: 'G-XXXXXXXXXX'
 * @type {string}
 */
const GA_ID = 'G-PLACEHOLDER';

/** @type {boolean} Whether analytics has been initialized */
let isInitialized = false;

/**
 * Initialize Google Analytics (only if GA_ID is set and DNT is not enabled).
 * Loads the gtag.js script asynchronously and configures the data stream.
 *
 * @returns {void}
 */
export function initAnalytics() {
  if (!GA_ID || GA_ID === 'G-PLACEHOLDER') {
    console.log('[Analytics] No GA measurement ID configured — analytics disabled.');
    return;
  }

  // Respect Do Not Track browser setting
  if (navigator.doNotTrack === '1' || window.doNotTrack === '1') {
    console.log('[Analytics] Do Not Track enabled — analytics disabled.');
    return;
  }

  try {
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA_ID)}`;
    script.onerror = () => {
      console.warn('[Analytics] Failed to load Google Analytics script.');
    };
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    function gtag() { window.dataLayer.push(arguments); }
    window.gtag = gtag;

    gtag('js', new Date());
    gtag('config', GA_ID, {
      anonymize_ip: true,
      cookie_flags: 'SameSite=None;Secure',
      send_page_view: true,
    });

    isInitialized = true;
    console.log('[Analytics] Initialized successfully.');
  } catch (err) {
    console.error('[Analytics] Initialization error:', err.message);
  }
}

/**
 * Track a custom event in Google Analytics.
 * Safe to call even if analytics hasn't been initialized.
 *
 * @param {string} eventName - Event name (e.g., 'quiz_answer', 'chatbot_query')
 * @param {Object} [params={}] - Additional event parameters
 * @returns {void}
 */
export function trackEvent(eventName, params = {}) {
  if (!isInitialized || !window.gtag) return;

  try {
    window.gtag('event', eventName, {
      ...params,
      event_timestamp: Date.now(),
    });
  } catch (_err) {
    // Silently fail — analytics should never break the app
  }
}

/**
 * Track a page/section view.
 *
 * @param {string} pagePath - Path or section identifier
 * @param {string} [pageTitle] - Optional page title
 * @returns {void}
 */
export function trackPageView(pagePath, pageTitle) {
  if (!isInitialized || !window.gtag) return;

  try {
    window.gtag('event', 'page_view', {
      page_path: pagePath,
      page_title: pageTitle || document.title,
    });
  } catch (_err) {
    // Silently fail
  }
}

/**
 * Track scroll depth milestones (25%, 50%, 75%, 100%).
 * Call this once on page load to enable scroll tracking.
 *
 * @returns {Function} Cleanup function to remove scroll listener
 */
export function trackScrollDepth() {
  const milestones = new Set([25, 50, 75, 100]);
  const reached = new Set();

  function onScroll() {
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (scrollHeight <= 0) return;

    const scrollPercent = Math.round((window.scrollY / scrollHeight) * 100);

    milestones.forEach((milestone) => {
      if (scrollPercent >= milestone && !reached.has(milestone)) {
        reached.add(milestone);
        trackEvent('scroll_depth', {
          depth_percentage: milestone,
          depth_pixels: Math.round(window.scrollY),
        });
      }
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  return () => window.removeEventListener('scroll', onScroll);
}

// --- Pre-built event helpers for common interactions ---

/**
 * Track quiz-related events.
 *
 * @param {string} action - 'start', 'answer', 'complete', 'retry'
 * @param {Object} [details={}] - Additional details
 */
export function trackQuizEvent(action, details = {}) {
  trackEvent('quiz_interaction', {
    quiz_action: action,
    ...details,
  });
}

/**
 * Track chatbot interactions.
 *
 * @param {string} action - 'open', 'close', 'message', 'quick_reply'
 * @param {Object} [details={}] - Additional details
 */
export function trackChatEvent(action, details = {}) {
  trackEvent('chatbot_interaction', {
    chat_action: action,
    ...details,
  });
}

/**
 * Track timeline/step interactions.
 *
 * @param {string} action - 'view_step', 'open_detail', 'close_detail'
 * @param {Object} [details={}] - Additional details
 */
export function trackTimelineEvent(action, details = {}) {
  trackEvent('timeline_interaction', {
    timeline_action: action,
    ...details,
  });
}

/**
 * Track accessibility feature usage.
 *
 * @param {string} feature - 'theme_toggle', 'font_size', 'high_contrast', 'translate'
 * @param {Object} [details={}] - Additional details
 */
export function trackA11yEvent(feature, details = {}) {
  trackEvent('accessibility_feature', {
    feature_name: feature,
    ...details,
  });
}

/**
 * Track FAQ interactions.
 *
 * @param {string} action - 'expand', 'collapse'
 * @param {Object} [details={}] - Additional details
 */
export function trackFAQEvent(action, details = {}) {
  trackEvent('faq_interaction', {
    faq_action: action,
    ...details,
  });
}
