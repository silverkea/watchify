# GitHub Copilot Instructions for Watchify

## Project Overview
Watchify follows strict architectural principles defined in `.specify/memory/constitution.md`. All code suggestions must comply with these constitutional requirements.

## Constitution Compliance
**CRITICAL**: Before suggesting any code, ensure it aligns with our constitutional principles:
- **Principle I**: Test-Driven Development (NON-NEGOTIABLE)
- **Principle II**: Clean Architecture with Folder-by-Feature
- **Principle III**: Atomic Design for UI Components  
- **Principle IV**: Storybook Documentation (NON-NEGOTIABLE)
- **Principle V**: Contract-First Integration

Refer to the full constitution at `.specify/memory/constitution.md` for complete details.

## Copilot-Specific Guidance

### Custom Development Workflow
This project uses structured development through custom prompts in `.github/prompts/`:
- **`constitution.prompt.md`** - For updating project governance and principles
- **`specify.prompt.md`** - For creating feature specifications from natural language
- **`plan.prompt.md`** - For generating implementation plans from specifications
- **`tasks.prompt.md`** - For breaking plans into executable tasks
- **`implement.prompt.md`** - For guided implementation of tasks
- **`analyze.prompt.md`** - For code analysis and review
- **`clarify.prompt.md`** - For resolving ambiguities in requirements

When suggesting development approaches, reference these structured workflows rather than ad-hoc development patterns.

## Current MVP: Movie Watch Party Platform

### Technology Stack (Use These)
- **Framework**: Next.js 14+ with App Router and TypeScript
- **Styling**: Tailwind CSS with dark/light theme support
- **Components**: ShadCN/UI component library
- **Database**: Vercel KV for watch party data
- **External API**: TMDB (The Movie Database) for movie data
- **Testing**: Jest for unit tests, Cucumber for E2E tests
- **Deployment**: Vercel with serverless functions

### Project Structure Pattern
```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes (serverless functions)
│   └── (routes)/          # Page routes
├── features/              # Folder-by-feature organization
│   ├── movie-search/
│   ├── movie-details/
│   └── watch-party/
├── components/            # Atomic design hierarchy
│   ├── atoms/
│   ├── molecules/
│   ├── organisms/
│   └── templates/
├── lib/                   # Utilities and configurations
└── types/                 # TypeScript type definitions
```

### API Routes Pattern
```
app/api/
├── movies/
│   ├── search/route.ts    # GET /api/movies/search
│   └── [id]/route.ts      # GET /api/movies/[id]
└── watch-party/
    ├── create/route.ts    # POST /api/watch-party/create
    └── [id]/route.ts      # GET /api/watch-party/[id]
```

### Component Naming Conventions
- **Atoms**: `Button`, `Input`, `Badge`, `Avatar`
- **Molecules**: `SearchBox`, `MovieCard`, `CountdownTimer`
- **Organisms**: `MovieGrid`, `WatchPartyForm`, `Navigation`
- **Templates**: `MovieGridTemplate`, `WatchPartyTemplate`
- **Pages**: `HomePage`, `MovieDetailsPage`, `WatchPartyPage`

### Code Patterns to Follow

#### API Route Example
```typescript
// app/api/movies/search/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { searchMovies } from '@/lib/tmdb';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');
  
  // Always include error handling and validation
  if (!query) {
    return NextResponse.json(
      { error: 'Search query is required' },
      { status: 400 }
    );
  }
  
  try {
    const movies = await searchMovies(query);
    return NextResponse.json(movies);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch movies' },
      { status: 503 }
    );
  }
}
```

#### Component Example with Tests
```typescript
// features/movie-search/components/MovieCard.tsx
import { Movie } from '@/types/movie';

interface MovieCardProps {
  movie: Movie;
  onClick: (movie: Movie) => void;
  variant?: 'default' | 'compact';
}

export function MovieCard({ movie, onClick, variant = 'default' }: MovieCardProps) {
  // Component implementation
}

// features/movie-search/components/MovieCard.test.tsx
import { render, fireEvent, screen } from '@testing-library/react';
import { MovieCard } from './MovieCard';

describe('MovieCard', () => {
  it('should display movie title and rating', () => {
    // Test implementation
  });
});

// features/movie-search/components/MovieCard.stories.tsx
export default {
  title: 'Molecules/MovieCard',
  component: MovieCard,
};
```

### Environment Variables Pattern
```typescript
// lib/env.ts
export const env = {
  TMDB_API_KEY: process.env.TMDB_API_KEY!,
  TMDB_BASE_URL: process.env.TMDB_BASE_URL!,
  KV_REST_API_URL: process.env.KV_REST_API_URL!,
  // Always validate environment variables
} as const;
```

### Theme System (Use ShadCN pattern)
```typescript
// app/providers/theme-provider.tsx
'use client';
import { ThemeProvider as NextThemesProvider } from 'next-themes';

// components/atoms/ThemeToggle.tsx
import { useTheme } from 'next-themes';
```

### Performance Patterns
- Use `next/image` for movie posters with lazy loading
- Implement debounced search with `useDeferredValue`
- Use `Suspense` boundaries for loading states
- Cache TMDB API responses in Vercel KV

### Security Patterns
- API keys only in server-side environment variables
- Input validation using Zod schemas
- Rate limiting for API endpoints
- CORS configuration for API routes



---
*Based on Constitution v1.0.1 - For full architectural details, see `.specify/memory/constitution.md`*