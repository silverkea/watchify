/**
 * Visual Regression Tests
 * Playwright tests for visual consistency using screenshots
 */

import { test, expect } from '@playwright/test';

test.describe('Visual Regression Tests', () => {
  test('should match home page visual baseline', async ({ page }) => {
    await page.goto('/');
    
    // Wait for content to load
    await expect(page.getByRole('heading', { name: /discover movies/i })).toBeVisible();
    
    // Take full page screenshot
    await expect(page).toHaveScreenshot('home-page.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });

  test('should match search results visual baseline', async ({ page }) => {
    await page.goto('/');
    
    // Perform search
    await page.getByPlaceholder(/search for movies/i).fill('batman');
    await expect(page.getByRole('article').first()).toBeVisible();
    
    // Wait for images to load
    await page.waitForTimeout(2000);
    
    // Take screenshot of search results
    await expect(page).toHaveScreenshot('search-results.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });

  test('should match movie details visual baseline', async ({ page }) => {
    await page.goto('/');
    
    // Navigate to movie details
    await page.getByPlaceholder(/search for movies/i).fill('inception');
    await expect(page.getByRole('article').first()).toBeVisible();
    await page.getByRole('article').first().click();
    
    // Wait for movie details to load
    await expect(page.getByRole('heading')).toBeVisible();
    await page.waitForTimeout(2000);
    
    // Take screenshot
    await expect(page).toHaveScreenshot('movie-details.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });

  test('should match watch party page visual baseline', async ({ page }) => {
    await page.goto('/');
    
    // Navigate to watch party creation
    await page.getByPlaceholder(/search for movies/i).fill('avengers');
    await expect(page.getByRole('article').first()).toBeVisible();
    await page.getByRole('article').first().click();
    await page.getByRole('button', { name: /create watch party/i }).click();
    
    // Wait for watch party page
    await expect(page.getByText(/schedule your watch party/i)).toBeVisible();
    await page.waitForTimeout(1000);
    
    // Take screenshot
    await expect(page).toHaveScreenshot('watch-party-page.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });

  test('should match movie card component visual baseline', async ({ page }) => {
    await page.goto('/');
    
    // Perform search to get movie cards
    await page.getByPlaceholder(/search for movies/i).fill('spider-man');
    await expect(page.getByRole('article').first()).toBeVisible();
    
    // Wait for images to load
    await page.waitForTimeout(2000);
    
    // Take screenshot of first movie card
    const firstCard = page.getByRole('article').first();
    await expect(firstCard).toHaveScreenshot('movie-card-default.png', {
      animations: 'disabled',
    });
  });

  test('should match search box component visual baseline', async ({ page }) => {
    await page.goto('/');
    
    // Wait for page to load
    await expect(page.getByRole('heading')).toBeVisible();
    
    // Take screenshot of search box
    const searchBox = page.getByPlaceholder(/search for movies/i);
    await expect(searchBox).toHaveScreenshot('search-box-empty.png', {
      animations: 'disabled',
    });
    
    // Type in search box and take another screenshot
    await searchBox.fill('marvel');
    await expect(searchBox).toHaveScreenshot('search-box-filled.png', {
      animations: 'disabled',
    });
  });

  test('should match dark theme visual baseline', async ({ page }) => {
    await page.goto('/');
    
    // Switch to dark theme if toggle exists
    const themeToggle = page.locator('[data-testid="theme-toggle"]').or(
      page.getByRole('button', { name: /theme/i })
    );
    
    if (await themeToggle.count() > 0) {
      await themeToggle.click();
      await page.waitForTimeout(500);
      
      // Take screenshot in dark theme
      await expect(page).toHaveScreenshot('home-page-dark.png', {
        fullPage: true,
        animations: 'disabled',
      });
      
      // Perform search in dark theme
      await page.getByPlaceholder(/search for movies/i).fill('star wars');
      await expect(page.getByRole('article').first()).toBeVisible();
      await page.waitForTimeout(2000);
      
      await expect(page).toHaveScreenshot('search-results-dark.png', {
        fullPage: true,
        animations: 'disabled',
      });
    }
  });

  test('should match error state visual baseline', async ({ page }) => {
    await page.goto('/');
    
    // Trigger error state
    await page.getByPlaceholder(/search for movies/i).fill('xyzinvalidmovie123');
    
    // Wait for no results message
    await expect(
      page.getByText(/no movies found/i).or(page.getByText(/no results/i))
    ).toBeVisible();
    
    // Take screenshot of error state
    await expect(page).toHaveScreenshot('no-results-state.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });

  test('should match loading state visual baseline', async ({ page }) => {
    await page.goto('/');
    
    // Start typing to potentially catch loading state
    const searchBox = page.getByPlaceholder(/search for movies/i);
    await searchBox.fill('batman');
    
    // Try to capture loading state (this might be fast)
    // In a real app, we might have a loading indicator
    await page.waitForTimeout(100);
    
    // Take screenshot that might show loading state
    await expect(page).toHaveScreenshot('search-loading-state.png', {
      animations: 'disabled',
    });
  });

  test('should match mobile view visual baseline', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // Wait for content to load
    await expect(page.getByRole('heading')).toBeVisible();
    
    // Take mobile screenshot
    await expect(page).toHaveScreenshot('home-page-mobile.png', {
      fullPage: true,
      animations: 'disabled',
    });
    
    // Test mobile search
    await page.getByPlaceholder(/search for movies/i).fill('marvel');
    await expect(page.getByRole('article').first()).toBeVisible();
    await page.waitForTimeout(2000);
    
    await expect(page).toHaveScreenshot('search-results-mobile.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });

  test('should match tablet view visual baseline', async ({ page }) => {
    // Set tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');
    
    // Wait for content to load
    await expect(page.getByRole('heading')).toBeVisible();
    
    // Take tablet screenshot
    await expect(page).toHaveScreenshot('home-page-tablet.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });

  test('should match focused state visual baseline', async ({ page }) => {
    await page.goto('/');
    
    // Focus search box
    const searchBox = page.getByPlaceholder(/search for movies/i);
    await searchBox.focus();
    
    // Take screenshot of focused search box
    await expect(searchBox).toHaveScreenshot('search-box-focused.png', {
      animations: 'disabled',
    });
    
    // Perform search and focus first result
    await searchBox.fill('batman');
    await expect(page.getByRole('article').first()).toBeVisible();
    await page.waitForTimeout(1000);
    
    const firstMovie = page.getByRole('article').first();
    await firstMovie.focus();
    
    // Take screenshot of focused movie card
    await expect(firstMovie).toHaveScreenshot('movie-card-focused.png', {
      animations: 'disabled',
    });
  });

  test('should match hover state visual baseline', async ({ page }) => {
    await page.goto('/');
    
    // Perform search
    await page.getByPlaceholder(/search for movies/i).fill('avengers');
    await expect(page.getByRole('article').first()).toBeVisible();
    await page.waitForTimeout(2000);
    
    // Hover over first movie card
    const firstMovie = page.getByRole('article').first();
    await firstMovie.hover();
    
    // Take screenshot of hovered movie card
    await expect(firstMovie).toHaveScreenshot('movie-card-hover.png', {
      animations: 'disabled',
    });
  });

  test('should match movie grid layout visual baseline', async ({ page }) => {
    await page.goto('/');
    
    // Perform search to get multiple results
    await page.getByPlaceholder(/search for movies/i).fill('marvel');
    await expect(page.getByRole('article').first()).toBeVisible();
    
    // Wait for all images to load
    await page.waitForTimeout(3000);
    
    // Take screenshot of the movie grid
    const movieGrid = page.locator('[data-testid="movie-grid"]').or(
      page.locator('section').filter({ hasText: /results/i }).or(
        page.locator('div').filter({ has: page.getByRole('article') })
      )
    );
    
    if (await movieGrid.count() > 0) {
      await expect(movieGrid.first()).toHaveScreenshot('movie-grid.png', {
        animations: 'disabled',
      });
    } else {
      // Fallback to page screenshot if grid not found
      await expect(page).toHaveScreenshot('movie-grid-fallback.png', {
        animations: 'disabled',
      });
    }
  });

  test('should match watch party form visual baseline', async ({ page }) => {
    await page.goto('/');
    
    // Navigate to watch party form
    await page.getByPlaceholder(/search for movies/i).fill('dune');
    await expect(page.getByRole('article').first()).toBeVisible();
    await page.getByRole('article').first().click();
    await page.getByRole('button', { name: /create watch party/i }).click();
    
    // Wait for form to load
    await expect(page.getByText(/schedule your watch party/i)).toBeVisible();
    await page.waitForTimeout(1000);
    
    // Take screenshot of the form
    const form = page.locator('form').or(
      page.locator('section').filter({ hasText: /schedule/i })
    );
    
    if (await form.count() > 0) {
      await expect(form.first()).toHaveScreenshot('watch-party-form.png', {
        animations: 'disabled',
      });
    }
  });
});