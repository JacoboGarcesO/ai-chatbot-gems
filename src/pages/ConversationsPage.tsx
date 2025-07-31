import React, { useState } from 'react';
import { Activity, Bot, Users, MessageSquare, AlertCircle } from 'lucide-react';
import type { Conversation } from '../types';
import ConversationsList from '../components/ConversationsList';
import Chat from '../components/Chat';
import { useBotStatus } from '../hooks/useBotStatus';

const ConversationsPage: React.FC = () => {
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const { botEnabled, healthStatus, stats, loading: botLoading, error: botError, toggleBot } = useBotStatus();

  const handleToggleBot = async () => {
    await toggleBot(!botEnabled);
  };

  return (
    <div className="h-[calc(100vh-120px)]">
      {/* Status Bar */}
      <div className="mb-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            {/* Bot Status */}
            <div className="flex items-center space-x-2">
              <Bot className={`h-5 w-5 ${botEnabled ? 'text-green-500' : 'text-gray-400'}`} />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Bot: {botEnabled ? 'Active' : 'Inactive'}
              </span>
              <button
                onClick={handleToggleBot}
                disabled={botLoading}
                className={`px-3 py-1 text-xs rounded-md transition-colors ${botEnabled
                  ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 hover:bg-green-200 dark:hover:bg-green-800'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
              >
                {botLoading ? 'Loading...' : botEnabled ? 'Disable' : 'Enable'}
              </button>
            </div>

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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
        {/* Conversations List */}
        <div className="lg:col-span-1">
          <ConversationsList
            onSelectConversation={setSelectedConversation}
            selectedConversationId={selectedConversation?.id}
          />
        </div>

        {/* Chat Area */}
        <div className="lg:col-span-2">
          <Chat conversation={selectedConversation} />
        </div>
      </div>
    </div>
  );
};

export default ConversationsPage; 