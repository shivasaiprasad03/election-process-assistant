/**
 * Google Analytics Wrapper
 * Privacy-respecting: honors Do Not Track
 */

const GA_ID = ''; // Set your GA measurement ID here, e.g. 'G-XXXXXXXXXX'

/**
 * Initialize Google Analytics (only if GA_ID is set and DNT is not enabled)
 */
export function initAnalytics() {
  if (!GA_ID) return;
  if (navigator.doNotTrack === '1' || window.doNotTrack === '1') {
    console.log('[Analytics] Do Not Track enabled — analytics disabled.');
    return;
  }

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = gtag;
  gtag('js', new Date());
  gtag('config', GA_ID, { anonymize_ip: true });
}

/**
 * Track a custom event
 */
export function trackEvent(eventName, params = {}) {
  if (window.gtag) {
    window.gtag('event', eventName, params);
  }
}

/**
 * Track a page view
 */
export function trackPageView(path) {
  if (window.gtag) {
    window.gtag('event', 'page_view', { page_path: path });
  }
}
