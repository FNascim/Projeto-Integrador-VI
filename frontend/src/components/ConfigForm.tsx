import { useEffect, useRef, useState } from "react";
import { getConfig, updateConfig } from "../services/api";
import type { Config } from "../types/config";

export default function ConfigForm() {
    const [config, setConfig] = useState<Config | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [feedback, setFeedback] = useState<string | null>(null);
    const [feedbackType, setFeedbackType] = useState<"success" | "error" | null>(null);
    const recognitionRef = useRef<SpeechRecognition | null>(null);
    const [voiceSupported, setVoiceSupported] = useState(true);
    const [listening, setListening] = useState(false);
    const [voiceFeedback, setVoiceFeedback] = useState<string | null>(null);

    useEffect(() => {
        getConfig()
            .then((data) => setConfig(data))
            .catch((err) => {
                console.error("Erro ao buscar config", err);
                setError("Erro ao buscar configurações.");
            });
    }, []);

    useEffect(() => {
        const SpeechRecognition =
            (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

        if (!SpeechRecognition) {
            console.warn("Este navegador não suporta reconhecimento de voz.");
            setVoiceSupported(false);
            return;
        }

        setVoiceSupported(true);

        const recognition = new SpeechRecognition();
        recognition.lang = "pt-BR";
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

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

    const startListening = () => {
        recognitionRef.current?.start();
    };

    const handleVoiceCommand = async (command: string) => {
        if (!config) return;

        let newConfig = { ...config };
        let updated = false;

        if (command.includes("modo automático")) {
            newConfig.modo = "auto";
            updated = true;
        } else if (command.includes("ligar luzes")) {
            newConfig.modo = "manual_on";
            updated = true;
        } else if (command.includes("desativar luzes")) {
            newConfig.modo = "manual_off";
            updated = true;
        }

        if (command.includes("movimento on")) {
            newConfig.usar_pir = true;
            updated = true;
        } else if (command.includes("movimento off")) {
            newConfig.usar_pir = false;
            updated = true;
        }

        if (command.includes("luminosidade on")) {
            newConfig.usar_ldr = true;
            updated = true;
        } else if (command.includes("luminosidade off")) {
            newConfig.usar_ldr = false;
            updated = true;
        }

        if (!updated) {
            setVoiceFeedback("❓ Comando de voz não reconhecido.");
            return;
        }

        setConfig(newConfig);
        setVoiceFeedback("✅ Comando reconhecido! Enviando configuração...");

        try {
            await updateConfig(newConfig);
            setVoiceFeedback("✅ Configuração atualizada com sucesso!");
        } catch (err) {
            console.error("Erro ao atualizar via comando de voz:", err);
            setVoiceFeedback("❌ Erro ao atualizar configuração.");
        }

        setTimeout(() => {
            setVoiceFeedback(null);
        }, 3000);
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const target = e.target;
        const { name, value, type } = target;
        if (!config) return;

        setConfig({
            ...config,
            [name]: type === "checkbox" && target instanceof HTMLInputElement
                ? target.checked
                : value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!config) return;
        try {
            await updateConfig(config);
            setError(null);
            setFeedback("Configuração atualizada com sucesso!");
            setFeedbackType("success");
            setTimeout(() => {
                setFeedback(null);
                setFeedbackType(null);
            }, 3000);
        } catch (err) {
            console.error("Erro ao atualizar configuração:", err);
            setFeedback("Erro ao atualizar configuração.");
            setFeedbackType("error");
            setTimeout(() => {
                setFeedback(null);
                setFeedbackType(null);
            }, 3000);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            {error && <div style={{ color: "red", marginBottom: "1em" }}>{error}</div>}
            {feedback && (
                <div style={{ marginBottom: "1em", color: feedbackType === "success" ? "green" : "red" }}>
                    {feedback}
                </div>
            )}

            <br /><br />
            {!voiceSupported && (
                <p style={{ color: "orange" }}>
                    ⚠️ Seu navegador não suporta comandos de voz. Tente usar o Google Chrome.
                </p>
            )}

            {voiceSupported && (
                <div style={{ marginBottom: "1em" }}>
                    <button type="button" onClick={startListening} disabled={listening}>
                        {listening ? "🎤 Ouvindo..." : "Ativar Comando de Voz"}
                    </button>

                    {voiceFeedback && (
                        <p style={{ color: voiceFeedback.startsWith("✅") ? "green" : "red" }}>
                            {voiceFeedback}
                        </p>
                    )}
                </div>
            )}


            <label>
                Modo:
                <select name="modo" value={config?.modo ?? ""} onChange={handleChange}>
                    <option value="auto">Automático</option>
                    <option value="manual_on">Manual ON</option>
                    <option value="manual_off">Manual OFF</option>
                </select>
            </label>

            <br />

            <label>
                <input
                    type="checkbox"
                    name="usar_pir"
                    checked={!!config?.usar_pir}
                    onChange={handleChange}
                />
                Usar sensor de movimento (PIR)
            </label>

            <br />

            <label>
                <input
                    type="checkbox"
                    name="usar_ldr"
                    checked={!!config?.usar_ldr}
                    onChange={handleChange}
                />
                Usar sensor de luminosidade (LDR)
            </label>

            <br />

            <label>
                <input
                    type="checkbox"
                    name="usar_horario"
                    checked={!!config?.usar_horario}
                    onChange={handleChange}
                />
                Usar horário programado
            </label>

            <br />

            <label>
                Horário Início:
                <input
                    type="time"
                    name="horario_inicio"
                    value={config?.horario_inicio ?? ""}
                    onChange={handleChange}
                />
            </label>

            <br />

            <label>
                Horário Fim:
                <input
                    type="time"
                    name="horario_fim"
                    value={config?.horario_fim ?? ""}
                    onChange={handleChange}
                />
            </label>

            <br />
            <button type="submit">Salvar</button>
        </form>
    );
}
