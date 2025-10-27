/**
 * CountdownTimer Stories
 * Storybook documentation for CountdownTimer molecule component
 */

import type { Meta, StoryObj } from '@storybook/react';
import { CountdownTimer } from './CountdownTimer';

const meta: Meta<typeof CountdownTimer> = {
  title: 'Molecules/CountdownTimer',
  component: CountdownTimer,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A real-time countdown timer for watch party start times. Displays days, hours, minutes, and seconds with visual urgency indicators.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    targetDate: {
      control: 'date',
      description: 'The target date/time for countdown',
    },
    variant: {
      control: { type: 'select' },
      options: ['default', 'compact', 'neon'],
      description: 'Visual style variant of the countdown timer',
    },
    showLabels: {
      control: 'boolean',
      description: 'Show time unit labels (Days, Hours, etc.)',
    },
    showIcon: {
      control: 'boolean',
      description: 'Show clock icon',
    },
    onTimeUp: {
      action: 'timeUp',
      description: 'Callback when countdown reaches zero',
    },
    onTick: {
      action: 'tick',
      description: 'Callback on each second tick with time data',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Helper function to create future dates
const getFutureDate = (minutes: number) => {
  const date = new Date();
  date.setMinutes(date.getMinutes() + minutes);
  return date.toISOString();
};

export const Default: Story = {
  args: {
    targetDate: getFutureDate(65), // 1 hour 5 minutes from now
    variant: 'default',
    showLabels: true,
    showIcon: true,
  },
};

export const Compact: Story = {
  args: {
    targetDate: getFutureDate(30), // 30 minutes from now
    variant: 'compact',
    showLabels: false,
    showIcon: true,
  },
};

export const Neon: Story = {
  args: {
    targetDate: getFutureDate(120), // 2 hours from now
    variant: 'neon',
    showLabels: true,
    showIcon: true,
  },
};

export const LongCountdown: Story = {
  args: {
    targetDate: getFutureDate(2880), // 2 days from now
    variant: 'default',
    showLabels: true,
    showIcon: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Countdown with days displayed - shows how the timer handles longer durations.',
      },
    },
  },
};

export const UrgentCountdown: Story = {
  args: {
    targetDate: getFutureDate(3), // 3 minutes from now
    variant: 'default',
    showLabels: true,
    showIcon: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Urgent countdown showing color changes and progress bar for final hour.',
      },
    },
  },
};

export const ExpiredCountdown: Story = {
  args: {
    targetDate: new Date(Date.now() - 60000).toISOString(), // 1 minute ago
    variant: 'default',
    showLabels: true,
    showIcon: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows the expired state when the target time has passed.',
      },
    },
  },
};

export const WithoutLabels: Story = {
  args: {
    targetDate: getFutureDate(45),
    variant: 'default',
    showLabels: false,
    showIcon: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Timer without time unit labels for a cleaner look.',
      },
    },
  },
};

export const WithoutIcon: Story = {
  args: {
    targetDate: getFutureDate(25),
    variant: 'default',
    showLabels: true,
    showIcon: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Timer without the clock icon for minimal design.',
      },
    },
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-8 w-full max-w-4xl">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Default Variant</h3>
        <CountdownTimer 
          targetDate={getFutureDate(85)}
          variant="default"
          showLabels={true}
          showIcon={true}
        />
      </div>
      
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Compact Variant</h3>
        <CountdownTimer 
          targetDate={getFutureDate(45)}
          variant="compact"
          showLabels={false}
          showIcon={true}
        />
      </div>
      
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Neon Variant</h3>
        <CountdownTimer 
          targetDate={getFutureDate(125)}
          variant="neon"
          showLabels={true}
          showIcon={true}
        />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'All countdown timer variants displayed together.',
      },
    },
  },
};

export const UrgencyStates: Story = {
  render: () => (
    <div className="flex flex-col gap-6 w-full max-w-4xl">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-green-600">Normal (1+ hour)</h3>
        <CountdownTimer 
          targetDate={getFutureDate(75)}
          variant="default"
        />
      </div>
      
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-yellow-600">Moderate (&lt; 1 hour)</h3>
        <CountdownTimer 
          targetDate={getFutureDate(45)}
          variant="default"
        />
      </div>
      
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-orange-600">Urgent (&lt; 5 minutes)</h3>
        <CountdownTimer 
          targetDate={getFutureDate(3)}
          variant="default"
        />
      </div>
      
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-red-600">Critical (&lt; 1 minute)</h3>
        <CountdownTimer 
          targetDate={getFutureDate(0.5)}
          variant="default"
        />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Different urgency states showing color changes based on remaining time.',
      },
    },
  },
};

export const WatchPartyExample: Story = {
  render: () => (
    <div className="flex flex-col items-center gap-6 p-6 bg-gray-50 dark:bg-gray-900 rounded-lg">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Movie Night: Inception
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Get ready! The watch party starts in:
        </p>
      </div>
      
      <CountdownTimer 
        targetDate={getFutureDate(95)}
        variant="neon"
        showLabels={true}
        showIcon={true}
      />
      
      <div className="text-center text-sm text-gray-500 dark:text-gray-400">
        <p>Make sure you have snacks ready! 🍿</p>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Real-world example showing the countdown timer in a watch party context.',
      },
    },
    layout: 'fullscreen',
  },
};