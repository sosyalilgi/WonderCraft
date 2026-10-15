import React, { useState, useRef } from 'react';
import confetti from 'canvas-confetti';
import {
  BookOpen,
  Sparkles,
  Download,
  Palette,
  FileCheck,
  HelpCircle,
  RotateCcw,
  Heart,
  ChevronRight,
  ShieldCheck,
  Printer,
} from 'lucide-react';
import { ColoringBook, ColoringPage, AgeLevel, ImageResolution } from './types';
import { getSampleColoringBook } from './utils/sampleData';
import { exportColoringBookToPdf } from './utils/pdfExport';
import { TopBar } from './components/TopBar';
import { BookSetupForm } from './components/BookSetupForm';
import { BookWorkspace } from './components/BookWorkspace';
import { ColoringStudioModal } from './components/ColoringStudioModal';
import { ChatDrawer } from './components/ChatDrawer';
import { ImageZoomModal } from './components/ImageZoomModal';

export default function App() {
  // Current active book
  const [book, setBook] = useState<ColoringBook>(() => getSampleColoringBook('Leo'));

  // Form State
  const [childName, setChildName] = useState<string>('Leo');
  const [theme, setTheme] = useState<string>('Space Dinosaurs');
  const [ageLevel, setAgeLevel] = useState<AgeLevel>('early_reader');
  const [resolution, setResolution] = useState<ImageResolution>('2K');

  // Loading & Progress States
  const [isGeneratingOutline, setIsGeneratingOutline] = useState<boolean>(false);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState<boolean>(false);
  const [pdfProgressText, setPdfProgressText] = useState<string>('');

  const [quotaNotice, setQuotaNotice] = useState<boolean>(false);

  // Modals & Drawers
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [studioPage, setStudioPage] = useState<ColoringPage | null>(null);
  const [zoomImage, setZoomImage] = useState<{ url: string; title: string } | null>(null);

  const creatorRef = useRef<HTMLDivElement | null>(null);

  // Smooth scroll to book creator form
  const handleScrollToCreator = () => {
    creatorRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Reset to default sample adventure
  const handleResetToSample = () => {
    setBook(getSampleColoringBook('Leo'));
    setChildName('Leo');
    setTheme('Space Dinosaurs');
    setAgeLevel('early_reader');
    setResolution('2K');
  };

  // Generate Image helper for a single page
  const generatePageImage = async (
    page: ColoringPage,
    customPrompt?: string,
    currentBook = book
  ): Promise<string> => {
    const isCover = page.pageNumber === 0;
    const promptToUse = customPrompt || page.prompt;

    const response = await fetch('/api/generate-image', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: promptToUse,
        ageLevel: currentBook.ageLevel,
        resolution: currentBook.resolution,
        isCover,
        childName: currentBook.childName,
        pageNumber: page.pageNumber,
      }),
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error || 'Failed to generate page line art');
    }

    const data = await response.json();
    if (data.isFallback) {
      setQuotaNotice(true);
    }
    return data.imageUrl;
  };

  // Full 5-Page Book Generation Pipeline
  const handleGenerateBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!childName.trim() || !theme.trim() || isGeneratingOutline) return;

    setIsGeneratingOutline(true);

    try {
      // Step 1: Request structured outline (5 pages + cover)
      const outlineRes = await fetch('/api/outline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          childName: childName.trim(),
          theme: theme.trim(),
          ageLevel,
        }),
      });

      if (!outlineRes.ok) {
        const err = await outlineRes.json();
        throw new Error(err.error || 'Failed to craft story outline.');
      }

      const outline = await outlineRes.json();

      // Step 2: Initialize new book object with placeholders in generating state
      const newCover: ColoringPage = {
        id: `cover-${Date.now()}`,
        pageNumber: 0,
        title: `${outline.bookTitle || `${childName}'s Adventure`} (Cover)`,
        description: `Custom illustrated title cover frame for ${childName}.`,
        prompt: outline.coverPrompt || `Coloring book cover for ${theme} with ${childName}`,
        isGenerating: true,
      };

      const newPages: ColoringPage[] = (outline.pages || []).map((p: any, idx: number) => ({
        id: `page-${idx + 1}-${Date.now()}`,
        pageNumber: p.pageNumber || idx + 1,
        title: p.title || `Chapter ${idx + 1}`,
        description: p.description || '',
        prompt: p.prompt || `${theme} scene for children coloring page`,
        isGenerating: true,
      }));

      const newBook: ColoringBook = {
        id: `book-${Date.now()}`,
        title: outline.bookTitle || `${childName}'s ${theme} Coloring Adventure`,
        childName: childName.trim(),
        theme: theme.trim(),
        ageLevel,
        resolution,
        cover: newCover,
        pages: newPages,
        createdAt: new Date().toISOString(),
      };

      setBook(newBook);
      setIsGeneratingOutline(false);

      // Step 3: Concurrently generate line art for cover and 5 pages
      const allToGenerate = [newCover, ...newPages];

      const generationPromises = allToGenerate.map(async (page) => {
        try {
          const imgUrl = await generatePageImage(page, undefined, newBook);

          setBook((prev) => {
            if (page.pageNumber === 0) {
              return {
                ...prev,
                cover: { ...prev.cover, imageUrl: imgUrl, isGenerating: false },
              };
            }
            return {
              ...prev,
              pages: prev.pages.map((p) =>
                p.id === page.id ? { ...p, imageUrl: imgUrl, isGenerating: false } : p
              ),
            };
          });
        } catch (pageErr: any) {
          console.error(`Error generating page ${page.pageNumber}:`, pageErr);
          setBook((prev) => {
            if (page.pageNumber === 0) {
              return {
                ...prev,
                cover: {
                  ...prev.cover,
                  isGenerating: false,
                  error: pageErr.message || 'Generation failed',
                },
              };
            }
            return {
              ...prev,
              pages: prev.pages.map((p) =>
                p.id === page.id
                  ? { ...p, isGenerating: false, error: pageErr.message || 'Generation failed' }
                  : p
              ),
            };
          });
        }
      });

      await Promise.all(generationPromises);

      // Trigger celebratory confetti when the book is ready!
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#F59E0B', '#EF4444', '#10B981', '#3B82F6', '#8B5CF6'],
        });
      } catch (e) {
        // confetti fallback
      }
    } catch (err: any) {
      console.error('Book generation error:', err);
      alert(`Could not generate book: ${err.message || 'Please try again.'}`);
      setIsGeneratingOutline(false);
    }
  };

  // Regenerate Single Page with optional prompt tweak
  const handleRegeneratePage = async (page: ColoringPage, customPrompt?: string) => {
    // Set page to generating state
    setBook((prev) => {
      if (page.pageNumber === 0) {
        return { ...prev, cover: { ...prev.cover, isGenerating: true, error: undefined } };
      }
      return {
        ...prev,
        pages: prev.pages.map((p) =>
          p.id === page.id ? { ...p, isGenerating: true, error: undefined } : p
        ),
      };
    });

    try {
      const newImg = await generatePageImage(page, customPrompt, book);
      setBook((prev) => {
        if (page.pageNumber === 0) {
          return {
            ...prev,
            cover: {
              ...prev.cover,
              imageUrl: newImg,
              prompt: customPrompt || prev.cover.prompt,
              isGenerating: false,
            },
          };
        }
        return {
          ...prev,
          pages: prev.pages.map((p) =>
            p.id === page.id
              ? {
                  ...p,
                  imageUrl: newImg,
                  prompt: customPrompt || p.prompt,
                  isGenerating: false,
                }
              : p
          ),
        };
      });
    } catch (err: any) {
      console.error('Error regenerating page:', err);
      setBook((prev) => {
        if (page.pageNumber === 0) {
          return {
            ...prev,
            cover: { ...prev.cover, isGenerating: false, error: err.message },
          };
        }
        return {
          ...prev,
          pages: prev.pages.map((p) =>
            p.id === page.id ? { ...p, isGenerating: false, error: err.message } : p
          ),
        };
      });
    }
  };

  // Save digitally colored canvas back to the page state
  const handleSaveColoredPage = (pageId: string, dataUrl: string) => {
    setBook((prev) => {
      if (prev.cover.id === pageId) {
        return { ...prev, cover: { ...prev.cover, coloredDataUrl: dataUrl } };
      }
      return {
        ...prev,
        pages: prev.pages.map((p) =>
          p.id === pageId ? { ...p, coloredDataUrl: dataUrl } : p
        ),
      };
    });
  };

  // Download PDF Handler
  const handleDownloadPdf = async () => {
    if (isDownloadingPdf) return;
    setIsDownloadingPdf(true);
    setPdfProgressText('Initializing print documents...');

    try {
      await exportColoringBookToPdf(book, {
        includeDigitalColors: true,
        onProgress: (current, total, status) => {
          setPdfProgressText(status);
        },
      });

      // Joyful confetti for PDF completion!
      try {
        confetti({
          particleCount: 60,
          spread: 60,
          origin: { y: 0.7 },
        });
      } catch (e) {
        // ignore
      }
    } catch (err: any) {
      console.error('PDF export error:', err);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsDownloadingPdf(false);
      setPdfProgressText('');
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-slate-800 flex flex-col selection:bg-amber-200">
      {/* Top Bar following 3-Zone Contract */}
      <TopBar
        onOpenChat={() => setIsChatOpen(true)}
        onOpenColoringStudio={() => setStudioPage(book.pages[0] || book.cover)}
        onResetToSample={handleResetToSample}
        onScrollToCreator={handleScrollToCreator}
        onDownloadPdf={handleDownloadPdf}
        isDownloadingPdf={isDownloadingPdf}
        hasBook={!!book}
        bookTitle={book.title}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {quotaNotice && (
          <div className="bg-amber-50 border border-amber-300/80 rounded-2xl p-4 flex items-center justify-between gap-4 text-amber-950 shadow-xs">
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-amber-600 shrink-0" />
              <div className="text-xs leading-relaxed">
                <strong className="font-bold">Custom Line Art Ready:</strong> Your current Gemini API key is using the free tier (where <code>gemini-3-pro-image</code> has a limit of 0). WonderCraft automatically crafted crisp vector line art for all your story scenes so you can still color online, customize prompts, and download your complete PDF book!
              </div>
            </div>
            <button
              onClick={() => setQuotaNotice(false)}
              className="text-xs font-bold text-amber-800 hover:text-amber-950 px-2.5 py-1 hover:bg-amber-100 rounded-lg shrink-0 transition-colors"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Hero Banner / Introductory Pitch */}
        <div className="relative rounded-3xl bg-linear-to-r from-amber-500 via-amber-400 to-orange-400 p-8 md:p-12 text-slate-950 shadow-md overflow-hidden">
          <div className="relative z-10 max-w-2xl space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider bg-black/10 px-3 py-1 rounded-full inline-block backdrop-blur-xs">
              AI-Powered Children's Coloring Book Generator
            </span>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight font-display">
              Turn any bedtime idea into a printed story coloring book.
            </h1>
            <p className="text-sm md:text-base text-slate-900/90 font-medium leading-relaxed">
              Name your child, pick an adventure theme, and get 5 sequential black-and-white
              pages with thick ink outlines and a personalized cover. Color online or download as a ready-to-print PDF.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={handleScrollToCreator}
                className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs md:text-sm rounded-xl shadow-md transition-colors"
              >
                Create Your Book
              </button>
              <button
                onClick={() => setIsChatOpen(true)}
                className="px-5 py-3 bg-white/90 hover:bg-white text-slate-900 font-bold text-xs md:text-sm rounded-xl shadow-xs transition-colors flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>Brainstorm Themes</span>
              </button>
            </div>
          </div>

          {/* Decorative background geometric icons */}
          <div className="absolute -right-8 -bottom-10 opacity-15 pointer-events-none hidden lg:block">
            <BookOpen className="w-96 h-96 text-slate-950" />
          </div>
        </div>

        {/* Creator Form Section */}
        <div ref={creatorRef}>
          <BookSetupForm
            childName={childName}
            theme={theme}
            ageLevel={ageLevel}
            resolution={resolution}
            isGeneratingOutline={isGeneratingOutline}
            onChildNameChange={setChildName}
            onThemeChange={setTheme}
            onAgeLevelChange={setAgeLevel}
            onResolutionChange={setResolution}
            onSubmit={handleGenerateBook}
            onOpenChat={() => setIsChatOpen(true)}
          />
        </div>

        {/* Book Gallery & Interactive Stage */}
        <BookWorkspace
          book={book}
          onOpenColoringStudio={(page) => setStudioPage(page)}
          onRegeneratePage={handleRegeneratePage}
          onDownloadPdf={handleDownloadPdf}
          isDownloadingPdf={isDownloadingPdf}
          onOpenZoom={(url, title) => setZoomImage({ url, title })}
        />

        {/* PDF Download Progress Toast */}
        {isDownloadingPdf && (
          <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-xl flex items-center gap-3 border border-slate-700 animate-bounce">
            <div className="w-5 h-5 rounded-full border-2 border-amber-400 border-t-transparent animate-spin" />
            <div className="text-xs">
              <span className="font-bold block">Building Print-Ready PDF</span>
              <span className="text-slate-400">{pdfProgressText || 'Packaging pages...'}</span>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-16 bg-white border-t border-slate-200 py-8 px-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800 font-display">WonderCraft</span>
            <span>·</span>
            <span>Created for young creators and curious dreamers</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Pure Black & White Line Art</span>
            <span>·</span>
            <span>1K / 2K / 4K Resolutions</span>
            <span>·</span>
            <span>Standard Letter & A4 PDF Print</span>
          </div>
        </div>
      </footer>

      {/* Interactive Coloring Studio Modal */}
      {studioPage && (
        <ColoringStudioModal
          page={studioPage}
          childName={book.childName}
          isOpen={!!studioPage}
          onClose={() => setStudioPage(null)}
          onSaveColoredPage={handleSaveColoredPage}
        />
      )}

      {/* Gemini 3.8 Flash Chat Companion Drawer */}
      <ChatDrawer
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        childName={childName}
        currentTheme={theme}
        onSelectTheme={(selectedTheme) => {
          setTheme(selectedTheme);
          handleScrollToCreator();
        }}
      />

      {/* High-Resolution Zoom Lightbox */}
      <ImageZoomModal
        imageUrl={zoomImage?.url || null}
        title={zoomImage?.title || 'Coloring Page'}
        onClose={() => setZoomImage(null)}
      />
    </div>
  );
}
