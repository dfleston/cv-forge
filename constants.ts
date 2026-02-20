import { Theme, NarrativeStyle, ThemesMap, ThemeDefinition } from './types';

export const NARRATIVE_STYLES: NarrativeStyle[] = [
  {
    id: 'accomplishment',
    name: 'Accomplishment-Oriented',
    description: 'Focuses on quantifiable results, metrics, and specific outcomes rather than just duties.',
    prompt: 'Adopt an "Accomplishment-Oriented" approach. Shift focus from listing duties to highlighting specific, quantifiable results. Use numbers, percentages, and metrics (e.g., "Grew revenue by 20%"). Start bullets with strong action verbs like Spearheaded, Orchestrated, Executed.'
  },
  {
    id: 'narrative',
    name: 'Narrative / Academic',
    description: 'Uses descriptive paragraphs to connect experiences and reflect on contributions. Good for research/academia.',
    prompt: 'Adopt a "Narrative CV" style. Move away from strict bulleted lists towards short, descriptive paragraphs that tell the story of the candidates contributions and impact. Reflect on the role played in achievements. Use full sentences and a more prose-like structure where appropriate.'
  },
  {
    id: 'functional',
    name: 'Skills-Based (Functional)',
    description: 'Groups experience by skill sets rather than chronological job history.',
    prompt: 'Adopt a "Skills-Based (Functional)" approach. Structure the main body by key skill categories (e.g., "Project Management", "Technical Development") rather than chronological job history. Extract specific achievements and weave them into these skill categories. Place a brief work history at the bottom.'
  },
  {
    id: 'intentional',
    name: 'Intentional / Objective',
    description: 'Starts with a strong objective statement focused on future goals and specific contributions.',
    prompt: 'Adopt an "Intentional" approach. Begin with a strong, forward-looking Objective Statement that clarifies career goals and what the candidate intends to contribute. Frame the rest of the content to support this specific trajectory, focusing on potential rather than just past history.'
  },
  {
    id: 'standard',
    name: 'Standard Professional',
    description: 'The classic, balanced approach suitable for most general applications.',
    prompt: 'Adopt a standard, balanced professional approach. Maintain a clean chronological format. Balance duties with achievements. Keep tone neutral and professional.'
  }
];

export const THEMES: Theme[] = [
  {
    id: 'modern',
    name: 'Modern Tech',
    description: 'Clean, sans-serif, optimized for readability with blue accents.',
    styles: {
      container: 'font-sans text-gray-800 leading-relaxed',
      h1: 'text-4xl font-bold text-gray-900 mb-2 tracking-tight border-b-4 border-blue-500 pb-2',
      h2: 'text-2xl font-semibold text-gray-800 mt-8 mb-4 flex items-center',
      h3: 'text-xl font-medium text-blue-600 mt-4 mb-2',
      p: 'mb-4 text-gray-600 text-sm leading-6',
      ul: 'list-disc list-outside ml-5 mb-4 space-y-1 text-gray-600 text-sm',
      li: 'pl-1 marker:text-blue-500',
      hr: 'border-t border-gray-200 my-6',
      link: 'text-blue-600 hover:text-blue-800 underline decoration-blue-300 decoration-1',
      strong: 'font-semibold text-gray-900',
      blockquote: 'border-l-4 border-blue-200 pl-4 italic text-gray-500 my-4'
    }
  },
  {
    id: 'classic',
    name: 'Executive',
    description: 'Traditional serif typography, authoritative and timeless.',
    styles: {
      container: 'font-serif text-gray-900 leading-relaxed',
      h1: 'text-4xl font-bold text-center mb-6 text-gray-900 uppercase tracking-widest',
      h2: 'text-xl font-bold text-gray-900 mt-8 mb-3 border-b border-gray-900 pb-1 uppercase tracking-wide',
      h3: 'text-lg font-bold text-gray-800 mt-4 mb-1',
      p: 'mb-3 text-justify text-sm',
      ul: 'list-disc list-outside ml-4 mb-4 space-y-0.5 text-sm',
      li: 'pl-1 marker:text-gray-900',
      hr: 'border-t-2 border-gray-900 my-6',
      link: 'text-gray-900 underline decoration-gray-900',
      strong: 'font-bold text-black',
      blockquote: 'text-center italic text-gray-600 my-6'
    }
  },
  {
    id: 'minimal',
    name: 'Minimalist',
    description: 'Stark, high contrast, lots of whitespace.',
    styles: {
      container: 'font-sans text-gray-900 antialiased',
      h1: 'text-5xl font-light text-gray-900 mb-12 tracking-tighter',
      h2: 'text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mt-10 mb-6',
      h3: 'text-lg font-normal text-gray-900 mt-6 mb-2',
      p: 'mb-6 text-sm font-light text-gray-600 max-w-prose',
      ul: 'list-none ml-0 mb-6 space-y-2 text-sm text-gray-600',
      li: 'flex gap-2 before:content-["-"] before:text-gray-300',
      hr: 'border-t border-gray-100 my-10',
      link: 'text-gray-900 border-b border-gray-300 hover:border-gray-900 transition-colors',
      strong: 'font-medium text-gray-900',
      blockquote: 'text-sm text-gray-400 pl-4'
    }
  },
  {
    id: 'developer',
    name: 'Monospace',
    description: 'Code-inspired look, perfect for software engineers.',
    styles: {
      container: 'font-mono text-slate-800 text-sm',
      h1: 'text-2xl font-bold text-emerald-600 mb-6 before:content-[">_"] before:mr-2',
      h2: 'text-lg font-bold text-slate-900 mt-8 mb-4 bg-slate-100 p-1 inline-block',
      h3: 'text-base font-bold text-emerald-700 mt-4 mb-2',
      p: 'mb-4 leading-relaxed',
      ul: 'list-none ml-0 mb-4 space-y-1',
      li: 'before:content-["*"] before:text-emerald-500 before:mr-2',
      hr: 'border-t border-dashed border-slate-300 my-6',
      link: 'text-emerald-600 hover:text-emerald-800',
      strong: 'font-bold text-slate-900 bg-emerald-50 px-1 rounded',
      blockquote: 'border-l-2 border-emerald-500 pl-4 text-slate-500'
    }
  }
];

