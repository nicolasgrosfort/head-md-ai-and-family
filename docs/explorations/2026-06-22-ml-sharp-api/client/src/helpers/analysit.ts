import ollama from "ollama/browser";
import { z } from "zod";
import { MODEL } from "../config";
import type { Interview } from "./interviewer";

const DomainSchema = z.object({
  location: z.string().optional(),
  time: z.string().optional(),
  people: z.string().optional(),
  action: z.string().optional(),
  emotion: z.string().optional(),
  light: z.string().optional(),
  colors: z.string().optional(),
  sound: z.string().optional(),
  smell: z.string().optional(),
  temperature: z.string().optional(),
  texture: z.string().optional(),
  body: z.string().optional(),
  object: z.string().optional(),
});

const AnalysisSchema = z.object({
  completion: z.number().min(0).max(100),
  focus: z.string().nullable(),
  summary: z.string().nullable(),
  domain: DomainSchema,
});

export type Domain = z.infer<typeof DomainSchema>;
export type Analysis = z.infer<typeof AnalysisSchema>;

const EMPTY_ANALYSIS: Analysis = AnalysisSchema.parse({
  completion: 0,
  focus: null,
  summary: null,
  domain: DomainSchema.parse({}),
});

const buildAnalysisSystem = (
  analysis: Analysis | null,
  conversation: Interview[],
) => {
  return {
    role: "system" as const,
    content: `
    # TON ROLE

    Tu es un modèle d'analyse mémorielle.
    Tu analyses une conversation entre un utilisateur et une IA.
    Ton rôle est d'évaluer si le souvenir décrit est assez clair pour générer une image.

    Tu ne poses jamais de questions.
    Tu ne réponds jamais à l'utilisateur.
    Tu retournes uniquement un JSON valide.

    Évalue la visualisabilité du souvenir :
    est-ce qua les éléments mentionné dans la conversation sont suffisant pour qu'une scène soit transformée en image ?

    Analyse uniquement les messages de l'utilisateur.
    Ignore les suggestions de l'assistant.

    # TA PRECEDENTE ANALYSE

    ${JSON.stringify(analysis, null, 2)}

    # LA CONVERSATION

    Concentre toi sur les réponses de l'utilisateur "user", mais prend en compte les indications de l'assistant "assistant" pour comprendre le contexte.
    ${conversation.map((m) => `${m.role}: ${m.content}`).join("\n")}

    ## Completion (completion)

    Complétion descriptive du souvenir, de 0 à 100.
    Évalue la vivacité, la précision ressentie, la présence émotionnelle.
    0-24 : aucun souvenir identifiable ou scène inutilisable
    25-49 : souvenir très vague
    50-74 : scène partielle mais encore floue
    75-99 : scène claire avec quelques détails manquants
    100 : scène riche, précise, générable

    ## Focus (focus)

    Elément sur lequel l'assistant devrait se concentrer pour la prochaine question.
    Un détail à approfondir pour améliorer la complétion.
    Base toi sur les éléments de ta précédente analyse qui peuvent être approfondis (si nécessaire) ou qui sont manquants.
    Base toi aussi sur la conversation avec l'utilisateur pour identifier les éléments importants.
    Si aucun élément clair : null.

    ## Summary (summary)

    Résumé visuel très court du souvenir basé sur la conversation et les éléments important identifiés dans les domaines. 

    ## Domain (domain)

    Détails spécifiques du souvenir dans différents domaines.
    Si un domaine est absent ou non pertinent, retourne une chaîne vide.
    Base toi sur toute la conversation pour identifier les éléments importants dans chaque domaine.

    # OUTPUT
    
    Retourne uniquement un JSON valide : ${JSON.stringify(z.toJSONSchema(AnalysisSchema), null, 2)}
  `,
  };
};

const safeParseAnalysis = (content: string): Analysis => {
  try {
    const match = content.match(/\{[\s\S]*\}/);
    if (!match) return EMPTY_ANALYSIS;
    return AnalysisSchema.parse(JSON.parse(match[0]));
  } catch {
    return EMPTY_ANALYSIS;
  }
};

export const analysing = async (
  interview: Interview[],
  analysis: Analysis | null = null,
): Promise<Analysis> => {
  if (!interview.length) {
    return EMPTY_ANALYSIS;
  }

  const data = await ollama.chat({
    model: MODEL.LLM,
    stream: false,
    think: false,
    format: z.toJSONSchema(AnalysisSchema),
    messages: [buildAnalysisSystem(analysis, interview)],
  });

  const content = data.message.content;
  const response = safeParseAnalysis(content);

  console.info("Analysis response:", response);
  return response;
};
