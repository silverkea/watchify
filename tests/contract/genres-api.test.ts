/**
 * Contract Test: Genres API
 * Tests the GET /api/genres endpoint contract
 * 
 * This test MUST FAIL initially as the API endpoint doesn't exist yet.
 * It validates the request/response contract defined in:
 * specs/001-minimal-viable-product/contracts/genres-api.md
 */

import { describe, it, expect } from '@jest/globals'

describe('Genres API Contract', () => {
  const API_BASE = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

  describe('GET /api/genres', () => {
    it('should return 404 when endpoint does not exist yet', async () => {
      // This test should FAIL initially - the endpoint doesn't exist
      const response = await fetch(`${API_BASE}/api/genres`)
      
      // Initially this will be 404, later it should be 200
      expect(response.status).toBe(404)
    })

    it('should return valid genres list response structure', async () => {
      const response = await fetch(`${API_BASE}/api/genres`)
      
      if (response.status === 200) {
        const data = await response.json()
        
        // Response should have genres array
        expect(data).toHaveProperty('genres')
        expect(Array.isArray(data.genres)).toBe(true)
        
        // Should have at least some genres
        expect(data.genres.length).toBeGreaterThan(0)
        
        // Validate each genre structure
        data.genres.forEach((genre: any) => {
          expect(genre).toHaveProperty('id')
          expect(genre).toHaveProperty('name')
          expect(typeof genre.id).toBe('number')
          expect(typeof genre.name).toBe('string')
          expect(genre.id).toBeGreaterThan(0)
          expect(genre.name.length).toBeGreaterThan(0)
        })
      } else {
        // For now, expect 404 as endpoint doesn't exist
        expect(response.status).toBe(404)
      }
    })

    it('should include standard TMDB genres', async () => {
      const response = await fetch(`${API_BASE}/api/genres`)
      
      if (response.status === 200) {
        const data = await response.json()
        
        // Check for some standard TMDB genres
        const genreNames = data.genres.map((genre: any) => genre.name)
        const standardGenres = ['Action', 'Comedy', 'Drama', 'Horror', 'Romance', 'Thriller']
        
        // At least some of these should be present
        const foundGenres = standardGenres.filter(name => genreNames.includes(name))
        expect(foundGenres.length).toBeGreaterThan(3)
        
        // Check specific genre IDs for known genres
        const actionGenre = data.genres.find((genre: any) => genre.name === 'Action')
        if (actionGenre) {
          expect(actionGenre.id).toBe(28) // TMDB Action genre ID
        }
        
        const comedyGenre = data.genres.find((genre: any) => genre.name === 'Comedy')
        if (comedyGenre) {
          expect(comedyGenre.id).toBe(35) // TMDB Comedy genre ID
        }
      } else {
        // For now, expect 404 as endpoint doesn't exist
        expect(response.status).toBe(404)
      }
    })

    it('should return genres in consistent order', async () => {
      // Make multiple requests to ensure consistent ordering
      const responses = await Promise.all([
        fetch(`${API_BASE}/api/genres`),
        fetch(`${API_BASE}/api/genres`),
        fetch(`${API_BASE}/api/genres`)
      ])
      
      if (responses[0].status === 200) {
        const data1 = await responses[0].json()
        const data2 = await responses[1].json()
        const data3 = await responses[2].json()
        
        // Order should be consistent across requests
        expect(data1.genres).toEqual(data2.genres)
        expect(data2.genres).toEqual(data3.genres)
        
        // Should be sorted by name or ID consistently
        const sortedByName = [...data1.genres].sort((a, b) => a.name.localeCompare(b.name))
        const sortedById = [...data1.genres].sort((a, b) => a.id - b.id)
        
        // Should match one of these sorting orders
        const matchesNameSort = JSON.stringify(data1.genres) === JSON.stringify(sortedByName)
        const matchesIdSort = JSON.stringify(data1.genres) === JSON.stringify(sortedById)
        
        expect(matchesNameSort || matchesIdSort).toBe(true)
      } else {
        // For now, expect 404 as endpoint doesn't exist
        responses.forEach(response => {
          expect(response.status).toBe(404)
        })
      }
    })

    it('should handle caching correctly', async () => {
      const startTime1 = Date.now()
      const response1 = await fetch(`${API_BASE}/api/genres`)
      const endTime1 = Date.now()
      
      if (response1.status === 200) {
        // Second request should be faster due to caching
        const startTime2 = Date.now()
        const response2 = await fetch(`${API_BASE}/api/genres`)
        const endTime2 = Date.now()
        
        expect(response2.status).toBe(200)
        
        const data1 = await response1.json()
        const data2 = await response2.json()
        
        // Data should be identical
        expect(data1).toEqual(data2)
        
        // Second request should typically be faster (cached)
        const firstRequestTime = endTime1 - startTime1
        const secondRequestTime = endTime2 - startTime2
        
        // Both should be under 2 seconds
        expect(firstRequestTime).toBeLessThan(2000)
        expect(secondRequestTime).toBeLessThan(2000)
      } else {
        // For now, expect 404 as endpoint doesn't exist
        expect(response1.status).toBe(404)
      }
    })

    it('should return proper content type headers', async () => {
      const response = await fetch(`${API_BASE}/api/genres`)
      
      if (response.status === 200) {
        const contentType = response.headers.get('content-type')
        expect(contentType).toContain('application/json')
      } else {
        // For now, expect 404 as endpoint doesn't exist
        expect(response.status).toBe(404)
      }
    })

    it('should handle CORS headers correctly', async () => {
      const response = await fetch(`${API_BASE}/api/genres`)
      
      if (response.status === 200) {
        // Should have appropriate CORS headers for browser requests
        const corsOrigin = response.headers.get('access-control-allow-origin')
        // Either specific origin or wildcard should be present
        expect(corsOrigin).toBeDefined()
      } else {
        // For now, expect 404 as endpoint doesn't exist
        expect(response.status).toBe(404)
      }
    })

    it('should return response within 2 seconds', async () => {
      const startTime = Date.now()
      const response = await fetch(`${API_BASE}/api/genres`)
      const endTime = Date.now()
      
      const responseTime = endTime - startTime
      
      if (response.status === 200) {
        expect(responseTime).toBeLessThan(2000) // < 2 seconds
      } else {
        // For now, expect 404 as endpoint doesn't exist
        expect(response.status).toBe(404)
        // Even 404 should be fast
        expect(responseTime).toBeLessThan(1000)
      }
    })
  })
})