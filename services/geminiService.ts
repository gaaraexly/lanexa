
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { Veo3Prompt, DetailedEngPrompt } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const promptSchema = {
  type: Type.OBJECT,
  properties: {
    promptVideo: { type: Type.STRING, description: "The main, concise video prompt." },
    pembukaanKonsep: { type: Type.STRING, description: "The conceptual opening or high-level idea of the video." },
    adegan: { type: Type.STRING, description: "A detailed description of the scene." },
    subjek: { type: Type.STRING, description: "The main subject(s) of the video." },
    aksi: { type: Type.STRING, description: "The primary actions taking place." },
    lingkungan: { type: Type.STRING, description: "The environment or setting." },
    pencahayaan: { type: Type.STRING, description: "The lighting style (e.g., golden hour, cinematic)." },
    suasanaHati: { type: Type.STRING, description: "The mood or atmosphere of the video." },
    kalimatYangDiucapkan: { type: Type.STRING, description: "Any spoken lines or dialogue. If no dialogue, describe relevant environmental sounds." },
    promptNegatif: { type: Type.STRING, description: "Elements to exclude from the video (e.g., blurry, low quality)." },
    saranTambahan: {
      type: Type.OBJECT,
      properties: {
        sudutKamera: { type: Type.STRING, description: "Suggested camera angles." },
        pergerakanKamera: { type: Type.STRING, description: "Suggested camera movements." },
        transisi: { type: Type.STRING, description: "Suggested scene transitions." },
        musikLatar: { type: Type.STRING, description: "Suggestions for background music or sound." },
        efekVisual: { type: Type.STRING, description: "Suggestions for visual effects." },
      },
      required: ["sudutKamera", "pergerakanKamera", "transisi", "musikLatar", "efekVisual"]
    },
  },
   required: ["promptVideo", "pembukaanKonsep", "adegan", "subjek", "aksi", "lingkungan", "pencahayaan", "suasanaHati", "kalimatYangDiucapkan", "promptNegatif", "saranTambahan"]
};

const detailedEngPromptSchema = {
    type: Type.OBJECT,
    properties: {
        subjek: { type: Type.STRING, description: "The main subject(s) of the video, in English." },
        aksi: { type: Type.STRING, description: "The primary actions taking place, in English." },
        ekspresi: { type: Type.STRING, description: "The expressions or emotions of the subject, in English." },
        tempat: { type: Type.STRING, description: "The location or setting, in English." },
        waktu: { type: Type.STRING, description: "The time of day or a specific temporal setting (e.g., 'Golden hour', 'Night'), in English." },
        gerakanKamera: { type: Type.STRING, description: "Specific camera movements (e.g., 'Slow pan left', 'Dolly zoom'), in English." },
        pencahayaan: { type: Type.STRING, description: "The lighting style (e.g., 'Dramatic Rembrandt lighting'), in English." },
        gayaVideo: { type: Type.STRING, description: "The overall video style (e.g., 'Cinematic documentary', 'Found footage'), in English." },
        suasanaVideo: { type: Type.STRING, description: "The video's atmosphere or mood (e.g., 'Tense and suspenseful'), in English." },
        suaraAtauMusik: { type: Type.STRING, description: "Description of sound or music, in English." },
        kalimatYangDiucapkan: { type: Type.STRING, description: "The original spoken lines. DO NOT TRANSLATE THIS FIELD." },
        detailTambahan: { type: Type.STRING, description: "Any other important details to include, in English." },
    },
    required: ["subjek", "aksi", "ekspresi", "tempat", "waktu", "gerakanKamera", "pencahayaan", "gayaVideo", "suasanaVideo", "suaraAtauMusik", "kalimatYangDiucapkan", "detailTambahan"],
};


async function parseAndValidateResponse(response: GenerateContentResponse): Promise<Veo3Prompt> {
    try {
        const text = response.text.trim();
        const json = JSON.parse(text);
        // Basic validation can be added here if needed
        return json as Veo3Prompt;
    } catch (e) {
        console.error("Failed to parse JSON response:", response.text);
        throw new Error("AI memberikan format yang tidak valid. Silakan coba lagi.");
    }
}

async function parseAndValidateDetailedResponse(response: GenerateContentResponse): Promise<DetailedEngPrompt> {
    try {
        const text = response.text.trim();
        const json = JSON.parse(text);
        return json as DetailedEngPrompt;
    } catch (e) {
        console.error("Failed to parse JSON for detailed prompt:", response.text);
        throw new Error("AI memberikan format detail yang tidak valid. Silakan coba lagi.");
    }
}


