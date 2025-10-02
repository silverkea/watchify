/**
 * Unit Tests for Utility Functions
 * Tests for shared utility functions and helpers
 */

import { cn } from '@/lib/utils';
import { formatDate, formatRuntime, formatRating } from '@/lib/format';

describe('Utility Functions', () => {
  describe('cn (className utility)', () => {
    it('should merge class names correctly', () => {
      const result = cn('base-class', 'additional-class');
      expect(result).toContain('base-class');
      expect(result).toContain('additional-class');
    });

    it('should handle conditional classes', () => {
      const isActive = true;
      const result = cn('base-class', {
        'active-class': isActive,
        'inactive-class': !isActive,
      });
      
      expect(result).toContain('base-class');
      expect(result).toContain('active-class');
      expect(result).not.toContain('inactive-class');
    });

    it('should filter out falsy values', () => {
      const result = cn('base-class', null, undefined, false, 'valid-class');
      expect(result).toContain('base-class');
      expect(result).toContain('valid-class');
      expect(result).not.toContain('null');
      expect(result).not.toContain('undefined');
      expect(result).not.toContain('false');
    });
  });

  describe('formatDate', () => {
    it('should format date string correctly', () => {
      const result = formatDate('2024-01-15');
      expect(result).toBe('January 15, 2024');
    });

    it('should format Date object correctly', () => {
      const date = new Date('2024-01-15T00:00:00Z');
      const result = formatDate(date);
      expect(result).toBe('January 15, 2024');
    });

    it('should handle invalid date', () => {
      const result = formatDate('invalid-date');
      expect(result).toBe('Invalid Date');
    });

    it('should handle null/undefined', () => {
      expect(formatDate(null)).toBe('');
      expect(formatDate(undefined)).toBe('');
    });

    it('should use custom format options', () => {
      const result = formatDate('2024-01-15', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
      expect(result).toBe('Jan 15, 2024');
    });
  });

  describe('formatRuntime', () => {
    it('should format runtime in minutes correctly', () => {
      expect(formatRuntime(90)).toBe('1h 30m');
      expect(formatRuntime(120)).toBe('2h 0m');
      expect(formatRuntime(45)).toBe('45m');
    });

    it('should handle edge cases', () => {
      expect(formatRuntime(0)).toBe('0m');
      expect(formatRuntime(60)).toBe('1h 0m');
      expect(formatRuntime(59)).toBe('59m');
    });

    it('should handle null/undefined', () => {
      expect(formatRuntime(null)).toBe('');
      expect(formatRuntime(undefined)).toBe('');
    });

    it('should handle negative values', () => {
      expect(formatRuntime(-30)).toBe('');
    });
  });

  describe('formatRating', () => {
    it('should format rating with one decimal place', () => {
      expect(formatRating(7.8)).toBe('7.8');
      expect(formatRating(8.0)).toBe('8.0');
      expect(formatRating(9.15)).toBe('9.2'); // Should round to 1 decimal
    });

    it('should handle edge cases', () => {
      expect(formatRating(0)).toBe('0.0');
      expect(formatRating(10)).toBe('10.0');
    });

    it('should handle null/undefined', () => {
      expect(formatRating(null)).toBe('N/A');
      expect(formatRating(undefined)).toBe('N/A');
    });

    it('should handle out of range values', () => {
      expect(formatRating(-1)).toBe('N/A');
      expect(formatRating(11)).toBe('N/A');
    });
  });
});