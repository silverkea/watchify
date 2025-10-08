/**
 * Button Stories
 * Storybook documentation for Button atom component
 */

import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './index';
import { Search, Heart, Download, Loader2 } from 'lucide-react';

const meta = {
  title: 'Atoms/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A versatile button component with multiple variants, sizes, and states. Supports loading states and icon integration.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'ghost', 'neon'],
      description: 'Visual variant of the button',
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
      description: 'Size of the button',
    },
    loading: {
      control: { type: 'boolean' },
      description: 'Whether the button is in loading state',
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Whether the button is disabled',
    },
    children: {
      control: { type: 'text' },
      description: 'Button content',
    },
    onClick: { action: 'clicked' },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

// Primary variants
export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Primary Button',
    size: 'md',
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Secondary Button',
    size: 'md',
  },
};

export const Ghost: Story = {
  args: {
    variant: 'ghost',
    children: 'Ghost Button',
    size: 'md',
  },
};

export const Neon: Story = {
  args: {
    variant: 'neon',
    children: 'Neon Button',
    size: 'md',
  },
};

// Sizes
export const Small: Story = {
  args: {
    variant: 'primary',
    size: 'sm',
    children: 'Small Button',
  },
};

export const Medium: Story = {
  args: {
    variant: 'primary',
    size: 'md',
    children: 'Medium Button',
  },
};

export const Large: Story = {
  args: {
    variant: 'primary',
    size: 'lg',
    children: 'Large Button',
  },
};

// States
export const Loading: Story = {
  args: {
    variant: 'primary',
    loading: true,
    children: 'Loading...',
  },
};

export const Disabled: Story = {
  args: {
    variant: 'primary',
    disabled: true,
    children: 'Disabled Button',
  },
};

// With Icons
export const WithIcon: Story = {
  render: (args) => (
    <Button {...args}>
      <Search className="w-4 h-4 mr-2" />
      Search Movies
    </Button>
  ),
  args: {
    variant: 'primary',
    size: 'md',
  },
};

export const IconOnly: Story = {
  render: (args) => (
    <Button {...args}>
      <Heart className="w-4 h-4" />
    </Button>
  ),
  args: {
    variant: 'ghost',
    size: 'md',
  },
};

// All Variants Showcase
export const AllVariants = {
  render: () => (
    <div className="space-y-4">
      <div className="flex gap-4 items-center">
        <Button variant="primary">Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="neon">Neon</Button>
      </div>
      <div className="flex gap-4 items-center">
        <Button variant="primary" size="sm">Small</Button>
        <Button variant="primary" size="md">Medium</Button>
        <Button variant="primary" size="lg">Large</Button>
      </div>
      <div className="flex gap-4 items-center">
        <Button variant="primary" loading>Loading</Button>
        <Button variant="primary" disabled>Disabled</Button>
      </div>
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};

// Interactive Example
export const Interactive: Story = {
  render: (args) => (
    <Button {...args}>
      <Download className="w-4 h-4 mr-2" />
      Download Movie
    </Button>
  ),
  args: {
    variant: 'primary',
    size: 'md',
    onClick: (e) => {
      console.log('Button clicked!', e);
      alert('Movie download started!');
    },
  },
};