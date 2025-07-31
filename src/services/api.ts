import type { Conversation, Message, KnowledgeBase, Report, FinalCustomer } from '../types';

// Mock data
const mockCustomers: FinalCustomer[] = [
  { id: '1', name: 'Juan Pérez', phone: '+573001234567' },
  { id: '2', name: 'María García', phone: '+573007654321' },
  { id: '3', name: 'Carlos López', phone: '+573001112223' },
];

const mockConversations: Conversation[] = [
  {
    id: '1',
    company_id: 'company1',
    customer_id: '1',
    status: 'open',
    ai_active: true,
    start_timestamp: '2024-01-15T10:30:00Z',
    customer: mockCustomers[0],
    last_message: '¿Cuál es el precio del producto?',
    last_timestamp: '2024-01-15T14:20:00Z',
  },
  {
    id: '2',
    company_id: 'company1',
    customer_id: '2',
    status: 'closed',
    ai_active: false,
    start_timestamp: '2024-01-14T09:15:00Z',
    end_timestamp: '2024-01-14T16:45:00Z',
    ai_classification: 'Venta Cerrada',
    ai_summary: 'Cliente interesado en producto premium. Se cerró venta por $500.000',
    customer: mockCustomers[1],
    last_message: 'Perfecto, procedo con la compra',
    last_timestamp: '2024-01-14T16:45:00Z',
  },
  {
    id: '3',
    company_id: 'company1',
    customer_id: '3',
    status: 'pending',
    ai_active: true,
    start_timestamp: '2024-01-15T08:00:00Z',
    customer: mockCustomers[2],
    last_message: 'Necesito más información sobre garantías',
    last_timestamp: '2024-01-15T12:30:00Z',
  },
];

const mockMessages: Record<string, Message[]> = {
  '1': [
    {
      id: '1',
      conversation_id: '1',
      sender_type: 'customer',
      content: 'Hola, estoy interesado en sus productos',
      timestamp: '2024-01-15T10:30:00Z',
    },
    {
      id: '2',
      conversation_id: '1',
      sender_type: 'bot',
      content: '¡Hola! Gracias por contactarnos. ¿En qué producto específico estás interesado?',
      timestamp: '2024-01-15T10:31:00Z',
    },
    {
      id: '3',
      conversation_id: '1',
      sender_type: 'customer',
      content: '¿Cuál es el precio del producto?',
      timestamp: '2024-01-15T14:20:00Z',
    },
  ],
  '2': [
    {
      id: '4',
      conversation_id: '2',
      sender_type: 'customer',
      content: 'Hola, quiero comprar el producto premium',
      timestamp: '2024-01-14T09:15:00Z',
    },
    {
      id: '5',
      conversation_id: '2',
      sender_type: 'human_agent',
      content: '¡Hola! Te ayudo con la compra del producto premium. El precio es $500.000',
      timestamp: '2024-01-14T09:16:00Z',
      sender_id: 'agent1',
    },
    {
      id: '6',
      conversation_id: '2',
      sender_type: 'customer',
      content: 'Perfecto, procedo con la compra',
      timestamp: '2024-01-14T16:45:00Z',
    },
  ],
  '3': [
    {
      id: '7',
      conversation_id: '3',
      sender_type: 'customer',
      content: 'Hola, tengo una pregunta sobre garantías',
      timestamp: '2024-01-15T08:00:00Z',
    },
    {
      id: '8',
      conversation_id: '3',
      sender_type: 'bot',
      content: '¡Hola! Con gusto te ayudo con información sobre garantías. ¿Qué producto específico te interesa?',
      timestamp: '2024-01-15T08:01:00Z',
    },
    {
      id: '9',
      conversation_id: '3',
      sender_type: 'customer',
      content: 'Necesito más información sobre garantías',
      timestamp: '2024-01-15T12:30:00Z',
    },
  ],
};

