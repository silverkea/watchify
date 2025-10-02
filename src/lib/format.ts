/**
 * Format Utilities
 * Helper functions for formatting dates, times, ratings, and other data
 */

/**
 * Format date string or Date object to human-readable format
 */
export function formatDate(
  date: string | Date | null | undefined,
  options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }
): string {
  if (!date) return '';
  
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    if (isNaN(dateObj.getTime())) {
      return 'Invalid Date';
    }
    
    return dateObj.toLocaleDateString('en-US', options);
  } catch {
    return 'Invalid Date';
  }
}

/**
 * Format runtime in minutes to hours and minutes
 */
export function formatRuntime(runtime: number | null | undefined): string {
  if (!runtime || runtime < 0) return '';
  
  const hours = Math.floor(runtime / 60);
  const minutes = runtime % 60;
  
  if (hours === 0) {
    return `${minutes}m`;
  }
  
  return `${hours}h ${minutes}m`;
}

/**
 * Format movie rating to one decimal place
 */
export function formatRating(rating: number | null | undefined): string {
  if (rating === null || rating === undefined || rating < 0 || rating > 10) {
    return 'N/A';
  }
  
  return rating.toFixed(1);
}

/**
 * Format large numbers with abbreviations (K, M, B)
 */
export function formatNumber(num: number | null | undefined): string {
  if (!num || num < 0) return '0';
  
  if (num >= 1_000_000_000) {
    return `${(num / 1_000_000_000).toFixed(1)}B`;
  }
  
  if (num >= 1_000_000) {
    return `${(num / 1_000_000).toFixed(1)}M`;
  }
  
  if (num >= 1_000) {
    return `${(num / 1_000).toFixed(1)}K`;
  }
  
  return num.toString();
}

/**
 * Format currency values
 */
export function formatCurrency(
  amount: number | null | undefined,
  currency = 'USD',
  locale = 'en-US'
): string {
  if (!amount || amount < 0) return 'N/A';
  
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `$${formatNumber(amount)}`;
  }
}

/**
 * Format percentage values
 */
export function formatPercentage(
  value: number | null | undefined,
  decimals = 1
): string {
  if (value === null || value === undefined || isNaN(value)) {
    return 'N/A';
  }
  
  return `${value.toFixed(decimals)}%`;
}

/**
 * Truncate text with ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
  if (!text || text.length <= maxLength) return text;
  
  return `${text.slice(0, maxLength).trim()}...`;
}

/**
 * Format duration in seconds to human-readable format
 */
export function formatDuration(seconds: number | null | undefined): string {
  if (!seconds || seconds < 0) return '0:00';
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
  
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

/**
 * Format file size in bytes to human-readable format
 */
export function formatFileSize(bytes: number | null | undefined): string {
  if (!bytes || bytes < 0) return '0 B';
  
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let size = bytes;
  let unitIndex = 0;
  
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }
  
  return `${size.toFixed(unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
}

/**
 * Format relative time (time ago)
 */
export function formatRelativeTime(
  date: string | Date | null | undefined
): string {
  if (!date) return '';
  
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    if (isNaN(dateObj.getTime())) {
      return 'Invalid Date';
    }
    
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return 'just now';
    }
    
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `${diffInMinutes} minute${diffInMinutes === 1 ? '' : 's'} ago`;
    }
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours === 1 ? '' : 's'} ago`;
    }
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) {
      return `${diffInDays} day${diffInDays === 1 ? '' : 's'} ago`;
    }
    
    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths < 12) {
      return `${diffInMonths} month${diffInMonths === 1 ? '' : 's'} ago`;
    }
    
    const diffInYears = Math.floor(diffInMonths / 12);
    return `${diffInYears} year${diffInYears === 1 ? '' : 's'} ago`;
  } catch {
    return 'Invalid Date';
  }
}