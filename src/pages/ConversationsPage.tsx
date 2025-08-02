import React, { useState, useEffect } from 'react';
import { Activity, Users, MessageSquare, AlertCircle } from 'lucide-react';
import type { Conversation } from '../types';
import ConversationsList from '../components/ConversationsList';
import Chat from '../components/Chat';
import { useBotStatus } from '../hooks/useBotStatus';
import { useConversations } from '../hooks/useConversations';
import { BotToggle } from '../components/ui';

const ConversationsPage: React.FC = () => {
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const { healthStatus, stats, error: botError } = useBotStatus();
  const { conversations } = useConversations();

  // Sincronizar la conversación seleccionada con el estado global actualizado
  const actualSelectedConversation = selectedConversation 
    ? conversations.find(conv => conv.id === selectedConversation.id) || selectedConversation
    : null;

  return (
    <div className="max-w-7xl mx-auto">
      {/* Status Bar */}
      <div className="mb-4 p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            {/* Bot Status */}
            <BotToggle variant="bar" />

            {/* Health Status */}
            <div className="flex items-center space-x-2">
              <Activity className={`h-5 w-5 ${healthStatus === 'healthy' ? 'text-green-500' :
                healthStatus === 'error' ? 'text-red-500' : 'text-yellow-500'
                }`} />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                API: {healthStatus === 'healthy' ? 'Connected' : 'Disconnected'}
              </span>
            </div>
          </div>

          {/* Stats */}
          {stats && (
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <Users className="h-4 w-4 text-blue-500" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {stats.total_conversations || 0} conversations
                </span>
              </div>
              <div className="flex items-center space-x-1">
                <MessageSquare className="h-4 w-4 text-green-500" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {stats.messages_today || 0} messages today
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Error Display */}
        {botError && (
          <div className="mt-3 p-3 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 text-sm rounded-md border border-red-200 dark:border-red-800 flex items-center space-x-2">
            <AlertCircle className="h-4 w-4" />
            <span>{botError}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Conversations List */}
        <div className="lg:col-span-1 h-[600px]">
          <ConversationsList
            onSelectConversation={setSelectedConversation}
            selectedConversationId={actualSelectedConversation?.id}
          />
        </div>

        {/* Chat Area */}
        <div className="lg:col-span-2">
          <Chat conversation={actualSelectedConversation} />
        </div>
      </div>
    </div>
  );
};

export default ConversationsPage; 