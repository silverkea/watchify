/**
 * Header Stories
 * Storybook documentation for Header organism component
 */

import type { Meta, StoryObj } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { Header } from './index';

const meta = {
  title: 'Organisms/Header',
  component: Header,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'The main header component containing navigation, branding, search, and user actions. Responsive design that adapts to different screen sizes.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    currentPath: {
      control: 'text',
      description: 'Current page path for navigation highlighting',
    },
    user: {
      control: 'object',
      description: 'Current user object (null for unauthenticated)',
    },
    onSearch: {
      action: 'search-submitted',
      description: 'Callback fired when search is submitted',
    },
    onLoginClick: {
      action: 'login-clicked',
      description: 'Callback fired when login button is clicked',
    },
    onLogoutClick: {
      action: 'logout-clicked', 
      description: 'Callback fired when logout is triggered',
    },
    onProfileClick: {
      action: 'profile-clicked',
      description: 'Callback fired when profile is accessed',
    },
  },
} satisfies Meta<typeof Header>;

export default meta;
type Story = StoryObj<typeof meta>;

// Mock user data
const mockUser = {
  id: '1',
  name: 'John Doe',
  email: 'john@example.com',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face',
};

// Default story - unauthenticated
export const Default: Story = {
  args: {
    currentPath: '/',
    user: null,
    onSearch: action('search-submitted'),
    onLoginClick: action('login-clicked'),
    onLogoutClick: action('logout-clicked'),
    onProfileClick: action('profile-clicked'),
  },
};

// Authenticated user
export const WithUser: Story = {
  args: {
    currentPath: '/',
    user: mockUser,
    onSearch: action('search-submitted'),
    onLoginClick: action('login-clicked'),
    onLogoutClick: action('logout-clicked'),
    onProfileClick: action('profile-clicked'),
  },
  parameters: {
    docs: {
      description: {
        story: 'Header with authenticated user showing profile dropdown and user actions',
      },
    },
  },
};

// Different page highlights
export const OnMoviesPage: Story = {
  args: {
    currentPath: '/movies',
    user: mockUser,
    onSearch: action('search-submitted'),
    onLoginClick: action('login-clicked'),
    onLogoutClick: action('logout-clicked'),
    onProfileClick: action('profile-clicked'),
  },
  parameters: {
    docs: {
      description: {
        story: 'Header with Movies navigation item highlighted',
      },
    },
  },
};

export const OnWatchPartiesPage: Story = {
  args: {
    currentPath: '/watch-parties',
    user: mockUser,
    onSearch: action('search-submitted'),
    onLoginClick: action('login-clicked'),
    onLogoutClick: action('logout-clicked'),
    onProfileClick: action('profile-clicked'),
  },
  parameters: {
    docs: {
      description: {
        story: 'Header with Watch Parties navigation item highlighted',
      },
    },
  },
};

export const OnProfilePage: Story = {
  args: {
    currentPath: '/profile',
    user: mockUser,
    onSearch: action('search-submitted'),
    onLoginClick: action('login-clicked'),
    onLogoutClick: action('logout-clicked'),
    onProfileClick: action('profile-clicked'),
  },
  parameters: {
    docs: {
      description: {
        story: 'Header on user profile page',
      },
    },
  },
};

// Different screen sizes
export const Mobile: Story = {
  args: {
    currentPath: '/',
    user: mockUser,
    onSearch: action('search-submitted'),
    onLoginClick: action('login-clicked'),
    onLogoutClick: action('logout-clicked'),
    onProfileClick: action('profile-clicked'),
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story: 'Header on mobile devices with collapsed navigation and hamburger menu',
      },
    },
  },
};

export const Tablet: Story = {
  args: {
    currentPath: '/movies',
    user: mockUser,
    onSearch: action('search-submitted'),
    onLoginClick: action('login-clicked'),
    onLogoutClick: action('logout-clicked'),
    onProfileClick: action('profile-clicked'),
  },
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
    docs: {
      description: {
        story: 'Header on tablet devices with adapted layout',
      },
    },
  },
};

