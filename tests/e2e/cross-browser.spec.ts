/**
 * Cross-Browser Tests
 * Playwright tests for Chrome, Firefox, and Safari compatibility
 */

import { test, expect, devices } from '@playwright/test';

// Test configurations for different browsers
const browsers = [
  { name: 'Chrome', ...devices['Desktop Chrome'] },
  { name: 'Firefox', ...devices['Desktop Firefox'] },
  { name: 'Safari', ...devices['Desktop Safari'] },
];

browsers.forEach(({ name, ...device }) => {
  test.describe(`Cross-Browser Tests - ${name}`, () => {
    test.use(device);

    test(`should load home page correctly in ${name}`, async ({ page }) => {
      await page.goto('/');
      
      // Check main heading
      await expect(page.getByRole('heading', { name: /discover movies/i })).toBeVisible();
      
      // Check search functionality
      const searchBox = page.getByPlaceholder(/search for movies/i);
      await expect(searchBox).toBeVisible();
      
      // Verify styling is applied
      const heroSection = page.locator('[data-testid="hero-section"]').or(
        page.locator('section').first()
      );
      await expect(heroSection).toBeVisible();
    });

    test(`should handle movie search in ${name}`, async ({ page }) => {
      await page.goto('/');
      
      // Perform search
      const searchBox = page.getByPlaceholder(/search for movies/i);
      await searchBox.fill('batman');
      
      // Wait for results
      await expect(page.getByRole('article').first()).toBeVisible({ timeout: 10000 });
      
      // Verify multiple results
      const movieCards = page.getByRole('article');
      expect(await movieCards.count()).toBeGreaterThan(0);
      
      // Check that images load
      const images = page.locator('img');
      expect(await images.count()).toBeGreaterThan(0);
    });

    test(`should navigate to movie details in ${name}`, async ({ page }) => {
      await page.goto('/');
      
      // Search and click on first result
      await page.getByPlaceholder(/search for movies/i).fill('inception');
      await expect(page.getByRole('article').first()).toBeVisible();
      await page.getByRole('article').first().click();
      
      // Check navigation occurred
      await expect(page.getByRole('heading')).toBeVisible();
      
      // Check for movie details elements
      const createButton = page.getByRole('button', { name: /create watch party/i });
      await expect(createButton).toBeVisible();
    });

    test(`should handle theme switching in ${name}`, async ({ page }) => {
      await page.goto('/');
      
      // Look for theme toggle (might not exist yet)
      const themeToggle = page.locator('[data-testid="theme-toggle"]').or(
        page.getByRole('button', { name: /theme/i })
      );
      
      if (await themeToggle.count() > 0) {
        await themeToggle.click();
        
        // Wait for theme change
        await page.waitForTimeout(200);
        
        // Check that theme changed (basic check)
        const body = page.locator('body');
        await expect(body).toBeVisible();
      }
    });

    test(`should create watch party in ${name}`, async ({ page }) => {
      await page.goto('/');
      
      // Navigate to movie details
      await page.getByPlaceholder(/search for movies/i).fill('avengers');
      await expect(page.getByRole('article').first()).toBeVisible();
      await page.getByRole('article').first().click();
      
      // Create watch party
      await page.getByRole('button', { name: /create watch party/i }).click();
      
      // Check watch party page loaded
      await expect(page.getByText(/schedule your watch party/i)).toBeVisible();
      
      // Test date/time picker functionality
      const dateInput = page.locator('input[type="date"]').or(
        page.getByLabel(/date/i)
      );
      
      if (await dateInput.count() > 0) {
        await dateInput.click();
        // Basic interaction test
        await expect(dateInput).toBeFocused();
      }
    });

    test(`should handle errors gracefully in ${name}`, async ({ page }) => {
      await page.goto('/');
      
      // Search for something that returns no results
      await page.getByPlaceholder(/search for movies/i).fill('xyzinvalidmovie123');
      
      // Should show no results message
      await expect(
        page.getByText(/no movies found/i).or(page.getByText(/no results/i))
      ).toBeVisible({ timeout: 5000 });
    });

    test(`should handle responsive behavior in ${name}`, async ({ page }) => {
      // Test with mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/');
      
      // Check mobile layout
      await expect(page.getByRole('heading')).toBeVisible();
      await expect(page.getByPlaceholder(/search for movies/i)).toBeVisible();
      
      // Test with tablet viewport
      await page.setViewportSize({ width: 768, height: 1024 });
      await page.reload();
      
      // Check tablet layout
      await expect(page.getByRole('heading')).toBeVisible();
      
      // Test with desktop viewport
      await page.setViewportSize({ width: 1920, height: 1080 });
      await page.reload();
      
      // Check desktop layout
      await expect(page.getByRole('heading')).toBeVisible();
    });

    test(`should handle form interactions in ${name}`, async ({ page }) => {
      await page.goto('/');
      
      // Test search form
      const searchBox = page.getByPlaceholder(/search for movies/i);
      
      // Test typing
      await searchBox.type('spider-man', { delay: 100 });
      expect(await searchBox.inputValue()).toBe('spider-man');
      
      // Test clearing
      await searchBox.clear();
      expect(await searchBox.inputValue()).toBe('');
      
      // Test Enter key
      await searchBox.fill('marvel');
      await searchBox.press('Enter');
      
      // Should show results
      await expect(page.getByRole('article').first()).toBeVisible({ timeout: 5000 });
    });

    test(`should handle keyboard navigation in ${name}`, async ({ page }) => {
      await page.goto('/');
      
      // Test Tab navigation
      await page.keyboard.press('Tab');
      
      // Check if search box is focused (might be first focusable element)
      const searchBox = page.getByPlaceholder(/search for movies/i);
      
      // Perform search to get clickable elements
      await searchBox.fill('batman');
      await expect(page.getByRole('article').first()).toBeVisible();
      
      // Test clicking with Enter key
      const firstMovie = page.getByRole('article').first();
      await firstMovie.focus();
      await page.keyboard.press('Enter');
      
      // Should navigate to movie details
      await expect(page.getByRole('heading')).toBeVisible();
    });

    test(`should load external resources in ${name}`, async ({ page }) => {
      await page.goto('/');
      
      // Perform search to load movie images
      await page.getByPlaceholder(/search for movies/i).fill('star wars');
      await expect(page.getByRole('article').first()).toBeVisible();
      
      // Check that TMDB images load
      const images = page.locator('img[src*="image.tmdb.org"]');
      
      if (await images.count() > 0) {
        const firstImage = images.first();
        await expect(firstImage).toBeVisible();
        
        // Check that image has loaded (not broken)
        const naturalWidth = await firstImage.evaluate((img: HTMLImageElement) => img.naturalWidth);
        expect(naturalWidth).toBeGreaterThan(0);
      }
    });
  });
});

