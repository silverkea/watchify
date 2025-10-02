/**
 * Step Definitions: Enhanced Genre Filtering
 * 
 * Implements Cucumber step definitions for enhanced genre filtering behavior
 * using Playwright for browser automation and API request monitoring.
 */

import { Given, When, Then, Before, After } from '@cucumber/cucumber'
import { expect } from '@playwright/test'
import { Route } from '@playwright/test'

// Define CustomWorld interface inline for now
interface CustomWorld {
  page: any; // Playwright Page object
}

// Track API requests during tests
let apiRequests: string[] = []

Before(async function (this: CustomWorld) {
  // Setup API request monitoring
  apiRequests = []
  
  await this.page.route('**/api/movies/**', (route: Route) => {
    const url = route.request().url()
    apiRequests.push(url)
    route.continue()
  })
})
})

After(async function (this: CustomWorld) {
  // Clean up API request monitoring
  await this.page.unroute('**/api/movies/**')
  apiRequests = []
})

// Background Steps
Given('the user is on the home page', async function (this: CustomWorld) {
  await this.page.goto('/')
  await this.page.waitForLoadState('networkidle')
})

Given('the movie discovery interface is loaded', async function (this: CustomWorld) {
  // Wait for movie grid to be visible
  await expect(this.page.locator('[data-testid="movie-grid"]')).toBeVisible()
  
  // Wait for genre filters to be loaded
  await expect(this.page.locator('[data-testid="genre-filter"]')).toBeVisible()
})

// Popular Movies Scenarios
Given('the user sees popular movies displayed by default', async function (this: CustomWorld) {
  // Verify "Popular Movies" heading is visible
  await expect(this.page.locator('h2:has-text("Popular Movies")')).toBeVisible()
  
  // Verify movies are loaded
  await expect(this.page.locator('[data-testid="movie-card"]')).toHaveCount({ minimum: 1 })
})

When('the user selects the {string} genre filter', async function (this: CustomWorld, genreName: string) {
  // Click on the genre filter button/checkbox
  const genreFilter = this.page.locator(`[data-testid="genre-filter-${genreName.toLowerCase()}"]`)
  await expect(genreFilter).toBeVisible()
  await genreFilter.click()
  
  // Wait for the request to complete
  await this.page.waitForLoadState('networkidle')
})

