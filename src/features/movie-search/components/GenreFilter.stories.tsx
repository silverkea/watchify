/**
 * GenreFilter Stories
 * Storybook documentation for GenreFilter molecule component
 */

import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { GenreFilter } from './GenreFilter';
import type { Genre } from '@/types';

// Mock genre data for stories
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
  { id: 37, name: 'Western' },
];

const meta: Meta<typeof GenreFilter> = {
  title: 'Molecules/GenreFilter',
  component: GenreFilter,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A flexible genre filtering component with multiple display variants (dropdown, chips, sidebar) for movie genre selection.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['dropdown', 'chips', 'sidebar'],
      description: 'Display variant of the genre filter',
    },
    maxSelected: {
      control: { type: 'number', min: 1, max: 10 },
      description: 'Maximum number of genres that can be selected',
    },
    loading: {
      control: 'boolean',
      description: 'Shows loading state',
    },
    disabled: {
      control: 'boolean',
      description: 'Disables all interactions',
    },
    showClearAll: {
      control: 'boolean',
      description: 'Shows clear all button',
    },
    showApplyButton: {
      control: 'boolean',
      description: 'Shows apply button (dropdown variant only)',
    },
    onGenreToggle: {
      action: 'genreToggled',
      description: 'Callback when a genre is selected/deselected',
    },
    onClear: {
      action: 'cleared',
      description: 'Callback when all selections are cleared',
    },
    onApply: {
      action: 'applied',
      description: 'Callback when apply button is clicked',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Interactive wrapper component for stories
const InteractiveGenreFilter = (props: any) => {
  const [selectedGenres, setSelectedGenres] = useState<number[]>([]);

  const handleGenreToggle = (genreId: number) => {
    setSelectedGenres(prev => 
      prev.includes(genreId)
        ? prev.filter(id => id !== genreId)
        : [...prev, genreId]
    );
    props.onGenreToggle?.(genreId);
  };

  const handleClear = () => {
    setSelectedGenres([]);
    props.onClear?.();
  };

  return (
    <GenreFilter
      {...props}
      genres={mockGenres}
      selectedGenres={selectedGenres}
      onGenreToggle={handleGenreToggle}
      onClear={handleClear}
    />
  );
};

export const Dropdown: Story = {
  render: (args) => <InteractiveGenreFilter {...args} />,
  args: {
    variant: 'dropdown',
    maxSelected: 5,
    showClearAll: true,
    showApplyButton: false,
  },
};

export const Chips: Story = {
  render: (args) => <InteractiveGenreFilter {...args} />,
  args: {
    variant: 'chips',
    maxSelected: 5,
    showClearAll: true,
  },
};

export const Sidebar: Story = {
  render: (args) => <InteractiveGenreFilter {...args} />,
  args: {
    variant: 'sidebar',
    maxSelected: 5,
    showClearAll: true,
  },
};

export const DropdownWithApply: Story = {
  render: (args) => <InteractiveGenreFilter {...args} />,
  args: {
    variant: 'dropdown',
    maxSelected: 5,
    showClearAll: true,
    showApplyButton: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Dropdown variant with apply button for deferred filtering.',
      },
    },
  },
};

export const LimitedSelection: Story = {
  render: (args) => <InteractiveGenreFilter {...args} />,
  args: {
    variant: 'chips',
    maxSelected: 3,
    showClearAll: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Genre filter with limited selection (3 maximum) showing disabled state for unselected genres.',
      },
    },
  },
};

export const Disabled: Story = {
  render: (args) => <InteractiveGenreFilter {...args} />,
  args: {
    variant: 'chips',
    disabled: true,
    maxSelected: 5,
  },
  parameters: {
    docs: {
      description: {
        story: 'Disabled state preventing all interactions.',
      },
    },
  },
};

export const Loading: Story = {
  render: (args) => <InteractiveGenreFilter {...args} />,
  args: {
    variant: 'dropdown',
    loading: true,
    maxSelected: 5,
  },
  parameters: {
    docs: {
      description: {
        story: 'Loading state while genres are being fetched.',
      },
    },
  },
};

export const PreSelected: Story = {
  args: {
    variant: 'chips',
    genres: mockGenres,
    selectedGenres: [28, 35, 18], // Action, Comedy, Drama
    maxSelected: 5,
    showClearAll: true,
    onGenreToggle: () => {},
    onClear: () => {},
  },
  parameters: {
    docs: {
      description: {
        story: 'Genre filter with pre-selected genres.',
      },
    },
  },
};

