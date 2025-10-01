import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '@/components/atoms/Button/index';

describe('Button Atom', () => {
  describe('Rendering', () => {
    it('should render with default props', () => {
      render(<Button>Click me</Button>);
      const button = screen.getByRole('button', { name: /click me/i });
      expect(button).toBeInTheDocument();
      expect(button).toHaveClass('bg-purple-600'); // Primary variant default
    });

    it('should render with different variants', () => {
      const { rerender } = render(<Button variant="primary">Primary</Button>);
      expect(screen.getByRole('button')).toHaveClass('bg-purple-600');

      rerender(<Button variant="secondary">Secondary</Button>);
      expect(screen.getByRole('button')).toHaveClass('bg-gray-600');

      rerender(<Button variant="ghost">Ghost</Button>);
      expect(screen.getByRole('button')).toHaveClass('bg-transparent');

      rerender(<Button variant="neon">Neon</Button>);
      expect(screen.getByRole('button')).toHaveClass('bg-gradient-to-r from-pink-500 to-purple-600');
    });

    it('should render with different sizes', () => {
      const { rerender } = render(<Button size="sm">Small</Button>);
      expect(screen.getByRole('button')).toHaveClass('px-3 py-1.5 text-sm');

      rerender(<Button size="md">Medium</Button>);
      expect(screen.getByRole('button')).toHaveClass('px-4 py-2 text-base');

      rerender(<Button size="lg">Large</Button>);
      expect(screen.getByRole('button')).toHaveClass('px-6 py-3 text-lg');
    });

    it('should render in disabled state', () => {
      render(<Button disabled>Disabled</Button>);
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
      expect(button).toHaveClass('opacity-50 cursor-not-allowed');
    });

    it('should render in loading state', () => {
      render(<Button loading>Loading</Button>);
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
      expect(screen.getByText('Loading...')).toBeInTheDocument();
      // Should have loading spinner
      expect(button.querySelector('.animate-spin')).toBeInTheDocument();
    });

    it('should render with custom className', () => {
      render(<Button className="custom-class">Custom</Button>);
      expect(screen.getByRole('button')).toHaveClass('custom-class');
    });
  });

  describe('Interaction', () => {
    it('should call onClick when clicked', () => {
      const handleClick = jest.fn();
      render(<Button onClick={handleClick}>Click me</Button>);
      
      fireEvent.click(screen.getByRole('button'));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('should not call onClick when disabled', () => {
      const handleClick = jest.fn();
      render(<Button onClick={handleClick} disabled>Disabled</Button>);
      
      fireEvent.click(screen.getByRole('button'));
      expect(handleClick).not.toHaveBeenCalled();
    });

    it('should not call onClick when loading', () => {
      const handleClick = jest.fn();
      render(<Button onClick={handleClick} loading>Loading</Button>);
      
      fireEvent.click(screen.getByRole('button'));
      expect(handleClick).not.toHaveBeenCalled();
    });

    it('should support keyboard navigation', () => {
      const handleClick = jest.fn();
      render(<Button onClick={handleClick}>Press me</Button>);
      const button = screen.getByRole('button');
      
      // Focus the button
      button.focus();
      expect(button).toHaveFocus();
      
      // Press Enter
      fireEvent.keyDown(button, { key: 'Enter', code: 'Enter' });
      expect(handleClick).toHaveBeenCalledTimes(1);
      
      // Press Space
      fireEvent.keyDown(button, { key: ' ', code: 'Space' });
      expect(handleClick).toHaveBeenCalledTimes(2);
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA attributes', () => {
      render(<Button aria-label="Custom button">Button</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-label', 'Custom button');
    });

    it('should have proper focus styles', () => {
      render(<Button>Focus me</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('focus:outline-none focus:ring-2 focus:ring-purple-500');
    });

    it('should support ref forwarding', () => {
      const ref = React.createRef<HTMLButtonElement>();
      render(<Button ref={ref}>Ref button</Button>);
      expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    });
  });

  describe('Theme Integration', () => {
    it('should adapt to dark/light themes', () => {
      // This will be tested with theme provider context
      render(<Button variant="secondary">Theme button</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('dark:bg-gray-700 dark:hover:bg-gray-600');
    });

    it('should have proper neon glow in dark mode', () => {
      render(<Button variant="neon">Neon button</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('shadow-lg shadow-purple-500/25');
    });
  });
});