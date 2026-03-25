import { HUGO_THEMES } from '../constants';
import { CVFrontmatter } from '../types';

/**
 * Slugify a string for use in filenames
 */
function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
}

import yaml from 'js-yaml';

/**
 * Parse YAML frontmatter and markdown body from Gemini output
 */
export function parseFrontmatterAndBody(markdownContent: string): {
  frontmatter: string;
  body: string;
  data: CVFrontmatter | null;
} | null {
  // Pre-process: strip markdown code block wrappers if the entire content is wrapped
  let cleanedContent = markdownContent.trim();

  // Ultra-aggressive cleaning: find the first and last '---' even if surrounded by backticks or text
  let startIdx = cleanedContent.indexOf('---');

  if (startIdx === -1) {
    // Fallback: search for "cv_data:" if no --- delimiters exist
    const cvDataIdx = cleanedContent.indexOf('cv_data:');
    if (cvDataIdx !== -1) {
      console.warn('No --- delimiters found, but "cv_data:" detected. Attempting to parse from start.');
      startIdx = 0; // Or maybe we just try to parse the whole block
    } else {
      console.warn('No frontmatter delimiters found and no "cv_data" key detected.');
      return null;
    }
  }

  let endIdx = cleanedContent.indexOf('---', startIdx + 3);

  // If no closing ---, but we have content, take until the end or look for a logical break
  if (endIdx === -1) {
    console.warn('Incomplete frontmatter: missing closing ---. Parsing until end of string.');
    endIdx = cleanedContent.length;
  }

  const rawFrontmatter = cleanedContent.slice(startIdx + (cleanedContent[startIdx] === '-' ? 3 : 0), endIdx).trim();
  const body = cleanedContent.slice(endIdx + 3).trim();

  // Strip common markdown noise
  const strippedFrontmatter = rawFrontmatter
    .replace(/^```yaml\s*/i, '')
    .replace(/^```\s*/, '')
    .replace(/```$/, '')
    .trim();

  let data: CVFrontmatter | null = null;
  try {
    data = yaml.load(strippedFrontmatter) as CVFrontmatter;
    if (data && !data.cv_data) {
      console.warn('Parsed YAML successfully but "cv_data" key is missing.');
    }
  } catch (e) {
    console.error('YAML Parsing Exception:', e);
    // If it's a "folded" or malformed YAML, try a slightly different cleaning
    console.log('Attempting secondary cleaning on failed YAML string...');
  }

  return {
    frontmatter: strippedFrontmatter,
    body,
    data
  };
}

/**
 * Inject Hugo themes into the frontmatter YAML string
 */
function injectThemesIntoFrontmatter(frontmatterYaml: string): string {
  // Parse the YAML to inject themes
  // For simplicity, we'll append the themes at the end before cv_data
  // This assumes the frontmatter has a predictable structure

  const themesYaml = `themes:
  modern_tech:
    container: "${HUGO_THEMES.modern_tech.container}"
    header: "${HUGO_THEMES.modern_tech.header}"
    sectionTitle: "${HUGO_THEMES.modern_tech.sectionTitle}"
    text: "${HUGO_THEMES.modern_tech.text}"
    link: "${HUGO_THEMES.modern_tech.link}"
    accent: "${HUGO_THEMES.modern_tech.accent}"
    card: "${HUGO_THEMES.modern_tech.card}"
    badge: "${HUGO_THEMES.modern_tech.badge}"
    timeline: "${HUGO_THEMES.modern_tech.timeline}"
    hr: "${HUGO_THEMES.modern_tech.hr}"
    printContainer: "${HUGO_THEMES.modern_tech.printContainer}"
  executive:
    container: "${HUGO_THEMES.executive.container}"
    header: "${HUGO_THEMES.executive.header}"
    sectionTitle: "${HUGO_THEMES.executive.sectionTitle}"
    text: "${HUGO_THEMES.executive.text}"
    link: "${HUGO_THEMES.executive.link}"
    accent: "${HUGO_THEMES.executive.accent}"
    card: "${HUGO_THEMES.executive.card}"
    badge: "${HUGO_THEMES.executive.badge}"
    timeline: "${HUGO_THEMES.executive.timeline}"
    hr: "${HUGO_THEMES.executive.hr}"
    printContainer: "${HUGO_THEMES.executive.printContainer}"
  minimalist:
    container: "${HUGO_THEMES.minimalist.container}"
    header: "${HUGO_THEMES.minimalist.header}"
    sectionTitle: "${HUGO_THEMES.minimalist.sectionTitle}"
    text: "${HUGO_THEMES.minimalist.text}"
    link: "${HUGO_THEMES.minimalist.link}"
    accent: "${HUGO_THEMES.minimalist.accent}"
    card: "${HUGO_THEMES.minimalist.card}"
    badge: "${HUGO_THEMES.minimalist.badge}"
    timeline: "${HUGO_THEMES.minimalist.timeline}"
    hr: "${HUGO_THEMES.minimalist.hr}"
    printContainer: "${HUGO_THEMES.minimalist.printContainer}"
  monospace:
    container: "${HUGO_THEMES.monospace.container}"
    header: "${HUGO_THEMES.monospace.header}"
    sectionTitle: "${HUGO_THEMES.monospace.sectionTitle}"
    text: "${HUGO_THEMES.monospace.text}"
    link: "${HUGO_THEMES.monospace.link}"
    accent: "${HUGO_THEMES.monospace.accent}"
    card: "${HUGO_THEMES.monospace.card}"
    badge: "${HUGO_THEMES.monospace.badge}"
    timeline: "${HUGO_THEMES.monospace.timeline}"
    hr: "${HUGO_THEMES.monospace.hr}"
    printContainer: "${HUGO_THEMES.monospace.printContainer}"`;

  // Find where cv_data starts and inject themes before it
  const cvDataIndex = frontmatterYaml.indexOf('cv_data:');
  if (cvDataIndex !== -1) {
    return (
      frontmatterYaml.slice(0, cvDataIndex) +
      themesYaml +
      '\n' +
      frontmatterYaml.slice(cvDataIndex)
    );
  }

  // If cv_data not found, append at the end
  return frontmatterYaml + '\n' + themesYaml;
}

/**
 * Export CV in Hugo-compatible format
 */
export function exportHugoFormat(markdownContent: string, suggestedFileName?: string): void {
  try {
    const parsed = parseFrontmatterAndBody(markdownContent);

    if (!parsed) {
      throw new Error('Could not parse frontmatter from markdown content');
    }

    // Inject Hugo themes into the frontmatter
    const enhancedFrontmatter = injectThemesIntoFrontmatter(parsed.frontmatter);

    // Reconstruct the full markdown with enhanced frontmatter
    const fullContent = `---\n${enhancedFrontmatter}\n---\n\n${parsed.body}`;

    // Generate filename
    const timestamp = new Date().toISOString().slice(0, 10);
    const fileName = suggestedFileName
      ? `${slugify(suggestedFileName)}-${timestamp}.md`
      : `cv-${timestamp}.md`;

    // Create download
    downloadText(fileName, fullContent);

    console.log(`✓ Hugo CV exported: ${fileName}`);
  } catch (error) {
    console.error('Export failed:', error);
    throw new Error(`Failed to export Hugo format: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Download text content as a file
 */
function downloadText(filename: string, text: string): void {
  const blob = new Blob([text], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Extract name from frontmatter for filename suggestion
 */
export function extractNameFromMarkdown(markdownContent: string): string | null {
  try {
    const parsed = parseFrontmatterAndBody(markdownContent);
    if (!parsed) return null;

    // Try to extract name from YAML frontmatter
    const nameMatch = parsed.frontmatter.match(/name:\s*["']?([^"'\n]+)["']?/);
    if (nameMatch) {
      return nameMatch[1].trim();
    }

    // Try to extract from title
    const titleMatch = parsed.frontmatter.match(/title:\s*["']?([^"'\n—–-]+)/);
    if (titleMatch) {
      return titleMatch[1].trim();
    }

    return null;
  } catch {
    return null;
  }
}
