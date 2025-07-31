import React from 'react';
import { cn } from '../../utils/cn';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'accent';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
  children?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  children,
  className,
  disabled,
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary: 'bg-brand-primary hover:bg-brand-secondary text-white focus:ring-brand-primary dark:focus:ring-offset-dark-900',
    secondary: 'bg-gray-200 hover:bg-gray-300 dark:bg-dark-700 dark:hover:bg-dark-600 text-gray-800 dark:text-gray-200 focus:ring-gray-500 dark:focus:ring-offset-dark-900',
    outline: 'border border-gray-300 dark:border-dark-600 bg-white dark:bg-dark-800 hover:bg-gray-50 dark:hover:bg-dark-700 text-gray-700 dark:text-gray-300 focus:ring-brand-primary dark:focus:ring-offset-dark-900',
    ghost: 'hover:bg-gray-100 dark:hover:bg-dark-700 text-gray-700 dark:text-gray-300 focus:ring-gray-500 dark:focus:ring-offset-dark-900',
    danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500 dark:focus:ring-offset-dark-900',
    accent: 'bg-brand-accent hover:bg-pink-600 text-white focus:ring-brand-accent dark:focus:ring-offset-dark-900',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  return (
    <button
      className={cn(
        baseClasses,
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
      )}
      {icon && !loading && <span className="mr-2">{icon}</span>}
      {children && children}
    </button>
  );
};

export default Button; 