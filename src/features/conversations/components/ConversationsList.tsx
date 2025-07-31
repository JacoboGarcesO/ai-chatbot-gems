import React, { useState } from 'react';
import { MessageSquare } from 'lucide-react';
import type { Conversation } from '../../../types';
import { useConversations } from '../../../hooks/useConversations';
import { Card, CardHeader, CardBody } from '../../../components/ui/Card';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';
import ConversationItem from './ConversationItem';
import ConversationFilters from './ConversationFilters';

interface ConversationsListProps {
  onSelectConversation: (conversation: Conversation) => void;
  selectedConversationId?: string;
}

const ConversationsList: React.FC<ConversationsListProps> = ({
  onSelectConversation,
  selectedConversationId,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const { conversations, loading, error } = useConversations({
    filters: statusFilter !== 'all' ? { status: statusFilter } : undefined,
  });

  const filteredConversations = conversations.filter((conversation) => {
    const matchesSearch = conversation.customer?.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase()) ||
      conversation.last_message?.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch;
  });

  if (loading) {
    return (
      <Card>
        <CardBody>
          <LoadingSpinner size="lg" />
        </CardBody>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardBody>
          <div className="text-center text-red-600 dark:text-red-400">
            <p>Error: {error}</p>
          </div>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Conversaciones</h2>
        <ConversationFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
        />
      </CardHeader>

      <CardBody className="p-0">
        <div className="divide-y divide-gray-200 dark:divide-dark-700 max-h-96 overflow-y-auto">
          {filteredConversations.length === 0 ? (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
              <MessageSquare className="mx-auto h-12 w-12 text-gray-300 dark:text-gray-600 mb-4" />
              <p>No se encontraron conversaciones</p>
            </div>
          ) : (
            filteredConversations.map((conversation) => (
              <ConversationItem
                key={conversation.id}
                conversation={conversation}
                isSelected={selectedConversationId === conversation.id}
                onClick={onSelectConversation}
              />
            ))
          )}
        </div>
      </CardBody>
    </Card>
  );
};

export default ConversationsList; 