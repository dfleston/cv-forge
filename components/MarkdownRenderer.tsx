import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Theme } from '../types';
import { parseFrontmatterAndBody } from '../services/exportUtils';
import { StructuredCV } from './StructuredCV';
import { HUGO_THEMES } from '../constants';

interface MarkdownRendererProps {
  content: string;
  theme: Theme;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, theme }) => {
  const parsed = parseFrontmatterAndBody(content);

  // Map internal theme ID to HUGO_THEMES definition
  const themeKey = (theme?.id === 'modern' ? 'modern_tech' :
    theme?.id === 'classic' ? 'executive' :
      theme?.id === 'minimal' ? 'minimalist' :
        theme?.id === 'developer' ? 'monospace' : 'modern_tech') as keyof typeof HUGO_THEMES;

  const themeDefinition = HUGO_THEMES[themeKey] || HUGO_THEMES.modern_tech;

  // Defensive check for data structure
  const hasValidData = parsed && parsed.data && parsed.data.cv_data;

  if (parsed && !parsed.data) {
    console.error("YAML extraction succeeded but parsing failed. Check for valid YAML structure.");
  }

  try {
    if (hasValidData) {
      return (
        <div className={`p-8 md:p-12 min-h-[1000px] bg-white shadow-sm ${theme.styles.container}`}>
          <StructuredCV data={parsed.data.cv_data!} theme={themeDefinition} />
          {parsed?.body && (
            <div className="mt-12 pt-8 border-t border-slate-100">
              <h2 className={themeDefinition.sectionTitle + " mb-4"}>Additional Details</h2>
              <ReactMarkdown
                components={{
                  h1: ({ node, ...props }) => <h1 className={theme.styles.h1} {...props} />,
                  h2: ({ node, ...props }) => <h2 className={theme.styles.h2} {...props} />,
                  h3: ({ node, ...props }) => <h3 className={theme.styles.h3} {...props} />,
                  p: ({ node, ...props }) => <p className={theme.styles.p} {...props} />,
                  ul: ({ node, ...props }) => <ul className={theme.styles.ul} {...props} />,
                  li: ({ node, ...props }) => <li className={theme.styles.li} {...props} />,
                  hr: ({ node, ...props }) => <hr className={theme.styles.hr} {...props} />,
                  a: ({ node, ...props }) => <a className={theme.styles.link} {...props} />,
                  strong: ({ node, ...props }) => <strong className={theme.styles.strong} {...props} />,
                  blockquote: ({ node, ...props }) => <blockquote className={theme.styles.blockquote} {...props} />,
                }}
              >
                {parsed.body}
              </ReactMarkdown>
            </div>
          )}
        </div>
      );
    }
  } catch (error) {
    console.error("Rendering error in StructuredCV:", error);
    // Explicitly fall through to plain markdown on catch
  }

  // Fallback to plain markdown if parsing fails or components crash
  // If parsing failed, we try to at least show the body if available, or a stripped version
  const displayContent = parsed?.body || content;

  return (
    <div className={`p-8 md:p-12 min-h-[1000px] bg-white shadow-sm ${theme.styles.container}`}>
      {(!hasValidData) && (
        <div className="mb-8 p-4 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-xs print:hidden">
          <p className="font-bold mb-1">Notice: Structured View Unavailable</p>
          <p>The AI formatted the data in a way that couldn't be automatically rendered (likely a YAML syntax error or missing "cv_data" key). Showing raw content instead.</p>
          <pre className="mt-2 p-2 bg-amber-100 rounded overflow-x-auto max-h-40">
            {parsed ? "YAML Extract Start: " + parsed.frontmatter.slice(0, 100) + "..." : "No YAML found"}
          </pre>
        </div>
      )}
      <ReactMarkdown
        components={{
          h1: ({ node, ...props }) => <h1 className={theme.styles.h1} {...props} />,
          h2: ({ node, ...props }) => <h2 className={theme.styles.h2} {...props} />,
          h3: ({ node, ...props }) => <h3 className={theme.styles.h3} {...props} />,
          p: ({ node, ...props }) => <p className={theme.styles.p} {...props} />,
          ul: ({ node, ...props }) => <ul className={theme.styles.ul} {...props} />,
          li: ({ node, ...props }) => <li className={theme.styles.li} {...props} />,
          hr: ({ node, ...props }) => <hr className={theme.styles.hr} {...props} />,
          a: ({ node, ...props }) => <a className={theme.styles.link} {...props} />,
          strong: ({ node, ...props }) => <strong className={theme.styles.strong} {...props} />,
          blockquote: ({ node, ...props }) => <blockquote className={theme.styles.blockquote} {...props} />,
        }}
      >
        {displayContent}
      </ReactMarkdown>
    </div>
  );
};
