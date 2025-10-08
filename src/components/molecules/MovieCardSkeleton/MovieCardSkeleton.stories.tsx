/**
 * MovieCardSkeleton Stories
 * Storybook documentation for MovieCardSkeleton molecule component
 */

import type { Meta, StoryObj } from '@storybook/react';
import { MovieCardSkeleton } from '../MovieCardSkeleton';

const meta = {
  title: 'Molecules/MovieCardSkeleton',
  component: MovieCardSkeleton,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A loading placeholder component that mimics the structure of a MovieCard. Provides visual feedback while movie data is being fetched.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'compact', 'detailed'],
      description: 'Visual variant that matches different MovieCard variants',
    },
    showRating: {
      control: 'boolean',
      description: 'Whether to show rating skeleton',
    },
    showYear: {
      control: 'boolean',
      description: 'Whether to show year skeleton',
    },
    showGenres: {
      control: 'boolean',
      description: 'Whether to show genres skeleton',
    },
  },
} satisfies Meta<typeof MovieCardSkeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

// Default story
export const Default: Story = {
  args: {
    variant: 'default',
    showRating: true,
    showYear: true,
    showGenres: false,
  },
};

// Different variants
export const Compact: Story = {
  args: {
    variant: 'compact',
    showRating: false,
    showYear: false,
    showGenres: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Compact skeleton for minimal movie cards - just poster and title',
      },
    },
  },
};

export const Detailed: Story = {
  args: {
    variant: 'detailed',
    showRating: true,
    showYear: true,
    showGenres: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Detailed skeleton with all information placeholders including genres and overview',
      },
    },
  },
};

// With different information shown
export const WithRatingOnly: Story = {
  args: {
    variant: 'default',
    showRating: true,
    showYear: false,
    showGenres: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Skeleton showing only poster, title, and rating placeholder',
      },
    },
  },
};

export const WithYearOnly: Story = {
  args: {
    variant: 'default',
    showRating: false,
    showYear: true,
    showGenres: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Skeleton showing only poster, title, and year placeholder',
      },
    },
  },
};

export const WithAllInfo: Story = {
  args: {
    variant: 'default',
    showRating: true,
    showYear: true,
    showGenres: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Skeleton showing all possible information placeholders',
      },
    },
  },
};

// In grid layouts
export const InGrid: Story = {
  render: (args) => (
    <div className="grid grid-cols-3 gap-4 w-full max-w-4xl">
      <MovieCardSkeleton {...args} />
      <MovieCardSkeleton {...args} />
      <MovieCardSkeleton {...args} />
      <MovieCardSkeleton {...args} />
      <MovieCardSkeleton {...args} />
      <MovieCardSkeleton {...args} />
    </div>
  ),
  args: {
    variant: 'default',
    showRating: true,
    showYear: true,
  },
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        story: 'Multiple skeleton cards in a grid layout - typical loading state for movie discovery',
      },
    },
  },
};

export const CompactGrid: Story = {
  render: (args) => (
    <div className="grid grid-cols-4 gap-3 w-full max-w-4xl">
      <MovieCardSkeleton {...args} />
      <MovieCardSkeleton {...args} />
      <MovieCardSkeleton {...args} />
      <MovieCardSkeleton {...args} />
      <MovieCardSkeleton {...args} />
      <MovieCardSkeleton {...args} />
      <MovieCardSkeleton {...args} />
      <MovieCardSkeleton {...args} />
    </div>
  ),
  args: {
    variant: 'compact',
    showRating: false,
    showYear: false,
  },
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        story: 'Compact skeleton cards in a dense grid - good for mobile or quick browsing',
      },
    },
  },
};

export const DetailedList: Story = {
  render: (args) => (
    <div className="space-y-4 w-full max-w-2xl">
      <MovieCardSkeleton {...args} />
      <MovieCardSkeleton {...args} />
      <MovieCardSkeleton {...args} />
      <MovieCardSkeleton {...args} />
    </div>
  ),
  args: {
    variant: 'detailed',
    showRating: true,
    showYear: true,
    showGenres: true,
  },
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        story: 'Detailed skeleton cards in a list layout - good for search results or detailed browsing',
      },
    },
  },
};

