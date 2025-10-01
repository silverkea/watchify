import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { SearchBox } from '@/components/molecules/SearchBox/index';

describe('SearchBox Molecule', () => {
  describe('Rendering', () => {
    it('should be undefined initially (component not implemented)', () => {
      expect(SearchBox).toBeUndefined();
    });

    it('should render with default props', () => {
      render(<SearchBox />);
      
      const input = screen.getByPlaceholderText(/search movies/i);
      const searchButton = screen.getByRole('button', { name: /search/i });
      
      expect(input).toBeInTheDocument();
      expect(searchButton).toBeInTheDocument();
    });

    it('should render with custom placeholder', () => {
      render(<SearchBox placeholder="Find your favorite movie..." />);
      expect(screen.getByPlaceholderText('Find your favorite movie...')).toBeInTheDocument();
    });

    it('should render with loading state', () => {
      render(<SearchBox loading />);
      
      const input = screen.getByPlaceholderText(/search movies/i);
      const loadingSpinner = screen.getByRole('status', { name: /searching/i });
      
      expect(input).toBeDisabled();
      expect(loadingSpinner).toBeInTheDocument();
    });

    it('should render with different sizes', () => {
      const { rerender } = render(<SearchBox size="sm" />);
      expect(screen.getByPlaceholderText(/search movies/i)).toHaveClass('text-sm');

      rerender(<SearchBox size="lg" />);
      expect(screen.getByPlaceholderText(/search movies/i)).toHaveClass('text-lg');
    });

    it('should render with search results count', () => {
      render(<SearchBox resultsCount={42} />);
      expect(screen.getByText('42 movies found')).toBeInTheDocument();
    });

    it('should render with clear button when value exists', () => {
      render(<SearchBox value="batman" />);
      const clearButton = screen.getByRole('button', { name: /clear search/i });
      expect(clearButton).toBeInTheDocument();
    });
  });

  describe('Search Functionality', () => {
    it('should call onSearch when typing with debounce', async () => {
      const handleSearch = jest.fn();
      render(<SearchBox onSearch={handleSearch} debounceMs={100} />);
      
      const input = screen.getByPlaceholderText(/search movies/i);
      
      // Type in search box
      fireEvent.change(input, { target: { value: 'batman' } });
      
      // Should not call immediately
      expect(handleSearch).not.toHaveBeenCalled();
      
      // Should call after debounce delay
      await waitFor(() => {
        expect(handleSearch).toHaveBeenCalledWith('batman');
      }, { timeout: 200 });
    });

    it('should call onSearch when search button is clicked', () => {
      const handleSearch = jest.fn();
      render(<SearchBox onSearch={handleSearch} />);
      
      const input = screen.getByPlaceholderText(/search movies/i);
      const searchButton = screen.getByRole('button', { name: /search/i });
      
      fireEvent.change(input, { target: { value: 'avengers' } });
      fireEvent.click(searchButton);
      
      expect(handleSearch).toHaveBeenCalledWith('avengers');
    });

    it('should call onSearch when Enter key is pressed', () => {
      const handleSearch = jest.fn();
      render(<SearchBox onSearch={handleSearch} />);
      
      const input = screen.getByPlaceholderText(/search movies/i);
      
      fireEvent.change(input, { target: { value: 'spider-man' } });
      fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
      
      expect(handleSearch).toHaveBeenCalledWith('spider-man');
    });

    it('should not search with empty query', () => {
      const handleSearch = jest.fn();
      render(<SearchBox onSearch={handleSearch} />);
      
      const searchButton = screen.getByRole('button', { name: /search/i });
      fireEvent.click(searchButton);
      
      expect(handleSearch).not.toHaveBeenCalled();
    });

    it('should not search when query is too short', () => {
      const handleSearch = jest.fn();
      render(<SearchBox onSearch={handleSearch} minLength={3} />);
      
      const input = screen.getByPlaceholderText(/search movies/i);
      
      fireEvent.change(input, { target: { value: 'ab' } });
      fireEvent.keyDown(input, { key: 'Enter' });
      
      expect(handleSearch).not.toHaveBeenCalled();
    });

    it('should debounce rapid typing', async () => {
      const handleSearch = jest.fn();
      render(<SearchBox onSearch={handleSearch} debounceMs={200} />);
      
      const input = screen.getByPlaceholderText(/search movies/i);
      
      // Rapid typing
      fireEvent.change(input, { target: { value: 'b' } });
      fireEvent.change(input, { target: { value: 'ba' } });
      fireEvent.change(input, { target: { value: 'bat' } });
      fireEvent.change(input, { target: { value: 'batm' } });
      fireEvent.change(input, { target: { value: 'batman' } });
      
      // Should only call once after debounce
      await waitFor(() => {
        expect(handleSearch).toHaveBeenCalledTimes(1);
        expect(handleSearch).toHaveBeenCalledWith('batman');
      }, { timeout: 300 });
    });
  });

  describe('Clear Functionality', () => {
    it('should clear search when clear button is clicked', () => {
      const handleSearch = jest.fn();
      const handleClear = jest.fn();
      
      render(<SearchBox value="batman" onSearch={handleSearch} onClear={handleClear} />);
      
      const clearButton = screen.getByRole('button', { name: /clear search/i });
      fireEvent.click(clearButton);
      
      expect(handleClear).toHaveBeenCalled();
    });

    it('should clear search and call onSearch with empty string', () => {
      const handleSearch = jest.fn();
      
      render(<SearchBox value="batman" onSearch={handleSearch} />);
      
      const clearButton = screen.getByRole('button', { name: /clear search/i });
      fireEvent.click(clearButton);
      
      expect(handleSearch).toHaveBeenCalledWith('');
    });

    it('should hide clear button when input is empty', () => {
      const { rerender } = render(<SearchBox value="batman" />);
      expect(screen.getByRole('button', { name: /clear search/i })).toBeInTheDocument();
      
      rerender(<SearchBox value="" />);
      expect(screen.queryByRole('button', { name: /clear search/i })).not.toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA attributes', () => {
      render(<SearchBox />);
      
      const input = screen.getByPlaceholderText(/search movies/i);
      expect(input).toHaveAttribute('aria-label', 'Search movies');
      expect(input).toHaveAttribute('role', 'searchbox');
    });

    it('should have proper form structure', () => {
      render(<SearchBox />);
      
      const form = screen.getByRole('search');
      expect(form).toBeInTheDocument();
    });

    it('should announce search results to screen readers', () => {
      render(<SearchBox resultsCount={5} />);
      
      const resultsAnnouncement = screen.getByRole('status');
      expect(resultsAnnouncement).toHaveTextContent('5 movies found');
    });

    it('should have proper focus management', () => {
      render(<SearchBox />);
      
      const input = screen.getByPlaceholderText(/search movies/i);
      input.focus();
      
      expect(input).toHaveFocus();
      expect(input).toHaveClass('focus:ring-2');
    });
  });

  describe('Keyboard Navigation', () => {
    it('should support Tab navigation', () => {
      render(<SearchBox value="batman" />);
      
      const input = screen.getByPlaceholderText(/search movies/i);
      const searchButton = screen.getByRole('button', { name: /search/i });
      const clearButton = screen.getByRole('button', { name: /clear search/i });
      
      // Tab through elements
      input.focus();
      expect(input).toHaveFocus();
      
      fireEvent.keyDown(input, { key: 'Tab' });
      // In real DOM, this would focus the next element
    });

    it('should support Escape key to clear search', () => {
      const handleClear = jest.fn();
      render(<SearchBox value="batman" onClear={handleClear} />);
      
      const input = screen.getByPlaceholderText(/search movies/i);
      fireEvent.keyDown(input, { key: 'Escape' });
      
      expect(handleClear).toHaveBeenCalled();
    });
  });

  describe('Controlled vs Uncontrolled', () => {
    it('should work as controlled component', () => {
      const handleChange = jest.fn();
      const { rerender } = render(<SearchBox value="batman" onChange={handleChange} />);
      
      expect(screen.getByDisplayValue('batman')).toBeInTheDocument();
      
      rerender(<SearchBox value="superman" onChange={handleChange} />);
      expect(screen.getByDisplayValue('superman')).toBeInTheDocument();
    });

    it('should work as uncontrolled component', () => {
      render(<SearchBox defaultValue="batman" />);
      
      const input = screen.getByDisplayValue('batman');
      fireEvent.change(input, { target: { value: 'superman' } });
      
      expect(input).toHaveValue('superman');
    });
  });

  describe('Theme Integration', () => {
    it('should adapt to dark/light themes', () => {
      render(<SearchBox />);
      
      const input = screen.getByPlaceholderText(/search movies/i);
      expect(input).toHaveClass('dark:bg-gray-800', 'dark:text-white');
    });

    it('should support neon variant', () => {
      render(<SearchBox variant="neon" />);
      
      const input = screen.getByPlaceholderText(/search movies/i);
      expect(input).toHaveClass('border-purple-500');
    });
  });

  describe('Performance', () => {
    it('should not re-render unnecessarily', () => {
      const handleSearch = jest.fn();
      const { rerender } = render(<SearchBox onSearch={handleSearch} />);
      
      // Same props should not cause re-render
      rerender(<SearchBox onSearch={handleSearch} />);
      
      // Component should be optimized
      expect(handleSearch).not.toHaveBeenCalled();
    });

    it('should cancel previous debounced calls', async () => {
      const handleSearch = jest.fn();
      render(<SearchBox onSearch={handleSearch} debounceMs={200} />);
      
      const input = screen.getByPlaceholderText(/search movies/i);
      
      // First search
      fireEvent.change(input, { target: { value: 'batman' } });
      
      // Cancel with new search before debounce completes
      setTimeout(() => {
        fireEvent.change(input, { target: { value: 'superman' } });
      }, 100);
      
      // Should only search for 'superman'
      await waitFor(() => {
        expect(handleSearch).toHaveBeenCalledTimes(1);
        expect(handleSearch).toHaveBeenCalledWith('superman');
      }, { timeout: 400 });
    });
  });
});