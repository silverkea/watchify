/**
 * GenreFilter Stories
 * Storybook documentation for GenreFilter molecule component
 */

import type { Meta, StoryObj } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { GenreFilter } from '../../../movie-search/components/GenreFilter';

const meta = {
  title: 'Molecules/GenreFilter',
  component: GenreFilter,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A filter component for selecting movie genres. Allows single or multiple genre selection with visual feedback for active filters.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    genres: {
      control: 'object',
      description: 'Array of available genres to choose from',
    },
    selectedGenres: {
      control: 'object',
      description: 'Array of currently selected genre IDs',
    },
    onGenreToggle: {
      action: 'genre-toggled',
      description: 'Callback fired when a genre is toggled',
    },
    onClear: {
      action: 'genres-cleared',
      description: 'Callback fired when all genres are cleared',
    },
    variant: {
      control: { type: 'select' },
      options: ['dropdown', 'chips', 'sidebar'],
      description: 'Visual variant of the filter',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the filter is disabled',
    },
    loading: {
      control: 'boolean',
      description: 'Whether the filter is loading',
    },
  },
} satisfies Meta<typeof GenreFilter>;

export default meta;
type Story = StoryObj<typeof meta>;

// Mock genre data (based on TMDB genres)
const mockGenres = [
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
  { id: 37, name: 'Western' },
];

// Default story
export const Default: Story = {
  args: {
    genres: mockGenres,
    selectedGenres: [],
    onGenreToggle: action('genre-toggled'),
    onClear: action('genres-cleared'),
    variant: 'dropdown',
  },
};

// With initial selection
export const WithSelection: Story = {
  args: {
    genres: mockGenres,
    selectedGenres: [28, 878, 53], // Action, Sci-Fi, Thriller
    onGenreToggle: action('genre-toggled'),
    onClear: action('genres-cleared'),
    variant: 'dropdown',
  },
  parameters: {
    docs: {
      description: {
        story: 'Genre filter with some genres pre-selected',
      },
    },
  },
};

// Different variants
export const ChipsVariant: Story = {
  args: {
    genres: mockGenres,
    selectedGenres: [35, 10749], // Comedy, Romance
    onGenreToggle: action('genre-toggled'),
    onClear: action('genres-cleared'),
    variant: 'chips',
  },
  parameters: {
    docs: {
      description: {
        story: 'Genre filter using chips/badge design',
      },
    },
  },
};

export const SidebarVariant: Story = {
  args: {
    genres: mockGenres,
    selectedGenres: [18, 27, 53], // Drama, Horror, Thriller
    onGenreToggle: action('genre-toggled'),
    onClear: action('genres-cleared'),
    variant: 'sidebar',
  },
  parameters: {
    docs: {
      description: {
        story: 'Genre filter for sidebar usage with vertical layout',
      },
    },
  },
};

// Different states
export const Loading: Story = {
  args: {
    genres: [],
    selectedGenres: [],
    onGenreToggle: action('genre-toggled'),
    onClear: action('genres-cleared'),
    variant: 'dropdown',
    loading: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Genre filter in loading state while fetching genres',
      },
    },
  },
};

export const Disabled: Story = {
  args: {
    genres: mockGenres,
    selectedGenres: [28, 12],
    onGenreToggle: action('genre-toggled'),
    onClear: action('genres-cleared'),
    variant: 'dropdown',
    disabled: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Disabled genre filter (non-interactive)',
      },
    },
  },
};

// In different contexts
export const InMovieDiscovery = {
  render: (args: any) => (
    <div className="bg-background p-6 rounded-lg border w-full max-w-4xl">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Discover Movies</h2>
          <button className="text-sm text-muted-foreground hover:text-foreground">
            Clear All Filters
          </button>
        </div>
        
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-3">Filter by Genre</h3>
            <GenreFilter {...args} />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
            <div className="bg-card border rounded-lg p-4">
              <div className="w-full h-32 bg-gradient-to-r from-blue-500 to-purple-600 rounded mb-3"></div>
              <h4 className="font-medium">The Avengers</h4>
              <p className="text-sm text-muted-foreground">Action, Adventure</p>
            </div>
            <div className="bg-card border rounded-lg p-4">
              <div className="w-full h-32 bg-gradient-to-r from-green-500 to-blue-500 rounded mb-3"></div>
              <h4 className="font-medium">Interstellar</h4>
              <p className="text-sm text-muted-foreground">Drama, Sci-Fi</p>
            </div>
            <div className="bg-card border rounded-lg p-4">
              <div className="w-full h-32 bg-gradient-to-r from-red-500 to-pink-500 rounded mb-3"></div>
              <h4 className="font-medium">Deadpool</h4>
              <p className="text-sm text-muted-foreground">Action, Comedy</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
  args: {
    genres: mockGenres,
    selectedGenres: [28, 878],
    onGenreToggle: action('genre-toggled'),
    onClear: action('genres-cleared'),
    variant: 'chips',
  },
  parameters: {
    layout: 'padded',
  },
};

// Popular combinations
export const PopularCombinations = {
  render: () => (
    <div className="space-y-8 w-full max-w-4xl">
      <h3 className="text-xl font-semibold">Popular Genre Combinations</h3>
      
      <div className="space-y-6">
        <div className="space-y-3">
          <h4 className="text-lg font-medium">Action Pack</h4>
          <GenreFilter 
            genres={mockGenres}
            selectedGenres={[28, 12, 53]} // Action, Adventure, Thriller
            onGenreToggle={action('action-pack-changed')}
            onClear={action('action-pack-cleared')}
            variant="chips"
          />
        </div>
        
        <div className="space-y-3">
          <h4 className="text-lg font-medium">Date Night</h4>
          <GenreFilter 
            genres={mockGenres}
            selectedGenres={[10749, 35, 18]} // Romance, Comedy, Drama
            onGenreToggle={action('date-night-changed')}
            onClear={action('date-night-cleared')}
            variant="chips"
          />
        </div>
        
        <div className="space-y-3">
          <h4 className="text-lg font-medium">Sci-Fi Collection</h4>
          <GenreFilter 
            genres={mockGenres}
            selectedGenres={[878, 28, 9648]} // Science Fiction, Action, Mystery
            onGenreToggle={action('sci-fi-changed')}
            onClear={action('sci-fi-cleared')}
            variant="chips"
          />
        </div>
        
        <div className="space-y-3">
          <h4 className="text-lg font-medium">Family Fun</h4>
          <GenreFilter 
            genres={mockGenres}
            selectedGenres={[16, 10751, 35]} // Animation, Family, Comedy
            onGenreToggle={action('family-changed')}
            onClear={action('family-cleared')}
            variant="chips"
          />
        </div>
      </div>
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};