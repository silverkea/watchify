import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { GenreFilter } from '@/components/molecules/GenreFilter/index';
import type { Genre } from '@/types/genre';

const mockGenres: Genre[] = [
  { id: 28, name: 'Action' },
  { id: 12, name: 'Adventure' },
  { id: 16, name: 'Animation' },
  { id: 35, name: 'Comedy' },
  { id: 80, name: 'Crime' },
  { id: 18, name: 'Drama' },
  { id: 14, name: 'Fantasy' },
  { id: 27, name: 'Horror' },
  { id: 9648, name: 'Mystery' },
  { id: 10749, name: 'Romance' },
  { id: 878, name: 'Science Fiction' },
  { id: 53, name: 'Thriller' }
];

describe('GenreFilter Molecule', () => {
  describe('Rendering', () => {
    it('should be undefined initially (component not implemented)', () => {
      expect(GenreFilter).toBeUndefined();
    });

    it('should render with all genres', () => {
      render(<GenreFilter genres={mockGenres} />);
      
      expect(screen.getByText('Action')).toBeInTheDocument();
      expect(screen.getByText('Adventure')).toBeInTheDocument();
      expect(screen.getByText('Comedy')).toBeInTheDocument();
      expect(screen.getByText('Drama')).toBeInTheDocument();
    });

    it('should render with different layouts', () => {
      const { rerender } = render(<GenreFilter genres={mockGenres} layout="grid" />);
      const container = screen.getByTestId('genre-filter');
      expect(container).toHaveClass('grid');

      rerender(<GenreFilter genres={mockGenres} layout="list" />);
      expect(container).toHaveClass('flex-col');

      rerender(<GenreFilter genres={mockGenres} layout="horizontal" />);
      expect(container).toHaveClass('flex-row', 'flex-wrap');
    });

    it('should render with different sizes', () => {
      const { rerender } = render(<GenreFilter genres={mockGenres} size="sm" />);
      const actionBadge = screen.getByText('Action');
      expect(actionBadge).toHaveClass('text-xs');

      rerender(<GenreFilter genres={mockGenres} size="md" />);
      expect(actionBadge).toHaveClass('text-sm');

      rerender(<GenreFilter genres={mockGenres} size="lg" />);
      expect(actionBadge).toHaveClass('text-base');
    });

    it('should show selected genres as active', () => {
      const selectedGenres = [28, 35]; // Action, Comedy
      render(<GenreFilter genres={mockGenres} selectedGenres={selectedGenres} />);
      
      const actionBadge = screen.getByText('Action');
      const comedyBadge = screen.getByText('Comedy');
      const dramaBadge = screen.getByText('Drama');
      
      expect(actionBadge).toHaveClass('bg-purple-600', 'text-white');
      expect(comedyBadge).toHaveClass('bg-purple-600', 'text-white');
      expect(dramaBadge).not.toHaveClass('bg-purple-600');
    });

    it('should show genre count when available', () => {
      const genresWithCounts = [
        { id: 28, name: 'Action', count: 150 },
        { id: 35, name: 'Comedy', count: 89 },
        { id: 18, name: 'Drama', count: 201 }
      ];
      
      render(<GenreFilter genres={genresWithCounts} showCounts />);
      
      expect(screen.getByText('Action (150)')).toBeInTheDocument();
      expect(screen.getByText('Comedy (89)')).toBeInTheDocument();
      expect(screen.getByText('Drama (201)')).toBeInTheDocument();
    });

    it('should render with clear all button when multi-select', () => {
      const selectedGenres = [28, 35];
      render(
        <GenreFilter 
          genres={mockGenres} 
          selectedGenres={selectedGenres}
          multiSelect
          showClearAll
        />
      );
      
      const clearButton = screen.getByRole('button', { name: /clear all/i });
      expect(clearButton).toBeInTheDocument();
    });

    it('should show loading state', () => {
      render(<GenreFilter loading />);
      
      expect(screen.getByRole('status', { name: /loading genres/i })).toBeInTheDocument();
      expect(screen.getByTestId('genre-filter-skeleton')).toBeInTheDocument();
    });

    it('should show empty state when no genres', () => {
      render(<GenreFilter genres={[]} />);
      
      expect(screen.getByText(/no genres available/i)).toBeInTheDocument();
    });
  });

  describe('Single Selection', () => {
    it('should select genre when clicked in single-select mode', () => {
      const onSelectionChange = jest.fn();
      render(
        <GenreFilter 
          genres={mockGenres} 
          onSelectionChange={onSelectionChange}
          multiSelect={false}
        />
      );
      
      fireEvent.click(screen.getByText('Action'));
      expect(onSelectionChange).toHaveBeenCalledWith([28]);
    });

    it('should replace selection when different genre is clicked', () => {
      const onSelectionChange = jest.fn();
      render(
        <GenreFilter 
          genres={mockGenres} 
          selectedGenres={[28]} // Action selected
          onSelectionChange={onSelectionChange}
          multiSelect={false}
        />
      );
      
      fireEvent.click(screen.getByText('Comedy'));
      expect(onSelectionChange).toHaveBeenCalledWith([35]);
    });

    it('should deselect genre when clicked again in single-select', () => {
      const onSelectionChange = jest.fn();
      render(
        <GenreFilter 
          genres={mockGenres} 
          selectedGenres={[28]} // Action selected
          onSelectionChange={onSelectionChange}
          multiSelect={false}
          allowDeselect
        />
      );
      
      fireEvent.click(screen.getByText('Action'));
      expect(onSelectionChange).toHaveBeenCalledWith([]);
    });
  });

  describe('Multi Selection', () => {
    it('should add genre to selection when clicked in multi-select mode', () => {
      const onSelectionChange = jest.fn();
      render(
        <GenreFilter 
          genres={mockGenres} 
          selectedGenres={[28]} // Action already selected
          onSelectionChange={onSelectionChange}
          multiSelect
        />
      );
      
      fireEvent.click(screen.getByText('Comedy'));
      expect(onSelectionChange).toHaveBeenCalledWith([28, 35]);
    });

    it('should remove genre from selection when clicked again', () => {
      const onSelectionChange = jest.fn();
      render(
        <GenreFilter 
          genres={mockGenres} 
          selectedGenres={[28, 35]} // Action and Comedy selected
          onSelectionChange={onSelectionChange}
          multiSelect
        />
      );
      
      fireEvent.click(screen.getByText('Action'));
      expect(onSelectionChange).toHaveBeenCalledWith([35]);
    });

    it('should respect maximum selection limit', () => {
      const onSelectionChange = jest.fn();
      render(
        <GenreFilter 
          genres={mockGenres} 
          selectedGenres={[28, 35]} // 2 genres selected
          onSelectionChange={onSelectionChange}
          multiSelect
          maxSelection={2}
        />
      );
      
      fireEvent.click(screen.getByText('Drama'));
      expect(onSelectionChange).not.toHaveBeenCalled();
      
      // Should show disabled state for non-selected genres
      const dramaBadge = screen.getByText('Drama');
      expect(dramaBadge).toHaveClass('opacity-50', 'cursor-not-allowed');
    });

    it('should clear all selections when clear button is clicked', () => {
      const onSelectionChange = jest.fn();
      render(
        <GenreFilter 
          genres={mockGenres} 
          selectedGenres={[28, 35, 18]}
          onSelectionChange={onSelectionChange}
          multiSelect
          showClearAll
        />
      );
      
      const clearButton = screen.getByRole('button', { name: /clear all/i });
      fireEvent.click(clearButton);
      
      expect(onSelectionChange).toHaveBeenCalledWith([]);
    });
  });

  describe('Search and Filter', () => {
    it('should filter genres by search query', () => {
      render(<GenreFilter genres={mockGenres} searchable />);
      
      const searchInput = screen.getByPlaceholderText(/search genres/i);
      fireEvent.change(searchInput, { target: { value: 'action' } });
      
      expect(screen.getByText('Action')).toBeInTheDocument();
      expect(screen.queryByText('Comedy')).not.toBeInTheDocument();
    });

    it('should show no results message when search yields no matches', () => {
      render(<GenreFilter genres={mockGenres} searchable />);
      
      const searchInput = screen.getByPlaceholderText(/search genres/i);
      fireEvent.change(searchInput, { target: { value: 'nonexistent' } });
      
      expect(screen.getByText(/no genres match/i)).toBeInTheDocument();
    });

    it('should clear search when clear search button is clicked', () => {
      render(<GenreFilter genres={mockGenres} searchable />);
      
      const searchInput = screen.getByPlaceholderText(/search genres/i);
      fireEvent.change(searchInput, { target: { value: 'action' } });
      
      const clearSearchButton = screen.getByRole('button', { name: /clear search/i });
      fireEvent.click(clearSearchButton);
      
      expect(searchInput).toHaveValue('');
      expect(screen.getByText('Comedy')).toBeInTheDocument(); // Should show all genres again
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA attributes', () => {
      render(<GenreFilter genres={mockGenres} />);
      
      const filter = screen.getByRole('group', { name: /genre filter/i });
      expect(filter).toBeInTheDocument();
    });

    it('should have proper checkbox behavior for multi-select', () => {
      render(<GenreFilter genres={mockGenres} multiSelect />);
      
      const actionGenre = screen.getByRole('checkbox', { name: /action/i });
      expect(actionGenre).toBeInTheDocument();
      expect(actionGenre).not.toBeChecked();
    });

    it('should have proper radio behavior for single-select', () => {
      render(<GenreFilter genres={mockGenres} multiSelect={false} />);
      
      const actionGenre = screen.getByRole('radio', { name: /action/i });
      expect(actionGenre).toBeInTheDocument();
    });

    it('should support keyboard navigation', () => {
      render(<GenreFilter genres={mockGenres} />);
      
      const actionBadge = screen.getByText('Action');
      
      // Should be focusable
      actionBadge.focus();
      expect(actionBadge).toHaveFocus();
      
      // Should respond to Enter and Space keys
      const onSelectionChange = jest.fn();
      render(
        <GenreFilter 
          genres={mockGenres} 
          onSelectionChange={onSelectionChange}
        />
      );
      
      fireEvent.keyDown(actionBadge, { key: 'Enter' });
      fireEvent.keyDown(actionBadge, { key: ' ' });
    });

    it('should announce selection changes to screen readers', () => {
      render(<GenreFilter genres={mockGenres} selectedGenres={[28]} />);
      
      const announcement = screen.getByRole('status');
      expect(announcement).toHaveTextContent(/action selected/i);
    });
  });

  describe('Theme Integration', () => {
    it('should adapt to dark/light themes', () => {
      render(<GenreFilter genres={mockGenres} />);
      
      const actionBadge = screen.getByText('Action');
      expect(actionBadge).toHaveClass('dark:bg-gray-700', 'dark:text-gray-300');
    });

    it('should support neon variant', () => {
      render(<GenreFilter genres={mockGenres} variant="neon" />);
      
      const container = screen.getByTestId('genre-filter');
      expect(container).toHaveClass('neon-glow');
    });
  });

  describe('Performance', () => {
    it('should virtualize long lists of genres', () => {
      const manyGenres = Array.from({ length: 1000 }, (_, i) => ({
        id: i,
        name: `Genre ${i}`
      }));
      
      render(<GenreFilter genres={manyGenres} virtualizeThreshold={100} />);
      
      // Should only render visible items
      expect(screen.getAllByText(/Genre/)).toHaveLength(100);
    });

    it('should memoize to prevent unnecessary re-renders', () => {
      const onSelectionChange = jest.fn();
      const { rerender } = render(
        <GenreFilter 
          genres={mockGenres} 
          onSelectionChange={onSelectionChange}
        />
      );
      
      // Same props should not cause re-render
      rerender(
        <GenreFilter 
          genres={mockGenres} 
          onSelectionChange={onSelectionChange}
        />
      );
      
      expect(onSelectionChange).not.toHaveBeenCalled();
    });

    it('should debounce search input', async () => {
      const onSearchChange = jest.fn();
      render(
        <GenreFilter 
          genres={mockGenres} 
          searchable 
          onSearchChange={onSearchChange}
          searchDebounceMs={200}
        />
      );
      
      const searchInput = screen.getByPlaceholderText(/search genres/i);
      
      // Rapid typing
      fireEvent.change(searchInput, { target: { value: 'a' } });
      fireEvent.change(searchInput, { target: { value: 'ac' } });
      fireEvent.change(searchInput, { target: { value: 'act' } });
      
      // Should debounce the calls
      await new Promise(resolve => setTimeout(resolve, 250));
      expect(onSearchChange).toHaveBeenCalledTimes(1);
      expect(onSearchChange).toHaveBeenCalledWith('act');
    });
  });

  describe('Custom Rendering', () => {
    it('should support custom genre renderer', () => {
      const customRenderer = jest.fn(({ genre, isSelected }) => (
        <div key={genre.id} data-testid="custom-genre">
          {genre.name} {isSelected ? '✓' : ''}
        </div>
      ));
      
      render(
        <GenreFilter 
          genres={mockGenres} 
          selectedGenres={[28]}
          renderGenre={customRenderer}
        />
      );
      
      expect(customRenderer).toHaveBeenCalled();
      expect(screen.getByTestId('custom-genre')).toBeInTheDocument();
      expect(screen.getByText('Action ✓')).toBeInTheDocument();
    });

    it('should support custom empty state renderer', () => {
      const customEmptyRenderer = () => (
        <div data-testid="custom-empty">No genres found, try adjusting your search</div>
      );
      
      render(
        <GenreFilter 
          genres={[]} 
          renderEmpty={customEmptyRenderer}
        />
      );
      
      expect(screen.getByTestId('custom-empty')).toBeInTheDocument();
    });
  });
});