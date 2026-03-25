import { GoogleGenAI } from "@google/genai";
import { CV_TAXONOMY_SCHEMA, NARRATIVE_STYLE_INSTRUCTIONS } from './taxonomySchema';
import { JobStrategy, CVLength, HRGap } from '../types';

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
  cvLength: CVLength,
  hrGaps: HRGap[],
  sourceFileName?: string,
  enrichmentText?: string,
  jobStrategy?: JobStrategy
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
- Output ONLY the YAML frontmatter (delimited by ---) followed by the markdown body.
- The YAML MUST contain the "cv_data" key containing all structured fields.
- Do NOT use code blocks or any "Here is your CV" preambles.

**CRITICAL LENGTH CONSTRAINT (${cvLength}):**
${cvLength === 'Executive' ? `- STRICT 1-PAGE TARGET.
- Set cv_data.narrative.style_meta.length to "short".
- OMIT cv_data.narrative.long (set to empty string).
- SELECT the 3-4 most recent or impactful roles to detail in the 'experience' array.
- SYNTHESIZE all remaining work history into a final, single 'experience' entry titled "Prior Leadership & Strategic Advisory" with a date range covering the rest.
- MAX 2-3 key 'projects'.
- MAX 3 bullet points per role/project.
- Aggressively prune outdated info (> 8 years old).
- DO NOT just stop; ensure the entire career span is accounted for via synthesis.` :
        cvLength === 'Short' ? `- 2-PAGE STANDARD.
- Set cv_data.narrative.style_meta.length to "medium".
- OMIT cv_data.narrative.long (set to empty string).
- MAX 5-7 years of detailed history.
- Summarize older roles into a single entry if needed.
- MAX 4-5 bullet points per role.
- Focus on key achievements.` :
          `- COMPREHENSIVE (Max 4 pages).
- Set cv_data.narrative.style_meta.length to "long".
- Full career history with detail.
- 5-8 bullet points per role.`}

- Populate ALL required fields for the entries you CHOOSE to keep.
- TAGLINE (cv_data.personal.tagline): STRICT MAX 150 CHARACTERS. One punchy sentence.
- NARRATIVE DIFFERENTIATION: 
  - 'tagline' is a 1-sentence hook.
  - 'narrative.short' is a 2-3 sentence professional summary. 
  - 'narrative.long' (COMPREHENSIVE ONLY) is a multi-paragraph detail of philosophies and goals.
- DO NOT repeat sentences across tagline, short, and long fields. Each must offer new value.
- Infer life_phases (2-5 coherent phases) from the career trajectory.
- Link experience entries to life_phases when contextually appropriate.
- Apply the specific narrative style instructions provided in the system prompt.
- Estimate skill levels (0-100) based on experience duration and complexity.

**HR ANALYSIS & CLARIFICATIONS:**
The candidate has provided the following answers to HR gap questions. Integrate these into the relevant sections (e.g. quantifying impact, clarifying roles):
${hrGaps.filter(g => g.answer).map(g => `Q: ${g.question}\nA: ${g.answer}`).join('\n\n')}

${enrichmentText ? `SUPPLEMENTARY CONTEXT (Use this to enrich the CV with missing details, forward-looking goals, or side projects):\n${enrichmentText}` : ''}

${jobStrategy ? `APPLICATION STRATEGY (Prioritize these ideas and recommendations when shaping the CV content):\nGoal/Idea: ${jobStrategy.idea}\nRecommendations:\n${jobStrategy.recommendations.map(r => `- ${r}`).join('\n')}` : ''}
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
            text: `${extractionPrompt} \n\nRAW CV TEXT: \n\n${input.data} `
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
        maxOutputTokens: 8192, // Ensure enough room for high-density comprehensive CVs
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

export const generateApplicationStrategy = async (
  jobDescription: string,
  cvMarkdown: string
): Promise<JobStrategy> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const modelId = 'gemini-2.5-flash';

    const prompt = `
    Analyze the following Job Description(or URL / Company info) and the candidate's current CV.
    Propose an application strategy to make the candidate stand out for this specific role.
    
    JOB DESCRIPTION / INFO:
    ${jobDescription}
    
    CURRENT CV:
    ${cvMarkdown}
    
    Output your response in valid JSON format:
    {
      "idea": "A one-sentence high-level strategy/pitch (e.g., 'Position John as a cloud-native security expert with strong leadership experience').",
        "recommendations": [
          "Specifically highlight X and Y...",
          "De-emphasize Z...",
          "Use keywords like A, B, C..."
        ]
    }
    `;

    const response = await ai.models.generateContent({
      model: modelId,
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        temperature: 0.7,
        responseMimeType: "application/json"
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response generated from AI");

    return JSON.parse(text) as JobStrategy;

  } catch (error) {
    console.error("Strategy Generation Error:", error);
    throw error;
  }
};

export const analyzeResumeGaps = async (
  rawText: string
): Promise<HRGap[]> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const modelId = 'gemini-2.5-flash';

    const prompt = `
    Act as a highly experienced Senior HR Professional and Executive Recruiter.
    Analyze the following raw CV text.Your goal is to identify gaps, vague bullet points, or unclear roles that prevent the candidate from standing out.

    Specifically look for:
      - Missing quantification(e.g., "Led large transformation" -> "What was the budget or ROI?")
        - Unclear company context(e.g., "Chief Group Business Officer" -> "Is this a startup? 500-person firm?")
          - Vague achievement language instead of concrete results
            - Disconnected consulting roles that look like employment gaps

    RAW CV TEXT:
    ${rawText}

    Output your response in valid JSON format as an array of objects:
    [
      {
        "id": "unique-string-id",
        "context": "Context from the CV (e.g., 'At House of Procurement...')",
        "question": "The specific, sharp question to ask the candidate to get better data."
      }
    ]
    
    Limit to maximum 5 of the most critical questions.
    `;

    const response = await ai.models.generateContent({
      model: modelId,
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        temperature: 0.5,
        responseMimeType: "application/json"
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response generated from AI");

    return JSON.parse(text) as HRGap[];

  } catch (error) {
    console.error("HR Gap Analysis Error:", error);
    throw error;
  }
};
