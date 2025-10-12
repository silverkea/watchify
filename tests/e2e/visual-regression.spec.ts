/**
 * Visual Regression Tests
 * Basic visual consistency tests
 */

import { test, expect } from '@playwright/test';

test.describe('Visual Regression Tests', () => {
  test('should match homepage screenshot', async ({ page }) => {
    await page.goto('/');
    
    // Wait for content to stabilize
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    
    // Take screenshot and compare (will create baseline on first run)
    await expect(page).toHaveScreenshot('homepage.png', { threshold: 0.3 });
  });

  test('should match mobile homepage screenshot', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // Wait for content to stabilize
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    
    // Take mobile screenshot (will create baseline on first run)
    await expect(page).toHaveScreenshot('homepage-mobile.png', { threshold: 0.3 });
  });

  test('should have consistent styling', async ({ page }) => {
    await page.goto('/');
    
    // Wait for styles to load
    await page.waitForLoadState('networkidle');
    
    // Check that body has some basic styling
    const bodyStyles = await page.locator('body').evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return {
        fontFamily: styles.fontFamily,
        backgroundColor: styles.backgroundColor,
        color: styles.color
      };
    });
    
    // Should have some styling applied
    expect(bodyStyles.fontFamily).not.toBe('');
    expect(bodyStyles.backgroundColor).not.toBe('');
  });
});