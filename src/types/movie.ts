/**
 * Movie Data Model with Zod Schema Validation
 * Defines the Movie interface and validation schemas for TMDB API responses
 */

import { z } from 'zod'

// Genre schema and interface
export const GenreSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1).max(50)
})

export type Genre = z.infer<typeof GenreSchema>

// Cast member schema and interface
export const CastMemberSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1).max(255),
  character: z.string().min(1).max(255),
  profilePath: z.string().nullable(),
  order: z.number().int().nonnegative()
})

export type CastMember = z.infer<typeof CastMemberSchema>

// Movie schema and interface
export const MovieSchema = z.object({
  id: z.number().int().positive(),
  title: z.string().min(1).max(255),
  overview: z.string().max(2000).optional().default(''),
  releaseDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Must be in YYYY-MM-DD format').optional().default(''),
  posterPath: z.string().nullable(),
  backdropPath: z.string().nullable(),
  voteAverage: z.number().min(0).max(10).optional().default(0),
  voteCount: z.number().int().nonnegative().optional().default(0),
  genres: z.array(GenreSchema),
  runtime: z.number().int().positive().nullable(),
  cast: z.array(CastMemberSchema),
  popularity: z.number().nonnegative().optional().default(0)
})

export type Movie = z.infer<typeof MovieSchema>

// Movie search response schema
export const MovieSearchResponseSchema = z.object({
  page: z.number().int().positive(),
  results: z.array(MovieSchema),
  totalPages: z.number().int().nonnegative(),
  totalResults: z.number().int().nonnegative()
})

export type MovieSearchResponse = z.infer<typeof MovieSearchResponseSchema>

// Movie details response (extends Movie with additional fields)
export const MovieDetailsResponseSchema = MovieSchema.extend({
  belongsToCollection: z.object({
    id: z.number().int().positive(),
    name: z.string(),
    posterPath: z.string().nullable(),
    backdropPath: z.string().nullable()
  }).nullable().optional(),
  budget: z.number().int().nonnegative().optional(),
  revenue: z.number().int().nonnegative().optional(),
  status: z.string().optional(),
  tagline: z.string().optional()
})

export type MovieDetailsResponse = z.infer<typeof MovieDetailsResponseSchema>

// TMDB API raw response schemas (before transformation)
export const TMDBGenreSchema = z.object({
  id: z.number(),
  name: z.string()
})

export const TMDBCastMemberSchema = z.object({
  id: z.number(),
  name: z.string(),
  character: z.string(),
  profile_path: z.string().nullable(),
  order: z.number()
})

export const TMDBMovieSchema = z.object({
  id: z.number(),
  title: z.string(),
  overview: z.string().optional(),
  release_date: z.string().optional(),
  poster_path: z.string().nullable(),
  backdrop_path: z.string().nullable(),
  vote_average: z.number().optional(),
  vote_count: z.number().optional(),
  genre_ids: z.array(z.number()).optional(),
  genres: z.array(TMDBGenreSchema).optional(),
  runtime: z.number().nullable().optional(),
  popularity: z.number().optional()
})

export const TMDBMovieSearchResponseSchema = z.object({
  page: z.number(),
  results: z.array(TMDBMovieSchema),
  total_pages: z.number(),
  total_results: z.number()
})

export const TMDBMovieDetailsSchema = TMDBMovieSchema.extend({
  belongs_to_collection: z.object({
    id: z.number(),
    name: z.string(),
    poster_path: z.string().nullable(),
    backdrop_path: z.string().nullable()
  }).nullable().optional(),
  budget: z.number().optional(),
  revenue: z.number().optional(),
  status: z.string().optional(),
  tagline: z.string().optional()
})

export const TMDBCreditsSchema = z.object({
  cast: z.array(TMDBCastMemberSchema)
})

// Validation functions
export function validateMovie(data: unknown): Movie {
  return MovieSchema.parse(data)
}

export function validateMovieSearchResponse(data: unknown): MovieSearchResponse {
  return MovieSearchResponseSchema.parse(data)
}

export function validateMovieDetailsResponse(data: unknown): MovieDetailsResponse {
  return MovieDetailsResponseSchema.parse(data)
}

// Transform functions to convert TMDB API responses to our format
export function transformTMDBMovie(tmdbMovie: z.infer<typeof TMDBMovieSchema>, genres: Genre[] = [], cast: CastMember[] = []): Movie {
  return {
    id: tmdbMovie.id,
    title: tmdbMovie.title,
    overview: tmdbMovie.overview || '',
    releaseDate: tmdbMovie.release_date || '',
    posterPath: tmdbMovie.poster_path,
    backdropPath: tmdbMovie.backdrop_path,
    voteAverage: tmdbMovie.vote_average || 0,
    voteCount: tmdbMovie.vote_count || 0,
    genres: genres,
    runtime: tmdbMovie.runtime || null,
    cast: cast,
    popularity: tmdbMovie.popularity || 0
  }
}

export function transformTMDBCastMember(tmdbCast: z.infer<typeof TMDBCastMemberSchema>): CastMember {
  return {
    id: tmdbCast.id,
    name: tmdbCast.name,
    character: tmdbCast.character,
    profilePath: tmdbCast.profile_path,
    order: tmdbCast.order
  }
}

export function transformTMDBGenre(tmdbGenre: z.infer<typeof TMDBGenreSchema>): Genre {
  return {
    id: tmdbGenre.id,
    name: tmdbGenre.name
  }
}