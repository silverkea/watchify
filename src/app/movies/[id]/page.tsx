/**
 * Movie Details Page
 * Displays detailed information about a movie and provides watch party creation
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { 
  Calendar, 
  Clock, 
  Star, 
  Users, 
  ArrowLeft
} from 'lucide-react';
import { Button } from '@/components/atoms/Button';
import { Badge } from '@/components/atoms/Badge';
import { Skeleton } from '@/components/ui/skeleton';
import { DateTimePicker } from '@/features/watch-party/components/DateTimePicker';
import { Movie, WatchParty } from '@/types';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface MovieDetailsPageProps {
  params: {
    id: string;
  };
}

export default function MovieDetailsPage({ params }: MovieDetailsPageProps) {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [isCreatingParty, setIsCreatingParty] = useState(false);
  const [selectedDateTime, setSelectedDateTime] = useState<Date | null>(null);
  const [dateTimeError, setDateTimeError] = useState<string | null>(null);
  
  const router = useRouter();

  useEffect(() => {
    loadMovieDetails();
  }, [params.id]);

  const loadMovieDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/movies/${params.id}`);
      
      if (response.ok) {
        const movieData = await response.json();
        setMovie(movieData);
      } else if (response.status === 404) {
        setError('Movie not found');
      } else {
        setError('Failed to load movie details');
      }
    } catch (err) {
      setError('Failed to load movie details');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateWatchParty = async () => {
    if (!movie || !selectedDateTime) return;

    try {
      setIsCreatingParty(true);
      
      // Create watch party data
      const watchPartyData = {
        movieId: movie.id,
        scheduledTime: selectedDateTime.toISOString(),
        movieTitle: movie.title,
        moviePoster: movie.posterPath
      };

      // For now, we'll encode the data and navigate to the watch party page
      // In a full implementation, this would POST to /api/watch-party/create
      const encodedData = btoa(JSON.stringify(watchPartyData))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');
      
      router.push(`/watch-party/${encodedData}`);
    } catch (err) {
      setError('Failed to create watch party');
    } finally {
      setIsCreatingParty(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  // Loading state
  if (loading) {
    return (
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-8">
            <div className="h-8 w-32 bg-muted rounded" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="h-96 bg-muted rounded-lg" />
              <div className="lg:col-span-2 space-y-4">
                <div className="h-8 bg-muted rounded w-3/4" />
                <div className="h-4 bg-muted rounded w-1/2" />
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded" />
                  <div className="h-4 bg-muted rounded" />
                  <div className="h-4 bg-muted rounded w-3/4" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // Error state
  if (error || !movie) {
    return (
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <Button
            variant="ghost"
            onClick={handleBack}
            className="mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          
          <div className="flex flex-col items-center justify-center py-16">
            <div className="text-6xl mb-4">🎬</div>
            <h1 className="text-2xl font-bold text-foreground mb-2">
              {error === 'Movie not found' ? 'Movie Not Found' : 'Something Went Wrong'}
            </h1>
            <p className="text-muted-foreground text-center max-w-md mb-6">
              {error === 'Movie not found' 
                ? "The movie you're looking for doesn't exist or has been removed."
                : "We couldn't load the movie details. Please try again."
              }
            </p>
            <div className="space-x-4">
              <Button variant="primary" onClick={() => router.push('/')}>
                Go Home
              </Button>
              <Button variant="ghost" onClick={loadMovieDetails}>
                Try Again
              </Button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  const posterUrl = movie.posterPath 
    ? `https://image.tmdb.org/t/p/w500${movie.posterPath}`
    : null;

  const backdropUrl = movie.backdropPath 
    ? `https://image.tmdb.org/t/p/w1280${movie.backdropPath}`
    : null;

  const releaseYear = movie.releaseDate ? new Date(movie.releaseDate).getFullYear() : null;

  return (
    <main className="min-h-screen bg-background">
      {/* Backdrop */}
      {backdropUrl && (
        <div className="relative h-64 md:h-80 lg:h-96 overflow-hidden">
          <Image
            src={backdropUrl}
            alt={`${movie.title} backdrop`}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        </div>
      )}

      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={handleBack}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Search
        </Button>

        {/* Movie Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Poster */}
          <div className="space-y-4">
            <div className="relative aspect-[2/3] rounded-lg overflow-hidden shadow-xl">
              {movie.posterPath ? (
                <Image
                  src={`https://image.tmdb.org/t/p/w500${movie.posterPath}`}
                  alt={`${movie.title} poster`}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-muted">
                  <Skeleton className="w-full h-full" />
                </div>
              )}
            </div>
            
            {/* Action Buttons */}
            <div className="space-y-2">
              <Button
                variant="primary"
                onClick={() => setShowScheduleModal(true)}
                className="w-full"
                disabled={isCreatingParty}
              >
                <Calendar className="w-4 h-4 mr-2" />
                Schedule Watch Party
              </Button>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title and Meta */}
            <div className="space-y-4">
              <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                {movie.title}
                {releaseYear && (
                  <span className="text-muted-foreground font-normal ml-2">
                    ({releaseYear})
                  </span>
                )}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                {movie.voteAverage > 0 && (
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-500 fill-current mr-1" />
                    {movie.voteAverage.toFixed(1)}
                    <span className="ml-1">({movie.voteCount.toLocaleString()} votes)</span>
                  </div>
                )}
                
                {movie.runtime && (
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m
                  </div>
                )}
                
                {movie.releaseDate && (
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {format(new Date(movie.releaseDate), 'MMM d, yyyy')}
                  </div>
                )}
              </div>

              {/* Genres */}
              {movie.genres.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {movie.genres.map((genre) => (
                    <Badge key={genre.id} variant="secondary">
                      {genre.name}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Overview */}
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-foreground">
                Overview
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                {movie.overview}
              </p>
            </div>

            {/* Cast */}
            {movie.cast && movie.cast.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-foreground">
                  Cast
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {movie.cast.slice(0, 6).map((castMember) => (
                    <div key={castMember.id} className="space-y-2">
                      <div className="text-sm font-medium text-foreground">
                        {castMember.name}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {castMember.character}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Watch Party Creation Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-foreground">
                  Schedule Watch Party
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowScheduleModal(false)}
                  className="p-2"
                >
                  ×
                </Button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
                  <div className="relative w-12 h-16 rounded overflow-hidden flex-shrink-0">
                    {movie.posterPath ? (
                      <Image
                        src={`https://image.tmdb.org/t/p/w500${movie.posterPath}`}
                        alt={movie.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <Skeleton className="w-full h-full" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="font-medium text-foreground truncate">
                      {movie.title}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {movie.runtime && `${movie.runtime}m`}
                      {movie.runtime && releaseYear && ' • '}
                      {releaseYear}
                    </div>
                  </div>
                </div>

                <DateTimePicker
                  value={selectedDateTime || undefined}
                  onChange={setSelectedDateTime}
                  onError={setDateTimeError}
                  required
                  label="When should the watch party start?"
                />
              </div>

              <div className="flex space-x-3">
                <Button
                  variant="ghost"
                  onClick={() => setShowScheduleModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={handleCreateWatchParty}
                  disabled={!selectedDateTime || !!dateTimeError || isCreatingParty}
                  className="flex-1"
                >
                  {isCreatingParty ? (
                    <>Creating...</>
                  ) : (
                    <>
                      <Users className="w-4 h-4 mr-2" />
                      Create Party
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}