import { useEffect, useState } from "react";
import { generateImage } from "./helpers/generateImage.ts";
import { buildInterviewerSystem, type Message } from "./helpers/interviewer.ts";
import {
  analyzeMemory,
  type MemoryAnalysis,
} from "./helpers/memoryAnalysis.ts";
import { generatePrompt } from "./helpers/prompter.ts";

const OLLAMA_URL = "http://localhost:11434/api/chat";

export const Chat = ({
  setImageUrl,
}: {
  setImageUrl: (url: string | null) => void;
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [analysis, setAnalysis] = useState<MemoryAnalysis | null>(null);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [prompt, setPrompt] = useState<string | null>(null);

  const sendMessage = async ({
    isInitial = false,
  }: {
    isInitial?: boolean;
  }) => {
    if (!isInitial && !input.trim()) return;

    const userMessage: Message = { role: "user", content: input };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    const nextAnalysis = await analyzeMemory(updatedMessages);
    setAnalysis(nextAnalysis);

    const systemPrompt = buildInterviewerSystem(nextAnalysis);

    const res = await fetch(OLLAMA_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "llama3.2",
        stream: false,
        messages: [systemPrompt, ...updatedMessages],
      }),
    });

    const data = await res.json();
    const reply: Message = data.message;

    const nextUpdatedMessages = [...updatedMessages, reply];
    setMessages(nextUpdatedMessages);

    if (nextAnalysis.score >= 75) {
      const nextPrompt = await generatePrompt(nextUpdatedMessages);
      setPrompt(nextPrompt);

      const url = await generateImage(nextPrompt);
      setImageUrl(url);
    }

    setLoading(false);
  };

  useEffect(() => {
    if (messages.length === 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      sendMessage({ isInitial: true });
      console.log("Initial message sent");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <div>
        {messages
          .filter((m) => m.role !== "system")
          .map((m, i) => (
            <p key={i}>{m.content}</p>
          ))}
        {loading && <p>...</p>}
      </div>

      {<MemoryScore score={analysis?.score || 0} />}
      <pre>{JSON.stringify(analysis, null, 2)}</pre>
      <pre>{prompt}</pre>

      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && sendMessage({})}
      />
      <button onClick={() => sendMessage({})}>Envoyer</button>
    </div>
  );
};

const MemoryScore = ({ score }: { score: number }) => {
  return <progress value={score} max={100} />;
};
