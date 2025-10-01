/**
 * SearchBox Molecule Component
 * Combines Input atom with search functionality for movie discovery
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/atoms/Input';
import { Button } from '@/components/atoms/Button';
import { cn } from '@/lib/utils';

export interface SearchBoxProps {
  onSearch: (query: string) => void;
  onClear?: () => void;
  placeholder?: string;
  className?: string;
  debounceMs?: number;
  disabled?: boolean;
  autoFocus?: boolean;
  initialValue?: string;
}

export function SearchBox({
  onSearch,
  onClear,
  placeholder = "Search for movies...",
  className,
  debounceMs = 300,
  disabled = false,
  autoFocus = false,
  initialValue = ""
}: SearchBoxProps) {
  const [query, setQuery] = useState(initialValue);
  const [isTyping, setIsTyping] = useState(false);

  // Debounced search effect
  useEffect(() => {
    if (!query.trim()) {
      return;
    }

    setIsTyping(true);
    const timer = setTimeout(() => {
      onSearch(query.trim());
      setIsTyping(false);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [query, onSearch, debounceMs]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    
    // If query is cleared, call onClear immediately
    if (!value.trim() && onClear) {
      onClear();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
      setIsTyping(false);
    }
  };

  const handleClear = () => {
    setQuery('');
    if (onClear) {
      onClear();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleClear();
    }
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className={cn(
        "relative w-full max-w-md mx-auto",
        className
      )}
    >
      <div className="relative">
        {/* Search Icon */}
        <Search 
          className={cn(
            "absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4",
            "text-gray-400 dark:text-gray-500",
            isTyping && "animate-pulse text-purple-500"
          )} 
        />
        
        {/* Input Field */}
        <Input
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          autoFocus={autoFocus}
          className={cn(
            "pl-10 pr-10",
            "bg-white dark:bg-gray-800",
            "border-gray-300 dark:border-gray-600",
            "focus:border-purple-500 focus:ring-purple-500",
            "placeholder:text-gray-400 dark:placeholder:text-gray-500"
          )}
          maxLength={100}
          aria-label="Search movies"
          aria-describedby="search-help"
        />
        
        {/* Clear Button */}
        {query && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className={cn(
              "absolute right-1 top-1/2 transform -translate-y-1/2",
              "p-1 h-auto min-h-0 w-8 h-8",
              "text-gray-400 hover:text-gray-600",
              "dark:text-gray-500 dark:hover:text-gray-300"
            )}
            aria-label="Clear search"
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>
      
      {/* Loading indicator */}
      {isTyping && (
        <div className="absolute right-12 top-1/2 transform -translate-y-1/2">
          <div className="w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      
      {/* Hidden submit button for form submission */}
      <button type="submit" className="sr-only" tabIndex={-1}>
        Search
      </button>
      
      {/* Help text */}
      <p id="search-help" className="sr-only">
        Enter a movie title to search. Results will appear as you type.
      </p>
    </form>
  );
}