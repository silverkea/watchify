/**
 * TMDB API Client with Caching
 * Handles all interactions with The Movie Database API
 */

import { 
  TMDBMovieSearchResponseSchema,
  TMDBMovieDetailsSchema,
  TMDBCreditsSchema,
  transformTMDBMovie,
  Movie,
  MovieSearchResponse
} from '@/types/movie'
import { 
  TMDBCreditsResponseSchema,
  transformTMDBCreditsResponse,
  CastMember
} from '@/types/cast'
import { 
  TMDBGenresResponseSchema,
  transformTMDBGenresResponse,
  GenresResponse 
} from '@/types/genre'

import { env } from './env'

// TMDB API configuration
const TMDB_BASE_URL = env.TMDB_BASE_URL
const TMDB_API_KEY = env.TMDB_API_KEY
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p'

// Cache configuration
const CACHE_TTL = 24 * 60 * 60 * 1000 // 24 hours in milliseconds
const cache = new Map<string, { data: any; timestamp: number }>()

// Error classes
export class TMDBError extends Error {
  constructor(
    message: string,
    public readonly status?: number,
    public readonly code?: string
  ) {
    super(message)
    this.name = 'TMDBError'
  }
}

export class TMDBRateLimitError extends TMDBError {
  constructor(retryAfter?: number) {
    super('Rate limit exceeded', 429, 'RATE_LIMIT_EXCEEDED')
    this.retryAfter = retryAfter
  }
  retryAfter?: number
}

export class TMDBServiceUnavailableError extends TMDBError {
  constructor() {
    super('External API unavailable', 503, 'EXTERNAL_API_DOWN')
  }
}

// Cache utilities
function getCacheKey(endpoint: string, params: Record<string, any> = {}): string {
  const paramString = Object.keys(params)
    .filter(key => params[key] !== undefined && params[key] !== null)
    .sort()
    .map(key => `${key}=${params[key]}`)
    .join('&')
  return `${endpoint}?${paramString}`
}

function isCacheValid(timestamp: number): boolean {
  return Date.now() - timestamp < CACHE_TTL
}

function getFromCache<T>(key: string): T | null {
  const cached = cache.get(key)
  if (cached && isCacheValid(cached.timestamp)) {
    return cached.data as T
  }
  if (cached) {
    cache.delete(key) // Remove expired cache
  }
  return null
}

function setCache<T>(key: string, data: T): void {
  cache.set(key, { data, timestamp: Date.now() })
}

// HTTP client with error handling
async function tmdbFetch(endpoint: string, params: Record<string, any> = {}): Promise<any> {
  const url = new URL(`${TMDB_BASE_URL}${endpoint}`)
  url.searchParams.set('api_key', TMDB_API_KEY)
  
  // Add parameters
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      url.searchParams.set(key, String(value))
    }
  })

  try {
    const response = await fetch(url.toString(), {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Watchify/1.0'
      }
    })

    if (!response.ok) {
      if (response.status === 429) {
        const retryAfter = response.headers.get('Retry-After')
        throw new TMDBRateLimitError(retryAfter ? parseInt(retryAfter) : undefined)
      }
      
      if (response.status === 503) {
        throw new TMDBServiceUnavailableError()
      }

      const errorData = await response.json().catch(() => ({}))
      throw new TMDBError(
        errorData.status_message || `HTTP ${response.status}`,
        response.status,
        errorData.status_code?.toString()
      )
    }

    return await response.json()
  } catch (error) {
    if (error instanceof TMDBError) {
      throw error
    }
    
    // Network or other errors
    throw new TMDBServiceUnavailableError()
  }
}

