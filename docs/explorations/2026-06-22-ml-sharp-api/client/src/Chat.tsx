import { useEffect, useState } from "react";
import {
  analyzeMemory,
  type MemoryAnalysis,
  type Message,
} from "./helpers/memoryAnalysis.ts";

const OLLAMA_URL = "http://localhost:11434/api/chat";

const buildInterviewerSystem = (analysis: MemoryAnalysis): Message => ({
  role: "system",
  content:
    `
    Commence par un message de bienvenue.

    Tu es un interviewer bienveillant. Ton rôle est de
    poser des questions douces et ouvertes pour aider
    l'utilisateur à faire émerger un souvenir précis.

    Tes questions doivent être courte, tout comme tes réponses. 

    Pose une seule question à la fois.` +
    (analysis.missing.length > 0
      ? `\n\nUn analyste a identifié que ces éléments manquent
    pour visualiser le souvenir. Oriente subtilement
    tes questions vers ces points manquants :
    ${analysis.missing.map((m) => `- ${m}`).join("\n")}`
      : "") +
    `
      
    Si le score est de 75% ou plus, tu peux dire à l'utilisateur que tu as assez d'informations pour générer une image, et lui demander s'il veut que tu le fasses.
    Voici le score : ${analysis.score}
    `,
});

export const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [analysis, setAnalysis] = useState<MemoryAnalysis | null>(null);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

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

    setMessages([...updatedMessages, reply]);
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
