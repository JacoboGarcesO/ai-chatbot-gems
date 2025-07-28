import React, { useState, useEffect } from 'react';
import { Search, Filter, MessageSquare, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Conversacion } from '../types';
import { conversacionesAPI } from '../services/api';

interface ConversationsListProps {
  onSelectConversation: (conversation: Conversacion) => void;
  selectedConversationId?: string;
}

const ConversationsList: React.FC<ConversationsListProps> = ({
  onSelectConversation,
  selectedConversationId,
}) => {
  const [conversations, setConversations] = useState<Conversacion[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    try {
      setLoading(true);
      const data = await conversacionesAPI.listarConversaciones();
      setConversations(data);
    } catch (error) {
      console.error('Error loading conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredConversations = conversations.filter((conversation) => {
    const matchesSearch = conversation.cliente?.nombre
      .toLowerCase()
      .includes(searchTerm.toLowerCase()) ||
      conversation.ultimo_mensaje?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || conversation.estado === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusIcon = (estado: string) => {
    switch (estado) {
      case 'abierta':
        return <MessageSquare className="h-4 w-4 text-green-500" />;
      case 'cerrada':
        return <CheckCircle className="h-4 w-4 text-gray-500" />;
      case 'pendiente':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-red-500" />;
    }
  };

  const getStatusText = (estado: string) => {
    switch (estado) {
      case 'abierta':
        return 'Abierta';
      case 'cerrada':
        return 'Cerrada';
      case 'pendiente':
        return 'Pendiente';
      default:
        return 'Desconocido';
    }
  };

  const getStatusColor = (estado: string) => {
    switch (estado) {
      case 'abierta':
        return 'bg-green-100 text-green-800';
      case 'cerrada':
        return 'bg-gray-100 text-gray-800';
      case 'pendiente':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-red-100 text-red-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Conversaciones</h2>

        {/* Search and Filters */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Buscar por cliente o mensaje..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Todos los estados</option>
              <option value="abierta">Abierta</option>
              <option value="cerrada">Cerrada</option>
              <option value="pendiente">Pendiente</option>
            </select>
          </div>
        </div>
      </div>

      {/* Conversations List */}
      <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
        {filteredConversations.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <MessageSquare className="mx-auto h-12 w-12 text-gray-300 mb-4" />
            <p>No se encontraron conversaciones</p>
          </div>
        ) : (
          filteredConversations.map((conversation) => (
            <div
              key={conversation.id}
              onClick={() => onSelectConversation(conversation)}
              className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${selectedConversationId === conversation.id ? 'bg-blue-50 border-r-2 border-blue-500' : ''
                }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="text-sm font-medium text-gray-900 truncate">
                      {conversation.cliente?.nombre}
                    </h3>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(conversation.estado)}`}>
                      {getStatusText(conversation.estado)}
                    </span>
                    {conversation.ia_activa && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        IA ON
                      </span>
                    )}
                  </div>

                  <p className="text-sm text-gray-600 truncate mb-2">
                    {conversation.ultimo_mensaje}
                  </p>

                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>
                      {conversation.ultimo_timestamp
                        ? format(new Date(conversation.ultimo_timestamp), 'dd/MM/yyyy HH:mm', { locale: es })
                        : format(new Date(conversation.timestamp_inicio), 'dd/MM/yyyy HH:mm', { locale: es })}
                    </span>

                    {conversation.clasificacion_ia && (
                      <span className="text-xs text-gray-500">
                        {conversation.clasificacion_ia}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ConversationsList; 