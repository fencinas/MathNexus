
import { GoogleGenAI, Type } from "@google/genai";
import { AIResponse, Language } from "../types";
import { translations } from "../translations";

export const solveMathProblem = async (problem: string, lang: Language, imageBase64?: string): Promise<AIResponse> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
  
  const contents: any[] = [{ text: problem }];
  
  if (imageBase64) {
    contents.push({
      inlineData: {
        mimeType: "image/jpeg",
        data: imageBase64.split(',')[1] || imageBase64
      }
    });
  }

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: { parts: contents },
    config: {
      systemInstruction: translations[lang].systemInstruction,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          solution: { type: Type.STRING },
          explanation: { type: Type.STRING },
          steps: { 
            type: Type.ARRAY,
            items: { type: Type.STRING }
          }
        },
        required: ["solution", "explanation", "steps"]
      }
    }
  });

  return JSON.parse(response.text);
};
