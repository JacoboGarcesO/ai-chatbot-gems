import React from 'react';
import { FileText, Tag } from 'lucide-react';
import type { Conversation } from '../../../types';
import Badge from '../../../components/ui/Badge';

interface ChatHeaderProps {
  conversation: Conversation;
  onToggleIA: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ conversation, onToggleIA }) => {
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
    <div className="p-4 border-b border-gray-200 dark:border-dark-700 bg-gray-50 dark:bg-dark-800">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-brand-primary rounded-full flex items-center justify-center">
            <span className="text-white font-medium">
              {conversation.customer?.name.charAt(0)}
            </span>
          </div>
          <div>
            <h3 className="font-medium text-gray-900 dark:text-gray-100">{conversation.customer?.name}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{conversation.customer?.phone}</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {/* IA Toggle */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">IA</span>
            <button
              onClick={onToggleIA}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${conversation.ai_active ? 'bg-brand-primary' : 'bg-gray-200 dark:bg-dark-600'
                }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${conversation.ai_active ? 'translate-x-6' : 'translate-x-1'
                  }`}
              />
            </button>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {conversation.ai_active ? 'ON' : 'OFF'}
            </span>
          </div>

          {/* Status Badge */}
          <Badge variant={getStatusVariant(conversation.status)}>
            {getStatusText(conversation.status)}
          </Badge>
        </div>
      </div>

      {/* AI Classification and Summary */}
      {(conversation.ai_classification || conversation.ai_summary) && (
        <div className="mt-3 p-3 bg-brand-primary/5 dark:bg-brand-primary/10 rounded-lg border border-brand-primary/20">
          {conversation.ai_classification && (
            <div className="flex items-center space-x-2 mb-2">
              <Tag className="h-4 w-4 text-brand-primary" />
              <span className="text-sm font-medium text-brand-primary dark:text-brand-secondary">
                Clasificación: {conversation.ai_classification}
              </span>
            </div>
          )}
          {conversation.ai_summary && (
            <div className="flex items-start space-x-2">
              <FileText className="h-4 w-4 text-brand-primary mt-0.5" />
              <p className="text-sm text-brand-primary dark:text-brand-secondary">{conversation.ai_summary}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ChatHeader; 