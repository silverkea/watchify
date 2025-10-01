/**
 * MovieCard Molecule Component
 * Displays movie information in a card format with poster, title, and metadata
 */

'use client';

import React from 'react';
import Image from 'next/image';
import { Star, Calendar, Clock } from 'lucide-react';
import { Badge } from '@/components/atoms/Badge';
import { Movie } from '@/types';
import { cn } from '@/lib/utils';

export interface MovieCardProps {
  movie: Movie;
  onClick?: (movie: Movie) => void;
  variant?: 'default' | 'compact' | 'featured';
  showGenres?: boolean;
  showRating?: boolean;
  showRuntime?: boolean;
  className?: string;
  priority?: boolean;
}

export function MovieCard({
  movie,
  onClick,
  variant = 'default',
  showGenres = true,
  showRating = true,
  showRuntime = true,
  className,
  priority = false
}: MovieCardProps) {
  const handleClick = () => {
    if (onClick) {
      onClick(movie);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  const posterUrl = movie.posterPath 
    ? `https://image.tmdb.org/t/p/w500${movie.posterPath}`
    : '/images/poster-placeholder.png';

  const releaseYear = movie.releaseDate ? new Date(movie.releaseDate).getFullYear() : null;

  const isClickable = !!onClick;

  const cardClasses = cn(
    "group relative overflow-hidden rounded-lg shadow-md",
    "bg-white dark:bg-gray-800",
    "border border-gray-200 dark:border-gray-700",
    "transition-all duration-200 ease-in-out",
    {
      // Default variant
      "hover:shadow-xl hover:scale-105": variant === 'default' && isClickable,
      "cursor-pointer": isClickable,
      
      // Compact variant
      "flex flex-row": variant === 'compact',
      "h-32": variant === 'compact',
      
      // Featured variant
      "hover:shadow-2xl hover:scale-102": variant === 'featured' && isClickable,
      "ring-2 ring-purple-500 ring-opacity-50": variant === 'featured',
    },
    className
  );

  if (variant === 'compact') {
    return (
      <div
        className={cardClasses}
        onClick={isClickable ? handleClick : undefined}
        onKeyDown={isClickable ? handleKeyDown : undefined}
        tabIndex={isClickable ? 0 : undefined}
        role={isClickable ? "button" : undefined}
        aria-label={isClickable ? `View details for ${movie.title}` : undefined}
      >
        {/* Compact Poster */}
        <div className="relative w-24 h-32 flex-shrink-0">
          <Image
            src={posterUrl}
            alt={`${movie.title} poster`}
            fill
            className="object-cover"
            priority={priority}
            sizes="96px"
          />
        </div>
        
        {/* Compact Content */}
        <div className="flex-1 p-3 min-w-0">
          <h3 className="font-semibold text-sm text-gray-900 dark:text-white line-clamp-2 mb-1">
            {movie.title}
          </h3>
          
          {releaseYear && (
            <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mb-1">
              <Calendar className="w-3 h-3 mr-1" />
              {releaseYear}
            </div>
          )}
          
          {showRating && movie.voteAverage > 0 && (
            <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mb-2">
              <Star className="w-3 h-3 mr-1 text-yellow-500 fill-current" />
              {movie.voteAverage.toFixed(1)}
            </div>
          )}
          
          {showGenres && movie.genres.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {movie.genres.slice(0, 2).map((genre) => (
                <Badge key={genre.id} variant="secondary" size="sm">
                  {genre.name}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      className={cardClasses}
      onClick={isClickable ? handleClick : undefined}
      onKeyDown={isClickable ? handleKeyDown : undefined}
      tabIndex={isClickable ? 0 : undefined}
      role={isClickable ? "button" : undefined}
      aria-label={isClickable ? `View details for ${movie.title}` : undefined}
    >
      {/* Poster */}
      <div className="relative aspect-[2/3] w-full">
        <Image
          src={posterUrl}
          alt={`${movie.title} poster`}
          fill
          className="object-cover transition-transform duration-200 group-hover:scale-105"
          priority={priority}
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
        />
        
        {/* Rating Badge */}
        {showRating && movie.voteAverage > 0 && (
          <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded-full flex items-center">
            <Star className="w-3 h-3 mr-1 text-yellow-500 fill-current" />
            {movie.voteAverage.toFixed(1)}
          </div>
        )}
      </div>
      
      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-lg text-gray-900 dark:text-white line-clamp-2 mb-2">
          {movie.title}
        </h3>
        
        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-3">
          {releaseYear && (
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-1" />
              {releaseYear}
            </div>
          )}
          
          {showRuntime && movie.runtime && (
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              {movie.runtime}m
            </div>
          )}
        </div>
        
        {/* Overview */}
        <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3 mb-3">
          {movie.overview}
        </p>
        
        {/* Genres */}
        {showGenres && movie.genres.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {movie.genres.slice(0, 3).map((genre) => (
              <Badge key={genre.id} variant="secondary" size="sm">
                {genre.name}
              </Badge>
            ))}
            {movie.genres.length > 3 && (
              <Badge variant="secondary" size="sm">
                +{movie.genres.length - 3}
              </Badge>
            )}
          </div>
        )}
      </div>
    </div>
  );
}