/**
 * Watch Party Page
 * Displays watch party details with countdown timer and sharing functionality
 */

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { 
  Clock, 
  Copy,
  AlertCircle,
  ExternalLink,
  Play,
  CheckCircle,
  Calendar
} from 'lucide-react';
import { format, addMinutes } from 'date-fns';

import { Button } from '@/components/atoms/Button';
import { Badge } from '@/components/atoms/Badge';
import { Skeleton } from '@/components/ui/skeleton';
import { CountdownTimer } from '@/features/watch-party/components/CountdownTimer';
import { Header } from '@/components/organisms/Header';
import { Movie, WatchParty } from '@/types';
import { cn } from '@/lib/utils';

interface WatchPartyPageProps {
  params: {
    id: string;
  };
}

interface WatchPartyData {
  movieId: number;
  scheduledTime: string;
  movieTitle: string;
  moviePoster: string | null;
}

export default function WatchPartyPage({ params }: WatchPartyPageProps) {
  const [watchPartyData, setWatchPartyData] = useState<WatchPartyData | null>(null);
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  
  const router = useRouter();

  const loadWatchPartyData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Decode the watch party data from URL
      try {
        // Convert URL-safe base64 back to standard base64
        const base64 = params.id
          .replace(/-/g, '+')
          .replace(/_/g, '/')
          .padEnd(params.id.length + (4 - params.id.length % 4) % 4, '=');
        
        const decodedData = JSON.parse(atob(base64));
        setWatchPartyData(decodedData);

        // Load full movie details
        if (decodedData.movieId) {
          await loadMovieDetails(decodedData.movieId);
        }
      } catch (decodeError) {
        setError('Invalid watch party link');
        return;
      }
    } catch (err) {
      setError('Failed to load watch party details');
    } finally {
      setLoading(false);
    }
  }, [params.id]);

  useEffect(() => {
    loadWatchPartyData();
  }, [loadWatchPartyData]);

  const loadMovieDetails = async (movieId: number) => {
    try {
      const response = await fetch(`/api/movies/${movieId}`);
      if (response.ok) {
        const movieData = await response.json();
        setMovie(movieData);
      }
    } catch (err) {
      console.error('Failed to load movie details:', err);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  const handleShare = async () => {
    if (!watchPartyData) return;

    try {
      await navigator.share({
        title: `Watch Party: ${watchPartyData.movieTitle}`,
        text: `Join me for a watch party of ${watchPartyData.movieTitle}!`,
        url: window.location.href
      });
    } catch (err) {
      // Fallback to copy
      handleCopyLink();
    }
  };

  const handleTimeUp = () => {
    // Handle when countdown reaches zero
    console.log('Watch party started!');
  };



  // Loading state
  if (loading) {
    return (
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-8">
            <div className="h-8 w-32 bg-muted rounded" />
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="h-64 bg-muted rounded-lg" />
              <div className="space-y-4">
                <div className="h-8 bg-muted rounded w-3/4" />
                <div className="h-4 bg-muted rounded w-1/2" />
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // Error state
  if (error || !watchPartyData) {
    return (
      <main className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          
          <div className="flex flex-col items-center justify-center py-16">
            <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Watch Party Not Found
            </h1>
            <p className="text-muted-foreground text-center max-w-md mb-6">
              {error || "The watch party you're looking for doesn't exist or the link is invalid."}
            </p>
            <Button variant="primary" onClick={() => router.push('/')}>
              Go Home
            </Button>
          </div>
        </div>
      </main>
    );
  }

  const posterUrl = watchPartyData.moviePoster 
    ? `https://image.tmdb.org/t/p/w500${watchPartyData.moviePoster}`
    : null;

  const scheduledDate = new Date(watchPartyData.scheduledTime);

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8 max-w-4xl">

        {/* Watch Party Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Watch Party
          </h1>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Movie Info */}
          <div className="space-y-6">
            <div className="relative aspect-[2/3] rounded-lg overflow-hidden shadow-xl">
              {watchPartyData.moviePoster ? (
                <Image
                  src={`https://image.tmdb.org/t/p/w500${watchPartyData.moviePoster}`}
                  alt={`${watchPartyData.movieTitle} poster`}
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

            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-semibold text-foreground mb-1">
                  {watchPartyData.movieTitle}
                </h2>
                {movie && (
                  <div className="text-sm text-muted-foreground space-y-1">
                    {movie.releaseDate && (
                      <div>{new Date(movie.releaseDate).getFullYear()}</div>
                    )}
                    {movie.runtime && (
                      <div className="flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m
                      </div>
                    )}
                    {movie.voteAverage > 0 && (
                      <div className="flex items-center">
                        <span className="text-yellow-500">★</span>
                        <span className="ml-1">{movie.voteAverage.toFixed(1)}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {movie?.genres && movie.genres.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {movie.genres.slice(0, 3).map((genre) => (
                    <Badge key={genre.id} variant="secondary" size="sm">
                      {genre.name}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Countdown and Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Countdown Timer */}
            <div className="text-center">
              {scheduledDate > new Date() ? (
                <CountdownTimer
                  targetDate={scheduledDate}
                  onTimeUp={handleTimeUp}
                  variant="neon"
                  className="mx-auto"
                />
              ) : (
                <div className="p-8 rounded-lg bg-gradient-to-br from-gray-500/20 to-slate-500/20 border border-gray-500/50">
                  <CheckCircle className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-gray-500 mb-2">
                    Watch Party Completed
                  </h3>
                  <p className="text-gray-400">
                    This watch party ended at {format(addMinutes(scheduledDate, movie?.runtime || 120), 'h:mm a')}
                  </p>
                </div>
              )}
            </div>

            {/* Schedule Details */}
            <div className="bg-card rounded-lg border p-6 space-y-4">
              <h3 className="text-lg font-semibold text-foreground flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                Schedule Details
              </h3>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Date:</span>
                  <span className="text-foreground font-medium">
                    {format(scheduledDate, 'EEEE, MMMM d, yyyy')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Start Time:</span>
                  <span className="text-foreground font-medium">
                    {format(scheduledDate, 'h:mm a')}
                  </span>
                </div>
                {movie?.runtime && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Estimated End:</span>
                    <span className="text-foreground font-medium">
                      {format(addMinutes(scheduledDate, movie.runtime), 'h:mm a')}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Time Zone:</span>
                  <span className="text-foreground font-medium">
                    {Intl.DateTimeFormat().resolvedOptions().timeZone}
                  </span>
                </div>
              </div>
            </div>

            {/* Sharing Section */}
            <div className="bg-card rounded-lg border p-6 space-y-4">
              <h3 className="text-lg font-semibold text-foreground flex items-center">
                <ExternalLink className="w-5 h-5 mr-2" />
                Invite Friends
              </h3>
              
              <p className="text-sm text-muted-foreground">
                Share this link with friends to invite them to your watch party
              </p>
              
              <Button
                variant="primary"
                onClick={handleCopyLink}
                className={cn(
                  "w-full transition-all duration-200",
                  copied && "bg-green-600 hover:bg-green-700"
                )}
              >
                {copied ? (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Link Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-2" />
                    Copy Party Link
                  </>
                )}
              </Button>
              
              {copied && (
                <p className="text-xs text-green-600 text-center">
                  Link copied to clipboard!
                </p>
              )}
            </div>

            {/* Movie Overview and Cast */}
            {movie && (
              <div className="bg-card rounded-lg border p-6 space-y-6">
                <h3 className="text-lg font-semibold text-foreground mb-3">
                  About the Movie
                </h3>
                
                {movie.overview && (
                  <div>
                    <p className="text-muted-foreground leading-relaxed">
                      {movie.overview}
                    </p>
                  </div>
                )}

                {/* Cast Section */}
                {movie.cast && movie.cast.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="text-base font-semibold text-foreground">
                      Cast
                    </h4>
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
            )}
          </div>
        </div>
      </div>
    </main>
  );
}