/**
 * Health Check API Route
 * GET /api/health
 * Simple endpoint to verify API is working
 */

import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: {
      hasApiKey: !!process.env.TMDB_API_KEY,
      nodeEnv: process.env.NODE_ENV,
      tmdbBaseUrl: process.env.TMDB_BASE_URL
    }
  })
}