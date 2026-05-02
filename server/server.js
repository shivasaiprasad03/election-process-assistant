/**
 * Express Backend Server
 * Serves static files with hardened security headers, rate limiting,
 * and structured error handling. Health endpoint for monitoring.
 *
 * @module server
 */
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = parseInt(process.env.PORT, 10) || 3001;

/**
 * Allowed origins for CORS — restrict to known domains.
 * Add your production domain here.
 * @type {string[]}
 */
const ALLOWED_ORIGINS = [
  'http://localhost:5173',
  'http://localhost:3001',
  'https://election-assistent-27694.web.app',
  'https://election-assistent-27694.firebaseapp.com',
];

// --- Middleware Stack ---

/**
 * CORS — Restrict to known origins instead of wildcard.
 * Prevents unauthorized cross-origin requests.
 */
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (server-to-server, curl, mobile apps)
    if (!origin || ALLOWED_ORIGINS.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST'],
  credentials: false,
  maxAge: 86400, // Cache preflight for 24 hours
}));

/**
 * Helmet — Comprehensive HTTP security headers.
 * Configures CSP, HSTS, and other protective headers.
 */
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: [
        "'self'",
        "'unsafe-inline'",
        'https://www.googletagmanager.com',
        'https://translate.google.com',
        'https://translate.googleapis.com',
      ],
      styleSrc: [
        "'self'",
        "'unsafe-inline'",
        'https://fonts.googleapis.com',
        'https://translate.googleapis.com',
      ],
      fontSrc: ["'self'", 'https://fonts.gstatic.com'],
      imgSrc: ["'self'", 'data:', 'https:', 'blob:'],
      connectSrc: [
        "'self'",
        'https://www.google-analytics.com',
        'https://translate.googleapis.com',
      ],
      frameSrc: [
        "'self'",
        'https://www.google.com',
        'https://translate.google.com',
      ],
      objectSrc: ["'none'"],
      baseUri: ["'self'"],
      formAction: ["'self'"],
      upgradeInsecureRequests: [],
    },
  },
  crossOriginEmbedderPolicy: false, // Allow Google embeds
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  hsts: { maxAge: 31536000, includeSubDomains: true, preload: true },
}));

/**
 * Additional security headers not covered by Helmet defaults.
 */
app.use((_req, res, next) => {
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  next();
});

/**
 * Rate Limiter — Prevent brute force and abuse.
 * Limits each IP to 100 requests per 15 minutes.
 */
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' },
  handler: (_req, res, _next, options) => {
    res.status(options.statusCode).json(options.message);
  },
});
app.use('/api/', apiLimiter);

/** Parse JSON bodies with strict size limit to prevent payload attacks */
app.use(express.json({ limit: '10kb' }));

// --- Routes ---

/**
 * Health check endpoint for monitoring and CI/CD pipelines.
 * @route GET /api/health
 * @returns {{ status: string, timestamp: string, uptime: number }} Server health info
 */
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: Math.floor(process.uptime()),
    version: '1.0.0',
  });
});

/**
 * Serve static files from the production build directory.
 * Sets cache headers for optimal performance.
 */
app.use(express.static(join(__dirname, '..', 'dist'), {
  maxAge: '1d',
  etag: true,
  lastModified: true,
  setHeaders: (res, filePath) => {
    // Cache static assets aggressively, HTML files less so
    if (filePath.endsWith('.html')) {
      res.setHeader('Cache-Control', 'no-cache');
    } else if (filePath.match(/\.(js|css|woff2?|ttf|eot)$/)) {
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    }
  },
}));

/**
 * SPA fallback — serve index.html for all unmatched routes.
 * Enables client-side routing without 404s.
 */
app.get('*', (_req, res) => {
  res.sendFile(join(__dirname, '..', 'dist', 'index.html'));
});

// --- Error Handling ---

/**
 * Global error handler — catches unhandled errors.
 * Logs error details for debugging while returning safe messages to clients.
 *
 * @param {Error} err - The error object
 * @param {import('express').Request} _req - Express request
 * @param {import('express').Response} res - Express response
 * @param {import('express').NextFunction} _next - Express next function
 */
app.use((err, _req, res, _next) => {
  const timestamp = new Date().toISOString();
  console.error(`[${timestamp}] Server error:`, err.message);

  // Don't leak stack traces in production
  const isDev = process.env.NODE_ENV !== 'production';
  res.status(err.status || 500).json({
    error: 'Internal server error',
    ...(isDev && { detail: err.message }),
  });
});

// --- Server Startup ---

/** @type {import('http').Server|null} Active server instance */
let server = null;

/**
 * Start the Express server with error recovery and graceful shutdown.
 */
function startServer() {
  server = app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`);
  }).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.warn(`⚠️  Port ${PORT} is in use. Trying ${PORT + 1}...`);
      server = app.listen(PORT + 1, () => {
        console.log(`🚀 Server running on http://localhost:${PORT + 1}`);
      });
    } else {
      console.error('❌ Server startup error:', err.message);
      process.exit(1);
    }
  });
}

/**
 * Graceful shutdown handler — closes connections cleanly
 * before the process exits. Prevents data loss and connection leaks.
 *
 * @param {string} signal - The OS signal received (e.g., SIGTERM, SIGINT)
 */
function gracefulShutdown(signal) {
  console.log(`\n⏳ Received ${signal}. Shutting down gracefully...`);
  if (server) {
    server.close(() => {
      console.log('✅ Server closed. Goodbye!');
      process.exit(0);
    });
    // Force shutdown after 10 seconds if connections don't close
    setTimeout(() => {
      console.warn('⚠️  Forcing shutdown after timeout.');
      process.exit(1);
    }, 10000);
  } else {
    process.exit(0);
  }
}

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

startServer();

/** Export app for testing with supertest */
export { app };
