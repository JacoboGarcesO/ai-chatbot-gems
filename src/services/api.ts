import type { Conversation, Message, KnowledgeBase, Report, FinalCustomer } from '../types';
import { API_CONFIG, buildApiUrl } from '../config/api';

// Helper function for API calls with timeout
const apiCall = async (endpoint: string, options: RequestInit = { headers: { 'Content-Type': 'application/json', 'Allow-Control-Allow-Origin': API_CONFIG.BASE_URL } }) => {
  const url = buildApiUrl(endpoint);

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);

  try {
    const response = await fetch(url, {
      headers: {
        ...options.headers,
      },
      signal: controller.signal,
      ...options,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new Error('Request timeout');
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
      let endpoint = API_CONFIG.ENDPOINTS.CONVERSATIONS;
      const params = new URLSearchParams();

      if (filters?.status) {
        params.append('status', filters.status);
      }
      if (filters?.customer) {
        params.append('search', filters.customer);
      }

      if (params.toString()) {
        endpoint += `?${params.toString()}`;
      }

      const data = await apiCall(endpoint);

      // Transform API response to match our Conversation interface
      return data.map((conv: any) => ({
        id: conv.phone || conv.id,
        company_id: 'company1', // Default company ID
        customer_id: conv.phone || conv.id,
        status: conv.status || 'open',
        ai_active: true, // Default to true for WhatsApp conversations
        start_timestamp: conv.start_timestamp || new Date().toISOString(),
        end_timestamp: conv.end_timestamp,
        ai_classification: conv.classification,
        ai_summary: conv.summary,
        customer: {
          id: conv.phone || conv.id,
          name: conv.customer_name || `Cliente ${conv.phone || conv.id}`,
          phone: conv.phone || conv.id,
        },
        last_message: conv.last_message || conv.message,
        last_timestamp: conv.last_timestamp || conv.timestamp,
      }));
    } catch (error) {
      console.error('Error fetching conversations:', error);
      return [];
    }
  },

  // Get conversation by ID (phone number)
  async getConversation(id: string): Promise<Conversation | null> {
    try {
      const data = await apiCall(`${API_CONFIG.ENDPOINTS.CONVERSATIONS}/${id}`);

      return {
        id: data.phone || data.id,
        company_id: 'company1',
        customer_id: data.phone || data.id,
        status: data.status || 'open',
        ai_active: true,
        start_timestamp: data.start_timestamp || new Date().toISOString(),
        end_timestamp: data.end_timestamp,
        ai_classification: data.classification,
        ai_summary: data.summary,
        customer: {
          id: data.phone || data.id,
          name: data.customer_name || `Cliente ${data.phone || data.id}`,
          phone: data.phone || data.id,
        },
        last_message: data.last_message || data.message,
        last_timestamp: data.last_timestamp || data.timestamp,
      };
    } catch (error) {
      console.error('Error fetching conversation:', error);
      return null;
    }
  },

  // Get message history
  async getMessageHistory(conversationId: string): Promise<Message[]> {
    try {
      const data = await apiCall(`${API_CONFIG.ENDPOINTS.CONVERSATIONS}/${conversationId}`);

      // Transform messages from the conversation data
      if (data.messages && Array.isArray(data.messages)) {
        return data.messages.map((msg: any, index: number) => ({
          id: msg.id || index.toString(),
          conversation_id: conversationId,
          sender_type: msg.from === conversationId ? 'customer' : 'bot',
          content: msg.body || msg.content || msg.message,
          timestamp: msg.timestamp || msg.date || new Date().toISOString(),
          sender_id: msg.sender_id,
        }));
      }

      return [];
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
      const response = await apiCall(API_CONFIG.ENDPOINTS.SEND_MESSAGE, {
        method: 'POST',
        body: JSON.stringify({
          to: conversationId,
          message: content,
        }),
      });

      const newMessage: Message = {
        id: Date.now().toString(),
        conversation_id: conversationId,
        sender_type: 'human_agent',
        content,
        timestamp: new Date().toISOString(),
        sender_id: 'agent1',
      };

      return newMessage;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  },

  // Send AI-assisted message
  async sendAIMessage(conversationId: string, prompt: string, context?: string): Promise<Message> {
    try {
      const response = await apiCall(API_CONFIG.ENDPOINTS.SEND_AI_MESSAGE, {
        method: 'POST',
        body: JSON.stringify({
          to: conversationId,
          prompt,
          context: context || 'Clínica médica',
        }),
      });

      const newMessage: Message = {
        id: Date.now().toString(),
        conversation_id: conversationId,
        sender_type: 'bot',
        content: response.message || prompt,
        timestamp: new Date().toISOString(),
        sender_id: 'ai',
      };

      return newMessage;
    } catch (error) {
      console.error('Error sending AI message:', error);
      throw error;
    }
  },

  // Mark conversation as read
  async markAsRead(conversationId: string): Promise<boolean> {
    try {
      await apiCall(`${API_CONFIG.ENDPOINTS.CONVERSATIONS}/${conversationId}/read`, {
        method: 'POST',
      });
      return true;
    } catch (error) {
      console.error('Error marking as read:', error);
      return false;
    }
  },

  // Search conversations
  async searchConversations(query: string): Promise<Conversation[]> {
    try {
      const data = await apiCall(`${API_CONFIG.ENDPOINTS.CONVERSATIONS}/search/${encodeURIComponent(query)}`);

      return data.map((conv: any) => ({
        id: conv.phone || conv.id,
        company_id: 'company1',
        customer_id: conv.phone || conv.id,
        status: conv.status || 'open',
        ai_active: true,
        start_timestamp: conv.start_timestamp || new Date().toISOString(),
        end_timestamp: conv.end_timestamp,
        ai_classification: conv.classification,
        ai_summary: conv.summary,
        customer: {
          id: conv.phone || conv.id,
          name: conv.customer_name || `Cliente ${conv.phone || conv.id}`,
          phone: conv.phone || conv.id,
        },
        last_message: conv.last_message || conv.message,
        last_timestamp: conv.last_timestamp || conv.timestamp,
      }));
    } catch (error) {
      console.error('Error searching conversations:', error);
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
        enabled: data.enabled || false,
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