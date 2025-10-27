/**
 * Button Stories
 * Storybook documentation for Button atom component
 */

import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './index';

const meta: Meta<typeof Button> = {
  title: 'Atoms/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A versatile button component with multiple variants, sizes, and states. Supports loading state and follows the design system color scheme.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'ghost', 'neon'],
      description: 'Visual style variant of the button',
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
      description: 'Size of the button',
    },
    loading: { 
      control: 'boolean',
      description: 'Shows loading spinner when true',
    },
    disabled: { 
      control: 'boolean',
      description: 'Disables the button when true',
    },
    children: {
      control: 'text',
      description: 'Button content',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    children: 'Primary Button',
    variant: 'primary',
    size: 'md',
  },
};

export const Secondary: Story = {
  args: {
    children: 'Secondary Button',
    variant: 'secondary',
    size: 'md',
  },
};

export const Ghost: Story = {
  args: {
    children: 'Ghost Button',
    variant: 'ghost',
    size: 'md',
  },
};

export const Neon: Story = {
  args: {
    children: 'Neon Button',
    variant: 'neon',
    size: 'md',
  },
};

export const Loading: Story = {
  args: {
    children: 'Loading...',
    variant: 'primary',
    loading: true,
  },
};

export const Disabled: Story = {
  args: {
    children: 'Disabled Button',
    variant: 'primary',
    disabled: true,
  },
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Button size="sm" variant="primary">Small</Button>
      <Button size="md" variant="primary">Medium</Button>
      <Button size="lg" variant="primary">Large</Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'All available button sizes displayed together.',
      },
    },
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex gap-4">
        <Button variant="primary">Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="neon">Neon</Button>
      </div>
      <div className="flex gap-4">
        <Button variant="primary" loading>Loading</Button>
        <Button variant="secondary" disabled>Disabled</Button>
        <Button variant="ghost" size="sm">Small</Button>
        <Button variant="neon" size="lg">Large</Button>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Showcase of all button variants and states in one view.',
      },
    },
  },
};