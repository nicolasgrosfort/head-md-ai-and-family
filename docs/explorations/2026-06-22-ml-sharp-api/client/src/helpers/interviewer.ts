import type { MemoryAnalysis } from "./memoryAnalysis.ts";

export type Message = {
  role: "user" | "assistant" | "system";
  content: string;
};

export const buildInterviewerSystem = (analysis: MemoryAnalysis): Message => ({
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
      
    Si le score est de 75 ou plus, tu peux dire à l'utilisateur que tu as assez d'informations pour générer une image, et lui demander s'il veut que tu le fasses.
    Voici le score : ${analysis.score}
    `,
});
