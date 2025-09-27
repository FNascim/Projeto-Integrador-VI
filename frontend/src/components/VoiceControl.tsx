interface VoiceControlProps {
  voiceSupported: boolean;
  listening: boolean;
  voiceFeedback: string | null;
  onStartListening: () => void;
}

export default function VoiceControl({
  voiceSupported,
  listening,
  voiceFeedback,
  onStartListening,
}: VoiceControlProps) {
  if (!voiceSupported) {
    return (
      <div className="voice-section">
        <p className="voice-warning">
          ⚠️ Seu navegador não suporta comandos de voz. Tente usar o Google
          Chrome.
        </p>
      </div>
    );
  }

  return (
    <div className="voice-section">
      <button
        type="button"
        className="voice-button"
        onClick={onStartListening}
        disabled={listening}
      >
        {listening ? "🎤 Ouvindo..." : "Ativar Comando de Voz"}
      </button>

      {voiceFeedback && (
        <p
          className={`voice-feedback ${voiceFeedback.startsWith("✅") ? "success" : "error"}`}
        >
          {voiceFeedback}
        </p>
      )}
    </div>
  );
}
