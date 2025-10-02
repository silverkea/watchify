/**
 * DateTimePicker Molecule Component
 * Provides date and time selection for watch party scheduling
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, Clock, AlertCircle } from 'lucide-react';
import { Input } from '@/components/atoms/Input';
import { Button } from '@/components/atoms/Button';
import { cn } from '@/lib/utils';
import { format, addDays, isAfter, isBefore, parse, isValid } from 'date-fns';

export interface DateTimePickerProps {
  value?: Date | string;
  onChange: (date: Date) => void;
  onError?: (error: string | null) => void;
  minDate?: Date;
  maxDate?: Date;
  className?: string;
  disabled?: boolean;
  label?: string;
  placeholder?: string;
  required?: boolean;
}

export function DateTimePicker({
  value,
  onChange,
  onError,
  minDate = new Date(),
  maxDate = addDays(new Date(), 365),
  className,
  disabled = false,
  label = "Schedule Date & Time",
  placeholder = "Select date and time",
  required = false
}: DateTimePickerProps) {
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('20:00');
  const [error, setError] = useState<string | null>(null);

  // Initialize from value prop
  useEffect(() => {
    if (value) {
      const date = new Date(value);
      if (isValid(date)) {
        setSelectedDate(format(date, 'yyyy-MM-dd'));
        setSelectedTime(format(date, 'HH:mm'));
      }
    } else {
      // Set default to tomorrow at 8 PM
      const tomorrow = addDays(new Date(), 1);
      setSelectedDate(format(tomorrow, 'yyyy-MM-dd'));
      setSelectedTime('20:00');
    }
  }, [value]);

  const validateAndUpdate = (dateStr: string, timeStr: string) => {
    try {
      if (!dateStr || !timeStr) {
        setError(required ? 'Date and time are required' : null);
        if (onError) onError(required ? 'Date and time are required' : null);
        return;
      }

      // Parse the date and time
      const dateTime = parse(`${dateStr} ${timeStr}`, 'yyyy-MM-dd HH:mm', new Date());
      
      if (!isValid(dateTime)) {
        setError('Invalid date or time format');
        if (onError) onError('Invalid date or time format');
        return;
      }

      // Check if date is in the past
      if (isBefore(dateTime, new Date())) {
        setError('Cannot schedule for past dates');
        if (onError) onError('Cannot schedule for past dates');
        return;
      }

      // Check min/max date constraints
      if (minDate && isBefore(dateTime, minDate)) {
        setError(`Date must be after ${format(minDate, 'MMM d, yyyy')}`);
        if (onError) onError(`Date must be after ${format(minDate, 'MMM d, yyyy')}`);
        return;
      }

      if (maxDate && isAfter(dateTime, maxDate)) {
        setError(`Date must be before ${format(maxDate, 'MMM d, yyyy')}`);
        if (onError) onError(`Date must be before ${format(maxDate, 'MMM d, yyyy')}`);
        return;
      }

      // Validation passed
      setError(null);
      if (onError) onError(null);
      onChange(dateTime);
    } catch (err) {
      setError('Invalid date or time');
      if (onError) onError('Invalid date or time');
    }
  };

  // Validate and update parent when initial values are set
  useEffect(() => {
    if (selectedDate && selectedTime) {
      validateAndUpdate(selectedDate, selectedTime);
    }
  }, [selectedDate, selectedTime]);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value;
    setSelectedDate(newDate);
    validateAndUpdate(newDate, selectedTime);
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = e.target.value;
    setSelectedTime(newTime);
    validateAndUpdate(selectedDate, newTime);
  };

  // Quick time presets
  const timePresets = [
    { label: '7:00 PM', value: '19:00' },
    { label: '7:30 PM', value: '19:30' },
    { label: '8:00 PM', value: '20:00' },
    { label: '8:30 PM', value: '20:30' },
    { label: '9:00 PM', value: '21:00' },
    { label: '9:30 PM', value: '21:30' },
    { label: '10:00 PM', value: '22:00' }
  ];

  const handlePresetTime = (time: string) => {
    setSelectedTime(time);
    validateAndUpdate(selectedDate, time);
  };

  const getCurrentDateTime = () => {
    if (selectedDate && selectedTime) {
      const dateTime = parse(`${selectedDate} ${selectedTime}`, 'yyyy-MM-dd HH:mm', new Date());
      if (isValid(dateTime)) {
        return dateTime;
      }
    }
    return null;
  };

  const currentDateTime = getCurrentDateTime();

  return (
    <div className={cn("space-y-4", className)}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Date Input */}
        <div className="space-y-2">
          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400">
            <Calendar className="w-4 h-4 inline mr-1" />
            Date
          </label>
          <Input
            type="date"
            value={selectedDate}
            onChange={handleDateChange}
            min={format(minDate, 'yyyy-MM-dd')}
            max={format(maxDate, 'yyyy-MM-dd')}
            disabled={disabled}
            className={cn(
              error && "border-red-500 focus:border-red-500 focus:ring-red-500"
            )}
            required={required}
          />
        </div>

        {/* Time Input */}
        <div className="space-y-2">
          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400">
            <Clock className="w-4 h-4 inline mr-1" />
            Time
          </label>
          <Input
            type="time"
            value={selectedTime}
            onChange={handleTimeChange}
            disabled={disabled}
            className={cn(
              error && "border-red-500 focus:border-red-500 focus:ring-red-500"
            )}
            required={required}
          />
        </div>
      </div>

      {/* Quick Time Presets */}
      <div className="space-y-2">
        <label className="block text-xs font-medium text-gray-600 dark:text-gray-400">
          Popular Times
        </label>
        <div className="flex flex-wrap gap-2">
          {timePresets.map((preset) => (
            <Button
              key={preset.value}
              type="button"
              variant={selectedTime === preset.value ? "primary" : "ghost"}
              size="sm"
              onClick={() => handlePresetTime(preset.value)}
              disabled={disabled}
              className="text-xs"
            >
              {preset.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Preview */}
      {currentDateTime && !error && (
        <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
          <div className="flex items-start space-x-2">
            <Clock className="w-4 h-4 text-green-600 dark:text-green-400 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-green-800 dark:text-green-200">
                Scheduled for: {format(currentDateTime, 'EEEE, MMMM d, yyyy')}
              </p>
              <p className="text-sm text-green-600 dark:text-green-300">
                at {format(currentDateTime, 'h:mm a')}
              </p>
              <p className="text-xs text-green-500 dark:text-green-400 mt-1">
                {format(currentDateTime, 'EEEE')} night watch party
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
          <div className="flex items-start space-x-2">
            <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 mt-0.5" />
            <p className="text-sm text-red-800 dark:text-red-200">
              {error}
            </p>
          </div>
        </div>
      )}

      {/* Helper Text */}
      <p className="text-xs text-gray-500 dark:text-gray-400">
        Select a date and time for your watch party. Times are in your local timezone.
      </p>
    </div>
  );
}