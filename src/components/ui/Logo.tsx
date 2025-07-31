import React from 'react';
import { cn } from '../../utils/cn';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showText?: boolean;
}

const Logo: React.FC<LogoProps> = ({
  size = 'md',
  className,
  showText = true
}) => {
  const sizes = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12',
  };

  const textSizes = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-xl',
  };

  return (
    <div className={cn('flex items-center space-x-3', className)}>
      {/* Brain Icon */}
      <div className={cn(
        'relative flex items-center justify-center rounded-lg bg-gradient-to-br from-brand-primary to-brand-secondary',
        sizes[size]
      )}>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="w-3/4 h-3/4 text-white"
        >
          <path
            d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
            fill="currentColor"
          />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col">
          <span className={cn('font-bold text-gray-900 dark:text-white', textSizes[size])}>
            GEMS INNOVATIONS
          </span>
          <span className={cn('text-gray-600 dark:text-gray-400 text-xs', textSizes[size] === 'text-sm' ? 'text-xs' : 'text-sm')}>
            Technology
          </span>
        </div>
      )}
    </div>
  );
};

export default Logo; 