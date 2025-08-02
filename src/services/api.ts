import type { Conversation, Message, KnowledgeBase, Report, FinalCustomer } from '../types';
import { API_CONFIG, buildApiUrl } from '../config/api';

// Helper function for API calls with timeout
const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  const url = buildApiUrl(endpoint);

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);

  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
      signal: controller.signal,
      ...options,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API Error: ${response.status} ${response.statusText}. ${errorText}`);
    }

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return response.json();
    } else {
      return response.text();
    }
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new Error('Request timeout - The server took too long to respond');
      }
      throw error;
    }
    throw new Error('Unknown error occurred');
  }
};

// API Services
export const conversationsAPI = {
  // List conversations
  async listConversations(filters?: { status?: string; customer?: string }): Promise<Conversation[]> {
    try {
      console.log('🔄 API: Iniciando listConversations con filtros:', filters);
      
      let endpoint = API_CONFIG.ENDPOINTS.CONVERSATIONS;
      const params = new URLSearchParams();

      if (filters?.status) {
        params.append('status', filters.status);
        console.log('🔍 API: Agregando filtro de status:', filters.status);
      }
      if (filters?.customer) {
        params.append('search', filters.customer);
        console.log('🔍 API: Agregando filtro de customer:', filters.customer);
      }

      if (params.toString()) {
        endpoint += `?${params.toString()}`;
      }

      console.log('📡 API: Llamando endpoint:', buildApiUrl(endpoint));
      const response = await apiCall(endpoint);
      console.log('📥 API: Respuesta recibida:', response);

      // Check if response has the expected structure
      if (!response.success || !response.conversations) {
        console.error('❌ API: Estructura de respuesta inválida:', response);
        throw new Error('Invalid API response format');
      }

      console.log('📊 API: Procesando', response.conversations.length, 'conversaciones');

      // Transform API response to match our Conversation interface
      const transformedConversations = response.conversations.map((conv: any) => ({
        id: conv._id,
        company_id: 'company1', // Default company ID
        customer_id: conv.phoneNumber,
        status: conv.isActive ? 'open' : 'closed',
        ai_active: true, // Default to true for WhatsApp conversations
        start_timestamp: conv.createdAt,
        end_timestamp: undefined, // Not provided in current API
        last_message: conv.lastMessage?.text || '',
        last_timestamp: conv.lastMessage?.timestamp || conv.lastMessageAt,
        ai_classification: '',
        ai_summary: '',
        customer: {
          id: conv.phoneNumber,
          name: conv.contactName || conv.phoneNumber.replace('whatsapp:', ''),
          phone: conv.phoneNumber,
        }
      }));

      console.log('✅ API: Conversaciones transformadas exitosamente:', transformedConversations.length);
      console.log('📋 API: Primera conversación transformada:', transformedConversations[0]);
      
      return transformedConversations;
    } catch (error) {
      console.error('❌ API: Error en listConversations:', error);
      throw error;
    }
  },

  // Get conversation by ID (phone number)
  async getConversation(id: string): Promise<Conversation | null> {
    try {
      const response = await apiCall(`${API_CONFIG.ENDPOINTS.CONVERSATIONS}/${encodeURIComponent(id)}`);

      if (!response.success || !response.conversation) {
        return null;
      }

      const conv = response.conversation;
      return {
        id: conv._id,
        company_id: 'company1',
        customer_id: conv.phoneNumber,
        status: conv.isActive ? 'open' : 'closed',
        ai_active: true,
        start_timestamp: conv.createdAt,
        end_timestamp: undefined,
        last_message: conv.lastMessage?.text || '',
        last_timestamp: conv.lastMessage?.timestamp || conv.lastMessageAt,
        ai_classification: '',
        ai_summary: '',
        customer: {
          id: conv.phoneNumber,
          name: conv.contactName || conv.phoneNumber.replace('whatsapp:', ''),
          phone: conv.phoneNumber,
        }
      };
    } catch (error) {
      console.error('Error fetching conversation:', error);
      return null;
    }
  },

  // Get message history
  async getMessageHistory(conversationId: string): Promise<Message[]> {
    try {
      const response = await apiCall(`${API_CONFIG.ENDPOINTS.CONVERSATIONS}/${encodeURIComponent(conversationId)}`);

      if (!response.success || !response.messages) {
        return [];
      }

      // Transform messages from the conversation data
      return response.messages.map((msg: any) => ({
        id: msg._id,
        conversation_id: conversationId,
        sender_type: msg.type === 'received' ? 'customer' : 'bot',
        content: msg.text,
        timestamp: msg.timestamp,
        sender_id: msg.type === 'received' ? conversationId : 'bot',
        type: msg.type,
        status: msg.status,
        isAiGenerated: msg.metadata?.isAiGenerated || false,
        twilioSid: msg.twilioSid
      }));
    } catch (error) {
      console.error('Error fetching message history:', error);
      return [];
    }
  },

  // Toggle AI ON/OFF (this would be handled by the bot status endpoint)
  async toggleAI(conversationId: string, aiActive: boolean): Promise<boolean> {
    try {
      await apiCall(API_CONFIG.ENDPOINTS.BOT_TOGGLE, {
        method: 'POST',
        body: JSON.stringify({ enabled: aiActive }),
      });
      return true;
    } catch (error) {
      console.error('Error toggling AI:', error);
      return false;
    }
  },

  // Send message as human agent
  async sendHumanMessage(conversationId: string, content: string): Promise<Message> {
    try {
      console.log('📤 API: Enviando mensaje manual a:', conversationId, 'Contenido:', content);
      
      const response = await apiCall(API_CONFIG.ENDPOINTS.SEND_MESSAGE, {
        method: 'POST',
        body: JSON.stringify({
          to: conversationId,
          message: content,
        }),
      });

      console.log('✅ API: Respuesta del envío manual:', response);

      const newMessage: Message = {
        id: response.messageId || Date.now().toString(),
        conversation_id: conversationId,
        sender_type: 'human_agent',
        content,
        timestamp: new Date().toISOString(),
        sender_id: 'agent1',
        type: 'sent',
        status: 'sent'
      };

      return newMessage;
    } catch (error) {
      console.error('❌ API: Error enviando mensaje manual:', error);
      throw error;
    }
  },

  // Send AI-assisted message
  async sendAIMessage(conversationId: string, prompt: string, context?: string): Promise<Message> {
    try {
      console.log('🤖 API: Enviando mensaje con IA a:', conversationId);
      console.log('🤖 API: Prompt:', prompt);
      console.log('🤖 API: Context:', context);
      
      const response = await apiCall(API_CONFIG.ENDPOINTS.SEND_AI_MESSAGE, {
        method: 'POST',
        body: JSON.stringify({
          to: conversationId,
          prompt,
          context: context || 'Asistente de atención al cliente',
        }),
      });

      console.log('✅ API: Respuesta del envío con IA:', response);

      const newMessage: Message = {
        id: response.messageId || Date.now().toString(),
        conversation_id: conversationId,
        sender_type: 'bot',
        content: response.message || response.text || 'Mensaje enviado con IA',
        timestamp: new Date().toISOString(),
        sender_id: 'ai',
        type: 'ai-assisted',
        status: 'sent',
        isAiGenerated: true
      };

      return newMessage;
    } catch (error) {
      console.error('❌ API: Error enviando mensaje con IA:', error);
      throw error;
    }
  },

  // Mark conversation as read
  async markAsRead(conversationId: string): Promise<boolean> {
    try {
      console.log('📖 API: Marcando conversación como leída:', conversationId);
      await apiCall(`${API_CONFIG.ENDPOINTS.CONVERSATIONS}/${encodeURIComponent(conversationId)}/read`, {
        method: 'POST',
      });
      console.log('✅ API: Conversación marcada como leída');
      return true;
    } catch (error) {
      console.error('❌ API: Error marcando como leída:', error);
      return false;
    }
  },

  // Search conversations
  async searchConversations(query: string): Promise<Conversation[]> {
    try {
      console.log('🔍 API: Buscando conversaciones con query:', query);
      const response = await apiCall(`${API_CONFIG.ENDPOINTS.CONVERSATIONS}/search/${encodeURIComponent(query)}`);

      console.log('✅ API: Resultados de búsqueda:', response);

      // La API debería retornar el mismo formato que listConversations
      if (!response.success || !response.conversations) {
        return [];
      }

      return response.conversations.map((conv: any) => ({
        id: conv._id,
        company_id: 'company1',
        customer_id: conv.phoneNumber,
        status: conv.isActive ? 'open' : 'closed',
        ai_active: true,
        start_timestamp: conv.createdAt,
        end_timestamp: undefined,
        last_message: conv.lastMessage?.text || '',
        last_timestamp: conv.lastMessage?.timestamp || conv.lastMessageAt,
        ai_classification: '',
        ai_summary: '',
        customer: {
          id: conv.phoneNumber,
          name: conv.contactName || conv.phoneNumber.replace('whatsapp:', ''),
          phone: conv.phoneNumber,
        }
      }));
    } catch (error) {
      console.error('❌ API: Error en búsqueda de conversaciones:', error);
      return [];
    }
  },
};

// AI Service for direct AI queries
export const aiAPI = {
  async askAI(question: string, context?: string): Promise<string> {
    try {
      const response = await apiCall(API_CONFIG.ENDPOINTS.ASK_AI, {
        method: 'POST',
        body: JSON.stringify({
          question,
          context: context || 'Clínica médica',
        }),
      });

      return response.answer || response.response || 'No se pudo obtener respuesta de la IA';
    } catch (error) {
      console.error('Error asking AI:', error);
      throw error;
    }
  },
};

// Health and Status API
export const healthAPI = {
  async getHealthStatus(): Promise<{ status: string; timestamp: string }> {
    try {
      const data = await apiCall(API_CONFIG.ENDPOINTS.HEALTH);
      return {
        status: data.status || 'healthy',
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Error fetching health status:', error);
      return {
        status: 'error',
        timestamp: new Date().toISOString(),
      };
    }
  },

  async getBotStatus(): Promise<{ enabled: boolean }> {
    try {
      const data = await apiCall(API_CONFIG.ENDPOINTS.BOT_STATUS);
      return {
        enabled: data.autoResponseEnabled || false,
      };
    } catch (error) {
      console.error('Error fetching bot status:', error);
      return { enabled: false };
    }
  },

  async toggleBot(enabled: boolean): Promise<boolean> {
    try {
      await apiCall(API_CONFIG.ENDPOINTS.BOT_TOGGLE, {
        method: 'POST',
        body: JSON.stringify({ enabled }),
      });
      return true;
    } catch (error) {
      console.error('Error toggling bot:', error);
      return false;
    }
  },
};

// Statistics API
export const statsAPI = {
  async getStats(): Promise<any> {
    try {
      const data = await apiCall(API_CONFIG.ENDPOINTS.STATS);
      return data;
    } catch (error) {
      console.error('Error fetching stats:', error);
      return {
        total_conversations: 0,
        active_conversations: 0,
        messages_today: 0,
        ai_responses: 0,
      };
    }
  },
};

// Keep the existing knowledge base and reports APIs for now
// as they might not have direct equivalents in the WhatsApp API
export const knowledgeBaseAPI = {
  async listKnowledgeBase(): Promise<KnowledgeBase[]> {
    // For now, return empty array as this might not be available in WhatsApp API
    return [];
  },

  async createEntry(entry: Omit<KnowledgeBase, 'id'>): Promise<KnowledgeBase> {
    throw new Error('Knowledge base not available in WhatsApp API');
  },

  async updateEntry(id: string, entry: Partial<KnowledgeBase>): Promise<KnowledgeBase | null> {
    throw new Error('Knowledge base not available in WhatsApp API');
  },

  async deleteEntry(id: string): Promise<boolean> {
    throw new Error('Knowledge base not available in WhatsApp API');
  },
};

export const reportsAPI = {
  async getReport(startDate: string, endDate: string): Promise<Report> {
    try {
      const stats = await statsAPI.getStats();

      return {
        id: '1',
        company_id: 'company1',
        start_date: startDate,
        end_date: endDate,
        total_conversations: stats.total_conversations || 0,
        classified_conversations: {
          closed_sale: Math.floor((stats.total_conversations || 0) * 0.3),
          interested_customer: Math.floor((stats.total_conversations || 0) * 0.2),
          requires_followup: Math.floor((stats.total_conversations || 0) * 0.2),
          information_requested: Math.floor((stats.total_conversations || 0) * 0.3),
        },
        average_response_time: 2.5,
        customer_satisfaction: 4.2,
      };
    } catch (error) {
      console.error('Error generating report:', error);
      return {
        id: '1',
        company_id: 'company1',
        start_date: startDate,
        end_date: endDate,
        total_conversations: 0,
        classified_conversations: {
          closed_sale: 0,
          interested_customer: 0,
          requires_followup: 0,
          information_requested: 0,
        },
        average_response_time: 0,
        customer_satisfaction: 0,
      };
    }
  },
}; 