import { useState, useEffect, useRef } from "react";
import {
  VOICE_COMMANDS,
  FEEDBACK_MESSAGES,
  SPEECH_CONFIG,
} from "../constants/appConstants";
import type { Config } from "../types/config";

interface UseVoiceControlReturn {
  voiceSupported: boolean;
  listening: boolean;
  voiceFeedback: string | null;
  startListening: () => void;
}

export function useVoiceControl(
  config: Config | null,
  onConfigUpdate: (config: Config) => Promise<void>
): UseVoiceControlReturn {
  const [voiceSupported, setVoiceSupported] = useState(true);
  const [listening, setListening] = useState(false);
  const [voiceFeedback, setVoiceFeedback] = useState<string | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.warn("Este navegador não suporta reconhecimento de voz.");
      setVoiceSupported(false);
      return;
    }

    setVoiceSupported(true);

    const recognition = new SpeechRecognition();
    recognition.lang = SPEECH_CONFIG.LANGUAGE;
    recognition.interimResults = SPEECH_CONFIG.INTERIM_RESULTS;
    recognition.maxAlternatives = SPEECH_CONFIG.MAX_ALTERNATIVES;

    recognition.onstart = () => {
      setListening(true);
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const command = event.results[0][0].transcript.toLowerCase().trim();
      console.log("Comando de voz reconhecido:", command);
      handleVoiceCommand(command);
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error("Erro no reconhecimento de voz:", event.error);
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognitionRef.current = recognition;
  }, [config]);

  const handleVoiceCommand = async (command: string) => {
    if (!config) return;

    let newConfig = { ...config };
    let updated = false;

    if (command.includes(VOICE_COMMANDS.MODO_AUTOMATICO)) {
      newConfig.modo = "auto";
      updated = true;
    } else if (command.includes(VOICE_COMMANDS.LIGAR_LUZES)) {
      newConfig.modo = "manual_on";
      updated = true;
    } else if (command.includes(VOICE_COMMANDS.DESATIVAR_LUZES)) {
      newConfig.modo = "manual_off";
      updated = true;
    }

    if (command.includes(VOICE_COMMANDS.MOVIMENTO_ON)) {
      newConfig.usar_pir = true;
      updated = true;
    } else if (command.includes(VOICE_COMMANDS.MOVIMENTO_OFF)) {
      newConfig.usar_pir = false;
      updated = true;
    }

    if (command.includes(VOICE_COMMANDS.LUMINOSIDADE_ON)) {
      newConfig.usar_ldr = true;
      updated = true;
    } else if (command.includes(VOICE_COMMANDS.LUMINOSIDADE_OFF)) {
      newConfig.usar_ldr = false;
      updated = true;
    }

    if (!updated) {
      setVoiceFeedback(FEEDBACK_MESSAGES.COMMAND_NOT_RECOGNIZED);
      setTimeout(() => setVoiceFeedback(null), 3000);
      return;
    }

    setVoiceFeedback(FEEDBACK_MESSAGES.COMMAND_RECOGNIZED);

    try {
      await onConfigUpdate(newConfig);
      setVoiceFeedback(FEEDBACK_MESSAGES.SUCCESS);
    } catch (err) {
      console.error("Erro ao atualizar via comando de voz:", err);
      setVoiceFeedback(FEEDBACK_MESSAGES.ERROR);
    }

    setTimeout(() => {
      setVoiceFeedback(null);
    }, 3000);
  };

  const startListening = () => {
    recognitionRef.current?.start();
  };

  return {
    voiceSupported,
    listening,
    voiceFeedback,
    startListening,
  };
}
