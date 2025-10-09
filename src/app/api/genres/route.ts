/**
 * Genres API Route
 * GET /api/genres
 * 
 * Handles genre listing requests for movie filtering
 */

import { NextRequest, NextResponse } from 'next/server'

import { getGenres, TMDBError, TMDBRateLimitError, TMDBServiceUnavailableError } from '@/lib/tmdb'
import { GenresResponse } from '@/types'

export async function GET(request: NextRequest) {
  try {
    // Fetch genres from TMDB
    const genres: GenresResponse = await getGenres()
    
    // Return successful response
    return NextResponse.json(genres, {
      headers: {
        'Cache-Control': 'public, max-age=86400', // Cache for 24 hours (genres rarely change)
        'Content-Type': 'application/json'
      }
    })
    
  } catch (error) {
    console.error('Genres fetch error:', error)
    
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
        message: 'An unexpected error occurred while fetching genres',
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