const mockKnowledgeBase: KnowledgeBase[] = [
  {
    id: '1',
    company_id: 'company1',
    key_question: 'precio',
    answer: 'Nuestros precios varían según el producto. ¿Podrías especificar cuál te interesa?',
    active: true,
    tags: ['precios', 'productos'],
  },
  {
    id: '2',
    company_id: 'company1',
    key_question: 'garantía',
    answer: 'Todos nuestros productos tienen garantía de 1 año. Productos premium tienen 2 años.',
    active: true,
    tags: ['garantía', 'servicio'],
  },
  {
    id: '3',
    company_id: 'company1',
    key_question: 'envío',
    answer: 'Realizamos envíos a todo el país. El tiempo de entrega es de 3-5 días hábiles.',
    active: true,
    tags: ['envío', 'logística'],
  },
];

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// API Services
export const conversationsAPI = {
  // List conversations
  async listConversations(filters?: { status?: string; customer?: string }): Promise<Conversation[]> {
    await delay(500);
    let conversations = [...mockConversations];

    if (filters?.status) {
      conversations = conversations.filter(c => c.status === filters.status);
    }

    if (filters?.customer) {
      conversations = conversations.filter(c =>
        c.customer?.name.toLowerCase().includes(filters.customer!.toLowerCase())
      );
    }

    return conversations;
  },

  // Get conversation by ID
  async getConversation(id: string): Promise<Conversation | null> {
    await delay(300);
    return mockConversations.find(c => c.id === id) || null;
  },

  // Get message history
  async getMessageHistory(conversationId: string): Promise<Message[]> {
    await delay(400);
    return mockMessages[conversationId] || [];
  },

  // Toggle AI ON/OFF
  async toggleAI(conversationId: string, aiActive: boolean): Promise<boolean> {
    await delay(200);
    const conversation = mockConversations.find(c => c.id === conversationId);
    if (conversation) {
      conversation.ai_active = aiActive;
      return true;
    }
    return false;
  },

  // Send message as human agent
  async sendHumanMessage(conversationId: string, content: string): Promise<Message> {
    await delay(300);
    const newMessage: Message = {
      id: Date.now().toString(),
      conversation_id: conversationId,
      sender_type: 'human_agent',
      content,
      timestamp: new Date().toISOString(),
      sender_id: 'agent1',
    };

    if (!mockMessages[conversationId]) {
      mockMessages[conversationId] = [];
    }
    mockMessages[conversationId].push(newMessage);

    return newMessage;
  },
};

export const knowledgeBaseAPI = {
  // List knowledge base
  async listKnowledgeBase(): Promise<KnowledgeBase[]> {
    await delay(400);
    return [...mockKnowledgeBase];
  },

  // Create new entry
  async createEntry(entry: Omit<KnowledgeBase, 'id'>): Promise<KnowledgeBase> {
    await delay(500);
    const newEntry: KnowledgeBase = {
      ...entry,
      id: Date.now().toString(),
    };
    mockKnowledgeBase.push(newEntry);
    return newEntry;
  },

  // Update entry
  async updateEntry(id: string, entry: Partial<KnowledgeBase>): Promise<KnowledgeBase | null> {
    await delay(400);
    const index = mockKnowledgeBase.findIndex(e => e.id === id);
    if (index !== -1) {
      mockKnowledgeBase[index] = { ...mockKnowledgeBase[index], ...entry };
      return mockKnowledgeBase[index];
    }
    return null;
  },

  // Delete entry
  async deleteEntry(id: string): Promise<boolean> {
    await delay(300);
    const index = mockKnowledgeBase.findIndex(e => e.id === id);
    if (index !== -1) {
      mockKnowledgeBase.splice(index, 1);
      return true;
    }
    return false;
  },
};

export const reportsAPI = {
  // Get metrics report
  async getReport(startDate: string, endDate: string): Promise<Report> {
    await delay(600);
    return {
      id: '1',
      company_id: 'company1',
      start_date: startDate,
      end_date: endDate,
      total_conversations: 150,
      classified_conversations: {
        closed_sale: 45,
        interested_customer: 30,
        requires_followup: 25,
        information_requested: 50,
      },
      average_response_time: 2.5,
      customer_satisfaction: 4.2,
    };
  },
}; 