/**
 * Watch Party Data Model with Zod Schema Validation
 * Defines the WatchParty interface and validation schemas for stateless architecture
 */

import { z } from 'zod'

import { MovieSchema } from './movie'

// Watch party status enum
export const WatchPartyStatus = {
  SCHEDULED: 'scheduled',
  LIVE: 'live',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
} as const

export const WatchPartyStatusSchema = z.enum(['scheduled', 'live', 'completed', 'cancelled'])

export type WatchPartyStatusType = z.infer<typeof WatchPartyStatusSchema>

// Watch party schema and interface
export const WatchPartySchema = z.object({
  id: z.string().uuid(),
  movieId: z.number().int().positive(),
  movie: MovieSchema,
  scheduledTime: z.string().datetime(),
  createdAt: z.string().datetime(),
  status: WatchPartyStatusSchema,
  participants: z.number().int().nonnegative(),
  encodedData: z.string()
})

export type WatchParty = z.infer<typeof WatchPartySchema>

// Watch party creation request schema
export const CreateWatchPartyRequestSchema = z.object({
  movieId: z.number().int().positive(),
  scheduledTime: z.string().datetime().refine(
    (time) => new Date(time) > new Date(),
    { message: 'Scheduled time must be in the future' }
  )
})

export type CreateWatchPartyRequest = z.infer<typeof CreateWatchPartyRequestSchema>

// Watch party response schema for API endpoints
export const WatchPartyResponseSchema = z.object({
  id: z.string().uuid(),
  movieId: z.number().int().positive(),
  movieTitle: z.string(),
  moviePoster: z.string().nullable(),
  scheduledTime: z.string().datetime(),
  status: WatchPartyStatusSchema,
  participants: z.number().int().nonnegative(),
  shareableUrl: z.string().url(),
  timeUntilStart: z.number().int().optional(), // milliseconds until start
  isStarted: z.boolean(),
  isCompleted: z.boolean()
})

export type WatchPartyResponse = z.infer<typeof WatchPartyResponseSchema>

// Validation functions
export function validateWatchParty(data: unknown): WatchParty {
  return WatchPartySchema.parse(data)
}

export function validateCreateWatchPartyRequest(data: unknown): CreateWatchPartyRequest {
  return CreateWatchPartyRequestSchema.parse(data)
}

export function validateWatchPartyResponse(data: unknown): WatchPartyResponse {
  return WatchPartyResponseSchema.parse(data)
}

// Helper functions for watch party operations
export function createWatchPartyId(): string {
  return crypto.randomUUID()
}

export function getWatchPartyStatus(scheduledTime: string, runtime?: number): WatchPartyStatusType {
  const now = new Date()
  const startTime = new Date(scheduledTime)
  
  if (now < startTime) {
    return WatchPartyStatus.SCHEDULED
  }
  
  if (runtime) {
    const endTime = new Date(startTime.getTime() + runtime * 60 * 1000) // runtime in minutes
    if (now >= startTime && now < endTime) {
      return WatchPartyStatus.LIVE
    } else if (now >= endTime) {
      return WatchPartyStatus.COMPLETED
    }
  }
  
  // If no runtime or within start time, consider it live
  return WatchPartyStatus.LIVE
}

export function getTimeUntilStart(scheduledTime: string): number {
  const now = new Date()
  const startTime = new Date(scheduledTime)
  return Math.max(0, startTime.getTime() - now.getTime())
}

export function isWatchPartyStarted(scheduledTime: string): boolean {
  return new Date() >= new Date(scheduledTime)
}

export function isWatchPartyCompleted(scheduledTime: string, runtime?: number): boolean {
  if (!runtime) return false
  
  const now = new Date()
  const startTime = new Date(scheduledTime)
  const endTime = new Date(startTime.getTime() + runtime * 60 * 1000)
  
  return now >= endTime
}

export function formatTimeUntilStart(milliseconds: number): string {
  if (milliseconds <= 0) return 'Starting now!'
  
  const seconds = Math.floor(milliseconds / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  
  if (days > 0) {
    const remainingHours = hours % 24
    return `${days} day${days > 1 ? 's' : ''}, ${remainingHours} hour${remainingHours !== 1 ? 's' : ''}`
  } else if (hours > 0) {
    const remainingMinutes = minutes % 60
    return `${hours} hour${hours > 1 ? 's' : ''}, ${remainingMinutes} minute${remainingMinutes !== 1 ? 's' : ''}`
  } else if (minutes > 0) {
    const remainingSeconds = seconds % 60
    return `${minutes} minute${minutes > 1 ? 's' : ''}, ${remainingSeconds} second${remainingSeconds !== 1 ? 's' : ''}`
  } else {
    return `${seconds} second${seconds !== 1 ? 's' : ''}`
  }
}

// Watch party URL validation schema
export const WatchPartyUrlParamsSchema = z.object({
  id: z.string().uuid(),
  data: z.string().min(1, 'Encoded data is required')
})

export type WatchPartyUrlParams = z.infer<typeof WatchPartyUrlParamsSchema>

// Date/time validation helpers for UI
export const WatchPartyDateTimeSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  time: z.string().regex(/^\d{2}:\d{2}$/, 'Time must be in HH:MM format')
}).refine(
  (data) => {
    const dateTime = new Date(`${data.date}T${data.time}:00`)
    return dateTime > new Date()
  },
  { message: 'Date and time must be in the future' }
)

export type WatchPartyDateTime = z.infer<typeof WatchPartyDateTimeSchema>

export function combineDateTime(date: string, time: string): string {
  return new Date(`${date}T${time}:00`).toISOString()
}

export function splitDateTime(isoString: string): { date: string; time: string } {
  const date = new Date(isoString)
  return {
    date: date.toISOString().split('T')[0],
    time: date.toTimeString().slice(0, 5)
  }
}