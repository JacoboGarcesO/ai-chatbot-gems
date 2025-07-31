import { useState, useEffect, useCallback } from 'react';
import type { Conversation } from '../types';
import { conversationsAPI } from '../services/api';

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
      setError(err instanceof Error ? err.message : 'Error loading conversations');
    } finally {
      setLoading(false);
    }
  }, [options.filters]);

  const toggleAI = useCallback(async (conversationId: string, aiActive: boolean) => {
    try {
      const success = await conversationsAPI.toggleAI(conversationId, aiActive);
      if (success) {
        setConversations(prev =>
          prev.map(conv =>
            conv.id === conversationId
              ? { ...conv, ai_active: aiActive }
              : conv
          )
        );
      }
      return success;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error toggling AI');
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

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  return {
    conversations,
    loading,
    error,
    loadConversations,
    toggleAI,
    sendMessage,
  };
}; 