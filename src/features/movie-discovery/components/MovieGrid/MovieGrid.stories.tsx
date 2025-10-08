/**
 * MovieGrid Stories
 * Storybook documentation for MovieGrid molecule component
 */

import type { Meta, StoryObj } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { MovieGrid } from '../../../movie-search/components/MovieGrid';

const meta = {
  title: 'Molecules/MovieGrid',
  component: MovieGrid,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'A responsive grid layout for displaying movie cards. Handles loading states, empty states, and different grid configurations.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    movies: {
      control: 'object',
      description: 'Array of movie objects to display',
    },
    genres: {
      control: 'object',
      description: 'Array of available genres for filtering',
    },
    loading: {
      control: 'boolean',
      description: 'Whether the grid is in loading state',
    },
    onMovieClick: {
      action: 'movie-clicked',
      description: 'Callback fired when a movie is clicked',
    },
    onGenreToggle: {
      action: 'genre-toggled',
      description: 'Callback fired when a genre filter is toggled',
    },
    onGenresClear: {
      action: 'genres-cleared',
      description: 'Callback fired when genre filters are cleared',
    },
    hideGenreFilters: {
      control: 'boolean',
      description: 'Whether to hide genre filter controls',
    },
    viewMode: {
      control: { type: 'select' },
      options: ['grid', 'list'],
      description: 'Display mode for movies',
    },
  },
} satisfies Meta<typeof MovieGrid>;

export default meta;
type Story = StoryObj<typeof meta>;

// Mock genre data
const mockGenres = [
  { id: 28, name: 'Action' },
  { id: 12, name: 'Adventure' },
  { id: 16, name: 'Animation' },
  { id: 35, name: 'Comedy' },
  { id: 80, name: 'Crime' },
  { id: 18, name: 'Drama' },
  { id: 878, name: 'Science Fiction' },
  { id: 53, name: 'Thriller' },
];

// Mock movie data that matches Movie interface
const mockMovies = [
  {
    id: 1,
    title: 'The Dark Knight',
    overview: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham...',
    releaseDate: '2008-07-18',
    posterPath: '/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
    backdropPath: '/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
    voteAverage: 9.0,
    voteCount: 2500000,
    genres: [{ id: 28, name: 'Action' }, { id: 80, name: 'Crime' }, { id: 18, name: 'Drama' }],
    runtime: 152,
    cast: [],
    popularity: 85.5,
  },
  {
    id: 2,
    title: 'Inception',
    overview: 'Dom Cobb is a skilled thief, the absolute best in the dangerous art of extraction...',
    releaseDate: '2010-07-16',
    posterPath: '/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg',
    backdropPath: '/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg',
    voteAverage: 8.8,
    voteCount: 2100000,
    genres: [{ id: 28, name: 'Action' }, { id: 878, name: 'Science Fiction' }, { id: 53, name: 'Thriller' }],
    runtime: 148,
    cast: [],
    popularity: 83.2,
  },
  {
    id: 3,
    title: 'Interstellar',
    overview: 'The adventures of a group of explorers who make use of a newly discovered wormhole...',
    releaseDate: '2014-11-07',
    posterPath: '/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
    backdropPath: '/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
    voteAverage: 8.6,
    voteCount: 1900000,
    genres: [{ id: 18, name: 'Drama' }, { id: 878, name: 'Science Fiction' }, { id: 12, name: 'Adventure' }],
    runtime: 169,
    cast: [],
    popularity: 81.7,
  },
  {
    id: 4,
    title: 'The Avengers',
    overview: 'When an unexpected enemy emerges and threatens global safety and security...',
    releaseDate: '2012-05-04',
    posterPath: '/RYMX2wcKCBAr24UyPD7xwmjaTn.jpg',
    backdropPath: '/RYMX2wcKCBAr24UyPD7xwmjaTn.jpg',
    voteAverage: 8.0,
    voteCount: 2300000,
    genres: [{ id: 28, name: 'Action' }, { id: 12, name: 'Adventure' }, { id: 878, name: 'Science Fiction' }],
    runtime: 143,
    cast: [],
    popularity: 89.1,
  },
  {
    id: 5,
    title: 'Pulp Fiction',
    overview: 'A burger-loving hit man, his philosophical partner, a drug-addled gangster\'s moll...',
    releaseDate: '1994-10-14',
    posterPath: '/dM2w364MScsjFf8pfMbaWUcWrR.jpg',
    backdropPath: '/dM2w364MScsjFf8pfMbaWUcWrR.jpg',
    voteAverage: 8.9,
    voteCount: 2000000,
    genres: [{ id: 80, name: 'Crime' }, { id: 18, name: 'Drama' }],
    runtime: 154,
    cast: [],
    popularity: 78.3,
  },
  {
    id: 6,
    title: 'The Matrix',
    overview: 'Set in the 22nd century, The Matrix tells the story of a computer hacker...',
    releaseDate: '1999-03-31',
    posterPath: '/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg',
    backdropPath: '/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg',
    voteAverage: 8.7,
    voteCount: 1800000,
    genres: [{ id: 28, name: 'Action' }, { id: 878, name: 'Science Fiction' }],
    runtime: 136,
    cast: [],
    popularity: 80.4,
  },
];

