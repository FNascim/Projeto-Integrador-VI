export const VOICE_COMMANDS = {
  MODO_AUTOMATICO: "modo automático",
  LIGAR_LUZES: "ligar luzes",
  DESATIVAR_LUZES: "desativar luzes",
  MOVIMENTO_ON: "movimento on",
  MOVIMENTO_OFF: "movimento off",
  LUMINOSIDADE_ON: "luminosidade on",
  LUMINOSIDADE_OFF: "luminosidade off",
} as const;

export const FEEDBACK_MESSAGES = {
  COMMAND_NOT_RECOGNIZED: "❓ Comando de voz não reconhecido.",
  COMMAND_RECOGNIZED: "✅ Comando reconhecido! Enviando configuração...",
  SUCCESS: "✅ Configuração atualizada com sucesso!",
  ERROR: "❌ Erro ao atualizar configuração.",
} as const;

export const CONFIG_OPTIONS = [
  { value: "auto", label: "Automático" },
  { value: "manual_on", label: "Manual ON" },
  { value: "manual_off", label: "Manual OFF" },
] as const;

export const SPEECH_CONFIG = {
  LANGUAGE: "pt-BR",
  INTERIM_RESULTS: false,
  MAX_ALTERNATIVES: 1,
} as const;
