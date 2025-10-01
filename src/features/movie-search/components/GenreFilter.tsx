/**
 * GenreFilter Molecule Component
 * Provides genre filtering functionality for movie search
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Filter, X, ChevronDown, Check } from 'lucide-react';
import { Button } from '@/components/atoms/Button';
import { Badge } from '@/components/atoms/Badge';
import { Genre } from '@/types';
import { cn } from '@/lib/utils';

export interface GenreFilterProps {
  genres: Genre[];
  selectedGenres: number[];
  onGenreToggle: (genreId: number) => void;
  onClear: () => void;
  onApply?: (selectedGenres: number[]) => void;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
  variant?: 'dropdown' | 'chips' | 'sidebar';
  maxSelected?: number;
  showClearAll?: boolean;
  showApplyButton?: boolean;
}

export function GenreFilter({
  genres,
  selectedGenres,
  onGenreToggle,
  onClear,
  onApply,
  loading = false,
  disabled = false,
  className,
  variant = 'dropdown',
  maxSelected = 5,
  showClearAll = true,
  showApplyButton = false
}: GenreFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredGenres = genres.filter(genre =>
    genre.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleGenreClick = (genreId: number) => {
    if (disabled) return;
    
    if (selectedGenres.includes(genreId)) {
      onGenreToggle(genreId);
    } else if (selectedGenres.length < maxSelected) {
      onGenreToggle(genreId);
    }
  };

  const handleClear = () => {
    onClear();
    if (showApplyButton && onApply) {
      onApply([]);
    }
  };

  const handleApply = () => {
    if (onApply) {
      onApply(selectedGenres);
    }
    setIsOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('[data-genre-filter]')) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  if (variant === 'chips') {
    return (
      <div className={cn("space-y-3", className)} data-genre-filter>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Filter by Genre
            </span>
          </div>
          {selectedGenres.length > 0 && showClearAll && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClear}
              disabled={disabled}
              className="text-xs"
            >
              Clear all
            </Button>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {genres.map((genre) => {
            const isSelected = selectedGenres.includes(genre.id);
            const isDisabled = disabled || (!isSelected && selectedGenres.length >= maxSelected);
            
            return (
              <button
                key={genre.id}
                onClick={() => handleGenreClick(genre.id)}
                disabled={isDisabled}
                className={cn(
                  "px-3 py-1 text-sm rounded-full border transition-all duration-200",
                  "focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2",
                  isSelected
                    ? "bg-purple-600 text-white border-purple-600 hover:bg-purple-700"
                    : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-purple-500 hover:text-purple-600 dark:hover:text-purple-400",
                  isDisabled && "opacity-50 cursor-not-allowed"
                )}
              >
                {genre.name}
                {isSelected && <Check className="w-3 h-3 ml-1 inline" />}
              </button>
            );
          })}
        </div>

        {selectedGenres.length > 0 && (
          <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
            <span>{selectedGenres.length} of {maxSelected} selected</span>
          </div>
        )}
      </div>
    );
  }

  if (variant === 'sidebar') {
    return (
      <div className={cn("space-y-4", className)} data-genre-filter>
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-gray-900 dark:text-white flex items-center">
            <Filter className="w-4 h-4 mr-2" />
            Genres
          </h3>
          {selectedGenres.length > 0 && showClearAll && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClear}
              disabled={disabled}
              className="text-xs"
            >
              Clear
            </Button>
          )}
        </div>

        <div className="space-y-2 max-h-64 overflow-y-auto">
          {genres.map((genre) => {
            const isSelected = selectedGenres.includes(genre.id);
            const isDisabled = disabled || (!isSelected && selectedGenres.length >= maxSelected);
            
            return (
              <label
                key={genre.id}
                className={cn(
                  "flex items-center space-x-2 p-2 rounded cursor-pointer transition-colors",
                  "hover:bg-gray-50 dark:hover:bg-gray-800",
                  isDisabled && "opacity-50 cursor-not-allowed"
                )}
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => handleGenreClick(genre.id)}
                  disabled={isDisabled}
                  className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {genre.name}
                </span>
              </label>
            );
          })}
        </div>

        {selectedGenres.length > 0 && (
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {selectedGenres.length} of {maxSelected} selected
          </div>
        )}
      </div>
    );
  }

  // Default dropdown variant
  return (
    <div className={cn("relative", className)} data-genre-filter>
      <Button
        variant="ghost"
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled}
        className={cn(
          "flex items-center space-x-2 w-full justify-between",
          "border border-gray-300 dark:border-gray-600",
          "bg-white dark:bg-gray-800"
        )}
      >
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4" />
          <span>
            {selectedGenres.length === 0 
              ? "Filter by genre" 
              : `${selectedGenres.length} genre${selectedGenres.length > 1 ? 's' : ''} selected`
            }
          </span>
        </div>
        <ChevronDown className={cn(
          "w-4 h-4 transition-transform",
          isOpen && "transform rotate-180"
        )} />
      </Button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-64 overflow-y-auto">
          <div className="p-3 space-y-3">
            {/* Search */}
            <input
              type="text"
              placeholder="Search genres..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded bg-transparent"
            />

            {/* Selected genres */}
            {selectedGenres.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                    Selected ({selectedGenres.length})
                  </span>
                  {showClearAll && (
                    <button
                      onClick={handleClear}
                      className="text-xs text-red-600 hover:text-red-700"
                    >
                      Clear all
                    </button>
                  )}
                </div>
                <div className="flex flex-wrap gap-1">
                  {genres
                    .filter(genre => selectedGenres.includes(genre.id))
                    .map(genre => (
                      <Badge
                        key={genre.id}
                        variant="primary"
                        size="sm"
                        className="cursor-pointer"
                        onClick={() => handleGenreClick(genre.id)}
                      >
                        {genre.name}
                        <X className="w-3 h-3 ml-1" />
                      </Badge>
                    ))}
                </div>
              </div>
            )}

            {/* Genre list */}
            <div className="space-y-1">
              {filteredGenres
                .filter(genre => !selectedGenres.includes(genre.id))
                .map((genre) => {
                  const isDisabled = selectedGenres.length >= maxSelected;
                  
                  return (
                    <button
                      key={genre.id}
                      onClick={() => handleGenreClick(genre.id)}
                      disabled={isDisabled}
                      className={cn(
                        "w-full text-left px-3 py-2 text-sm rounded transition-colors",
                        "hover:bg-gray-100 dark:hover:bg-gray-700",
                        isDisabled && "opacity-50 cursor-not-allowed"
                      )}
                    >
                      {genre.name}
                    </button>
                  );
                })}
            </div>

            {/* Apply button */}
            {showApplyButton && (
              <div className="pt-2 border-t border-gray-200 dark:border-gray-600">
                <Button
                  onClick={handleApply}
                  variant="primary"
                  size="sm"
                  className="w-full"
                >
                  Apply Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}