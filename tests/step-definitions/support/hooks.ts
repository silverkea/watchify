import { Before, After, BeforeAll, AfterAll, Status } from '@cucumber/cucumber';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Cucumber Hooks for Playwright Browser Management
 * 
 * These hooks manage the browser lifecycle and provide
 * debugging capabilities for failed scenarios.
 */

let globalBrowserSetup = false;

/**
 * Global setup - runs once before all scenarios
 */
BeforeAll(async function () {
  console.log('🎭 Starting Playwright browser automation tests...');
  
  // Ensure reports directory exists
  const dirs = [
    'reports',
    'reports/screenshots', 
    'reports/videos',
    'reports/har'
  ];
  
  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
  
  globalBrowserSetup = true;
});

/**
 * Before each scenario - initialize browser context
 */
Before(async function (scenario) {
  console.log(`🚀 Starting scenario: ${scenario.pickle.name}`);
  
  // Initialize browser, context, and page
  await this.init();
  
  // Add scenario metadata to page for debugging
  await this.page.addInitScript((scenarioName: string) => {
    (window as any).__SCENARIO_NAME__ = scenarioName;
  }, scenario.pickle.name);
});

/**
 * After each scenario - cleanup and capture failure artifacts
 */
After(async function (scenario) {
  const scenarioName = scenario.pickle.name.replace(/[^a-zA-Z0-9]/g, '-');
  
  // If scenario failed, capture debugging information
  if (scenario.result?.status === Status.FAILED) {
    console.log(`❌ Scenario failed: ${scenario.pickle.name}`);
    
    try {
      // Take screenshot on failure
      await this.screenshot(`failed-${scenarioName}`);
      
      // Log page URL and title for debugging
      const url = this.page.url();
      const title = await this.page.title();
      console.log(`📍 Failure context: ${title} (${url})`);
      
      // Log browser console errors
      const logs = await this.page.evaluate(() => {
        const errors: string[] = [];
        // Return any JavaScript errors that occurred
        return errors;
      });
      
      if (logs.length > 0) {
        console.log('🐛 Browser console errors:', logs);
      }
      
      // Attach screenshot to Cucumber report
      const screenshotPath = `reports/screenshots/failed-${scenarioName}-${Date.now()}.png`;
      const screenshot = await this.page.screenshot({ path: screenshotPath, fullPage: true });
      this.attach(screenshot, 'image/png');
      
    } catch (error) {
      console.error('Error capturing failure artifacts:', error);
    }
  } else {
    console.log(`✅ Scenario passed: ${scenario.pickle.name}`);
  }
  
  // Always cleanup browser resources
  await this.destroy();
});

/**
 * Global cleanup - runs once after all scenarios
 */
AfterAll(async function () {
  console.log('🏁 Playwright browser automation tests completed');
  
  // Generate test report summary
  const reportPath = 'reports/test-summary.json';
  
  const summary = {
    timestamp: new Date().toISOString(),
    browser: process.env.BROWSER || 'chromium',
    headless: !process.env.HEADED && !process.env.DEBUG,
    baseUrl: process.env.BASE_URL || 'http://localhost:3000'
  };
  
  fs.writeFileSync(reportPath, JSON.stringify(summary, null, 2));
  console.log(`📊 Test summary written to ${reportPath}`);
});