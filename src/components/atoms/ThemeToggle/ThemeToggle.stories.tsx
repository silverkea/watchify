/**
 * ThemeToggle Stories
 * Storybook documentation for ThemeToggle atom component
 */

import type { Meta, StoryObj } from '@storybook/react';
import { ThemeToggle } from './index';

const meta = {
  title: 'Atoms/ThemeToggle',
  component: ThemeToggle,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A theme toggle component that switches between light and dark modes. Uses next-themes for theme management with smooth transitions.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    // ThemeToggle doesn't accept props, it manages its own state
  },
} satisfies Meta<typeof ThemeToggle>;

export default meta;
type Story = StoryObj<typeof meta>;

// Default story
export const Default: Story = {};

// In different contexts
export const InHeader = {
  render: () => (
    <div className="bg-card border rounded-lg p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-purple-600 rounded-lg"></div>
          <h1 className="text-xl font-bold">Watchify</h1>
        </div>
        <ThemeToggle />
      </div>
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};

export const InNavigation = {
  render: () => (
    <nav className="bg-card border rounded-lg p-4">
      <div className="flex items-center justify-between">
        <div className="flex space-x-6">
          <a href="#" className="text-foreground hover:text-primary">Home</a>
          <a href="#" className="text-foreground hover:text-primary">Movies</a>
          <a href="#" className="text-foreground hover:text-primary">Watch Parties</a>
        </div>
        <ThemeToggle />
      </div>
    </nav>
  ),
  parameters: {
    layout: 'padded',
  },
};

export const InSettings = {
  render: () => (
    <div className="bg-card border rounded-lg p-6 w-80">
      <h2 className="text-lg font-semibold mb-4">Settings</h2>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <label className="text-sm font-medium">Theme</label>
            <p className="text-xs text-muted-foreground">
              Switch between light and dark mode
            </p>
          </div>
          <ThemeToggle />
        </div>
        <div className="flex items-center justify-between">
          <div>
            <label className="text-sm font-medium">Notifications</label>
            <p className="text-xs text-muted-foreground">
              Get notified about watch parties
            </p>
          </div>
          <input type="checkbox" className="rounded" />
        </div>
        <div className="flex items-center justify-between">
          <div>
            <label className="text-sm font-medium">Auto-play</label>
            <p className="text-xs text-muted-foreground">
              Automatically start movies
            </p>
          </div>
          <input type="checkbox" className="rounded" defaultChecked />
        </div>
      </div>
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};

// Multiple instances
export const MultipleInstances = {
  render: () => (
    <div className="space-y-4">
      <div className="text-sm text-muted-foreground mb-2">
        Multiple theme toggles should stay synchronized:
      </div>
      <div className="flex items-center space-x-4">
        <ThemeToggle />
        <ThemeToggle />
        <ThemeToggle />
      </div>
      <div className="bg-card border rounded-lg p-4">
        <div className="flex items-center justify-between">
          <span className="text-sm">Header theme toggle:</span>
          <ThemeToggle />
        </div>
      </div>
      <div className="bg-card border rounded-lg p-4">
        <div className="flex items-center justify-between">
          <span className="text-sm">Footer theme toggle:</span>
          <ThemeToggle />
        </div>
      </div>
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};

// Documentation example
export const ThemeShowcase = {
  render: () => (
    <div className="space-y-6">
      <div className="text-center">
        <ThemeToggle />
        <p className="text-sm text-muted-foreground mt-2">
          Toggle above to see theme changes
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-card border rounded-lg p-4">
          <h3 className="font-semibold mb-2">Light Theme Elements</h3>
          <div className="space-y-2 text-sm">
            <div className="p-2 bg-background border rounded">Background</div>
            <div className="p-2 bg-muted rounded">Muted background</div>
            <div className="text-foreground">Foreground text</div>
            <div className="text-muted-foreground">Muted text</div>
          </div>
        </div>
        
        <div className="bg-card border rounded-lg p-4">
          <h3 className="font-semibold mb-2">Interactive Elements</h3>
          <div className="space-y-2">
            <button className="px-3 py-1 bg-primary text-primary-foreground rounded text-sm">
              Primary Button
            </button>
            <button className="px-3 py-1 bg-secondary text-secondary-foreground rounded text-sm">
              Secondary Button
            </button>
            <input 
              type="text" 
              placeholder="Input field"
              className="w-full px-3 py-1 border rounded text-sm"
            />
          </div>
        </div>
      </div>
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};