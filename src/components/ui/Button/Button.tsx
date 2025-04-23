import React, { ButtonHTMLAttributes, ElementType, forwardRef } from 'react';
import { twMerge } from 'tailwind-merge';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Button variant
   */
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'success';
  /**
   * Button size
   */
  size?: 'sm' | 'md' | 'lg';
  /**
   * Show loading spinner
   */
  isLoading?: boolean;
  /**
   * Full width button
   */
  fullWidth?: boolean;
  /**
   * CSS class name
   */
  className?: string;
  /**
   * Render as different element
   */
  as?: ElementType;
  /**
   * Props to pass to the rendered element
   */
  asProps?: Record<string, unknown>;
}

/**
 * Button component for user interactions
 */
const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      fullWidth = false,
      className = '',
      disabled,
      as,
      asProps,
      ...props
    },
    ref
  ) => {
    // Base classes
    const baseClasses = 'btn inline-flex items-center justify-center font-medium focus:outline-none transition duration-200 ease-in-out';
    
    // Size classes
    const sizeClasses = {
      sm: 'py-1 px-3 text-sm',
      md: 'py-2 px-4 text-base',
      lg: 'py-3 px-6 text-lg',
    };
    
    // Variant classes
    const variantClasses = {
      primary: 'btn-primary',
      secondary: 'btn-secondary',
      outline: 'btn-outline',
      danger: 'btn-danger',
      success: 'btn-success',
    };
    
    // Width classes
    const widthClasses = fullWidth ? 'w-full' : '';
    
    // Disabled and loading classes
    const stateClasses = (disabled || isLoading) ? 'opacity-70 cursor-not-allowed' : '';
    
    // Combine all classes
    const classes = twMerge(
      baseClasses,
      sizeClasses[size],
      variantClasses[variant],
      widthClasses,
      stateClasses,
      className
    );
    
    // Content to render inside the button
    const content = isLoading ? (
      <>
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        Cargando...
      </>
    ) : (
      children
    );
    
    // If as prop is provided, render as that element type
    if (as) {
      const Component = as;
      return (
        <Component 
          className={classes} 
          disabled={disabled || isLoading} 
          {...asProps} 
          {...props}
        >
          {content}
        </Component>
      );
    }
    
    // Otherwise render as a button
    return (
      <button
        ref={ref}
        className={classes}
        disabled={disabled || isLoading}
        {...props}
      >
        {content}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;