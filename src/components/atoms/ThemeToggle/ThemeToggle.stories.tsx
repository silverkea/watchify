/**
 * ThemeToggle Stories
 * Storybook documentation for ThemeToggle atom component
 */

import type { Meta, StoryObj } from '@storybook/react';
import { ThemeToggle } from './index';

const meta: Meta<typeof ThemeToggle> = {
  title: 'Atoms/ThemeToggle',
  component: ThemeToggle,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A toggle button component for switching between light and dark themes. Uses next-themes for theme management.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'outline', 'ghost', 'neon'],
      description: 'Visual style variant of the toggle button',
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
      description: 'Size of the toggle button',
    },
    showTooltip: {
      control: 'boolean',
      description: 'Show tooltip with theme information on hover',
    },
  },
  decorators: [
    (Story) => (
      <div className="p-4 border rounded-lg bg-white dark:bg-gray-800">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    variant: 'default',
    size: 'md',
  },
};

export const Outline: Story = {
  args: {
    variant: 'outline',
    size: 'md',
  },
};

export const Ghost: Story = {
  args: {
    variant: 'ghost',
    size: 'md',
  },
};

export const Neon: Story = {
  args: {
    variant: 'neon',
    size: 'md',
  },
};

export const Small: Story = {
  args: {
    variant: 'default',
    size: 'sm',
  },
};

export const Large: Story = {
  args: {
    variant: 'default',
    size: 'lg',
  },
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <div className="flex flex-col items-center gap-2">
        <ThemeToggle size="sm" />
        <span className="text-xs text-gray-600 dark:text-gray-400">Small</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <ThemeToggle size="md" />
        <span className="text-xs text-gray-600 dark:text-gray-400">Medium</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <ThemeToggle size="lg" />
        <span className="text-xs text-gray-600 dark:text-gray-400">Large</span>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'All available theme toggle sizes displayed together.',
      },
    },
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <div className="flex flex-col items-center gap-2">
        <ThemeToggle variant="default" />
        <span className="text-xs text-gray-600 dark:text-gray-400">Default</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <ThemeToggle variant="outline" />
        <span className="text-xs text-gray-600 dark:text-gray-400">Outline</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <ThemeToggle variant="ghost" />
        <span className="text-xs text-gray-600 dark:text-gray-400">Ghost</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <ThemeToggle variant="neon" />
        <span className="text-xs text-gray-600 dark:text-gray-400">Neon</span>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'All theme toggle variants displayed together.',
      },
    },
  },
};

export const InNavigation: Story = {
  render: () => (
    <div className="flex items-center justify-between p-4 bg-gray-100 dark:bg-gray-900 rounded-lg">
      <div className="flex items-center gap-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Watchify
        </h2>
        <nav className="flex gap-4">
          <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
            Movies
          </a>
          <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
            Watch Party
          </a>
        </nav>
      </div>
      <ThemeToggle variant="ghost" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Example of theme toggle used in a navigation context.',
      },
    },
  },
};

export const WithTooltip: Story = {
  args: {
    showTooltip: true,
    variant: 'default',
  },
  parameters: {
    docs: {
      description: {
        story: 'Theme toggle with tooltip functionality showing current theme state.',
      },
    },
  },
};

export const ThemeCycling: Story = {
  render: () => (
    <div className="flex flex-col items-center gap-4">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
          Theme Cycling
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Click to cycle through: Light → Dark → System → Light
        </p>
      </div>
      <div className="flex gap-4">
        <ThemeToggle variant="default" showTooltip />
        <ThemeToggle variant="neon" showTooltip />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates the theme cycling behavior: Light → Dark → System → Light. Each click advances to the next theme.',
      },
    },
  },
};