// In different contexts
export const InDiscoveryPage: Story = {
  render: (args) => (
    <div className="min-h-screen bg-background p-6">
      <div className="container mx-auto">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Discover Movies</h1>
              <p className="text-muted-foreground mt-1">Loading popular movies...</p>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="w-32 h-10 bg-muted rounded-lg animate-pulse"></div>
              <div className="w-20 h-10 bg-muted rounded-lg animate-pulse"></div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MovieCardSkeleton {...args} />
            <MovieCardSkeleton {...args} />
            <MovieCardSkeleton {...args} />
            <MovieCardSkeleton {...args} />
            <MovieCardSkeleton {...args} />
            <MovieCardSkeleton {...args} />
            <MovieCardSkeleton {...args} />
            <MovieCardSkeleton {...args} />
          </div>
        </div>
      </div>
    </div>
  ),
  args: {
    variant: 'default',
    showRating: true,
    showYear: true,
  },
  parameters: {
    layout: 'fullscreen',
  },
};

export const InSearchResults: Story = {
  render: (args) => (
    <div className="container mx-auto p-6">
      <div className="space-y-6">
        <div className="space-y-2">
          <div className="w-48 h-8 bg-muted rounded animate-pulse"></div>
          <div className="w-64 h-5 bg-muted rounded animate-pulse"></div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-5 bg-muted rounded animate-pulse"></div>
            <div className="flex items-center space-x-2">
              <div className="w-12 h-8 bg-muted rounded animate-pulse"></div>
              <div className="w-12 h-8 bg-muted rounded animate-pulse"></div>
            </div>
          </div>
          
          <div className="w-32 h-10 bg-muted rounded animate-pulse"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <MovieCardSkeleton {...args} />
          <MovieCardSkeleton {...args} />
          <MovieCardSkeleton {...args} />
          <MovieCardSkeleton {...args} />
          <MovieCardSkeleton {...args} />
          <MovieCardSkeleton {...args} />
        </div>
      </div>
    </div>
  ),
  args: {
    variant: 'default',
    showRating: true,
    showYear: true,
  },
  parameters: {
    layout: 'fullscreen',
  },
};

export const InWatchPartySetup: Story = {
  render: (args) => (
    <div className="bg-card border rounded-lg p-6 w-full max-w-2xl">
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-xl font-semibold">Choose a Movie</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Loading movie recommendations...
          </p>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="flex-1 h-10 bg-muted rounded-lg animate-pulse"></div>
            <div className="w-20 h-10 bg-muted rounded-lg animate-pulse"></div>
          </div>
          
          <div className="flex items-center space-x-4 text-sm">
            <span className="text-muted-foreground">Popular choices:</span>
            <div className="w-16 h-6 bg-muted rounded animate-pulse"></div>
            <div className="w-16 h-6 bg-muted rounded animate-pulse"></div>
            <div className="w-16 h-6 bg-muted rounded animate-pulse"></div>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-4">
          <MovieCardSkeleton {...args} />
          <MovieCardSkeleton {...args} />
          <MovieCardSkeleton {...args} />
          <MovieCardSkeleton {...args} />
          <MovieCardSkeleton {...args} />
          <MovieCardSkeleton {...args} />
        </div>
        
        <div className="flex justify-between">
          <div className="w-16 h-10 bg-muted rounded-lg animate-pulse"></div>
          <div className="w-28 h-10 bg-muted rounded-lg animate-pulse"></div>
        </div>
      </div>
    </div>
  ),
  args: {
    variant: 'compact',
    showRating: false,
    showYear: false,
  },
  parameters: {
    layout: 'padded',
  },
};

// Animation showcase
export const AnimationShowcase: Story = {
  render: (args) => (
    <div className="space-y-8 w-full max-w-4xl">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Default Animation</h3>
        <p className="text-sm text-muted-foreground">
          Subtle pulse animation that indicates loading state
        </p>
        <div className="grid grid-cols-3 gap-4">
          <MovieCardSkeleton {...args} />
          <MovieCardSkeleton {...args} />
          <MovieCardSkeleton {...args} />
        </div>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Mixed with Real Content</h3>
        <p className="text-sm text-muted-foreground">
          How skeletons look when mixed with loaded content (progressive loading)
        </p>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-card border rounded-lg p-4">
            <div className="w-full h-48 bg-gradient-to-r from-blue-500 to-purple-600 rounded mb-3"></div>
            <h4 className="font-medium">The Dark Knight</h4>
            <p className="text-sm text-muted-foreground">2008 • ⭐ 9.0</p>
          </div>
          <MovieCardSkeleton {...args} />
          <MovieCardSkeleton {...args} />
        </div>
      </div>
    </div>
  ),
  args: {
    variant: 'default',
    showRating: true,
    showYear: true,
  },
  parameters: {
    layout: 'padded',
  },
};