import React from 'react';
import { User, Brain } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import type { Message } from '../../../types';

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const getMessageIcon = (senderType: string) => {
    switch (senderType) {
      case 'bot':
        return <Brain className="h-5 w-5 text-blue-400" />; // IA automática - icono más serio
      case 'human_agent':
        return <User className="h-5 w-5 text-brand-accent" />;
      case 'customer':
        return <User className="h-5 w-5 text-gray-500 dark:text-gray-400" />;
      default:
        return <User className="h-5 w-5 text-gray-400 dark:text-gray-500" />;
    }
  };

  const getMessageAlignment = (senderType: string) => {
    return senderType === 'customer' ? 'justify-start' : 'justify-end';
  };

  const getMessageBubbleStyle = (senderType: string) => {
    switch (senderType) {
      case 'bot':
        return 'bg-brand-primary text-white'; // IA automática - azul del sidebar (elegante)
      case 'human_agent':
        return 'bg-purple-500 text-white'; // Agente manual - color original
      case 'customer':
        return 'bg-gray-100 dark:bg-dark-700 text-gray-900 dark:text-gray-100';
      default:
        return 'bg-gray-100 dark:bg-dark-700 text-gray-900 dark:text-gray-100';
    }
  };

  return (
    <div className={`flex ${getMessageAlignment(message.sender_type)}`}>
      <div className={`flex items-start space-x-2 max-w-xs lg:max-w-md ${message.sender_type === 'customer' ? 'flex-row' : 'flex-row-reverse space-x-reverse'
        }`}>
        <div className="flex-shrink-0">
          {getMessageIcon(message.sender_type)}
        </div>
        <div className={`px-3 py-2 rounded-lg ${getMessageBubbleStyle(message.sender_type)}`}>
          <p className="text-sm message-content">{message.content}</p>
          <p className="text-xs opacity-70 mt-2 message-time">
            {format(new Date(message.timestamp), 'HH:mm', { locale: es })}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble; 