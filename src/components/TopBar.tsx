import React from 'react';
import { BookOpen, Sparkles, Download, Palette, RefreshCw } from 'lucide-react';

interface TopBarProps {
  onOpenChat: () => void;
  onOpenColoringStudio: () => void;
  onResetToSample: () => void;
  onScrollToCreator: () => void;
  onDownloadPdf: () => void;
  isDownloadingPdf: boolean;
  hasBook: boolean;
  bookTitle: string;
}

export const TopBar: React.FC<TopBarProps> = ({
  onOpenChat,
  onOpenColoringStudio,
  onResetToSample,
  onScrollToCreator,
  onDownloadPdf,
  isDownloadingPdf,
  hasBook,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-amber-200/60 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-amber-500 text-amber-950 flex items-center justify-center font-black shadow-xs">
            <BookOpen className="w-5 h-5" />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900 font-display whitespace-nowrap">
            WonderCraft
          </span>
        </div>

        {/* Zone 2: 4 Single-line Nav Links / Triggers */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
          <button
            onClick={onScrollToCreator}
            className="hover:text-amber-600 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
          >
            <span>Book Creator</span>
          </button>
          <button
            onClick={onResetToSample}
            className="hover:text-amber-600 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
          >
            <span>Sample Adventure</span>
          </button>
          <button
            onClick={onOpenColoringStudio}
            disabled={!hasBook}
            className="hover:text-amber-600 disabled:opacity-40 disabled:hover:text-slate-600 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
          >
            <Palette className="w-4 h-4 text-amber-500" />
            <span>Digital Studio</span>
          </button>
          <button
            onClick={onOpenChat}
            className="hover:text-amber-600 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 text-amber-700"
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Story Brainstormer</span>
          </button>
        </nav>

        {/* Zone 3: 1 Primary Action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onDownloadPdf}
            disabled={!hasBook || isDownloadingPdf}
            className="flex items-center gap-2 px-4 py-2 text-xs md:text-sm font-bold text-white bg-amber-600 hover:bg-amber-700 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl shadow-xs transition-colors whitespace-nowrap shrink-0"
          >
            {isDownloadingPdf ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Assembling PDF...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Download PDF Book</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
