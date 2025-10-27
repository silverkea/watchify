/**
 * Input Stories
 * Storybook documentation for Input atom component
 */

import type { Meta, StoryObj } from '@storybook/react';
import { Input } from './index';

const meta: Meta<typeof Input> = {
  title: 'Atoms/Input',
  component: Input,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A form input component with multiple variants, validation states, and accessibility features.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'error', 'success', 'neon'],
      description: 'Visual style variant of the input',
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
      description: 'Size of the input',
    },
    type: {
      control: { type: 'select' },
      options: ['text', 'email', 'password', 'search', 'url', 'tel'],
      description: 'HTML input type',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text',
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the input when true',
    },
    error: {
      control: 'text',
      description: 'Error message to display',
    },
    label: {
      control: 'text',
      description: 'Label text for the input',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: 'Enter text...',
    variant: 'default',
  },
};

export const Success: Story = {
  args: {
    placeholder: 'Success input',
    variant: 'success',
  },
};

export const Neon: Story = {
  args: {
    placeholder: 'Neon input',
    variant: 'neon',
  },
};

export const WithLabel: Story = {
  args: {
    label: 'Email Address',
    placeholder: 'Enter your email',
    type: 'email',
  },
};

export const WithError: Story = {
  args: {
    label: 'Email Address',
    placeholder: 'Enter your email',
    type: 'email',
    error: 'Please enter a valid email address',
    value: 'invalid-email',
  },
};

export const Disabled: Story = {
  args: {
    placeholder: 'Disabled input',
    disabled: true,
    value: 'Cannot edit this',
  },
};

export const Password: Story = {
  args: {
    label: 'Password',
    type: 'password',
    placeholder: 'Enter your password',
  },
};

export const Search: Story = {
  args: {
    type: 'search',
    placeholder: 'Search movies...',
    variant: 'neon',
  },
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-80">
      <Input size="sm" placeholder="Small input" />
      <Input size="md" placeholder="Medium input" />
      <Input size="lg" placeholder="Large input" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'All available input sizes displayed together.',
      },
    },
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-80">
      <Input variant="default" placeholder="Default variant" />
      <Input variant="success" placeholder="Success variant" />
      <Input variant="neon" placeholder="Neon variant" />
      <Input variant="error" placeholder="Error variant" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'All input variants displayed together.',
      },
    },
  },
};

export const FormExample: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-80">
      <Input 
        label="Full Name" 
        placeholder="Enter your full name"
        type="text"
      />
      <Input 
        label="Email Address" 
        placeholder="Enter your email"
        type="email"
      />
      <Input 
        label="Password" 
        placeholder="Enter your password"
        type="password"
      />
      <Input 
        label="Search Movies" 
        placeholder="Search for movies..."
        type="search"
        variant="neon"
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Real-world form example showing different input types and use cases.',
      },
    },
  },
};