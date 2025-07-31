import React from 'react';
import { Bot, User } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import type { Mensaje } from '../../../types';
import { cn } from '../../../utils/cn';

interface MessageBubbleProps {
  message: Mensaje;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const getMessageIcon = (tipoRemitente: string) => {
    switch (tipoRemitente) {
      case 'bot':
        return <Bot className="h-5 w-5 text-brand-primary" />;
      case 'agente_humano':
        return <User className="h-5 w-5 text-brand-accent" />;
      case 'cliente_final':
        return <User className="h-5 w-5 text-gray-500 dark:text-gray-400" />;
      default:
        return <User className="h-5 w-5 text-gray-400 dark:text-gray-500" />;
    }
  };

  const getMessageAlignment = (tipoRemitente: string) => {
    return tipoRemitente === 'cliente_final' ? 'justify-start' : 'justify-end';
  };

  const getMessageBubbleStyle = (tipoRemitente: string) => {
    switch (tipoRemitente) {
      case 'bot':
        return 'bg-brand-primary/10 dark:bg-brand-primary/20 text-brand-primary dark:text-brand-secondary';
      case 'agente_humano':
        return 'bg-brand-accent/10 dark:bg-brand-accent/20 text-brand-accent dark:text-pink-400';
      case 'cliente_final':
        return 'bg-gray-100 dark:bg-dark-700 text-gray-900 dark:text-gray-100';
      default:
        return 'bg-gray-100 dark:bg-dark-700 text-gray-900 dark:text-gray-100';
    }
  };

  return (
    <div className={`flex ${getMessageAlignment(message.tipo_remitente)}`}>
      <div className={`flex items-start space-x-2 max-w-xs lg:max-w-md ${message.tipo_remitente === 'cliente_final' ? 'flex-row' : 'flex-row-reverse space-x-reverse'
        }`}>
        <div className="flex-shrink-0">
          {getMessageIcon(message.tipo_remitente)}
        </div>
        <div className={`px-3 py-2 rounded-lg ${getMessageBubbleStyle(message.tipo_remitente)}`}>
          <p className="text-sm">{message.contenido}</p>
          <p className="text-xs opacity-70 mt-1">
            {format(new Date(message.timestamp), 'HH:mm', { locale: es })}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble; 