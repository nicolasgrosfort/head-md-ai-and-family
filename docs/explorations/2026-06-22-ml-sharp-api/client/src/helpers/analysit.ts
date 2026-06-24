import { z } from "zod";
import type { Interview } from "./interviewer";

const MemoryKnownSchema = z.object({
  location: z.boolean(),
  time: z.boolean(),
  people: z.boolean(),
  action: z.boolean(),
  emotion: z.boolean(),
  light: z.boolean(),
  colors: z.boolean(),
  sound: z.boolean(),
  smell: z.boolean(),
  temperature: z.boolean(),
  texture: z.boolean(),
  body: z.boolean(),
  object: z.boolean(),
});

const AnalysisSchema = z.object({
  completion: z.number().min(0).max(100),
  strength: z.number().min(0).max(100),
  anchor: z.string().nullable(),
  known: MemoryKnownSchema,
  missing: z.array(z.string()),
  summary: z.string(),
});

export type MemoryKnown = z.infer<typeof MemoryKnownSchema>;
export type Analysis = z.infer<typeof AnalysisSchema>;

const EMPTY_ANALYSIS: Analysis = AnalysisSchema.parse({
  completion: 0,
  strength: 0,
  anchor: null,
  known: Object.fromEntries(
    Object.keys(MemoryKnownSchema.shape).map((k) => [k, false]),
  ),
  missing: [
    "lieu",
    "moment",
    "personnes",
    "action",
    "lumière",
    "ambiance",
    "détails sensoriels",
  ],
  summary: "",
});

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

    strength :
    Force subjective du souvenir, de 0 à 100.
    Un souvenir peut être peu complet mais très vivant.
    Évalue la vivacité, la précision ressentie, la présence émotionnelle.

    anchor :
    L'élément le plus fort du souvenir.
    Exemples : "la grand-mère", "la cuisine", "l'odeur du bois", "la lumière du soir".
    Si aucun ancrage clair : null.

    missing :
    Liste courte des éléments les plus utiles à demander ensuite.
    Maximum 4 éléments.
    N'inclus que les éléments importants.

    summary :
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
      "strength": 0,
      "anchor": null,
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
      "summary": ""
    }
    `.trim(),
};

const safeParseAnalysis = (content: string): Analysis => {
  try {
    return AnalysisSchema.parse(JSON.parse(content));
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
      format: z.toJSONSchema(AnalysisSchema),
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
  const content = data.message.content;
  const response = safeParseAnalysis(content);

  console.info("Analysis response:", response);
  return response;
};