export const AllVariants: Story = {
  render: () => {
    const AllVariantsExample = () => {
      const [dropdownSelected, setDropdownSelected] = useState<number[]>([28, 35]);
      const [chipsSelected, setChipsSelected] = useState<number[]>([18, 27, 53]);
      const [sidebarSelected, setSidebarSelected] = useState<number[]>([12, 14]);

      return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full max-w-6xl">
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Dropdown Variant</h3>
            <GenreFilter
              variant="dropdown"
              genres={mockGenres}
              selectedGenres={dropdownSelected}
              onGenreToggle={(id) => setDropdownSelected(prev => 
                prev.includes(id) ? prev.filter(gId => gId !== id) : [...prev, id]
              )}
              onClear={() => setDropdownSelected([])}
              maxSelected={5}
              showClearAll={true}
            />
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Chips Variant</h3>
            <GenreFilter
              variant="chips"
              genres={mockGenres}
              selectedGenres={chipsSelected}
              onGenreToggle={(id) => setChipsSelected(prev => 
                prev.includes(id) ? prev.filter(gId => gId !== id) : [...prev, id]
              )}
              onClear={() => setChipsSelected([])}
              maxSelected={5}
              showClearAll={true}
            />
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Sidebar Variant</h3>
            <GenreFilter
              variant="sidebar"
              genres={mockGenres}
              selectedGenres={sidebarSelected}
              onGenreToggle={(id) => setSidebarSelected(prev => 
                prev.includes(id) ? prev.filter(gId => gId !== id) : [...prev, id]
              )}
              onClear={() => setSidebarSelected([])}
              maxSelected={5}
              showClearAll={true}
            />
          </div>
        </div>
      );
    };

    return <AllVariantsExample />;
  },
  parameters: {
    docs: {
      description: {
        story: 'All genre filter variants displayed together for comparison.',
      },
    },
    layout: 'fullscreen',
  },
};

export const MovieDiscoveryExample: Story = {
  render: () => {
    const MovieDiscoveryExampleComponent = () => {
      const [selectedGenres, setSelectedGenres] = useState<number[]>([28, 878]); // Action, Sci-Fi

      return (
        <div className="max-w-4xl mx-auto p-6 bg-gray-50 dark:bg-gray-900 rounded-lg">
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Discover Movies
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Filter by your favorite genres to find the perfect movie
              </p>
            </div>

            <GenreFilter
              variant="chips"
              genres={mockGenres}
              selectedGenres={selectedGenres}
              onGenreToggle={(id) => setSelectedGenres(prev => 
                prev.includes(id) ? prev.filter(gId => gId !== id) : [...prev, id]
              )}
              onClear={() => setSelectedGenres([])}
              maxSelected={3}
              showClearAll={true}
              className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700"
            />

            <div className="text-center text-sm text-gray-500 dark:text-gray-400">
              {selectedGenres.length > 0 
                ? `Filtering by ${selectedGenres.length} genre${selectedGenres.length > 1 ? 's' : ''}`
                : 'Select genres to filter movies'
              }
            </div>
          </div>
        </div>
      );
    };

    return <MovieDiscoveryExampleComponent />;
  },
  parameters: {
    docs: {
      description: {
        story: 'Real-world example showing genre filter in a movie discovery context.',
      },
    },
    layout: 'fullscreen',
  },
};

export const ResponsiveLayout: Story = {
  render: () => {
    const ResponsiveLayoutComponent = () => {
      const [selectedGenres, setSelectedGenres] = useState<number[]>([35, 18]);

      return (
        <div className="w-full max-w-4xl mx-auto p-4">
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-center">Responsive Genre Filter</h3>
            
            {/* Desktop: Chips variant */}
            <div className="hidden md:block">
              <GenreFilter
                variant="chips"
                genres={mockGenres}
                selectedGenres={selectedGenres}
                onGenreToggle={(id) => setSelectedGenres(prev => 
                  prev.includes(id) ? prev.filter(gId => gId !== id) : [...prev, id]
                )}
                onClear={() => setSelectedGenres([])}
                maxSelected={5}
                showClearAll={true}
              />
            </div>

            {/* Mobile: Dropdown variant */}
            <div className="md:hidden">
              <GenreFilter
                variant="dropdown"
                genres={mockGenres}
                selectedGenres={selectedGenres}
                onGenreToggle={(id) => setSelectedGenres(prev => 
                  prev.includes(id) ? prev.filter(gId => gId !== id) : [...prev, id]
                )}
                onClear={() => setSelectedGenres([])}
                maxSelected={5}
                showClearAll={true}
              />
            </div>

            <div className="text-center text-sm text-gray-500 dark:text-gray-400">
              Desktop: Chips layout | Mobile: Dropdown layout
            </div>
          </div>
        </div>
      );
    };

    return <ResponsiveLayoutComponent />;
  },
  parameters: {
    docs: {
      description: {
        story: 'Responsive example showing different variants for different screen sizes.',
      },
    },
    layout: 'fullscreen',
  },
};