// API Configuration
export const API_CONFIG = {
  BASE_URL: 'https://twilio-9ubt.onrender.com',
  ENDPOINTS: {
    HEALTH: '/api/health',
    BOT_STATUS: '/api/auto-response/status',
    BOT_TOGGLE: '/api/auto-response/toggle',
    CONVERSATIONS: '/api/conversations',
    SEND_MESSAGE: '/api/send-message',
    SEND_AI_MESSAGE: '/api/send-ai-message',
    ASK_AI: '/api/ask-ai',
    STATS: '/api/stats',
  },
  TIMEOUT: 30000, // 30 seconds (increased from 10)
};

// Helper function to build API URLs
export const buildApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
}; 