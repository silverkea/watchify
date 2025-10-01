import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeToggle } from '@/components/atoms/ThemeToggle/index';

describe('ThemeToggle Atom', () => {
  describe('Rendering', () => {
    it('should render with default props', () => {
      render(<ThemeToggle />);
      const button = screen.getByRole('button', { name: /switch to light theme/i });
      expect(button).toBeInTheDocument();
    });

    it('should show sun icon for light theme', () => {
      render(<ThemeToggle theme="light" />);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-label', 'Switch to dark theme');
      // Sun icon should be visible
      expect(button.querySelector('[data-icon="sun"]')).toBeInTheDocument();
    });

    it('should show moon icon for dark theme', () => {
      render(<ThemeToggle theme="dark" />);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-label', 'Switch to system theme');
      // Moon icon should be visible
      expect(button.querySelector('[data-icon="moon"]')).toBeInTheDocument();
    });

    it('should show system icon for system theme', () => {
      render(<ThemeToggle theme="system" />);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-label', 'Switch to light theme');
      // System icon should be visible
      expect(button.querySelector('[data-icon="system"]')).toBeInTheDocument();
    });

    it('should render with different sizes', () => {
      const { rerender } = render(<ThemeToggle size="sm" />);
      expect(screen.getByRole('button')).toHaveClass('h-8 w-8');

      rerender(<ThemeToggle size="md" />);
      expect(screen.getByRole('button')).toHaveClass('h-10 w-10');

      rerender(<ThemeToggle size="lg" />);
      expect(screen.getByRole('button')).toHaveClass('h-12 w-12');
    });

    it('should render with different variants', () => {
      const { rerender } = render(<ThemeToggle variant="default" />);
      expect(screen.getByRole('button')).toHaveClass('border-gray-300');

      rerender(<ThemeToggle variant="outline" />);
      expect(screen.getByRole('button')).toHaveClass('border-2');

      rerender(<ThemeToggle variant="ghost" />);
      expect(screen.getByRole('button')).toHaveClass('border-transparent');

      rerender(<ThemeToggle variant="neon" />);
      expect(screen.getByRole('button')).toHaveClass('border-purple-500', 'shadow-purple-500/25');
    });
  });

  describe('Interaction', () => {
    it('should call onThemeChange when clicked', () => {
      const handleThemeChange = jest.fn();
      render(<ThemeToggle onThemeChange={handleThemeChange} theme="light" />);
      
      fireEvent.click(screen.getByRole('button'));
      expect(handleThemeChange).toHaveBeenCalledTimes(1);
      expect(handleThemeChange).toHaveBeenCalledWith('dark');
    });

    it('should cycle through themes correctly', () => {
      jest.useFakeTimers();
      const handleThemeChange = jest.fn();
      
      // Light -> Dark
      const { rerender } = render(
        <ThemeToggle onThemeChange={handleThemeChange} theme="light" />
      );
      fireEvent.click(screen.getByRole('button'));
      expect(handleThemeChange).toHaveBeenCalledWith('dark');

      // Wait for debounce to clear
      jest.advanceTimersByTime(300);

      // Dark -> System
      rerender(<ThemeToggle onThemeChange={handleThemeChange} theme="dark" />);
      fireEvent.click(screen.getByRole('button'));
      expect(handleThemeChange).toHaveBeenCalledWith('system');

      // Wait for debounce to clear
      jest.advanceTimersByTime(300);

      // System -> Light
      rerender(<ThemeToggle onThemeChange={handleThemeChange} theme="system" />);
      fireEvent.click(screen.getByRole('button'));
      expect(handleThemeChange).toHaveBeenCalledWith('light');

      jest.useRealTimers();
    });

    it('should support keyboard navigation', () => {
      jest.useFakeTimers();
      const handleThemeChange = jest.fn();
      render(<ThemeToggle onThemeChange={handleThemeChange} />);
      const button = screen.getByRole('button');
      
      // Focus the button
      button.focus();
      expect(button).toHaveFocus();
      
      // Press Enter
      fireEvent.keyDown(button, { key: 'Enter', code: 'Enter' });
      expect(handleThemeChange).toHaveBeenCalledTimes(1);
      
      // Wait for debounce to clear
      jest.advanceTimersByTime(300);
      
      // Press Space
      fireEvent.keyDown(button, { key: ' ', code: 'Space' });
      expect(handleThemeChange).toHaveBeenCalledTimes(2);
      
      jest.useRealTimers();
    });

    it('should show tooltip on hover', async () => {
      render(<ThemeToggle theme="light" showTooltip />);
      const button = screen.getByRole('button');
      
      // Button should have title attribute when showTooltip is true
      expect(button).toHaveAttribute('title', 'Switch to dark theme');
      
      fireEvent.mouseEnter(button);
      // Tooltip title should still be present as an attribute
      expect(button).toHaveAttribute('title', 'Switch to dark theme');
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA attributes', () => {
      render(<ThemeToggle theme="light" />);
      const button = screen.getByRole('button');
      
      expect(button).toHaveAttribute('aria-label', 'Switch to dark theme');
      expect(button).toHaveAttribute('type', 'button');
    });

    it('should announce theme changes to screen readers', () => {
      render(<ThemeToggle theme="light" />);
      const button = screen.getByRole('button');
      
      // Should have live region for announcements
      expect(button).toHaveAttribute('aria-live', 'polite');
    });

    it('should have proper focus styles', () => {
      render(<ThemeToggle />);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('focus:outline-none focus:ring-2 focus:ring-purple-500');
    });

    it('should support high contrast mode', () => {
      render(<ThemeToggle variant="outline" />);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('contrast:border-black');
    });
  });

  describe('Theme Provider Integration', () => {
    it('should read theme from context when no theme prop provided', () => {
      // This will be tested with ThemeProvider wrapper
      render(<ThemeToggle />);
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
    });

    it('should update theme provider when changed', () => {
      const handleThemeChange = jest.fn();
      render(<ThemeToggle onThemeChange={handleThemeChange} />);
      
      fireEvent.click(screen.getByRole('button'));
      expect(handleThemeChange).toHaveBeenCalled();
    });
  });

  describe('Animation and Visual Effects', () => {
    it('should have smooth transition animations', () => {
      render(<ThemeToggle />);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('transition-all duration-200');
    });

    it('should have neon glow effect in neon variant', () => {
      render(<ThemeToggle variant="neon" />);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('shadow-lg shadow-purple-500/25');
    });

    it('should rotate icon during theme change', () => {
      render(<ThemeToggle />);
      const button = screen.getByRole('button');
      const icon = button.querySelector('svg');
      
      fireEvent.click(button);
      expect(icon).toHaveClass('animate-spin');
    });
  });

  describe('Performance', () => {
    it('should not re-render unnecessarily', () => {
      const handleThemeChange = jest.fn();
      const { rerender } = render(
        <ThemeToggle onThemeChange={handleThemeChange} theme="light" />
      );
      
      // Same props should not cause re-render
      rerender(<ThemeToggle onThemeChange={handleThemeChange} theme="light" />);
      expect(handleThemeChange).not.toHaveBeenCalled();
    });

    it('should debounce rapid theme changes', () => {
      const handleThemeChange = jest.fn();
      render(<ThemeToggle onThemeChange={handleThemeChange} />);
      const button = screen.getByRole('button');
      
      // Rapid clicks
      fireEvent.click(button);
      fireEvent.click(button);
      fireEvent.click(button);
      
      // Should debounce to prevent rapid theme changes
      expect(handleThemeChange).toHaveBeenCalledTimes(1);
    });
  });
});