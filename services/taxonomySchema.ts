// CV Taxonomy Schema for Gemini AI
// This schema defines the structure that Gemini should follow when extracting CV data

export const CV_TAXONOMY_SCHEMA = `
YAML Frontmatter Structure (all fields are required unless marked optional):

title: "[Full Name] — CV"
type: cv
date: [YYYY-MM-DD, today's date]
narrative_style: [one of: accomplishment|narrative|functional|intentional|standard]
processed_date: [ISO 8601 UTC timestamp]
source_file: "[original filename]"
default_theme: "modern_tech"
themes: [will be injected automatically, do not populate]

cv_data:
  personal:
    name: string
    title: string (job title or professional identity)
    tagline: string (brief professional motto or focus)
    location: string (city, country)
    contact:
      email: string
      phone: string (optional)
      website: string (optional)
    social:
      github: string (username only, optional)
      linkedin: string (username/slug only, optional)
      twitter: string (username only, optional)
  
  narrative:
    short: string (1-2 sentences: career arc summary)
    long: string (2-4 paragraphs: full narrative, career journey, motivations)
    style_meta: (optional)
      tone: string (e.g., "executive", "technical", "academic")
      length: string (short|medium|long)
  
  summary: (optional)
    content: string (professional summary or objective statement)
  
  life_phases: (optional, but highly recommended)
    - phase: string (name of this life phase)
      period: string (e.g., "2015–2020")
      type: string (formation|professional|passion-turned-profession|transition|sabbatical)
      description: string (2-3 sentences describing this era)
      parallel: boolean OR array of strings (if array, list parallel activities)
      tags: array of strings (optional, e.g., ["full-time", "remote"])
  
  life_events: (optional)
    - year: number
      event: string (brief description)
      icon: string (optional emoji or symbol)
  
  experience:
    - title: string
      company: string
      location: string
      phase: string (optional, references a life_phases.phase)
      type: string (full-time|part-time|freelance|side_project|sabbatical|founding|volunteering|caregiving|travel)
      parallel: boolean (optional, true if overlaps with other experience)
      commitment: string (optional, e.g., "40h/week", "weekends")
      start_date: string (YYYY-MM format)
      end_date: string (YYYY-MM OR "present")
      current: boolean (optional, true if end_date is "present")
      highlights: array of strings (3-7 impact-oriented bullet points)
      skills_used: array of strings (optional, key technologies/skills)
      impact: string (optional, one-line quantifiable impact summary)
  
  projects: (optional)
    - name: string
      tagline: string (brief description)
      period: string (e.g., "2022–present")
      role: string
      phase: string (optional, references a life_phases.phase)
      url: string (optional)
      status: string (active|completed|archived|on-hold)
      impact: string (optional, quantifiable impact)
      stack: array of strings (technologies used)
      highlights: array of strings (optional, 2-4 key achievements)
  
  education:
    - degree: string (e.g., "Master of Science", "Bachelor of Arts")
      field: string (e.g., "Computer Science")
      institution: string
      location: string
      graduation_date: string (YYYY-MM format)
      honors: array of strings (optional, e.g., ["Cum Laude", "Honors"])
      thesis: string (optional, thesis title)
      coursework: array of strings (optional, relevant courses)
  
  skills:
    technical:
      - name: string (skill name)
        level: number (0-100, expertise level)
        years: number (years of experience)
        keywords: array of strings (optional, sub-skills or tools)
        category: string (e.g., "Programming", "Blockchain", "AI")
        acquired: string (optional, YYYY when first learned)
    soft: array of strings (e.g., ["Leadership", "Communication"])
    meta: array of strings (optional, thinking styles, e.g., ["First-principles thinking"])
    values: array of strings (optional, professional values, e.g., ["Long-term orientation"])
  
  accomplishments: (optional)
    - type: string (publication|project|award|speaking|patent|certification)
      title: string
      date: string (YYYY-MM format)
      venue: string (optional, journal/conference/event)
      organization: string (optional, awarding body)
      description: string (optional, brief description)
      url: string (optional, link to work/announcement)
      citations: number (optional, for publications)
      impact: string (optional, impact description)
      audience: number (optional, for speaking engagements)
      location: string (optional, for events)
  
  certifications: (optional)
    - name: string
      issuer: string
      date: string (YYYY-MM format)
      credential_id: string (optional)
      url: string (optional, verification link)
  
  languages: (optional)
    - language: string
      proficiency: string (e.g., "Native", "Fluent", "Intermediate")
      level: string (optional, CEFR level like "C2", "B1")
  
  interests: (optional)
    array of strings (hobbies, passions, research interests)

EXTRACTION RULES:
1. Dates: Always use YYYY-MM format or "present" for ongoing positions
2. Link experience.phase to life_phases.phase when contextually appropriate
3. Highlights: 3-7 bullets per experience, focus on impact and results
4. Skills: Estimate level (0-100) and years based on context and experience duration
5. Empty fields: Omit optional sections if no data available
6. Spelling: Preserve British/American spelling from source document
7. Quantify: Include metrics, percentages, numbers wherever present in source
8. Chronology: Order experience/education by date (most recent first)
9. Life phases: Try to identify 2-5 coherent life phases based on career arc
10. Projects vs Experience: Side projects, open source, and personal ventures go in projects; employment goes in experience

OUTPUT FORMAT:
Output must be valid YAML frontmatter followed by an optional Markdown body:

---
[YAML frontmatter as specified above]
---

[Optional markdown body: Can include additional narrative, publications, or supplementary information that doesn't fit the structured taxonomy]
`;

export const NARRATIVE_STYLE_INSTRUCTIONS: Record<string, string> = {
  accomplishment: `
Apply the "Accomplishment-Oriented" narrative style:
- Prioritize quantifiable results and metrics in highlights
- Use strong action verbs (Spearheaded, Orchestrated, Drove, Achieved)
- Each highlight should ideally start with a verb and include a measurable outcome
- Focus on impact and business value
- Example: "Increased team velocity by 40% through implementation of agile practices"
`,
  narrative: `
Apply the "Narrative/Academic" style:
- Write fuller descriptions in the narrative.long section
- Use more descriptive, prose-like highlights
- Connect experiences to show progression and growth
- Reflect on contributions and their meaning
- Suitable for academic or research-focused CVs
`,
  functional: `
Apply the "Skills-Based (Functional)" style:
- Group highlights by skill category when possible
- Emphasize transferable skills across experiences
- Cross-reference skills_used frequently
- The skills section should be comprehensive and central
- De-emphasize strict chronology in favor of competency demonstration
`,
  intentional: `
Apply the "Intentional/Objective" style:
- Start with a strong, forward-looking summary.content that states career goals
- Frame all experience and accomplishments as building toward this goal
- Emphasize trajectory and future potential
- Include what the candidate intends to contribute in next roles
- Narrative should have a clear directional arc
`,
  standard: `
Apply the "Standard Professional" style:
- Maintain clean chronological structure
- Balance duties with achievements
- Keep tone neutral and professional
- Use traditional CV formatting conventions
- Highlights should be concise and factual
`
};
