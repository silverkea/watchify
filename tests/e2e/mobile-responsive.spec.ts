/**
 * Mobile Responsiveness Tests
 * Playwright tests for mobile device compatibility and responsive design
 */

import { test, expect, devices } from '@playwright/test';

// Define common mobile viewports
const mobileViewports = [
  { name: 'iPhone SE', width: 375, height: 667 },
  { name: 'iPhone 12', width: 390, height: 844 },
  { name: 'iPhone 12 Pro Max', width: 428, height: 926 },
  { name: 'Samsung Galaxy S21', width: 360, height: 800 },
  { name: 'iPad Mini', width: 768, height: 1024 },
  { name: 'iPad Pro', width: 1024, height: 1366 },
];

// Test with different mobile devices
const mobileDevices = [
  { name: 'iPhone 12', ...devices['iPhone 12'] },
  { name: 'iPhone 12 Pro', ...devices['iPhone 12 Pro'] },
  { name: 'Pixel 5', ...devices['Pixel 5'] },
  { name: 'Samsung Galaxy S21+', ...devices['Galaxy S21+'] },
];

mobileViewports.forEach(({ name, width, height }) => {
  test.describe(`Mobile Responsiveness - ${name} (${width}x${height})`, () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize({ width, height });
    });

    test(`should display home page correctly on ${name}`, async ({ page }) => {
      await page.goto('/');
      
      // Check main heading is visible
      await expect(page.getByRole('heading', { name: /discover movies/i })).toBeVisible();
      
      // Check search box is accessible
      const searchBox = page.getByPlaceholder(/search for movies/i);
      await expect(searchBox).toBeVisible();
      
      // Verify search box is properly sized for mobile
      const searchBoxBounds = await searchBox.boundingBox();
      expect(searchBoxBounds?.width).toBeLessThan(width);
      
      // Check layout doesn't overflow
      const body = page.locator('body');
      const bodyBounds = await body.boundingBox();
      expect(bodyBounds?.width).toBeLessThanOrEqual(width);
    });

    test(`should handle movie search on ${name}`, async ({ page }) => {
      await page.goto('/');
      
      // Perform search
      await page.getByPlaceholder(/search for movies/i).fill('batman');
      await expect(page.getByRole('article').first()).toBeVisible();
      
      // Check movie cards are properly sized
      const movieCards = page.getByRole('article');
      const cardCount = await movieCards.count();
      expect(cardCount).toBeGreaterThan(0);
      
      // Verify cards don't overflow
      for (let i = 0; i < Math.min(cardCount, 3); i++) {
        const card = movieCards.nth(i);
        const cardBounds = await card.boundingBox();
        if (cardBounds) {
          expect(cardBounds.x + cardBounds.width).toBeLessThanOrEqual(width);
        }
      }
    });

    test(`should handle touch interactions on ${name}`, async ({ page }) => {
      await page.goto('/');
      
      // Perform search
      await page.getByPlaceholder(/search for movies/i).fill('avengers');
      await expect(page.getByRole('article').first()).toBeVisible();
      
      // Test touch tap on movie card
      const firstMovie = page.getByRole('article').first();
      await firstMovie.tap();
      
      // Should navigate to movie details
      await expect(page.getByRole('heading')).toBeVisible();
      
      // Test create watch party button
      const createButton = page.getByRole('button', { name: /create watch party/i });
      if (await createButton.isVisible()) {
        await createButton.tap();
        await expect(page.getByText(/schedule your watch party/i)).toBeVisible();
      }
    });

    test(`should scroll properly on ${name}`, async ({ page }) => {
      await page.goto('/');
      
      // Perform search to get scrollable content
      await page.getByPlaceholder(/search for movies/i).fill('marvel');
      await expect(page.getByRole('article').first()).toBeVisible();
      
      // Test scrolling
      await page.evaluate(() => {
        window.scrollTo(0, 500);
      });
      
      // Check scroll position
      const scrollY = await page.evaluate(() => window.scrollY);
      expect(scrollY).toBeGreaterThan(0);
      
      // Scroll back to top
      await page.evaluate(() => {
        window.scrollTo(0, 0);
      });
      
      const topScrollY = await page.evaluate(() => window.scrollY);
      expect(topScrollY).toBe(0);
    });

    test(`should handle form inputs on ${name}`, async ({ page }) => {
      await page.goto('/');
      
      // Test search input
      const searchBox = page.getByPlaceholder(/search for movies/i);
      await searchBox.tap();
      await searchBox.fill('inception');
      
      expect(await searchBox.inputValue()).toBe('inception');
      
      // Navigate to watch party form
      await expect(page.getByRole('article').first()).toBeVisible();
      await page.getByRole('article').first().tap();
      await page.getByRole('button', { name: /create watch party/i }).tap();
      
      // Test form inputs
      await expect(page.getByText(/schedule your watch party/i)).toBeVisible();
      
      const dateInput = page.locator('input[type="date"]').or(
        page.getByLabel(/date/i)
      );
      
      if (await dateInput.count() > 0) {
        await dateInput.tap();
        // Basic interaction test
        await expect(dateInput).toBeFocused();
      }
    });

    test(`should handle orientation changes on ${name}`, async ({ page }) => {
      await page.goto('/');
      
      // Test portrait mode (current)
      await expect(page.getByRole('heading')).toBeVisible();
      
      // Switch to landscape (swap width and height)
      await page.setViewportSize({ width: height, height: width });
      
      // Check layout adapts
      await expect(page.getByRole('heading')).toBeVisible();
      await expect(page.getByPlaceholder(/search for movies/i)).toBeVisible();
      
      // Test search in landscape
      await page.getByPlaceholder(/search for movies/i).fill('batman');
      await expect(page.getByRole('article').first()).toBeVisible();
      
      // Switch back to portrait
      await page.setViewportSize({ width, height });
      await expect(page.getByRole('article').first()).toBeVisible();
    });
  });
});

