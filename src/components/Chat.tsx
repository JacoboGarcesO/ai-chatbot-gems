import React, { useState, useEffect, useRef } from 'react';
import { Send, User, MessageSquare, Sparkles, ChevronDown, Check, CheckCheck, Brain } from 'lucide-react';
import { format } from 'date-fns';
import { enUS } from 'date-fns/locale';
import type { Conversation } from '../types';
import { useMessages } from '../hooks/useMessages';
import { conversationsAPI } from '../services/api';
import { BotToggle } from './ui';

interface ChatProps {
  conversation: Conversation | null;
}

const Chat: React.FC<ChatProps> = ({ conversation }) => {
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [showAiInput, setShowAiInput] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [previousMessagesCount, setPreviousMessagesCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Usar el hook personalizado para mensajes
  const { 
    messages, 
    loading, 
    error, 
    sendMessage, 
    sendAIMessage 
  } = useMessages(conversation?.customer_id);

  useEffect(() => {
    // Solo detectar mensajes nuevos para notificaciones - SIN scroll automático
    if (messages.length > previousMessagesCount && previousMessagesCount > 0) {
      // Mostrar notificación del navegador
      if (Notification.permission === 'granted') {
        const lastMessage = messages[messages.length - 1];
        if (lastMessage && lastMessage.sender_type === 'customer') {
          new Notification('Nuevo mensaje', {
            body: `${conversation?.customer?.name || 'Cliente'}: ${lastMessage.content}`,
            icon: '/logo1.png',
            tag: 'new-message'
          });
        }
      }
      
      // Sonido de notificación (opcional)
      try {
        const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+LyvmMcAzuN1fLNeSsFJH');
        audio.play().catch(() => {}); // Ignorar errores de audio
      } catch (e) {}
    }
    
    setPreviousMessagesCount(messages.length);
  }, [messages, previousMessagesCount, conversation]);

  useEffect(() => {
    if (conversation) {
      markAsRead();
      // La sincronización del AI active ahora se maneja en el componente BotToggle
    }
  }, [conversation?.id, conversation?.ai_active]); // Dependencias específicas

  // Pedir permisos de notificación
  useEffect(() => {
    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  // Scroll suave hasta el fondo
  const scrollToBottomInstantly = () => {
    if (messagesContainerRef.current) {
      // Scroll suave hasta el final
      messagesContainerRef.current.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  };

  // Detectar si el usuario está al final del scroll y calcular progreso
  const handleScroll = () => {
    if (messagesContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
      const isAtBottom = scrollTop + clientHeight >= scrollHeight - 20;
      setShowScrollButton(!isAtBottom && messages.length > 3);
      
      // Calcular progreso del scroll (0 = arriba, 1 = abajo)
      const progress = scrollHeight > clientHeight ? scrollTop / (scrollHeight - clientHeight) : 0;
      setScrollProgress(Math.max(0, Math.min(1, progress)));
    }
  };

  const markAsRead = async () => {
    if (!conversation) return;
    try {
      await conversationsAPI.markAsRead(conversation.customer_id);
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!conversation || !newMessage.trim() || sending) return;

    try {
      setSending(true);
      await sendMessage(newMessage.trim());
      setNewMessage('');
      // SIN scroll automático - el usuario decide dónde quiere estar
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSending(false);
    }
  };

  const handleSendAIMessage = async () => {
    if (!conversation || !aiPrompt.trim() || sending) return;

    try {
      setSending(true);
      await sendAIMessage(aiPrompt.trim(), 'Asistente de atención al cliente');
      setAiPrompt('');
      setShowAiInput(false);
      // SIN scroll automático - el usuario decide dónde quiere estar
    } catch (error) {
      console.error('Error sending AI message:', error);
    } finally {
      setSending(false);
    }
  };

  const getMessageIcon = (senderType: string, isAiGenerated?: boolean) => {
    if (senderType === 'customer') {
      return <User className="h-5 w-5 text-green-500" />;
    } else if (senderType === 'bot' || isAiGenerated) {
      return <Brain className="h-5 w-5 text-blue-400" />; // IA automática - icono más serio
    } else {
      return <User className="h-5 w-5 text-purple-500" />; // Agente humano
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'sent':
        return <Check className="h-4 w-4 text-white/70 drop-shadow-sm" />;
      case 'delivered':
        return <CheckCheck className="h-4 w-4 text-white/70 drop-shadow-sm" />;
      case 'read':
        return <CheckCheck className="h-4 w-4 text-blue-200 drop-shadow-sm" />;
      default:
        return <Check className="h-4 w-4 text-white/70 drop-shadow-sm" />;
    }
  };

  const getSenderLabel = (senderType: string, isAiGenerated?: boolean) => {
    if (senderType === 'customer') {
      return 'Cliente';
    } else if (senderType === 'bot' || isAiGenerated) {
      return 'IA'; // Inteligencia Artificial automática
    } else {
      return 'Agente'; // Agente humano escribiendo manualmente
    }
  };

  if (!conversation) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <MessageSquare className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-500 dark:text-gray-400 mb-2">
            Selecciona una conversación
          </h3>
          <p className="text-gray-400 dark:text-gray-500">
            Elige una conversación de la lista para comenzar a chatear
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-white dark:bg-gray-800 relative h-[600px] w-full rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-3 h-16">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {conversation.customer?.name || conversation.customer_id}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {conversation.customer?.phone || conversation.customer_id}
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowAiInput(!showAiInput)}
              className="flex items-center space-x-2 px-3 py-2 text-sm bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors"
            >
              <Sparkles className="h-4 w-4" />
              <span>IA</span>
            </button>
            <BotToggle variant="chat" />
          </div>
        </div>
      </div>

      {/* Messages */}
      <div 
        ref={messagesContainerRef}
        className="flex-1 overflow-y-scroll p-4 space-y-3 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 max-h-[450px] gems-scrollbar" 
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: `rgb(${59 + (236 - 59) * scrollProgress}, ${130 + (72 - 130) * scrollProgress}, ${246 + (153 - 246) * scrollProgress}) transparent`
        }}
        onScroll={handleScroll}
      >
        {loading && messages.length === 0 && (
          <div className="text-center text-gray-500">
            Cargando mensajes...
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.sender_type === 'customer' ? 'justify-start' : 'justify-end'
            }`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                message.sender_type === 'customer'
                  ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                  : message.isAiGenerated || message.sender_type === 'bot'
                  ? 'bg-brand-primary text-white' // IA automática - azul del sidebar (más elegante)
                  : 'bg-purple-500 text-white' // Agente manual - color original
              }`}
            >
              <div className="flex items-center space-x-2 mb-1">
                {getMessageIcon(message.sender_type, message.isAiGenerated)}
                <span className="text-xs font-medium">
                  {getSenderLabel(message.sender_type, message.isAiGenerated)}
                </span>
              </div>
              <p className="text-sm message-content">{message.content}</p>
              <div className="flex items-center justify-between mt-2 gap-3">
                <p className="text-xs opacity-75 message-time">
                  {format(new Date(message.timestamp), 'HH:mm', { locale: enUS })}
                </p>
                {message.status && message.sender_type !== 'customer' && (
                  <div className="flex items-center flex-shrink-0">
                    {getStatusIcon(message.status)}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Botón de scroll to bottom */}
      {showScrollButton && (
        <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 z-20">
          <button
            onClick={() => {
              scrollToBottomInstantly();
              setShowScrollButton(false);
            }}
            className="bg-white/20 hover:bg-white/30 text-gray-700 dark:text-gray-300 rounded-full p-2 shadow-lg hover:shadow-xl transition-all duration-300 opacity-80 hover:opacity-100 hover:scale-105 backdrop-blur-md border border-white/40"
            aria-label="Ir al final"
            title="Ir al último mensaje"
          >
            <ChevronDown className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* AI Input (conditional) */}
      {showAiInput && (
        <div className="border-t border-gray-200 dark:border-gray-700 px-6 py-3 bg-purple-50 dark:bg-purple-900/20 h-16">
          <div className="flex items-center space-x-3">
            <Sparkles className="h-5 w-5 text-purple-500" />
            <input
              type="text"
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              placeholder="Escribe un prompt para la IA..."
              className="flex-1 px-3 py-2 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              onKeyPress={(e) => e.key === 'Enter' && handleSendAIMessage()}
              disabled={sending}
            />
            <button
              onClick={handleSendAIMessage}
              disabled={!aiPrompt.trim() || sending}
              className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Message Input */}
      <div className="border-t border-gray-200 dark:border-gray-700 px-6 py-3 h-16">
        <div className="flex items-center space-x-3">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Escribe un mensaje..."
            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            disabled={sending}
          />
          <button
            onClick={handleSendMessage}
            disabled={!newMessage.trim() || sending}
            className="px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
