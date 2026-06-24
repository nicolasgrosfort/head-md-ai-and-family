import type { Interview } from "./interviewer";

export type MemoryKnown = {
  location: boolean;
  time: boolean;
  people: boolean;
  action: boolean;
  emotion: boolean;
  light: boolean;
  colors: boolean;
  sound: boolean;
  smell: boolean;
  temperature: boolean;
  texture: boolean;
  body: boolean;
  object: boolean;
};

export type Analysis = {
  completion: number;
  retrieval_strength: number;
  strongest_anchor: string | null;
  known: MemoryKnown;
  missing: string[];
  visual_summary: string;
};

const ANALYSIS_SCHEMA = {
  type: "object",
  properties: {
    completion: { type: "number", minimum: 0, maximum: 100 },
    retrieval_strength: { type: "number", minimum: 0, maximum: 100 },
    strongest_anchor: { type: ["string", "null"] },
    known: {
      type: "object",
      properties: {
        location: { type: "boolean" },
        time: { type: "boolean" },
        people: { type: "boolean" },
        action: { type: "boolean" },
        emotion: { type: "boolean" },
        light: { type: "boolean" },
        colors: { type: "boolean" },
        sound: { type: "boolean" },
        smell: { type: "boolean" },
        temperature: { type: "boolean" },
        texture: { type: "boolean" },
        body: { type: "boolean" },
        object: { type: "boolean" },
      },
      required: [
        "location",
        "time",
        "people",
        "action",
        "emotion",
        "light",
        "colors",
        "sound",
        "smell",
        "temperature",
        "texture",
        "body",
        "object",
      ],
    },
    missing: {
      type: "array",
      items: { type: "string" },
    },
    visual_summary: { type: "string" },
  },
  required: [
    "completion",
    "retrieval_strength",
    "strongest_anchor",
    "known",
    "missing",
    "visual_summary",
  ],
};

const EMPTY_KNOWN: MemoryKnown = {
  location: false,
  time: false,
  people: false,
  action: false,
  emotion: false,
  light: false,
  colors: false,
  sound: false,
  smell: false,
  temperature: false,
  texture: false,
  body: false,
  object: false,
};

const EMPTY_ANALYSIS: Analysis = {
  completion: 0,
  retrieval_strength: 0,
  strongest_anchor: null,
  known: EMPTY_KNOWN,
  missing: [
    "lieu",
    "moment",
    "personnes",
    "action",
    "lumière",
    "ambiance",
    "détails sensoriels",
  ],
  visual_summary: "",
};

const SYSTEM_ANALYSTE = {
  role: "system" as const,
  content: `
Tu es un modèle d'analyse mémorielle.

Tu analyses une conversation entre un utilisateur et une IA.
Ton rôle est d'évaluer si le souvenir décrit est assez clair pour générer une image.

Tu ne poses jamais de questions.
Tu ne réponds jamais à l'utilisateur.
Tu retournes uniquement un JSON valide.

Évalue la visualisabilité du souvenir :
est-ce qu'une scène claire peut être imaginée et transformée en image ?

Analyse uniquement les messages de l'utilisateur.
Ignore les suggestions de l'assistant.

Champs à évaluer :
- location : lieu ou environnement
- time : moment, époque, saison ou temporalité
- people : personnes présentes
- action : situation ou action
- emotion : ambiance émotionnelle
- light : lumière
- colors : couleurs
- sound : sons
- smell : odeurs
- temperature : température
- texture : matières ou textures
- body : posture, sensation corporelle, point de vue
- object : objet ou détail important


completion :
Complétion descriptive du souvenir, de 0 à 100.

retrieval_strength :
Force subjective du souvenir, de 0 à 100.
Un souvenir peut être peu complet mais très vivant.
Évalue la vivacité, la précision ressentie, la présence émotionnelle.

strongest_anchor :
L'élément le plus fort du souvenir.
Exemples : "la grand-mère", "la cuisine", "l'odeur du bois", "la lumière du soir".
Si aucun ancrage clair : null.

missing :
Liste courte des éléments les plus utiles à demander ensuite.
Maximum 4 éléments.
N'inclus que les éléments importants.

visual_summary :
Résumé visuel très court du souvenir.
Si le souvenir est insuffisant, retourne une chaîne vide.

Barème completion :
0-24 : aucun souvenir identifiable ou scène inutilisable
25-49 : souvenir très vague
50-74 : scène partielle mais encore floue
75-99 : scène claire avec quelques détails manquants
100 : scène riche, précise, générable

Retourne uniquement ce JSON :

{
  "completion": 0,
  "retrieval_strength": 0,
  "strongest_anchor": null,
  "known": {
    "location": false,
    "time": false,
    "people": false,
    "action": false,
    "emotion": false,
    "light": false,
    "colors": false,
    "sound": false,
    "smell": false,
    "temperature": false,
    "texture": false,
    "body": false,
    "object": false
  },
  "missing": [],
  "visual_summary": ""
}
`.trim(),
};

const safeParseAnalysis = (content: string): Analysis => {
  try {
    const parsed = JSON.parse(content) as Analysis;

    return {
      ...EMPTY_ANALYSIS,
      ...parsed,
      known: {
        ...EMPTY_KNOWN,
        ...(parsed.known ?? {}),
      },
      missing: Array.isArray(parsed.missing) ? parsed.missing : [],
    };
  } catch {
    return EMPTY_ANALYSIS;
  }
};

export const analysing = async (interview: Interview[]): Promise<Analysis> => {
  const conversation = interview
    .filter((m) => m.role !== "system")
    .map((m) => `${m.role}: ${m.content}`)
    .join("\n");

  if (!conversation.trim()) {
    return EMPTY_ANALYSIS;
  }

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
          content: `Voici la conversation :\n${conversation}`,
        },
      ],
    }),
  });

  if (!res.ok) {
    throw new Error(`Ollama analysis error: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();

  return safeParseAnalysis(data.message.content);
};
