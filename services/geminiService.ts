
import { GoogleGenAI, Type } from "@google/genai";
import { AIInsightResponse } from "../types";

const getAIClient = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
};

export const generateTopicAnalysis = async (title: string, description: string): Promise<AIInsightResponse> => {
  const ai = getAIClient();
  const prompt = `Analiza el siguiente tema político de forma objetiva y proporciona un resumen equilibrado, 3 argumentos clave a favor y 3 argumentos clave en contra.
  Título del tema: ${title}
  Contexto: ${description}
  
  Asegúrate de que el tono sea neutral, educativo y evite sesgos partidistas. Responde exclusivamente en español y en formato JSON.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          summary: { type: Type.STRING },
          pros: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          cons: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          }
        },
        required: ["summary", "pros", "cons"]
      }
    }
  });

  try {
    return JSON.parse(response.text.trim());
  } catch (error) {
    console.error("Failed to parse AI response", error);
    throw new Error("Error al analizar el tema.");
  }
};

export const suggestPopularTopics = async (): Promise<string[]> => {
  const ai = getAIClient();
  const prompt = "Lista 5 temas actuales, populares y debatidos de la política o sociedad española que sean adecuados para una plataforma de votación pública. Devuelve un array JSON de strings en español.";

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: { type: Type.STRING }
      }
    }
  });

  return JSON.parse(response.text.trim());
};
