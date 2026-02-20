import React, { useState, useEffect } from 'react';
import { Upload, FileText, Download, Wand2, AlertCircle, CheckCircle2, Loader2, Printer, Eye, Code, RefreshCw } from 'lucide-react';
import { THEMES, INITIAL_MARKDOWN, NARRATIVE_STYLES } from './constants';
import { AppState, ProcessingError, Theme, NarrativeStyle, ViewMode } from './types';
import { MarkdownRenderer } from './components/MarkdownRenderer';
import { extractTextFromDocx, readFileAsBase64 } from './services/fileUtils';
import { processResume } from './services/gemini';
import { exportHugoFormat, extractNameFromMarkdown } from './services/exportUtils';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [viewMode, setViewMode] = useState<ViewMode>('preview');

  // Settings
  const [currentTheme, setCurrentTheme] = useState<Theme>(THEMES[0]);
  const [currentNarrative, setCurrentNarrative] = useState<NarrativeStyle>(NARRATIVE_STYLES[0]);

  // Content
  const [markdown, setMarkdown] = useState<string>(INITIAL_MARKDOWN);
  const [rawFile, setRawFile] = useState<{ type: 'pdf' | 'text', data: string, fileName?: string } | null>(null);
  const [enrichmentText, setEnrichmentText] = useState<string>('');
  const [error, setError] = useState<ProcessingError | null>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  // Track if narrative style or enrichment has changed since last generation
  const [needsRegeneration, setNeedsRegeneration] = useState(false);

  useEffect(() => {
    if (appState === AppState.PREVIEW && rawFile) {
      setNeedsRegeneration(true);
    }
  }, [currentNarrative, enrichmentText]);

  const handleDownloadPdf = () => {
    const element = document.getElementById('resume-preview');
    if (!element) return;

    setIsGeneratingPdf(true);

    // Access html2pdf from window object
    const html2pdf = (window as any).html2pdf;

    if (!html2pdf) {
      console.error('html2pdf library not loaded');
      setIsGeneratingPdf(false);
      return;
    }

    const opt = {
      margin: 0,
      filename: 'resume.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, letterRendering: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf()
      .set(opt)
      .from(element)
      .save()
      .then(() => {
        setIsGeneratingPdf(false);
      })
      .catch((err: any) => {
        console.error('PDF generation failed:', err);
        setIsGeneratingPdf(false);
      });
  };

  const handleDownloadMd = () => {
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'resume.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadHugo = () => {
    try {
      const suggestedName = extractNameFromMarkdown(markdown);
      exportHugoFormat(markdown, suggestedName || undefined);
    } catch (err: any) {
      console.error('Hugo export failed:', err);
      setError({
        title: "Export Failed",
        message: err.message || "Failed to export Hugo format."
      });
    }
  };

  const handleProcessResume = async (input: { type: 'pdf' | 'text', data: string, fileName?: string }) => {
    setAppState(AppState.PROCESSING);
    setError(null);
    setNeedsRegeneration(false);

    try {
      const resultMd = await processResume(input, currentNarrative.id, input.fileName, enrichmentText);
      setMarkdown(resultMd);
      setAppState(AppState.PREVIEW);
      // Ensure view is back to preview on success so they see the result
      setViewMode('preview');
    } catch (err: any) {
      console.error(err);
      setError({
        title: "Processing Failed",
        message: err.message || "An unexpected error occurred while processing your resume."
      });
      setAppState(AppState.ERROR);
    }
  };

  const handleRegenerate = () => {
    if (rawFile) {
      handleProcessResume(rawFile);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      let inputData: { type: 'pdf' | 'text', data: string, fileName?: string };

      if (file.type === 'application/pdf') {
        const base64 = await readFileAsBase64(file);
        inputData = { type: 'pdf', data: base64, fileName: file.name };
      } else if (
        file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
        file.name.endsWith('.docx')
      ) {
        const text = await extractTextFromDocx(file);
        inputData = { type: 'text', data: text, fileName: file.name };
      } else {
        throw new Error("Unsupported file format. Please upload PDF or DOCX.");
      }

      setRawFile(inputData);
      handleProcessResume(inputData);

    } catch (err: any) {
      console.error(err);
      setError({
        title: "Upload Failed",
        message: err.message || "Could not read the file."
      });
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 overflow-hidden print:h-auto print:overflow-visible">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 z-10 flex-none h-16 print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-1.5 rounded-lg">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">CV Forge</h1>
          </div>

          <div className="flex items-center gap-3">
            {appState === AppState.PREVIEW && (
              <>
                <button
                  onClick={handleDownloadMd}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 bg-white hover:bg-gray-50 border border-gray-300 rounded-lg transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Download MD
                </button>
                <button
                  onClick={handleDownloadHugo}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-emerald-700 hover:text-emerald-900 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-lg transition-colors"
                >
                  <FileText className="w-4 h-4" />
                  Download for Hugo
                </button>
                <button
                  onClick={handleDownloadPdf}
                  disabled={isGeneratingPdf}
                  className={`flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors ${isGeneratingPdf ? 'opacity-75 cursor-wait' : ''}`}
                >
                  {isGeneratingPdf ? <Loader2 className="w-4 h-4 animate-spin" /> : <Printer className="w-4 h-4" />}
                  {isGeneratingPdf ? 'Generating PDF...' : 'Download PDF'}
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex overflow-hidden print:h-auto print:overflow-visible print:block">

        {/* Sidebar Controls */}
        <aside className="w-96 bg-white border-r border-gray-200 flex flex-col overflow-y-auto z-10 shadow-lg print:hidden">
          <div className="p-6 space-y-8">

            {/* Upload Section */}
            <div className="space-y-4">
              <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">1. Source Document</h2>
              <div className="relative group">
                <input
                  type="file"
                  id="file-upload"
                  className="hidden"
                  accept=".pdf,.docx"
                  onChange={handleFileUpload}
                  disabled={appState === AppState.PROCESSING}
                />
                <label
                  htmlFor="file-upload"
                  className={`
                    flex flex-col items-center justify-center w-full h-24 border-2 border-dashed rounded-xl cursor-pointer transition-all
                    ${appState === AppState.PROCESSING
                      ? 'border-gray-200 bg-gray-50 cursor-not-allowed'
                      : 'border-gray-300 hover:border-blue-500 hover:bg-blue-50 bg-gray-50'}
                  `}
                >
                  {appState === AppState.PROCESSING ? (
                    <div className="flex flex-col items-center gap-2">
                      <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
                      <span className="text-sm text-gray-500">Transforming...</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-1">
                      <Wand2 className="w-6 h-6 text-gray-400 group-hover:text-blue-500 transition-colors" />
                      <div className="text-center">
                        <span className="text-sm font-medium text-gray-900">
                          {rawFile ? "Upload New File" : "Click to Upload"}
                        </span>
                      </div>
                    </div>
                  )}
                </label>
              </div>

              {appState === AppState.ERROR && error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-medium text-red-800">{error.title}</h3>
                    <p className="text-xs text-red-600 mt-1">{error.message}</p>
                  </div>
                </div>
              )}

              {appState === AppState.PREVIEW && !needsRegeneration && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-green-700">Content extracted & formatted</span>
                </div>
              )}
            </div>

            {/* Narrative Strategy */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">2. Narrative Strategy</h2>
                {needsRegeneration && rawFile && (
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 gap-2">
                {NARRATIVE_STYLES.map((style) => (
                  <button
                    key={style.id}
                    onClick={() => setCurrentNarrative(style)}
                    className={`
                      relative p-3 rounded-lg border text-left transition-all
                      ${currentNarrative.id === style.id
                        ? 'border-amber-500 bg-amber-50 ring-1 ring-amber-500/20'
                        : 'border-gray-200 hover:border-gray-300 bg-white'}
                    `}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`font-semibold text-sm ${currentNarrative.id === style.id ? 'text-amber-900' : 'text-gray-900'}`}>
                        {style.name}
                      </span>
                    </div>
                    <p className={`text-xs mt-1 ${currentNarrative.id === style.id ? 'text-amber-800' : 'text-gray-500'}`}>
                      {style.description}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Enrichment Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">3. Enrich & Refine</h2>
                <Wand2 className="w-3.5 h-3.5 text-blue-500" />
              </div>
              <div className="bg-blue-50/50 border border-blue-100 rounded-lg p-4 space-y-3">
                <p className="text-[10px] text-blue-700 font-medium leading-relaxed">
                  Add missing side-projects, skills, or target goals to help Gemini shape your story more intentionally.
                </p>
                <textarea
                  value={enrichmentText}
                  onChange={(e) => setEnrichmentText(e.target.value)}
                  placeholder="e.g. I built a SaaS in my spare time using Rust. I want to transition into Lead AI roles."
                  className="w-full h-32 p-3 text-xs bg-white border border-blue-100 rounded-md focus:ring-2 focus:ring-blue-500 outline-none resize-none shadow-inner"
                />
              </div>

              {needsRegeneration && rawFile && (
                <button
                  onClick={handleRegenerate}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg shadow-sm transition-all text-sm font-medium animate-pulse"
                >
                  <RefreshCw className="w-4 h-4" />
                  Regenerate with Enrichment
                </button>
              )}
            </div>

            {/* Visual Theme Selector */}
            <div className="space-y-4">
              <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">4. Visual Design</h2>
              <div className="grid grid-cols-1 gap-2">
                {THEMES.map((theme) => (
                  <button
                    key={theme.id}
                    onClick={() => setCurrentTheme(theme)}
                    className={`
                      relative p-3 rounded-lg border text-left transition-all
                      ${currentTheme.id === theme.id
                        ? 'border-blue-600 bg-blue-50 ring-1 ring-blue-600/20'
                        : 'border-gray-200 hover:border-gray-300 bg-white'}
                    `}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`font-semibold text-sm ${currentTheme.id === theme.id ? 'text-blue-900' : 'text-gray-900'}`}>
                        {theme.name}
                      </span>
                      {currentTheme.id === theme.id && (
                        <div className="w-2 h-2 rounded-full bg-blue-600" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

          </div>
        </aside>

        {/* Preview Area */}
        <div className="flex-1 bg-gray-100/50 flex flex-col print:bg-white print:block">

          {/* View Toggles */}
          <div className="flex-none px-8 pt-6 pb-2 print:hidden">
            <div className="flex items-center justify-between max-w-[210mm] mx-auto w-full">
              <div className="bg-gray-200 p-1 rounded-lg flex gap-1">
                <button
                  onClick={() => setViewMode('preview')}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${viewMode === 'preview'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                    }`}
                >
                  <Eye className="w-4 h-4" />
                  Visual Preview
                </button>
                <button
                  onClick={() => setViewMode('markdown')}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${viewMode === 'markdown'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                    }`}
                >
                  <Code className="w-4 h-4" />
                  Markdown Source
                </button>
              </div>
              <span className="text-xs text-gray-400">A4 Size</span>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-8 pb-8 flex justify-center print:p-0 print:overflow-visible print:block">
            <div className="max-w-[210mm] w-full print:max-w-none print:w-full">

              {/* The A4 Paper Container */}
              <div
                id="resume-preview"
                className="bg-white shadow-xl min-h-[297mm] transition-all duration-300 ease-in-out print:shadow-none print:m-0 print:w-full"
              >
                {viewMode === 'preview' ? (
                  <MarkdownRenderer content={markdown} theme={currentTheme} />
                ) : (
                  <div className="h-full min-h-[297mm] bg-gray-900 text-gray-100 p-8 font-mono text-sm overflow-hidden">
                    <textarea
                      value={markdown}
                      onChange={(e) => setMarkdown(e.target.value)}
                      className="w-full h-[1000px] bg-transparent border-none focus:ring-0 outline-none resize-none font-mono text-sm leading-6"
                      spellCheck={false}
                    />
                  </div>
                )}
              </div>

              <div className="h-20 print:hidden" /> {/* Bottom spacer */}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;