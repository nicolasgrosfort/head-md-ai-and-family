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

export const objectToTitle = async (
  object: string,
): Promise<{ title: string }> => {
  try {
    const response = await fetch("/api/object-to-title", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        object: [instructions.objectToTitle, object].concat(
          INSTRUCTION_SEPARATOR,
        ),
      }),
    });

    if (!response.ok) {
      throw new Error(`Server error: ${response.statusText}`);
    }

    const data = await response.json();
    return { title: data.data.title };
  } catch (error) {
    console.error("Error during object-to-title:", error);
    throw error;
  }
};

export const objectToImage = async (
  object: string,
): Promise<{ image: string }> => {
  try {
    const response = await fetch("/api/object-to-image", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        object: [instructions.objectToImage, object].concat(
          INSTRUCTION_SEPARATOR,
        ),
      }),
    });

    if (!response.ok) {
      throw new Error(`Server error: ${response.statusText}`);
    }

    const data = await response.json();
    return { image: data.data.image };
  } catch (error) {
    console.error("Error during object-to-image:", error);
    throw error;
  }
};

export const imageToMask = async (image: string): Promise<{ mask: string }> => {
  try {
    const response = await fetch("/api/image-to-mask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        image,
      }),
    });

    if (!response.ok) {
      throw new Error(`Server error: ${response.statusText}`);
    }

    const data = await response.json();
    return { mask: data.data.mask };
  } catch (error) {
    console.error("Error during image-to-mask:", error);
    throw error;
  }
};

export const maskToModel = async (
  mask: string,
  title: string,
): Promise<{ model: string }> => {
  try {
    const response = await fetch("/api/mask-to-model", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        mask,
        title,
      }),
    });

    if (!response.ok) {
      throw new Error(`Server error: ${response.statusText}`);
    }

    const data = await response.json();
    return { model: data.data.model };
  } catch (error) {
    console.error("Error during mask-to-model:", error);
    throw error;
  }
};

export const textToStory = async (text: string): Promise<{ story: string }> => {
  try {
    const response = await fetch("/api/text-to-story", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text: [instructions.textToStory, text].concat(INSTRUCTION_SEPARATOR),
      }),
    });

    if (!response.ok) {
      throw new Error(`Server error: ${response.statusText}`);
    }

    const data = await response.json();
    return { story: data.data.story };
  } catch (error) {
    console.error("Error during text-to-story:", error);
    throw error;
  }
};

export const storyToTitle = async (
  story: string,
): Promise<{ title: string }> => {
  try {
    const response = await fetch("/api/story-to-title", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        story: [instructions.storyToTitle, story].concat(INSTRUCTION_SEPARATOR),
      }),
    });

    if (!response.ok) {
      throw new Error(`Server error: ${response.statusText}`);
    }

    const data = await response.json();
    return { title: data.data.title };
  } catch (error) {
    console.error("Error during story-to-title:", error);
    throw error;
  }
};
