import { GoogleGenAI, Type } from "@google/genai";
import type { Vendor, Inspiration, ChecklistItem, BudgetItem, FAQItem } from '../types';

// FIX: Initializing Gemini API client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const model = 'gemini-2.5-flash';

// This new helper function is more robust for parsing streamed JSON.
// It accumulates the stream and parses complete JSON objects as they arrive,
// ignoring markdown fences and other non-JSON text.
async function* streamJsonObjects<T>(stream: AsyncGenerator<any, any, any>): AsyncGenerator<T, void, unknown> {
    let buffer = '';
    const jsonStartMarker = '{';
    const jsonEndMarker = '}';
    
    for await (const chunk of stream) {
        const text = chunk.text;
        if (typeof text !== 'string') continue;
        buffer += text;

        // Process all complete JSON objects found in the buffer
        let startIndex = buffer.indexOf(jsonStartMarker);
        while (startIndex !== -1) {
            let braceCount = 0;
            let endIndex = -1;

            // Find the matching closing brace for the object starting at startIndex
            for (let i = startIndex; i < buffer.length; i++) {
                if (buffer[i] === jsonStartMarker) {
                    braceCount++;
                } else if (buffer[i] === jsonEndMarker) {
                    braceCount--;
                }
                if (braceCount === 0) {
                    endIndex = i;
                    break;
                }
            }

            if (endIndex !== -1) {
                // A complete object is found
                const jsonString = buffer.substring(startIndex, endIndex + 1);
                try {
                    const jsonObj = JSON.parse(jsonString) as T;
                    yield jsonObj;
                } catch (e) {
                    // The substring was not valid JSON, log it and continue.
                    console.error("Failed to parse potential JSON object from stream:", jsonString, e);
                }
                // Remove the processed part from the buffer and look for the next object
                buffer = buffer.substring(endIndex + 1);
                startIndex = buffer.indexOf(jsonStartMarker);
            } else {
                // No complete object found yet, break and wait for more chunks
                break;
            }
        }
    }
}


// FIX: Replaced streamToLines with a more robust streamJsonObjects parser.
export async function* generateVendorsStream(category: string, location: string, existingVendorNames: string[] = []): AsyncGenerator<Vendor, void, unknown> {
    
    let avoidancePrompt = '';
    if (existingVendorNames.length > 0) {
        avoidancePrompt = `\nTo ensure variety, do not generate any vendors with the following names: ${existingVendorNames.join(', ')}.`;
    }

    const prompt = `Generate a realistic but fictional list of 12 wedding vendors for the category "${category}" in "${location}, Chile".
    Stream the output as individual JSON objects.
    Each object must strictly conform to this TypeScript interface:
    interface Vendor {
        name: string;
        category: string; // Must be exactly "${category}"
        location: string; // A specific neighborhood or commune within "${location}"
        city: string; // The main city or region, which should be "${location}"
        rating: number; // A realistic rating between 4.5 and 5.0, with one decimal place.
        description: string; // A compelling, concise description (20-30 words).
        imageUrl: string; // A relevant, working Unsplash image URL (e.g., https://source.unsplash.com/400x300/?wedding,photography). Ensure the URL is valid.
        startingPrice: number; // A realistic starting price in Chilean Pesos (CLP) for this category.
        isPremium?: boolean; // Optional. Make one or two vendors premium.
    }
    ${avoidancePrompt}
    Do not wrap the response in a JSON array or markdown. Just stream the raw JSON objects.`;

    try {
        const responseStream = await ai.models.generateContentStream({
            model,
            contents: prompt,
        });

        for await (const vendor of streamJsonObjects<Vendor>(responseStream)) {
            // Basic validation
            if (vendor.name && vendor.category && vendor.location) {
                 yield vendor;
            }
        }
    } catch(e) {
        console.error("Error fetching vendor stream:", e);
        // We can re-throw or just end the generator here
        throw e;
    }
}

