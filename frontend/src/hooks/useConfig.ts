import { useState, useEffect } from "react";
import { getConfig, updateConfig } from "../services/api";
import type { Config } from "../types/config";

interface UseConfigReturn {
  config: Config | null;
  loading: boolean;
  error: string | null;
  updateConfigData: (newConfig: Config) => Promise<void>;
  refreshConfig: () => Promise<void>;
}

export function useConfig(): UseConfigReturn {
  const [config, setConfig] = useState<Config | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshConfig = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getConfig();
      setConfig(data);
    } catch (err) {
      console.error("Erro ao buscar config", err);
      setError("Erro ao buscar configurações.");
    } finally {
      setLoading(false);
    }
  };

  const updateConfigData = async (newConfig: Config) => {
    try {
      await updateConfig(newConfig);
      setConfig(newConfig);
      setError(null);
    } catch (err) {
      console.error("Erro ao atualizar configuração:", err);
      throw new Error("Erro ao atualizar configuração.");
    }
  };

  useEffect(() => {
    refreshConfig();
  }, []);

  return {
    config,
    loading,
    error,
    updateConfigData,
    refreshConfig,
  };
}
