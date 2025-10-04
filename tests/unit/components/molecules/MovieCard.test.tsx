import React from 'react';import React from 'react';import React from 'react';

import { render, screen, fireEvent } from '@testing-library/react';

import { MovieCard } from '@/features/movie-search/components/MovieCard';import { render, screen, fireEvent } from '@testing-library/react';import { render, screen, fireEvent } from '@testing-library/react';

import type { Movie } from '@/types/movie';

import { MovieCard } from '@/features/movie-search/components/MovieCard';import { MovieCard } from '@/features/movie-search/components/MovieCard';

const mockMovie: Movie = {

  id: 550,import type { Movie } from '@/types/movie';import type { Movie } from '@/types/movie';

  title: 'Fight Club',

  overview: 'A ticking-time-bomb insomniac and a slippery soap salesman channel primal male aggression into a shocking new form of therapy.',

  releaseDate: '1999-10-15',

  posterPath: '/bptfVGEQuv6vDTIMVCHjJ9Dz8PX.jpg',const mockMovie: Movie = {const mockMovie: Movie = {

  backdropPath: '/fCayJrkfRaCRCTh8GqN30f8oyQF.jpg',

  voteAverage: 8.433,  id: 550,  id: 550,

  voteCount: 27090,

  genres: [  title: 'Fight Club',  title: 'Fight Club',

    { id: 18, name: 'Drama' },

    { id: 53, name: 'Thriller' }  overview: 'A ticking-time-bomb insomniac and a slippery soap salesman channel primal male aggression into a shocking new form of therapy.',  overview: 'A ticking-time-bomb insomniac and a slippery soap salesman channel primal male aggression into a shocking new form of therapy.',

  ],

  runtime: 139,  releaseDate: '1999-10-15',  releaseDate: '1999-10-15',

  cast: [

    {  posterPath: '/bptfVGEQuv6vDTIMVCHjJ9Dz8PX.jpg',  posterPath: '/bptfVGEQuv6vDTIMVCHjJ9Dz8PX.jpg',

      id: 819,

      name: 'Edward Norton',  backdropPath: '/fCayJrkfRaCRCTh8GqN30f8oyQF.jpg',  backdropPath: '/fCayJrkfRaCRCTh8GqN30f8oyQF.jpg',

      character: 'The Narrator',

      profilePath: '/5XBzD5WuTyVQZeS4VI25z2moMeY.jpg',  voteAverage: 8.433,  voteAverage: 8.433,

      order: 0

    }  voteCount: 27090,  voteCount: 27090,

  ],

  popularity: 61.416  genres: [  genres: [

};

    { id: 18, name: 'Drama' },    { id: 18, name: 'Drama' },

describe('MovieCard Molecule', () => {

  describe('Rendering', () => {    { id: 53, name: 'Thriller' }    { id: 53, name: 'Thriller' }

    it('should render movie title and basic information', () => {

      render(<MovieCard movie={mockMovie} />);  ],  ],

      

      expect(screen.getByText('Fight Club')).toBeInTheDocument();  runtime: 139,  runtime: 139,

      expect(screen.getByText('1999')).toBeInTheDocument();

    });  cast: [  cast: [



    it('should render with different variants', () => {    {    {

      const { rerender } = render(<MovieCard movie={mockMovie} variant="default" />);

      expect(screen.getByText('Fight Club')).toBeInTheDocument();      id: 819,      id: 819,



      rerender(<MovieCard movie={mockMovie} variant="compact" />);      name: 'Edward Norton',      name: 'Edward Norton',

      expect(screen.getByText('Fight Club')).toBeInTheDocument();

      character: 'The Narrator',      character: 'The Narrator',

      rerender(<MovieCard movie={mockMovie} variant="featured" />);

      expect(screen.getByText('Fight Club')).toBeInTheDocument();      profilePath: '/5XBzD5WuTyVQZeS4VI25z2moMeY.jpg',      profilePath: '/8NYShqbDy8gZGdTrRnZNL0iFg0w.jpg',

    });

      order: 0      order: 0

    it('should show genres when enabled', () => {

      render(<MovieCard movie={mockMovie} showGenres />);    }    },

      

      expect(screen.getByText('Drama')).toBeInTheDocument();  ],    {

      expect(screen.getByText('Thriller')).toBeInTheDocument();

    });  popularity: 61.416      id: 287,



    it('should show rating when enabled', () => {};      name: 'Brad Pitt', 

      render(<MovieCard movie={mockMovie} showRating />);

            character: 'Tyler Durden',

      expect(screen.getByText('8.4')).toBeInTheDocument();

    });describe('MovieCard Molecule', () => {      profilePath: '/ajNaPmXVVMJFg9GWmu6MJzTaXdV.jpg',



    it('should show runtime when enabled', () => {  describe('Rendering', () => {      order: 1

      render(<MovieCard movie={mockMovie} showRuntime />);

          it('should render movie title and basic information', () => {    }

      expect(screen.getByText('2h 19m')).toBeInTheDocument();

    });      render(<MovieCard movie={mockMovie} />);  ],

  });

        popularity: 61.416

  describe('Interaction', () => {

    it('should call onClick when clicked', () => {      expect(screen.getByText('Fight Club')).toBeInTheDocument();};

      const handleClick = jest.fn();

      render(<MovieCard movie={mockMovie} onClick={handleClick} />);      expect(screen.getByText('1999')).toBeInTheDocument();

      

      fireEvent.click(screen.getByRole('button'));    });describe('MovieCard Molecule', () => {

      expect(handleClick).toHaveBeenCalledWith(mockMovie);

    });  describe('Rendering', () => {

  });

    it('should render with different variants', () => {    it('should be undefined initially (component not implemented)', () => {

  describe('Image Loading', () => {

    it('should render movie poster with correct alt text', () => {      const { rerender } = render(<MovieCard movie={mockMovie} variant="default" />);      expect(MovieCard).toBeUndefined();

      render(<MovieCard movie={mockMovie} />);

            expect(screen.getByText('Fight Club')).toBeInTheDocument();    });

      const image = screen.getByAltText('Fight Club poster');

      expect(image).toBeInTheDocument();

      expect(image).toHaveAttribute('src');

    });      rerender(<MovieCard movie={mockMovie} variant="compact" />);    it('should render with basic movie data', () => {



    it('should handle missing poster gracefully', () => {      expect(screen.getByText('Fight Club')).toBeInTheDocument();      render(<MovieCard movie={mockMovie} />);

      const movieWithoutPoster = { ...mockMovie, posterPath: null };

      render(<MovieCard movie={movieWithoutPoster} />);      

      

      expect(screen.getByText('Fight Club')).toBeInTheDocument();      rerender(<MovieCard movie={mockMovie} variant="featured" />);      expect(screen.getByText('Fight Club')).toBeInTheDocument();

    });

  });      expect(screen.getByText('Fight Club')).toBeInTheDocument();      expect(screen.getByText(/A ticking-time-bomb insomniac/)).toBeInTheDocument();



  describe('Accessibility', () => {    });      expect(screen.getByRole('img', { name: /Fight Club poster/i })).toBeInTheDocument();

    it('should have proper ARIA attributes', () => {

      render(<MovieCard movie={mockMovie} onClick={() => {}} />);    });

      

      const button = screen.getByRole('button');    it('should show genres when enabled', () => {

      expect(button).toBeInTheDocument();

      expect(button).toHaveAccessibleName();      render(<MovieCard movie={mockMovie} showGenres />);    it('should render with different variants', () => {

    });

  });            const { rerender } = render(<MovieCard movie={mockMovie} variant="compact" />);

});
      expect(screen.getByText('Drama')).toBeInTheDocument();      const card = screen.getByTestId('movie-card');

      expect(screen.getByText('Thriller')).toBeInTheDocument();      expect(card).toHaveClass('compact');

    });

      rerender(<MovieCard movie={mockMovie} variant="detailed" />);

    it('should show rating when enabled', () => {      expect(card).toHaveClass('detailed');

      render(<MovieCard movie={mockMovie} showRating />);

            rerender(<MovieCard movie={mockMovie} variant="hero" />);

      expect(screen.getByText('8.4')).toBeInTheDocument();      expect(card).toHaveClass('hero');

    });    });



    it('should show runtime when enabled', () => {    it('should render with different sizes', () => {

      render(<MovieCard movie={mockMovie} showRuntime />);      const { rerender } = render(<MovieCard movie={mockMovie} size="sm" />);

            const card = screen.getByTestId('movie-card');

      expect(screen.getByText('2h 19m')).toBeInTheDocument();      expect(card).toHaveClass('w-48');

    });

  });      rerender(<MovieCard movie={mockMovie} size="md" />);

      expect(card).toHaveClass('w-64');

  describe('Interaction', () => {

    it('should call onClick when clicked', () => {      rerender(<MovieCard movie={mockMovie} size="lg" />);

      const handleClick = jest.fn();      expect(card).toHaveClass('w-80');

      render(<MovieCard movie={mockMovie} onClick={handleClick} />);    });

      

      fireEvent.click(screen.getByRole('button'));    it('should render movie rating', () => {

      expect(handleClick).toHaveBeenCalledWith(mockMovie);      render(<MovieCard movie={mockMovie} showRating />);

    });      

  });      expect(screen.getByText('8.4')).toBeInTheDocument();

      expect(screen.getByLabelText(/rating/i)).toBeInTheDocument();

  describe('Image Loading', () => {    });

    it('should render movie poster with correct alt text', () => {

      render(<MovieCard movie={mockMovie} />);    it('should render release year', () => {

            render(<MovieCard movie={mockMovie} showYear />);

      const image = screen.getByAltText('Fight Club poster');      expect(screen.getByText('1999')).toBeInTheDocument();

      expect(image).toBeInTheDocument();    });

      expect(image).toHaveAttribute('src');

    });    it('should render genre badges when genres provided', () => {

      const genres = [

    it('should handle missing poster gracefully', () => {        { id: 18, name: 'Drama' },

      const movieWithoutPoster = { ...mockMovie, posterPath: null };        { id: 53, name: 'Thriller' }

      render(<MovieCard movie={movieWithoutPoster} />);      ];

            

      expect(screen.getByText('Fight Club')).toBeInTheDocument();      render(<MovieCard movie={mockMovie} genres={genres} showGenres />);

    });      

  });      expect(screen.getByText('Drama')).toBeInTheDocument();

      expect(screen.getByText('Thriller')).toBeInTheDocument();

  describe('Accessibility', () => {    });

    it('should have proper ARIA attributes', () => {

      render(<MovieCard movie={mockMovie} onClick={() => {}} />);    it('should handle missing poster gracefully', () => {

            const movieWithoutPoster = { ...mockMovie, posterPath: null };

      const button = screen.getByRole('button');      render(<MovieCard movie={movieWithoutPoster} />);

      expect(button).toBeInTheDocument();      

      expect(button).toHaveAccessibleName();      const placeholder = screen.getByRole('img', { name: /movie poster placeholder/i });

    });      expect(placeholder).toBeInTheDocument();

  });    });

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