// FIX: Replaced streamToLines with a more robust streamJsonObjects parser.
export async function* generateInspirationStream(): AsyncGenerator<Inspiration, void, unknown> {
     const prompt = `Generate a diverse list of 30 wedding inspiration ideas.
    Stream the output as individual JSON objects.
    Each object must strictly conform to this TypeScript interface:
     interface Inspiration {
        id: string; // A unique identifier string, e.g., "inspiration-1"
        title: string; // A catchy title for the inspiration item.
        category: string; // A relevant category like "Decoración", "Vestidos", "Pasteles", "Fotografía".
        description: string; // A short, inspiring description (15-25 words).
        imageSearchTerms: string; // 3-4 comma-separated Unsplash search terms (e.g., "rustic wedding decor, fairy lights").
    }
    Do not wrap the response in a JSON array or markdown. Just stream the raw JSON objects.`;
    
    try {
        const responseStream = await ai.models.generateContentStream({
            model,
            contents: prompt,
        });

        for await (const item of streamJsonObjects<Inspiration>(responseStream)) {
             if (item.id && item.title && item.category) {
                 yield item;
            }
        }
    } catch(e) {
        console.error("Error fetching inspiration stream:", e);
        throw e;
    }
}

export const generateVendorFAQs = async (vendorName: string, vendorCategory: string): Promise<FAQItem[]> => {
    const schema = {
        type: Type.ARRAY,
        items: {
            type: Type.OBJECT,
            properties: {
                question: { type: Type.STRING },
                answer: { type: Type.STRING },
            },
            required: ['question', 'answer']
        }
    };
    
    try {
        const response = await ai.models.generateContent({
            model,
            contents: `Generate a list of 3-4 frequently asked questions (FAQs) with concise answers for a wedding vendor named "${vendorName}" in the category "${vendorCategory}". The tone should be helpful and professional.`,
            config: {
                responseMimeType: "application/json",
                responseSchema: schema,
            }
        });
        const jsonText = response.text.trim();
        const faqs = JSON.parse(jsonText);
        return faqs;

    } catch (error) {
        console.error("Error generating vendor FAQs:", error);
        return [];
    }
};

// FIX: Implementing generateChecklist to fetch a checklist from Gemini
export const generateChecklist = async (): Promise<ChecklistItem[]> => {
    const schema = {
        type: Type.ARRAY,
        items: {
            type: Type.OBJECT,
            properties: {
                id: { type: Type.NUMBER },
                task: { type: Type.STRING },
                category: { type: Type.STRING },
                completed: { type: Type.BOOLEAN },
            },
            required: ['id', 'task', 'category', 'completed']
        }
    };

    try {
        const response = await ai.models.generateContent({
            model,
            contents: 'Generate a comprehensive wedding checklist for a wedding in Chile. Create around 40-50 tasks. Group tasks by category (e.g., "12+ Meses Antes", "9-12 Meses Antes", "6-9 Meses Antes", "3-6 Meses Antes", "1-3 Meses Antes", "Último Mes", "Semana de la Boda", "Día de la Boda"). Each item must have a unique numeric id (starting from 1), a "task" description, its "category", and "completed" field set to false.',
            config: {
                responseMimeType: "application/json",
                responseSchema: schema,
            }
        });

        const jsonText = response.text.trim();
        const checklist = JSON.parse(jsonText);
        return checklist;
    } catch (error) {
        console.error("Error generating checklist:", error);
        return []; // Return empty array on error
    }
};

// FIX: Implementing generateBudgetTemplate to fetch a budget template from Gemini
export const generateBudgetTemplate = async (): Promise<BudgetItem[]> => {
    const schema = {
        type: Type.ARRAY,
        items: {
            type: Type.OBJECT,
            properties: {
                id: { type: Type.NUMBER },
                item: { type: Type.STRING },
                category: { type: Type.STRING },
                estimated: { type: Type.NUMBER },
                actual: { type: Type.NUMBER },
            },
            required: ['id', 'item', 'category', 'estimated', 'actual']
        }
    };
    
    try {
        const response = await ai.models.generateContent({
            model,
            contents: `Generate a standard wedding budget template for a wedding in Chile with an estimated total of around 5,000,000 CLP. Create around 20-25 budget items.
            Group items by category (e.g., "Ceremonia", "Recepción y Banquete", "Vestuario y Belleza", "Fotografía y Video", "Varios").
            Each item must have a unique numeric id (starting from 1), an "item" description, its "category", a realistic "estimated" cost in CLP that contributes to the total, and an "actual" cost initialized to 0.`,
            config: {
                responseMimeType: "application/json",
                responseSchema: schema,
            }
        });

        const jsonText = response.text.trim();
        const budget = JSON.parse(jsonText);
        return budget;
    } catch (error) {
        console.error("Error generating budget template:", error);
        return [];
    }
};