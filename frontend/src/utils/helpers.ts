/**
 * Verifica se o navegador suporta reconhecimento de voz
 */
export function checkSpeechRecognitionSupport(): boolean {
  const SpeechRecognition =
    (window as any).SpeechRecognition ||
    (window as any).webkitSpeechRecognition;
  return !!SpeechRecognition;
}

/**
 * Cria uma instância do SpeechRecognition se suportado
 */
export function createSpeechRecognition(): SpeechRecognition | null {
  const SpeechRecognition =
    (window as any).SpeechRecognition ||
    (window as any).webkitSpeechRecognition;

  if (!SpeechRecognition) {
    return null;
  }

  return new SpeechRecognition();
}

/**
 * Normaliza um comando de voz para comparação
 */
export function normalizeVoiceCommand(command: string): string {
  return command.toLowerCase().trim();
}

/**
 * Retorna uma promessa que resolve após um delay
 */
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