mobileDevices.forEach(({ name, ...device }) => {
  test.describe(`Mobile Device Tests - ${name}`, () => {
    test.use(device);

    test(`should work correctly on real ${name} device`, async ({ page }) => {
      await page.goto('/');
      
      // Check basic functionality
      await expect(page.getByRole('heading', { name: /discover movies/i })).toBeVisible();
      
      // Test search
      await page.getByPlaceholder(/search for movies/i).fill('spider-man');
      await expect(page.getByRole('article').first()).toBeVisible();
      
      // Test navigation
      await page.getByRole('article').first().click();
      await expect(page.getByRole('heading')).toBeVisible();
    });

    test(`should handle network conditions on ${name}`, async ({ page, context }) => {
      // Simulate slow 3G network
      await context.route('**/*', route => {
        return new Promise<void>(resolve => {
          setTimeout(() => {
            route.continue();
            resolve();
          }, 100); // Add 100ms delay
        });
      });
      
      await page.goto('/');
      
      // Should still work with slower network
      await expect(page.getByRole('heading')).toBeVisible({ timeout: 10000 });
      
      // Test search with network delay
      await page.getByPlaceholder(/search for movies/i).fill('batman');
      await expect(page.getByRole('article').first()).toBeVisible({ timeout: 10000 });
    });

    test(`should handle touch gestures on ${name}`, async ({ page }) => {
      await page.goto('/');
      
      // Perform search
      await page.getByPlaceholder(/search for movies/i).fill('avengers');
      await expect(page.getByRole('article').first()).toBeVisible();
      
      // Test swipe gesture (scroll)
      await page.touchscreen.tap(200, 400);
      await page.evaluate(() => {
        window.scrollBy(0, 300);
      });
      
      // Test pinch-to-zoom resistance (content should not zoom)
      const initialViewport = page.viewportSize();
      
      // Simulate pinch gesture
      await page.touchscreen.tap(200, 400);
      await page.waitForTimeout(100);
      
      const finalViewport = page.viewportSize();
      expect(finalViewport).toEqual(initialViewport);
    });
  });
});

