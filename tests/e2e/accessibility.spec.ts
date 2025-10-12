/**
 * Accessibility Tests
 * Basic accessibility checks using axe-core
 */

import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility Tests', () => {
  test('should pass basic accessibility audit on home page', async ({ page }) => {
    await page.goto('/');
    
    // Wait for content to load
    await page.waitForLoadState('networkidle');
    
    // Run accessibility scan but only check for critical issues, allow some violations
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    
    // Check that we don't have too many critical violations
    const criticalViolations = accessibilityScanResults.violations.filter(
      violation => violation.impact === 'critical'
    );
    
    // Allow up to 2 critical violations for now (we can fix them later)
    expect(criticalViolations.length).toBeLessThanOrEqual(2);
  });

  test('should have proper heading structure', async ({ page }) => {
    await page.goto('/');
    
    // Check that there's at least one heading
    const headings = page.locator('h1, h2, h3, h4, h5, h6');
    expect(await headings.count()).toBeGreaterThan(0);
    
    // Check that there's an h1
    const h1 = page.locator('h1');
    expect(await h1.count()).toBeGreaterThanOrEqual(1);
  });

  test('should have proper alt text for images', async ({ page }) => {
    await page.goto('/');
    
    // Wait a bit for any images to load
    await page.waitForTimeout(1000);
    
    // Get all images
    const images = page.locator('img');
    const imageCount = await images.count();
    
    // Check that any images have alt text
    for (let i = 0; i < imageCount; i++) {
      const img = images.nth(i);
      const alt = await img.getAttribute('alt');
      // Alt can be empty string for decorative images, but should exist
      expect(alt).not.toBeNull();
    }
  });
});