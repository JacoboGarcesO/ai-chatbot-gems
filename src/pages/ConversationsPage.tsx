import React, { useState } from 'react';
import type { Conversacion } from '../types';
import ConversationsList from '../features/conversations/components/ConversationsList';
import Chat from '../features/chat/components/Chat';

const ConversationsPage: React.FC = () => {
  const [selectedConversation, setSelectedConversation] = useState<Conversacion | null>(null);

  return (
    <div className="h-[calc(100vh-120px)]">
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