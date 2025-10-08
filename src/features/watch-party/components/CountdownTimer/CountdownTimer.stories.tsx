/**
 * CountdownTimer Stories
 * Storybook documentation for CountdownTimer molecule component
 */

import type { Meta, StoryObj } from '@storybook/react';
import { CountdownTimer } from '../CountdownTimer';

const meta = {
  title: 'Molecules/CountdownTimer',
  component: CountdownTimer,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A real-time countdown timer that displays the time remaining until a watch party starts. Shows days, hours, minutes, and seconds with automatic updates.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    targetDate: {
      control: 'date',
      description: 'The target date and time for the countdown',
    },
  },
} satisfies Meta<typeof CountdownTimer>;

export default meta;
type Story = StoryObj<typeof meta>;

// Helper to create future dates
const createFutureDate = (minutesFromNow: number) => {
  const date = new Date();
  date.setMinutes(date.getMinutes() + minutesFromNow);
  return date;
};

// Default story - 1 hour from now
export const Default: Story = {
  args: {
    targetDate: createFutureDate(60),
  },
};

// Different time ranges
export const FiveMinutesRemaining: Story = {
  args: {
    targetDate: createFutureDate(5),
  },
  parameters: {
    docs: {
      description: {
        story: 'Countdown with only 5 minutes remaining - shows urgency',
      },
    },
  },
};

export const ThirtySecondsRemaining: Story = {
  args: {
    targetDate: createFutureDate(0.5), // 30 seconds
  },
  parameters: {
    docs: {
      description: {
        story: 'Final countdown with less than a minute remaining',
      },
    },
  },
};

export const InWatchPartyCard = {
  render: (args: any) => (
    <div className="bg-card border rounded-lg p-6 w-80">
      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
          </div>
          <div>
            <h3 className="font-semibold">The Avengers</h3>
            <p className="text-sm text-muted-foreground">Action • 2012 • 2h 23m</p>
          </div>
        </div>
        
        <div className="space-y-2">
          <p className="text-sm font-medium">Watch party starts in:</p>
          <CountdownTimer {...args} />
        </div>
        
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>Hosted by John</span>
          <span>5 joined</span>
        </div>
      </div>
    </div>
  ),
  args: {
    targetDate: createFutureDate(45),
  },
  parameters: {
    layout: 'padded',
  },
};