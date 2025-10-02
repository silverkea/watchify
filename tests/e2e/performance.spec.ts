/**
 * Performance Tests
 * Playwright tests for performance metrics, loading times, and optimization validation
 */

import { test, expect } from '@playwright/test';

test.describe('Performance Tests', () => {
  test('should load the home page within performance budget', async ({ page }) => {
    // Start performance measurement
    const startTime = Date.now();
    
    // Navigate to the home page
    await page.goto('/');
    
    // Wait for main content to be visible
    await expect(page.getByRole('heading', { name: /discover movies/i })).toBeVisible();
    
    // Measure page load time
    const loadTime = Date.now() - startTime;
    console.log(`Page load time: ${loadTime}ms`);
    
    // Performance budget: page should load within 3 seconds
    expect(loadTime).toBeLessThan(3000);
  });

  test('should load movie search results efficiently', async ({ page }) => {
    await page.goto('/');
    
    // Start timing
    const startTime = Date.now();
    
    // Perform a search
    const searchBox = page.getByPlaceholder(/search for movies/i);
    await searchBox.fill('avengers');
    
    // Wait for results to appear
    await expect(page.getByRole('article').first()).toBeVisible({ timeout: 5000 });
    
    // Measure search response time
    const searchTime = Date.now() - startTime;
    console.log(`Search response time: ${searchTime}ms`);
    
    // Search should complete within 2 seconds
    expect(searchTime).toBeLessThan(2000);
    
    // Verify multiple results are loaded
    const movieCards = page.getByRole('article');
    expect(await movieCards.count()).toBeGreaterThan(5);
  });

  test('should implement efficient image lazy loading', async ({ page }) => {
    await page.goto('/');
    
    // Perform a search to get multiple results
    await page.getByPlaceholder(/search for movies/i).fill('batman');
    await expect(page.getByRole('article').first()).toBeVisible();
    
    // Check that images are using lazy loading
    const images = page.locator('img[loading="lazy"]');
    expect(await images.count()).toBeGreaterThan(0);
    
    // Verify images load when scrolled into view
    const firstImage = images.first();
    await expect(firstImage).toBeVisible();
    
    // Check that image src is properly set (not placeholder)
    const src = await firstImage.getAttribute('src');
    expect(src).toBeTruthy();
    expect(src).not.toContain('placeholder');
  });

  test('should handle large result sets without performance degradation', async ({ page }) => {
    await page.goto('/');
    
    // Search for a broad term that will return many results
    const searchBox = page.getByPlaceholder(/search for movies/i);
    await searchBox.fill('the');
    
    // Wait for initial results
    await expect(page.getByRole('article').first()).toBeVisible();
    
    // Measure performance with many results
    const startTime = Date.now();
    
    // Scroll to trigger loading more results
    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight);
    });
    
    // Wait a moment for potential additional loading
    await page.waitForTimeout(1000);
    
    const scrollTime = Date.now() - startTime;
    console.log(`Scroll performance time: ${scrollTime}ms`);
    
    // Should handle scrolling efficiently
    expect(scrollTime).toBeLessThan(1000);
  });

  test('should optimize Core Web Vitals', async ({ page }) => {
    // Navigate to the page
    await page.goto('/');
    
    // Wait for page to be fully loaded
    await page.waitForLoadState('networkidle');
    
    // Measure performance metrics using page.evaluate
    const metrics = await page.evaluate(() => {
      return new Promise<{
        fcp: number;
        domContentLoaded: number;
        loadComplete: number;
      }>((resolve) => {
        // Use requestIdleCallback to ensure measurements are accurate
        requestIdleCallback(() => {
          const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
          const paint = performance.getEntriesByType('paint');
          
          resolve({
            // First Contentful Paint
            fcp: paint.find(entry => entry.name === 'first-contentful-paint')?.startTime || 0,
            // Largest Contentful Paint approximation
            domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
            // Total load time
            loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
          });
        });
      });
    });
    
    console.log('Performance metrics:', metrics);
    
    // Core Web Vitals thresholds
    expect(metrics.fcp).toBeLessThan(1800); // FCP should be under 1.8s
    expect(metrics.domContentLoaded).toBeLessThan(1000); // DOM processing should be fast
    expect(metrics.loadComplete).toBeLessThan(500); // Load event should be quick
  });

  test('should implement efficient debouncing for search', async ({ page }) => {
    await page.goto('/');
    
    const searchBox = page.getByPlaceholder(/search for movies/i);
    
    // Measure how debouncing affects performance
    const startTime = Date.now();
    
    // Type rapidly to test debouncing
    await searchBox.type('marvel', { delay: 50 }); // Fast typing
    
    // Wait for debounce to complete and results to appear
    await expect(page.getByRole('article').first()).toBeVisible({ timeout: 2000 });
    
    const debounceTime = Date.now() - startTime;
    console.log(`Debounced search time: ${debounceTime}ms`);
    
    // Should handle rapid typing efficiently
    expect(debounceTime).toBeLessThan(1500);
  });

  test('should load watch party page efficiently', async ({ page }) => {
    // Test the watch party creation flow performance
    await page.goto('/');
    
    // Navigate to a movie details page
    await page.getByPlaceholder(/search for movies/i).fill('inception');
    await expect(page.getByRole('article').first()).toBeVisible();
    await page.getByRole('article').first().click();
    
    // Start timing for watch party creation
    const startTime = Date.now();
    
    // Wait for movie details to load
    await expect(page.getByRole('heading')).toBeVisible();
    
    // Click create watch party
    await page.getByRole('button', { name: /create watch party/i }).click();
    
    // Wait for watch party page to load
    await expect(page.getByText(/schedule your watch party/i)).toBeVisible();
    
    const navigationTime = Date.now() - startTime;
    console.log(`Watch party navigation time: ${navigationTime}ms`);
    
    // Navigation should be fast
    expect(navigationTime).toBeLessThan(2000);
  });

  test('should handle theme switching efficiently', async ({ page }) => {
    await page.goto('/');
    
    // Wait for page to load
    await expect(page.getByRole('heading')).toBeVisible();
    
    // Measure theme switch performance
    const startTime = Date.now();
    
    // Find and click theme toggle (assuming it exists)
    const themeToggle = page.locator('[data-testid="theme-toggle"]').or(
      page.getByRole('button', { name: /theme/i })
    );
    
    if (await themeToggle.count() > 0) {
      await themeToggle.click();
      
      // Wait for theme to apply (visual change)
      await page.waitForTimeout(100);
      
      const themeTime = Date.now() - startTime;
      console.log(`Theme switch time: ${themeTime}ms`);
      
      // Theme switching should be instant
      expect(themeTime).toBeLessThan(500);
    }
  });

  test('should handle error states efficiently', async ({ page }) => {
    // Test performance when errors occur
    await page.goto('/');
    
    const searchBox = page.getByPlaceholder(/search for movies/i);
    
    // Start timing
    const startTime = Date.now();
    
    // Search for something that might cause issues or no results
    await searchBox.fill('xyzinvalidmovienamesearchthatreturnsnothing123');
    
    // Wait for "no results" or error state
    await expect(
      page.getByText(/no movies found/i).or(page.getByText(/no results/i))
    ).toBeVisible({ timeout: 3000 });
    
    const errorTime = Date.now() - startTime;
    console.log(`Error handling time: ${errorTime}ms`);
    
    // Error states should be handled quickly
    expect(errorTime).toBeLessThan(2000);
  });
});