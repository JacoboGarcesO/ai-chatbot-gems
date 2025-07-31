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
      setError(err instanceof Error ? err.message : 'Error loading messages');
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
      setError(err instanceof Error ? err.message : 'Error sending message');
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
    addMessage,
    clearMessages,
  };
}; 