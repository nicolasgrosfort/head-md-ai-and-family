const IMAGE_SYSTEM = {
  role: "system",
  content: `
    A realistic photograph capturing a dreamlike memory. Photorealistic texture, fine skin pores, and natural grain. 
    Hyper-vivid, almost flashing saturated colors with deep contrasts. 
    A sharp, highly directional spotlight cuts through the scene, creating dramatic light and long shadows. 
    Cinematic atmosphere, nostalgic yet intense, reminiscent of a vivid lucid dream. High-end fashion editorial look. 
    Vertical portrait format (9:16 aspect ratio). 
`,
};

export const imagining = async (prompt: string | null): Promise<string> => {
  if (!prompt) return "";

  const res = await fetch("http://localhost:11434/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "x/flux2-klein",
      prompt: `${IMAGE_SYSTEM.content}\n\n${prompt}`,
      stream: false,
    }),
  });

  const data = await res.json();

  return `data:image/png;base64,${data.image}`;
};
