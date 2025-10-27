/**
 * Header Stories
 * Storybook documentation for Header organism component
 */

import type { Meta, StoryObj } from '@storybook/react';
import { Header } from './index';

const meta: Meta<typeof Header> = {
  title: 'Organisms/Header',
  component: Header,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'The main navigation header component featuring the Watchify logo and theme toggle functionality. This organism combines atoms and provides consistent navigation across the application.',
      },
    },
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="min-h-screen bg-background">
        <Story />
        {/* Content area to show header in context */}
        <div className="container mx-auto px-4 py-8">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-foreground">Page Content</h2>
            <p className="text-muted-foreground">
              This is sample page content to demonstrate how the header appears in context.
              The header is fixed at the top and provides consistent navigation.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }, (_, i) => (
                <div key={i} className="p-4 bg-card rounded-lg border border-border">
                  <h3 className="font-semibold mb-2">Sample Card {i + 1}</h3>
                  <p className="text-sm text-muted-foreground">
                    Sample content to show page layout below the header.
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const LightTheme: Story = {
  parameters: {
    backgrounds: {
      default: 'light',
    },
    docs: {
      description: {
        story: 'Header displayed in light theme context.',
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="min-h-screen bg-white">
        <div className="light">
          <Story />
        </div>
        <div className="container mx-auto px-4 py-8">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-900">Light Theme Content</h2>
            <p className="text-gray-600">
              Header shown in light theme with appropriate contrast and styling.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 3 }, (_, i) => (
                <div key={i} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <h3 className="font-semibold mb-2 text-gray-900">Light Card {i + 1}</h3>
                  <p className="text-sm text-gray-600">Light theme card content.</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    ),
  ],
};

export const DarkTheme: Story = {
  parameters: {
    backgrounds: {
      default: 'dark',
    },
    docs: {
      description: {
        story: 'Header displayed in dark theme context.',
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="min-h-screen bg-gray-900">
        <div className="dark">
          <Story />
        </div>
        <div className="container mx-auto px-4 py-8">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white">Dark Theme Content</h2>
            <p className="text-gray-300">
              Header shown in dark theme with appropriate contrast and styling.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 3 }, (_, i) => (
                <div key={i} className="p-4 bg-gray-800 rounded-lg border border-gray-700">
                  <h3 className="font-semibold mb-2 text-white">Dark Card {i + 1}</h3>
                  <p className="text-sm text-gray-300">Dark theme card content.</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    ),
  ],
};

export const ResponsiveLayout: Story = {
  parameters: {
    viewport: {
      viewports: {
        mobile: {
          name: 'Mobile',
          styles: {
            width: '375px',
            height: '667px',
          },
        },
        tablet: {
          name: 'Tablet',
          styles: {
            width: '768px',
            height: '1024px',
          },
        },
        desktop: {
          name: 'Desktop',
          styles: {
            width: '1200px',
            height: '800px',
          },
        },
      },
    },
    docs: {
      description: {
        story: 'Header responsive behavior across different screen sizes. The layout adapts while maintaining usability.',
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="min-h-screen bg-background">
        <Story />
        <div className="container mx-auto px-4 py-8">
          <div className="space-y-6">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">
              Responsive Content
            </h2>
            <p className="text-muted-foreground">
              Content that demonstrates responsive behavior alongside the header.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }, (_, i) => (
                <div key={i} className="p-4 bg-card rounded-lg border border-border">
                  <h3 className="font-semibold mb-2">Card {i + 1}</h3>
                  <p className="text-sm text-muted-foreground">
                    Responsive grid content.
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    ),
  ],
};

export const HeaderOnly: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Header component in isolation without additional page content.',
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="bg-background">
        <Story />
      </div>
    ),
  ],
};

export const WithScrolledContent: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Header with extensive scrollable content to demonstrate its behavior in long pages.',
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="min-h-screen bg-background">
        <Story />
        <div className="container mx-auto px-4 py-8">
          <div className="space-y-8">
            <section>
              <h2 className="text-3xl font-bold text-foreground mb-4">Popular Movies</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {Array.from({ length: 8 }, (_, i) => (
                  <div key={i} className="p-4 bg-card rounded-lg border border-border">
                    <div className="w-full h-32 bg-muted rounded mb-3"></div>
                    <h3 className="font-semibold mb-1">Movie Title {i + 1}</h3>
                    <p className="text-sm text-muted-foreground">Movie description...</p>
                  </div>
                ))}
              </div>
            </section>
            
            <section>
              <h2 className="text-3xl font-bold text-foreground mb-4">Trending Now</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {Array.from({ length: 8 }, (_, i) => (
                  <div key={i} className="p-4 bg-card rounded-lg border border-border">
                    <div className="w-full h-32 bg-muted rounded mb-3"></div>
                    <h3 className="font-semibold mb-1">Trending Movie {i + 1}</h3>
                    <p className="text-sm text-muted-foreground">Trending description...</p>
                  </div>
                ))}
              </div>
            </section>
            
            <section>
              <h2 className="text-3xl font-bold text-foreground mb-4">Coming Soon</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {Array.from({ length: 12 }, (_, i) => (
                  <div key={i} className="p-4 bg-card rounded-lg border border-border">
                    <div className="w-full h-32 bg-muted rounded mb-3"></div>
                    <h3 className="font-semibold mb-1">Upcoming Movie {i + 1}</h3>
                    <p className="text-sm text-muted-foreground">Coming soon...</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    ),
  ],
};

export const InteractiveDemo: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Interactive demonstration showing header functionality including logo link and theme toggle.',
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="min-h-screen bg-background">
        <Story />
        <div className="container mx-auto px-4 py-8">
          <div className="space-y-6">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
              <h2 className="text-2xl font-bold text-blue-900 dark:text-blue-100 mb-4">
                Interactive Features
              </h2>
              <ul className="space-y-2 text-blue-800 dark:text-blue-200">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                  Click the Watchify logo to navigate to home page
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                  Use the theme toggle to switch between light and dark modes
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                  Header maintains consistent styling across themes
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                  Responsive layout adapts to different screen sizes
                </li>
              </ul>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 bg-card rounded-lg border border-border">
                <h3 className="text-xl font-semibold mb-3">Logo & Branding</h3>
                <p className="text-muted-foreground mb-4">
                  The header features the Watchify logo with film icon and branded purple accent color.
                </p>
                <div className="flex items-center space-x-2 p-3 bg-muted rounded">
                  <div className="w-6 h-6 bg-purple-600 rounded"></div>
                  <span className="font-bold">Watchify</span>
                </div>
              </div>
              
              <div className="p-6 bg-card rounded-lg border border-border">
                <h3 className="text-xl font-semibold mb-3">Theme Toggle</h3>
                <p className="text-muted-foreground mb-4">
                  Users can switch between light and dark themes using the toggle button.
                </p>
                <div className="flex items-center justify-center p-3 bg-muted rounded">
                  <span className="text-sm">🌙 ↔️ ☀️</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
  ],
};