// API functions
export async function searchMovies(
  query: string,
  page: number = 1
): Promise<MovieSearchResponse> {
  if (!query.trim()) {
    throw new TMDBError('Search query is required', 400, 'INVALID_QUERY')
  }

  if (query.length > 100) {
    throw new TMDBError('Search query too long', 400, 'INVALID_QUERY')
  }

  if (page < 1 || page > 1000) {
    throw new TMDBError('Invalid page number', 400, 'INVALID_PAGE')
  }

  const cacheKey = getCacheKey('/search/movie', { query, page })
  console.log('TMDB searchMovies - Cache key:', cacheKey);
  const cached = getFromCache<MovieSearchResponse>(cacheKey)
  if (cached) {
    console.log('TMDB searchMovies - Returning cached result for page:', page);
    return cached
  }
  
  console.log('TMDB searchMovies - Making fresh API call for page:', page);

  const params: Record<string, any> = {
    query: query.trim(),
    page,
    include_adult: false
  }

  const rawResponse = await tmdbFetch('/search/movie', params)
  const validatedResponse = TMDBMovieSearchResponseSchema.parse(rawResponse)

  // Get genres for all movies
  const genres = await getGenres()
  
  // Transform to our format
  const transformedMovies = await Promise.all(
    validatedResponse.results.map(async (movie) => {
      // Get movie genres from the global genres list
      const movieGenres = genres.genres.filter(genre => 
        movie.genre_ids?.includes(genre.id) || false
      )
      
      // Get cast for each movie (limited to main cast)
      const cast = await getMovieCredits(movie.id).catch(() => [])
      
      return transformTMDBMovie(movie, movieGenres, cast.slice(0, 5))
    })
  )

  const result: MovieSearchResponse = {
    page: validatedResponse.page,
    results: transformedMovies,
    totalPages: validatedResponse.total_pages,
    totalResults: validatedResponse.total_results
  }

  setCache(cacheKey, result)
  return result
}

export async function getNowPlayingMovies(
  page: number = 1
): Promise<MovieSearchResponse> {
  if (page < 1 || page > 1000) {
    throw new TMDBError('Invalid page number', 400, 'INVALID_PAGE')
  }

  const cacheKey = getCacheKey('/movie/now_playing', { page })
  console.log('TMDB getNowPlayingMovies - Cache key:', cacheKey);
  const cached = getFromCache<MovieSearchResponse>(cacheKey)
  if (cached) {
    console.log('TMDB getNowPlayingMovies - Returning cached result for page:', page);
    return cached
  }
  
  console.log('TMDB getNowPlayingMovies - Making fresh API call for page:', page);

  const params: Record<string, any> = {
    page,
    include_adult: false
  }

  const rawResponse = await tmdbFetch('/movie/now_playing', params)
  const validatedResponse = TMDBMovieSearchResponseSchema.parse(rawResponse)

  // Get genres for all movies
  const genres = await getGenres()
  
  // Transform to our format
  const transformedMovies = await Promise.all(
    validatedResponse.results.map(async (movie) => {
      // Get movie genres from the global genres list
      const movieGenres = genres.genres.filter(genre => 
        movie.genre_ids?.includes(genre.id) || false
      )
      
      // Get cast for each movie (limited to main cast)
      const cast = await getMovieCredits(movie.id).catch(() => [])
      
      return transformTMDBMovie(movie, movieGenres, cast.slice(0, 5))
    })
  )

  const result: MovieSearchResponse = {
    page: validatedResponse.page,
    results: transformedMovies,
    totalPages: validatedResponse.total_pages,
    totalResults: validatedResponse.total_results
  }

  setCache(cacheKey, result)
  return result
}

export async function getPopularMovies(
  page: number = 1,
  genreIds?: number[]
): Promise<MovieSearchResponse> {
  if (page < 1 || page > 1000) {
    throw new TMDBError('Invalid page number', 400, 'INVALID_PAGE')
  }

  // Validate genre IDs if provided
  if (genreIds && genreIds.length > 0) {
    for (const genreId of genreIds) {
      if (!Number.isInteger(genreId) || genreId <= 0) {
        throw new TMDBError('Invalid genre ID', 400, 'INVALID_GENRE')
      }
    }
  }

  const cacheKey = getCacheKey('/movie/popular', { page, genreIds: genreIds?.join(',') })
  console.log('TMDB getPopularMovies - Cache key:', cacheKey);
  
  const cached = getFromCache<MovieSearchResponse>(cacheKey)
  if (cached) {
    console.log('TMDB getPopularMovies - Returning cached result for page:', page);
    return cached
  }
  
  console.log('TMDB getPopularMovies - Making fresh API call for page:', page, 'with genreIds:', genreIds);

  const params: Record<string, any> = {
    page,
    include_adult: false
  }

  let endpoint = '/movie/popular'

  // If genre filtering is requested, use discover endpoint instead of popular
  if (genreIds && genreIds.length > 0) {
    endpoint = '/discover/movie'
    params.with_genres = genreIds.join(',')
    params.sort_by = 'popularity.desc' // Maintain popularity sorting
  }

  const rawResponse = await tmdbFetch(endpoint, params)
  const validatedResponse = TMDBMovieSearchResponseSchema.parse(rawResponse)

  // Get genres for all movies
  const genres = await getGenres()
  
  // Transform to our format
  const transformedMovies = await Promise.all(
    validatedResponse.results.map(async (movie) => {
      // Get movie genres from the global genres list
      const movieGenres = genres.genres.filter(genre => 
        movie.genre_ids?.includes(genre.id) || false
      )
      
      // Get cast for each movie (limited to main cast)
      const cast = await getMovieCredits(movie.id).catch(() => [])
      
      return transformTMDBMovie(movie, movieGenres, cast.slice(0, 5))
    })
  )

  const result: MovieSearchResponse = {
    page: validatedResponse.page,
    results: transformedMovies,
    totalPages: validatedResponse.total_pages,
    totalResults: validatedResponse.total_results
  }

  setCache(cacheKey, result)
  return result
}

