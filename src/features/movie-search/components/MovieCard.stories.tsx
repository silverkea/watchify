/**
 * MovieCard Stories
 * Storybook documentation for MovieCard molecule component
 */

import type { Meta, StoryObj } from '@storybook/react';
import { MovieCard } from './MovieCard';
import type { Movie } from '@/types';

// Mock movie data for stories
const createMockMovie = (overrides: Partial<Movie> = {}): Movie => ({
  id: 550,
  title: 'Fight Club',
  overview: 'A ticking-time-bomb insomniac and a slippery soap salesman channel primal male aggression into a shocking new form of therapy. Their concept catches on, with underground "fight clubs" forming in every town, until an eccentric gets in the way and ignites an out-of-control spiral toward oblivion.',
  releaseDate: '1999-10-15',
  posterPath: '/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg',
  backdropPath: '/hZkgoQYus5vegHoetLkCJzb17zJ.jpg',
  voteAverage: 8.4,
  voteCount: 26280,
  genres: [
    { id: 18, name: 'Drama' },
    { id: 53, name: 'Thriller' },
    { id: 35, name: 'Comedy' }
  ],
  runtime: 139,
  cast: [
    { id: 287, name: 'Brad Pitt', character: 'Tyler Durden', profilePath: '/ajNaPmXVVMJFg9GWmu6MJzTaXdV.jpg', order: 0 },
    { id: 819, name: 'Edward Norton', character: 'The Narrator', profilePath: '/5XBzD5WuTyVQZeS4VI25z2moMeY.jpg', order: 1 }
  ],
  popularity: 0.5,
  ...overrides
});

const mockMovies = {
  fightClub: createMockMovie(),
  inception: createMockMovie({
    id: 27205,
    title: 'Inception',
    overview: 'Dom Cobb is a skilled thief, the absolute best in the dangerous art of extraction, stealing valuable secrets from deep within the subconscious during the dream state, when the mind is at its most vulnerable.',
    releaseDate: '2010-07-16',
    posterPath: '/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg',
    voteAverage: 8.8,
    genres: [
      { id: 28, name: 'Action' },
      { id: 878, name: 'Science Fiction' },
      { id: 53, name: 'Thriller' }
    ],
    runtime: 148
  }),
  shortTitle: createMockMovie({
    id: 1,
    title: 'Up',
    overview: 'Carl Fredricksen spent his entire life dreaming of exploring the globe and experiencing life to its fullest. But at age 78, life seems to have passed him by, until a twist of fate (and a persistent 8-year old Wilderness Explorer named Russell) gives him a new lease on life.',
    posterPath: '/b0PLxWEVzNGVkLjnU1Zy1BEwKe5.jpg',
    genres: [{ id: 16, name: 'Animation' }, { id: 10751, name: 'Family' }],
    runtime: 96,
    voteAverage: 8.0
  }),
  longTitle: createMockMovie({
    id: 2,
    title: 'The Incredibly Long and Unnecessarily Detailed Movie Title That Goes On and On Forever',
    overview: 'A very short overview.',
    posterPath: '/example.jpg',
    genres: [{ id: 35, name: 'Comedy' }],
    runtime: 120,
    voteAverage: 6.5
  }),
  noPoster: createMockMovie({
    id: 3,
    title: 'No Poster Movie',
    posterPath: null,
    genres: [{ id: 27, name: 'Horror' }],
    runtime: 90,
    voteAverage: 7.2
  }),
  noGenres: createMockMovie({
    id: 4,
    title: 'Genreless Movie',
    genres: [],
    runtime: 85,
    voteAverage: 5.8
  }),
  lowRating: createMockMovie({
    id: 5,
    title: 'Low Rated Movie',
    voteAverage: 2.1,
    genres: [{ id: 27, name: 'Horror' }],
    runtime: 75
  }),
  noRuntime: createMockMovie({
    id: 6,
    title: 'No Runtime Movie',
    runtime: null,
    genres: [{ id: 99, name: 'Documentary' }],
    voteAverage: 7.8
  }),
  manyGenres: createMockMovie({
    id: 7,
    title: 'Genre Heavy Movie',
    genres: [
      { id: 28, name: 'Action' },
      { id: 12, name: 'Adventure' },
      { id: 35, name: 'Comedy' },
      { id: 18, name: 'Drama' },
      { id: 14, name: 'Fantasy' },
      { id: 878, name: 'Science Fiction' }
    ],
    voteAverage: 8.5,
    runtime: 180
  })
};

