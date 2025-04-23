'use client';

import React, { useEffect, useRef } from 'react';
import { twMerge } from 'tailwind-merge';

export interface ModalProps {
  /**
   * Whether the modal is open
   */
  isOpen: boolean;
  /**
   * Callback when the modal is closed
   */
  onClose: () => void;
  /**
   * Modal title
   */
  title?: string;
  /**
   * Modal content
   */
  children: React.ReactNode;
  /**
   * Modal footer
   */
  footer?: React.ReactNode;
  /**
   * Size of the modal
   */
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  /**
   * CSS class name for the modal
   */
  className?: string;
  /**
   * Whether to allow closing by clicking outside the modal
   */
  closeOnClickOutside?: boolean;
  /**
   * Whether to allow closing with the escape key
   */
  closeOnEsc?: boolean;
}

/**
 * Modal component for displaying content in a dialog box
 */
const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'md',
  className,
  closeOnClickOutside = true,
  closeOnEsc = true,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  
  // Handle keyboard events
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && closeOnEsc) {
        onClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = ''; // Restore scrolling
    };
  }, [isOpen, onClose, closeOnEsc]);
  
  // Handle click outside
  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (
      closeOnClickOutside &&
      modalRef.current &&
      !modalRef.current.contains(event.target as Node)
    ) {
      onClose();
    }
  };
  
  // Size class mapping
  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    full: 'max-w-full mx-4',
  };
  
  // If the modal is not open, don't render anything
  if (!isOpen) return null;
  
  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto"
      aria-modal="true"
      role="dialog"
      aria-labelledby="modal-title"
    >
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={handleBackdropClick}
      ></div>
      
      <div className="flex min-h-screen items-center justify-center p-4 text-center sm:p-0">
        <div
          ref={modalRef}
          className={twMerge(
            'relative transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 text-left shadow-xl transition-all w-full',
            sizeClasses[size],
            className
          )}
        >
          {/* Modal header */}
          {title && (
            <div className="border-b border-gray-200 dark:border-gray-700 px-4 py-3 sm:px-6">
              <h3
                id="modal-title"
                className="text-lg font-medium text-gray-900 dark:text-white"
              >
                {title}
              </h3>
              <button
                type="button"
                className="absolute top-3 right-3 text-gray-400 hover:text-gray-500"
                onClick={onClose}
                aria-label="Close"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          )}
          
          {/* Modal body */}
          <div className="px-4 py-4 sm:px-6">{children}</div>
          
          {/* Modal footer */}
          {footer && (
            <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-3 sm:px-6 flex justify-end space-x-2">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;