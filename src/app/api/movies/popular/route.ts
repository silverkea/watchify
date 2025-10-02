/**
 * Popular Movies API Route
 * GET /api/movies/popular
 * 
 * Fetches popular movies based on TMDB popularity metrics
 */

import { NextRequest, NextResponse } from 'next/server'
import { getPopularMovies, TMDBError, TMDBRateLimitError, TMDBServiceUnavailableError } from '@/lib/tmdb'
import { MovieSearchResponse } from '@/types'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const pageParam = searchParams.get('page')
    const genreParam = searchParams.get('genre')
    
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

    // Parse and validate genre parameter(s)
    let genreIds: number[] | undefined
    if (genreParam) {
      try {
        const genreStrings = genreParam.split(',').map(s => s.trim()).filter(s => s.length > 0)
        genreIds = genreStrings.map(genreStr => {
          const genreId = parseInt(genreStr, 10)
          if (isNaN(genreId) || genreId <= 0) {
            throw new Error('Invalid genre ID')
          }
          return genreId
        })
      } catch (error) {
        return NextResponse.json(
          {
            error: 'Invalid genre ID',
            message: 'Genre ID must be a positive integer or comma-separated list of positive integers',
            code: 'INVALID_GENRE'
          },
          { status: 400 }
        )
      }
    }
    
    // Fetch popular movies
    console.log('API Route - Popular Movies params:', { page, genreIds });
    const results: MovieSearchResponse = await getPopularMovies(page, genreIds)
    console.log('API Route - Popular Movies results:', { 
      returnedPage: results.page, 
      totalPages: results.totalPages, 
      resultsCount: results.results.length,
      firstMovieTitle: results.results[0]?.title 
    });
    
    // Return successful response
    return NextResponse.json(results, {
      headers: {
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour (popular movies change less frequently)
        'Content-Type': 'application/json'
      }
    })
    
  } catch (error) {
    console.error('Popular movies error:', error)
    
    // Handle specific TMDB errors
    if (error instanceof TMDBRateLimitError) {
      return NextResponse.json(
        {
          error: 'Rate limit exceeded',
          message: 'Too many requests. Please try again later.',
          code: 'RATE_LIMIT_EXCEEDED',
          retryAfter: error.retryAfter
        },
        { 
          status: 429,
          headers: error.retryAfter ? { 'Retry-After': error.retryAfter.toString() } : {}
        }
      )
    }
    
    if (error instanceof TMDBServiceUnavailableError) {
      return NextResponse.json(
        {
          error: 'Service unavailable',
          message: 'External movie database is temporarily unavailable. Please try again later.',
          code: 'EXTERNAL_API_DOWN'
        },
        { status: 503 }
      )
    }
    
    if (error instanceof TMDBError) {
      const statusCode = error.status || 500
      return NextResponse.json(
        {
          error: 'Movie database error',
          message: error.message,
          code: error.code || 'TMDB_ERROR'
        },
        { status: statusCode }
      )
    }
    
    // Generic error fallback
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: 'An unexpected error occurred while fetching popular movies',
        code: 'INTERNAL_ERROR'
      },
      { status: 500 }
    )
  }
}