import { useState, useEffect, useCallback } from 'react';
import { healthAPI, statsAPI } from '../services/api';

export const useBotStatus = () => {
  const [botEnabled, setBotEnabled] = useState(false);
  const [healthStatus, setHealthStatus] = useState<string>('unknown');
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadBotStatus = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [botStatus, health, statistics] = await Promise.all([
        healthAPI.getBotStatus(),
        healthAPI.getHealthStatus(),
        statsAPI.getStats(),
      ]);

      setBotEnabled(botStatus.enabled);
      setHealthStatus(health.status);
      setStats(statistics);
    } catch (err) {
      console.error('Error loading bot status:', err);
      setError(err instanceof Error ? err.message : 'Error loading bot status');
    } finally {
      setLoading(false);
    }
  }, []);

  const toggleBot = useCallback(async (enabled: boolean) => {
    try {
      setError(null);
      const success = await healthAPI.toggleBot(enabled);
      if (success) {
        setBotEnabled(enabled);
      }
      return success;
    } catch (err) {
      console.error('Error toggling bot:', err);
      setError(err instanceof Error ? err.message : 'Error toggling bot');
      return false;
    }
  }, []);

  useEffect(() => {
    loadBotStatus();
  }, [loadBotStatus]);

  return {
    botEnabled,
    healthStatus,
    stats,
    loading,
    error,
    toggleBot,
    refresh: loadBotStatus,
  };
}; 