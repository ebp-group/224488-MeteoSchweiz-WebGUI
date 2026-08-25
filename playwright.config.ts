import {defineConfig} from '@playwright/test';

export default defineConfig({
  testDir: './e2e/tests',
  outputDir: './e2e/test-results',
  fullyParallel: false,
  reporter: [['list'], ['html', {outputFolder: './e2e/playwright-report', open: 'never'}]],
  use: {
    baseURL: 'http://localhost:4200',
    trace: 'on-first-retry',
  },
});
