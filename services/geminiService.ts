
import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY || "";

export const generateProductMockup = async (base64Image: string, prompt: string): Promise<string> => {
  if (!API_KEY) {
    throw new Error("API Key is missing. Please ensure process.env.API_KEY is configured.");
  }

  const ai = new GoogleGenAI({ apiKey: API_KEY });
  
  // Using gemini-2.5-flash-image for image generation/editing tasks as per guidelines
  const modelName = 'gemini-2.5-flash-image';

  const systemInstruction = `
    You are an elite Industrial Designer and CG Artist. 
    You will be provided with a rough sketch of a product and a descriptive prompt.
    Your task is to transform this rough sketch into a high-fidelity, photorealistic 3D render/mockup.
    IMPORTANT CONSTRAINTS:
    1. MAINTAIN PERSPECTIVE: Keep the exact same silhouette, structural lines, and perspective of the sketch.
    2. MATERIAL APPLICATION: Apply realistic materials, textures, and lighting as described in the prompt.
    3. PROFESSIONAL LIGHTING: Use studio lighting techniques (soft shadows, realistic reflections, depth of field).
    4. BACKGROUND: Place the product on a clean, professional minimalist studio background unless otherwise specified.
    5. QUALITY: Ensure 4K level detail in textures (brushed metal, carbon fiber, leather, glass, etc.).
  `;

  const imagePart = {
    inlineData: {
      data: base64Image.split(',')[1], // Remove the data:image/png;base64, prefix
      mimeType: 'image/png',
    },
  };

  const textPart = {
    text: `Sketch: [Provided Image]. Product Description: ${prompt}. Goal: Create a photorealistic industrial design mockup.`,
  };

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: { parts: [imagePart, textPart] },
      config: {
        systemInstruction: systemInstruction,
      }
    });

    let generatedImageUrl = '';

    // Iterate through candidates and parts to find the generated image
    if (response.candidates && response.candidates[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          generatedImageUrl = `data:image/png;base64,${part.inlineData.data}`;
          break;
        }
      }
    }

    if (!generatedImageUrl) {
      throw new Error("The model did not return an image part in the response.");
    }

    return generatedImageUrl;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
