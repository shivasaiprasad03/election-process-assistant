import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['tests/**/*.test.js'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov', 'html'],
      include: ['src/**/*.js', 'server/**/*.js'],
      exclude: ['src/styles/**', 'node_modules/**'],
    },
    setupFiles: ['./tests/setup.js'],
  },
});