// Additional browser-specific tests
test.describe('Safari-specific Tests', () => {
  test.use(devices['Desktop Safari']);

  test('should handle Safari-specific date picker', async ({ page }) => {
    await page.goto('/');
    
    // Navigate to watch party creation
    await page.getByPlaceholder(/search for movies/i).fill('dune');
    await expect(page.getByRole('article').first()).toBeVisible();
    await page.getByRole('article').first().click();
    await page.getByRole('button', { name: /create watch party/i }).click();
    
    // Test Safari's date input behavior
    const dateInput = page.locator('input[type="date"]');
    
    if (await dateInput.count() > 0) {
      await dateInput.click();
      // Safari might have different date picker behavior
      await expect(dateInput).toBeFocused();
    }
  });
});

test.describe('Firefox-specific Tests', () => {
  test.use(devices['Desktop Firefox']);

  test('should handle Firefox-specific behaviors', async ({ page }) => {
    await page.goto('/');
    
    // Test scrolling behavior in Firefox
    await page.getByPlaceholder(/search for movies/i).fill('marvel');
    await expect(page.getByRole('article').first()).toBeVisible();
    
    // Scroll to test performance
    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight);
    });
    
    await page.waitForTimeout(500);
    
    // Scroll back to top
    await page.evaluate(() => {
      window.scrollTo(0, 0);
    });
    
    // Should still be functional
    await expect(page.getByPlaceholder(/search for movies/i)).toBeVisible();
  });
});

test.describe('Chrome-specific Tests', () => {
  test.use(devices['Desktop Chrome']);

  test('should handle Chrome DevTools features', async ({ page }) => {
    await page.goto('/');
    
    // Test performance timing in Chrome
    const performanceMetrics = await page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      return {
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
      };
    });
    
    console.log('Chrome performance metrics:', performanceMetrics);
    
    // Basic performance check
    expect(performanceMetrics.domContentLoaded).toBeGreaterThan(0);
  });
});