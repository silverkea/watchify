import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Badge } from '@/components/atoms/Badge/index';

describe('Badge Atom', () => {
  describe('Rendering', () => {
    it('should render with default props', () => {
      render(<Badge>Action</Badge>);
      const badge = screen.getByText('Action');
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveClass('bg-gray-100');
    });

    it('should render with different variants', () => {
      const { rerender } = render(<Badge variant="default">Default</Badge>);
      expect(screen.getByText('Default')).toHaveClass('bg-gray-100');

      rerender(<Badge variant="primary">Primary</Badge>);
      expect(screen.getByText('Primary')).toHaveClass('bg-purple-100');

      rerender(<Badge variant="secondary">Secondary</Badge>);
      expect(screen.getByText('Secondary')).toHaveClass('bg-gray-100');

      rerender(<Badge variant="success">Success</Badge>);
      expect(screen.getByText('Success')).toHaveClass('bg-green-100');

      rerender(<Badge variant="warning">Warning</Badge>);
      expect(screen.getByText('Warning')).toHaveClass('bg-yellow-100');

      rerender(<Badge variant="error">Error</Badge>);
      expect(screen.getByText('Error')).toHaveClass('bg-red-100');

      rerender(<Badge variant="neon">Neon</Badge>);
      expect(screen.getByText('Neon')).toHaveClass('bg-gradient-to-r from-pink-100 to-purple-100');
    });

    it('should render with different sizes', () => {
      const { rerender } = render(<Badge size="sm">Small</Badge>);
      expect(screen.getByText('Small')).toHaveClass('px-2 py-0.5 text-xs');

      rerender(<Badge size="md">Medium</Badge>);
      expect(screen.getByText('Medium')).toHaveClass('px-2.5 py-1 text-sm');

      rerender(<Badge size="lg">Large</Badge>);
      expect(screen.getByText('Large')).toHaveClass('px-3 py-1.5 text-base');
    });

    it('should render with different shapes', () => {
      const { rerender } = render(<Badge shape="rounded">Rounded</Badge>);
      expect(screen.getByText('Rounded')).toHaveClass('rounded-md');

      rerender(<Badge shape="pill">Pill</Badge>);
      expect(screen.getByText('Pill')).toHaveClass('rounded-full');

      rerender(<Badge shape="square">Square</Badge>);
      expect(screen.getByText('Square')).toHaveClass('rounded-none');
    });

    it('should render with custom className', () => {
      render(<Badge className="custom-badge">Custom</Badge>);
      expect(screen.getByText('Custom')).toHaveClass('custom-badge');
    });

    it('should render with removable functionality', () => {
      const handleRemove = jest.fn();
      render(<Badge removable onRemove={handleRemove}>Removable</Badge>);
      
      const badge = screen.getByText('Removable');
      const removeButton = screen.getByRole('button', { name: /remove/i });
      
      expect(badge).toBeInTheDocument();
      expect(removeButton).toBeInTheDocument();
      expect(removeButton).toHaveClass('ml-1');
    });
  });

  describe('Interaction', () => {
    it('should call onRemove when remove button is clicked', () => {
      const handleRemove = jest.fn();
      render(<Badge removable onRemove={handleRemove}>Remove me</Badge>);
      
      const removeButton = screen.getByRole('button', { name: /remove/i });
      fireEvent.click(removeButton);
      
      expect(handleRemove).toHaveBeenCalledTimes(1);
    });

    it('should call onClick when badge is clicked', () => {
      const handleClick = jest.fn();
      render(<Badge onClick={handleClick}>Clickable</Badge>);
      
      fireEvent.click(screen.getByText('Clickable'));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('should have proper cursor styles for interactive badges', () => {
      const { rerender } = render(<Badge onClick={() => {}}>Clickable</Badge>);
      expect(screen.getByText('Clickable')).toHaveClass('cursor-pointer');

      rerender(<Badge>Non-clickable</Badge>);
      expect(screen.getByText('Non-clickable')).not.toHaveClass('cursor-pointer');
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA attributes for removable badges', () => {
      const handleRemove = jest.fn();
      render(<Badge removable onRemove={handleRemove}>Genre Tag</Badge>);
      
      const removeButton = screen.getByRole('button', { name: /remove/i });
      expect(removeButton).toHaveAttribute('aria-label', 'Remove Genre Tag');
    });

    it('should support keyboard navigation for removable badges', () => {
      const handleRemove = jest.fn();
      render(<Badge removable onRemove={handleRemove}>Keyboard</Badge>);
      
      const removeButton = screen.getByRole('button', { name: /remove/i });
      
      // Focus the remove button
      removeButton.focus();
      expect(removeButton).toHaveFocus();
      
      // Press Enter
      fireEvent.keyDown(removeButton, { key: 'Enter', code: 'Enter' });
      expect(handleRemove).toHaveBeenCalledTimes(1);
      
      // Press Space
      fireEvent.keyDown(removeButton, { key: ' ', code: 'Space' });
      expect(handleRemove).toHaveBeenCalledTimes(2);
    });

    it('should have proper focus styles', () => {
      render(<Badge onClick={() => {}}>Focusable</Badge>);
      const badge = screen.getByText('Focusable');
      expect(badge).toHaveClass('focus:outline-none focus:ring-2 focus:ring-purple-500');
    });
  });

  describe('Theme Integration', () => {
    it('should adapt to dark/light themes', () => {
      render(<Badge variant="primary">Theme badge</Badge>);
      const badge = screen.getByText('Theme badge');
      expect(badge).toHaveClass('dark:bg-purple-900 dark:text-purple-100');
    });

    it('should have proper neon effects in dark mode', () => {
      render(<Badge variant="neon">Neon badge</Badge>);
      const badge = screen.getByText('Neon badge');
      expect(badge).toHaveClass('shadow-sm shadow-purple-500/25');
    });
  });

  describe('Genre-specific functionality', () => {
    it('should render genre badges with proper styling', () => {
      render(<Badge variant="primary" size="sm">Action</Badge>);
      const badge = screen.getByText('Action');
      expect(badge).toHaveClass('bg-purple-100', 'px-2', 'py-0.5', 'text-xs');
    });

    it('should support multiple genre badges', () => {
      render(
        <div>
          <Badge variant="primary">Action</Badge>
          <Badge variant="secondary">Drama</Badge>
          <Badge variant="primary">Thriller</Badge>
        </div>
      );
      
      expect(screen.getByText('Action')).toBeInTheDocument();
      expect(screen.getByText('Drama')).toBeInTheDocument();
      expect(screen.getByText('Thriller')).toBeInTheDocument();
    });
  });
});