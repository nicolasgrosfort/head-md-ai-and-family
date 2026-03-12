import { INSTRUCTION_SEPARATOR } from "./config";
import { instructions } from "./instructions";

export const speechToText = async (speech: Blob): Promise<{ text: string }> => {
  try {
    const response = await fetch("/api/speech-to-text", {
      method: "POST",
      headers: { "Content-Type": "audio/wav" },
      body: speech,
    });

    if (!response.ok) {
      throw new Error(`Server error: ${response.statusText}`);
    }

    const data = await response.json();
    return { text: data.data.text };
  } catch (error) {
    console.error("Error during speech-to-text:", error);
    throw error;
  }
};

export const textToObject = async (
  text: string,
): Promise<{ object: string }> => {
  try {
    const response = await fetch("/api/text-to-object", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text: [instructions.textToObject, text].concat(INSTRUCTION_SEPARATOR),
      }),
    });

    if (!response.ok) {
      throw new Error(`Server error: ${response.statusText}`);
    }

    const data = await response.json();
    return { object: data.data.object };
  } catch (error) {
    console.error("Error during text-to-object:", error);
    throw error;
  }
};
