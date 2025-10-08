/**
 * DateTimePicker Stories
 * Storybook documentation for DateTimePicker molecule component
 */

import type { Meta, StoryObj } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { DateTimePicker } from '../DateTimePicker';

const meta = {
  title: 'Molecules/DateTimePicker',
  component: DateTimePicker,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A combined date and time picker component for scheduling watch parties. Allows users to select both date and time in a single interface.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: 'date',
      description: 'The currently selected date and time',
    },
    onChange: {
      action: 'onChange',
      description: 'Callback fired when the date/time value changes',
    },
    minDate: {
      control: 'date',
      description: 'The minimum selectable date',
    },
    maxDate: {
      control: 'date',
      description: 'The maximum selectable date',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the picker is disabled',
    },
    required: {
      control: 'boolean',
      description: 'Whether a value is required',
    },
  },
} satisfies Meta<typeof DateTimePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

// Helper to create dates
const createDate = (daysFromNow: number, hour: number = 20, minute: number = 0) => {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  date.setHours(hour, minute, 0, 0);
  return date;
};

// Default story
export const Default: Story = {
  args: {
    value: createDate(1), // Tomorrow at 8 PM
    onChange: action('date-time-changed'),
  },
};

// Different states
export const Empty: Story = {
  args: {
    value: undefined,
    onChange: action('date-time-changed'),
  },
  parameters: {
    docs: {
      description: {
        story: 'Date time picker with no initial value',
      },
    },
  },
};

export const WithMinDate: Story = {
  args: {
    value: createDate(2),
    onChange: action('date-time-changed'),
    minDate: new Date(), // Today
  },
  parameters: {
    docs: {
      description: {
        story: 'Date picker with minimum date set to today (past dates disabled)',
      },
    },
  },
};

export const WithMaxDate: Story = {
  args: {
    value: createDate(7),
    onChange: action('date-time-changed'),
    maxDate: createDate(30), // 30 days from now
  },
  parameters: {
    docs: {
      description: {
        story: 'Date picker with maximum date set to 30 days from now',
      },
    },
  },
};

export const WithDateRange: Story = {
  args: {
    value: createDate(3),
    onChange: action('date-time-changed'),
    minDate: new Date(),
    maxDate: createDate(14), // 2 weeks from now
  },
  parameters: {
    docs: {
      description: {
        story: 'Date picker with both minimum (today) and maximum (2 weeks) date constraints',
      },
    },
  },
};

export const Disabled: Story = {
  args: {
    value: createDate(1),
    onChange: action('date-time-changed'),
    disabled: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Disabled date time picker',
      },
    },
  },
};

export const Required: Story = {
  args: {
    value: undefined,
    onChange: action('date-time-changed'),
    required: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Required date time picker (shows validation when empty)',
      },
    },
  },
};

// In different contexts
export const InWatchPartyForm = {
  render: (args: any) => (
    <div className="bg-card border rounded-lg p-6 w-96">
      <form className="space-y-6">
        <div>
          <h2 className="text-lg font-semibold mb-4">Create Watch Party</h2>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Movie</label>
          <div className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
            <div className="w-12 h-16 bg-purple-600 rounded"></div>
            <div>
              <p className="font-medium">The Dark Knight</p>
              <p className="text-sm text-muted-foreground">2008 • 2h 32m</p>
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Watch Party Date & Time</label>
          <DateTimePicker {...args} />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Description (Optional)</label>
          <textarea 
            placeholder="Add details about your watch party..."
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
    value: createDate(1, 20, 0),
    onChange: action('date-time-changed'),
    minDate: new Date(),
    required: true,
  },
  parameters: {
    layout: 'padded',
  },
};

export const InScheduleModal = {
  render: (args: any) => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-background border rounded-lg p-6 w-full max-w-md">
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-xl font-semibold">Schedule Your Movie Night</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Choose when you want to watch together
            </p>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Date & Time</label>
              <DateTimePicker {...args} />
              <p className="text-xs text-muted-foreground">
                All times are in your local timezone
              </p>
            </div>
            
            <div className="bg-muted rounded-lg p-4">
              <div className="flex items-center space-x-2 text-sm">
                <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <span>Invites will be sent once you confirm the time</span>
              </div>
            </div>
          </div>
          
          <div className="flex space-x-3">
            <button className="flex-1 bg-primary text-primary-foreground py-2 rounded-lg">
              Schedule Party
            </button>
            <button className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  ),
  args: {
    value: createDate(3, 19, 30),
    onChange: action('date-time-changed'),
    minDate: new Date(),
  },
  parameters: {
    layout: 'fullscreen',
  },
};

export const InEditMode = {
  render: (args: any) => (
    <div className="bg-card border rounded-lg p-4 w-80">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-medium">Upcoming Watch Party</h3>
          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
            Scheduled
          </span>
        </div>
        
        <div className="space-y-3">
          <div>
            <p className="text-sm font-medium">Movie:</p>
            <p className="text-sm text-muted-foreground">Inception (2010)</p>
          </div>
          
          <div>
            <p className="text-sm font-medium mb-2">Current Time:</p>
            <div className="text-sm text-muted-foreground mb-2">
              {args.value?.toLocaleDateString()} at {args.value?.toLocaleTimeString()}
            </div>
            <DateTimePicker {...args} />
          </div>
          
          <div className="flex space-x-2">
            <button className="flex-1 text-sm bg-primary text-primary-foreground py-1.5 rounded">
              Update
            </button>
            <button className="px-3 text-sm bg-secondary text-secondary-foreground py-1.5 rounded">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  ),
  args: {
    value: createDate(5, 21, 0),
    onChange: action('date-time-changed'),
    minDate: new Date(),
  },
  parameters: {
    layout: 'padded',
  },
};

// Different time formats
export const CommonTimes = {
  render: () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Popular Watch Party Times</h3>
      <div className="grid gap-4">
        <div className="flex items-center justify-between p-3 bg-card border rounded-lg">
          <span className="text-sm">Tonight at 8:00 PM</span>
          <DateTimePicker 
            value={createDate(0, 20, 0)}
            onChange={action('tonight-changed')}
          />
        </div>
        <div className="flex items-center justify-between p-3 bg-card border rounded-lg">
          <span className="text-sm">Tomorrow at 7:30 PM</span>
          <DateTimePicker 
            value={createDate(1, 19, 30)}
            onChange={action('tomorrow-changed')}
          />
        </div>
        <div className="flex items-center justify-between p-3 bg-card border rounded-lg">
          <span className="text-sm">This Weekend at 2:00 PM</span>
          <DateTimePicker 
            value={createDate(6, 14, 0)}
            onChange={action('weekend-changed')}
          />
        </div>
        <div className="flex items-center justify-between p-3 bg-card border rounded-lg">
          <span className="text-sm">Next Friday at 9:00 PM</span>
          <DateTimePicker 
            value={createDate(12, 21, 0)}
            onChange={action('friday-changed')}
          />
        </div>
      </div>
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};