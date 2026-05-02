# 🗳️ Election Process Assistant

An interactive, accessible web application that helps users understand the Indian election process through an engaging timeline, smart Q&A, and rich visual experiences.

**Live site:** https://election-assistent-27694.web.app/

![License](https://img.shields.io/badge/License-MIT-green)
![No API Key](https://img.shields.io/badge/API%20Key-Not%20Required-brightgreen)
![Tests](https://img.shields.io/badge/Tests-101%20passing-brightgreen)
![Coverage](https://img.shields.io/badge/Coverage-Vitest-blue)

## ✨ Features

- **Interactive Timeline** — 7-stage visual journey through the election process with scroll animations
- **Smart Chatbot** — Built-in knowledge base covering 18+ election topics — no API key needed!
- **Animated Counters** — Live-counting hero stats showcasing India's election scale
- **Knowledge Quiz** — 10-question quiz with progress tracking and confetti celebrations
- **Election Insights Dashboard** — State statistics, voter turnout charts, and historic milestones
- **FAQ Accordion** — Common voting questions with smooth expand/collapse
- **Dark/Light Mode** — Beautiful theming with Indian tricolor-inspired palette
- **High Contrast Mode** — Enhanced visibility for users with low vision
- **Multi-language Support** — Google Translate integration for 14+ Indian languages
- **Fully Accessible** — WCAG AA compliant, keyboard navigable, screen reader friendly
- **Responsive Design** — Works beautifully on mobile, tablet, and desktop

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm 9+

### Setup

```bash
# 1. Install dependencies
npm install

# 2. Start development — no configuration needed!
npm run dev
```

The app runs on `http://localhost:5173` (frontend) and `http://localhost:3001` (server).

### Production Build

```bash
npm run build
npm start
```

### Testing

```bash
# Run all tests
npm test

# Run with coverage report
npm run test:coverage

# Run in watch mode during development
npm run test:watch

# Lint code
npm run lint
```

> **No API key required!** The chatbot runs entirely client-side with a comprehensive built-in knowledge base.

## 🏗 Architecture

```
├── server/              # Express backend (static files + security headers)
│   ├── server.js        # Server with Helmet CSP, rate limiting, graceful shutdown
│   ├── .env.example     # Environment variable template
├── src/
│   ├── main.js          # App entry + error-isolated component mounting
│   ├── components/      # UI components (Header, Hero, Timeline, etc.)
│   ├── data/            # Election data, quiz questions, FAQs
│   ├── styles/          # Design system + component + animation styles
│   └── utils/           # Sanitization, accessibility, analytics, security, observer
├── tests/               # Vitest test suites (101 tests)
│   ├── components/      # Component tests (Chatbot KB matching)
│   ├── data/            # Data integrity tests
│   └── utils/           # Utility tests (sanitize, security, a11y, observer)
├── index.html           # Entry HTML with SEO, JSON-LD, Google Translate
├── vite.config.js       # Vite build + dev proxy config
├── vitest.config.js     # Test runner configuration
└── package.json
```

## 🎨 Tech Stack

| Technology | Purpose |
|---|---|
| Vanilla JS (ES2020) | Zero-framework frontend for performance |
| Vite | Build tool + HMR dev server |
| Express | Backend server with security headers |
| Google Fonts | Inter + Outfit typography |
| Google Maps Embed | ECI headquarters location in footer |
| Google Translate | Multi-language support (14+ Indian languages) |
| Google Analytics 4 | User interaction tracking (privacy-respecting) |
| Firebase Hosting | Production deployment |
| DOMPurify | XSS prevention |
| Helmet | HTTP security headers |
| Vitest | Test runner with jsdom |

## 📊 Google Services Integration

| Service | Integration |
|---|---|
| **Google Fonts** | Inter + Outfit typefaces with preconnect for fast loading |
| **Google Analytics 4** | Full event tracking: quiz answers, chat queries, FAQ clicks, scroll depth, theme/a11y usage |
| **Google Translate** | In-header language switcher supporting Hindi, Tamil, Telugu, Bengali, Marathi, and 9 more languages |
| **Google Maps Embed** | Interactive map showing ECI headquarters in the footer |
| **Firebase Hosting** | Production deployment with CI/CD via GitHub Actions |

## ♿ Accessibility

- **Semantic HTML5** with ARIA labels, roles, and states
- **Skip-to-content** link for keyboard users
- **Focus trap** in modals and dialogs
- **Keyboard navigation** throughout all interactive elements
- **Screen reader** live region announcements (`aria-live`)
- **Reduced motion** support (`prefers-reduced-motion`) — disables particles, counters, confetti
- **High contrast** mode toggle (persisted in localStorage)
- **`forced-colors`** media query support (Windows High Contrast)
- **`prefers-contrast: more`** support
- **Font size controls** (3 levels, persisted)
- **Multi-language** support via Google Translate

## 🔒 Security

- **Input sanitization** via DOMPurify (XSS prevention)
- **CSP headers** via Helmet (script, style, connect, frame sources)
- **CORS whitelist** — restricted to known origins (not wildcard)
- **Rate limiting** — API endpoints protected via `express-rate-limit`
- **Client-side rate limiting** — Chatbot message spam prevention
- **Input validation** — Control character stripping, length limits
- **Secure localStorage** — Error-safe wrappers with quota handling
- **Sandboxed iframes** — Google Maps with `sandbox` attribute
- **No `eval()`** or dynamic code execution
- **Graceful shutdown** — SIGTERM/SIGINT handling for zero-downtime deploys
- **Security headers** — HSTS, Referrer-Policy, Permissions-Policy, X-Content-Type-Options

## 🧪 Testing

101 tests across 7 test suites:

| Suite | Tests | Coverage Area |
|---|---|---|
| `sanitize.test.js` | 18 | XSS prevention, URL validation, truncation |
| `security.test.js` | 20 | localStorage safety, input validation, rate limiting |
| `accessibility.test.js` | 10 | ARIA announcements, escape key, reduced motion |
| `analytics.test.js` | 7 | GA4 safety, event helpers |
| `observer.test.js` | 5 | Debounce, throttle utilities |
| `electionData.test.js` | 20 | Data integrity, required fields, valid values |
| `Chatbot.test.js` | 21 | KB search, greetings, fallback, case sensitivity |

## ⚡ Performance

- **Shared IntersectionObserver** — single instance reused across all components
- **DocumentFragment** — batch DOM insertion for particles and confetti
- **Event delegation** — reduced listener count across Timeline, FAQ, Quiz
- **Throttled scroll handlers** — 100ms interval for header scroll effect
- **Lazy DOMPurify** — imported on-demand to reduce initial bundle
- **CSS code splitting** — separate chunks for optimal caching
- **Aggressive caching** — immutable hashes for static assets (1 year)
- **Message history cap** — Chatbot limits DOM to 50 messages

## 📄 License

MIT — Built with ❤️ for Indian Democracy