export const INITIAL_MARKDOWN = `
# John Doe
## Software Engineer

> Passionate developer with 5+ years of experience in React and Node.js.

## Experience

### Senior Frontend Engineer @ Tech Corp
*2020 - Present*

* Led migration from legacy codebase to React 18.
* Improved site performance by 40%.
* Mentored junior developers.

### Web Developer @ StartUp Inc
*2018 - 2020*

* Built responsive marketing pages.
* Integrated payment gateways.

## Skills

* **Languages**: TypeScript, JavaScript, Python
* **Frameworks**: React, Next.js, Express
* **Tools**: Git, Docker, AWS
`;

// Hugo-compatible theme definitions for export
export const HUGO_THEMES: ThemesMap = {
  modern_tech: {
    container: 'bg-white text-slate-900 antialiased',
    header: 'border-b-2 border-blue-500 pb-3',
    sectionTitle: 'text-2xl font-semibold text-slate-900 tracking-tight',
    text: 'text-slate-700 leading-relaxed',
    link: 'text-blue-600 hover:text-blue-700 underline decoration-blue-300',
    accent: 'text-blue-700',
    card: 'bg-slate-50 border border-slate-200 rounded-lg shadow-sm p-4',
    badge: 'inline-block bg-blue-50 text-blue-700 border border-blue-200 rounded px-2 py-1 text-xs font-medium',
    timeline: 'border-l-2 border-slate-200 pl-4',
    hr: 'border-t border-slate-200 my-6',
    printContainer: 'bg-white text-black'
  },
  executive: {
    container: 'bg-white text-gray-900 antialiased font-serif',
    header: 'border-b-2 border-gray-900 pb-3',
    sectionTitle: 'text-xl font-bold text-gray-900 uppercase tracking-wide',
    text: 'text-gray-800 leading-relaxed',
    link: 'text-gray-900 underline decoration-gray-900',
    accent: 'text-gray-900',
    card: 'bg-gray-50 border border-gray-300 rounded p-4',
    badge: 'inline-block bg-gray-100 text-gray-900 border border-gray-400 rounded px-2 py-1 text-xs font-semibold uppercase',
    timeline: 'border-l-2 border-gray-900 pl-4',
    hr: 'border-t-2 border-gray-900 my-6',
    printContainer: 'bg-white text-black'
  },
  minimalist: {
    container: 'bg-white text-gray-900 antialiased',
    header: 'border-b border-gray-100 pb-6',
    sectionTitle: 'text-xs font-bold text-gray-400 uppercase tracking-widest',
    text: 'text-gray-600 leading-loose font-light',
    link: 'text-gray-900 border-b border-gray-300 hover:border-gray-900 no-underline',
    accent: 'text-gray-900',
    card: 'bg-white border border-gray-100 rounded p-6',
    badge: 'inline-block bg-gray-50 text-gray-500 rounded px-2 py-1 text-xs',
    timeline: 'border-l border-gray-100 pl-6',
    hr: 'border-t border-gray-100 my-10',
    printContainer: 'bg-white text-black'
  },
  monospace: {
    container: 'bg-white text-slate-800 antialiased font-mono text-sm',
    header: 'border-b border-dashed border-slate-300 pb-3',
    sectionTitle: 'text-lg font-bold text-slate-900 bg-slate-100 inline-block px-2 py-1',
    text: 'text-slate-800 leading-relaxed',
    link: 'text-emerald-600 hover:text-emerald-800 underline',
    accent: 'text-emerald-700',
    card: 'bg-slate-50 border border-slate-200 rounded p-4 font-mono',
    badge: 'inline-block bg-emerald-50 text-emerald-700 border border-emerald-200 rounded px-2 py-1 text-xs font-bold',
    timeline: 'border-l-2 border-dashed border-slate-300 pl-4',
    hr: 'border-t border-dashed border-slate-300 my-6',
    printContainer: 'bg-white text-black'
  }
};
