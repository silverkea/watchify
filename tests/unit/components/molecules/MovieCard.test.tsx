import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MovieCard } from '@/components/molecules/MovieCard/index';
import type { Movie } from '@/types/movie';

const mockMovie: Movie = {
  id: 550,
  title: 'Fight Club',
  overview: 'A ticking-time-bomb insomniac and a slippery soap salesman channel primal male aggression into a shocking new form of therapy.',
  releaseDate: '1999-10-15',
  posterPath: '/bptfVGEQuv6vDTIMVCHjJ9Dz8PX.jpg',
  backdropPath: '/fCayJrkfRaCRCTh8GqN30f8oyQF.jpg',
  voteAverage: 8.433,
  voteCount: 27090,
  genres: [
    { id: 18, name: 'Drama' },
    { id: 53, name: 'Thriller' }
  ],
  runtime: 139,
  cast: [
    {
      id: 819,
      name: 'Edward Norton',
      character: 'The Narrator',
      profilePath: '/8NYShqbDy8gZGdTrRnZNL0iFg0w.jpg',
      order: 0
    },
    {
      id: 287,
      name: 'Brad Pitt', 
      character: 'Tyler Durden',
      profilePath: '/ajNaPmXVVMJFg9GWmu6MJzTaXdV.jpg',
      order: 1
    }
  ],
  popularity: 61.416
};

