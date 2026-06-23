import type { Interview } from "./interviewer";

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
  role: "system",
  content:
    'Basé sur la conversation, décide si l\'utilisateur est prêt à visualiser son souvenir. Retourne uniquement un JSON valide respectant ce format : { "showModel": true } ou { "showModel": false }.',
};

export const orchestrating = async (
  input: string,
  interview: Interview[],
): Promise<Decision> => {
  const content =
    `Voici la conversation :\n` +
    interview
      .filter((m) => m.role !== "system")
      .map((m) => `${m.role}: ${m.content}`)
      .join("\n") +
    `\n\nL'utilisateur a envoyé le message suivant : "${input}".`;

  const res = await fetch("http://localhost:11434/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "llama3.2",
      stream: false,
      format: DECISION_SCHEMA,
      messages: [
        SYSTEM_ORCHESTRATOR,
        {
          role: "user",
          content: content,
        },
      ],
    }),
  });

  const data = await res.json();

  console.log("Orchestrator response:", data);
  return JSON.parse(data.message.content) as Decision;
};
