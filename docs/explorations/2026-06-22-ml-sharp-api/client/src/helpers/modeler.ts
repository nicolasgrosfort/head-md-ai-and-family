export const modeling = async (imageBase64: string): Promise<string | null> => {
  try {
    // Convertir base64 → Blob → File
    const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");
    const byteArray = Uint8Array.from(atob(base64Data), (c) => c.charCodeAt(0));
    const blob = new Blob([byteArray], { type: "image/png" });
    const file = new File([blob], "memory.png", { type: "image/png" });

    const formData = new FormData();
    formData.append("file", file);
    formData.append("ratio", "0.5");
    formData.append("rx", "180");
    formData.append("ry", "0");
    formData.append("rz", "0");

    const response = await fetch("http://localhost:8000/process", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.detail ?? "Erreur serveur");
    }

    const blob2 = await response.blob();
    return URL.createObjectURL(blob2);
  } catch (err) {
    console.error(err instanceof Error ? err.message : "Erreur inconnue");
    return null;
  }
};
