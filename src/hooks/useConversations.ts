import { useState, useEffect, useCallback } from 'react';
import type { Conversacion } from '../types';
import { conversacionesAPI } from '../services/api';

interface UseConversationsOptions {
  filters?: {
    estado?: string;
    cliente?: string;
  };
}

export const useConversations = (options: UseConversationsOptions = {}) => {
  const [conversations, setConversations] = useState<Conversacion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadConversations = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await conversacionesAPI.listarConversaciones(options.filters);
      setConversations(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading conversations');
    } finally {
      setLoading(false);
    }
  }, [options.filters]);

  const toggleIA = useCallback(async (conversationId: string, iaActiva: boolean) => {
    try {
      const success = await conversacionesAPI.toggleIA(conversationId, iaActiva);
      if (success) {
        setConversations(prev =>
          prev.map(conv =>
            conv.id === conversationId
              ? { ...conv, ia_activa: iaActiva }
              : conv
          )
        );
      }
      return success;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error toggling IA');
      return false;
    }
  }, []);

  const sendMessage = useCallback(async (conversationId: string, content: string) => {
    try {
      const message = await conversacionesAPI.enviarMensajeHumano(conversationId, content);
      // Update the conversation's last message
      setConversations(prev =>
        prev.map(conv =>
          conv.id === conversationId
            ? {
              ...conv,
              ultimo_mensaje: content,
              ultimo_timestamp: message.timestamp
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
    toggleIA,
    sendMessage,
  };
}; 