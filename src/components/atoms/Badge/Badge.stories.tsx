/**
 * Badge Stories
 * Storybook documentation for Badge atom component
 */

import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from './index';
import { Star, Clock, Calendar } from 'lucide-react';

const meta = {
  title: 'Atoms/Badge',
  component: Badge,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A small label component for categorizing, tagging, or highlighting information. Perfect for genres, ratings, and status indicators.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'secondary', 'destructive', 'outline'],
      description: 'Visual variant of the badge',
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
      description: 'Size of the badge',
    },
    children: {
      control: { type: 'text' },
      description: 'Badge content',
    },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

// Variants
export const Default: Story = {
  args: {
    children: 'Default Badge',
    variant: 'default',
    size: 'md',
  },
};

export const Secondary: Story = {
  args: {
    children: 'Secondary Badge',
    variant: 'secondary',
    size: 'md',
  },
};

export const Destructive: Story = {
  args: {
    children: 'Destructive Badge',
    variant: 'destructive',
    size: 'md',
  },
};

export const Outline: Story = {
  args: {
    children: 'Outline Badge',
    variant: 'outline',
    size: 'md',
  },
};

// Sizes
export const Small: Story = {
  args: {
    children: 'Small',
    variant: 'default',
    size: 'sm',
  },
};

export const Medium: Story = {
  args: {
    children: 'Medium',
    variant: 'default',
    size: 'md',
  },
};

export const Large: Story = {
  args: {
    children: 'Large',
    variant: 'default',
    size: 'lg',
  },
};

// Movie Genre Examples
export const MovieGenres = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge variant="secondary" size="sm">Action</Badge>
      <Badge variant="secondary" size="sm">Adventure</Badge>
      <Badge variant="secondary" size="sm">Sci-Fi</Badge>
      <Badge variant="secondary" size="sm">Thriller</Badge>
      <Badge variant="secondary" size="sm">Drama</Badge>
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};

// Rating Examples
export const Ratings = {
  render: () => (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Star className="w-4 h-4 text-yellow-500" />
        <Badge variant="default" size="sm">8.4</Badge>
        <span className="text-sm text-gray-500">IMDb Rating</span>
      </div>
      <div className="flex items-center gap-2">
        <Badge variant="destructive" size="sm">R</Badge>
        <span className="text-sm text-gray-500">Rated R</span>
      </div>
      <div className="flex items-center gap-2">
        <Clock className="w-4 h-4 text-gray-500" />
        <Badge variant="outline" size="sm">139m</Badge>
        <span className="text-sm text-gray-500">Runtime</span>
      </div>
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};

// Status Indicators
export const StatusIndicators = {
  render: () => (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Badge variant="default" size="sm">● Live</Badge>
        <span className="text-sm text-gray-500">Watch Party Active</span>
      </div>
      <div className="flex items-center gap-2">
        <Badge variant="secondary" size="sm">⏰ Scheduled</Badge>
        <span className="text-sm text-gray-500">Watch Party Scheduled</span>
      </div>
      <div className="flex items-center gap-2">
        <Badge variant="outline" size="sm">✓ Ended</Badge>
        <span className="text-sm text-gray-500">Watch Party Ended</span>
      </div>
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};

// All Variants Showcase
export const AllVariants = {
  render: () => (
    <div className="space-y-4">
      <div className="flex gap-2 items-center">
        <Badge variant="default">Default</Badge>
        <Badge variant="secondary">Secondary</Badge>
        <Badge variant="destructive">Destructive</Badge>
        <Badge variant="outline">Outline</Badge>
      </div>
      <div className="flex gap-2 items-center">
        <Badge variant="default" size="sm">Small</Badge>
        <Badge variant="default" size="md">Medium</Badge>
        <Badge variant="default" size="lg">Large</Badge>
      </div>
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};

// With Icons
export const WithIcons = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge variant="default" size="md">
        <Star className="w-3 h-3 mr-1" />
        Featured
      </Badge>
      <Badge variant="secondary" size="md">
        <Calendar className="w-3 h-3 mr-1" />
        2024
      </Badge>
      <Badge variant="outline" size="md">
        <Clock className="w-3 h-3 mr-1" />
        2h 19m
      </Badge>
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};