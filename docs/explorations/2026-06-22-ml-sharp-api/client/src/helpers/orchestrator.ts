import type { Interview } from "./interviewer";

const MODEL = "gemma4:12b-mlx";

export type Decision = {
  showModel: boolean;
};

export const DECISION_SCHEMA = {
  type: "object",
  properties: {
    showModel: { type: "boolean" },
  },
  required: ["showModel"],
};

const SYSTEM_ORCHESTRATOR = {
  role: "system" as const,
  content: `
    Tu analyses la réponse de l'utilisateur.

    L'image du souvenir est déjà prête.
    L'assistant vient de demander si l'utilisateur souhaite la voir.

    Décide uniquement si l'utilisateur accepte explicitement de voir l'image.

    Retourne :
    { "showModel": true }
    seulement si l'utilisateur dit clairement oui.

    Retourne :
    { "showModel": false }
    si l'utilisateur dit non, hésite, change de sujet, répond de manière ambiguë,
    ou ne répond pas clairement à la proposition.

    Ne tiens pas compte du désir supposé de l'utilisateur.
    Ne force jamais l'affichage.

    Retourne uniquement un JSON valide.
`.trim(),
};

const safeParseDecision = (content: string): Decision => {
  try {
    const parsed = JSON.parse(content) as Decision;

    return {
      showModel: Boolean(parsed.showModel),
    };
  } catch {
    return { showModel: false };
  }
};

export const orchestrating = async (
  input: string,
  interview: Interview[],
): Promise<Decision> => {
  const conversation = interview
    .filter((m) => m.role !== "system")
    .map((m) => `${m.role}: ${m.content}`)
    .join("\n");

  const res = await fetch("http://localhost:11434/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: MODEL,
      stream: false,
      think: false,
      format: DECISION_SCHEMA,
      messages: [
        SYSTEM_ORCHESTRATOR,
        {
          role: "user",
          content: `
            Voici la conversation :

            ${conversation}

            Dernière réponse de l'utilisateur :
            "${input}"

            Décision :
            `.trim(),
        },
      ],
    }),
  });

  if (!res.ok) {
    throw new Error(
      `Ollama orchestrator error: ${res.status} ${res.statusText}`,
    );
  }

  const data = await res.json();
  console.info(
    "Orchestrator response:",
    safeParseDecision(data.message.content),
  );
  return safeParseDecision(data.message.content);
};
