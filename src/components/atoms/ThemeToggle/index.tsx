import React, { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { Sun, Moon, Monitor } from 'lucide-react';
import { cn } from '@/lib/utils';

export type Theme = 'light' | 'dark' | 'system';

export interface ThemeToggleProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'> {
  variant?: 'default' | 'outline' | 'ghost' | 'neon';
  size?: 'sm' | 'md' | 'lg';
  showTooltip?: boolean;
}

const ThemeToggle = React.forwardRef<HTMLButtonElement, ThemeToggleProps>(
  ({ 
    variant = 'default', 
    size = 'md',
    showTooltip = false,
    className,
    ...props 
  }, ref) => {
    const { theme, setTheme } = useTheme();
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [lastClickTime, setLastClickTime] = useState(0);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
      setMounted(true);
    }, []);

    // Prevent hydration errors by not rendering until mounted
    if (!mounted) {
      return (
        <button
          ref={ref}
          type="button"
          className={cn(
            'inline-flex items-center justify-center',
            'rounded-lg border',
            'h-10 w-10 p-2',
            'border-gray-300 bg-white',
            'dark:border-gray-600 dark:bg-gray-800',
            className
          )}
          disabled
          {...props}
        >
          <Sun className="transition-transform duration-200" />
        </button>
      );
    }

    const currentTheme = (theme as Theme) || 'system';

    const getNextTheme = (current: Theme): Theme => {
      switch (current) {
        case 'light': return 'dark';
        case 'dark': return 'system';
        case 'system': return 'light';
        default: return 'light';
      }
    };

    const getThemeIcon = (themeValue: Theme) => {
      const iconProps = {
        className: cn('transition-transform duration-200', {
          'animate-spin': isTransitioning
        }),
        'data-icon': themeValue === 'light' ? 'sun' : themeValue === 'dark' ? 'moon' : 'system'
      };

      switch (themeValue) {
        case 'light':
          return <Sun {...iconProps} />;
        case 'dark':
          return <Moon {...iconProps} />;
        case 'system':
          return <Monitor {...iconProps} />;
        default:
          return <Sun {...iconProps} />;
      }
    };

    const getAriaLabel = (themeValue: Theme): string => {
      const nextTheme = getNextTheme(themeValue);
      switch (nextTheme) {
        case 'light': return 'Switch to light theme';
        case 'dark': return 'Switch to dark theme';
        case 'system': return 'Switch to system theme';
        default: return 'Switch theme';
      }
    };

    const baseClasses = [
      'inline-flex items-center justify-center',
      'rounded-lg border',
      'transition-all duration-200',
      'focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      'active:scale-95',
      'contrast:border-black'
    ];

    const variantClasses = {
      default: [
        'border-gray-300 bg-white hover:bg-gray-50',
        'text-gray-700 hover:text-gray-900',
        'dark:border-gray-600 dark:bg-gray-800 dark:hover:bg-gray-700',
        'dark:text-gray-300 dark:hover:text-white'
      ],
      outline: [
        'border-2 border-gray-300 bg-transparent hover:bg-gray-50',
        'text-gray-700 hover:text-gray-900',
        'dark:border-gray-600 dark:hover:bg-gray-800',
        'dark:text-gray-300 dark:hover:text-white'
      ],
      ghost: [
        'border-transparent bg-transparent hover:bg-gray-100',
        'text-gray-700 hover:text-gray-900',
        'dark:hover:bg-gray-800',
        'dark:text-gray-300 dark:hover:text-white'
      ],
      neon: [
        'border-purple-500 bg-transparent hover:bg-purple-50',
        'text-purple-600 hover:text-purple-700',
        'shadow-lg shadow-purple-500/25',
        'hover:shadow-xl hover:shadow-purple-500/30',
        'dark:border-purple-400 dark:text-purple-400',
        'dark:hover:bg-purple-900/20'
      ]
    };

    const sizeClasses = {
      sm: 'h-8 w-8 p-1',
      md: 'h-10 w-10 p-2',
      lg: 'h-12 w-12 p-3'
    };

    const handleClick = () => {
      const now = Date.now();
      
      // Debounce rapid clicks (prevent within 200ms)
      if (now - lastClickTime < 200) {
        return;
      }
      
      setLastClickTime(now);
      setIsTransitioning(true);
      
      const nextTheme = getNextTheme(currentTheme);
      setTheme(nextTheme);
      
      // Reset transition state
      setTimeout(() => setIsTransitioning(false), 200);
    };

    const handleKeyDown = (event: React.KeyboardEvent) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        handleClick();
      }
    };

    return (
      <button
        ref={ref}
        type="button"
        className={cn(
          baseClasses,
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        aria-label={getAriaLabel(currentTheme)}
        aria-live="polite"
        title={showTooltip ? getAriaLabel(currentTheme) : undefined}
        {...props}
      >
        {getThemeIcon(currentTheme)}
      </button>
    );
  }
);

ThemeToggle.displayName = 'ThemeToggle';

export { ThemeToggle };