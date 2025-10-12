/**
 * WatchPartyModal Component
 * Handles scheduling, creation, and cancellation of a watch party
 */

import React from 'react';
import Image from 'next/image';

import { Movie } from '@/types/movie';

import { Button } from '@/components/atoms/Button';
import { Skeleton } from '@/components/ui/skeleton';

import { DateTimePicker } from './DateTimePicker';

interface WatchPartyModalProps {
  movie: Movie;
  open: boolean;
  onClose: () => void;
  onCreate: (date: Date) => void;
  isCreating: boolean;
  selectedDateTime: Date | null;
  setSelectedDateTime: (date: Date | null) => void;
  dateTimeError: string | null;
  setDateTimeError: (err: string | null) => void;
}

export function WatchPartyModal({
  movie,
  open,
  onClose,
  onCreate,
  isCreating,
  selectedDateTime,
  setSelectedDateTime,
  dateTimeError,
  setDateTimeError,
}: WatchPartyModalProps) {
  if (!open) return null;

  const releaseYear = movie.releaseDate ? new Date(movie.releaseDate).getFullYear() : null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" data-testid="watch-party-modal">
      <div className="bg-card rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground">
              Schedule Watch Party
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="p-2"
              data-testid="modal-close-button"
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
              onClick={onClose}
              className="flex-1"
              data-testid="cancel-watch-party-button"
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={() => selectedDateTime && !dateTimeError && onCreate(selectedDateTime)}
              disabled={!selectedDateTime || !!dateTimeError || isCreating}
              className="flex-1"
              data-testid="create-watch-party-button"
            >
              {isCreating ? (
                <>Creating...</>
              ) : (
                <>
                  Create Party
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