const meta: Meta<typeof MovieCard> = {
  title: 'Molecules/MovieCard',
  component: MovieCard,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A versatile movie card component with multiple variants (default, compact, featured) for displaying movie information including poster, title, rating, and metadata.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'compact', 'featured'],
      description: 'Visual style variant of the movie card',
    },
    showGenres: {
      control: 'boolean',
      description: 'Show genre badges',
    },
    showRating: {
      control: 'boolean',
      description: 'Show movie rating',
    },
    showRuntime: {
      control: 'boolean',
      description: 'Show movie runtime',
    },
    priority: {
      control: 'boolean',
      description: 'Image loading priority for above-the-fold content',
    },
    onClick: {
      action: 'movieClicked',
      description: 'Callback when movie card is clicked',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    movie: mockMovies.fightClub,
    variant: 'default',
    showGenres: true,
    showRating: true,
    showRuntime: true,
  },
};

export const Compact: Story = {
  args: {
    movie: mockMovies.inception,
    variant: 'compact',
    showGenres: true,
    showRating: true,
    showRuntime: false,
  },
};

export const Featured: Story = {
  args: {
    movie: mockMovies.inception,
    variant: 'featured',
    showGenres: true,
    showRating: true,
    showRuntime: true,
  },
};

export const WithoutGenres: Story = {
  args: {
    movie: mockMovies.fightClub,
    showGenres: false,
    showRating: true,
    showRuntime: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Movie card without genre badges displayed.',
      },
    },
  },
};

export const WithoutRating: Story = {
  args: {
    movie: mockMovies.fightClub,
    showGenres: true,
    showRating: false,
    showRuntime: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Movie card without rating badge.',
      },
    },
  },
};

export const WithoutRuntime: Story = {
  args: {
    movie: mockMovies.fightClub,
    showGenres: true,
    showRating: true,
    showRuntime: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Movie card without runtime information.',
      },
    },
  },
};

export const Clickable: Story = {
  args: {
    movie: mockMovies.fightClub,
    showGenres: true,
    showRating: true,
    showRuntime: true,
    onClick: (movie) => console.log('Clicked movie:', movie.title),
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive movie card with click handler and hover effects.',
      },
    },
  },
};

export const NoPoster: Story = {
  args: {
    movie: mockMovies.noPoster,
    showGenres: true,
    showRating: true,
    showRuntime: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Movie card handling missing poster image with skeleton placeholder.',
      },
    },
  },
};

export const NoGenres: Story = {
  args: {
    movie: mockMovies.noGenres,
    showGenres: true,
    showRating: true,
    showRuntime: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Movie card with no genre information available.',
      },
    },
  },
};

export const LowRating: Story = {
  args: {
    movie: mockMovies.lowRating,
    showGenres: true,
    showRating: true,
    showRuntime: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Movie card displaying a low rating score.',
      },
    },
  },
};

export const NoRuntime: Story = {
  args: {
    movie: mockMovies.noRuntime,
    showGenres: true,
    showRating: true,
    showRuntime: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Movie card handling missing runtime information.',
      },
    },
  },
};

export const LongTitle: Story = {
  args: {
    movie: mockMovies.longTitle,
    showGenres: true,
    showRating: true,
    showRuntime: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Movie card with a very long title showing text truncation.',
      },
    },
  },
};

