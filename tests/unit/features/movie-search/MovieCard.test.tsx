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

describe('MovieCard Component', () => {
  it('should render movie title', () => {
    render(<MovieCard movie={mockMovie} />);
    expect(screen.getByText('Fight Club')).toBeInTheDocument();
  });

  it('should handle click events', () => {
    const handleClick = jest.fn();
    render(<MovieCard movie={mockMovie} onClick={handleClick} />);
    
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledWith(mockMovie);
  });

  it('should show genres when enabled', () => {
    render(<MovieCard movie={mockMovie} showGenres />);
    expect(screen.getByText('Drama')).toBeInTheDocument();
  });
});