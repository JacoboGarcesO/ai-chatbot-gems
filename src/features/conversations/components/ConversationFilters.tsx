import React from 'react';
import { Search, Filter } from 'lucide-react';
import Input from '../../../components/ui/Input';

interface ConversationFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
}

const ConversationFilters: React.FC<ConversationFiltersProps> = ({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
}) => {
  return (
    <div className="space-y-3">
      <Input
        variant="search"
        placeholder="Buscar por cliente o mensaje..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        icon={<Search className="h-4 w-4" />}
      />

      <div className="flex items-center space-x-2">
        <Filter className="h-4 w-4 text-gray-400 dark:text-gray-500" />
        <select
          value={statusFilter}
          onChange={(e) => onStatusFilterChange(e.target.value)}
          className="border border-gray-300 dark:border-dark-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent bg-white dark:bg-dark-700 text-gray-900 dark:text-gray-100"
        >
          <option value="all">Todos los estados</option>
          <option value="abierta">Abierta</option>
          <option value="cerrada">Cerrada</option>
          <option value="pendiente">Pendiente</option>
        </select>
      </div>
    </div>
  );
};

export default ConversationFilters; 