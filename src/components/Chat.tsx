import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, ToggleLeft, ToggleRight, MessageSquare } from 'lucide-react';
import { format } from 'date-fns';
import { enUS } from 'date-fns/locale';
import type { Conversation, Message } from '../types';
import { conversationsAPI } from '../services/api';

interface ChatProps {
  conversation: Conversation | null;
}

const Chat: React.FC<ChatProps> = ({ conversation }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (conversation) {
      loadMessages();
    }
  }, [conversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadMessages = async () => {
    if (!conversation) return;

    try {
      setLoading(true);
      const data = await conversationsAPI.getMessageHistory(conversation.id);
      setMessages(data);
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!conversation || !newMessage.trim() || sending) return;

    try {
      setSending(true);
      const sentMessage = await conversationsAPI.sendHumanMessage(conversation.id, newMessage.trim());
      setMessages(prev => [...prev, sentMessage]);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSending(false);
    }
  };

  const handleToggleAI = async () => {
    if (!conversation) return;

    try {
      const success = await conversationsAPI.toggleAI(conversation.id, !conversation.ai_active);
      if (success) {
        // Update the conversation object
        conversation.ai_active = !conversation.ai_active;
        // Force re-render
        setMessages([...messages]);
      }
    } catch (error) {
      console.error('Error toggling AI:', error);
    }
  };

  const getMessageIcon = (senderType: string) => {
    switch (senderType) {
      case 'bot':
        return <Bot className="h-5 w-5 text-blue-500" />;
      case 'human_agent':
        return <User className="h-5 w-5 text-green-500" />;
      case 'customer':
        return <User className="h-5 w-5 text-gray-500" />;
      default:
        return <User className="h-5 w-5 text-gray-400" />;
    }
  };

  const getMessageAlignment = (senderType: string) => {
    return senderType === 'customer' ? 'justify-start' : 'justify-end';
  };

  const getMessageBubbleStyle = (senderType: string) => {
    switch (senderType) {
      case 'bot':
        return 'bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100';
      case 'human_agent':
        return 'bg-green-100 dark:bg-green-900 text-green-900 dark:text-green-100';
      case 'customer':
        return 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100';
      default:
        return 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100';
    }
  };

  const getSenderName = (senderType: string) => {
    switch (senderType) {
      case 'bot':
        return 'AI Assistant';
      case 'human_agent':
        return 'Agent';
      case 'customer':
        return conversation?.customer?.name || 'Customer';
      default:
        return 'Unknown';
    }
  };

  if (!conversation) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <MessageSquare className="mx-auto h-12 w-12 text-gray-300 dark:text-gray-600 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Select a conversation</h3>
          <p className="text-gray-500 dark:text-gray-400">Choose a conversation from the list to start chatting</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
            <span className="text-white font-medium">
              {conversation.customer?.name?.charAt(0) || 'C'}
            </span>
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
              {conversation.customer?.name || 'Unknown Customer'}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {conversation.status === 'open' ? 'Active conversation' :
                conversation.status === 'closed' ? 'Closed conversation' : 'Pending conversation'}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleToggleAI}
            className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${conversation.ai_active
                ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 hover:bg-green-200 dark:hover:bg-green-800'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
          >
            {conversation.ai_active ? (
              <>
                <ToggleRight className="h-4 w-4" />
                <span>AI ON</span>
              </>
            ) : (
              <>
                <ToggleLeft className="h-4 w-4" />
                <span>AI OFF</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white dark:bg-gray-800">
        {loading ? (
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 dark:border-blue-400"></div>
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400 py-8">
            <MessageSquare className="mx-auto h-12 w-12 text-gray-300 dark:text-gray-600 mb-4" />
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${getMessageAlignment(message.sender_type)}`}
            >
              <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${getMessageBubbleStyle(message.sender_type)}`}>
                <div className="flex items-center space-x-2 mb-1">
                  {getMessageIcon(message.sender_type)}
                  <span className="text-xs font-medium opacity-75">
                    {getSenderName(message.sender_type)}
                  </span>
                </div>
                <p className="text-sm">{message.content}</p>
                <p className="text-xs opacity-75 mt-1">
                  {format(new Date(message.timestamp), 'HH:mm', { locale: enUS })}
                </p>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Type your message..."
            disabled={sending}
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
          />
          <button
            onClick={handleSendMessage}
            disabled={!newMessage.trim() || sending}
            className="px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {sending ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <Send className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat; 