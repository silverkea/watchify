/**
 * Unit Tests for Performance Utilities
 * Tests for lazy loading, intersection observer, and performance optimization helpers
 */

import { renderHook, act } from '@testing-library/react';
import { useIntersectionObserver, useDebounce, useThrottle, PerformanceMonitor } from '@/lib/performance';

// Mock IntersectionObserver
const mockIntersectionObserver = jest.fn();
mockIntersectionObserver.mockReturnValue({
  observe: () => null,
  unobserve: () => null,
  disconnect: () => null
});
window.IntersectionObserver = mockIntersectionObserver;

describe('Performance Utilities', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('useIntersectionObserver', () => {
    it('should initialize with correct default values', () => {
      const { result } = renderHook(() => useIntersectionObserver());
      
      expect(result.current.isIntersecting).toBe(false);
      expect(result.current.hasIntersected).toBe(false);
      expect(result.current.ref).toBeDefined();
    });

    it('should create observer with custom options', () => {
      const options = { threshold: 0.5, rootMargin: '100px' };
      renderHook(() => useIntersectionObserver(options));
      
      expect(mockIntersectionObserver).toHaveBeenCalledWith(
        expect.any(Function),
        expect.objectContaining({
          threshold: 0.5,
          rootMargin: '100px'
        })
      );
    });
  });

  describe('useDebounce', () => {
    it('should return initial value immediately', () => {
      const { result } = renderHook(() => useDebounce('initial', 500));
      
      expect(result.current).toBe('initial');
    });

    it('should debounce value changes', () => {
      let value = 'initial';
      const { result, rerender } = renderHook(() => useDebounce(value, 500));
      
      expect(result.current).toBe('initial');
      
      // Change value
      value = 'updated';
      rerender();
      
      // Should still be initial before delay
      expect(result.current).toBe('initial');
      
      // Fast forward time
      act(() => {
        jest.advanceTimersByTime(500);
      });
      
      // Now should be updated
      expect(result.current).toBe('updated');
    });

    it('should reset timer on rapid changes', () => {
      let value = 'initial';
      const { result, rerender } = renderHook(() => useDebounce(value, 500));
      
      // First change
      value = 'first';
      rerender();
      
      // Second change before delay
      act(() => {
        jest.advanceTimersByTime(250);
      });
      value = 'second';
      rerender();
      
      // Should still be initial
      expect(result.current).toBe('initial');
      
      // Complete the delay
      act(() => {
        jest.advanceTimersByTime(500);
      });
      
      // Should be the latest value
      expect(result.current).toBe('second');
    });
  });

  describe('useThrottle', () => {
    it('should throttle function calls', () => {
      const mockFn = jest.fn();
      const { result } = renderHook(() => useThrottle(mockFn, 1000));
      
      // Call multiple times quickly
      act(() => {
        result.current('arg1');
        result.current('arg2');
        result.current('arg3');
      });
      
      // Should only be called once
      expect(mockFn).toHaveBeenCalledTimes(1);
      expect(mockFn).toHaveBeenCalledWith('arg1');
    });

    it('should allow calls after throttle period', () => {
      const mockFn = jest.fn();
      const { result } = renderHook(() => useThrottle(mockFn, 1000));
      
      // First call
      act(() => {
        result.current('first');
      });
      
      expect(mockFn).toHaveBeenCalledTimes(1);
      
      // Fast forward past throttle period
      act(() => {
        jest.advanceTimersByTime(1000);
      });
      
      // Second call
      act(() => {
        result.current('second');
      });
      
      expect(mockFn).toHaveBeenCalledTimes(2);
      expect(mockFn).toHaveBeenLastCalledWith('second');
    });
  });

  describe('PerformanceMonitor', () => {
    beforeEach(() => {
      // Mock performance API
      Object.defineProperty(window, 'performance', {
        value: {
          mark: jest.fn(),
          measure: jest.fn(),
          getEntriesByName: jest.fn().mockReturnValue([{ duration: 100.5 }]),
          getEntriesByType: jest.fn().mockReturnValue([]),
        },
        writable: true,
      });
    });

    it('should create performance marks', () => {
      PerformanceMonitor.mark('test-mark');
      
      expect(window.performance.mark).toHaveBeenCalledWith('test-mark');
    });

    it('should measure performance between marks', () => {
      const duration = PerformanceMonitor.measure('test-measure', 'start-mark', 'end-mark');
      
      expect(window.performance.measure).toHaveBeenCalledWith('test-measure', 'start-mark', 'end-mark');
      expect(duration).toBe(100.5);
    });

    it('should get performance metrics', () => {
      const metrics = PerformanceMonitor.getMetrics();
      
      expect(metrics).toBeDefined();
      expect(window.performance.getEntriesByType).toHaveBeenCalledWith('navigation');
      expect(window.performance.getEntriesByType).toHaveBeenCalledWith('paint');
      expect(window.performance.getEntriesByType).toHaveBeenCalledWith('mark');
      expect(window.performance.getEntriesByType).toHaveBeenCalledWith('measure');
    });
  });

  describe('Image utilities', () => {
    it('should preload single image successfully', async () => {
      // Mock Image constructor
      const mockImage = {
        src: '',
        onload: null as any,
        onerror: null as any,
      };
      
      global.Image = jest.fn(() => mockImage) as any;
      
      const { preloadImage } = await import('@/lib/performance');
      const promise = preloadImage('/test-image.jpg');
      
      // Simulate successful load
      if (mockImage.onload) {
        mockImage.onload();
      }
      
      await expect(promise).resolves.toBeUndefined();
      expect(mockImage.src).toBe('/test-image.jpg');
    });

    it('should handle image load error', async () => {
      const mockImage = {
        src: '',
        onload: null as any,
        onerror: null as any,
      };
      
      global.Image = jest.fn(() => mockImage) as any;
      
      const { preloadImage } = await import('@/lib/performance');
      const promise = preloadImage('/invalid-image.jpg');
      
      // Simulate error
      if (mockImage.onerror) {
        mockImage.onerror();
      }
      
      await expect(promise).rejects.toBeUndefined();
    });

    it('should preload multiple images', async () => {
      const mockImage = {
        src: '',
        onload: null as any,
        onerror: null as any,
      };
      
      global.Image = jest.fn(() => mockImage) as any;
      
      const { preloadImages } = await import('@/lib/performance');
      const promise = preloadImages(['/image1.jpg', '/image2.jpg']);
      
      // Simulate successful loads
      if (mockImage.onload) {
        mockImage.onload();
      }
      
      await expect(promise).resolves.toHaveLength(2);
    });
  });

  describe('trackWebVitals', () => {
    it('should not throw when web-vitals is not available', () => {
      const { trackWebVitals } = require('@/lib/performance');
      
      expect(() => trackWebVitals()).not.toThrow();
    });
  });
});