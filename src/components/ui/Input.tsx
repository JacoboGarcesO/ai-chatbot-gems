import React from 'react';
import { cn } from '../../utils/cn';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  variant?: 'default' | 'search';
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  icon,
  variant = 'default',
  className,
  ...props
}) => {
  const baseClasses = 'w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-colors dark:bg-dark-700 dark:text-gray-100';

  const variants = {
    default: 'border-gray-300 dark:border-dark-600 bg-white dark:bg-dark-700',
    search: 'border-gray-300 dark:border-dark-600 bg-white dark:bg-dark-700 pl-10',
  };

  const inputClasses = cn(
    baseClasses,
    variants[variant],
    error && 'border-red-300 dark:border-red-500 focus:ring-red-500',
    className
  );

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && variant === 'search' && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500">
            {icon}
          </div>
        )}
        <input className={inputClasses} {...props} />
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
};

export default Input; 