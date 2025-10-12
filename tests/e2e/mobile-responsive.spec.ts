/**
 * Mobile Responsive Tests
 * Tests for mobile device compatibility
 */

import { test, expect } from '@playwright/test';

test.describe('Mobile Responsive Tests', () => {
  test('should display correctly on mobile viewport', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // Check basic elements are visible
    await expect(page.locator('body')).toBeVisible();
    
    // Check that content doesn't overflow horizontally
    const body = page.locator('body');
    const bodyBounds = await body.boundingBox();
    expect(bodyBounds?.width).toBeLessThanOrEqual(375);
  });

  test('should handle touch interactions', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // Test basic touch interaction
    const searchBox = page.getByPlaceholder(/search/i);
    if (await searchBox.isVisible()) {
      await searchBox.tap();
      await expect(searchBox).toBeFocused();
    }
  });

  test('should work on tablet viewport', async ({ page }) => {
    // Set tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');
    
    // Check basic functionality
    await expect(page.locator('body')).toBeVisible();
    
    // Check search if available
    const searchBox = page.getByPlaceholder(/search/i);
    if (await searchBox.isVisible()) {
      await searchBox.fill('test');
      expect(await searchBox.inputValue()).toBe('test');
    }
  });
});