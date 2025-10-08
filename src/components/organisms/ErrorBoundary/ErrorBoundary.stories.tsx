/**
 * ErrorBoundary Stories
 * Storybook documentation for ErrorBoundary organism component
 */

import type { Meta, StoryObj } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { ErrorBoundary } from '@/components/error-boundary';

const meta = {
  title: 'Organisms/ErrorBoundary',
  component: ErrorBoundary,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'A React error boundary component that catches JavaScript errors in child components and displays fallback UI. Provides error reporting and recovery options.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    fallback: {
      control: 'object',
      description: 'Custom fallback component to render when error occurs',
    },
    onError: {
      action: 'error-caught',
      description: 'Callback fired when an error is caught',
    },
    showErrorDetails: {
      control: 'boolean',
      description: 'Whether to show detailed error information',
    },
    allowRetry: {
      control: 'boolean',
      description: 'Whether to show retry button',
    },
    children: {
      control: false,
      description: 'Child components to wrap with error boundary',
    },
  },
} satisfies Meta<typeof ErrorBoundary>;

export default meta;
type Story = StoryObj<typeof meta>;

// Component that throws an error for testing
const ThrowError = ({ shouldThrow = false }: { shouldThrow?: boolean }) => {
  if (shouldThrow) {
    throw new Error('Test error: Component failed to render');
  }
  return <div className="p-4 bg-green-100 text-green-800 rounded">✅ Component rendered successfully</div>;
};

// Component that throws different types of errors
const ErrorTypes = ({ errorType }: { errorType: string }) => {
  switch (errorType) {
    case 'network':
      throw new Error('Network Error: Failed to fetch movie data from TMDB API');
    case 'permission':
      throw new Error('Permission Error: You do not have access to this watch party');
    case 'validation':
      throw new Error('Validation Error: Invalid date format provided');
    case 'generic':
      throw new Error('Something went wrong');
    default:
      return <div className="p-4 bg-green-100 text-green-800 rounded">✅ No error</div>;
  }
};

// Default story with working component
export const Default: Story = {
  args: {
    onError: action('error-caught'),
    showErrorDetails: false,
    allowRetry: true,
    children: <ThrowError shouldThrow={false} />,
  },
};

// Error state
export const WithError: Story = {
  args: {
    onError: action('error-caught'),
    showErrorDetails: false,
    allowRetry: true,
    children: <ThrowError shouldThrow={true} />,
  },
  parameters: {
    docs: {
      description: {
        story: 'Error boundary catching and displaying a generic error',
      },
    },
  },
};

// Error with details shown
export const WithErrorDetails: Story = {
  args: {
    onError: action('error-caught'),
    showErrorDetails: true,
    allowRetry: true,
    children: <ThrowError shouldThrow={true} />,
  },
  parameters: {
    docs: {
      description: {
        story: 'Error boundary showing detailed error information for debugging',
      },
    },
  },
};

// Error without retry
export const WithoutRetry: Story = {
  args: {
    onError: action('error-caught'),
    showErrorDetails: false,
    allowRetry: false,
    children: <ThrowError shouldThrow={true} />,
  },
  parameters: {
    docs: {
      description: {
        story: 'Error boundary without retry option - for critical errors',
      },
    },
  },
};

// Different error types
export const NetworkError: Story = {
  args: {
    onError: action('error-caught'),
    showErrorDetails: true,
    allowRetry: true,
    children: <ErrorTypes errorType="network" />,
  },
  parameters: {
    docs: {
      description: {
        story: 'Error boundary handling network/API errors',
      },
    },
  },
};

export const PermissionError: Story = {
  args: {
    onError: action('error-caught'),
    showErrorDetails: true,
    allowRetry: false,
    children: <ErrorTypes errorType="permission" />,
  },
  parameters: {
    docs: {
      description: {
        story: 'Error boundary handling permission/access errors',
      },
    },
  },
};

export const ValidationError: Story = {
  args: {
    onError: action('error-caught'),
    showErrorDetails: true,
    allowRetry: true,
    children: <ErrorTypes errorType="validation" />,
  },
  parameters: {
    docs: {
      description: {
        story: 'Error boundary handling validation errors',
      },
    },
  },
};

// In different contexts
export const InMovieGrid: Story = {
  render: (args) => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Popular Movies</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-card border rounded-lg p-4">
          <div className="w-full h-48 bg-gradient-to-r from-blue-500 to-purple-600 rounded mb-3"></div>
          <h4 className="font-medium">The Dark Knight</h4>
          <p className="text-sm text-muted-foreground">2008 • ⭐ 9.0</p>
        </div>
        
        <ErrorBoundary {...args}>
          <ErrorTypes errorType="network" />
        </ErrorBoundary>
        
        <div className="bg-card border rounded-lg p-4">
          <div className="w-full h-48 bg-gradient-to-r from-green-500 to-blue-500 rounded mb-3"></div>
          <h4 className="font-medium">Inception</h4>
          <p className="text-sm text-muted-foreground">2010 • ⭐ 8.8</p>
        </div>
        
        <div className="bg-card border rounded-lg p-4">
          <div className="w-full h-48 bg-gradient-to-r from-red-500 to-pink-500 rounded mb-3"></div>
          <h4 className="font-medium">Interstellar</h4>
          <p className="text-sm text-muted-foreground">2014 • ⭐ 8.6</p>
        </div>
      </div>
    </div>
  ),
  args: {
    onError: action('error-caught'),
    showErrorDetails: false,
    allowRetry: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Error boundary protecting individual items in a movie grid',
      },
    },
  },
};