Then('the system should perform a new API request to {string}', async function (this: CustomWorld, expectedEndpoint: string) {
  // Check if the expected API request was made
  const matchingRequest = apiRequests.find(url => url.includes(expectedEndpoint.replace(/"/g, '')))
  expect(matchingRequest).toBeTruthy()
})

Then('the movie grid should return to page 1', async function (this: CustomWorld) {
  // Check that pagination shows page 1 or no page indicator
  const pageIndicator = this.page.locator('[data-testid="current-page"]')
  
  if (await pageIndicator.isVisible()) {
    await expect(pageIndicator).toHaveText('1')
  }
  
  // Verify Load More button is visible (indicates we're on page 1 with more results)
  await expect(this.page.locator('[data-testid="load-more-button"]')).toBeVisible()
})

Then('all displayed movies should have the {string} genre', async function (this: CustomWorld, genreName: string) {
  // Get all movie cards
  const movieCards = this.page.locator('[data-testid="movie-card"]')
  const count = await movieCards.count()
  expect(count).toBeGreaterThan(0)
  
  // Check each movie has the required genre
  for (let i = 0; i < count; i++) {
    const movieCard = movieCards.nth(i)
    const genreBadges = movieCard.locator('[data-testid="genre-badge"]')
    const genreTexts = await genreBadges.allTextContents()
    
    const hasGenre = genreTexts.some(text => text.toLowerCase().includes(genreName.toLowerCase()))
    expect(hasGenre).toBe(true)
  }
})

Then('the page counter should reset to {string}', async function (this: CustomWorld, expectedPage: string) {
  const pageCounter = this.page.locator('[data-testid="page-counter"]')
  
  if (await pageCounter.isVisible()) {
    await expect(pageCounter).toContainText(expectedPage)
  }
})

// Search Results Scenarios
Given('the user has searched for {string}', async function (this: CustomWorld, searchTerm: string) {
  const searchInput = this.page.locator('[data-testid="search-input"]')
  await searchInput.fill(searchTerm)
  await searchInput.press('Enter')
  await this.page.waitForLoadState('networkidle')
})

Given('search results are displayed', async function (this: CustomWorld) {
  await expect(this.page.locator('h2:has-text("Search Results")')).toBeVisible()
  await expect(this.page.locator('[data-testid="movie-card"]')).toHaveCount({ minimum: 1 })
})

Then('the search term {string} should be maintained', async function (this: CustomWorld, searchTerm: string) {
  const searchInput = this.page.locator('[data-testid="search-input"]')
  await expect(searchInput).toHaveValue(searchTerm)
})

// Multiple Genres Scenarios
When('the user selects the {string} genre filter', async function (this: CustomWorld, genreName: string) {
  // This step is reused from above - click additional genre filter
  const genreFilter = this.page.locator(`[data-testid="genre-filter-${genreName.toLowerCase()}"]`)
  await expect(genreFilter).toBeVisible()
  await genreFilter.click()
  await this.page.waitForLoadState('networkidle')
})

Then('all displayed movies should have both {string} AND {string} genres', async function (this: CustomWorld, genre1: string, genre2: string) {
  const movieCards = this.page.locator('[data-testid="movie-card"]')
  const count = await movieCards.count()
  expect(count).toBeGreaterThan(0)
  
  for (let i = 0; i < count; i++) {
    const movieCard = movieCards.nth(i)
    const genreBadges = movieCard.locator('[data-testid="genre-badge"]')
    const genreTexts = await genreBadges.allTextContents()
    
    const hasGenre1 = genreTexts.some(text => text.toLowerCase().includes(genre1.toLowerCase()))
    const hasGenre2 = genreTexts.some(text => text.toLowerCase().includes(genre2.toLowerCase()))
    
    expect(hasGenre1 && hasGenre2).toBe(true)
  }
})

// Pagination Scenarios
Given('the user has selected {string} genre filter', async function (this: CustomWorld, genreName: string) {
  const genreFilter = this.page.locator(`[data-testid="genre-filter-${genreName.toLowerCase()}"]`)
  await genreFilter.click()
  await this.page.waitForLoadState('networkidle')
})

Given('filtered popular movies are displayed', async function (this: CustomWorld) {
  await expect(this.page.locator('[data-testid="movie-card"]')).toHaveCount({ minimum: 1 })
  
  // Verify genre filter is active
  await expect(this.page.locator('[data-testid="active-genre-filter"]')).toBeVisible()
})

When('the user clicks {string}', async function (this: CustomWorld, buttonText: string) {
  const button = this.page.locator(`button:has-text("${buttonText}")`)
  await expect(button).toBeVisible()
  await button.click()
  await this.page.waitForLoadState('networkidle')
})

Then('the system should request the next page with genre filters maintained', async function (this: CustomWorld) {
  // Check that a page 2 request was made with genre parameters
  const page2Request = apiRequests.find(url => url.includes('page=2') && url.includes('genre='))
  expect(page2Request).toBeTruthy()
})

Then('all new movies should also have the {string} genre', async function (this: CustomWorld, genreName: string) {
  // Wait for new movies to load
  await this.page.waitForTimeout(1000)
  
  // Check that all movies (including newly loaded ones) have the genre
  const movieCards = this.page.locator('[data-testid="movie-card"]')
  const count = await movieCards.count()
  
  for (let i = 0; i < count; i++) {
    const movieCard = movieCards.nth(i)
    const genreBadges = movieCard.locator('[data-testid="genre-badge"]')
    const genreTexts = await genreBadges.allTextContents()
    
    const hasGenre = genreTexts.some(text => text.toLowerCase().includes(genreName.toLowerCase()))
    expect(hasGenre).toBe(true)
  }
})

// Clear Filters Scenarios
Given('the user has {string} and {string} filters active', async function (this: CustomWorld, genre1: string, genre2: string) {
  // Apply first filter
  const filter1 = this.page.locator(`[data-testid="genre-filter-${genre1.toLowerCase()}"]`)
  await filter1.click()
  await this.page.waitForLoadState('networkidle')
  
  // Apply second filter
  const filter2 = this.page.locator(`[data-testid="genre-filter-${genre2.toLowerCase()}"]`)
  await filter2.click()
  await this.page.waitForLoadState('networkidle')
})

Given('filtered movies are displayed', async function (this: CustomWorld) {
  await expect(this.page.locator('[data-testid="movie-card"]')).toHaveCount({ minimum: 1 })
})

When('the user clears all genre filters', async function (this: CustomWorld) {
  const clearFiltersButton = this.page.locator('[data-testid="clear-filters-button"]')
  await expect(clearFiltersButton).toBeVisible()
  await clearFiltersButton.click()
  await this.page.waitForLoadState('networkidle')
})

Then('the system should perform a new API request without genre parameters', async function (this: CustomWorld) {
  // Check that a request was made without genre parameters
  const requestWithoutGenre = apiRequests.find(url => 
    (url.includes('/api/movies/popular') || url.includes('/api/movies/search')) && 
    !url.includes('genre=')
  )
  expect(requestWithoutGenre).toBeTruthy()
})

Then('movies from all genres should be displayed', async function (this: CustomWorld) {
  const movieCards = this.page.locator('[data-testid="movie-card"]')
  const count = await movieCards.count()
  expect(count).toBeGreaterThan(0)
  
  // Collect all genres from all movies
  const allGenres = new Set<string>()
  
  for (let i = 0; i < count; i++) {
    const movieCard = movieCards.nth(i)
    const genreBadges = movieCard.locator('[data-testid="genre-badge"]')
    const genreTexts = await genreBadges.allTextContents()
    
    genreTexts.forEach(genre => allGenres.add(genre))
  }
  
  // Should have variety of genres (more than 2)
  expect(allGenres.size).toBeGreaterThan(2)
})

// Performance Scenarios
Then('the new search should begin within {int}ms', async function (this: CustomWorld, maxTime: number) {
  // This is tested by ensuring the loading state appears quickly
  await expect(this.page.locator('[data-testid="loading-spinner"]')).toBeVisible({ timeout: maxTime })
})

Then('the loading state should be displayed', async function (this: CustomWorld) {
  await expect(this.page.locator('[data-testid="loading-spinner"]')).toBeVisible()
})

Then('results should load within {int} seconds', async function (this: CustomWorld, maxSeconds: number) {
  await expect(this.page.locator('[data-testid="movie-card"]')).toHaveCount({ minimum: 1 }, { timeout: maxSeconds * 1000 })
})