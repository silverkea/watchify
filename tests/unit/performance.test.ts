import { renderHook } from '@testing-library/react';import { renderHook } from '@testing-library/react';import { renderHook } from '@testing-library/react';/**

import { useIntersectionObserver, preloadImages, trackWebVitals } from '@/lib/performance';

import { useIntersectionObserver, preloadImages, trackWebVitals } from '@/lib/performance';

const mockObserve = jest.fn();

const mockUnobserve = jest.fn();import { useIntersectionObserver, preloadImages, trackWebVitals } from '@/lib/performance'; * Unit Tests for Performance Utilities



beforeAll(() => {// Mock IntersectionObserver

  global.IntersectionObserver = jest.fn().mockImplementation(() => ({

    observe: mockObserve,const mockObserve = jest.fn(); * Tests for lazy loading, intersection observer, and performance optimization helpers

    unobserve: mockUnobserve,

    disconnect: jest.fn(),const mockUnobserve = jest.fn();

  }));

});const mockDisconnect = jest.fn();// Mock IntersectionObserver */



describe('Performance Utilities', () => {

  describe('useIntersectionObserver', () => {

    it('should initialize with correct default values', () => {beforeAll(() => {const mockIntersectionObserver = jest.fn();

      const { result } = renderHook(() => useIntersectionObserver());

      expect(result.current.isIntersecting).toBe(false);  global.IntersectionObserver = jest.fn().mockImplementation(() => ({

      expect(result.current.hasIntersected).toBe(false);

    });    observe: mockObserve,const mockObserve = jest.fn();import { renderHook, act } from '@testing-library/react';

  });

    unobserve: mockUnobserve,

  describe('preloadImages', () => {

    it('should handle preloading images', async () => {    disconnect: mockDisconnect,const mockUnobserve = jest.fn();import { useIntersectionObserver, useDebounce, useThrottle, PerformanceMonitor } from '@/lib/performance';

      global.Image = jest.fn().mockImplementation(() => ({

        onload: null,  }));

        onerror: null,

        src: ''});const mockDisconnect = jest.fn();

      }));



      const sources = ['image1.jpg'];

      const promise = preloadImages(sources);describe('Performance Utilities', () => {// Mock IntersectionObserver

      await expect(promise).resolves.toBeDefined();

    });  describe('useIntersectionObserver', () => {

  });

    it('should initialize with correct default values', () => {beforeAll(() => {const mockIntersectionObserver = jest.fn();

  describe('trackWebVitals', () => {

    it('should not throw when called', () => {      const { result } = renderHook(() => useIntersectionObserver());

      expect(() => trackWebVitals()).not.toThrow();

    });        global.IntersectionObserver = jest.fn().mockImplementation((callback) => {mockIntersectionObserver.mockReturnValue({

  });

});      expect(result.current.isIntersecting).toBe(false);

      expect(result.current.hasIntersected).toBe(false);    mockIntersectionObserver(callback, { threshold: 0.1 });  observe: () => null,

    });

  });    return {  unobserve: () => null,



  describe('preloadImages', () => {      observe: mockObserve,  disconnect: () => null

    beforeEach(() => {

      global.Image = jest.fn().mockImplementation(() => ({      unobserve: mockUnobserve,});

        onload: null,

        onerror: null,      disconnect: mockDisconnect,window.IntersectionObserver = mockIntersectionObserver;

        src: ''

      }));    };

    });

  });describe('Performance Utilities', () => {

    it('should handle preloading images', async () => {

      const sources = ['image1.jpg', 'image2.jpg'];});  beforeEach(() => {

      const mockImage = {

        src: '',    jest.clearAllMocks();

        onload: null as any,

        onerror: null as any,describe('Performance Utilities', () => {    jest.useFakeTimers();

      };

        describe('useIntersectionObserver', () => {  });

      global.Image = jest.fn().mockImplementation(() => mockImage);

          it('should initialize with correct default values', () => {

      const promise = preloadImages(sources);

            const { result } = renderHook(() => useIntersectionObserver());  afterEach(() => {

      // Simulate successful image load

      if (mockImage.onload) mockImage.onload();          jest.useRealTimers();

      

      await expect(promise).resolves.toBeDefined();      expect(result.current.isIntersecting).toBe(false);  });

    });

  });      expect(result.current.hasIntersected).toBe(false);



  describe('trackWebVitals', () => {    });  describe('useIntersectionObserver', () => {

    it('should not throw when called', () => {

      expect(() => trackWebVitals()).not.toThrow();    it('should initialize with correct default values', () => {

    });

  });    it('should create observer with custom options', () => {      const { result } = renderHook(() => useIntersectionObserver());

});
      const options = { threshold: 0.5, rootMargin: '100px' };      

      renderHook(() => useIntersectionObserver(options));      expect(result.current.isIntersecting).toBe(false);

            expect(result.current.hasIntersected).toBe(false);

      expect(global.IntersectionObserver).toHaveBeenCalledWith(      expect(result.current.ref).toBeDefined();

        expect.any(Function),    });

        expect.objectContaining({

          threshold: 0.5,    it('should create observer with custom options', () => {

          rootMargin: '100px'      const options = { threshold: 0.5, rootMargin: '100px' };

        })      renderHook(() => useIntersectionObserver(options));

      );      

    });      expect(mockIntersectionObserver).toHaveBeenCalledWith(

  });        expect.any(Function),

        expect.objectContaining({

  describe('preloadImages', () => {          threshold: 0.5,

    beforeEach(() => {          rootMargin: '100px'

      // Mock Image constructor        })

      global.Image = jest.fn().mockImplementation(() => ({      );

        onload: null,    });

        onerror: null,  });

        src: ''

      }));  describe('useDebounce', () => {

    });    it('should return initial value immediately', () => {

      const { result } = renderHook(() => useDebounce('initial', 500));

    it('should preload multiple images', async () => {      

      const sources = ['image1.jpg', 'image2.jpg'];      expect(result.current).toBe('initial');

      const mockImage = {    });

        src: '',

        onload: null as any,    it('should debounce value changes', () => {

        onerror: null as any,      let value = 'initial';

      };      const { result, rerender } = renderHook(() => useDebounce(value, 500));

            

      global.Image = jest.fn().mockImplementation(() => mockImage);      expect(result.current).toBe('initial');

            

      const promise = preloadImages(sources);      // Change value

            value = 'updated';

      // Simulate successful image load      rerender();

      setTimeout(() => {      

        if (mockImage.onload) mockImage.onload();      // Should still be initial before delay

      }, 0);      expect(result.current).toBe('initial');

            

      await expect(promise).resolves.toEqual([undefined, undefined]);      // Fast forward time

    }, 10000);      act(() => {

  });        jest.advanceTimersByTime(500);

      });

  describe('trackWebVitals', () => {      

    it('should not throw when web-vitals is not available', () => {      // Now should be updated

      expect(() => trackWebVitals()).not.toThrow();      expect(result.current).toBe('updated');

    });    });

  });

});    it('should reset timer on rapid changes', () => {
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