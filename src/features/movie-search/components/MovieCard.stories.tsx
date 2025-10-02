/**
 * MovieCard Stories
 * Storybook documentation for MovieCard molecule component
 */

import type { Meta, StoryObj } from '@storybook/react';
import { MovieCard } from './MovieCard';
import { Movie } from '@/types';

const meta = {
  title: 'Molecules/MovieCard',
  component: MovieCard,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A versatile movie card component that displays movie information in different variants.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'compact', 'featured'],
      description: 'Visual variant of the movie card',
    },
    showGenres: {
      control: { type: 'boolean' },
      description: 'Whether to show movie genres',
    },
    showRating: {
      control: { type: 'boolean' },
      description: 'Whether to show movie rating',
    },
    showRuntime: {
      control: { type: 'boolean' },
      description: 'Whether to show movie runtime',
    },
    priority: {
      control: { type: 'boolean' },
      description: 'Whether this card should load images with priority',
    },
    onClick: { action: 'clicked' },
  },
} satisfies Meta<typeof MovieCard>;

export default meta;
type Story = StoryObj<typeof meta>;

// Sample movie data
const sampleMovie: Movie = {
  id: 550,
  title: 'Fight Club',
  overview: 'A ticking-time-bomb insomniac and a slippery soap salesman channel primal male aggression into a shocking new form of therapy. Their concept catches on, with underground "fight clubs" forming in every town, until an eccentric gets in the way and ignites an out-of-control spiral toward oblivion.',
  posterPath: '/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg',
  backdropPath: '/52AfXWuXCHn3UjD17rBruA9f5qb.jpg',
  releaseDate: '1999-10-15',
  genres: [
    { id: 18, name: 'Drama' },
    { id: 53, name: 'Thriller' },
  ],
  voteAverage: 8.4,
  voteCount: 26280,
  popularity: 61.982,
  runtime: 139,
  cast: [],
};

const lowRatedMovie: Movie = {
  ...sampleMovie,
  id: 123,
  title: 'Average Movie',
  voteAverage: 5.2,
  releaseDate: '2020-06-15',
  overview: 'A mediocre film that received mixed reviews from critics and audiences.',
};

const upcomingMovie: Movie = {
  ...sampleMovie,
  id: 456,
  title: 'Upcoming Blockbuster',
  voteAverage: 0,
  voteCount: 0,
  releaseDate: '2025-12-25',
  overview: 'An highly anticipated upcoming film that promises to be the event of the year.',
  posterPath: null,
};

// Default story
export const Default: Story = {
  args: {
    movie: sampleMovie,
    variant: 'default',
    showGenres: true,
    showRating: true,
    showRuntime: true,
    priority: false,
  },
};

// Compact variant
export const Compact: Story = {
  args: {
    movie: sampleMovie,
    variant: 'compact',
    showGenres: false,
    showRating: true,
    showRuntime: false,
  },
  parameters: {
    layout: 'padded',
  },
};

// Featured variant
export const Featured: Story = {
  args: {
    movie: sampleMovie,
    variant: 'featured',
    showGenres: true,
    showRating: true,
    showRuntime: true,
    priority: true,
  },
};

// Without genres
export const WithoutGenres: Story = {
  args: {
    movie: sampleMovie,
    showGenres: false,
    showRating: true,
    showRuntime: true,
  },
};

// Without rating
export const WithoutRating: Story = {
  args: {
    movie: sampleMovie,
    showGenres: true,
    showRating: false,
    showRuntime: true,
  },
};

// Low rated movie
export const LowRated: Story = {
  args: {
    movie: lowRatedMovie,
    showGenres: true,
    showRating: true,
    showRuntime: true,
  },
};

// Upcoming movie (no rating, no poster)
export const Upcoming: Story = {
  args: {
    movie: upcomingMovie,
    showGenres: true,
    showRating: true,
    showRuntime: true,
  },
};

// Interactive example
export const Interactive: Story = {
  args: {
    movie: sampleMovie,
    showGenres: true,
    showRating: true,
    showRuntime: true,
  },
  play: async ({ args, canvasElement }) => {
    // This would typically include interactions for testing
    console.log('MovieCard interactive story', { args, canvasElement });
  },
};

// Grid layout example
export const GridLayout = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl">
      <MovieCard movie={sampleMovie} variant="default" />
      <MovieCard movie={lowRatedMovie} variant="default" />
      <MovieCard movie={upcomingMovie} variant="default" />
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};

// Compact list layout
export const CompactList = {
  render: () => (
    <div className="space-y-4 max-w-md">
      <MovieCard movie={sampleMovie} variant="compact" />
      <MovieCard movie={lowRatedMovie} variant="compact" />
      <MovieCard movie={upcomingMovie} variant="compact" />
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};