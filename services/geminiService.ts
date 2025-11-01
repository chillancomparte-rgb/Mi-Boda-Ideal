import { GoogleGenAI, Type } from "@google/genai";
import type { Vendor, ChatMessage } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

const inspirationSchema = {
  type: Type.OBJECT,
  properties: {
    themeTitle: { type: Type.STRING, description: 'Un nombre creativo y evocador para el tema de la boda.' },
    colorPalette: {
      type: Type.ARRAY,
      description: 'Una paleta de 5 colores. Cada color debe tener un nombre y su código hexadecimal.',
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          hex: { type: Type.STRING },
        },
        required: ['name', 'hex'],
      },
    },
    decorIdeas: {
      type: Type.ARRAY,
      description: 'Una lista de 5 ideas de decoración específicas para el tema.',
      items: { type: Type.STRING },
    },
    dressStyle: {
      type: Type.ARRAY,
      description: 'Una lista de 3 sugerencias de estilos de vestido de novia que encajen con el tema.',
      items: { type: Type.STRING },
    },
  },
  required: ['themeTitle', 'colorPalette', 'decorIdeas', 'dressStyle'],
};

export interface AIInspirationResponse {
    themeTitle: string;
    colorPalette: { name: string; hex: string }[];
    decorIdeas: string[];
    dressStyle: string[];
}

export const generateInspiration = async (prompt: string): Promise<AIInspirationResponse | null> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Eres un/a wedding planner experto/a y creativo/a. Un usuario te dará una idea o tema para una boda. Tu misión es expandir esa idea. Responde EXCLUSIVAMENTE con un objeto JSON basado en el siguiente esquema. El idioma de la respuesta debe ser español. Tema del usuario: "${prompt}"`,
            config: {
                responseMimeType: "application/json",
                responseSchema: inspirationSchema,
            },
        });
        
        const jsonText = response.text.trim();
        return JSON.parse(jsonText) as AIInspirationResponse;

    } catch (error) {
        console.error("Error generating inspiration:", error);
        return null;
    }
};

export const getChatbotResponse = async (vendor: Vendor, chatHistory: ChatMessage[], newUserMessage: string): Promise<string> => {
    try {
        const systemInstruction = `Eres un asistente virtual amigable y muy servicial para "${vendor.name}", un proveedor de "${vendor.category}" ubicado en ${vendor.city}.
        Aquí tienes la información que debes usar para responder:
        - Descripción del servicio: "${vendor.description}"
        - El precio de partida es $${vendor.startingPrice.toLocaleString('es-CL')}.
        - Las parejas lo han valorado con ${vendor.rating} de 5 estrellas.
        
        Tus reglas son:
        1. Sé siempre amable y profesional.
        2. Tus respuestas deben ser breves y directas (máximo 3 frases).
        3. No inventes NUNCA información que no se te ha proporcionado aquí. Si no sabes algo, di amablemente que no tienes el detalle y que lo mejor es solicitar un presupuesto formal.
        4. Al final de CADA respuesta, anima al usuario a "solicitar un presupuesto" para obtener más detalles.
        5. Responde en español.`;

        const historyString = chatHistory.map(msg => `${msg.sender === 'user' ? 'Cliente' : 'Tú'}: ${msg.text}`).join('\n');
        
        const fullPrompt = `Este es el historial de la conversación:\n${historyString}\n\nEl cliente ahora dice:\n"${newUserMessage}"\n\nTu respuesta es:`;
        
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: fullPrompt,
            config: {
                systemInstruction,
                temperature: 0.7,
                maxOutputTokens: 200,
            }
        });

        return response.text;

    } catch (error) {
        console.error("Error getting chatbot response:", error);
        return "Lo siento, estoy teniendo problemas para conectarme en este momento. Por favor, intenta de nuevo más tarde.";
    }
};
