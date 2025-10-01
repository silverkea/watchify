import React from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'neon';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    variant = 'primary', 
    size = 'md', 
    loading = false, 
    disabled = false,
    className,
    children,
    onClick,
    ...props 
  }, ref) => {
    const baseClasses = [
      'inline-flex items-center justify-center',
      'font-medium rounded-lg',
      'transition-all duration-200',
      'focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      'active:scale-95'
    ];

    const variantClasses = {
      primary: [
        'bg-purple-600 hover:bg-purple-700',
        'text-white',
        'shadow-md hover:shadow-lg',
        'dark:bg-purple-700 dark:hover:bg-purple-600'
      ],
      secondary: [
        'bg-gray-600 hover:bg-gray-700',
        'text-white',
        'shadow-md hover:shadow-lg',
        'dark:bg-gray-700 dark:hover:bg-gray-600'
      ],
      ghost: [
        'bg-transparent hover:bg-gray-100',
        'text-gray-700 hover:text-gray-900',
        'border border-gray-300 hover:border-gray-400',
        'dark:text-gray-300 dark:hover:text-white',
        'dark:hover:bg-gray-800 dark:border-gray-600'
      ],
      neon: [
        'bg-gradient-to-r from-pink-500 to-purple-600',
        'hover:from-pink-600 hover:to-purple-700',
        'text-white',
        'shadow-lg shadow-purple-500/25',
        'hover:shadow-xl hover:shadow-purple-500/30'
      ]
    };

    const sizeClasses = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg'
    };

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      if (loading || disabled) return;
      onClick?.(event);
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        handleClick(event as any); // Type workaround for keyboard->mouse event
      }
    };

    const isDisabled = disabled || loading;

    return (
      <button
        ref={ref}
        className={cn(
          baseClasses,
          variantClasses[variant],
          sizeClasses[size],
          {
            'opacity-50 cursor-not-allowed': isDisabled
          },
          className
        )}
        disabled={isDisabled}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        {...props}
      >
        {loading ? (
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            <span>Loading...</span>
          </div>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button };