export const ManyGenres: Story = {
  args: {
    movie: mockMovies.manyGenres,
    showGenres: true,
    showRating: true,
    showRuntime: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Movie card with many genres showing overflow handling (+N indicator).',
      },
    },
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-center">Default Variant</h3>
        <MovieCard
          movie={mockMovies.fightClub}
          variant="default"
          showGenres={true}
          showRating={true}
          showRuntime={true}
        />
      </div>
      
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-center">Featured Variant</h3>
        <MovieCard
          movie={mockMovies.inception}
          variant="featured"
          showGenres={true}
          showRating={true}
          showRuntime={true}
        />
      </div>
      
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-center">Compact Variant</h3>
        <div className="space-y-2">
          <MovieCard
            movie={mockMovies.shortTitle}
            variant="compact"
            showGenres={true}
            showRating={true}
          />
          <MovieCard
            movie={mockMovies.inception}
            variant="compact"
            showGenres={true}
            showRating={true}
          />
          <MovieCard
            movie={mockMovies.fightClub}
            variant="compact"
            showGenres={true}
            showRating={true}
          />
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'All movie card variants displayed together for comparison.',
      },
    },
    layout: 'fullscreen',
  },
};

export const EdgeCases: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-6xl">
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-gray-600">No Poster</h4>
        <MovieCard movie={mockMovies.noPoster} />
      </div>
      
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-gray-600">No Genres</h4>
        <MovieCard movie={mockMovies.noGenres} />
      </div>
      
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-gray-600">Low Rating</h4>
        <MovieCard movie={mockMovies.lowRating} />
      </div>
      
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-gray-600">No Runtime</h4>
        <MovieCard movie={mockMovies.noRuntime} />
      </div>
      
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-gray-600">Long Title</h4>
        <MovieCard movie={mockMovies.longTitle} />
      </div>
      
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-gray-600">Many Genres</h4>
        <MovieCard movie={mockMovies.manyGenres} />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Edge cases and data variations showing how the component handles different scenarios.',
      },
    },
    layout: 'fullscreen',
  },
};

export const MovieGridExample: Story = {
  render: () => (
    <div className="w-full max-w-6xl mx-auto p-6 bg-gray-50 dark:bg-gray-900 rounded-lg">
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Popular Movies
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Click on any movie to view details
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[
            mockMovies.fightClub,
            mockMovies.inception,
            mockMovies.shortTitle,
            mockMovies.manyGenres,
            mockMovies.lowRating,
            mockMovies.noRuntime,
            mockMovies.noPoster,
            mockMovies.longTitle
          ].map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              onClick={(movie) => console.log('Viewing movie:', movie.title)}
              showGenres={true}
              showRating={true}
              showRuntime={true}
            />
          ))}
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Real-world example showing movie cards in a grid layout with interactive functionality.',
      },
    },
    layout: 'fullscreen',
  },
};

export const ResponsiveLayout: Story = {
  render: () => (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-center">Responsive Movie Cards</h3>
        
        {/* Desktop: Default cards in grid */}
        <div className="hidden md:block">
          <h4 className="text-sm font-medium text-gray-600 mb-4">Desktop: Grid Layout</h4>
          <div className="grid grid-cols-3 gap-4">
            <MovieCard movie={mockMovies.fightClub} />
            <MovieCard movie={mockMovies.inception} />
            <MovieCard movie={mockMovies.shortTitle} />
          </div>
        </div>

        {/* Mobile: Compact cards */}
        <div className="md:hidden">
          <h4 className="text-sm font-medium text-gray-600 mb-4">Mobile: Compact Layout</h4>
          <div className="space-y-3">
            <MovieCard movie={mockMovies.fightClub} variant="compact" />
            <MovieCard movie={mockMovies.inception} variant="compact" />
            <MovieCard movie={mockMovies.shortTitle} variant="compact" />
          </div>
        </div>

        <div className="text-center text-sm text-gray-500 dark:text-gray-400">
          Desktop: Grid of default cards | Mobile: Stack of compact cards
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Responsive example showing different layouts for different screen sizes.',
      },
    },
    layout: 'fullscreen',
  },
};