export const InWatchPartyForm: Story = {
  render: (args) => (
    <div className="bg-card border rounded-lg p-6 w-full max-w-md">
      <form className="space-y-6">
        <div>
          <h2 className="text-lg font-semibold mb-4">Create Watch Party</h2>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Movie Selection</label>
          <ErrorBoundary {...args}>
            <ErrorTypes errorType="validation" />
          </ErrorBoundary>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Date & Time</label>
          <input 
            type="datetime-local" 
            className="w-full p-3 border rounded-lg"
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Description</label>
          <textarea 
            placeholder="Optional description..."
            className="w-full p-3 border rounded-lg resize-none"
            rows={3}
          />
        </div>
        
        <div className="flex space-x-3">
          <button 
            type="submit" 
            className="flex-1 bg-primary text-primary-foreground py-2 rounded-lg font-medium"
          >
            Create Party
          </button>
          <button 
            type="button" 
            className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  ),
  args: {
    onError: action('error-caught'),
    showErrorDetails: false,
    allowRetry: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Error boundary protecting form components with graceful degradation',
      },
    },
  },
};

export const InPageLayout: Story = {
  render: (args) => (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">Watchify</h1>
          <div className="flex items-center space-x-4">
            <button className="px-4 py-2 bg-primary text-primary-foreground rounded">
              Login
            </button>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto p-6">
        <ErrorBoundary {...args}>
          <ErrorTypes errorType="permission" />
        </ErrorBoundary>
      </main>
      
      <footer className="bg-card border-t px-6 py-4 mt-auto">
        <div className="text-center text-sm text-muted-foreground">
          © 2024 Watchify. All rights reserved.
        </div>
      </footer>
    </div>
  ),
  args: {
    onError: action('error-caught'),
    showErrorDetails: false,
    allowRetry: true,
  },
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story: 'Error boundary protecting entire page sections',
      },
    },
  },
};

// Custom fallback
export const WithCustomFallback: Story = {
  args: {
    onError: action('error-caught'),
    showErrorDetails: false,
    allowRetry: true,
    fallback: ({ error, retry }) => (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <div className="text-red-600 mb-4">
          <svg className="w-12 h-12 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-red-800 mb-2">
          Oops! Something went wrong
        </h3>
        <p className="text-red-600 mb-4">
          We encountered an error while loading this content.
        </p>
        <div className="space-x-3">
          <button 
            onClick={retry}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Try Again
          </button>
          <button className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300">
            Go Home
          </button>
        </div>
      </div>
    ),
    children: <ThrowError shouldThrow={true} />,
  },
  parameters: {
    docs: {
      description: {
        story: 'Error boundary with custom fallback UI component',
      },
    },
  },
};

// Nested error boundaries
export const NestedErrorBoundaries: Story = {
  render: () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ErrorBoundary
          onError={action('widget1-error')}
          showErrorDetails={false}
          allowRetry={true}
        >
          <div className="bg-card border rounded-lg p-6">
            <h3 className="font-semibold mb-4">Recent Movies</h3>
            <ThrowError shouldThrow={false} />
          </div>
        </ErrorBoundary>
        
        <ErrorBoundary
          onError={action('widget2-error')}
          showErrorDetails={false}
          allowRetry={true}
        >
          <div className="bg-card border rounded-lg p-6">
            <h3 className="font-semibold mb-4">Watch Parties</h3>
            <ErrorTypes errorType="network" />
          </div>
        </ErrorBoundary>
        
        <ErrorBoundary
          onError={action('widget3-error')}
          showErrorDetails={false}
          allowRetry={true}
        >
          <div className="bg-card border rounded-lg p-6">
            <h3 className="font-semibold mb-4">Recommendations</h3>
            <ThrowError shouldThrow={false} />
          </div>
        </ErrorBoundary>
        
        <ErrorBoundary
          onError={action('widget4-error')}
          showErrorDetails={false}
          allowRetry={true}
        >
          <div className="bg-card border rounded-lg p-6">
            <h3 className="font-semibold mb-4">Friends Activity</h3>
            <ThrowError shouldThrow={false} />
          </div>
        </ErrorBoundary>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Multiple independent error boundaries protecting different sections',
      },
    },
  },
};