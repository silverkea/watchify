/**
 * Movie Details API Route
 * GET /api/movies/[id]
 * 
 * Handles movie details requests for specific movie IDs
 */

import { NextRequest, NextResponse } from 'next/server'

import { getMovieDetails, TMDBError, TMDBRateLimitError, TMDBServiceUnavailableError } from '@/lib/tmdb'
import { Movie } from '@/types'

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic'

interface RouteParams {
  params: {
    id: string
  }
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const movieIdParam = params.id
    
    // Validate movie ID parameter
    if (!movieIdParam) {
      return NextResponse.json(
        {
          error: 'Movie ID is required',
          message: 'Movie ID must be provided in the URL path',
          code: 'MISSING_MOVIE_ID'
        },
        { status: 400 }
      )
    }
    
    // Parse and validate movie ID
    const movieId = parseInt(movieIdParam, 10)
    if (isNaN(movieId) || movieId <= 0) {
      return NextResponse.json(
        {
          error: 'Invalid movie ID',
          message: 'Movie ID must be a positive integer',
          code: 'INVALID_MOVIE_ID'
        },
        { status: 400 }
      )
    }
    
    // Fetch movie details
    const movie: Movie = await getMovieDetails(movieId)
    
    // Return successful response
    return NextResponse.json(movie, {
      headers: {
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
        'Content-Type': 'application/json'
      }
    })
    
  } catch (error) {
    console.error('Movie details error:', error)
    
    // Handle specific TMDB errors
    if (error instanceof TMDBRateLimitError) {
      return NextResponse.json(
        {
          error: 'Rate limit exceeded',
          message: 'Too many requests to external API',
          code: 'RATE_LIMIT_EXCEEDED',
          retryAfter: error.retryAfter || 60
        },
        { 
          status: 429,
          headers: {
            'Retry-After': String(error.retryAfter || 60)
          }
        }
      )
    }
    
    if (error instanceof TMDBServiceUnavailableError) {
      return NextResponse.json(
        {
          error: 'External API unavailable',
          message: 'Movie database service is temporarily unavailable',
          code: 'EXTERNAL_API_DOWN'
        },
        { status: 503 }
      )
    }
    
    if (error instanceof TMDBError) {
      // Check if it's a 404 (movie not found)
      if (error.status === 404) {
        return NextResponse.json(
          {
            error: 'Movie not found',
            message: `Movie with ID ${params.id} was not found`,
            code: 'MOVIE_NOT_FOUND'
          },
          { status: 404 }
        )
      }
      
      return NextResponse.json(
        {
          error: error.message,
          code: error.code || 'TMDB_ERROR'
        },
        { status: error.status || 500 }
      )
    }
    
    // Handle unexpected errors
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: 'An unexpected error occurred while fetching movie details',
        code: 'INTERNAL_ERROR'
      },
      { status: 500 }
    )
  }
}

// OPTIONS handler for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  })
}