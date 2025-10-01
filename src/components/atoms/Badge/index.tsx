import React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'neon';
  size?: 'sm' | 'md' | 'lg';
  shape?: 'rounded' | 'pill' | 'square';
  removable?: boolean;
  onRemove?: () => void;
  children: React.ReactNode;
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ 
    variant = 'default', 
    size = 'md',
    shape = 'rounded',
    removable = false,
    onRemove,
    className,
    children,
    onClick,
    ...props 
  }, ref) => {
    const baseClasses = [
      'inline-flex items-center font-medium',
      'transition-all duration-200',
      'focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-1',
    ];

    const variantClasses = {
      default: [
        'bg-gray-100 text-gray-800',
        'dark:bg-gray-900 dark:text-gray-100'
      ],
      primary: [
        'bg-purple-100 text-purple-800',
        'dark:bg-purple-900 dark:text-purple-100'
      ],
      secondary: [
        'bg-gray-100 text-gray-800',
        'dark:bg-gray-700 dark:text-white'
      ],
      success: [
        'bg-green-100 text-green-800',
        'dark:bg-green-900 dark:text-green-100'
      ],
      warning: [
        'bg-yellow-100 text-yellow-800',
        'dark:bg-yellow-900 dark:text-yellow-100'
      ],
      error: [
        'bg-red-100 text-red-800',
        'dark:bg-red-900 dark:text-red-100'
      ],
      neon: [
        'bg-gradient-to-r from-pink-100 to-purple-100',
        'text-purple-800',
        'shadow-sm shadow-purple-500/25',
        'dark:from-pink-900 dark:to-purple-900 dark:text-purple-100'
      ]
    };

    const sizeClasses = {
      sm: 'px-2 py-0.5 text-xs',
      md: 'px-2.5 py-1 text-sm',
      lg: 'px-3 py-1.5 text-base'
    };

    const shapeClasses = {
      rounded: 'rounded-md',
      pill: 'rounded-full',
      square: 'rounded-none'
    };

    const isClickable = Boolean(onClick) || removable;

    const handleRemove = (event: React.MouseEvent) => {
      event.stopPropagation();
      onRemove?.();
    };

    const handleRemoveKeyDown = (event: React.KeyboardEvent) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        event.stopPropagation();
        onRemove?.();
      }
    };

    const badgeContent = typeof children === 'string' ? children : 'Badge';

    return (
      <span
        ref={ref}
        className={cn(
          baseClasses,
          variantClasses[variant],
          sizeClasses[size],
          shapeClasses[shape],
          {
            'cursor-pointer hover:opacity-80': isClickable && !removable,
          },
          className
        )}
        onClick={onClick}
        tabIndex={isClickable ? 0 : undefined}
        role={isClickable ? 'button' : undefined}
        {...props}
      >
        {children}
        
        {removable && (
          <button
            type="button"
            className="ml-1 -mr-0.5 flex-shrink-0 rounded-full p-0.5 hover:bg-black/10 focus:outline-none focus:ring-1 focus:ring-purple-500 dark:hover:bg-white/10"
            onClick={handleRemove}
            onKeyDown={handleRemoveKeyDown}
            aria-label={`Remove ${badgeContent}`}
          >
            <svg
              className="h-3 w-3"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        )}
      </span>
    );
  }
);

Badge.displayName = 'Badge';

export { Badge };