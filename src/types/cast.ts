/**
 * Cast Member Data Model with Zod Schema Validation
 * Defines the CastMember interface and validation schemas for movie cast information
 */

import { z } from 'zod'

// Cast member schema and interface
export const CastMemberSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1).max(255),
  character: z.string().min(1).max(255),
  profilePath: z.string().nullable(),
  order: z.number().int().nonnegative()
})

export type CastMember = z.infer<typeof CastMemberSchema>

// Cast response schema for API endpoints
export const CastResponseSchema = z.object({
  cast: z.array(CastMemberSchema)
})

export type CastResponse = z.infer<typeof CastResponseSchema>

// TMDB cast member schema (raw API response)
export const TMDBCastMemberSchema = z.object({
  id: z.number(),
  name: z.string(),
  character: z.string(),
  profile_path: z.string().nullable(),
  order: z.number(),
  cast_id: z.number().optional(),
  credit_id: z.string().optional(),
  gender: z.number().optional(),
  known_for_department: z.string().optional(),
  popularity: z.number().optional(),
  adult: z.boolean().optional()
})

export type TMDBCastMember = z.infer<typeof TMDBCastMemberSchema>

// TMDB credits response schema
export const TMDBCreditsResponseSchema = z.object({
  id: z.number(),
  cast: z.array(TMDBCastMemberSchema),
  crew: z.array(z.any()).optional() // We're not using crew for now
})

export type TMDBCreditsResponse = z.infer<typeof TMDBCreditsResponseSchema>

// Validation functions
export function validateCastMember(data: unknown): CastMember {
  return CastMemberSchema.parse(data)
}

export function validateCastResponse(data: unknown): CastResponse {
  return CastResponseSchema.parse(data)
}

export function validateTMDBCreditsResponse(data: unknown): TMDBCreditsResponse {
  return TMDBCreditsResponseSchema.parse(data)
}

// Transform functions to convert TMDB API responses to our format
export function transformTMDBCastMember(tmdbCast: TMDBCastMember): CastMember {
  return {
    id: tmdbCast.id,
    name: tmdbCast.name,
    character: tmdbCast.character,
    profilePath: tmdbCast.profile_path,
    order: tmdbCast.order
  }
}

export function transformTMDBCreditsResponse(tmdbResponse: TMDBCreditsResponse, maxCastMembers: number = 10): CastMember[] {
  return tmdbResponse.cast
    .slice(0, maxCastMembers) // Limit cast members for performance
    .map(transformTMDBCastMember)
}

// Helper functions for cast member operations
export function getMainCast(cast: CastMember[], count: number = 5): CastMember[] {
  return cast
    .sort((a, b) => a.order - b.order)
    .slice(0, count)
}

export function findCastMemberByName(cast: CastMember[], name: string): CastMember | undefined {
  return cast.find(member => 
    member.name.toLowerCase().includes(name.toLowerCase())
  )
}

export function getCastMembersByCharacter(cast: CastMember[], character: string): CastMember[] {
  return cast.filter(member => 
    member.character.toLowerCase().includes(character.toLowerCase())
  )
}

// Cast member profile image URL helper
export function getCastMemberProfileUrl(profilePath: string | null, size: 'w45' | 'w185' | 'h632' | 'original' = 'w185'): string | null {
  if (!profilePath) return null
  return `https://image.tmdb.org/t/p/${size}${profilePath}`
}

// Schema for cast member search/filtering
export const CastMemberFilterSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  character: z.string().min(1).max(255).optional(),
  maxResults: z.number().int().positive().max(50).default(10)
})

export type CastMemberFilter = z.infer<typeof CastMemberFilterSchema>