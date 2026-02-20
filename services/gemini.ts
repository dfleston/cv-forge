import { GoogleGenAI } from "@google/genai";
import { CV_TAXONOMY_SCHEMA, NARRATIVE_STYLE_INSTRUCTIONS } from './taxonomySchema';

const BASE_SYSTEM_INSTRUCTION = `
You are an expert CV Extraction and Formatting AI.
Your task is to extract information from a resume/CV (text or PDF) and structure it according to a precise YAML taxonomy.

CRITICAL REQUIREMENTS:
1. Output MUST be valid YAML frontmatter (between --- delimiters) followed by optional Markdown body
2. DO NOT wrap output in code blocks or any other formatting
3. Follow the taxonomy schema EXACTLY - all required fields must be present
4. Extract intelligently - infer missing information when obvious from context
5. Preserve all factual information - do not hallucinate
6. Use the narrative style instructions to shape how you present the content
7. If information is missing and cannot be reasonably inferred, omit optional fields entirely

${CV_TAXONOMY_SCHEMA}
`;

export const processResume = async (
  input: { type: 'pdf' | 'text', data: string },
  narrativeStyleId: string,
  sourceFileName?: string,
  enrichmentText?: string
): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    // Gemini 2.5 Flash is great for document processing
    const modelId = 'gemini-2.5-flash';

    // Get narrative style instructions
    const narrativeInstruction = NARRATIVE_STYLE_INSTRUCTIONS[narrativeStyleId] || NARRATIVE_STYLE_INSTRUCTIONS.standard;

    const fullSystemInstruction = `${BASE_SYSTEM_INSTRUCTION}

${narrativeInstruction}

ADDITIONAL CONTEXT:
- Today's date: ${new Date().toISOString().split('T')[0]}
- Source file: ${sourceFileName || 'uploaded_cv'}
- Narrative style: ${narrativeStyleId}
- Processed timestamp: ${new Date().toISOString()}
`;

    let contents;
    const extractionPrompt = `Extract and structure this CV according to the YAML taxonomy schema provided in the system instructions.

IMPORTANT:
- Output ONLY the YAML frontmatter (between ---) followed by optional markdown body
- Do NOT use code blocks or any wrapper formatting
- Populate ALL required fields
- Infer life_phases (2-5 coherent phases) from the career trajectory
- Link experience entries to life_phases when contextually appropriate
- Apply the specific narrative style instructions provided in the system prompt
- Estimate skill levels (0-100) based on experience duration and complexity

${enrichmentText ? `SUPPLEMENTARY CONTEXT (Use this to enrich the CV with missing details, forward-looking goals, or side projects):
${enrichmentText}` : ''}
`;

    if (input.type === 'pdf') {
      contents = {
        parts: [
          {
            inlineData: {
              mimeType: 'application/pdf',
              data: input.data
            }
          },
          {
            text: extractionPrompt
          }
        ]
      };
    } else {
      contents = {
        parts: [
          {
            text: `${extractionPrompt}\n\nRAW CV TEXT:\n\n${input.data}`
          }
        ]
      };
    }

    const response = await ai.models.generateContent({
      model: modelId,
      contents: contents,
      config: {
        systemInstruction: fullSystemInstruction,
        temperature: 0.3, // Lower for more consistent structured output
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response generated from AI");

    return text.trim();

  } catch (error) {
    console.error("Gemini Processing Error:", error);
    throw error;
  }
};
