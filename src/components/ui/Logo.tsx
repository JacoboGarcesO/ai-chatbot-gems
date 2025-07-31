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
    sm: 'h-10 w-10',
    md: 'h-12 w-12',
    lg: 'h-14 w-14',
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
        'p-1 relative flex items-center justify-center rounded-lg bg-gradient-to-br from-brand-primary to-brand-secondary',
        sizes[size]
      )}>
        <img src="/logo1.png" alt="Logo" className="w-full h-full object-contain" />
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