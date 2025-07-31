import { useState, useEffect, useCallback } from 'react';
import type { BaseConocimiento } from '../types';
import { baseConocimientoAPI } from '../services/api';

export const useKnowledgeBase = () => {
  const [entries, setEntries] = useState<BaseConocimiento[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadEntries = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await baseConocimientoAPI.listarBaseConocimiento();
      setEntries(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading knowledge base');
    } finally {
      setLoading(false);
    }
  }, []);

  const createEntry = useCallback(async (entry: Omit<BaseConocimiento, 'id'>) => {
    try {
      const newEntry = await baseConocimientoAPI.crearEntrada(entry);
      setEntries(prev => [...prev, newEntry]);
      return newEntry;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error creating entry');
      throw err;
    }
  }, []);

  const updateEntry = useCallback(async (id: string, updates: Partial<BaseConocimiento>) => {
    try {
      const updatedEntry = await baseConocimientoAPI.actualizarEntrada(id, updates);
      if (updatedEntry) {
        setEntries(prev =>
          prev.map(entry =>
            entry.id === id ? updatedEntry : entry
          )
        );
      }
      return updatedEntry;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error updating entry');
      throw err;
    }
  }, []);

  const deleteEntry = useCallback(async (id: string) => {
    try {
      const success = await baseConocimientoAPI.eliminarEntrada(id);
      if (success) {
        setEntries(prev => prev.filter(entry => entry.id !== id));
      }
      return success;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error deleting entry');
      throw err;
    }
  }, []);

  const searchEntries = useCallback((searchTerm: string) => {
    return entries.filter((entry) =>
      entry.pregunta_clave.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.respuesta.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [entries]);

  useEffect(() => {
    loadEntries();
  }, [loadEntries]);

  return {
    entries,
    loading,
    error,
    loadEntries,
    createEntry,
    updateEntry,
    deleteEntry,
    searchEntries,
  };
}; 