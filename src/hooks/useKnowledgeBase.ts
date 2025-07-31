import { useState, useEffect, useCallback } from 'react';
import type { KnowledgeBase } from '../types';
import { knowledgeBaseAPI } from '../services/api';

export const useKnowledgeBase = () => {
  const [knowledgeBase, setKnowledgeBase] = useState<KnowledgeBase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadKnowledgeBase = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await knowledgeBaseAPI.listKnowledgeBase();
      setKnowledgeBase(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading knowledge base');
    } finally {
      setLoading(false);
    }
  }, []);

  const createEntry = useCallback(async (entry: Omit<KnowledgeBase, 'id'>) => {
    try {
      const newEntry = await knowledgeBaseAPI.createEntry(entry);
      setKnowledgeBase(prev => [...prev, newEntry]);
      return newEntry;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error creating entry');
      throw err;
    }
  }, []);

  const updateEntry = useCallback(async (id: string, entry: Partial<KnowledgeBase>) => {
    try {
      const updatedEntry = await knowledgeBaseAPI.updateEntry(id, entry);
      if (updatedEntry) {
        setKnowledgeBase(prev =>
          prev.map(item => item.id === id ? updatedEntry : item)
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
      const success = await knowledgeBaseAPI.deleteEntry(id);
      if (success) {
        setKnowledgeBase(prev => prev.filter(item => item.id !== id));
      }
      return success;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error deleting entry');
      throw err;
    }
  }, []);

  useEffect(() => {
    loadKnowledgeBase();
  }, [loadKnowledgeBase]);

  return {
    knowledgeBase,
    loading,
    error,
    loadKnowledgeBase,
    createEntry,
    updateEntry,
    deleteEntry,
  };
}; 