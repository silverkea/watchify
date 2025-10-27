/**
 * Badge Stories
 * Storybook documentation for Badge atom component
 */

import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from './index';

const meta: Meta<typeof Badge> = {
  title: 'Atoms/Badge',
  component: Badge,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A small status indicator component used to display categories, tags, or status information.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'primary', 'secondary', 'success', 'warning', 'error', 'neon'],
      description: 'Visual style variant of the badge',
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
      description: 'Size of the badge',
    },
    shape: {
      control: { type: 'select' },
      options: ['rounded', 'pill', 'square'],
      description: 'Shape of the badge',
    },
    removable: {
      control: 'boolean',
      description: 'Shows remove button when true',
    },
    children: {
      control: 'text',
      description: 'Badge content',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    children: 'Primary',
    variant: 'primary',
  },
};

export const Secondary: Story = {
  args: {
    children: 'Secondary',
    variant: 'secondary',
  },
};

export const Error: Story = {
  args: {
    children: 'Error',
    variant: 'error',
  },
};

export const Success: Story = {
  args: {
    children: 'Success',
    variant: 'success',
  },
};

export const Warning: Story = {
  args: {
    children: 'Warning',
    variant: 'warning',
  },
};

export const Neon: Story = {
  args: {
    children: 'Neon',
    variant: 'neon',
  },
};

export const Removable: Story = {
  args: {
    children: 'Removable Badge',
    variant: 'primary',
    removable: true,
    onRemove: () => alert('Badge removed!'),
  },
};

export const Small: Story = {
  args: {
    children: 'Small Badge',
    size: 'sm',
  },
};

export const Medium: Story = {
  args: {
    children: 'Medium Badge',
    size: 'md',
  },
};

export const Large: Story = {
  args: {
    children: 'Large Badge',
    size: 'lg',
  },
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Badge size="sm">Small</Badge>
      <Badge size="md">Medium</Badge>
      <Badge size="lg">Large</Badge>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'All available badge sizes displayed together.',
      },
    },
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2">
        <Badge variant="primary">Action</Badge>
        <Badge variant="secondary">Comedy</Badge>
        <Badge variant="error">Horror</Badge>
      </div>
      <div className="flex gap-2">
        <Badge variant="primary" size="sm">Sci-Fi</Badge>
        <Badge variant="secondary" size="md">Drama</Badge>
        <Badge variant="error" size="lg">Thriller</Badge>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Movie genre badges showing different variants and sizes - perfect for categorizing content.',
      },
    },
  },
};

export const GenreShowcase: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2 max-w-md">
      <Badge variant="primary">Action</Badge>
      <Badge variant="secondary">Adventure</Badge>
      <Badge variant="primary">Animation</Badge>
      <Badge variant="secondary">Comedy</Badge>
      <Badge variant="error">Crime</Badge>
      <Badge variant="primary">Documentary</Badge>
      <Badge variant="secondary">Drama</Badge>
      <Badge variant="error">Horror</Badge>
      <Badge variant="primary">Mystery</Badge>
      <Badge variant="secondary">Romance</Badge>
      <Badge variant="primary">Sci-Fi</Badge>
      <Badge variant="error">Thriller</Badge>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Real-world example showing how badges are used for movie genres in the application.',
      },
    },
  },
};