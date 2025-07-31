import React, { useRef, useEffect } from 'react';
import { FileText, MessageSquare } from 'lucide-react';
import type { Conversacion } from '../../../types';
import { useMessages } from '../../../hooks/useMessages';
import { useConversations } from '../../../hooks/useConversations';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';
import ChatHeader from './ChatHeader';
import MessageBubble from './MessageBubble';
import MessageInput from './MessageInput';

interface ChatProps {
  conversation: Conversacion | null;
}

const Chat: React.FC<ChatProps> = ({ conversation }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { messages, loading, sendMessage } = useMessages(conversation?.id || null);
  const { toggleIA } = useConversations();

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (content: string) => {
    if (!conversation) return;

    try {
      await sendMessage(content);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleToggleIA = async () => {
    if (!conversation) return;

    try {
      await toggleIA(conversation.id, !conversation.ia_activa);
    } catch (error) {
      console.error('Error toggling IA:', error);
    }
  };

  if (!conversation) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-50 dark:bg-dark-900">
        <div className="text-center">
          <FileText className="mx-auto h-12 w-12 text-gray-300 dark:text-gray-600 mb-4" />
          <p className="text-gray-500 dark:text-gray-400">Selecciona una conversación para comenzar</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white dark:bg-dark-800 rounded-lg shadow-sm border border-gray-200 dark:border-dark-700">
      <ChatHeader
        conversation={conversation}
        onToggleIA={handleToggleIA}
      />

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {loading ? (
          <LoadingSpinner size="lg" className="h-32" />
        ) : messages.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400 py-8">
            <MessageSquare className="mx-auto h-12 w-12 text-gray-300 dark:text-gray-600 mb-4" />
            <p>No hay mensajes en esta conversación</p>
          </div>
        ) : (
          messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <MessageInput
        onSendMessage={handleSendMessage}
        disabled={conversation.ia_activa}
        placeholder={conversation.ia_activa ? "El bot está respondiendo automáticamente..." : "Escribe un mensaje..."}
      />
    </div>
  );
};

export default Chat; 