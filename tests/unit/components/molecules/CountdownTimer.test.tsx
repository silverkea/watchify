import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { CountdownTimer } from '@/components/molecules/CountdownTimer/index';

describe('CountdownTimer Molecule', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('Rendering', () => {
    it('should be undefined initially (component not implemented)', () => {
      expect(CountdownTimer).toBeUndefined();
    });

    it('should render with future target date', () => {
      const futureDate = new Date(Date.now() + 3600000); // 1 hour from now
      render(<CountdownTimer targetDate={futureDate} />);
      
      expect(screen.getByLabelText(/countdown timer/i)).toBeInTheDocument();
      expect(screen.getByText(/until watch party/i)).toBeInTheDocument();
    });

    it('should display time segments correctly', () => {
      const targetDate = new Date(Date.now() + 90061000); // 1 day, 1 hour, 1 minute, 1 second
      render(<CountdownTimer targetDate={targetDate} />);
      
      expect(screen.getByText('1')).toBeInTheDocument(); // days
      expect(screen.getByText('01')).toBeInTheDocument(); // hours  
      expect(screen.getByText('01')).toBeInTheDocument(); // minutes
      expect(screen.getByText('01')).toBeInTheDocument(); // seconds
    });

    it('should render with different formats', () => {
      const futureDate = new Date(Date.now() + 3661000); // 1h 1m 1s
      
      const { rerender } = render(<CountdownTimer targetDate={futureDate} format="compact" />);
      expect(screen.getByText('1h 1m 1s')).toBeInTheDocument();

      rerender(<CountdownTimer targetDate={futureDate} format="full" />);
      expect(screen.getByText('1 hour, 1 minute, 1 second')).toBeInTheDocument();

      rerender(<CountdownTimer targetDate={futureDate} format="digital" />);
      expect(screen.getByText('01:01:01')).toBeInTheDocument();
    });

    it('should render with different sizes', () => {
      const futureDate = new Date(Date.now() + 3600000);
      
      const { rerender } = render(<CountdownTimer targetDate={futureDate} size="sm" />);
      expect(screen.getByLabelText(/countdown timer/i)).toHaveClass('text-sm');

      rerender(<CountdownTimer targetDate={futureDate} size="lg" />);
      expect(screen.getByLabelText(/countdown timer/i)).toHaveClass('text-4xl');
    });

    it('should show different states based on time remaining', () => {
      // Far future (calm state)
      const farFuture = new Date(Date.now() + 86400000); // 24 hours
      const { rerender } = render(<CountdownTimer targetDate={farFuture} />);
      expect(screen.getByLabelText(/countdown timer/i)).toHaveClass('text-green-600');

      // Near future (warning state)
      const nearFuture = new Date(Date.now() + 900000); // 15 minutes  
      rerender(<CountdownTimer targetDate={nearFuture} />);
      expect(screen.getByLabelText(/countdown timer/i)).toHaveClass('text-yellow-600');

      // Very near (urgent state)
      const veryNear = new Date(Date.now() + 60000); // 1 minute
      rerender(<CountdownTimer targetDate={veryNear} />);
      expect(screen.getByLabelText(/countdown timer/i)).toHaveClass('text-red-600');
    });

    it('should show expired state when target date has passed', () => {
      const pastDate = new Date(Date.now() - 3600000); // 1 hour ago
      render(<CountdownTimer targetDate={pastDate} />);
      
      expect(screen.getByText(/watch party has started/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/countdown timer/i)).toHaveClass('text-red-600');
    });

    it('should render custom labels', () => {
      const futureDate = new Date(Date.now() + 3661000);
      render(
        <CountdownTimer 
          targetDate={futureDate} 
          labels={{
            days: 'D',
            hours: 'H', 
            minutes: 'M',
            seconds: 'S'
          }}
        />
      );
      
      expect(screen.getByText('D')).toBeInTheDocument();
      expect(screen.getByText('H')).toBeInTheDocument();
      expect(screen.getByText('M')).toBeInTheDocument();
      expect(screen.getByText('S')).toBeInTheDocument();
    });
  });

  describe('Timer Functionality', () => {
    it('should update countdown every second', () => {
      const targetDate = new Date(Date.now() + 5000); // 5 seconds from now
      render(<CountdownTimer targetDate={targetDate} />);
      
      // Initial state - should show 5 seconds
      expect(screen.getByText('05')).toBeInTheDocument();
      
      // Advance timer by 1 second
      act(() => {
        jest.advanceTimersByTime(1000);
      });
      
      // Should now show 4 seconds
      expect(screen.getByText('04')).toBeInTheDocument();
    });

    it('should call onComplete when countdown reaches zero', () => {
      const onComplete = jest.fn();
      const targetDate = new Date(Date.now() + 1000); // 1 second from now
      
      render(<CountdownTimer targetDate={targetDate} onComplete={onComplete} />);
      
      // Advance timer to completion
      act(() => {
        jest.advanceTimersByTime(1000);
      });
      
      expect(onComplete).toHaveBeenCalled();
    });

    it('should call onTick callback every second', () => {
      const onTick = jest.fn();
      const targetDate = new Date(Date.now() + 3000);
      
      render(<CountdownTimer targetDate={targetDate} onTick={onTick} />);
      
      act(() => {
        jest.advanceTimersByTime(1000);
      });
      
      expect(onTick).toHaveBeenCalledWith({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 2,
        isExpired: false
      });
    });

    it('should clean up timer on unmount', () => {
      const targetDate = new Date(Date.now() + 5000);
      const { unmount } = render(<CountdownTimer targetDate={targetDate} />);
      
      // Spy on clearInterval
      const clearIntervalSpy = jest.spyOn(global, 'clearInterval');
      
      unmount();
      
      expect(clearIntervalSpy).toHaveBeenCalled();
      clearIntervalSpy.mockRestore();
    });

    it('should update when target date prop changes', () => {
      const initialTarget = new Date(Date.now() + 5000);
      const { rerender } = render(<CountdownTimer targetDate={initialTarget} />);
      
      expect(screen.getByText('05')).toBeInTheDocument();
      
      const newTarget = new Date(Date.now() + 10000);
      rerender(<CountdownTimer targetDate={newTarget} />);
      
      expect(screen.getByText('10')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA attributes', () => {
      const futureDate = new Date(Date.now() + 3600000);
      render(<CountdownTimer targetDate={futureDate} />);
      
      const timer = screen.getByLabelText(/countdown timer/i);
      expect(timer).toHaveAttribute('role', 'timer');
      expect(timer).toHaveAttribute('aria-live', 'polite');
    });

    it('should announce time remaining to screen readers', () => {
      const futureDate = new Date(Date.now() + 3661000); // 1h 1m 1s
      render(<CountdownTimer targetDate={futureDate} />);
      
      const timer = screen.getByLabelText(/countdown timer/i);
      expect(timer).toHaveAttribute('aria-label', expect.stringContaining('1 hour, 1 minute, 1 second remaining'));
    });

    it('should announce completion to screen readers', () => {
      const pastDate = new Date(Date.now() - 1000);
      render(<CountdownTimer targetDate={pastDate} />);
      
      const timer = screen.getByLabelText(/countdown timer/i);
      expect(timer).toHaveAttribute('aria-label', 'Watch party has started');
    });

    it('should have proper color contrast in all states', () => {
      const futureDate = new Date(Date.now() + 3600000);
      render(<CountdownTimer targetDate={futureDate} />);
      
      const timer = screen.getByLabelText(/countdown timer/i);
      // Should have high contrast colors
      expect(timer).toHaveClass('text-green-600');
    });
  });

  describe('Visual Effects', () => {
    it('should pulse when time is running low', () => {
      const nearFuture = new Date(Date.now() + 30000); // 30 seconds
      render(<CountdownTimer targetDate={nearFuture} />);
      
      const timer = screen.getByLabelText(/countdown timer/i);
      expect(timer).toHaveClass('animate-pulse');
    });

    it('should have smooth transitions between states', () => {
      const futureDate = new Date(Date.now() + 3600000);
      render(<CountdownTimer targetDate={futureDate} />);
      
      const timer = screen.getByLabelText(/countdown timer/i);
      expect(timer).toHaveClass('transition-colors', 'duration-300');
    });

    it('should show celebration effect when completed', () => {
      const onComplete = jest.fn();
      const targetDate = new Date(Date.now() + 1000);
      
      render(<CountdownTimer targetDate={targetDate} onComplete={onComplete} showCelebration />);
      
      act(() => {
        jest.advanceTimersByTime(1000);
      });
      
      expect(screen.getByTestId('celebration-effect')).toBeInTheDocument();
    });
  });

  describe('Theme Integration', () => {
    it('should adapt to dark/light themes', () => {
      const futureDate = new Date(Date.now() + 3600000);
      render(<CountdownTimer targetDate={futureDate} />);
      
      const timer = screen.getByLabelText(/countdown timer/i);
      expect(timer).toHaveClass('dark:text-green-400');
    });

    it('should support neon variant', () => {
      const futureDate = new Date(Date.now() + 3600000);
      render(<CountdownTimer targetDate={futureDate} variant="neon" />);
      
      const timer = screen.getByLabelText(/countdown timer/i);
      expect(timer).toHaveClass('text-purple-500', 'glow-purple');
    });
  });

  describe('Performance', () => {
    it('should not update when timer is paused', () => {
      const targetDate = new Date(Date.now() + 5000);
      render(<CountdownTimer targetDate={targetDate} paused />);
      
      const initialSeconds = screen.getByText('05');
      
      act(() => {
        jest.advanceTimersByTime(1000);
      });
      
      // Should still show 5 seconds when paused
      expect(initialSeconds).toBeInTheDocument();
    });

    it('should minimize re-renders with memo', () => {
      const targetDate = new Date(Date.now() + 5000);
      const { rerender } = render(<CountdownTimer targetDate={targetDate} />);
      
      // Same props should not cause re-render
      rerender(<CountdownTimer targetDate={targetDate} />);
      
      // Component should be memoized
    });

    it('should handle rapid prop changes gracefully', () => {
      const initialTarget = new Date(Date.now() + 5000);
      const { rerender } = render(<CountdownTimer targetDate={initialTarget} />);
      
      // Rapid target date changes
      for (let i = 0; i < 10; i++) {
        const newTarget = new Date(Date.now() + (5000 + i * 1000));
        rerender(<CountdownTimer targetDate={newTarget} />);
      }
      
      // Should handle gracefully without errors
      expect(screen.getByLabelText(/countdown timer/i)).toBeInTheDocument();
    });
  });

  describe('Custom Formatting', () => {
    it('should support custom formatters', () => {
      const targetDate = new Date(Date.now() + 3661000); // 1h 1m 1s
      const customFormatter = jest.fn(() => 'Custom: 1:01:01');
      
      render(<CountdownTimer targetDate={targetDate} formatter={customFormatter} />);
      
      expect(customFormatter).toHaveBeenCalledWith({
        days: 0,
        hours: 1,
        minutes: 1,
        seconds: 1,
        isExpired: false
      });
      
      expect(screen.getByText('Custom: 1:01:01')).toBeInTheDocument();
    });

    it('should hide zero segments when configured', () => {
      const targetDate = new Date(Date.now() + 61000); // 1m 1s (no hours/days)
      render(<CountdownTimer targetDate={targetDate} hideZeroSegments />);
      
      // Should not show days or hours
      expect(screen.queryByText('00')).not.toBeInTheDocument();
      expect(screen.getByText('01')).toBeInTheDocument(); // minutes
      expect(screen.getByText('01')).toBeInTheDocument(); // seconds
    });
  });
});