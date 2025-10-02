/**
 * Performance Utilities
 * Lazy loading, intersection observer, and performance optimization helpers
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';

/**
 * Intersection Observer hook for lazy loading
 */
export function useIntersectionObserver<T extends Element>(
  options: IntersectionObserverInit = {}
) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasIntersected, setHasIntersected] = useState(false);
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
        if (entry.isIntersecting && !hasIntersected) {
          setHasIntersected(true);
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
        ...options,
      }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [hasIntersected, options]);

  return { ref, isIntersecting, hasIntersected };
}

/**
 * Debounce hook for performance optimization
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Throttle hook for performance optimization
 */
export function useThrottle<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T {
  const lastCall = useRef<number>(0);
  const timeout = useRef<NodeJS.Timeout>();

  return useCallback(
    ((...args: Parameters<T>) => {
      const now = Date.now();
      
      if (now - lastCall.current >= delay) {
        lastCall.current = now;
        return callback(...args);
      } else {
        clearTimeout(timeout.current);
        timeout.current = setTimeout(() => {
          lastCall.current = Date.now();
          callback(...args);
        }, delay - (now - lastCall.current));
      }
    }) as T,
    [callback, delay]
  );
}

/**
 * Virtual scrolling hook for large lists
 */
export function useVirtualScroll<T>({
  items,
  itemHeight,
  containerHeight,
  overscan = 5,
}: {
  items: T[];
  itemHeight: number;
  containerHeight: number;
  overscan?: number;
}) {
  const [scrollTop, setScrollTop] = useState(0);

  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex = Math.min(
    items.length - 1,
    Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
  );

  const visibleItems = items.slice(startIndex, endIndex + 1);
  const totalHeight = items.length * itemHeight;
  const offsetY = startIndex * itemHeight;

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);

  return {
    visibleItems,
    totalHeight,
    offsetY,
    handleScroll,
    startIndex,
    endIndex,
  };
}

/**
 * Image preloader utility
 */
export function preloadImage(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = src;
  });
}

/**
 * Batch image preloader
 */
export function preloadImages(srcs: string[]): Promise<void[]> {
  return Promise.all(srcs.map(preloadImage));
}

/**
 * Progressive image loading component
 */
interface ProgressiveImageProps {
  src: string;
  placeholder: string;
  alt: string;
  className?: string;
  onLoad?: () => void;
  onError?: () => void;
}

export function ProgressiveImage({
  src,
  placeholder,
  alt,
  className,
  onLoad,
  onError,
}: ProgressiveImageProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageSrc, setImageSrc] = useState(placeholder);

  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      setImageSrc(src);
      setImageLoaded(true);
      onLoad?.();
    };
    img.onerror = () => {
      onError?.();
    };
    img.src = src;
  }, [src, onLoad, onError]);

  return React.createElement('img', {
    src: imageSrc,
    alt: alt,
    className: `${className} transition-opacity duration-300 ${
      imageLoaded ? 'opacity-100' : 'opacity-70'
    }`,
    loading: 'lazy'
  });
}

/**
 * Performance monitoring utilities
 */
export class PerformanceMonitor {
  private static marks: Map<string, number> = new Map();

  static mark(name: string) {
    if (typeof window !== 'undefined' && 'performance' in window) {
      window.performance.mark(name);
      this.marks.set(name, Date.now());
    }
  }

  static measure(name: string, startMark: string, endMark?: string) {
    if (typeof window !== 'undefined' && 'performance' in window) {
      try {
        if (endMark) {
          window.performance.measure(name, startMark, endMark);
        } else {
          window.performance.measure(name, startMark);
        }
        
        const entries = window.performance.getEntriesByName(name, 'measure');
        const latestEntry = entries[entries.length - 1];
        
        if (process.env.NODE_ENV === 'development') {
          console.log(`Performance: ${name} took ${latestEntry.duration.toFixed(2)}ms`);
        }
        
        return latestEntry.duration;
      } catch (error) {
        console.warn('Performance measurement failed:', error);
      }
    }
    return null;
  }

  static getMetrics() {
    if (typeof window !== 'undefined' && 'performance' in window) {
      return {
        navigation: window.performance.getEntriesByType('navigation')[0],
        paint: window.performance.getEntriesByType('paint'),
        marks: window.performance.getEntriesByType('mark'),
        measures: window.performance.getEntriesByType('measure'),
      };
    }
    return null;
  }
}

/**
 * Web Vitals tracking placeholder
 * Install web-vitals package for actual tracking
 */
export function trackWebVitals() {
  if (typeof window !== 'undefined') {
    // Track Core Web Vitals - requires web-vitals package
    // npm install web-vitals
    if (process.env.NODE_ENV === 'development') {
      console.log('Web Vitals tracking available after installing web-vitals package');
    }
  }
}

/**
 * Memory usage monitor
 */
export function useMemoryMonitor() {
  const [memoryInfo, setMemoryInfo] = useState<any>(null);

  useEffect(() => {
    const updateMemoryInfo = () => {
      if ('memory' in performance) {
        setMemoryInfo((performance as any).memory);
      }
    };

    updateMemoryInfo();
    const interval = setInterval(updateMemoryInfo, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return memoryInfo;
}