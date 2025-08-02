import { useState, useEffect, useCallback } from 'react';
import { healthAPI, statsAPI } from '../services/api';

export const useBotStatus = () => {
  const [botEnabled, setBotEnabled] = useState(false);
  const [healthStatus, setHealthStatus] = useState<string>('unknown');
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastManualUpdate, setLastManualUpdate] = useState<number>(0);

  const loadBotStatus = useCallback(async (forceUpdate = false) => {
    // Si hay una actualización manual reciente (menos de 2 segundos), no sobrescribir
    const timeSinceManualUpdate = Date.now() - lastManualUpdate;
    if (timeSinceManualUpdate < 2000 && !forceUpdate) {
      return;
    }

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
  }, [lastManualUpdate]);

  const toggleBot = useCallback(async (enabled: boolean) => {
    try {
      setError(null);
      // Cambiar el estado inmediatamente (optimistic update)
      setBotEnabled(enabled);
      // Marcar actualización manual para evitar que polling sobrescriba
      setLastManualUpdate(Date.now());
      
      const success = await healthAPI.toggleBot(enabled);
      if (!success) {
        // Si falla, revertir el estado
        setBotEnabled(!enabled);
      }
      return success;
    } catch (err) {
      console.error('Error toggling bot:', err);
      setError(err instanceof Error ? err.message : 'Error toggling bot');
      // Revertir el estado si hay error
      setBotEnabled(!enabled);
      return false;
    }
  }, [setLastManualUpdate]);

  useEffect(() => {
    loadBotStatus();
    
    // Polling cada 5 segundos para mantener sincronizado
    const interval = setInterval(() => {
      loadBotStatus();
    }, 5000);

    return () => clearInterval(interval);
  }, [loadBotStatus]);

  return {
    botEnabled,
    healthStatus,
    stats,
    loading,
    error,
    toggleBot,
    refresh: loadBotStatus,
    setBotEnabled, // Exponer para sincronización directa
    setLastManualUpdate, // Exponer para controlar polling
  };
}; 