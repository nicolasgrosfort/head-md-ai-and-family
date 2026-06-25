import { MODEL } from "../config";
import type { Analysis } from "./analysit";
import type { Interview } from "./interviewer";

const PROMPTER_SYSTEM = {
  role: "system" as const,
  content: `
    # YOUR ROLE  
    
    You are an image prompt writer.
    You generate a concise English prompt for an image generation model.
    The image must represent a personal memory described by the user.
    She must stage the described object, placing the object at the center of the composition.

    # STYLE RULES
    
    - photorealistic
    - dreamlike memory
    - vivid saturated colors
    - strong directional light
    - cinematic shadows
    - nostalgic but intense
    - square format 1:1

    # FACE RULES

    If humans are present:
    - do not show clear facial features
    - no visible eyes, nose, or mouth
    - faces should feel blurred, erased, turned away, hidden by light, shadow, motion blur, or memory haze
    - preserve the presence of the person without identifying them
    - do not make it horror
    - do not make it monstrous
    - make the absence of features feel poetic and memory-like

    # FIDELITY RULES

    - Do not invent important elements.
    - Use only details present in the conversation or analysis.
    - If a detail is missing, stay vague.
    - Prioritize atmosphere over literal precision.

    # OUTPUT RULES

    Return only the final English image prompt.
    No explanation.
    No markdown.
    `.trim(),
};

export const prompting = async (
  conversation: Interview[],
  analysis: Analysis,
): Promise<string> => {
  const cleanConversation = conversation
    .filter((m) => m.role !== "system")
    .map((m) => `${m.role}: ${m.content}`)
    .join("\n");

  const res = await fetch("http://localhost:11434/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: MODEL.LLM,
      stream: false,
      think: false,
      messages: [
        PROMPTER_SYSTEM,
        {
          role: "user",
          content: `
            Conversation:

            ${cleanConversation}

            Memory analysis:

            ${JSON.stringify(analysis, null, 2)}

            Generate the image prompt now.
            `.trim(),
        },
      ],
    }),
  });

  if (!res.ok) {
    throw new Error(`Ollama prompter error: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  console.info("Prompt response:", data.message.content.trim());
  return data.message.content.trim();
};