export const AccessibilityDemo: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates accessibility features including keyboard navigation and screen reader support.',
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="min-h-screen bg-background">
        <Story />
        <div className="container mx-auto px-4 py-8">
          <div className="space-y-6">
            <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg border border-green-200 dark:border-green-800">
              <h2 className="text-2xl font-bold text-green-900 dark:text-green-100 mb-4">
                Accessibility Features
              </h2>
              <ul className="space-y-2 text-green-800 dark:text-green-200">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                  <div>
                    <strong>Keyboard Navigation:</strong> All interactive elements can be accessed via keyboard (Tab, Enter, Space)
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                  <div>
                    <strong>Screen Reader Support:</strong> Proper semantic HTML with header landmarks
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                  <div>
                    <strong>Focus Management:</strong> Clear focus indicators for interactive elements
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                  <div>
                    <strong>Color Contrast:</strong> Meets WCAG guidelines for text and background contrast
                  </div>
                </li>
              </ul>
            </div>
            
            <div className="p-6 bg-card rounded-lg border border-border">
              <h3 className="text-xl font-semibold mb-3">Try These Interactions</h3>
              <div className="space-y-3 text-muted-foreground">
                <p><kbd className="px-2 py-1 bg-muted rounded text-xs">Tab</kbd> - Navigate to header elements</p>
                <p><kbd className="px-2 py-1 bg-muted rounded text-xs">Enter</kbd> - Activate logo link</p>
                <p><kbd className="px-2 py-1 bg-muted rounded text-xs">Space</kbd> - Toggle theme</p>
                <p><kbd className="px-2 py-1 bg-muted rounded text-xs">Escape</kbd> - Clear any active states</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
  ],
};