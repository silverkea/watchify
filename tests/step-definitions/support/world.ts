import { Browser, BrowserContext, Page, chromium, firefox, webkit } from 'playwright';
import { setWorldConstructor } from '@cucumber/cucumber';

/**
 * Playwright World for Cucumber
 * 
 * This function creates a world instance that manages Playwright browser 
 * context and page instances shared across Cucumber step definitions.
 */
function PlaywrightWorld(this: any) {
  // Configuration from environment variables
  this.browserName = process.env.BROWSER || 'chromium';
  this.headless = !process.env.HEADED && !process.env.DEBUG;
  this.debug = !!process.env.DEBUG;
  
  /**
   * Initialize browser, context, and page before scenarios
   */
  this.init = async function(): Promise<void> {
    // Launch browser based on configuration
    switch (this.browserName) {
      case 'firefox':
        this.browser = await firefox.launch({ 
          headless: this.headless,
          slowMo: this.debug ? 500 : 0
        });
        break;
      case 'webkit':
        this.browser = await webkit.launch({ 
          headless: this.headless,
          slowMo: this.debug ? 500 : 0
        });
        break;
      default:
        this.browser = await chromium.launch({ 
          headless: this.headless,
          slowMo: this.debug ? 500 : 0
        });
    }

    // Create browser context with useful defaults
    this.context = await this.browser.newContext({
      // Set viewport for consistent testing
      viewport: { width: 1280, height: 720 },
      
      // Record videos on failure
      recordVideo: process.env.CI ? { dir: 'reports/videos/' } : undefined,
      
      // Set user agent
      userAgent: 'Playwright/Cucumber Test Runner',
      
      // Accept downloads
      acceptDownloads: true,
      
      // Ignore HTTPS errors for local development
      ignoreHTTPSErrors: true,
      
      // Set locale
      locale: 'en-US',
      
      // Set timezone
      timezoneId: 'America/New_York'
    });

    // Create new page
    this.page = await this.context.newPage();
    
    // Set default timeouts
    this.page.setDefaultTimeout(10000);
    this.page.setDefaultNavigationTimeout(15000);
    
    // Add console logging in debug mode
    if (this.debug) {
      this.page.on('console', (msg: any) => {
        console.log(`[Browser Console ${msg.type()}]: ${msg.text()}`);
      });
      
      this.page.on('pageerror', (error: Error) => {
        console.error(`[Page Error]: ${error.message}`);
      });
    }
  };

  /**
   * Clean up browser resources after scenarios
   */
  this.destroy = async function(): Promise<void> {
    if (this.page) {
      await this.page.close();
    }
    if (this.context) {
      await this.context.close();
    }
    if (this.browser) {
      await this.browser.close();
    }
  };

  /**
   * Navigate to a path relative to the base URL
   */
  this.goto = async function(path: string): Promise<void> {
    const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
    await this.page.goto(`${baseUrl}${path}`);
  };

  /**
   * Take a screenshot for debugging
   */
  this.screenshot = async function(name: string): Promise<void> {
    await this.page.screenshot({ 
      path: `reports/screenshots/${name}-${Date.now()}.png`,
      fullPage: true 
    });
  };

  /**
   * Wait for element to be visible
   */
  this.waitForElement = async function(selector: string, timeout: number = 5000): Promise<void> {
    await this.page.waitForSelector(selector, { 
      state: 'visible', 
      timeout 
    });
  };

  /**
   * Fill form input with typing animation
   */
  this.fillInput = async function(selector: string, value: string): Promise<void> {
    await this.page.fill(selector, value);
    if (this.debug) {
      await this.page.waitForTimeout(500); // Visual delay in debug mode
    }
  };

  /**
   * Click element with optional waiting
   */
  this.clickElement = async function(selector: string): Promise<void> {
    await this.page.click(selector);
    if (this.debug) {
      await this.page.waitForTimeout(300); // Visual delay in debug mode
    }
  };
}

// Set the World constructor for Cucumber
setWorldConstructor(PlaywrightWorld);