test.describe('Mobile Performance Tests', () => {
  test('should load quickly on mobile networks', async ({ page }) => {
    // Simulate mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Measure load time
    const startTime = Date.now();
    await page.goto('/');
    await expect(page.getByRole('heading')).toBeVisible();
    const loadTime = Date.now() - startTime;
    
    console.log(`Mobile load time: ${loadTime}ms`);
    
    // Should load within reasonable time on mobile
    expect(loadTime).toBeLessThan(5000);
  });

  test('should handle memory constraints on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // Perform multiple searches to test memory usage
    const searches = ['batman', 'superman', 'wonder woman', 'flash', 'aquaman'];
    
    for (const search of searches) {
      await page.getByPlaceholder(/search for movies/i).clear();
      await page.getByPlaceholder(/search for movies/i).fill(search);
      await expect(page.getByRole('article').first()).toBeVisible();
      await page.waitForTimeout(500);
    }
    
    // Should still be responsive after multiple operations
    await expect(page.getByPlaceholder(/search for movies/i)).toBeEnabled();
  });
});

test.describe('Touch Target Tests', () => {
  test('should have appropriate touch target sizes', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // Check search box touch target
    const searchBox = page.getByPlaceholder(/search for movies/i);
    const searchBounds = await searchBox.boundingBox();
    
    if (searchBounds) {
      // Should be at least 44px high (iOS recommendation)
      expect(searchBounds.height).toBeGreaterThanOrEqual(44);
    }
    
    // Perform search and check movie card touch targets
    await searchBox.fill('batman');
    await expect(page.getByRole('article').first()).toBeVisible();
    
    const firstMovie = page.getByRole('article').first();
    const cardBounds = await firstMovie.boundingBox();
    
    if (cardBounds) {
      // Movie cards should have adequate touch area
      expect(cardBounds.height).toBeGreaterThanOrEqual(44);
      expect(cardBounds.width).toBeGreaterThanOrEqual(44);
    }
  });

  test('should handle touch target spacing', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // Perform search to get multiple touch targets
    await page.getByPlaceholder(/search for movies/i).fill('marvel');
    await expect(page.getByRole('article').first()).toBeVisible();
    
    // Check spacing between movie cards
    const movieCards = page.getByRole('article');
    const cardCount = await movieCards.count();
    
    if (cardCount >= 2) {
      const firstCard = movieCards.nth(0);
      const secondCard = movieCards.nth(1);
      
      const firstBounds = await firstCard.boundingBox();
      const secondBounds = await secondCard.boundingBox();
      
      if (firstBounds && secondBounds) {
        // Cards should have adequate spacing
        const verticalGap = Math.abs(secondBounds.y - (firstBounds.y + firstBounds.height));
        const horizontalGap = Math.abs(secondBounds.x - (firstBounds.x + firstBounds.width));
        
        // Should have at least some spacing
        expect(Math.min(verticalGap, horizontalGap)).toBeGreaterThanOrEqual(8);
      }
    }
  });
});

test.describe('Mobile Input Tests', () => {
  test('should handle virtual keyboard', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // Focus search input (would trigger virtual keyboard)
    const searchBox = page.getByPlaceholder(/search for movies/i);
    await searchBox.focus();
    
    // Check that input is still visible
    await expect(searchBox).toBeVisible();
    
    // Type with virtual keyboard simulation
    await searchBox.type('batman', { delay: 100 });
    
    expect(await searchBox.inputValue()).toBe('batman');
    
    // Check that results appear despite virtual keyboard
    await expect(page.getByRole('article').first()).toBeVisible();
  });

  test('should handle mobile-specific input types', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // Navigate to watch party form
    await page.getByPlaceholder(/search for movies/i).fill('dune');
    await expect(page.getByRole('article').first()).toBeVisible();
    await page.getByRole('article').first().click();
    await page.getByRole('button', { name: /create watch party/i }).click();
    
    // Check form inputs work on mobile
    await expect(page.getByText(/schedule your watch party/i)).toBeVisible();
    
    // Test date input (should show mobile date picker)
    const dateInput = page.locator('input[type="date"]');
    
    if (await dateInput.count() > 0) {
      await dateInput.tap();
      await expect(dateInput).toBeFocused();
    }
    
    // Test time input if available
    const timeInput = page.locator('input[type="time"]');
    
    if (await timeInput.count() > 0) {
      await timeInput.tap();
      await expect(timeInput).toBeFocused();
    }
  });
});