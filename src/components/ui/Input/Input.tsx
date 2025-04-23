import React, { InputHTMLAttributes, forwardRef } from 'react';
import { twMerge } from 'tailwind-merge';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  /**
   * Input label
   */
  label?: string;
  /**
   * Error message
   */
  error?: string;
  /**
   * Helper text
   */
  helperText?: string;
  /**
   * CSS class name for the wrapper element
   */
  wrapperClassName?: string;
  /**
   * CSS class name for the input element
   */
  inputClassName?: string;
  /**
   * CSS class name for the label element
   */
  labelClassName?: string;
}

/**
 * Input component for text entry
 */
const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      className,
      wrapperClassName,
      inputClassName,
      labelClassName,
      disabled,
      id,
      type = 'text',
      ...props
    },
    ref
  ) => {
    // Generate a unique ID if none is provided
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
    
    // Base classes
    const wrapperClasses = twMerge('mb-4', wrapperClassName);
    const labelClasses = twMerge(
      'block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1',
      disabled && 'opacity-70',
      labelClassName
    );
    const inputClasses = twMerge(
      'input w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none sm:text-sm',
      disabled && 'opacity-70 cursor-not-allowed bg-gray-100 dark:bg-gray-800',
      error
        ? 'border-red-300 text-red-600 focus:border-red-500 focus:ring-red-500'
        : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500',
      inputClassName
    );
    const helperTextClasses = twMerge(
      'mt-1 text-xs',
      error ? 'text-red-600' : 'text-gray-500'
    );
    
    return (
      <div className={wrapperClasses}>
        {label && (
          <label htmlFor={inputId} className={labelClasses}>
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={inputClasses}
          disabled={disabled}
          type={type}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : undefined}
          {...props}
        />
        {(error || helperText) && (
          <p
            id={`${inputId}-${error ? 'error' : 'helper'}`}
            className={helperTextClasses}
          >
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;