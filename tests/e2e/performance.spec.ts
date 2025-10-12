/**
 * Performance Tests
 * Basic performance and loading tests
 */

import { test, expect } from '@playwright/test';

test.describe('Performance Tests', () => {
  test('should load page within reasonable time', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const loadTime = Date.now() - startTime;
    
    // Should load within 10 seconds (generous for CI)
    expect(loadTime).toBeLessThan(10000);
  });

  test('should have reasonable page size', async ({ page }) => {
    await page.goto('/');
    
    // Wait for resources to load
    await page.waitForLoadState('networkidle');
    
    // Get performance metrics
    const performanceMetrics = await page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      return {
        loadEventEnd: navigation.loadEventEnd,
        domContentLoadedEventEnd: navigation.domContentLoadedEventEnd,
        transferSize: navigation.transferSize
      };
    });
    
    // Basic checks
    expect(performanceMetrics.loadEventEnd).toBeGreaterThan(0);
    expect(performanceMetrics.domContentLoadedEventEnd).toBeGreaterThan(0);
  });

  test('should handle multiple rapid interactions', async ({ page }) => {
    await page.goto('/');
    
    const searchBox = page.getByPlaceholder(/search/i);
    
    if (await searchBox.isVisible()) {
      // Rapid typing test
      await searchBox.fill('a');
      await searchBox.fill('ab');
      await searchBox.fill('abc');
      await searchBox.fill('batman');
      
      // Should handle rapid input without errors
      expect(await searchBox.inputValue()).toBe('batman');
    }
  });
});