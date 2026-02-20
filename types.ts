export enum AppState {
  IDLE = 'IDLE',
  PROCESSING = 'PROCESSING',
  PREVIEW = 'PREVIEW',
  ERROR = 'ERROR'
}

export type ViewMode = 'preview' | 'markdown';

export interface Theme {
  id: string;
  name: string;
  description: string;
  styles: {
    container: string;
    h1: string;
    h2: string;
    h3: string;
    p: string;
    ul: string;
    li: string;
    hr: string;
    link: string;
    strong: string;
    blockquote: string;
  };
}

export interface NarrativeStyle {
  id: string;
  name: string;
  description: string;
  prompt: string;
}

export interface ProcessingError {
  title: string;
  message: string;
}

// ============================================
// ENHANCED CV TAXONOMY TYPES
// ============================================

export type ExperienceType = 
  | 'full-time' 
  | 'part-time' 
  | 'freelance' 
  | 'side_project' 
  | 'sabbatical' 
  | 'founding' 
  | 'volunteering' 
  | 'caregiving' 
  | 'travel';

export type LifePhaseType = 
  | 'formation' 
  | 'professional' 
  | 'passion-turned-profession' 
  | 'transition' 
  | 'sabbatical';

export type AccomplishmentType = 
  | 'publication' 
  | 'project' 
  | 'award' 
  | 'speaking' 
  | 'patent' 
  | 'certification';

export type ProjectStatus = 'active' | 'completed' | 'archived' | 'on-hold';

export interface Contact {
  email: string;
  phone?: string;
  website?: string;
}

export interface Social {
  github?: string;
  linkedin?: string;
  twitter?: string;
  [key: string]: string | undefined;
}

export interface Personal {
  name: string;
  title: string;
  tagline: string;
  location: string;
  contact: Contact;
  social: Social;
}

export interface StyleMeta {
  tone: string;
  length: 'short' | 'medium' | 'long';
}

export interface Narrative {
  short: string;
  long: string;
  style_meta?: StyleMeta;
}

export interface LifePhase {
  phase: string;
  period: string;
  type: LifePhaseType;
  description: string;
  parallel?: boolean | string[];
  tags?: string[];
}

export interface LifeEvent {
  year: number;
  event: string;
  icon?: string;
}

export interface Experience {
  title: string;
  company: string;
  location: string;
  phase?: string;
  type: ExperienceType;
  parallel?: boolean;
  commitment?: string;
  start_date: string;
  end_date: string;
  current?: boolean;
  highlights: string[];
  skills_used?: string[];
  impact?: string;
}

export interface Project {
  name: string;
  tagline: string;
  period: string;
  role: string;
  phase?: string;
  url?: string;
  status: ProjectStatus;
  impact?: string;
  stack: string[];
  highlights?: string[];
}

export interface Education {
  degree: string;
  field: string;
  institution: string;
  location: string;
  graduation_date: string;
  honors?: string[];
  thesis?: string;
  coursework?: string[];
}

export interface TechnicalSkill {
  name: string;
  level: number;
  years: number;
  keywords?: string[];
  category: string;
  acquired?: string;
}

export interface Skills {
  technical: TechnicalSkill[];
  soft: string[];
  meta?: string[];
  values?: string[];
}

export interface Accomplishment {
  type: AccomplishmentType;
  title: string;
  date: string;
  venue?: string;
  organization?: string;
  description?: string;
  url?: string;
  citations?: number;
  impact?: string;
  audience?: number;
  location?: string;
}

export interface Certification {
  name: string;
  issuer: string;
  date: string;
  credential_id?: string;
  url?: string;
}

export interface Language {
  language: string;
  proficiency: string;
  level?: string;
}

export interface CVData {
  personal: Personal;
  narrative: Narrative;
  summary?: { content: string };
  life_phases?: LifePhase[];
  life_events?: LifeEvent[];
  experience: Experience[];
  projects?: Project[];
  education: Education[];
  skills: Skills;
  accomplishments?: Accomplishment[];
  certifications?: Certification[];
  languages?: Language[];
  interests?: string[];
}

// Theme definition for Hugo export
export interface ThemeDefinition {
  container: string;
  header: string;
  sidebar?: string;
  sectionTitle: string;
  text: string;
  link: string;
  accent: string;
  card: string;
  badge: string;
  timeline: string;
  hr: string;
  printContainer?: string;
}

export type ThemesMap = Record<string, ThemeDefinition>;

export interface CVFrontmatter {
  title: string;
  type: 'cv';
  date: string;
  narrative_style: string;
  processed_date: string;
  source_file: string;
  default_theme: string;
  themes: ThemesMap;
  cv_data: CVData;
}
