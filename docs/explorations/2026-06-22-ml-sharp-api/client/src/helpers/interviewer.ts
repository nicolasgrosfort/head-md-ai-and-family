import { MEMORY_SCORE, OLLAMA_URL } from "../Chat.tsx";
import type { MemoryAnalysis } from "./memoryAnalysis.ts";

export type Message = {
  role: "user" | "assistant" | "system";
  content: string;
};

export const buildInterviewerSystem = (analysis: MemoryAnalysis): Message => {
  const memoryCollected = analysis.score >= MEMORY_SCORE;

  return {
    role: "system",
    content: memoryCollected
      ? `
        Tu as fini de collecter les informations sur le souvenir de l'utilisateur.
        N'en demande plus.

        Voici ce que tu sais du souvenir :
        ${JSON.stringify(analysis, null, 2)}

        Continue la conversation naturellement en t'appuyant sur ces éléments —
        tu peux faire des liens, exprimer de l'empathie, partager une réflexion —
        mais sans poser de nouvelles questions sur le souvenir.
      `
      : `
        Commence par un message de bienvenue.

        Tu es un interviewer bienveillant. Ton rôle est de
        poser des questions douces et ouvertes pour aider
        l'utilisateur à faire émerger un souvenir précis.

        Tes questions doivent être courtes, tout comme tes réponses.

        Pose une seule question à la fois.` +
        (analysis.missing.length > 0
          ? `\n\n
        
        Un analyste a identifié que ces éléments manquent
        pour visualiser le souvenir. Oriente subtilement
        tes questions vers ces points manquants :
        ${analysis.missing.map((m) => `- ${m}`).join("\n")}`
          : "") +
        `
      `,
  };
};

export const generateInterview = async (
  messages: Message[],
): Promise<Message> => {
  const res = await fetch(OLLAMA_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "llama3.2",
      stream: false,
      messages: messages,
    }),
  });

  const data = await res.json();
  return data.message;
};
