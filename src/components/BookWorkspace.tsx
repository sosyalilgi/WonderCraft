import React, { useState } from 'react';
import {
  Download,
  Palette,
  RefreshCw,
  Sparkles,
  Maximize2,
  CheckCircle2,
  AlertCircle,
  FileText,
  Printer,
  ChevronRight,
} from 'lucide-react';
import { ColoringBook, ColoringPage } from '../types';

interface BookWorkspaceProps {
  book: ColoringBook;
  onOpenColoringStudio: (page: ColoringPage) => void;
  onRegeneratePage: (page: ColoringPage, customPrompt?: string) => void;
  onDownloadPdf: () => void;
  isDownloadingPdf: boolean;
  onOpenZoom: (imageUrl: string, title: string) => void;
}

export const BookWorkspace: React.FC<BookWorkspaceProps> = ({
  book,
  onOpenColoringStudio,
  onRegeneratePage,
  onDownloadPdf,
  isDownloadingPdf,
  onOpenZoom,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'cover' | 'pages'>('all');
  const [regeneratingId, setRegeneratingId] = useState<string | null>(null);
  const [promptModalPage, setPromptModalPage] = useState<ColoringPage | null>(null);
  const [customPromptText, setCustomPromptText] = useState('');

  // Collect all 6 pages (Cover + 5 story pages)
  const allCards = [book.cover, ...book.pages];
  const totalGenerating = allCards.filter((p) => p.isGenerating).length;
  const isAnyGenerating = totalGenerating > 0;

  const handleOpenPromptModal = (page: ColoringPage) => {
    setPromptModalPage(page);
    setCustomPromptText(page.prompt);
  };

  const handleConfirmRegenerate = () => {
    if (!promptModalPage) return;
    setRegeneratingId(promptModalPage.id);
    onRegeneratePage(promptModalPage, customPromptText);
    setPromptModalPage(null);
  };

  return (
    <div className="space-y-8">
      {/* Book Title Banner */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-amber-200/70 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-100/80 px-2.5 py-0.5 rounded-full">
              Personalized Edition
            </span>
            <span className="text-xs text-slate-500 font-medium">
              Resolution: <span className="font-bold text-slate-800">{book.resolution}</span>
            </span>
            <span className="text-xs text-slate-500 font-medium">
              Age: <span className="font-bold text-slate-800 capitalize">{book.ageLevel.replace('_', ' ')}</span>
            </span>
          </div>

          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 font-display">
            {book.title}
          </h2>
          <p className="text-sm text-slate-600">
            Dedicated with love to <strong className="text-slate-900">{book.childName}</strong> • {book.pages.length} Story Pages + Custom Cover
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <button
            onClick={() => onOpenColoringStudio(book.pages[0] || book.cover)}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-bold transition-colors"
          >
            <Palette className="w-4 h-4 text-amber-700" />
            <span>Open Coloring Studio</span>
          </button>

          <button
            onClick={onDownloadPdf}
            disabled={isDownloadingPdf || isAnyGenerating}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 disabled:opacity-40 text-white text-xs font-bold shadow-md transition-colors whitespace-nowrap"
          >
            {isDownloadingPdf ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Generating PDF...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Download Print-Ready PDF</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Progress alert if pages are actively generating with gemini-3-pro-image-preview */}
      {isAnyGenerating && (
        <div className="bg-amber-50 border border-amber-300/80 rounded-2xl p-4 flex items-center justify-between gap-4 text-amber-900 animate-pulse">
          <div className="flex items-center gap-3">
            <RefreshCw className="w-5 h-5 text-amber-600 animate-spin shrink-0" />
            <div>
              <p className="text-xs md:text-sm font-bold">
                Inking your coloring book pages ({allCards.length - totalGenerating}/{allCards.length} completed)...
              </p>
              <p className="text-xs text-amber-700/80">
                Using Gemini 3 Pro Image ({book.resolution}) with thick-line vector art parameters.
              </p>
            </div>
          </div>
          <span className="text-xs font-mono font-bold bg-amber-200/80 px-2 py-1 rounded-lg shrink-0">
            {Math.round(((allCards.length - totalGenerating) / allCards.length) * 100)}%
          </span>
        </div>
      )}

      {/* Filter Tabs (All Pages, Cover Only, Story Pages) */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              activeTab === 'all'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200'
            }`}
          >
            All Book Pages (6)
          </button>
          <button
            onClick={() => setActiveTab('cover')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              activeTab === 'cover'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200'
            }`}
          >
            Cover Only
          </button>
          <button
            onClick={() => setActiveTab('pages')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              activeTab === 'pages'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200'
            }`}
          >
            Story Pages (1–5)
          </button>
        </div>

        <span className="text-xs text-slate-500 font-medium hidden sm:inline">
          Click any page to color digitally or zoom
        </span>
      </div>

      {/* Pages Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {allCards
          .filter((page) => {
            if (activeTab === 'cover') return page.pageNumber === 0;
            if (activeTab === 'pages') return page.pageNumber > 0;
            return true;
          })
          .map((page) => {
            const isCover = page.pageNumber === 0;
            const displayImage = page.coloredDataUrl || page.imageUrl;

            return (
              <div
                key={page.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col group"
              >
                {/* Page Card Header */}
                <div className="px-4 py-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        isCover
                          ? 'bg-amber-100 text-amber-900 border border-amber-300/60'
                          : 'bg-slate-200 text-slate-800'
                      }`}
                    >
                      {isCover ? 'Cover Art' : `Page ${page.pageNumber} of 5`}
                    </span>
                    {page.coloredDataUrl && (
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded-sm flex items-center gap-0.5">
                        <CheckCircle2 className="w-2.5 h-2.5" /> Colored
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenPromptModal(page)}
                      title="Regenerate this page"
                      className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-md transition-colors"
                    >
                      <RefreshCw
                        className={`w-3.5 h-3.5 ${
                          page.isGenerating ? 'animate-spin text-amber-600' : ''
                        }`}
                      />
                    </button>
                    {page.imageUrl && (
                      <button
                        onClick={() => onOpenZoom(page.imageUrl!, page.title)}
                        title="Zoom in"
                        className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-md transition-colors"
                      >
                        <Maximize2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Illustration Frame */}
                <div
                  className="relative aspect-[3/4] bg-stone-100 flex items-center justify-center p-3 cursor-pointer group-hover:bg-stone-50 transition-colors"
                  onClick={() => onOpenColoringStudio(page)}
                >
                  {page.isGenerating ? (
                    <div className="flex flex-col items-center justify-center text-center p-4 space-y-3">
                      <div className="w-10 h-10 rounded-full border-3 border-amber-500 border-t-transparent animate-spin" />
                      <div className="text-xs font-bold text-slate-700">
                        Drawing line art...
                      </div>
                      <div className="text-[11px] text-slate-400 max-w-[180px]">
                        Crisp {book.resolution} vector black-and-white
                      </div>
                    </div>
                  ) : displayImage ? (
                    <img
                      src={displayImage}
                      alt={page.title}
                      className="w-full h-full object-contain rounded-lg shadow-2xs border border-stone-200/80 bg-white"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-slate-400 p-4 text-center">
                      <AlertCircle className="w-8 h-8 mb-1 text-slate-300" />
                      <span className="text-xs">No artwork generated</span>
                    </div>
                  )}

                  {/* Hover Quick Action Badge */}
                  {!page.isGenerating && displayImage && (
                    <div className="absolute inset-0 bg-slate-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="px-3.5 py-1.5 bg-white/95 text-slate-900 rounded-full text-xs font-bold shadow-md flex items-center gap-1.5 backdrop-blur-xs">
                        <Palette className="w-3.5 h-3.5 text-amber-600" />
                        Color Online
                      </span>
                    </div>
                  )}
                </div>

                {/* Card Caption & Actions */}
                <div className="p-4 flex flex-col justify-between flex-1 space-y-3 bg-white">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 font-display">
                      {page.title}
                    </h4>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                      {page.description}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      onClick={() => onOpenColoringStudio(page)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 bg-amber-50 hover:bg-amber-100 text-amber-900 rounded-lg text-xs font-bold transition-colors"
                    >
                      <Palette className="w-3.5 h-3.5 text-amber-600" />
                      <span>{page.coloredDataUrl ? 'Edit Colors' : 'Color Page'}</span>
                    </button>

                    <a
                      href={displayImage || '#'}
                      download={`${book.childName}_page_${page.pageNumber}.png`}
                      title="Download image file"
                      className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                      <Download className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
      </div>

      {/* Prompt Regeneration Modal */}
      {promptModalPage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 space-y-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 font-display">
                Regenerate {promptModalPage.pageNumber === 0 ? 'Cover Art' : `Page ${promptModalPage.pageNumber}`}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Adjust prompt details to tweak character features, actions, or backgrounds.
              </p>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                Coloring Line Art Prompt:
              </label>
              <textarea
                rows={3}
                value={customPromptText}
                onChange={(e) => setCustomPromptText(e.target.value)}
                className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 bg-slate-50/50"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setPromptModalPage(null)}
                className="px-3.5 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmRegenerate}
                className="px-4 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-xl transition-colors shadow-xs flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Regenerate Now</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
