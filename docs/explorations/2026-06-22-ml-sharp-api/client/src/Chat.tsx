import { useCallback, useEffect, useState } from "react";
import { analysing, type Analysis } from "./helpers/analysit.ts";
import { imagining } from "./helpers/imaginative.ts";
import { interviewing, type Interview } from "./helpers/interviewer.ts";
import { modeling } from "./helpers/modeler.ts";
import { orchestrating } from "./helpers/orchestrator.ts";
import { prompting } from "./helpers/prompter.ts";
import { Whisper } from "./Whisper.tsx";

export const OLLAMA_URL = "http://localhost:11434/api/chat";
export const MEMORY_SCORE = 75;

export const Chat = ({
  modelUrl,
  setModelUrl,
  setShowModel,
}: {
  modelUrl: string | null;
  setModelUrl: (url: string | null) => void;
  setShowModel: (show: boolean) => void;
}) => {
  const [interview, setInterview] = useState<Interview[]>([]);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [isMemoryCollected, setIsMemoryCollected] = useState(false);

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
      if (!isInitial && !transcribedText.trim()) return;

      const userMessage: Interview = { role: "user", content: transcribedText };

      if (modelUrl && !isInitial) {
        const nextDecision = await orchestrating(transcribedText, interview);
        console.log("Orchestrator decision:", nextDecision);
        if (nextDecision.showModel) {
          setShowModel(true);
          return;
        }
      }

      const updateInterview = [...interview, userMessage];
      setInterview(updateInterview);

      const nextAnalysis = await analysing(updateInterview);
      setAnalysis(nextAnalysis);

      const nextInterview = await interviewing(
        nextAnalysis,
        updateInterview,
        modelUrl,
      );
      const nextUpdatedInterview = [...updateInterview, nextInterview];
      setInterview(nextUpdatedInterview);

      if (nextAnalysis.score >= MEMORY_SCORE && !isMemoryCollected) {
        setIsMemoryCollected(true);

        const nextPrompt = await prompting(nextUpdatedInterview);
        setPrompt(nextPrompt);

        const imageUrl = await imagining(nextPrompt);
        setImageUrl(imageUrl);

        const modelUrl = await modeling(imageUrl);
        setModelUrl(modelUrl);
      }

      setIsLoading(false);
    },
    [interview, modelUrl, isMemoryCollected, setModelUrl, setShowModel],
  );

  useEffect(() => {
    if (interview.length === 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      sendMessage({ isInitial: true, transcribedText: "" });
      console.log("Initial message sent");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRecordStart = useCallback(() => {
    setIsLoading(true);
  }, []);

  const handleTranscribeEnd = useCallback(
    (text: string) => {
      console.log("Transcribed text:", text);

      sendMessage({ transcribedText: text });
    },
    [sendMessage],
  );

  return (
    <div>
      <div>
        <Whisper
          onRecordStart={handleRecordStart}
          onTranscribeEnd={handleTranscribeEnd}
        />
      </div>

      <div>{<MemoryScore score={analysis?.score || 0} />}</div>

      <div>
        {interview
          .filter((m) => m.role !== "system")
          .map((m, i) => (
            <p key={i}>{m.content}</p>
          ))}
        {isLoading && <p>...</p>}
      </div>
    </div>
  );
};

const MemoryScore = ({ score }: { score: number }) => {
  return <progress value={score} max={100} />;
};
