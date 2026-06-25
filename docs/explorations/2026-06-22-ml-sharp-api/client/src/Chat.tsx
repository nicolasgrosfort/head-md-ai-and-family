import { useCallback, useEffect, useRef, useState } from "react";
import { analysing, type Analysis } from "./helpers/analysit.ts";
import { imagining } from "./helpers/imaginative.ts";
import { interviewing, type Interview } from "./helpers/interviewer.ts";
import { modeling } from "./helpers/modeler.ts";
import { orchestrating } from "./helpers/orchestrator.ts";
import { prompting } from "./helpers/prompter.ts";
import { Whisper } from "./Whisper.tsx";

export const OLLAMA_URL = "http://localhost:11434/api/chat";
export const MEMORY_COMPLETION = 80;

export const Chat = ({
  modelUrl,
  setModelUrl,
  setShowModel,
}: {
  modelUrl: string | null;
  setModelUrl: (url: string | null) => void;
  setShowModel: (show: boolean) => void;
}) => {
  const initialized = useRef(false);

  const [interview, setInterview] = useState<Interview[]>([]);

  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isMemoryCollected, setIsMemoryCollected] = useState(false);

  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [, setPrompt] = useState<string | null>(null);
  const [, setImageUrl] = useState<string | null>(null);

  const sendMessage = useCallback(
    async ({
      isInitial = false,
      transcribedText,
    }: {
      isInitial?: boolean;
      transcribedText: string;
    }) => {
      if (!isInitial && !transcribedText?.trim()) return;

      console.info("States", { modelUrl }, { isMemoryCollected });

      const userMessage: Interview = { role: "user", content: transcribedText };

      if (modelUrl && !isInitial) {
        const nextDecision = await orchestrating(transcribedText, interview);
        if (nextDecision.showModel) {
          setShowModel(true);
          return;
        }
      }

      const updateInterview = [...interview, userMessage];
      setInterview(updateInterview);

      const nextAnalysis = await analysing(updateInterview, analysis);
      setAnalysis(nextAnalysis);

      const nextInterview = await interviewing(
        nextAnalysis,
        updateInterview,
        modelUrl,
      );
      const nextUpdatedInterview = [...updateInterview, nextInterview];
      setInterview(nextUpdatedInterview);

      if (nextAnalysis.completion >= MEMORY_COMPLETION && !isMemoryCollected) {
        setIsMemoryCollected(true);

        const nextPrompt = await prompting(nextUpdatedInterview, nextAnalysis);
        setPrompt(nextPrompt);

        const imageUrl = await imagining(nextPrompt);
        setImageUrl(imageUrl);

        const modelUrl = await modeling(imageUrl);
        setModelUrl(modelUrl);
      }

      setIsLoading(false);
    },
    [
      interview,
      modelUrl,
      isMemoryCollected,
      setModelUrl,
      setShowModel,
      analysis,
    ],
  );

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    sendMessage({ isInitial: true, transcribedText: "" });
  });

  const handleRecordStart = useCallback(() => {
    setIsLoading(true);
    setIsRecording(true);
  }, []);

  const handleTranscribeEnd = useCallback(
    (text: string) => {
      sendMessage({ transcribedText: text });
    },
    [sendMessage],
  );

  const handleRecordEnd = useCallback(() => {
    setIsRecording(false);
  }, []);

  const lastAssistantMessage = interview
    .filter((m) => m.role === "assistant")
    .at(-1);

  return (
    <div
      style={{
        maxWidth: "500px",
        fontSize: "1.8rem",
        textAlign: "center",
        fontFamily: "monospace",
      }}
    >
      <div>
        <Whisper
          onRecordStart={handleRecordStart}
          onTranscribeEnd={handleTranscribeEnd}
          onRecordEnd={handleRecordEnd}
        />
      </div>

      <div>
        <p
          style={{
            fontSize: "1rem",
            position: "absolute",
            bottom: "20px",
            left: "20px",
          }}
        >
          {isRecording ? "🔴" : isLoading ? "⏳" : null}
        </p>
        <p
          style={{
            fontSize: "1rem",
            position: "absolute",
            bottom: "20px",
            right: "20px",
          }}
        >
          {isMemoryCollected && "📝"}
          {modelUrl && "🤖"}
        </p>
        <p>{lastAssistantMessage?.content}</p>
      </div>
    </div>
  );
};
