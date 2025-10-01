/**
 * Home Page - Movie Search and Discovery
 * Main landing page with movie search functionality and trending movies
 */

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { SearchBox } from '@/features/movie-search/components/SearchBox';
import { MovieGrid } from '@/features/movie-search/components/MovieGrid';
import { ThemeToggle } from '@/components/atoms/ThemeToggle';
import { Movie, Genre } from '@/types';
import { Film, Sparkles, TrendingUp } from 'lucide-react';

interface SearchResponse {
  results: Movie[];
  page: number;
  totalPages: number;
  totalResults: number;
}

export default function HomePage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenres, setSelectedGenres] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  
  const router = useRouter();

  // Load genres on component mount
  useEffect(() => {
    loadGenres();
    loadTrendingMovies(); // Load trending movies as default
  }, []);

  const loadGenres = async () => {
    try {
      const response = await fetch('/api/genres');
      if (response.ok) {
        const data = await response.json();
        setGenres(data.genres || []);
      }
    } catch (err) {
      console.error('Failed to load genres:', err);
    }
  };

  const loadTrendingMovies = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // For demo purposes, search for popular movies
      const response = await fetch('/api/movies/search?q=marvel&page=1');
      if (response.ok) {
        const data: SearchResponse = await response.json();
        setMovies(data.results);
        setHasMore(data.page < data.totalPages);
        setCurrentPage(data.page);
      } else {
        setError('Failed to load trending movies');
      }
    } catch (err) {
      setError('Failed to load trending movies');
    } finally {
      setLoading(false);
      setIsInitialLoad(false);
    }
  };

  const performSearch = useCallback(async (query: string, page: number = 1, append: boolean = false) => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        q: query,
        page: page.toString()
      });

      if (selectedGenres.length > 0) {
        params.append('genre', selectedGenres.join(','));
      }

      const response = await fetch(`/api/movies/search?${params}`);
      
      if (response.ok) {
        const data: SearchResponse = await response.json();
        
        if (append) {
          setMovies(prev => [...prev, ...data.results]);
        } else {
          setMovies(data.results);
        }
        
        setHasMore(data.page < data.totalPages);
        setCurrentPage(data.page);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Search failed');
      }
    } catch (err) {
      setError('Search failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [selectedGenres]);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
    performSearch(query, 1, false);
  }, [performSearch]);

  const handleClearSearch = useCallback(() => {
    setSearchQuery('');
    setMovies([]);
    setCurrentPage(1);
    setHasMore(false);
    loadTrendingMovies();
  }, []);

  const handleLoadMore = useCallback(() => {
    if (searchQuery && hasMore && !loading) {
      performSearch(searchQuery, currentPage + 1, true);
    }
  }, [searchQuery, hasMore, loading, currentPage, performSearch]);

  const handleMovieClick = useCallback((movie: Movie) => {
    router.push(`/movies/${movie.id}`);
  }, [router]);

  const handleGenreToggle = useCallback((genreId: number) => {
    setSelectedGenres(prev => {
      const newGenres = prev.includes(genreId)
        ? prev.filter(id => id !== genreId)
        : [...prev, genreId];
      
      // Re-search with new genre filters if there's a search query
      if (searchQuery) {
        // Use a timeout to ensure state updates first
        setTimeout(() => {
          performSearch(searchQuery, 1, false);
        }, 0);
      }
      
      return newGenres;
    });
  }, [searchQuery, performSearch]);

  const handleGenresClear = useCallback(() => {
    setSelectedGenres([]);
    
    // Re-search without genre filters if there's a search query
    if (searchQuery) {
      setTimeout(() => {
        performSearch(searchQuery, 1, false);
      }, 0);
    }
  }, [searchQuery, performSearch]);

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Film className="w-8 h-8 text-purple-600" />
              <h1 className="text-2xl font-bold text-foreground">
                Watchify
              </h1>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      {!searchQuery && isInitialLoad && (
        <section className="py-16 px-4 text-center">
          <div className="container mx-auto max-w-4xl">
            <h2 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
              Watch Movies
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                {" "}Together
              </span>
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Search for movies, schedule watch parties, and share the experience with friends. 
              Synchronized countdowns make every movie night special.
            </p>
          </div>
        </section>
      )}

      {/* Search Section */}
      <section className="py-8 px-4">
        <div className="container mx-auto max-w-2xl">
          <SearchBox
            onSearch={handleSearch}
            onClear={handleClearSearch}
            placeholder="Search for movies to start a watch party..."
            className="w-full"
            autoFocus={!isInitialLoad}
          />
        </div>
      </section>

      {/* Content Section */}
      <section className="py-8 px-4">
        <div className="container mx-auto">
          {/* Section Header */}
          <div className="flex items-center space-x-2 mb-6">
            {searchQuery ? (
              <>
                <Film className="w-5 h-5 text-purple-600" />
                <h2 className="text-2xl font-semibold text-foreground">
                  Search Results for "{searchQuery}"
                </h2>
              </>
            ) : (
              <>
                <TrendingUp className="w-5 h-5 text-purple-600" />
                <h2 className="text-2xl font-semibold text-foreground">
                  Trending Movies
                </h2>
                <Sparkles className="w-4 h-4 text-yellow-500" />
              </>
            )}
          </div>

          {/* Movie Grid */}
          <MovieGrid
            movies={movies}
            genres={genres}
            loading={loading}
            error={error}
            hasMore={hasMore}
            selectedGenres={selectedGenres}
            onMovieClick={handleMovieClick}
            onLoadMore={handleLoadMore}
            onGenreToggle={handleGenreToggle}
            onGenresClear={handleGenresClear}
            className="max-w-7xl mx-auto"
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-16 border-t border-border bg-card/50 backdrop-blur">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-muted-foreground">
            <p className="text-sm">
              Built with Next.js, powered by TMDB API
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}