// Different states
export const WithSearch: Story = {
  render: (args) => (
    <div className="min-h-screen bg-background">
      <Header {...args} />
      <div className="container mx-auto p-6">
        <div className="text-center space-y-4 mt-20">
          <h1 className="text-2xl font-bold">Search Results</h1>
          <p className="text-muted-foreground">
            Results for "avengers" would appear here
          </p>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-card border rounded-lg p-4">
                <div className="w-full h-48 bg-gradient-to-r from-blue-500 to-purple-600 rounded mb-3"></div>
                <h4 className="font-medium">Movie {i}</h4>
                <p className="text-sm text-muted-foreground">2023 • ⭐ 8.{i}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  ),
  args: {
    currentPath: '/search',
    user: mockUser,
    onSearch: action('search-submitted'),
    onLoginClick: action('login-clicked'),
    onLogoutClick: action('logout-clicked'),
    onProfileClick: action('profile-clicked'),
  },
};

export const WithNotifications: Story = {
  render: (args) => (
    <div className="min-h-screen bg-background">
      <Header {...args} />
      <div className="container mx-auto p-6">
        <div className="mt-20 space-y-4">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <div className="grid gap-4">
            <div className="bg-card border rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div>
                  <p className="font-medium">Watch party starting soon!</p>
                  <p className="text-sm text-muted-foreground">
                    The Dark Knight watch party starts in 15 minutes
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-card border rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <div>
                  <p className="font-medium">New invitation received</p>
                  <p className="text-sm text-muted-foreground">
                    Sarah invited you to watch Inception tomorrow
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
  args: {
    currentPath: '/dashboard',
    user: mockUser,
    onSearch: action('search-submitted'),
    onLoginClick: action('login-clicked'),
    onLogoutClick: action('logout-clicked'),
    onProfileClick: action('profile-clicked'),
  },
};

// Theme showcase
export const ThemeShowcase: Story = {
  render: (args) => (
    <div className="space-y-0">
      <Header {...args} />
      <div className="p-6 bg-background">
        <div className="container mx-auto">
          <div className="space-y-6">
            <div className="text-center">
              <h1 className="text-3xl font-bold mb-2">Theme Demo</h1>
              <p className="text-muted-foreground">
                Toggle theme in header to see changes
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-card border rounded-lg p-6">
                <h3 className="font-semibold mb-4">Card Component</h3>
                <div className="space-y-3">
                  <div className="p-3 bg-muted rounded">Muted background</div>
                  <div className="p-3 bg-primary text-primary-foreground rounded">
                    Primary button
                  </div>
                  <div className="p-3 bg-secondary text-secondary-foreground rounded">
                    Secondary button
                  </div>
                </div>
              </div>
              
              <div className="bg-card border rounded-lg p-6">
                <h3 className="font-semibold mb-4">Form Elements</h3>
                <div className="space-y-3">
                  <input 
                    type="text" 
                    placeholder="Input field"
                    className="w-full px-3 py-2 border rounded"
                  />
                  <select className="w-full px-3 py-2 border rounded">
                    <option>Select option</option>
                  </select>
                  <textarea 
                    placeholder="Textarea"
                    className="w-full px-3 py-2 border rounded"
                    rows={3}
                  />
                </div>
              </div>
              
              <div className="bg-card border rounded-lg p-6">
                <h3 className="font-semibold mb-4">Text Colors</h3>
                <div className="space-y-2 text-sm">
                  <div className="text-foreground">Foreground text</div>
                  <div className="text-muted-foreground">Muted text</div>
                  <div className="text-destructive">Destructive text</div>
                  <div className="text-primary">Primary text</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
  args: {
    currentPath: '/',
    user: mockUser,
    onSearch: action('search-submitted'),
    onLoginClick: action('login-clicked'),
    onLogoutClick: action('logout-clicked'),
    onProfileClick: action('profile-clicked'),
  },
};

// Loading state
export const Loading: Story = {
  render: (args) => (
    <div className="min-h-screen bg-background">
      <Header {...args} />
      <div className="container mx-auto p-6">
        <div className="mt-20 space-y-6">
          <div className="flex items-center justify-between">
            <div className="w-48 h-8 bg-muted rounded animate-pulse"></div>
            <div className="w-32 h-10 bg-muted rounded animate-pulse"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <div key={i} className="bg-card border rounded-lg p-4">
                <div className="w-full h-48 bg-muted rounded mb-3 animate-pulse"></div>
                <div className="w-3/4 h-4 bg-muted rounded mb-2 animate-pulse"></div>
                <div className="w-1/2 h-3 bg-muted rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  ),
  args: {
    currentPath: '/movies',
    user: mockUser,
    onSearch: action('search-submitted'),
    onLoginClick: action('login-clicked'),
    onLogoutClick: action('logout-clicked'),
    onProfileClick: action('profile-clicked'),
  },
};