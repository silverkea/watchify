/**
 * Input Stories
 * Storybook documentation for Input atom component
 */

import type { Meta, StoryObj } from '@storybook/react';
import { Input } from './index';
import { Search, Mail, Lock, User, Calendar } from 'lucide-react';

const meta = {
  title: 'Atoms/Input',
  component: Input,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A flexible input component with support for different types, states, and icon integration. Built with accessibility and form handling in mind.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: { type: 'select' },
      options: ['text', 'email', 'password', 'search', 'date', 'time', 'datetime-local'],
      description: 'HTML input type',
    },
    placeholder: {
      control: { type: 'text' },
      description: 'Placeholder text',
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Whether the input is disabled',
    },
    required: {
      control: { type: 'boolean' },
      description: 'Whether the input is required',
    },
    value: {
      control: { type: 'text' },
      description: 'Input value',
    },
    onChange: { action: 'changed' },
    onFocus: { action: 'focused' },
    onBlur: { action: 'blurred' },
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

// Basic Inputs
export const Default: Story = {
  args: {
    type: 'text',
    placeholder: 'Enter text...',
  },
};

export const WithValue: Story = {
  args: {
    type: 'text',
    placeholder: 'Enter text...',
    value: 'Sample text content',
  },
};

export const Disabled: Story = {
  args: {
    type: 'text',
    placeholder: 'This input is disabled',
    disabled: true,
  },
};

export const Required: Story = {
  args: {
    type: 'text',
    placeholder: 'This field is required',
    required: true,
  },
};

// Input Types
export const SearchInput: Story = {
  args: {
    type: 'search',
    placeholder: 'Search for movies...',
  },
};

export const EmailInput: Story = {
  args: {
    type: 'email',
    placeholder: 'your@email.com',
  },
};

export const PasswordInput: Story = {
  args: {
    type: 'password',
    placeholder: 'Enter your password',
  },
};

export const DateInput: Story = {
  args: {
    type: 'date',
  },
};

export const TimeInput: Story = {
  args: {
    type: 'time',
    value: '20:00',
  },
};

export const DateTimeInput: Story = {
  args: {
    type: 'datetime-local',
  },
};

// Movie-specific Examples
export const MovieSearch = {
  render: (args) => (
    <div className="w-80 space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">Movie Search</label>
        <Input
          {...args}
          type="search"
          placeholder="Search for movies, actors, directors..."
        />
      </div>
    </div>
  ),
  args: {
    onChange: (e) => console.log('Searching for:', e.target.value),
  },
};

export const WatchPartyForm = {
  render: () => (
    <div className="w-80 space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">Party Name</label>
        <Input
          type="text"
          placeholder="Friday Night Movies"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">Date</label>
        <Input
          type="date"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">Time</label>
        <Input
          type="time"
          value="20:00"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">Invite Email</label>
        <Input
          type="email"
          placeholder="friend@example.com"
        />
      </div>
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};

// With Icons (using render function since Input doesn't have built-in icon support)
export const WithIcons = {
  render: () => (
    <div className="w-80 space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          type="search"
          placeholder="Search movies..."
          className="pl-10"
        />
      </div>
      <div className="relative">
        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          type="email"
          placeholder="Email address"
          className="pl-10"
        />
      </div>
      <div className="relative">
        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          type="password"
          placeholder="Password"
          className="pl-10"
        />
      </div>
      <div className="relative">
        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          type="text"
          placeholder="Username"
          className="pl-10"
        />
      </div>
      <div className="relative">
        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          type="date"
          className="pl-10"
        />
      </div>
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};

// States Showcase
export const AllStates = {
  render: () => (
    <div className="w-80 space-y-3">
      <Input placeholder="Normal state" />
      <Input placeholder="Focused state" autoFocus />
      <Input placeholder="Disabled state" disabled />
      <Input placeholder="Required field" required />
      <Input placeholder="With value" value="Sample content" />
      <Input placeholder="Search input" type="search" />
      <Input placeholder="Email input" type="email" />
      <Input type="date" />
      <Input type="time" value="20:00" />
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};

// Interactive Example
export const Interactive: Story = {
  render: (args) => (
    <div className="w-80">
      <label className="block text-sm font-medium mb-2">
        Interactive Movie Search
      </label>
      <Input {...args} />
      <p className="text-xs text-gray-500 mt-1">
        Type something and check the Actions panel
      </p>
    </div>
  ),
  args: {
    type: 'search',
    placeholder: 'Search for your favorite movie...',
    onChange: (e) => console.log('Search query:', e.target.value),
    onFocus: () => console.log('Input focused'),
    onBlur: () => console.log('Input blurred'),
  },
};