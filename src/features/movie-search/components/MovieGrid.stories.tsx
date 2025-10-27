/**
 * MovieGrid Stories
 * Comprehensive Storybook documentation for MovieGrid organism component
 */

import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { MovieGrid } from './MovieGrid';
import { Movie, Genre } from '@/types';

// Mock data
const mockGenres: Genre[] = [
  { id: 28, name: 'Action' },
  { id: 12, name: 'Adventure' },
  { id: 16, name: 'Animation' },
  { id: 35, name: 'Comedy' },
  { id: 80, name: 'Crime' },
  { id: 99, name: 'Documentary' },
  { id: 18, name: 'Drama' },
  { id: 10751, name: 'Family' },
  { id: 14, name: 'Fantasy' },
  { id: 36, name: 'History' },
  { id: 27, name: 'Horror' },
  { id: 10402, name: 'Music' },
  { id: 9648, name: 'Mystery' },
  { id: 10749, name: 'Romance' },
  { id: 878, name: 'Science Fiction' },
  { id: 10770, name: 'TV Movie' },
  { id: 53, name: 'Thriller' },
  { id: 10752, name: 'War' },
  { id: 37, name: 'Western' }
];

const mockMovies: Movie[] = [
  {
    id: 550,
    title: 'Fight Club',
    overview: 'A ticking-time-bomb insomniac and a slippery soap salesman channel primal male aggression into a shocking new form of therapy.',
    posterPath: '/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg',
    backdropPath: '/hZkgoQYus5vegHoetLkCJzb17zJ.jpg',
    releaseDate: '1999-10-15',
    genres: [{ id: 18, name: 'Drama' }, { id: 53, name: 'Thriller' }],
    voteAverage: 8.433,
    voteCount: 26280,
    runtime: 139,
    cast: [],
    popularity: 61.416
  },
  {
    id: 238,
    title: 'The Godfather',
    overview: 'Spanning the years 1945 to 1955, a chronicle of the fictional Italian-American Corleone crime family.',
    posterPath: '/3bhkrj58Vtu7enYsRolD1fZdja1.jpg',
    backdropPath: '/tmU7GeKVybMWFButWEGl2M4GeiP.jpg',
    releaseDate: '1972-03-14',
    genres: [{ id: 18, name: 'Drama' }, { id: 80, name: 'Crime' }],
    voteAverage: 8.7,
    voteCount: 19124,
    runtime: 175,
    cast: [],
    popularity: 131.476
  },
  {
    id: 424,
    title: "Schindler's List",
    overview: 'The true story of how businessman Oskar Schindler saved over a thousand Jewish lives.',
    posterPath: '/sF1U4EUQS8YHUYjNl3pMGNIQyr0.jpg',
    backdropPath: '/zb6fM1CX41D9rF9hdgclu0peUmy.jpg',
    releaseDate: '1993-12-15',
    genres: [{ id: 18, name: 'Drama' }, { id: 36, name: 'History' }, { id: 10752, name: 'War' }],
    voteAverage: 8.6,
    voteCount: 14472,
    runtime: 195,
    cast: [],
    popularity: 50.417
  },
  {
    id: 680,
    title: 'Pulp Fiction',
    overview: 'A burger-loving hit man, his philosophical partner, and a drug-addled gangster\'s moll.',
    posterPath: '/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg',
    backdropPath: '/4cDFJr4HnXN5AdPw4AKrmLlMWdO.jpg',
    releaseDate: '1994-09-10',
    genres: [{ id: 53, name: 'Thriller' }, { id: 80, name: 'Crime' }],
    voteAverage: 8.5,
    voteCount: 26670,
    runtime: 154,
    cast: [],
    popularity: 65.107
  },
  {
    id: 13,
    title: 'Forrest Gump',
    overview: 'A man with a low IQ has accomplished great things in his life.',
    posterPath: '/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg',
    backdropPath: '/7c4UlEeNfWynhYIeOYLTbVvnUcm1.jpg',
    releaseDate: '1994-06-23',
    genres: [{ id: 35, name: 'Comedy' }, { id: 18, name: 'Drama' }, { id: 10749, name: 'Romance' }],
    voteAverage: 8.5,
    voteCount: 25913,
    runtime: 142,
    cast: [],
    popularity: 59.895
  },
  {
    id: 278,
    title: 'The Shawshank Redemption',
    overview: 'Two imprisoned men bond over a number of years, finding solace and eventual redemption.',
    posterPath: '/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg',
    backdropPath: '/iNh3BivHyg5sQRPP1KOkzguEX0H.jpg',
    releaseDate: '1994-09-23',
    genres: [{ id: 18, name: 'Drama' }, { id: 80, name: 'Crime' }],
    voteAverage: 8.7,
    voteCount: 24871,
    runtime: 142,
    cast: [],
    popularity: 88.55
  },
  {
    id: 19404,
    title: 'Dilwale Dulhania Le Jayenge',
    overview: 'Raj and Simran meet during a trip across Europe and fall in love.',
    posterPath: '/ktejodbcdCPXbMMdnpI9BUxW6O8.jpg',
    backdropPath: '/90ez6ArvpO8bvpyIngBuwXOqJm5.jpg',
    releaseDate: '1995-10-20',
    genres: [{ id: 35, name: 'Comedy' }, { id: 18, name: 'Drama' }, { id: 10749, name: 'Romance' }],
    voteAverage: 8.7,
    voteCount: 4308,
    runtime: 190,
    cast: [],
    popularity: 34.357
  },
  {
    id: 389,
    title: '12 Angry Men',
    overview: 'The defense and the prosecution have rested and the jury is filing into the jury room.',
    posterPath: '/ow3wq89wM8qd5X7hWKxiRfsFf9C.jpg',
    backdropPath: '/qqHQsStV6exghCM7zbObuYBiYxw.jpg',
    releaseDate: '1957-04-10',
    genres: [{ id: 18, name: 'Drama' }],
    voteAverage: 8.5,
    voteCount: 7954,
    runtime: 96,
    cast: [],
    popularity: 42.611
  }
];

