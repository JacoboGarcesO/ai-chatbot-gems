export interface Company {
  id: string;
  name: string;
  api_key: string;
  firebase_uid: string;
}

export interface FinalCustomer {
  id: string;
  name: string;
  phone: string;
  avatar?: string;
}

export interface Conversation {
  id: string;
  company_id: string;
  customer_id: string;
  status: 'open' | 'closed' | 'pending';
  ai_active: boolean;
  start_timestamp: string;
  end_timestamp?: string;
  ai_classification?: string;
  ai_summary?: string;
  customer?: FinalCustomer;
  last_message?: string;
  last_timestamp?: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_type: 'bot' | 'human_agent' | 'customer';
  content: string;
  timestamp: string;
  sender_id?: string;
  type?: string;
  status?: string;
  isAiGenerated?: boolean;
  twilioSid?: string;
}

export interface KnowledgeBase {
  id: string;
  company_id: string;
  key_question: string;
  answer: string;
  active: boolean;
  tags?: string[];
}

export interface Report {
  id: string;
  company_id: string;
  start_date: string;
  end_date: string;
  total_conversations: number;
  classified_conversations: {
    closed_sale: number;
    interested_customer: number;
    requires_followup: number;
    information_requested: number;
  };
  average_response_time: number;
  customer_satisfaction: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'agent';
  company_id: string;
} 