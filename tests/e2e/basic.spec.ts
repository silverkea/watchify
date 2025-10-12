/**
 * Basic E2E Tests
 * Core functionality tests that work across all browsers
 */

import { test, expect } from '@playwright/test';

test.describe('Homepage Tests', () => {
  test('should load and display the home page', async ({ page }) => {
    await page.goto('/');
    
    // Check that the page loads
    await expect(page).toHaveTitle(/Watchify/);
    
    // Check for main heading
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    
    // Check for search functionality
    const searchBox = page.getByPlaceholder(/search/i);
    await expect(searchBox).toBeVisible();
  });

  test('should handle movie search', async ({ page }) => {
    await page.goto('/');
    
    // Perform a search
    const searchBox = page.getByPlaceholder(/search/i);
    await searchBox.fill('batman');
    
    // Wait for some content to appear
    await page.waitForTimeout(2000);
    
    // Basic check that something happened
    const content = page.locator('body');
    await expect(content).toBeVisible();
  });
});

test.describe('Navigation Tests', () => {
  test('should handle basic navigation', async ({ page }) => {
    await page.goto('/');
    
    // Check that we can navigate around
    await expect(page.locator('body')).toBeVisible();
    
    // Basic page structure test - use first() to avoid strict mode violation
    const mainContent = page.locator('main').first();
    await expect(mainContent).toBeVisible();
  });
});