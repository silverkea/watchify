// Re-export all types from individual modules
export * from './movie'
export * from './watch-party'
export * from './shareable-url'

// Export specific items from genre and cast to avoid conflicts
export type { Genre, GenresResponse } from './genre'
export type { CastMember } from './cast'

// Legacy exports for backward compatibility (can be removed later)
export type {
  Movie,
  MovieSearchResponse,
  MovieDetailsResponse
} from './movie'

export type { WatchParty, WatchPartyStatusType } from './watch-party'
export type { ShareableURLData } from './shareable-url'

export { WatchPartyStatus } from './watch-party'

// API Error types
export interface APIError {
  message: string;
  status?: number;
  code?: string;
}