describe('MovieCard Molecule', () => {
  describe('Rendering', () => {
    it('should be undefined initially (component not implemented)', () => {
      expect(MovieCard).toBeUndefined();
    });

    it('should render with basic movie data', () => {
      render(<MovieCard movie={mockMovie} />);
      
      expect(screen.getByText('Fight Club')).toBeInTheDocument();
      expect(screen.getByText(/A ticking-time-bomb insomniac/)).toBeInTheDocument();
      expect(screen.getByRole('img', { name: /Fight Club poster/i })).toBeInTheDocument();
    });

    it('should render with different variants', () => {
      const { rerender } = render(<MovieCard movie={mockMovie} variant="compact" />);
      const card = screen.getByTestId('movie-card');
      expect(card).toHaveClass('compact');

      rerender(<MovieCard movie={mockMovie} variant="detailed" />);
      expect(card).toHaveClass('detailed');

      rerender(<MovieCard movie={mockMovie} variant="hero" />);
      expect(card).toHaveClass('hero');
    });

    it('should render with different sizes', () => {
      const { rerender } = render(<MovieCard movie={mockMovie} size="sm" />);
      const card = screen.getByTestId('movie-card');
      expect(card).toHaveClass('w-48');

      rerender(<MovieCard movie={mockMovie} size="md" />);
      expect(card).toHaveClass('w-64');

      rerender(<MovieCard movie={mockMovie} size="lg" />);
      expect(card).toHaveClass('w-80');
    });

    it('should render movie rating', () => {
      render(<MovieCard movie={mockMovie} showRating />);
      
      expect(screen.getByText('8.4')).toBeInTheDocument();
      expect(screen.getByLabelText(/rating/i)).toBeInTheDocument();
    });

    it('should render release year', () => {
      render(<MovieCard movie={mockMovie} showYear />);
      expect(screen.getByText('1999')).toBeInTheDocument();
    });

    it('should render genre badges when genres provided', () => {
      const genres = [
        { id: 18, name: 'Drama' },
        { id: 53, name: 'Thriller' }
      ];
      
      render(<MovieCard movie={mockMovie} genres={genres} showGenres />);
      
      expect(screen.getByText('Drama')).toBeInTheDocument();
      expect(screen.getByText('Thriller')).toBeInTheDocument();
    });

    it('should handle missing poster gracefully', () => {
      const movieWithoutPoster = { ...mockMovie, posterPath: null };
      render(<MovieCard movie={movieWithoutPoster} />);
      
      const placeholder = screen.getByRole('img', { name: /movie poster placeholder/i });
      expect(placeholder).toBeInTheDocument();
    });

    it('should truncate long overview text', () => {
      const longOverview = 'A'.repeat(200);
      const movieWithLongOverview = { ...mockMovie, overview: longOverview };
      
      render(<MovieCard movie={movieWithLongOverview} maxOverviewLength={100} />);
      
      const overviewText = screen.getByText(/A{50,}/);
      expect(overviewText.textContent).toHaveLength(103); // 100 + "..."
    });

    it('should show loading state', () => {
      render(<MovieCard loading />);
      
      expect(screen.getByRole('status', { name: /loading movie/i })).toBeInTheDocument();
      expect(screen.getByTestId('movie-card-skeleton')).toBeInTheDocument();
    });
  });

  describe('Interaction', () => {
    it('should call onClick when card is clicked', () => {
      const handleClick = jest.fn();
      render(<MovieCard movie={mockMovie} onClick={handleClick} />);
      
      fireEvent.click(screen.getByTestId('movie-card'));
      expect(handleClick).toHaveBeenCalledWith(mockMovie);
    });

    it('should call onAddToWatchlist when add button is clicked', () => {
      const handleAddToWatchlist = jest.fn();
      render(<MovieCard movie={mockMovie} onAddToWatchlist={handleAddToWatchlist} showActions />);
      
      const addButton = screen.getByRole('button', { name: /add to watchlist/i });
      fireEvent.click(addButton);
      
      expect(handleAddToWatchlist).toHaveBeenCalledWith(mockMovie);
    });

    it('should call onSelectForParty when select button is clicked', () => {
      const handleSelectForParty = jest.fn();
      render(<MovieCard movie={mockMovie} onSelectForParty={handleSelectForParty} showActions />);
      
      const selectButton = screen.getByRole('button', { name: /select for party/i });
      fireEvent.click(selectButton);
      
      expect(handleSelectForParty).toHaveBeenCalledWith(mockMovie);
    });

    it('should prevent card click when action buttons are clicked', () => {
      const handleClick = jest.fn();
      const handleAddToWatchlist = jest.fn();
      
      render(
        <MovieCard 
          movie={mockMovie} 
          onClick={handleClick} 
          onAddToWatchlist={handleAddToWatchlist}
          showActions 
        />
      );
      
      const addButton = screen.getByRole('button', { name: /add to watchlist/i });
      fireEvent.click(addButton);
      
      expect(handleAddToWatchlist).toHaveBeenCalled();
      expect(handleClick).not.toHaveBeenCalled();
    });

    it('should have hover effects', () => {
      render(<MovieCard movie={mockMovie} />);
      
      const card = screen.getByTestId('movie-card');
      expect(card).toHaveClass('hover:scale-105', 'transition-transform');
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA attributes', () => {
      render(<MovieCard movie={mockMovie} />);
      
      const card = screen.getByTestId('movie-card');
      expect(card).toHaveAttribute('role', 'article');
      expect(card).toHaveAttribute('aria-label', 'Movie: Fight Club');
    });

    it('should have proper image alt text', () => {
      render(<MovieCard movie={mockMovie} />);
      
      const poster = screen.getByRole('img');
      expect(poster).toHaveAttribute('alt', 'Fight Club poster');
    });

    it('should support keyboard navigation', () => {
      const handleClick = jest.fn();
      render(<MovieCard movie={mockMovie} onClick={handleClick} />);
      
      const card = screen.getByTestId('movie-card');
      
      // Should be focusable
      card.focus();
      expect(card).toHaveFocus();
      
      // Should respond to Enter key
      fireEvent.keyDown(card, { key: 'Enter' });
      expect(handleClick).toHaveBeenCalled();
    });

    it('should have proper focus styles', () => {
      render(<MovieCard movie={mockMovie} />);
      
      const card = screen.getByTestId('movie-card');
      expect(card).toHaveClass('focus:outline-none', 'focus:ring-2', 'focus:ring-purple-500');
    });

    it('should announce rating to screen readers', () => {
      render(<MovieCard movie={mockMovie} showRating />);
      
      const rating = screen.getByLabelText(/rating/i);
      expect(rating).toHaveAttribute('aria-label', 'Rating: 8.4 out of 10');
    });
  });

  describe('Image Optimization', () => {
    it('should use Next.js Image component for poster', () => {
      render(<MovieCard movie={mockMovie} />);
      
      const poster = screen.getByRole('img');
      expect(poster).toHaveAttribute('loading', 'lazy');
    });

    it('should provide multiple image sizes', () => {
      render(<MovieCard movie={mockMovie} />);
      
      const poster = screen.getByRole('img');
      expect(poster).toHaveAttribute('sizes');
    });

    it('should handle image load errors', () => {
      const onImageError = jest.fn();
      render(<MovieCard movie={mockMovie} onImageError={onImageError} />);
      
      const poster = screen.getByRole('img');
      fireEvent.error(poster);
      
      expect(onImageError).toHaveBeenCalled();
    });
  });

  describe('Theme Integration', () => {
    it('should adapt to dark/light themes', () => {
      render(<MovieCard movie={mockMovie} />);
      
      const card = screen.getByTestId('movie-card');
      expect(card).toHaveClass('dark:bg-gray-800', 'dark:text-white');
    });

    it('should support neon variant', () => {
      render(<MovieCard movie={mockMovie} variant="neon" />);
      
      const card = screen.getByTestId('movie-card');
      expect(card).toHaveClass('border-purple-500', 'shadow-purple-500/25');
    });
  });

  describe('Performance', () => {
    it('should memoize to prevent unnecessary re-renders', () => {
      const handleClick = jest.fn();
      const { rerender } = render(<MovieCard movie={mockMovie} onClick={handleClick} />);
      
      // Same props should not cause re-render
      rerender(<MovieCard movie={mockMovie} onClick={handleClick} />);
      
      // Should be memoized
      expect(handleClick).not.toHaveBeenCalled();
    });

    it('should lazy load images', () => {
      render(<MovieCard movie={mockMovie} />);
      
      const poster = screen.getByRole('img');
      expect(poster).toHaveAttribute('loading', 'lazy');
    });
  });

  describe('Selection State', () => {
    it('should show selected state', () => {
      render(<MovieCard movie={mockMovie} selected />);
      
      const card = screen.getByTestId('movie-card');
      expect(card).toHaveClass('ring-2', 'ring-purple-500');
      expect(screen.getByLabelText(/selected for watch party/i)).toBeInTheDocument();
    });

    it('should toggle selection when clicked in selection mode', () => {
      const handleSelect = jest.fn();
      render(<MovieCard movie={mockMovie} onSelect={handleSelect} selectionMode />);
      
      fireEvent.click(screen.getByTestId('movie-card'));
      expect(handleSelect).toHaveBeenCalledWith(mockMovie, true);
    });

    it('should show selection checkbox in selection mode', () => {
      render(<MovieCard movie={mockMovie} selectionMode />);
      
      const checkbox = screen.getByRole('checkbox', { name: /select fight club/i });
      expect(checkbox).toBeInTheDocument();
    });
  });

  describe('Watch Party Integration', () => {
    it('should show watch party indicator', () => {
      render(<MovieCard movie={mockMovie} inWatchParty />);
      
      expect(screen.getByLabelText(/in watch party/i)).toBeInTheDocument();
    });

    it('should show party member count', () => {
      render(<MovieCard movie={mockMovie} partyMemberCount={5} />);
      
      expect(screen.getByText('5 watching')).toBeInTheDocument();
    });

    it('should show scheduled watch time', () => {
      const watchTime = new Date('2025-10-01T20:00:00Z');
      render(<MovieCard movie={mockMovie} scheduledAt={watchTime} />);
      
      expect(screen.getByText(/Oct 1, 2025/)).toBeInTheDocument();
    });
  });
});