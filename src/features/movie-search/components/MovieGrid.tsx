/**
 * MovieGrid Organism Component
 * Displays a responsive grid of movie cards with loading states and pagination
 */

'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { Search, AlertCircle, Loader2, Grid, List } from 'lucide-react';
import { MovieCard } from '../components/MovieCard';
import { GenreFilter } from '../components/GenreFilter';
import { Button } from '@/components/atoms/Button';
import { Movie, Genre } from '@/types';
import { cn } from '@/lib/utils';

export interface MovieGridProps {
  movies: Movie[];
  genres: Genre[];
  loading?: boolean;
  error?: string | null;
  hasMore?: boolean;
  selectedGenres?: number[];
  viewMode?: 'grid' | 'list';
  onMovieClick?: (movie: Movie) => void;
  onLoadMore?: () => void;
  onGenreToggle?: (genreId: number) => void;
  onGenresClear?: () => void;
  onViewModeChange?: (mode: 'grid' | 'list') => void;
  emptyState?: React.ReactNode;
  className?: string;
  gridCols?: {
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
}

export function MovieGrid({
  movies,
  genres,
  loading = false,
  error = null,
  hasMore = false,
  selectedGenres = [],
  viewMode = 'grid',
  onMovieClick,
  onLoadMore,
  onGenreToggle,
  onGenresClear,
  onViewModeChange,
  emptyState,
  className,
  gridCols = { sm: 2, md: 3, lg: 4, xl: 5 }
}: MovieGridProps) {
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set());

  const handleImageError = useCallback((movieId: number) => {
    setImageErrors(prev => {
      const newSet = new Set(prev);
      newSet.add(movieId);
      return newSet;
    });
  }, []);

  // Filter movies by selected genres
  const filteredMovies = useMemo(() => {
    if (selectedGenres.length === 0) {
      return movies;
    }
    
    return movies.filter(movie =>
      movie.genres.some(genre => selectedGenres.includes(genre.id))
    );
  }, [movies, selectedGenres]);

  const handleGenreToggle = useCallback((genreId: number) => {
    if (onGenreToggle) {
      onGenreToggle(genreId);
    }
  }, [onGenreToggle]);

  const handleGenresClear = useCallback(() => {
    if (onGenresClear) {
      onGenresClear();
    }
  }, [onGenresClear]);

  const gridClasses = cn(
    "grid gap-4",
    viewMode === 'grid' ? {
      // Mobile: 2 columns, Tablet: 3 columns, Desktop: 6 columns
      'grid-cols-2 sm:grid-cols-3 lg:grid-cols-6': gridCols.sm === 2 && gridCols.md === 3 && gridCols.lg === 6,
      // Fallback for 4 columns on desktop
      'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4': gridCols.sm === 2 && gridCols.md === 3 && gridCols.lg === 4,
      // Default fallback for other configurations
      'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5': gridCols.sm !== 2 || gridCols.md !== 3 || (gridCols.lg !== 4 && gridCols.lg !== 6)
    } : "grid-cols-1 gap-2"
  );

  // Error state
  if (error) {
    return (
      <div className={cn("space-y-6", className)}>
        {/* Genre Filter */}
        {genres.length > 0 && (
          <GenreFilter
            genres={genres}
            selectedGenres={selectedGenres}
            onGenreToggle={handleGenreToggle}
            onClear={handleGenresClear}
            variant="chips"
          />
        )}

        {/* Error Display */}
        <div className="flex flex-col items-center justify-center py-12 px-4">
          <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Something went wrong
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-center max-w-md">
            {error}
          </p>
          <Button
            variant="primary"
            onClick={() => window.location.reload()}
            className="mt-4"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Genre Filter */}
        {genres.length > 0 && (
          <div className="flex-1">
            <GenreFilter
              genres={genres}
              selectedGenres={selectedGenres}
              onGenreToggle={handleGenreToggle}
              onClear={handleGenresClear}
              variant="chips"
              maxSelected={3}
            />
          </div>
        )}

        {/* View Mode Toggle */}
        {onViewModeChange && (
          <div className="flex items-center space-x-2">
            <Button
              variant={viewMode === 'grid' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => onViewModeChange('grid')}
              aria-label="Grid view"
            >
              <Grid className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => onViewModeChange('list')}
              aria-label="List view"
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Results Summary */}
      {!loading && (
        <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
          <span>
            {filteredMovies.length === 0 
              ? "No movies found"
              : `${filteredMovies.length} movie${filteredMovies.length === 1 ? '' : 's'} found`
            }
            {selectedGenres.length > 0 && (
              <span className="ml-1">
                in {selectedGenres.length} genre{selectedGenres.length === 1 ? '' : 's'}
              </span>
            )}
          </span>
          
          {hasMore && (
            <span className="text-xs">
              Scroll down to load more
            </span>
          )}
        </div>
      )}

      {/* Movie Grid */}
      {filteredMovies.length > 0 ? (
        <div className={gridClasses}>
          {filteredMovies.map((movie, index) => (
            <MovieCard
              key={`${movie.id}-${index}`}
              movie={movie}
              onClick={onMovieClick}
              variant={viewMode === 'list' ? 'compact' : 'default'}
              className={cn(
                "transition-all duration-200",
                imageErrors.has(movie.id) && "opacity-75"
              )}
              priority={index < 8} // Prioritize first 8 images
            />
          ))}
        </div>
      ) : (
        !loading && (
          <div className="flex flex-col items-center justify-center py-12 px-4">
            {emptyState || (
              <>
                <Search className="w-16 h-16 text-gray-400 dark:text-gray-600 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  No movies found
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-center max-w-md">
                  {selectedGenres.length > 0 
                    ? "Try adjusting your genre filters or search for different terms."
                    : "Try searching for a different movie title or check your spelling."
                  }
                </p>
                {selectedGenres.length > 0 && (
                  <Button
                    variant="ghost"
                    onClick={handleGenresClear}
                    className="mt-4"
                  >
                    Clear genre filters
                  </Button>
                )}
              </>
            )}
          </div>
        )
      )}

      {/* Loading State */}
      {loading && (
        <div className="space-y-4">
          {filteredMovies.length === 0 ? (
            // Initial loading state
            <div className="flex items-center justify-center py-12">
              <div className="flex items-center space-x-3">
                <Loader2 className="w-6 h-6 animate-spin text-purple-600" />
                <span className="text-gray-600 dark:text-gray-400">
                  Loading movies...
                </span>
              </div>
            </div>
          ) : (
            // Load more loading state
            <div className="flex items-center justify-center py-8">
              <div className="flex items-center space-x-3">
                <Loader2 className="w-5 h-5 animate-spin text-purple-600" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Loading more movies...
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Load More Button */}
      {hasMore && !loading && filteredMovies.length > 0 && onLoadMore && (
        <div className="flex justify-center py-6">
          <Button
            variant="ghost"
            onClick={onLoadMore}
            className="border border-gray-300 dark:border-gray-600"
          >
            Load More Movies
          </Button>
        </div>
      )}

      {/* Accessibility announcements */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {loading 
          ? "Loading movies..."
          : `${filteredMovies.length} movies displayed`
        }
      </div>
    </div>
  );
}