export async function getMovieDetails(movieId: number): Promise<Movie> {
  if (!Number.isInteger(movieId) || movieId <= 0) {
    throw new TMDBError('Invalid movie ID', 400, 'INVALID_MOVIE_ID')
  }

  const cacheKey = getCacheKey(`/movie/${movieId}`)
  const cached = getFromCache<Movie>(cacheKey)
  if (cached) {
    return cached
  }

  // Fetch movie details and credits in parallel
  const [movieResponse, creditsResponse] = await Promise.all([
    tmdbFetch(`/movie/${movieId}`),
    tmdbFetch(`/movie/${movieId}/credits`)
  ])

  const validatedMovie = TMDBMovieDetailsSchema.parse(movieResponse)
  const validatedCredits = TMDBCreditsResponseSchema.parse(creditsResponse)

  // Transform genres
  const genres = validatedMovie.genres?.map(genre => ({
    id: genre.id,
    name: genre.name
  })) || []

  // Transform cast
  const cast = transformTMDBCreditsResponse(validatedCredits, 10)

  const result = transformTMDBMovie(validatedMovie, genres, cast)

  setCache(cacheKey, result)
  return result
}

export async function getMovieCredits(movieId: number): Promise<CastMember[]> {
  if (!Number.isInteger(movieId) || movieId <= 0) {
    throw new TMDBError('Invalid movie ID', 400, 'INVALID_MOVIE_ID')
  }

  const cacheKey = getCacheKey(`/movie/${movieId}/credits`)
  const cached = getFromCache<CastMember[]>(cacheKey)
  if (cached) {
    return cached
  }

  const response = await tmdbFetch(`/movie/${movieId}/credits`)
  const validatedResponse = TMDBCreditsResponseSchema.parse(response)
  
  const result = transformTMDBCreditsResponse(validatedResponse, 10)
  setCache(cacheKey, result)
  return result
}

export async function getGenres(): Promise<GenresResponse> {
  const cacheKey = getCacheKey('/genre/movie/list')
  const cached = getFromCache<GenresResponse>(cacheKey)
  if (cached) {
    return cached
  }

  const response = await tmdbFetch('/genre/movie/list')
  const validatedResponse = TMDBGenresResponseSchema.parse(response)
  
  const result = transformTMDBGenresResponse(validatedResponse)
  setCache(cacheKey, result)
  return result
}

// Image URL helpers
export function getImageUrl(
  path: string | null, 
  size: 'w92' | 'w154' | 'w185' | 'w342' | 'w500' | 'w780' | 'original' = 'w500'
): string | null {
  if (!path) return null
  return `${TMDB_IMAGE_BASE_URL}/${size}${path}`
}

export function getPosterUrl(posterPath: string | null, size: 'w92' | 'w154' | 'w185' | 'w342' | 'w500' | 'w780' | 'original' = 'w500'): string | null {
  return getImageUrl(posterPath, size)
}

export function getBackdropUrl(backdropPath: string | null, size: 'w300' | 'w780' | 'w1280' | 'original' = 'w1280'): string | null {
  if (!backdropPath) return null
  return `${TMDB_IMAGE_BASE_URL}/${size}${backdropPath}`
}

export function getProfileUrl(profilePath: string | null, size: 'w45' | 'w185' | 'h632' | 'original' = 'w185'): string | null {
  if (!profilePath) return null
  return `${TMDB_IMAGE_BASE_URL}/${size}${profilePath}`
}

// Cache management
export function clearCache(): void {
  cache.clear()
}

export function getCacheStats(): { size: number; keys: string[] } {
  return {
    size: cache.size,
    keys: Array.from(cache.keys())
  }
}

// Health check
export async function healthCheck(): Promise<boolean> {
  try {
    await tmdbFetch('/configuration')
    return true
  } catch {
    return false
  }
}