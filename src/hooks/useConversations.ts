import { useState, useEffect, useCallback } from 'react';
import type { Conversation } from '../types';
import { conversationsAPI, aiAPI } from '../services/api';

interface UseConversationsOptions {
  filters?: {
    status?: string;
    customer?: string;
  };
}

export const useConversations = (options: UseConversationsOptions = {}) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadConversations = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await conversationsAPI.listConversations(options.filters);
      
      setConversations(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error loading conversations';
      console.error('❌ useConversations: Error cargando conversaciones:', err);
      console.error('❌ useConversations: Mensaje de error:', errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [options.filters]);

  const toggleAI = useCallback(async (conversationId: string, aiActive: boolean) => {
    try {
      // Optimistic update - cambiar estado inmediatamente
      setConversations(prev =>
        prev.map(conv =>
          conv.id === conversationId
            ? { ...conv, ai_active: aiActive }
            : conv
        )
      );

      const success = await conversationsAPI.toggleAI(conversationId, aiActive);
      if (!success) {
        // Si falla, revertir el estado
        setConversations(prev =>
          prev.map(conv =>
            conv.id === conversationId
              ? { ...conv, ai_active: !aiActive }
              : conv
          )
        );
      }
      return success;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error toggling AI');
      // Revertir estado si hay error
      setConversations(prev =>
        prev.map(conv =>
          conv.id === conversationId
            ? { ...conv, ai_active: !aiActive }
            : conv
        )
      );
      return false;
    }
  }, []);

  const sendMessage = useCallback(async (conversationId: string, content: string) => {
    try {
      const message = await conversationsAPI.sendHumanMessage(conversationId, content);
      // Update the conversation's last message
      setConversations(prev =>
        prev.map(conv =>
          conv.id === conversationId
            ? {
              ...conv,
              last_message: content,
              last_timestamp: message.timestamp
            }
            : conv
        )
      );
      return message;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error sending message');
      throw err;
    }
  }, []);

  const sendAIMessage = useCallback(async (conversationId: string, prompt: string, context?: string) => {
    try {
      const message = await conversationsAPI.sendAIMessage(conversationId, prompt, context);
      // Update the conversation's last message
      setConversations(prev =>
        prev.map(conv =>
          conv.id === conversationId
            ? {
              ...conv,
              last_message: message.content,
              last_timestamp: message.timestamp
            }
            : conv
        )
      );
      return message;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error sending AI message');
      throw err;
    }
  }, []);

  const markAsRead = useCallback(async (conversationId: string) => {
    try {
      const success = await conversationsAPI.markAsRead(conversationId);
      return success;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error marking as read');
      return false;
    }
  }, []);

  const searchConversations = useCallback(async (query: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await conversationsAPI.searchConversations(query);
      setConversations(data);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error searching conversations');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const askAI = useCallback(async (question: string, context?: string) => {
    try {
      const response = await aiAPI.askAI(question, context);
      return response;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error asking AI');
      throw err;
    }
  }, []);

  useEffect(() => {
    loadConversations();
    
    // Auto-refresh cada 5 segundos para la lista de conversaciones
    const interval = setInterval(() => {
      loadConversations();
    }, 5000);

    return () => clearInterval(interval);
  }, [loadConversations]);

  return {
    conversations,
    loading,
    error,
    loadConversations,
    toggleAI,
    sendMessage,
    sendAIMessage,
    markAsRead,
    searchConversations,
    askAI,
  };
}; 