export const env = {
  TMDB_API_KEY: process.env.TMDB_API_KEY!,
  TMDB_BASE_URL: process.env.TMDB_BASE_URL || 'https://api.themoviedb.org/3',
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
} as const

// Validate environment variables
if (!env.TMDB_API_KEY) {
  throw new Error('TMDB_API_KEY environment variable is required')
}