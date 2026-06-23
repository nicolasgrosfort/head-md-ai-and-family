import { useEffect, useState } from "react";
import { analysing, type Analysis } from "./helpers/analysit.ts";
import { imagining } from "./helpers/imaginative.ts";
import { interviewing, type Interview } from "./helpers/interviewer.ts";
import { modeling } from "./helpers/modeler.ts";
import { prompting } from "./helpers/prompter.ts";

export const OLLAMA_URL = "http://localhost:11434/api/chat";
export const MEMORY_SCORE = 75;

export const Chat = ({
  setModelUrl,
}: {
  setModelUrl: (url: string | null) => void;
}) => {
  const [input, setInput] = useState("");

  const [interview, setInterview] = useState<Interview[]>([]);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);

  const [isLoading, setIsLoading] = useState(false);

  const [, setPrompt] = useState<string | null>(null);
  const [, setImageUrl] = useState<string | null>(null);

  const sendMessage = async ({
    isInitial = false,
  }: {
    isInitial?: boolean;
  }) => {
    if (!isInitial && !input.trim()) return;

    setIsLoading(true);

    const userMessage: Interview = { role: "user", content: input };
    setInput("");

    const updateInterview = [...interview, userMessage];
    setInterview(updateInterview);

    const nextAnalysis = await analysing(updateInterview);
    setAnalysis(nextAnalysis);

    const nextInterview = await interviewing(nextAnalysis, updateInterview);
    const nextUpdatedInterview = [...updateInterview, nextInterview];
    setInterview(nextUpdatedInterview);

    if (nextAnalysis.score >= MEMORY_SCORE) {
      const nextPrompt = await prompting(nextUpdatedInterview);
      setPrompt(nextPrompt);

      const imageUrl = await imagining(nextPrompt);
      setImageUrl(imageUrl);

      const modelUrl = await modeling(imageUrl);
      setModelUrl(modelUrl);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    if (interview.length === 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      sendMessage({ isInitial: true });
      console.log("Initial message sent");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <div>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage({})}
        />
        <button onClick={() => sendMessage({})}>Envoyer</button>
      </div>

      <div>
        {<MemoryScore score={analysis?.score || 0} />}
        {/* <pre>{JSON.stringify(analysis, null, 2)}</pre>
        <pre>{prompt}</pre> */}
      </div>

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
