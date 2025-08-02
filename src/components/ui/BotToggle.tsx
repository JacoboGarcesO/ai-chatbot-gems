import React from 'react';
import { Bot, ToggleLeft, ToggleRight } from 'lucide-react';
import { useBotStatus } from '../../hooks/useBotStatus';

interface BotToggleProps {
  variant?: 'bar' | 'chat';
  showIcon?: boolean;
  showLabel?: boolean;
  className?: string;
}

const BotToggle: React.FC<BotToggleProps> = ({ 
  variant = 'bar', 
  showIcon = true,
  showLabel = true,
  className = ''
}) => {
  const { botEnabled, loading, toggleBot } = useBotStatus();

  const handleToggle = async () => {
    await toggleBot(!botEnabled);
  };

  if (variant === 'bar') {
    // Versión para la barra de estado
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        {showIcon && (
          <Bot className={`h-5 w-5 ${botEnabled ? 'text-green-500' : 'text-gray-400'}`} />
        )}
        {showLabel && (
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Bot: {botEnabled ? 'Active' : 'Inactive'}
          </span>
        )}
        <button
          onClick={handleToggle}
          disabled={loading}
          className={`px-3 py-1 text-xs rounded-md transition-colors ${botEnabled
            ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 hover:bg-green-200 dark:hover:bg-green-800'
            : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
        >
          {botEnabled ? 'Disable' : 'Enable'}
        </button>
      </div>
    );
  }

  // Versión para el chat (toggle switch)
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {showLabel && (
        <span className="text-sm text-gray-600 dark:text-gray-400">IA Auto</span>
      )}
      <button 
        onClick={handleToggle}
        disabled={loading}
        className="transition-all duration-200 hover:scale-110 cursor-pointer"
        title={`${botEnabled ? 'Desactivar' : 'Activar'} IA automática`}
      >
        {botEnabled ? (
          <ToggleRight className="h-6 w-6 text-green-500" />
        ) : (
          <ToggleLeft className="h-6 w-6 text-gray-400 hover:text-gray-600" />
        )}
      </button>
    </div>
  );
};

export default BotToggle;
