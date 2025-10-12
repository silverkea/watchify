import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright Configuration for Watchify E2E Tests
 * 
 * This configuration integrates Playwright with Cucumber for comprehensive
 * browser automation testing across multiple browsers and devices.
 */
export default defineConfig({
  // Test directory - points to where Playwright tests are located
  testDir: './tests/e2e',
  
  // Run tests in files matching this pattern
  testMatch: /.*\.spec\.ts$/,
  
  // Maximum time one test can run for
  timeout: 30 * 1000,
  
  // Test configuration
  expect: {
    // Maximum time expect() should wait for the condition to be met
    timeout: 5000
  },
  
  // Fail the build on CI if you accidentally left test.only in the source code
  forbidOnly: !!process.env.CI,
  
  // Retry on CI only
  retries: process.env.CI ? 2 : 0,
  
  // Opt out of parallel tests on CI
  workers: process.env.CI ? 1 : undefined,
  
  // Reporter to use
  reporter: [
    ['html', { outputFolder: 'reports/playwright-html' }],
    ['json', { outputFile: 'reports/playwright-results.json' }],
    ['line']
  ],
  
  // Shared settings for all the projects below
  use: {
    // Base URL to use in actions like `await page.goto('/')`
    baseURL: process.env.BASE_URL || 'http://localhost:3001',
    
    // Collect trace when retrying the failed test
    trace: 'on-first-retry',
    
    // Record screenshots on failure
    screenshot: 'only-on-failure',
    
    // Record videos on failure
    video: 'retain-on-failure',
    
    // Global test timeout
    actionTimeout: 10000,
    
    // Navigation timeout
    navigationTimeout: 15000
  },

  // Configure projects for major browsers
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    
    // Mobile testing
    {
      name: 'Mobile Chrome',
      use: { 
        ...devices['Pixel 5'],
        hasTouch: true
      },
    },
    
    {
      name: 'Mobile Safari',
      use: { 
        ...devices['iPhone 12'],
        hasTouch: true
      },
    },
    
    // Tablet testing
    {
      name: 'iPad',
      use: { 
        ...devices['iPad Pro'],
        hasTouch: true
      },
    }
  ],

  // Run your local dev server before starting the tests
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3001',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
});