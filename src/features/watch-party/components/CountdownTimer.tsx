/**
 * CountdownTimer Molecule Component
 * Displays a real-time countdown to the watch party start time
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Clock, Play, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface CountdownTimerProps {
  targetDate: string | Date;
  onTimeUp?: () => void;
  onTick?: (timeLeft: TimeLeft) => void;
  className?: string;
  variant?: 'default' | 'compact' | 'neon';
  showLabels?: boolean;
  showIcon?: boolean;
}

export interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  total: number;
  isExpired: boolean;
}

export function CountdownTimer({
  targetDate,
  onTimeUp,
  onTick,
  className,
  variant = 'default',
  showLabels = true,
  showIcon = true
}: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    total: 0,
    isExpired: false
  });

  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const calculateTimeLeft = (): TimeLeft => {
      const target = new Date(targetDate).getTime();
      const now = new Date().getTime();
      const difference = target - now;

      if (difference <= 0) {
        return {
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          total: 0,
          isExpired: true
        };
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000),
        total: difference,
        isExpired: false
      };
    };

    // Initial calculation
    const initial = calculateTimeLeft();
    setTimeLeft(initial);
    
    if (onTick) {
      onTick(initial);
    }

    // Set up interval for updates
    const timer = setInterval(() => {
      const newTimeLeft = calculateTimeLeft();
      setTimeLeft(newTimeLeft);
      
      if (onTick) {
        onTick(newTimeLeft);
      }
      
      // Check if time is up
      if (newTimeLeft.isExpired && onTimeUp) {
        onTimeUp();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate, onTimeUp, onTick]);

  const formatNumber = (num: number): string => {
    return num.toString().padStart(2, '0');
  };

  const getUrgencyClass = (): string => {
    if (timeLeft.isExpired) return 'text-red-600 dark:text-red-400';
    if (timeLeft.total < 60000) return 'text-red-500 dark:text-red-400'; // Less than 1 minute
    if (timeLeft.total < 300000) return 'text-orange-500 dark:text-orange-400'; // Less than 5 minutes
    if (timeLeft.total < 3600000) return 'text-yellow-500 dark:text-yellow-400'; // Less than 1 hour
    return 'text-green-500 dark:text-green-400';
  };

  if (timeLeft.isExpired) {
    return (
      <div className={cn(
        "flex items-center justify-center p-4 rounded-lg",
        "bg-red-50 dark:bg-red-900/20",
        "border border-red-200 dark:border-red-800",
        className
      )} data-testid="countdown-timer">
        <Play className="w-6 h-6 text-red-600 dark:text-red-400 mr-2" />
        <span className="text-lg font-semibold text-red-600 dark:text-red-400">
          Watch Party Started!
        </span>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className={cn(
        "flex items-center space-x-2",
        getUrgencyClass(),
        className
      )} data-testid="countdown-timer">
        {showIcon && <Clock className="w-4 h-4" />}
        <span className="font-mono text-sm">
          {timeLeft.days > 0 && `${timeLeft.days}d `}
          {formatNumber(timeLeft.hours)}:{formatNumber(timeLeft.minutes)}:{formatNumber(timeLeft.seconds)}
        </span>
      </div>
    );
  }

  if (variant === 'neon') {
    return (
      <div className={cn(
        "relative p-6 rounded-lg",
        // Light mode: darker gradient with better contrast
        "bg-gradient-to-br from-slate-100 to-slate-200 dark:from-purple-900/50 dark:to-pink-900/50",
        "border border-slate-300 dark:border-purple-500/50",
        // Light mode: subtle shadow, dark mode: neon glow
        "shadow-lg dark:shadow-[0_0_30px_rgba(168,85,247,0.4)]",
        className
      )} data-testid="countdown-timer">
        {showIcon && (
          <div className="flex justify-center mb-4">
            <Clock className="w-8 h-8 text-slate-700 dark:text-purple-400" />
          </div>
        )}
        
        <div className="grid grid-cols-4 gap-4 text-center">
          {[
            { value: timeLeft.days, label: 'Days' },
            { value: timeLeft.hours, label: 'Hours' },
            { value: timeLeft.minutes, label: 'Minutes' },
            { value: timeLeft.seconds, label: 'Seconds' }
          ].map((unit, index) => (
            <div key={unit.label} className="space-y-2">
              <div className={cn(
                "text-3xl font-mono font-bold",
                "text-transparent bg-clip-text",
                // Light mode: dark blue to purple gradient, Dark mode: light purple to pink
                "bg-gradient-to-b from-blue-600 to-purple-600 dark:from-purple-400 dark:to-pink-400",
                // Light mode: no glow, Dark mode: neon glow
                "dark:drop-shadow-[0_0_10px_rgba(168,85,247,0.8)]"
              )}>
                {formatNumber(unit.value)}
              </div>
              {showLabels && (
                <div className="text-xs text-slate-600 dark:text-purple-300 uppercase tracking-wide">
                  {unit.label}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Default variant
  return (
    <div className={cn(
      "p-4 rounded-lg border",
      "bg-white dark:bg-gray-800",
      "border-gray-200 dark:border-gray-700",
      className
    )} data-testid="countdown-timer">
      {showIcon && (
        <div className="flex items-center justify-center mb-4">
          <Clock className={cn("w-6 h-6 mr-2", getUrgencyClass())} />
          <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
            Time until watch party
          </span>
        </div>
      )}
      
      <div className="grid grid-cols-4 gap-4 text-center">
        {[
          { value: timeLeft.days, label: 'Days' },
          { value: timeLeft.hours, label: 'Hours' },
          { value: timeLeft.minutes, label: 'Minutes' },
          { value: timeLeft.seconds, label: 'Seconds' }
        ].map((unit, index) => (
          <div key={unit.label} className="space-y-1">
            <div className={cn(
              "text-2xl font-mono font-bold",
              getUrgencyClass()
            )}>
              {formatNumber(unit.value)}
            </div>
            {showLabels && (
              <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                {unit.label}
              </div>
            )}
          </div>
        ))}
      </div>
      
      {/* Progress indicator for the last hour */}
      {timeLeft.total < 3600000 && timeLeft.total > 0 && (
        <div className="mt-4">
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              className={cn(
                "h-2 rounded-full transition-all duration-1000",
                timeLeft.total < 300000 ? "bg-red-500" : "bg-orange-500"
              )}
              style={{ 
                width: `${((3600000 - timeLeft.total) / 3600000) * 100}%` 
              }}
            />
          </div>
          <p className="text-xs text-center mt-2 text-gray-500 dark:text-gray-400">
            Final hour countdown
          </p>
        </div>
      )}
    </div>
  );
}