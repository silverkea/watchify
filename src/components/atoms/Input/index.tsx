import React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  variant?: 'default' | 'error' | 'success' | 'neon';
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  error?: string;
  helperText?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ 
    variant = 'default', 
    size = 'md',
    label,
    error,
    helperText,
    className,
    id,
    ...props 
  }, ref) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
    const hasError = Boolean(error);
    const actualVariant = hasError ? 'error' : variant;

    const baseClasses = [
      'w-full rounded-lg border',
      'transition-all duration-200',
      'focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-1',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      'placeholder:text-gray-400',
      'dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500'
    ];

    const variantClasses = {
      default: [
        'border-gray-300',
        'focus:border-purple-500',
        'dark:border-gray-600 dark:focus:border-purple-400'
      ],
      error: [
        'border-red-500',
        'focus:border-red-500 focus:ring-red-500',
        'dark:border-red-400'
      ],
      success: [
        'border-green-500',
        'focus:border-green-500 focus:ring-green-500',
        'dark:border-green-400'
      ],
      neon: [
        'border-purple-500',
        'focus:border-purple-400',
        'focus:shadow-lg focus:shadow-purple-500/25',
        'dark:border-purple-400'
      ]
    };

    const sizeClasses = {
      sm: 'px-2 py-1 text-sm',
      md: 'px-3 py-2 text-base',
      lg: 'px-4 py-3 text-lg'
    };

    return (
      <div className="space-y-1">
        {label && (
          <label 
            htmlFor={inputId}
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            {label}
          </label>
        )}
        
        <input
          ref={ref}
          id={inputId}
          className={cn(
            baseClasses,
            variantClasses[actualVariant],
            sizeClasses[size],
            className
          )}
          aria-invalid={hasError}
          aria-describedby={
            error ? `${inputId}-error` : 
            helperText ? `${inputId}-helper` : undefined
          }
          {...props}
        />
        
        {error && (
          <p 
            id={`${inputId}-error`}
            className="text-sm text-red-600 dark:text-red-400"
            role="alert"
          >
            {error}
          </p>
        )}
        
        {helperText && !error && (
          <p 
            id={`${inputId}-helper`}
            className="text-sm text-gray-500 dark:text-gray-400"
          >
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input };