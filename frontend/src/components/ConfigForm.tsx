import { useState, useEffect } from "react";
import { useConfig } from "../hooks/useConfig";
import { useVoiceControl } from "../hooks/useVoiceControl";
import { useFeedback } from "../hooks/useFeedback";
import VoiceControl from "./VoiceControl";
import FeedbackMessage from "./FeedbackMessage";
import ConfigFormFields from "./ConfigFormFields";
import type { Config } from "../types/config";
import "./ConfigForm.css";

export default function ConfigForm() {
  const { config, loading, error, updateConfigData } = useConfig();
  const { feedback, feedbackType, showFeedback } = useFeedback();
  const [localConfig, setLocalConfig] = useState<Config | null>(null);

  // Sincroniza config local quando o config global muda
  useEffect(() => {
    if (config && !localConfig) {
      setLocalConfig(config);
    }
  }, [config, localConfig]);

  const { voiceSupported, listening, voiceFeedback, startListening } =
    useVoiceControl(localConfig || config, async newConfig => {
      await updateConfigData(newConfig);
      setLocalConfig(newConfig);
      showFeedback("Configuração atualizada com sucesso!", "success");
    });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const target = e.target;
    const { name, value, type } = target;
    if (!localConfig && !config) return;

    const currentConfig = localConfig || config!;

    const updatedConfig = {
      ...currentConfig,
      [name]:
        type === "checkbox" && target instanceof HTMLInputElement
          ? target.checked
          : value,
    };

    setLocalConfig(updatedConfig);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!localConfig) return;

    try {
      await updateConfigData(localConfig);
      showFeedback("Configuração atualizada com sucesso!", "success");
    } catch (err) {
      showFeedback("Erro ao atualizar configuração.", "error");
    }
  };

  if (loading) {
    return <div className="config-form">Carregando configurações...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="config-form">
      {error && <div className="error-message">{error}</div>}

      {feedback && feedbackType && (
        <FeedbackMessage message={feedback} type={feedbackType} />
      )}

      <VoiceControl
        voiceSupported={voiceSupported}
        listening={listening}
        voiceFeedback={voiceFeedback}
        onStartListening={startListening}
      />

      <ConfigFormFields
        config={localConfig || config}
        onChange={handleChange}
      />

      <button type="submit" className="submit-button">
        Salvar Configurações
      </button>
    </form>
  );
}
