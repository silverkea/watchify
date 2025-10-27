/**
 * Introduction Stories
 * Welcome page and component library overview for Watchify Storybook
 */

import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta = {
  title: 'Introduction/Welcome',
  parameters: {
    layout: 'fullscreen',
    docs: {
      page: () => (
        <div className="max-w-4xl mx-auto p-8">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-purple-600 rounded-lg flex items-center justify-center mr-4">
                <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 6a2 2 0 012-2h6l2 2h6a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM5 8a1 1 0 011-1h1a1 1 0 110 2H6a1 1 0 01-1-1zm6 0a1 1 0 011-1h3a1 1 0 110 2h-3a1 1 0 01-1-1z"/>
                </svg>
              </div>
              <h1 className="text-4xl font-bold text-gray-900">Watchify Design System</h1>
            </div>
            <p className="text-xl text-gray-600 mb-8">
              A comprehensive component library built with atomic design principles for the Watchify movie discovery platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mb-4">
                <span className="text-white font-bold">A</span>
              </div>
              <h3 className="text-lg font-semibold text-blue-900 mb-2">Atoms</h3>
              <p className="text-blue-700 text-sm mb-3">Basic building blocks like buttons, inputs, and badges.</p>
              <ul className="text-xs text-blue-600 space-y-1">
                <li>• Button</li>
                <li>• Badge</li>
                <li>• Input</li>
                <li>• ThemeToggle</li>
              </ul>
            </div>

            <div className="bg-green-50 p-6 rounded-lg border border-green-200">
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mb-4">
                <span className="text-white font-bold">M</span>
              </div>
              <h3 className="text-lg font-semibold text-green-900 mb-2">Molecules</h3>
              <p className="text-green-700 text-sm mb-3">Simple combinations of atoms working together.</p>
              <ul className="text-xs text-green-600 space-y-1">
                <li>• SearchBox</li>
                <li>• MovieCard</li>
                <li>• CountdownTimer</li>
                <li>• GenreFilter</li>
              </ul>
            </div>

            <div className="bg-orange-50 p-6 rounded-lg border border-orange-200">
              <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center mb-4">
                <span className="text-white font-bold">O</span>
              </div>
              <h3 className="text-lg font-semibold text-orange-900 mb-2">Organisms</h3>
              <p className="text-orange-700 text-sm mb-3">Complex components made of molecules and atoms.</p>
              <ul className="text-xs text-orange-600 space-y-1">
                <li>• Header</li>
                <li>• MovieGrid</li>
                <li>• Navigation</li>
              </ul>
            </div>

            <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
              <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mb-4">
                <span className="text-white font-bold">T</span>
              </div>
              <h3 className="text-lg font-semibold text-purple-900 mb-2">Templates</h3>
              <p className="text-purple-700 text-sm mb-3">Page layouts combining organisms and molecules.</p>
              <ul className="text-xs text-purple-600 space-y-1">
                <li>• HomePage</li>
                <li>• MovieDetailsPage</li>
                <li>• WatchPartyPage</li>
              </ul>
            </div>
          </div>

          <div className="bg-gray-50 p-8 rounded-lg mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Design Principles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Consistency</h3>
                <p className="text-gray-600 text-sm">
                  All components follow consistent patterns for spacing, typography, colors, and interactions.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Accessibility</h3>
                <p className="text-gray-600 text-sm">
                  Built with accessibility in mind, supporting keyboard navigation, screen readers, and WCAG guidelines.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Responsiveness</h3>
                <p className="text-gray-600 text-sm">
                  Components adapt gracefully across different screen sizes and devices.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Theming</h3>
                <p className="text-gray-600 text-sm">
                  Dark and light theme support with consistent color schemes and proper contrast ratios.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-blue-900 text-white p-8 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Getting Started</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">1. Explore Components</h3>
                <p className="text-blue-200 text-sm">
                  Browse through atoms, molecules, and organisms to understand available components.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">2. View Examples</h3>
                <p className="text-blue-200 text-sm">
                  Each component includes multiple examples showing different variants and use cases.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">3. Check Documentation</h3>
                <p className="text-blue-200 text-sm">
                  Read the auto-generated documentation for props, variants, and implementation details.
                </p>
              </div>
            </div>
          </div>
        </div>
      ),
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Welcome: Story = {
  render: () => (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-8">
      <div className="max-w-2xl text-center">
        <div className="flex items-center justify-center mb-8">
          <div className="w-20 h-20 bg-purple-600 rounded-2xl flex items-center justify-center mr-6 shadow-xl">
            <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 6a2 2 0 012-2h6l2 2h6a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM5 8a1 1 0 011-1h1a1 1 0 110 2H6a1 1 0 01-1-1zm6 0a1 1 0 011-1h3a1 1 0 110 2h-3a1 1 0 01-1-1z"/>
            </svg>
          </div>
          <div>
            <h1 className="text-5xl font-bold text-gray-900 mb-2">Watchify</h1>
            <p className="text-xl text-purple-600 font-semibold">Design System</p>
          </div>
        </div>
        
        <p className="text-xl text-gray-600 mb-8 leading-relaxed">
          Welcome to the Watchify component library! This Storybook contains all the building blocks 
          for creating consistent, accessible, and beautiful user interfaces.
        </p>
        
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Quick Navigation</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="text-left">
              <p className="font-semibold text-blue-600 mb-1">Atoms</p>
              <p className="text-gray-600">Basic UI elements</p>
            </div>
            <div className="text-left">
              <p className="font-semibold text-green-600 mb-1">Molecules</p>
              <p className="text-gray-600">Combined components</p>
            </div>
            <div className="text-left">
              <p className="font-semibold text-orange-600 mb-1">Organisms</p>
              <p className="text-gray-600">Complex interfaces</p>
            </div>
            <div className="text-left">
              <p className="font-semibold text-purple-600 mb-1">Templates</p>
              <p className="text-gray-600">Page layouts</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
};