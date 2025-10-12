/**
 * Movie Details Page
 * Displays detailed information about a movie and provides watch party creation
 */

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { 
  Calendar, 
  Clock, 
  Star, 
  Users, 
  ArrowLeft
} from 'lucide-react';
import { format } from 'date-fns';

import { Button } from '@/components/atoms/Button';
import { Badge } from '@/components/atoms/Badge';
import { Skeleton } from '@/components/ui/skeleton';
import { DateTimePicker } from '@/features/watch-party/components/DateTimePicker';
import { WatchPartyModal } from '@/features/watch-party/components/WatchPartyModal';
import { Movie, WatchParty } from '@/types';
import { cn } from '@/lib/utils';

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
  const [partyCreated, setPartyCreated] = useState(false);

  // Modal logic extracted
  const handleOpenModal = () => {
    // Reset modal state to default values (tomorrow at 8 PM)
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(20, 0, 0, 0);
    setSelectedDateTime(tomorrow);
    setDateTimeError(null);
    setPartyCreated(false);
    setShowScheduleModal(true);
  };
  const handleCloseModal = () => {
    setShowScheduleModal(false);
    setSelectedDateTime(null);
    setDateTimeError(null);
    setPartyCreated(false);
  };
  const handleCreateParty = async (date: Date) => {
    if (!movie || !date || partyCreated) return;
    try {
      setIsCreatingParty(true);
      const watchPartyData = {
        movieId: movie.id,
        scheduledTime: date.toISOString(),
        movieTitle: movie.title,
        moviePoster: movie.posterPath
      };
      const encodedData = btoa(JSON.stringify(watchPartyData))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');
      setShowScheduleModal(false); // Close modal before navigation
      setSelectedDateTime(null);
      setDateTimeError(null);
      setPartyCreated(true);
      router.push(`/watch-party/${encodedData}`);
    } catch (err) {
      setError('Failed to create watch party');
    } finally {
      setIsCreatingParty(false);
    }
  };
  
  const router = useRouter();

  const loadMovieDetails = useCallback(async () => {
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
  }, [params.id]);

  useEffect(() => {
    loadMovieDetails();
  }, [loadMovieDetails]);

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

            {/* Schedule Watch Party Button */}
            <div>
              <Button
                variant="primary"
                onClick={handleOpenModal}
                disabled={isCreatingParty}
                data-testid="schedule-watch-party-button"
              >
                <Calendar className="w-4 h-4 mr-2" />
                Schedule Watch Party
              </Button>
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
      <WatchPartyModal
        movie={movie}
        open={showScheduleModal}
        onClose={handleCloseModal}
        onCreate={handleCreateParty}
        isCreating={isCreatingParty}
        selectedDateTime={selectedDateTime}
        setSelectedDateTime={setSelectedDateTime}
        dateTimeError={dateTimeError}
        setDateTimeError={setDateTimeError}
      />
    </main>
  );
}