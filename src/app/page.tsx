/**
 * Home Page - Movie Search and Discovery
 * Main landing page with movie search functionality and trending movies
 */

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { SearchBox } from '@/features/movie-search/components/SearchBox';
import { MovieGrid } from '@/features/movie-search/components/MovieGrid';
import { Header } from '@/components/organisms/Header';
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
  const [lastSearchQuery, setLastSearchQuery] = useState(''); // Track last successful search
  const [isNowPlayingMode, setIsNowPlayingMode] = useState(true); // Track if showing now playing vs search results
  
  const router = useRouter();

  // Generate dynamic page title based on current mode
  const getPageTitle = useCallback(() => {
    if (searchQuery) {
      return 'Search Results';
    }
    
    if (selectedGenres.length === 0) {
      return 'Popular Movies';
    }
    
    // Get genre names from selected genre IDs
    const selectedGenreNames = selectedGenres
      .map(genreId => genres.find(genre => genre.id === genreId)?.name)
      .filter(Boolean); // Remove undefined values
    
    if (selectedGenreNames.length === 0) {
      return 'Popular Movies'; // Fallback if genres not loaded yet
    }
    
    return `${selectedGenreNames.join(', ')} Movies`;
  }, [searchQuery, selectedGenres, genres]);

  // Update document title when page title changes
  useEffect(() => {
    const pageTitle = getPageTitle();
    document.title = `${pageTitle} - Watchify`;
  }, [getPageTitle]);

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
      
      // Load 3 pages of "Popular" movies to get ~60 items (20 per page)
      const pages = [1, 2, 3];
      const responses = await Promise.all(
        pages.map(page => fetch(`/api/movies/popular?page=${page}`))
      );
      
      // Check if all requests succeeded
      const allSuccessful = responses.every(response => response.ok);
      
      if (allSuccessful) {
        const dataPromises = responses.map(response => response.json() as Promise<SearchResponse>);
        const allData = await Promise.all(dataPromises);
        
        // Combine all results
        const combinedMovies = allData.flatMap(data => data.results);
        setMovies(combinedMovies);
        
        // Use the last page's totalPages and set current page to 3
        const lastData = allData[allData.length - 1];
        setHasMore(3 < lastData.totalPages);
        setCurrentPage(3);
        setIsNowPlayingMode(true);
      } else {
        setError('Failed to load popular movies');
      }
    } catch (err) {
      setError('Failed to load popular movies');
    } finally {
      setLoading(false);
      setIsInitialLoad(false);
    }
  };

  const loadMoreNowPlaying = async (startPage: number) => {
    try {
      setLoading(true);
      setError(null);
      
      // Load 3 consecutive pages starting from startPage
      const pages = [startPage, startPage + 1, startPage + 2];
      const responses = await Promise.all(
        pages.map(page => {
          const params = new URLSearchParams({
            page: page.toString()
          });

          // Include genre filters if any are selected
          if (selectedGenres.length > 0) {
            params.append('genre', selectedGenres.join(','));
          }
          
          return fetch(`/api/movies/popular?${params}`);
        })
      );
      
      // Check if all requests succeeded
      const allSuccessful = responses.every(response => response.ok);
      
      if (allSuccessful) {
        const dataPromises = responses.map(response => response.json() as Promise<SearchResponse>);
        const allData = await Promise.all(dataPromises);
        
        // Combine all results and append to existing movies
        const combinedMovies = allData.flatMap(data => data.results);
        setMovies(prev => [...prev, ...combinedMovies]);
        
        // Use the last page's data for pagination info
        const lastData = allData[allData.length - 1];
        setHasMore(startPage + 2 < lastData.totalPages);
        setCurrentPage(startPage + 2);
      } else {
        setError('Failed to load more popular movies');
      }
    } catch (err) {
      setError('Failed to load more popular movies');
    } finally {
      setLoading(false);
    }
  };

  const performSearch = useCallback(async (query: string, page: number = 1, append: boolean = false) => {
    console.log('performSearch called:', { query, page, append });
    try {
      setLoading(true);
      setError(null);
      setIsNowPlayingMode(false); // Exit now playing mode when searching

      const params = new URLSearchParams({
        q: query,
        page: page.toString()
      });

      console.log('Making API call to:', `/api/movies/search?${params}`);
      const response = await fetch(`/api/movies/search?${params}`);
      
      if (response.ok) {
        const data: SearchResponse = await response.json();
        console.log('API response:', { page: data.page, totalPages: data.totalPages, resultsCount: data.results.length });
        
        if (append) {
          setMovies(prev => {
            console.log('Appending movies:', { previousCount: prev.length, newCount: data.results.length });
            return [...prev, ...data.results];
          });
        } else {
          setMovies(data.results);
        }
        
        setHasMore(data.page < data.totalPages);
        setCurrentPage(page); // Use the requested page number, not the returned page
        setLastSearchQuery(query); // Track the successful search query
        console.log('Updated state:', { hasMore: data.page < data.totalPages, currentPage: page });
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Search failed');
      }
    } catch (err) {
      console.error('Search error:', err);
      setError('Search failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []); // Remove selectedGenres dependency since search doesn't use genre filtering

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    setSelectedGenres([]); // Clear genre filters when starting a search
    setCurrentPage(1);
    performSearch(query, 1, false);
  }, [performSearch]);

  const handleClearSearch = useCallback(() => {
    setSearchQuery('');
    setLastSearchQuery('');
    setSelectedGenres([]);
    setCurrentPage(1);
    setHasMore(false);
    setIsNowPlayingMode(true);
    loadTrendingMovies();
  }, []);

  const handleLoadMore = useCallback(() => {
    console.log('Load More clicked:', { isNowPlayingMode, lastSearchQuery, hasMore, loading, currentPage });
    
    if (!hasMore || loading) {
      console.log('Load More conditions not met:', { hasMore, isNotLoading: !loading });
      return;
    }
    
    if (isNowPlayingMode) {
      console.log('Loading more now playing movies, page:', currentPage + 1);
      loadMoreNowPlaying(currentPage + 1);
    } else if (lastSearchQuery) {
      console.log('Loading more search results, page:', currentPage + 1);
      performSearch(lastSearchQuery, currentPage + 1, true);
    }
  }, [isNowPlayingMode, lastSearchQuery, hasMore, loading, currentPage, performSearch]);

  const handleMovieClick = useCallback((movie: Movie) => {
    router.push(`/movies/${movie.id}`);
  }, [router]);

  const loadPopularMoviesWithGenres = useCallback(async (genreIds: number[], startPage: number = 1) => {
    try {
      setLoading(true);
      setError(null);
      setIsNowPlayingMode(true);

      // Load 3 consecutive pages for better grid display (60 items)
      const pages = [startPage, startPage + 1, startPage + 2];
      const responses = await Promise.all(
        pages.map(page => {
          const params = new URLSearchParams({
            page: page.toString()
          });

          if (genreIds.length > 0) {
            params.append('genre', genreIds.join(','));
          }

          return fetch(`/api/movies/popular?${params}`);
        })
      );

      console.log('Loading popular movies with genres:', { genreIds, startPage, pages });
      
      // Check if all requests succeeded
      const allSuccessful = responses.every(response => response.ok);
      
      if (allSuccessful) {
        const dataPromises = responses.map(response => response.json() as Promise<SearchResponse>);
        const allData = await Promise.all(dataPromises);
        
        console.log('Popular movies with genres loaded:', { 
          pages: allData.map(d => d.page),
          totalResults: allData.reduce((sum, d) => sum + d.results.length, 0),
          genreIds
        });
        
        // Combine all results
        const combinedMovies = allData.flatMap(data => data.results);
        
        if (startPage === 1) {
          setMovies(combinedMovies);
        } else {
          setMovies(prev => [...prev, ...combinedMovies]);
        }
        
        // Use the last page's data for pagination info
        const lastData = allData[allData.length - 1];
        setHasMore(startPage + 2 < lastData.totalPages);
        setCurrentPage(startPage + 2);
      } else {
        setError('Failed to load popular movies');
      }
    } catch (err) {
      console.error('Error loading popular movies with genres:', err);
      setError('Failed to load popular movies. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleGenreToggle = useCallback((genreId: number) => {
    // Genre filtering is not available during search mode
    if (searchQuery) {
      return;
    }
    
    setSelectedGenres(prev => {
      const newGenres = prev.includes(genreId)
        ? prev.filter(id => id !== genreId)
        : [...prev, genreId];
      
      // Reset to page 1 when filters change
      setCurrentPage(1);
      setHasMore(false);
      
      // Load filtered popular movies
      loadPopularMoviesWithGenres(newGenres, 1);
      
      return newGenres;
    });
  }, [searchQuery, loadPopularMoviesWithGenres]);

  const handleGenresClear = useCallback(() => {
    // Genre filtering is not available during search mode
    if (searchQuery) {
      return;
    }
    
    setSelectedGenres([]);
    // Load popular movies without genre filters
    loadPopularMoviesWithGenres([], 1);
  }, [searchQuery, loadPopularMoviesWithGenres]);

  return (
    <main className="min-h-screen bg-background">
      <Header />

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
                  {getPageTitle()}
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
            hideGenreFilters={Boolean(searchQuery)} // Hide genre filters when searching
            onMovieClick={handleMovieClick}
            onLoadMore={handleLoadMore}
            onGenreToggle={handleGenreToggle}
            onGenresClear={handleGenresClear}
            gridCols={{ sm: 2, md: 3, lg: 5, xl: 5 }}
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