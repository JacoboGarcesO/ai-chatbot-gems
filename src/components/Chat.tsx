import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, ToggleLeft, ToggleRight, FileText, Tag, MessageSquare } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Conversacion, Mensaje } from '../types';
import { conversacionesAPI } from '../services/api';

interface ChatProps {
  conversation: Conversacion | null;
}

const Chat: React.FC<ChatProps> = ({ conversation }) => {
  const [messages, setMessages] = useState<Mensaje[]>([]);
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
      const data = await conversacionesAPI.obtenerHistorialMensajes(conversation.id);
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
      const sentMessage = await conversacionesAPI.enviarMensajeHumano(conversation.id, newMessage.trim());
      setMessages(prev => [...prev, sentMessage]);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSending(false);
    }
  };

  const handleToggleIA = async () => {
    if (!conversation) return;

    try {
      const success = await conversacionesAPI.toggleIA(conversation.id, !conversation.ia_activa);
      if (success) {
        // Update the conversation object
        conversation.ia_activa = !conversation.ia_activa;
        // Force re-render
        setMessages([...messages]);
      }
    } catch (error) {
      console.error('Error toggling IA:', error);
    }
  };

  const getMessageIcon = (tipoRemitente: string) => {
    switch (tipoRemitente) {
      case 'bot':
        return <Bot className="h-5 w-5 text-blue-500" />;
      case 'agente_humano':
        return <User className="h-5 w-5 text-green-500" />;
      case 'cliente_final':
        return <User className="h-5 w-5 text-gray-500" />;
      default:
        return <User className="h-5 w-5 text-gray-400" />;
    }
  };

  const getMessageAlignment = (tipoRemitente: string) => {
    return tipoRemitente === 'cliente_final' ? 'justify-start' : 'justify-end';
  };

  const getMessageBubbleStyle = (tipoRemitente: string) => {
    switch (tipoRemitente) {
      case 'bot':
        return 'bg-blue-100 text-blue-900';
      case 'agente_humano':
        return 'bg-green-100 text-green-900';
      case 'cliente_final':
        return 'bg-gray-100 text-gray-900';
      default:
        return 'bg-gray-100 text-gray-900';
    }
  };

  if (!conversation) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-50">
        <div className="text-center">
          <FileText className="mx-auto h-12 w-12 text-gray-300 mb-4" />
          <p className="text-gray-500">Selecciona una conversación para comenzar</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Chat Header */}
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white font-medium">
                {conversation.cliente?.nombre.charAt(0)}
              </span>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">{conversation.cliente?.nombre}</h3>
              <p className="text-sm text-gray-500">{conversation.cliente?.telefono}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* IA Toggle */}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">IA</span>
              <button
                onClick={handleToggleIA}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${conversation.ia_activa ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${conversation.ia_activa ? 'translate-x-6' : 'translate-x-1'
                    }`}
                />
              </button>
              <span className="text-sm text-gray-600">
                {conversation.ia_activa ? 'ON' : 'OFF'}
              </span>
            </div>

            {/* Status Badge */}
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${conversation.estado === 'abierta' ? 'bg-green-100 text-green-800' :
                conversation.estado === 'cerrada' ? 'bg-gray-100 text-gray-800' :
                  'bg-yellow-100 text-yellow-800'
              }`}>
              {conversation.estado === 'abierta' ? 'Abierta' :
                conversation.estado === 'cerrada' ? 'Cerrada' : 'Pendiente'}
            </span>
          </div>
        </div>

        {/* AI Classification and Summary */}
        {(conversation.clasificacion_ia || conversation.resumen_ia) && (
          <div className="mt-3 p-3 bg-blue-50 rounded-lg">
            {conversation.clasificacion_ia && (
              <div className="flex items-center space-x-2 mb-2">
                <Tag className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-medium text-blue-900">
                  Clasificación: {conversation.clasificacion_ia}
                </span>
              </div>
            )}
            {conversation.resumen_ia && (
              <div className="flex items-start space-x-2">
                <FileText className="h-4 w-4 text-blue-500 mt-0.5" />
                <p className="text-sm text-blue-800">{conversation.resumen_ia}</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {loading ? (
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <MessageSquare className="mx-auto h-12 w-12 text-gray-300 mb-4" />
            <p>No hay mensajes en esta conversación</p>
          </div>
        ) : (
          messages.map((message) => (
            <div key={message.id} className={`flex ${getMessageAlignment(message.tipo_remitente)}`}>
              <div className={`flex items-start space-x-2 max-w-xs lg:max-w-md ${message.tipo_remitente === 'cliente_final' ? 'flex-row' : 'flex-row-reverse space-x-reverse'
                }`}>
                <div className="flex-shrink-0">
                  {getMessageIcon(message.tipo_remitente)}
                </div>
                <div className={`px-3 py-2 rounded-lg ${getMessageBubbleStyle(message.tipo_remitente)}`}>
                  <p className="text-sm">{message.contenido}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {format(new Date(message.timestamp), 'HH:mm', { locale: es })}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder={conversation.ia_activa ? "El bot está respondiendo automáticamente..." : "Escribe un mensaje..."}
            disabled={conversation.ia_activa || sending}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500"
          />
          <button
            onClick={handleSendMessage}
            disabled={!newMessage.trim() || conversation.ia_activa || sending}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
        {conversation.ia_activa && (
          <p className="text-xs text-gray-500 mt-2">
            💡 La IA está activa. Cambia a modo manual para enviar mensajes.
          </p>
        )}
      </div>
    </div>
  );
};

export default Chat; 