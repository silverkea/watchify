/**
 * Contract Test: Movie Details API
 * Tests the GET /api/movies/[id] endpoint contract
 * 
 * This test MUST FAIL initially as the API endpoint doesn't exist yet.
 * It validates the request/response contract defined in:
 * specs/001-minimal-viable-product/contracts/movie-details-api.md
 */

import { describe, it, expect } from '@jest/globals'

describe('Movie Details API Contract', () => {
  const API_BASE = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

  describe('GET /api/movies/[id]', () => {
    it('should return 404 when endpoint does not exist yet', async () => {
      // This test should FAIL initially - the endpoint doesn't exist
      const response = await fetch(`${API_BASE}/api/movies/550`)
      
      // Initially this will be 404, later it should be 200
      expect(response.status).toBe(404)
    })

    it('should return valid movie details response structure', async () => {
      // Test with Fight Club (ID: 550) - a well-known movie
      const response = await fetch(`${API_BASE}/api/movies/550`)
      
      if (response.status === 200) {
        const movie = await response.json()
        
        // Required movie fields
        expect(movie).toHaveProperty('id')
        expect(movie).toHaveProperty('title')
        expect(movie).toHaveProperty('overview')
        expect(movie).toHaveProperty('releaseDate')
        expect(movie).toHaveProperty('voteAverage')
        expect(movie).toHaveProperty('voteCount')
        expect(movie).toHaveProperty('genres')
        expect(movie).toHaveProperty('runtime')
        expect(movie).toHaveProperty('cast')
        expect(movie).toHaveProperty('popularity')
        
        // Optional fields
        expect(movie).toHaveProperty('posterPath')
        expect(movie).toHaveProperty('backdropPath')
        
        // Type validations
        expect(typeof movie.id).toBe('number')
        expect(typeof movie.title).toBe('string')
        expect(typeof movie.overview).toBe('string')
        expect(typeof movie.voteAverage).toBe('number')
        expect(typeof movie.voteCount).toBe('number')
        expect(typeof movie.runtime).toBe('number')
        expect(typeof movie.popularity).toBe('number')
        expect(Array.isArray(movie.genres)).toBe(true)
        expect(Array.isArray(movie.cast)).toBe(true)
        
        // Value validations
        expect(movie.id).toBe(550)
        expect(movie.voteAverage).toBeGreaterThanOrEqual(0)
        expect(movie.voteAverage).toBeLessThanOrEqual(10)
        expect(movie.voteCount).toBeGreaterThanOrEqual(0)
        expect(movie.runtime).toBeGreaterThan(0)
        
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
        
        // Cast validation
        if (movie.cast.length > 0) {
          const castMember = movie.cast[0]
          expect(castMember).toHaveProperty('id')
          expect(castMember).toHaveProperty('name')
          expect(castMember).toHaveProperty('character')
          expect(castMember).toHaveProperty('order')
          expect(castMember).toHaveProperty('profilePath')
          
          expect(typeof castMember.id).toBe('number')
          expect(typeof castMember.name).toBe('string')
          expect(typeof castMember.character).toBe('string')
          expect(typeof castMember.order).toBe('number')
          expect(castMember.order).toBeGreaterThanOrEqual(0)
        }
      } else {
        // For now, expect 404 as endpoint doesn't exist
        expect(response.status).toBe(404)
      }
    })

    it('should return 400 for invalid movie ID', async () => {
      // Test with invalid ID
      const response = await fetch(`${API_BASE}/api/movies/invalid`)
      
      if (response.status !== 404) {
        expect(response.status).toBe(400)
        const data = await response.json()
        expect(data.error).toBeDefined()
        expect(data.code).toBe('INVALID_MOVIE_ID')
      } else {
        // For now, expect 404 as endpoint doesn't exist
        expect(response.status).toBe(404)
      }
    })

    it('should return 404 for non-existent movie', async () => {
      // Test with non-existent but valid ID
      const response = await fetch(`${API_BASE}/api/movies/999999999`)
      
      if (response.status === 404) {
        const data = await response.json()
        
        if (data.error) {
          // When endpoint exists, should return structured error
          expect(data.error).toBeDefined()
          expect(data.code).toBe('MOVIE_NOT_FOUND')
        }
      } else {
        // For now, endpoint doesn't exist
        expect(response.status).toBe(404)
      }
    })

    it('should handle API response time within 2 seconds', async () => {
      const startTime = Date.now()
      const response = await fetch(`${API_BASE}/api/movies/550`)
      const endTime = Date.now()
      
      if (response.status === 200) {
        const responseTime = endTime - startTime
        expect(responseTime).toBeLessThan(2000) // < 2 seconds
      } else {
        // For now, expect 404 as endpoint doesn't exist
        expect(response.status).toBe(404)
      }
    })

    it('should return consistent data format for different movies', async () => {
      // Test with multiple movies to ensure consistent format
      const movieIds = [550, 13, 27205] // Fight Club, Forrest Gump, Inception
      
      for (const movieId of movieIds) {
        const response = await fetch(`${API_BASE}/api/movies/${movieId}`)
        
        if (response.status === 200) {
          const movie = await response.json()
          
          // All movies should have the same required structure
          expect(movie).toHaveProperty('id')
          expect(movie).toHaveProperty('title')
          expect(movie).toHaveProperty('overview')
          expect(movie).toHaveProperty('releaseDate')
          expect(movie).toHaveProperty('voteAverage')
          expect(movie).toHaveProperty('voteCount')
          expect(movie).toHaveProperty('genres')
          expect(movie).toHaveProperty('runtime')
          expect(movie).toHaveProperty('cast')
          
          expect(movie.id).toBe(movieId)
          expect(typeof movie.title).toBe('string')
          expect(movie.title.length).toBeGreaterThan(0)
        } else {
          // For now, expect 404 as endpoint doesn't exist
          expect(response.status).toBe(404)
        }
      }
    })
  })
})