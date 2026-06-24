const IMAGE_SYSTEM = `
Photorealistic dreamlike memory, nostalgic and emotionally intense.
Vivid saturated colors, deep contrast, strong directional light, cinematic shadows.
Vertical portrait composition, 9:16.

If humans are present: no clear facial features, no visible eyes, nose, or mouth.
Faces must be turned away, blurred, erased by light, hidden in shadow, or softened by memory haze.
Poetic and intimate, never horror.
`.trim();

export const imagining = async (prompt: string | null): Promise<string> => {
  if (!prompt?.trim()) return "";

  const fullPrompt = `${IMAGE_SYSTEM}\n\n${prompt.trim()}`;

  const res = await fetch("http://localhost:11434/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "x/flux2-klein",
      prompt: fullPrompt,
      stream: false,
    }),
  });

  if (!res.ok) {
    throw new Error(`Ollama image error: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();

  if (!data.image) {
    throw new Error("Ollama image response does not contain an image.");
  }

  console.info("Image response:", data.image);
  return `data:image/png;base64,${data.image}`;
};
