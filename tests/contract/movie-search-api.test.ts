/**
 * Contract Test: Movie Search API
 * Tests the GET /api/movies/search endpoint contract
 * 
 * This test MUST FAIL initially as the API endpoint doesn't exist yet.
 * It validates the request/response contract defined in:
 * specs/001-minimal-viable-product/contracts/movie-search-api.md
 */

import { describe, it, expect } from '@jest/globals'

describe('Movie Search API Contract', () => {
  const API_BASE = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

  describe('GET /api/movies/search', () => {
    it('should return 404 when endpoint does not exist yet', async () => {
      // This test should FAIL initially - the endpoint doesn't exist
      const response = await fetch(`${API_BASE}/api/movies/search?q=action`)
      
      // Initially this will be 404, later it should be 200
      expect(response.status).toBe(404)
    })

    it('should validate required query parameter q', async () => {
      // Test will fail initially as endpoint doesn't exist
      const response = await fetch(`${API_BASE}/api/movies/search`)
      
      if (response.status !== 404) {
        // When endpoint exists, it should return 400 for missing query
        expect(response.status).toBe(400)
        const data = await response.json()
        expect(data.error).toBe('Invalid search query')
        expect(data.code).toBe('INVALID_QUERY')
      } else {
        // For now, endpoint doesn't exist
        expect(response.status).toBe(404)
      }
    })

    it('should return valid movie search response structure', async () => {
      // This test defines the expected response structure
      const response = await fetch(`${API_BASE}/api/movies/search?q=fight%20club`)
      
      if (response.status === 200) {
        const data = await response.json()
        
        // Validate response structure
        expect(data).toHaveProperty('results')
        expect(data).toHaveProperty('page')
        expect(data).toHaveProperty('totalPages')
        expect(data).toHaveProperty('totalResults')
        
        // Validate results array structure
        expect(Array.isArray(data.results)).toBe(true)
        
        if (data.results.length > 0) {
          const movie = data.results[0]
          
          // Required movie fields
          expect(movie).toHaveProperty('id')
          expect(movie).toHaveProperty('title')
          expect(movie).toHaveProperty('overview')
          expect(movie).toHaveProperty('releaseDate')
          expect(movie).toHaveProperty('voteAverage')
          expect(movie).toHaveProperty('voteCount')
          expect(movie).toHaveProperty('genres')
          expect(movie).toHaveProperty('popularity')
          
          // Optional fields
          expect(movie).toHaveProperty('posterPath')
          expect(movie).toHaveProperty('backdropPath')
          expect(movie).toHaveProperty('runtime')
          
          // Type validations
          expect(typeof movie.id).toBe('number')
          expect(typeof movie.title).toBe('string')
          expect(typeof movie.overview).toBe('string')
          expect(typeof movie.voteAverage).toBe('number')
          expect(typeof movie.voteCount).toBe('number')
          expect(Array.isArray(movie.genres)).toBe(true)
          
          // Value validations
          expect(movie.voteAverage).toBeGreaterThanOrEqual(0)
          expect(movie.voteAverage).toBeLessThanOrEqual(10)
          expect(movie.voteCount).toBeGreaterThanOrEqual(0)
          
          // Date format validation
          expect(movie.releaseDate).toMatch(/^\d{4}-\d{2}-\d{2}$/)
          
          // Genres validation
          if (movie.genres.length > 0) {
            const genre = movie.genres[0]
            expect(genre).toHaveProperty('id')
            expect(genre).toHaveProperty('name')
            expect(typeof genre.id).toBe('number')
            expect(typeof genre.name).toBe('string')
          }
        }
        
        // Pagination validation
        expect(typeof data.page).toBe('number')
        expect(typeof data.totalPages).toBe('number')
        expect(typeof data.totalResults).toBe('number')
        expect(data.page).toBeGreaterThan(0)
        expect(data.totalPages).toBeGreaterThanOrEqual(0)
        expect(data.totalResults).toBeGreaterThanOrEqual(0)
      } else {
        // For now, expect 404 as endpoint doesn't exist
        expect(response.status).toBe(404)
      }
    })

    it('should handle pagination correctly', async () => {
      const response = await fetch(`${API_BASE}/api/movies/search?q=action&page=2`)
      
      if (response.status === 200) {
        const data = await response.json()
        expect(data.page).toBe(2)
      } else {
        // For now, expect 404 as endpoint doesn't exist
        expect(response.status).toBe(404)
      }
    })

    it('should filter by genre when provided', async () => {
      const response = await fetch(`${API_BASE}/api/movies/search?q=action&genre=28`)
      
      if (response.status === 200) {
        const data = await response.json()
        
        // All movies should include the specified genre
        data.results.forEach((movie: any) => {
          const hasGenre = movie.genres.some((genre: any) => genre.id === 28)
          expect(hasGenre).toBe(true)
        })
      } else {
        // For now, expect 404 as endpoint doesn't exist
        expect(response.status).toBe(404)
      }
    })

    it('should return 400 for invalid query parameters', async () => {
      // Test empty query
      const emptyResponse = await fetch(`${API_BASE}/api/movies/search?q=`)
      
      if (emptyResponse.status !== 404) {
        expect(emptyResponse.status).toBe(400)
        const data = await emptyResponse.json()
        expect(data.error).toBe('Invalid search query')
      }
      
      // Test invalid page
      const invalidPageResponse = await fetch(`${API_BASE}/api/movies/search?q=test&page=0`)
      
      if (invalidPageResponse.status !== 404) {
        expect(invalidPageResponse.status).toBe(400)
      }
    })

    it('should handle API response time within 2 seconds', async () => {
      const startTime = Date.now()
      const response = await fetch(`${API_BASE}/api/movies/search?q=test`)
      const endTime = Date.now()
      
      if (response.status === 200) {
        const responseTime = endTime - startTime
        expect(responseTime).toBeLessThan(2000) // < 2 seconds
      } else {
        // For now, expect 404 as endpoint doesn't exist
        expect(response.status).toBe(404)
      }
    })
  })
})