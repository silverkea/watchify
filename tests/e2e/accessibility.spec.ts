/**
 * Accessibility Tests
 * Playwright tests with axe-core for accessibility compliance
 */

import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility Tests', () => {
  test('should pass accessibility audit on home page', async ({ page }) => {
    await page.goto('/');
    
    // Wait for content to load
    await expect(page.getByRole('heading', { name: /discover movies/i })).toBeVisible();
    
    // Run accessibility scan
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    
    // Assert no accessibility violations
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('should pass accessibility audit on search results', async ({ page }) => {
    await page.goto('/');
    
    // Perform a search
    await page.getByPlaceholder(/search for movies/i).fill('batman');
    await expect(page.getByRole('article').first()).toBeVisible();
    
    // Run accessibility scan on results
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('should pass accessibility audit on movie details page', async ({ page }) => {
    await page.goto('/');
    
    // Navigate to movie details
    await page.getByPlaceholder(/search for movies/i).fill('inception');
    await expect(page.getByRole('article').first()).toBeVisible();
    await page.getByRole('article').first().click();
    
    // Wait for movie details to load
    await expect(page.getByRole('heading')).toBeVisible();
    
    // Run accessibility scan
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('should pass accessibility audit on watch party page', async ({ page }) => {
    await page.goto('/');
    
    // Navigate to watch party creation
    await page.getByPlaceholder(/search for movies/i).fill('avengers');
    await expect(page.getByRole('article').first()).toBeVisible();
    await page.getByRole('article').first().click();
    await page.getByRole('button', { name: /create watch party/i }).click();
    
    // Wait for watch party page
    await expect(page.getByText(/schedule your watch party/i)).toBeVisible();
    
    // Run accessibility scan
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('should have proper heading hierarchy', async ({ page }) => {
    await page.goto('/');
    
    // Check heading structure
    const h1Elements = page.locator('h1');
    const h2Elements = page.locator('h2');
    const h3Elements = page.locator('h3');
    
    // Should have exactly one h1
    expect(await h1Elements.count()).toBe(1);
    
    // Check heading content
    await expect(h1Elements.first()).toBeVisible();
    
    // Verify no heading level is skipped (basic check)
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();
    
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('should have proper form labels and descriptions', async ({ page }) => {
    await page.goto('/');
    
    // Check search form accessibility
    const searchBox = page.getByPlaceholder(/search for movies/i);
    
    // Search box should have proper labeling
    await expect(searchBox).toBeVisible();
    
    // Test with watch party form
    await page.getByPlaceholder(/search for movies/i).fill('dune');
    await expect(page.getByRole('article').first()).toBeVisible();
    await page.getByRole('article').first().click();
    await page.getByRole('button', { name: /create watch party/i }).click();
    
    // Run accessibility scan on form
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();
    
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('should have sufficient color contrast', async ({ page }) => {
    await page.goto('/');
    
    // Wait for content to load
    await expect(page.getByRole('heading')).toBeVisible();
    
    // Run color contrast check
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2aa'])
      .analyze();
    
    // Filter for color contrast violations specifically
    const colorContrastViolations = accessibilityScanResults.violations.filter(
      (violation: any) => violation.id === 'color-contrast'
    );
    
    expect(colorContrastViolations).toEqual([]);
  });

  test('should be keyboard navigable', async ({ page }) => {
    await page.goto('/');
    
    // Test keyboard navigation
    await page.keyboard.press('Tab');
    
    // Should be able to reach search box
    const searchBox = page.getByPlaceholder(/search for movies/i);
    await expect(searchBox).toBeFocused();
    
    // Perform search
    await searchBox.fill('marvel');
    await expect(page.getByRole('article').first()).toBeVisible();
    
    // Continue tabbing to movie cards
    await page.keyboard.press('Tab');
    
    // Should be able to navigate with Enter
    const firstMovie = page.getByRole('article').first();
    await firstMovie.focus();
    await page.keyboard.press('Enter');
    
    // Should navigate successfully
    await expect(page.getByRole('heading')).toBeVisible();
    
    // Run accessibility scan
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a'])
      .analyze();
    
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('should have proper ARIA labels and roles', async ({ page }) => {
    await page.goto('/');
    
    // Perform search to get movie cards
    await page.getByPlaceholder(/search for movies/i).fill('batman');
    await expect(page.getByRole('article').first()).toBeVisible();
    
    // Check that movie cards have proper roles
    const movieCards = page.getByRole('article');
    expect(await movieCards.count()).toBeGreaterThan(0);
    
    // Check for proper ARIA attributes
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();
    
    // Filter for ARIA-related violations
    const ariaViolations = accessibilityScanResults.violations.filter(
      (violation: any) => violation.id.includes('aria') || violation.id.includes('role')
    );
    
    expect(ariaViolations).toEqual([]);
  });

  test('should handle screen reader compatibility', async ({ page }) => {
    await page.goto('/');
    
    // Check for screen reader friendly elements
    const searchBox = page.getByPlaceholder(/search for movies/i);
    
    // Should have accessible name
    const accessibleName = await searchBox.getAttribute('aria-label') || 
                          await searchBox.getAttribute('aria-labelledby') ||
                          await searchBox.getAttribute('placeholder');
    
    expect(accessibleName).toBeTruthy();
    
    // Perform search and check results
    await searchBox.fill('star wars');
    await expect(page.getByRole('article').first()).toBeVisible();
    
    // Check that images have alt text
    const images = page.locator('img');
    const imageCount = await images.count();
    
    for (let i = 0; i < Math.min(imageCount, 5); i++) {
      const image = images.nth(i);
      const altText = await image.getAttribute('alt');
      expect(altText).toBeTruthy();
    }
    
    // Run comprehensive accessibility scan
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('should handle focus management', async ({ page }) => {
    await page.goto('/');
    
    // Test focus indicators
    const searchBox = page.getByPlaceholder(/search for movies/i);
    await searchBox.focus();
    
    // Check that focus is visible (this is basic - real test would check CSS)
    await expect(searchBox).toBeFocused();
    
    // Navigate to movie details and back
    await searchBox.fill('inception');
    await expect(page.getByRole('article').first()).toBeVisible();
    await page.getByRole('article').first().click();
    
    // Check focus management on navigation
    await expect(page.getByRole('heading')).toBeVisible();
    
    // Run accessibility scan for focus-related issues
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a'])
      .analyze();
    
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('should handle error states accessibly', async ({ page }) => {
    await page.goto('/');
    
    // Trigger an error state
    await page.getByPlaceholder(/search for movies/i).fill('xyzinvalidmovie123');
    
    // Wait for error/no results message
    await expect(
      page.getByText(/no movies found/i).or(page.getByText(/no results/i))
    ).toBeVisible();
    
    // Check that error messages are accessible
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('should have proper landmark structure', async ({ page }) => {
    await page.goto('/');
    
    // Check for proper landmark roles
    const main = page.locator('main');
    const nav = page.locator('nav');
    const header = page.locator('header');
    
    // Should have main content area
    if (await main.count() > 0) {
      await expect(main.first()).toBeVisible();
    }
    
    // Run landmark-specific accessibility scan
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a'])
      .analyze();
    
    // Filter for landmark-related violations
    const landmarkViolations = accessibilityScanResults.violations.filter(
      (violation: any) => violation.id.includes('landmark') || violation.id.includes('region')
    );
    
    expect(landmarkViolations).toEqual([]);
  });

  test('should handle mobile accessibility', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // Check mobile accessibility
    await expect(page.getByRole('heading')).toBeVisible();
    
    // Test touch targets (basic check)
    const searchBox = page.getByPlaceholder(/search for movies/i);
    await expect(searchBox).toBeVisible();
    
    // Run accessibility scan on mobile
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();
    
    expect(accessibilityScanResults.violations).toEqual([]);
  });
});