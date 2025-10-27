/**
 * SearchBox Stories
 * Storybook documentation for SearchBox molecule component
 */

import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { SearchBox } from './SearchBox';

const meta: Meta<typeof SearchBox> = {
  title: 'Molecules/SearchBox',
  component: SearchBox,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A search input component with debouncing, clear functionality, and loading states for movie discovery.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    placeholder: {
      control: 'text',
      description: 'Placeholder text for the search input',
    },
    debounceMs: {
      control: { type: 'number', min: 0, max: 2000, step: 100 },
      description: 'Debounce delay in milliseconds before triggering search',
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the search input',
    },
    autoFocus: {
      control: 'boolean',
      description: 'Automatically focus the input when component mounts',
    },
    initialValue: {
      control: 'text',
      description: 'Initial value for the search input',
    },
    onSearch: {
      action: 'searched',
      description: 'Callback when search is triggered (debounced)',
    },
    onClear: {
      action: 'cleared',
      description: 'Callback when search is cleared',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Interactive wrapper component for stories
const InteractiveSearchBox = (props: any) => {
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = (query: string) => {
    setIsSearching(true);
    props.onSearch?.(query);
    
    // Simulate search results
    setTimeout(() => {
      const mockResults = [
        `${query} (2023)`,
        `${query}: The Movie`,
        `The ${query} Chronicles`,
        `${query} Returns`,
        `Best of ${query}`
      ];
      setSearchResults(mockResults.slice(0, 3));
      setIsSearching(false);
    }, 500);
  };

  const handleClear = () => {
    setSearchResults([]);
    setIsSearching(false);
    props.onClear?.();
  };

  return (
    <div className="w-full max-w-lg space-y-4">
      <SearchBox
        {...props}
        onSearch={handleSearch}
        onClear={handleClear}
      />
      
      {/* Mock search results */}
      {isSearching && (
        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-sm text-gray-600 dark:text-gray-400">Searching...</span>
          </div>
        </div>
      )}
      
      {!isSearching && searchResults.length > 0 && (
        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
            Search Results:
          </h4>
          <ul className="space-y-1">
            {searchResults.map((result, index) => (
              <li key={index} className="text-sm text-gray-600 dark:text-gray-400">
                • {result}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export const Default: Story = {
  render: (args) => <InteractiveSearchBox {...args} />,
  args: {
    placeholder: 'Search for movies...',
    debounceMs: 300,
  },
};

export const WithInitialValue: Story = {
  render: (args) => <InteractiveSearchBox {...args} />,
  args: {
    placeholder: 'Search for movies...',
    initialValue: 'Batman',
    debounceMs: 300,
  },
  parameters: {
    docs: {
      description: {
        story: 'Search box with an initial value pre-filled.',
      },
    },
  },
};

export const CustomPlaceholder: Story = {
  render: (args) => <InteractiveSearchBox {...args} />,
  args: {
    placeholder: 'Find your next favorite movie...',
    debounceMs: 300,
  },
  parameters: {
    docs: {
      description: {
        story: 'Search box with custom placeholder text.',
      },
    },
  },
};

export const FastDebounce: Story = {
  render: (args) => <InteractiveSearchBox {...args} />,
  args: {
    placeholder: 'Search for movies...',
    debounceMs: 100,
  },
  parameters: {
    docs: {
      description: {
        story: 'Search box with fast debouncing (100ms) for immediate response.',
      },
    },
  },
};

export const SlowDebounce: Story = {
  render: (args) => <InteractiveSearchBox {...args} />,
  args: {
    placeholder: 'Search for movies...',
    debounceMs: 1000,
  },
  parameters: {
    docs: {
      description: {
        story: 'Search box with slow debouncing (1000ms) to reduce API calls.',
      },
    },
  },
};

export const Disabled: Story = {
  args: {
    placeholder: 'Search disabled...',
    disabled: true,
    onSearch: () => {},
  },
  parameters: {
    docs: {
      description: {
        story: 'Disabled search box preventing user interaction.',
      },
    },
  },
};

export const AutoFocus: Story = {
  render: (args) => <InteractiveSearchBox {...args} />,
  args: {
    placeholder: 'Search for movies...',
    autoFocus: true,
    debounceMs: 300,
  },
  parameters: {
    docs: {
      description: {
        story: 'Search box that automatically focuses when the component mounts.',
      },
    },
  },
};

export const NoDebounce: Story = {
  render: (args) => <InteractiveSearchBox {...args} />,
  args: {
    placeholder: 'Search for movies...',
    debounceMs: 0,
  },
  parameters: {
    docs: {
      description: {
        story: 'Search box with no debouncing - searches immediately on every keystroke.',
      },
    },
  },
};

export const AllFeatures: Story = {
  render: () => {
    const AllFeaturesExample = () => {
      const [searchHistory, setSearchHistory] = useState<string[]>([]);
      const [currentQuery, setCurrentQuery] = useState('');

      const handleSearch = (query: string) => {
        setCurrentQuery(query);
        if (query && !searchHistory.includes(query)) {
          setSearchHistory(prev => [query, ...prev.slice(0, 4)]);
        }
      };

      const handleClear = () => {
        setCurrentQuery('');
      };

      return (
        <div className="w-full max-w-2xl space-y-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">Movie Search</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Search with debouncing, clear functionality, and search history
            </p>
          </div>

          <SearchBox
            placeholder="Search for movies, actors, directors..."
            debounceMs={300}
            onSearch={handleSearch}
            onClear={handleClear}
            autoFocus
            className="w-full"
          />

          {currentQuery && (
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                <strong>Current search:</strong> &ldquo;{currentQuery}&rdquo;
              </p>
            </div>
          )}

          {searchHistory.length > 0 && (
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                Recent Searches:
              </h4>
              <div className="flex flex-wrap gap-2">
                {searchHistory.map((query, index) => (
                  <button
                    key={index}
                    onClick={() => handleSearch(query)}
                    className="px-3 py-1 text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 rounded-full hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors"
                  >
                    {query}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      );
    };

    return <AllFeaturesExample />;
  },
  parameters: {
    docs: {
      description: {
        story: 'Complete example with search history and current query display.',
      },
    },
    layout: 'fullscreen',
  },
};

export const ResponsiveLayouts: Story = {
  render: () => (
    <div className="w-full max-w-4xl space-y-8">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">Responsive Search Layouts</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Different search box configurations for various screen sizes
        </p>
      </div>

      {/* Desktop Layout */}
      <div className="space-y-4">
        <h4 className="text-md font-medium">Desktop - Wide Search</h4>
        <div className="flex justify-center">
          <SearchBox
            placeholder="Search the entire movie database..."
            className="w-full max-w-2xl"
            onSearch={() => {}}
          />
        </div>
      </div>

      {/* Tablet Layout */}
      <div className="space-y-4">
        <h4 className="text-md font-medium">Tablet - Medium Search</h4>
        <div className="flex justify-center">
          <SearchBox
            placeholder="Find movies..."
            className="w-full max-w-lg"
            onSearch={() => {}}
          />
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="space-y-4">
        <h4 className="text-md font-medium">Mobile - Compact Search</h4>
        <div className="flex justify-center">
          <SearchBox
            placeholder="Search..."
            className="w-full max-w-xs"
            onSearch={() => {}}
          />
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Responsive search box layouts for different screen sizes.',
      },
    },
    layout: 'fullscreen',
  },
};

export const SearchStates: Story = {
  render: () => {
    const SearchStatesExample = () => {
      const stateExamples = [
        { state: 'idle', label: 'Idle State', placeholder: 'Start typing to search...' },
        { state: 'typing', label: 'Typing State', placeholder: 'Search for movies...', initialValue: 'Batm' },
        { state: 'searching', label: 'Searching State', placeholder: 'Searching...', disabled: true },
        { state: 'results', label: 'With Results', placeholder: 'Search for movies...', initialValue: 'Batman' },
        { state: 'error', label: 'Error State', placeholder: 'Search failed. Try again...' }
      ];

      return (
        <div className="w-full max-w-4xl space-y-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">Search States</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Different states of the search component
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stateExamples.map((example) => (
              <div key={example.state} className="space-y-3">
                <h4 className="text-sm font-medium text-center">{example.label}</h4>
                <SearchBox
                  placeholder={example.placeholder}
                  initialValue={example.initialValue || ''}
                  disabled={example.disabled || false}
                  onSearch={() => {}}
                  className="w-full"
                />
                {example.state === 'results' && (
                  <div className="text-xs text-green-600 dark:text-green-400 text-center">
                    ✓ 42 results found
                  </div>
                )}
                {example.state === 'error' && (
                  <div className="text-xs text-red-600 dark:text-red-400 text-center">
                    ✗ Search failed
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      );
    };

    return <SearchStatesExample />;
  },
  parameters: {
    docs: {
      description: {
        story: 'Various states of the search component including idle, typing, searching, and error states.',
      },
    },
    layout: 'fullscreen',
  },
};

export const KeyboardInteraction: Story = {
  render: () => (
    <div className="w-full max-w-lg space-y-4">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">Keyboard Interactions</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Try these keyboard shortcuts:
        </p>
      </div>

      <SearchBox
        placeholder="Try typing, then press Escape to clear..."
        onSearch={(query) => console.log('Search:', query)}
        onClear={() => console.log('Cleared')}
        autoFocus
      />

      <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
        <div><kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-xs">Enter</kbd> - Submit search</div>
        <div><kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-xs">Escape</kbd> - Clear search</div>
        <div><kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-xs">Click X</kbd> - Clear search</div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates keyboard interactions including Enter to submit and Escape to clear.',
      },
    },
  },
};