// Helper to get subset of movies
const getMovies = (count: number) => mockMovies.slice(0, count);

// Default story
export const Default: Story = {
  args: {
    movies: getMovies(6),
    genres: mockGenres,
    loading: false,
    onMovieClick: action('movie-clicked'),
    onGenreToggle: action('genre-toggled'),
    onGenresClear: action('genres-cleared'),
    hideGenreFilters: false,
    viewMode: 'grid',
  },
};

// Loading state
export const Loading: Story = {
  args: {
    movies: [],
    genres: mockGenres,
    loading: true,
    onMovieClick: action('movie-clicked'),
    onGenreToggle: action('genre-toggled'),
    onGenresClear: action('genres-cleared'),
    hideGenreFilters: false,
    viewMode: 'grid',
  },
  parameters: {
    docs: {
      description: {
        story: 'Movie grid showing loading skeleton placeholders',
      },
    },
  },
};

// Empty state
export const Empty: Story = {
  args: {
    movies: [],
    genres: mockGenres,
    loading: false,
    onMovieClick: action('movie-clicked'),
    onGenreToggle: action('genre-toggled'),
    onGenresClear: action('genres-cleared'),
    hideGenreFilters: false,
    viewMode: 'grid',
  },
  parameters: {
    docs: {
      description: {
        story: 'Movie grid with no movies to display',
      },
    },
  },
};

// List view mode
export const ListView: Story = {
  args: {
    movies: getMovies(4),
    genres: mockGenres,
    loading: false,
    onMovieClick: action('movie-clicked'),
    onGenreToggle: action('genre-toggled'),
    onGenresClear: action('genres-cleared'),
    hideGenreFilters: false,
    viewMode: 'list',
  },
  parameters: {
    docs: {
      description: {
        story: 'Movie grid in list view mode - good for detailed browsing',
      },
    },
  },
};

// With genre filters hidden
export const HiddenGenreFilters: Story = {
  args: {
    movies: getMovies(6),
    genres: mockGenres,
    loading: false,
    onMovieClick: action('movie-clicked'),
    onGenreToggle: action('genre-toggled'),
    onGenresClear: action('genres-cleared'),
    hideGenreFilters: true,
    viewMode: 'grid',
  },
  parameters: {
    docs: {
      description: {
        story: 'Movie grid with genre filters hidden - good for search results',
      },
    },
  },
};

// With selected genres
export const WithSelectedGenres: Story = {
  args: {
    movies: getMovies(4),
    genres: mockGenres,
    selectedGenres: [28, 878], // Action, Science Fiction
    loading: false,
    onMovieClick: action('movie-clicked'),
    onGenreToggle: action('genre-toggled'),
    onGenresClear: action('genres-cleared'),
    hideGenreFilters: false,
    viewMode: 'grid',
  },
  parameters: {
    docs: {
      description: {
        story: 'Movie grid with genre filters applied',
      },
    },
  },
};

// Error state
export const WithError: Story = {
  args: {
    movies: [],
    genres: mockGenres,
    loading: false,
    error: 'Failed to load movies. Please check your internet connection.',
    onMovieClick: action('movie-clicked'),
    onGenreToggle: action('genre-toggled'),
    onGenresClear: action('genres-cleared'),
    hideGenreFilters: false,
    viewMode: 'grid',
  },
  parameters: {
    docs: {
      description: {
        story: 'Movie grid showing error state when API fails',
      },
    },
  },
};