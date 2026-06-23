import type { Interview } from "./interviewer";

export type Analysis = {
  score: number;
  missing: string[];
};

const ANALYSIS_SCHEMA = {
  type: "object",
  properties: {
    score: { type: "number", minimum: 0, maximum: 100 },
    missing: { type: "array", items: { type: "string" } },
  },
  required: ["score", "missing"],
};

const SYSTEM_ANALYSTE = {
  role: "system",
  content: `
    Tu analyses une conversation entre un utilisateur et une IA.

    Ton objectif est d'évaluer si cette conversation contient suffisamment d'éléments concrets pour générer une image représentant un souvenir.

    Si la conversation est vide, presque vide, ou ne contient aucun souvenir identifiable, retourne obligatoirement un score de 0 et une liste d'éléments manquants.

    Tu dois estimer la "visualisabilité" du souvenir : est-ce qu'une scène claire peut être imaginée et transformée en image ?

    Évalue notamment la présence ou l'absence de :
    - lieu ou environnement
    - moment ou époque
    - lumière
    - couleurs
    - personnages
    - objets importants
    - actions ou situation
    - ambiance émotionnelle
    - sons
    - odeurs
    - sensations physiques
    - détails sensoriels ou visuels distinctifs

    Attribue un score de 0 à 100 :
    - 0-24 : aucun souvenir identifiable ou aucune scène visuelle exploitable
    - 25-49 : souvenir très vague, avec très peu d'éléments concrets
    - 50-74 : scène partiellement identifiable, mais encore trop floue pour générer une image fidèle
    - 75-99 : scène assez claire, avec quelques éléments importants manquants
    - 100 : scène riche, précise et suffisamment complète pour générer une image cohérente

    Le score ne doit pas simplement compter les catégories présentes. 
    Il doit refléter la capacité réelle à reconstruire une scène visuelle.

    Retourne uniquement un JSON valide respectant ce format :

    {
      "score": 0,
      "missing": []
    }

    Dans "missing", liste uniquement les éléments importants qui manquent pour améliorer la génération d'image.
    Si rien d'important ne manque, retourne un tableau vide.

    Utilise les réponse de l'utilisateur pour identifier les éléments manquants et évaluer le score.
    Par exemple, si l'utilisateur mentionne un objet, tu dois lui poser des questions sur sa forme, sa couleur, son odeur, etc...

    Ne retourne aucun texte en dehors du JSON.
`,
};

export const analysing = async (interview: Interview[]): Promise<Analysis> => {
  const res = await fetch("http://localhost:11434/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "llama3.2",
      stream: false,
      format: ANALYSIS_SCHEMA,
      messages: [
        SYSTEM_ANALYSTE,
        {
          role: "user",
          content:
            `Voici la conversation :\n` +
            interview
              .filter((m) => m.role !== "system")
              .map((m) => `${m.role}: ${m.content}`)
              .join("\n"),
        },
      ],
    }),
  });

  const data = await res.json();

  return JSON.parse(data.message.content) as Analysis;
};
