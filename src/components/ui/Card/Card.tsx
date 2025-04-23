import React, { HTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Card title
   */
  title?: string;
  /**
   * Card subtitle
   */
  subtitle?: string;
  /**
   * Card footer content
   */
  footer?: React.ReactNode;
  /**
   * CSS class name for the card title
   */
  titleClassName?: string;
  /**
   * CSS class name for the card subtitle
   */
  subtitleClassName?: string;
  /**
   * CSS class name for the card body
   */
  bodyClassName?: string;
  /**
   * CSS class name for the card footer
   */
  footerClassName?: string;
  /**
   * Whether the card has padding
   */
  noPadding?: boolean;
  /**
   * Whether the card has a hover effect
   */
  hover?: boolean;
}

/**
 * Card component for displaying content in a contained box
 */
const Card: React.FC<CardProps> = ({
  children,
  className,
  title,
  subtitle,
  footer,
  titleClassName,
  subtitleClassName,
  bodyClassName,
  footerClassName,
  noPadding = false,
  hover = false,
  ...props
}) => {
  // Base classes
  const cardClasses = twMerge(
    'card bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden',
    hover && 'transition duration-300 hover:shadow-lg',
    className
  );
  
  const headerPadding = !noPadding ? 'p-4 sm:p-5' : 'p-0';
  const bodyPadding = !noPadding ? 'px-4 sm:px-5 pb-4 sm:pb-5' : 'p-0';
  const footerPadding = !noPadding ? 'p-4 sm:p-5' : 'p-0';
  
  const titleClasses = twMerge(
    'text-lg font-semibold text-gray-900 dark:text-white',
    titleClassName
  );
  
  const subtitleClasses = twMerge(
    'text-sm text-gray-500 dark:text-gray-400 mt-1',
    subtitleClassName
  );
  
  const bodyClasses = twMerge(bodyPadding, bodyClassName);
  
  const footerClasses = twMerge(
    'border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900',
    footerPadding,
    footerClassName
  );
  
  const hasHeader = title || subtitle;
  
  return (
    <div className={cardClasses} {...props}>
      {hasHeader && (
        <div className={headerPadding}>
          {title && <h3 className={titleClasses}>{title}</h3>}
          {subtitle && <p className={subtitleClasses}>{subtitle}</p>}
        </div>
      )}
      <div className={bodyClasses}>{children}</div>
      {footer && <div className={footerClasses}>{footer}</div>}
    </div>
  );
};

export default Card;