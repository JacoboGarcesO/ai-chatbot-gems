import React from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import type { Conversation } from '../../../types';
import Badge from '../../../components/ui/Badge';
import { cn } from '../../../utils/cn';

interface ConversationItemProps {
  conversation: Conversation;
  isSelected: boolean;
  onClick: (conversation: Conversation) => void;
}

const ConversationItem: React.FC<ConversationItemProps> = ({
  conversation,
  isSelected,
  onClick,
}) => {
  const getStatusVariant = (estado: string) => {
    switch (estado) {
      case 'abierta':
        return 'success';
      case 'cerrada':
        return 'default';
      case 'pendiente':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getStatusText = (estado: string) => {
    switch (estado) {
      case 'abierta':
        return 'Abierta';
      case 'cerrada':
        return 'Cerrada';
      case 'pendiente':
        return 'Pendiente';
      default:
        return 'Desconocido';
    }
  };

  return (
    <div
      onClick={() => onClick(conversation)}
      className={cn(
        'p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors',
        isSelected && 'bg-brand-primary/10 dark:bg-brand-primary/20 border-r-2 border-brand-primary'
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-1">
            <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
              {conversation.customer?.name}
            </h3>
            <Badge variant={getStatusVariant(conversation.status)}>
              {getStatusText(conversation.status)}
            </Badge>
            {conversation.ai_active && (
              <Badge variant="brand">IA ON</Badge>
            )}
          </div>

          <p className="text-sm text-gray-600 dark:text-gray-400 truncate mb-2">
            {conversation.last_message}
          </p>

          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-500">
            <span>
              {conversation.last_message
                ? format(new Date(conversation.last_message), 'dd/MM/yyyy HH:mm', { locale: es })
                : format(new Date(conversation.start_timestamp), 'dd/MM/yyyy HH:mm', { locale: es })}
            </span>

            {conversation.ai_classification && (
              <span className="text-xs text-gray-500 dark:text-gray-500">
                {conversation.ai_classification}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConversationItem; 