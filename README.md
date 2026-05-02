# 🗳️ Election Process Assistant

An interactive, accessible web application that helps users understand the Indian election process through an engaging timeline, smart Q&A, and rich visual experiences.

Live site: https://election-assistent-27694.web.app/

![License](https://img.shields.io/badge/License-MIT-green)
![No API Key](https://img.shields.io/badge/API%20Key-Not%20Required-brightgreen)

## ✨ Features

- **Interactive Timeline** — 7-stage visual journey through the election process with scroll animations
- **Smart Chatbot** — Built-in knowledge base covering 18+ election topics — no API key needed!
- **Animated Counters** — Live-counting hero stats showcasing India's election scale
- **Knowledge Quiz** — 10-question quiz with progress tracking and confetti celebrations
- **Map Explorer** — Google Maps integration to explore constituencies
- **FAQ Accordion** — Common voting questions with smooth expand/collapse
- **Dark/Light Mode** — Beautiful theming with Indian tricolor-inspired palette
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

> **No API key required!** The chatbot runs entirely client-side with a comprehensive built-in knowledge base.

## 🏗 Architecture

```
├── server/           # Express backend (static files + security headers)
│   └── server.js     # Server with Helmet CSP headers
├── src/
│   ├── main.js       # App entry + router
│   ├── components/   # UI components (Header, Hero, Timeline, etc.)
│   ├── data/         # Election data, quiz questions, FAQs
│   ├── styles/       # Design system + component styles
│   └── utils/        # Sanitization, accessibility, analytics
├── index.html        # Entry HTML with SEO + JSON-LD
├── vite.config.js    # Vite + dev proxy config
└── package.json
```

## 🎨 Tech Stack

| Technology | Purpose |
|---|---|
| Vanilla JS | Zero-framework frontend for performance |
| Vite | Build tool + HMR dev server |
| Express | Backend server with security headers |
| Google Maps Embed | Constituency explorer |
| Google Fonts | Inter + Outfit typography |
| DOMPurify | XSS prevention |
| Helmet | Security headers |

## ♿ Accessibility

- Semantic HTML5 with ARIA labels
- Skip-to-content link
- Focus trap in modals
- Keyboard navigation throughout
- Screen reader live region announcements
- Reduced motion support
- High contrast support
- Font size controls

## 🔒 Security

- Input sanitization via DOMPurify
- CSP headers via Helmet
- Sandboxed iframes
- No `eval()` or raw `innerHTML`

## 📄 License

MIT — Built with ❤️ for Indian Democracy
