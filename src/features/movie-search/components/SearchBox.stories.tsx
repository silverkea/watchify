/**
 * SearchBox Stories
 * Storybook documentation for SearchBox molecule component
 */

import type { Meta, StoryObj } from '@storybook/react';
import { SearchBox } from './SearchBox';

const meta = {
  title: 'Molecules/SearchBox',
  component: SearchBox,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A search input component with debounced searching and loading states.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    placeholder: {
      control: { type: 'text' },
      description: 'Placeholder text for the search input',
    },
    onSearch: { action: 'searched' },
    disabled: {
      control: { type: 'boolean' },
      description: 'Whether the search input is disabled',
    },
    debounceMs: {
      control: { type: 'number', min: 0, max: 2000, step: 100 },
      description: 'Debounce delay in milliseconds',
    },
    autoFocus: {
      control: { type: 'boolean' },
      description: 'Whether the input should auto-focus on mount',
    },
  },
} satisfies Meta<typeof SearchBox>;

export default meta;
type Story = StoryObj<typeof meta>;

// Default story
export const Default: Story = {
  args: {
    placeholder: 'Search for movies...',
    debounceMs: 300,
    disabled: false,
  },
};

// Disabled state
export const Disabled: Story = {
  args: {
    placeholder: 'Search for movies...',
    debounceMs: 300,
    disabled: true,
  },
};

// Custom placeholder
export const CustomPlaceholder: Story = {
  args: {
    placeholder: 'Find your next favorite movie',
    debounceMs: 300,
    disabled: false,
  },
};

// Fast debounce
export const FastDebounce: Story = {
  args: {
    placeholder: 'Search for movies...',
    debounceMs: 100,
    disabled: false,
  },
};

// Slow debounce
export const SlowDebounce: Story = {
  args: {
    placeholder: 'Search for movies...',
    debounceMs: 1000,
    disabled: false,
  },
};

// Interactive example with simulated search
export const WithSimulatedSearch = {
  args: {
    placeholder: 'Search for movies...',
    debounceMs: 300,
    disabled: false,
    onSearch: (query: string) => {
      console.log('Searching for:', query);
      // In a real scenario, this would trigger an API call
    },
  },
};

// Full width layout
export const FullWidth = {
  render: () => (
    <div className="w-full max-w-2xl">
      <SearchBox 
        placeholder="Search the entire movie database..."
        onSearch={(query) => console.log('Full width search:', query)}
      />
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};