// Interactive wrapper for stateful examples
function InteractiveMovieGrid({ 
  initialGenres = [], 
  initialViewMode = 'grid' as const,
  ...props 
}: any) {
  const [selectedGenres, setSelectedGenres] = React.useState<number[]>(initialGenres);
  const [viewMode, setViewMode] = React.useState<'grid' | 'list'>(initialViewMode);
  
  const handleGenreToggle = (genreId: number) => {
    setSelectedGenres(prev => 
      prev.includes(genreId) 
        ? prev.filter(id => id !== genreId)
        : [...prev, genreId]
    );
  };
  
  const handleGenresClear = () => {
    setSelectedGenres([]);
  };
  
  const handleViewModeChange = (mode: 'grid' | 'list') => {
    setViewMode(mode);
  };
  
  return (
    <MovieGrid
      {...props}
      selectedGenres={selectedGenres}
      viewMode={viewMode}
      onGenreToggle={handleGenreToggle}
      onGenresClear={handleGenresClear}
      onViewModeChange={handleViewModeChange}
    />
  );
}

const meta: Meta<typeof MovieGrid> = {
  title: 'Organisms/MovieGrid',
  component: MovieGrid,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'The MovieGrid organism is a complex component that displays a responsive grid of movie cards with filtering, view mode switching, and pagination capabilities. It combines multiple molecules (MovieCard, GenreFilter) and atoms (Button) to create a comprehensive movie browsing interface.',
      },
    },
  },
  argTypes: {
    movies: {
      description: 'Array of movie objects to display',
      control: { type: 'object' }
    },
    genres: {
      description: 'Array of available genres for filtering',
      control: { type: 'object' }
    },
    loading: {
      description: 'Loading state indicator',
      control: { type: 'boolean' }
    },
    error: {
      description: 'Error message to display',
      control: { type: 'text' }
    },
    hasMore: {
      description: 'Whether more movies can be loaded',
      control: { type: 'boolean' }
    },
    selectedGenres: {
      description: 'Currently selected genre IDs',
      control: { type: 'object' }
    },
    hideGenreFilters: {
      description: 'Hide the genre filter controls',
      control: { type: 'boolean' }
    },
    viewMode: {
      description: 'Display mode for movies',
      control: { type: 'select' },
      options: ['grid', 'list']
    },
    onMovieClick: { action: 'movie-clicked' },
    onLoadMore: { action: 'load-more-clicked' },
    onGenreToggle: { action: 'genre-toggled' },
    onGenresClear: { action: 'genres-cleared' },
    onViewModeChange: { action: 'view-mode-changed' }
  },
  args: {
    movies: mockMovies,
    genres: mockGenres,
    loading: false,
    error: null,
    hasMore: false,
    selectedGenres: [],
    hideGenreFilters: false,
    viewMode: 'grid',
    onMovieClick: (movie) => console.log('Movie clicked:', movie),
    onLoadMore: () => console.log('Load more clicked'),
    onGenreToggle: (genreId) => console.log('Genre toggled:', genreId),
    onGenresClear: () => console.log('Genres cleared'),
    onViewModeChange: (mode) => console.log('View mode changed:', mode)
  }
};

export default meta;
type Story = StoryObj<typeof MovieGrid>;

// Basic Examples
export const Default: Story = {
  name: 'Default Grid View',
  args: {},
};

export const ListView: Story = {
  name: 'List View Mode',
  args: {
    viewMode: 'list'
  },
};

export const WithSelectedGenres: Story = {
  name: 'With Pre-selected Genres',
  args: {
    selectedGenres: [18, 80] // Drama and Crime
  },
};

export const WithoutGenreFilters: Story = {
  name: 'Hidden Genre Filters',
  args: {
    hideGenreFilters: true
  },
};

// Loading States
export const InitialLoading: Story = {
  name: 'Initial Loading State',
  args: {
    movies: [],
    loading: true
  },
};

