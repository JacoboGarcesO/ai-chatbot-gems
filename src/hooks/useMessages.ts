import { useState, useEffect, useCallback } from 'react';
import type { Message } from '../types';
import { conversationsAPI } from '../services/api';

export const useMessages = (conversationId: string | undefined) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadMessages = useCallback(async () => {
    if (!conversationId) return;

    try {
      setLoading(true);
      setError(null);
      
      const data = await conversationsAPI.getMessageHistory(conversationId);
      setMessages(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error loading messages';
      console.error('❌ useMessages: Error cargando mensajes:', err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [conversationId]);

  const sendMessage = useCallback(async (content: string) => {
    if (!conversationId) return null;

    try {
      const message = await conversationsAPI.sendHumanMessage(conversationId, content);
      setMessages(prev => [...prev, message]);
      return message;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error sending message';
      console.error('❌ useMessages: Error enviando mensaje:', err);
      setError(errorMessage);
      throw err;
    }
  }, [conversationId]);

  const sendAIMessage = useCallback(async (prompt: string, context?: string) => {
    if (!conversationId) return null;

    try {
      const message = await conversationsAPI.sendAIMessage(conversationId, prompt, context);
      setMessages(prev => [...prev, message]);
      return message;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error sending AI message';
      console.error('❌ useMessages: Error enviando mensaje IA:', err);
      setError(errorMessage);
      throw err;
    }
  }, [conversationId]);

  const addMessage = useCallback((message: Message) => {
    setMessages(prev => [...prev, message]);
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  useEffect(() => {
    if (conversationId) {
      loadMessages();
      
      // Auto-refresh cada 3 segundos
      const interval = setInterval(() => {
        loadMessages();
      }, 3000);

      return () => clearInterval(interval);
    } else {
      setMessages([]);
    }
  }, [conversationId, loadMessages]);

  return {
    messages,
    loading,
    error,
    loadMessages,
    sendMessage,
    sendAIMessage,
    addMessage,
    clearMessages,
  };
}; 