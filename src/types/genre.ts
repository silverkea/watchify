/**
 * Genre Data Model with Zod Schema Validation
 * Defines the Genre interface and validation schemas for movie genre filtering
 */

import { z } from 'zod'

// Genre schema and interface (can be reused from movie.ts)
export const GenreSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1).max(50)
})

export type Genre = z.infer<typeof GenreSchema>

// Genres response schema for API endpoint
export const GenresResponseSchema = z.object({
  genres: z.array(GenreSchema)
})

export type GenresResponse = z.infer<typeof GenresResponseSchema>

// TMDB genres API response schema
export const TMDBGenresResponseSchema = z.object({
  genres: z.array(z.object({
    id: z.number(),
    name: z.string()
  }))
})

export type TMDBGenresResponse = z.infer<typeof TMDBGenresResponseSchema>

// Validation functions
export function validateGenre(data: unknown): Genre {
  return GenreSchema.parse(data)
}

export function validateGenresResponse(data: unknown): GenresResponse {
  return GenresResponseSchema.parse(data)
}

export function validateTMDBGenresResponse(data: unknown): TMDBGenresResponse {
  return TMDBGenresResponseSchema.parse(data)
}

// Transform function to convert TMDB genres response to our format
export function transformTMDBGenresResponse(tmdbResponse: TMDBGenresResponse): GenresResponse {
  return {
    genres: tmdbResponse.genres.map(genre => ({
      id: genre.id,
      name: genre.name
    }))
  }
}

// Predefined genre constants for validation and filtering
export const TMDB_GENRES = {
  ACTION: 28,
  ADVENTURE: 12,
  ANIMATION: 16,
  COMEDY: 35,
  CRIME: 80,
  DOCUMENTARY: 99,
  DRAMA: 18,
  FAMILY: 10751,
  FANTASY: 14,
  HISTORY: 36,
  HORROR: 27,
  MUSIC: 10402,
  MYSTERY: 9648,
  ROMANCE: 10749,
  SCIENCE_FICTION: 878,
  TV_MOVIE: 10770,
  THRILLER: 53,
  WAR: 10752,
  WESTERN: 37
} as const

// Helper function to get genre name by ID
export function getGenreNameById(id: number): string | undefined {
  const genreEntry = Object.entries(TMDB_GENRES).find(([_, genreId]) => genreId === id)
  return genreEntry ? genreEntry[0].replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase()) : undefined
}

// Helper function to validate genre ID
export function isValidGenreId(id: number): boolean {
  return Object.values(TMDB_GENRES).includes(id as any)
}

// Genre filter validation schema for API requests
export const GenreFilterSchema = z.object({
  genreId: z.number().int().positive().refine(isValidGenreId, {
    message: 'Invalid genre ID'
  })
})

export type GenreFilter = z.infer<typeof GenreFilterSchema>