export const LoadingMoreMovies: Story = {
  name: 'Loading More Movies',
  args: {
    loading: true,
    hasMore: true
  },
};

// Error States
export const ErrorState: Story = {
  name: 'Error State',
  args: {
    error: 'Failed to load movies. Please check your connection and try again.'
  },
};

export const NetworkError: Story = {
  name: 'Network Error',
  args: {
    error: 'Network request failed. Please check your internet connection.'
  },
};

// Empty States
export const NoMovies: Story = {
  name: 'No Movies Found',
  args: {
    movies: []
  },
};

export const NoMoviesWithGenreFilter: Story = {
  name: 'No Movies (Filtered)',
  args: {
    movies: [],
    selectedGenres: [27, 53] // Horror and Thriller
  },
};

export const CustomEmptyState: Story = {
  name: 'Custom Empty State',
  args: {
    movies: [],
    emptyState: (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🎬</div>
        <h3 className="text-xl font-semibold mb-2">No movies in your watchlist</h3>
        <p className="text-gray-600">Start adding movies to see them here!</p>
      </div>
    )
  },
};

// Pagination
export const WithPagination: Story = {
  name: 'With Load More Button',
  args: {
    hasMore: true
  },
};

// Grid Layouts
export const CompactGrid: Story = {
  name: 'Compact Grid Layout',
  args: {
    gridCols: { sm: 3, md: 4, lg: 6, xl: 8 }
  },
};

export const LargeGrid: Story = {
  name: 'Large Grid Layout',
  args: {
    gridCols: { sm: 1, md: 2, lg: 3, xl: 4 }
  },
};

// Interactive Examples
export const InteractiveGenreFiltering: Story = {
  name: '🎮 Interactive Genre Filtering',
  render: (args) => <InteractiveMovieGrid {...args} />,
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'Try selecting different genres to see how the filtering works. The grid updates dynamically based on your selections.',
      },
    },
  },
};

export const InteractiveViewModes: Story = {
  name: '🎮 Interactive View Modes',
  render: (args) => <InteractiveMovieGrid {...args} />,
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'Switch between grid and list view modes using the toggle buttons. Notice how the MovieCard components adapt to different layouts.',
      },
    },
  },
};

export const InteractiveWithPreselectedGenres: Story = {
  name: '🎮 Interactive with Preselected Genres',
  render: (args) => <InteractiveMovieGrid {...args} initialGenres={[18, 80]} />,
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'This example starts with Drama and Crime genres selected. Try adding or removing genres to see the filtering in action.',
      },
    },
  },
};

// Edge Cases
export const SingleMovie: Story = {
  name: 'Single Movie',
  args: {
    movies: [mockMovies[0]]
  },
};

export const ManyMovies: Story = {
  name: 'Many Movies (Performance Test)',
  args: {
    movies: [
      ...mockMovies,
      ...mockMovies.map((m, i) => ({ ...m, id: m.id + 1000 + i, title: `${m.title} - Copy ${i + 1}` })),
      ...mockMovies.map((m, i) => ({ ...m, id: m.id + 2000 + i, title: `${m.title} - Copy ${i + 9}` })),
    ]
  },
};

export const MoviesWithMissingPosters: Story = {
  name: 'Movies with Missing Posters',
  args: {
    movies: mockMovies.map((movie, index) => ({
      ...movie,
      posterPath: index % 3 === 0 ? null : movie.posterPath // Remove every 3rd poster
    }))
  },
};

// Responsive Examples
export const ResponsiveBehavior: Story = {
  name: '📱 Responsive Grid Layout',
  args: {},
  parameters: {
    viewport: {
      viewports: {
        mobile: { name: 'Mobile', styles: { width: '375px', height: '667px' } },
        tablet: { name: 'Tablet', styles: { width: '768px', height: '1024px' } },
        desktop: { name: 'Desktop', styles: { width: '1200px', height: '800px' } }
      },
      defaultViewport: 'mobile'
    },
    docs: {
      description: {
        story: 'Test the responsive behavior by switching between different viewport sizes using the toolbar. The grid adapts from 2 columns on mobile to 6 columns on large screens.',
      },
    },
  },
};

// Real-world Scenarios
export const MovieDiscoveryScenario: Story = {
  name: '🎬 Movie Discovery Scenario',
  render: (args) => <InteractiveMovieGrid {...args} />,
  args: {
    hasMore: true
  },
  parameters: {
    docs: {
      description: {
        story: 'A realistic movie discovery scenario with genre filtering, view mode switching, and pagination. This demonstrates how users would interact with the component in a real application.',
      },
    },
  },
};

export const FilteredResultsScenario: Story = {
  name: '🎬 Filtered Results Scenario',
  render: (args) => <InteractiveMovieGrid {...args} initialGenres={[18]} />,
  args: {
    movies: mockMovies.slice(0, 4) // Fewer movies to simulate filtered results
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows a typical filtered results scenario where users have selected specific genres and see a refined set of movies.',
      },
    },
  },
};