// Génère un prompt pour l'API de génération d'image à partir d'un souvenir.

import type { Interview } from "./interviewer";

const PROMPTER_SYSTEM = {
  role: "system",
  content: `
    Tu es un prompteur d'images. 
    Tu reçois en entrée une conversation entre un utilisateur et une IA. 
    Cette conversation contient des indices sur un souvenir que l'utilisateur souhaite visualiser.
    Base toi sur cette conversation pour  générer un prompt détaillé pour une IA de génération d'image.
    Le prompt doit être en anglais, précis, et inclure des détails visuels, des couleurs, des textures, des émotions, et tout ce qui peut aider à créer une image fidèle au souvenir.
    Le prompt doit être concis mais riche en détails.
  `,
};

export const prompting = async (conversation: Interview[]): Promise<string> => {
  const res = await fetch("http://localhost:11434/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "llama3.2",
      stream: false,
      messages: [
        PROMPTER_SYSTEM,
        {
          role: "user",
          content:
            `Voici la conversation :\n` +
            conversation
              .filter((m) => m.role !== "system")
              .map((m) => `${m.role}: ${m.content}`)
              .join("\n") +
            `\n\nGénère maintenant le prompt image.`,
        },
      ],
    }),
  });

  const data = await res.json();
  console.log("Prompt generation response:", data);

  return data.message.content;
};
