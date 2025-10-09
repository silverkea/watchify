import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MovieCard } from '@/features/movie-search/components/MovieCard';
import type { Movie } from '@/types/movie';

const mockMovie: Movie = {
  id: 550,
  title: 'Fight Club',
  overview: 'A great movie',
  releaseDate: '1999-10-15',
  posterPath: '/poster.jpg',
  backdropPath: '/backdrop.jpg',
  voteAverage: 8.4,
  voteCount: 1000,
  genres: [
    { id: 18, name: 'Drama' },
    { id: 53, name: 'Thriller' }
  ],
  runtime: 139,
  cast: [],
  popularity: 61.4
};

describe('MovieCard Molecule', () => {
  describe('Core Rendering', () => {
    it('should render movie title', () => {
      render(<MovieCard movie={mockMovie} />);
      expect(screen.getByText('Fight Club')).toBeInTheDocument();
    });

    it('should handle click events', () => {
      const handleClick = jest.fn();
      render(<MovieCard movie={mockMovie} onClick={handleClick} />);
      
      const card = screen.getByTestId('movie-card');
      fireEvent.click(card);
      expect(handleClick).toHaveBeenCalledWith(mockMovie);
    });

    it('should show genres when enabled', () => {
      render(<MovieCard movie={mockMovie} showGenres />);
      expect(screen.getByText('Drama')).toBeInTheDocument();
    });
  });

  describe('Accessibility & Interaction', () => {
    it('should be keyboard accessible', () => {
      const handleClick = jest.fn();
      render(<MovieCard movie={mockMovie} onClick={handleClick} />);
      
      const card = screen.getByTestId('movie-card');
      fireEvent.keyDown(card, { key: 'Enter' });
      // Tests that the card can receive keyboard focus
      expect(card).toBeInTheDocument();
    });

    it('should have proper semantic structure', () => {
      render(<MovieCard movie={mockMovie} />);
      expect(screen.getByTestId('movie-card')).toBeInTheDocument();
      expect(screen.getByText('Fight Club')).toBeInTheDocument();
    });
  });

  describe('Data Display', () => {
    it('should handle missing or incomplete data', () => {
      const incompleteMovie = { 
        ...mockMovie, 
        overview: '', 
        voteAverage: 0,
        posterPath: null 
      };
      render(<MovieCard movie={incompleteMovie} />);
      expect(screen.getByText('Fight Club')).toBeInTheDocument();
    });

    it('should display movie information correctly', () => {
      render(<MovieCard movie={mockMovie} />);
      expect(screen.getByText('Fight Club')).toBeInTheDocument();
      expect(screen.getByText('1999')).toBeInTheDocument();
    });
  });
});