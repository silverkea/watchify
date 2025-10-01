/**
 * Shareable URL Data Model with Zod Schema Validation
 * Defines the ShareableURLData interface for stateless watch party sharing
 */

import { z } from 'zod'

// Shareable URL data schema (minimal data for URL encoding)
export const ShareableURLDataSchema = z.object({
  watchPartyId: z.string().uuid(),
  movieId: z.number().int().positive(),
  scheduledTime: z.string().datetime(),
  movieTitle: z.string().min(1).max(255),
  moviePoster: z.string().nullable()
})

export type ShareableURLData = z.infer<typeof ShareableURLDataSchema>

// Extended shareable data with additional context
export const ExtendedShareableDataSchema = ShareableURLDataSchema.extend({
  movieOverview: z.string().max(500).optional(),
  movieReleaseDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  movieRuntime: z.number().int().positive().nullable().optional(),
  createdAt: z.string().datetime().optional()
})

export type ExtendedShareableData = z.infer<typeof ExtendedShareableDataSchema>

// URL encoding constraints
export const URL_ENCODING_CONSTRAINTS = {
  MAX_URL_LENGTH: 2048,
  MAX_DATA_LENGTH: 1500, // Leave room for base URL and parameters
  COMPRESSION_RATIO: 1.33 // Base64 expansion factor
} as const

// Validation functions
export function validateShareableURLData(data: unknown): ShareableURLData {
  return ShareableURLDataSchema.parse(data)
}

export function validateExtendedShareableData(data: unknown): ExtendedShareableData {
  return ExtendedShareableDataSchema.parse(data)
}

// Helper functions for URL data operations
export function createShareableURLData(
  watchPartyId: string,
  movieId: number,
  scheduledTime: string,
  movieTitle: string,
  moviePoster: string | null
): ShareableURLData {
  return {
    watchPartyId,
    movieId,
    scheduledTime,
    movieTitle: truncateTitle(movieTitle),
    moviePoster
  }
}

export function truncateTitle(title: string, maxLength: number = 100): string {
  if (title.length <= maxLength) return title
  return title.slice(0, maxLength - 3) + '...'
}

export function estimateEncodedSize(data: ShareableURLData): number {
  const jsonString = JSON.stringify(data)
  return Math.ceil(jsonString.length * URL_ENCODING_CONSTRAINTS.COMPRESSION_RATIO)
}

export function isDataSizeValid(data: ShareableURLData): boolean {
  return estimateEncodedSize(data) <= URL_ENCODING_CONSTRAINTS.MAX_DATA_LENGTH
}

// URL generation helpers
export function generateShareableUrl(baseUrl: string, encodedData: string): string {
  const url = `${baseUrl}/watch-party?data=${encodedData}`
  
  if (url.length > URL_ENCODING_CONSTRAINTS.MAX_URL_LENGTH) {
    throw new Error(`URL too long: ${url.length} characters (max: ${URL_ENCODING_CONSTRAINTS.MAX_URL_LENGTH})`)
  }
  
  return url
}

export function extractEncodedDataFromUrl(url: string): string | null {
  try {
    const urlObj = new URL(url)
    return urlObj.searchParams.get('data')
  } catch {
    return null
  }
}

// Data optimization for URL encoding
export function optimizeForEncoding(data: ShareableURLData): ShareableURLData {
  return {
    ...data,
    movieTitle: truncateTitle(data.movieTitle, 80), // Reduce title length
    moviePoster: data.moviePoster ? shortenPosterPath(data.moviePoster) : null
  }
}

export function shortenPosterPath(posterPath: string): string {
  // Extract just the filename from TMDB poster path
  const parts = posterPath.split('/')
  return parts[parts.length - 1] || posterPath
}

export function expandPosterPath(shortenedPath: string): string {
  // Add back the TMDB base path if it's just a filename
  if (!shortenedPath.startsWith('/')) {
    return `/${shortenedPath}`
  }
  return shortenedPath
}

// URL validation schema for incoming requests
export const URLDataRequestSchema = z.object({
  data: z.string().min(1, 'Encoded data is required').refine(
    (data) => {
      try {
        // Basic validation that it could be base64
        atob(data.replace(/-/g, '+').replace(/_/g, '/'))
        return true
      } catch {
        return false
      }
    },
    { message: 'Invalid encoded data format' }
  )
})

export type URLDataRequest = z.infer<typeof URLDataRequestSchema>

// Watch party URL structure
export const WatchPartyURLSchema = z.object({
  baseUrl: z.string().url(),
  encodedData: z.string(),
  fullUrl: z.string().url().refine(
    (url) => url.length <= URL_ENCODING_CONSTRAINTS.MAX_URL_LENGTH,
    { message: `URL too long (max: ${URL_ENCODING_CONSTRAINTS.MAX_URL_LENGTH} characters)` }
  )
})

export type WatchPartyURL = z.infer<typeof WatchPartyURLSchema>

// Error types for URL operations
export class URLEncodingError extends Error {
  constructor(message: string, public readonly data?: any) {
    super(message)
    this.name = 'URLEncodingError'
  }
}

export class URLDecodingError extends Error {
  constructor(message: string, public readonly encodedData?: string) {
    super(message)
    this.name = 'URLDecodingError'
  }
}

export class URLSizeError extends Error {
  constructor(message: string, public readonly actualSize?: number, public readonly maxSize?: number) {
    super(message)
    this.name = 'URLSizeError'
  }
}