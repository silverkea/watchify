/**
 * Contract Tests: Popular Movies API with Genre Filtering
 * GET /api/movies/popular
 * 
 * These tests validate the API contract for popular movies with genre filtering support.
 * Tests MUST fail initially - implementation comes after.
 */

import { describe, test, expect } from '@jest/globals'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

describe('GET /api/movies/popular - Contract Tests', () => {
  test('should return popular movies without genre filter', async () => {
    const response = await fetch(`${API_BASE_URL}/api/movies/popular?page=1`)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(response.headers.get('content-type')).toContain('application/json')
    
    // Response structure validation
    expect(data).toHaveProperty('page', 1)
    expect(data).toHaveProperty('results')
    expect(data).toHaveProperty('totalPages')
    expect(data).toHaveProperty('totalResults')
    expect(Array.isArray(data.results)).toBe(true)
    expect(data.results.length).toBeGreaterThan(0)
    expect(data.results.length).toBeLessThanOrEqual(20)

    // Movie object structure validation
    const movie = data.results[0]
    expect(movie).toHaveProperty('id')
    expect(movie).toHaveProperty('title')
    expect(movie).toHaveProperty('overview')
    expect(movie).toHaveProperty('releaseDate')
    expect(movie).toHaveProperty('posterPath')
    expect(movie).toHaveProperty('voteAverage')
    expect(movie).toHaveProperty('genres')
    expect(Array.isArray(movie.genres)).toBe(true)
  })

  test('should return popular movies filtered by single genre', async () => {
    const actionGenreId = 28 // Action genre ID in TMDB
    const response = await fetch(`${API_BASE_URL}/api/movies/popular?page=1&genre=${actionGenreId}`)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data).toHaveProperty('results')
    expect(Array.isArray(data.results)).toBe(true)
    
    // Verify all movies have the Action genre
    data.results.forEach((movie: any) => {
      const hasActionGenre = movie.genres.some((genre: any) => genre.id === actionGenreId)
      expect(hasActionGenre).toBe(true)
    })
  })

  test('should return popular movies filtered by multiple genres (AND logic)', async () => {
    const actionGenreId = 28 // Action
    const adventureGenreId = 12 // Adventure
    const response = await fetch(`${API_BASE_URL}/api/movies/popular?page=1&genre=${actionGenreId},${adventureGenreId}`)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data).toHaveProperty('results')
    expect(Array.isArray(data.results)).toBe(true)
    
    // Verify all movies have BOTH Action AND Adventure genres
    data.results.forEach((movie: any) => {
      const hasActionGenre = movie.genres.some((genre: any) => genre.id === actionGenreId)
      const hasAdventureGenre = movie.genres.some((genre: any) => genre.id === adventureGenreId)
      expect(hasActionGenre && hasAdventureGenre).toBe(true)
    })
  })

  test('should support pagination with genre filters', async () => {
    const comedyGenreId = 35 // Comedy genre ID
    
    // Get first page
    const page1Response = await fetch(`${API_BASE_URL}/api/movies/popular?page=1&genre=${comedyGenreId}`)
    const page1Data = await page1Response.json()
    
    // Get second page
    const page2Response = await fetch(`${API_BASE_URL}/api/movies/popular?page=2&genre=${comedyGenreId}`)
    const page2Data = await page2Response.json()

    expect(page1Response.status).toBe(200)
    expect(page2Response.status).toBe(200)
    
    expect(page1Data.page).toBe(1)
    expect(page2Data.page).toBe(2)
    
    // Results should be different between pages
    const page1Ids = page1Data.results.map((movie: any) => movie.id)
    const page2Ids = page2Data.results.map((movie: any) => movie.id)
    const intersection = page1Ids.filter((id: number) => page2Ids.includes(id))
    expect(intersection.length).toBe(0) // No overlap between pages
  })

  test('should return 400 for invalid genre ID', async () => {
    const response = await fetch(`${API_BASE_URL}/api/movies/popular?page=1&genre=invalid`)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data).toHaveProperty('error')
    expect(data).toHaveProperty('code', 'INVALID_GENRE')
  })

  test('should return 400 for invalid page number', async () => {
    const response = await fetch(`${API_BASE_URL}/api/movies/popular?page=0&genre=28`)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data).toHaveProperty('error')
    expect(data).toHaveProperty('code', 'INVALID_PAGE')
  })

  test('should include proper cache headers', async () => {
    const response = await fetch(`${API_BASE_URL}/api/movies/popular?page=1&genre=28`)
    
    expect(response.status).toBe(200)
    expect(response.headers.get('cache-control')).toContain('public')
    expect(response.headers.get('cache-control')).toContain('max-age=3600') // 1 hour cache
  })

  test('should handle non-existent genre gracefully', async () => {
    const nonExistentGenreId = 99999
    const response = await fetch(`${API_BASE_URL}/api/movies/popular?page=1&genre=${nonExistentGenreId}`)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data).toHaveProperty('results')
    expect(Array.isArray(data.results)).toBe(true)
    // Should return empty results or handle gracefully
  })
})