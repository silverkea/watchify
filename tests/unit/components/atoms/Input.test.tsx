import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Input } from '@/components/atoms/Input/index';

describe('Input Atom', () => {
  describe('Rendering', () => {
    it('should render with default props', () => {
      render(<Input placeholder="Enter text" />);
      const input = screen.getByPlaceholderText('Enter text');
      expect(input).toBeInTheDocument();
      expect(input).toHaveClass('border-gray-300');
    });

    it('should render with different variants', () => {
      const { rerender } = render(<Input variant="default" placeholder="Default" />);
      expect(screen.getByPlaceholderText('Default')).toHaveClass('border-gray-300');

      rerender(<Input variant="error" placeholder="Error" />);
      expect(screen.getByPlaceholderText('Error')).toHaveClass('border-red-500');

      rerender(<Input variant="success" placeholder="Success" />);
      expect(screen.getByPlaceholderText('Success')).toHaveClass('border-green-500');

      rerender(<Input variant="neon" placeholder="Neon" />);
      expect(screen.getByPlaceholderText('Neon')).toHaveClass('border-purple-500');
    });

    it('should render with different sizes', () => {
      const { rerender } = render(<Input size="sm" placeholder="Small" />);
      expect(screen.getByPlaceholderText('Small')).toHaveClass('px-2 py-1 text-sm');

      rerender(<Input size="md" placeholder="Medium" />);
      expect(screen.getByPlaceholderText('Medium')).toHaveClass('px-3 py-2 text-base');

      rerender(<Input size="lg" placeholder="Large" />);
      expect(screen.getByPlaceholderText('Large')).toHaveClass('px-4 py-3 text-lg');
    });

    it('should render in disabled state', () => {
      render(<Input disabled placeholder="Disabled input" />);
      const input = screen.getByPlaceholderText('Disabled input');
      expect(input).toBeDisabled();
      expect(input).toHaveClass('disabled:opacity-50 disabled:cursor-not-allowed');
    });

    it('should render with label', () => {
      render(<Input label="Username" placeholder="Enter username" />);
      expect(screen.getByLabelText('Username')).toBeInTheDocument();
      expect(screen.getByText('Username')).toBeInTheDocument();
    });

    it('should render with error message', () => {
      render(<Input error="This field is required" placeholder="Error input" />);
      expect(screen.getByText('This field is required')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Error input')).toHaveClass('border-red-500');
    });

    it('should render with help text', () => {
      render(<Input helperText="Enter at least 6 characters" placeholder="Password" />);
      expect(screen.getByText('Enter at least 6 characters')).toBeInTheDocument();
    });
  });

  describe('Interaction', () => {
    it('should call onChange when value changes', () => {
      const handleChange = jest.fn();
      render(<Input onChange={handleChange} placeholder="Type here" />);
      
      const input = screen.getByPlaceholderText('Type here');
      fireEvent.change(input, { target: { value: 'hello' } });
      
      expect(handleChange).toHaveBeenCalledTimes(1);
      expect(handleChange).toHaveBeenCalledWith(expect.objectContaining({
        target: expect.objectContaining({ value: 'hello' })
      }));
    });

    it('should call onFocus and onBlur', () => {
      const handleFocus = jest.fn();
      const handleBlur = jest.fn();
      render(
        <Input 
          onFocus={handleFocus} 
          onBlur={handleBlur} 
          placeholder="Focus test" 
        />
      );
      
      const input = screen.getByPlaceholderText('Focus test');
      
      fireEvent.focus(input);
      expect(handleFocus).toHaveBeenCalledTimes(1);
      
      fireEvent.blur(input);
      expect(handleBlur).toHaveBeenCalledTimes(1);
    });

    it('should support controlled value', () => {
      const { rerender } = render(<Input value="initial" onChange={() => {}} />);
      expect(screen.getByDisplayValue('initial')).toBeInTheDocument();
      
      rerender(<Input value="updated" onChange={() => {}} />);
      expect(screen.getByDisplayValue('updated')).toBeInTheDocument();
    });

    it('should support keyboard navigation', () => {
      render(<Input placeholder="Keyboard test" />);
      const input = screen.getByPlaceholderText('Keyboard test');
      
      input.focus();
      expect(input).toHaveFocus();
      
      fireEvent.keyDown(input, { key: 'Tab' });
      // Tab behavior would be tested in integration tests
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA attributes', () => {
      render(
        <Input 
          aria-label="Search movies" 
          placeholder="Search..." 
          aria-describedby="search-help"
        />
      );
      const input = screen.getByLabelText('Search movies');
      expect(input).toHaveAttribute('aria-describedby', 'search-help');
    });

    it('should associate label with input', () => {
      render(<Input id="username" label="Username" />);
      const label = screen.getByText('Username');
      const input = screen.getByLabelText('Username');
      
      expect(label).toHaveAttribute('for', 'username');
      expect(input).toHaveAttribute('id', 'username');
    });

    it('should have proper focus styles', () => {
      render(<Input placeholder="Focus styles" />);
      const input = screen.getByPlaceholderText('Focus styles');
      expect(input).toHaveClass('focus:outline-none focus:ring-2 focus:ring-purple-500');
    });

    it('should support ref forwarding', () => {
      const ref = React.createRef<HTMLInputElement>();
      render(<Input ref={ref} placeholder="Ref test" />);
      expect(ref.current).toBeInstanceOf(HTMLInputElement);
    });

    it('should have proper error state for screen readers', () => {
      render(
        <Input 
          error="Invalid email format" 
          aria-invalid="true"
          placeholder="Email"
        />
      );
      const input = screen.getByPlaceholderText('Email');
      expect(input).toHaveAttribute('aria-invalid', 'true');
    });
  });

  describe('Theme Integration', () => {
    it('should adapt to dark/light themes', () => {
      render(<Input placeholder="Theme test" />);
      const input = screen.getByPlaceholderText('Theme test');
      expect(input).toHaveClass('dark:bg-gray-800 dark:border-gray-600 dark:text-white');
    });

    it('should have proper neon glow in dark mode', () => {
      render(<Input variant="neon" placeholder="Neon input" />);
      const input = screen.getByPlaceholderText('Neon input');
      expect(input).toHaveClass('focus:shadow-lg focus:shadow-purple-500/25');
    });
  });
});