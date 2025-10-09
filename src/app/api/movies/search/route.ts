/**
 * Movie Search API Route
 * GET /api/movies/search
 * 
 * Handles movie search requests with optional genre filtering and pagination
 */

import { NextRequest, NextResponse } from 'next/server'

import { searchMovies, TMDBError, TMDBRateLimitError, TMDBServiceUnavailableError } from '@/lib/tmdb'
import { MovieSearchResponse } from '@/types'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')
    const pageParam = searchParams.get('page')
    
    // Validate required query parameter
    if (!query || query.trim().length === 0) {
      return NextResponse.json(
        {
          error: 'Invalid search query',
          message: 'Search query must be between 1 and 100 characters',
          code: 'INVALID_QUERY'
        },
        { status: 400 }
      )
    }
    
    // Validate query length
    if (query.length > 100) {
      return NextResponse.json(
        {
          error: 'Invalid search query',
          message: 'Search query must be between 1 and 100 characters',
          code: 'INVALID_QUERY'
        },
        { status: 400 }
      )
    }
    
    // Parse and validate page parameter
    let page = 1
    if (pageParam) {
      const parsedPage = parseInt(pageParam, 10)
      if (isNaN(parsedPage) || parsedPage < 1 || parsedPage > 1000) {
        return NextResponse.json(
          {
            error: 'Invalid page number',
            message: 'Page must be between 1 and 1000',
            code: 'INVALID_PAGE'
          },
          { status: 400 }
        )
      }
      page = parsedPage
    }
    
    // Perform the search
    console.log('API Route - Search params:', { query: query.trim(), page });
    const results: MovieSearchResponse = await searchMovies(query.trim(), page)
    console.log('API Route - Search results:', { 
      returnedPage: results.page, 
      totalPages: results.totalPages, 
      resultsCount: results.results.length,
      firstMovieTitle: results.results[0]?.title 
    });
    
    // Return successful response
    return NextResponse.json(results, {
      headers: {
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
        'Content-Type': 'application/json'
      }
    })
    
  } catch (error) {
    console.error('Movie search error:', error)
    
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
        message: 'An unexpected error occurred while searching for movies',
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