export const generatePromptFromImage = async (imageBase64: string): Promise<Veo3Prompt> => {
    const imagePart = {
      inlineData: {
        mimeType: 'image/jpeg',
        data: imageBase64,
      },
    };

    const textPart = {
        text: `Analyze this image and generate a detailed video prompt based on it. Describe the scene, subjects, potential actions, and overall mood. Structure the output as a JSON object that adheres to the provided schema. The language of the output must be Indonesian. IMPORTANT RULE for 'kalimatYangDiucapkan': Be creative. If there are characters who can speak, create a suitable spoken line for them in Indonesian based on the context. If there are no speaking characters (e.g., animals, landscapes), fill this field with a relevant environmental sound (e.g., 'Deru ombak', 'Hembusan angin kencang').`
    };

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: { parts: [textPart, imagePart] },
        config: {
            responseMimeType: "application/json",
            responseSchema: promptSchema
        }
    });
    
    return parseAndValidateResponse(response);
};

export const expandPromptFromText = async (userInput: Partial<Veo3Prompt>): Promise<Veo3Prompt> => {
    const prompt = `
        You are an expert prompt engineer for the Veo3 video generation model.
        A user has provided the following basic ideas in a JSON object.
        Your task is to expand these ideas into a rich, detailed, and evocative video prompt.
        Flesh out every field in the provided JSON schema, even if the user left some empty. Be creative and descriptive.
        The final output must be a valid JSON object adhering to the schema, written entirely in Indonesian.
        IMPORTANT RULE for 'kalimatYangDiucapkan': Analyze the subject and action. If there are characters who can speak, creatively generate a suitable line of dialogue for them in Indonesian. If there are no speaking characters (e.g., animals, landscapes), fill this field with a relevant environmental sound (e.g., 'Deru ombak', 'Hembusan angin kencang', 'Kicauan burung di pagi hari'). Do not leave it empty.

        User Input:
        ${JSON.stringify(userInput, null, 2)}
    `;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: promptSchema
        }
    });

    return parseAndValidateResponse(response);
};

export const translatePrompt = async (prompt: Veo3Prompt): Promise<Veo3Prompt> => {
    const translationPrompt = `
        You are an expert cinematic prompt engineer for the Veo3 video generation model.
        Your task is to take the user's Indonesian prompt and elevate it to a premium, highly detailed, and professional-grade prompt in English.
        - Analyze the user's input JSON.
        - For each field, creatively expand and enrich the content. Make it much more descriptive, evocative, and detailed. For example, if the user says 'seorang pria berjalan', you could expand it to 'a grizzled, weary man in a tattered trench coat, limping down a rain-slicked cobblestone alley'.
        - Ensure character descriptions and actions are consistent throughout all relevant fields.
        - The output language for all fields must be English, except for one.
        - MOST IMPORTANT RULE: You MUST NOT translate the value of the 'kalimatYangDiucapkan' field. Preserve its original Indonesian text.
        - The final output must be a valid JSON object with the exact same structure but with the new, enhanced, and translated content.

        Indonesian JSON Input:
        ${JSON.stringify(prompt, null, 2)}
    `;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: translationPrompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: promptSchema
        }
    });

    return parseAndValidateResponse(response);
};

export const generateDetailedEngPrompt = async (prompt: Veo3Prompt): Promise<DetailedEngPrompt> => {
    const generationPrompt = `
        You are an expert video prompt creator. Based on the following comprehensive Indonesian video prompt, break it down and creatively fill in the fields of the provided English JSON schema.
        - Analyze the entire Indonesian prompt to extract and infer the details for each specific field in the English schema.
        - Be creative and specific. For fields like 'waktu', 'gerakanKamera', 'pencahayaan', 'gayaVideo', and 'suasanaVideo', provide specific, professional-sounding options.
        - MOST IMPORTANT RULE: The 'kalimatYangDiucapkan' field in the output JSON MUST contain the exact, untranslated text from the 'kalimatYangDiucapkan' field of the input JSON. Do not translate it.
        - The output must be a valid JSON object adhering to the schema.

        Indonesian Input Prompt:
        ${JSON.stringify(prompt, null, 2)}
    `;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: generationPrompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: detailedEngPromptSchema
        }
    });

    return parseAndValidateDetailedResponse(response);
};
