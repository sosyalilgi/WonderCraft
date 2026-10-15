import React from 'react';
import {
  X,
  BookOpen,
  Palette,
  Trash2,
  Calendar,
  Sparkles,
  ArrowRight,
  BookmarkPlus,
  CheckCircle2,
  FolderHeart,
  Printer,
} from 'lucide-react';
import { ColoringBook } from '../types';

interface MyCreationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedBooks: ColoringBook[];
  activeBookId: string;
  onSelectBook: (book: ColoringBook) => void;
  onDeleteBook: (bookId: string) => void;
  onSaveCurrentBook: () => void;
  currentBookIsSaved: boolean;
  onOpenPrintPreviewForBook: (book: ColoringBook) => void;
}

export const MyCreationsModal: React.FC<MyCreationsModalProps> = ({
  isOpen,
  onClose,
  savedBooks,
  activeBookId,
  onSelectBook,
  onDeleteBook,
  onSaveCurrentBook,
  currentBookIsSaved,
  onOpenPrintPreviewForBook,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 md:p-6 bg-slate-950/70 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className="relative flex flex-col w-full max-w-4xl h-[88vh] bg-stone-50 rounded-3xl shadow-2xl border border-stone-300 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 bg-white border-b border-stone-200 flex items-center justify-between shrink-0 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-amber-950 flex items-center justify-center font-bold shadow-xs">
              <FolderHeart className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-slate-900 font-display">
                  My Creations
                </h3>
                <span className="text-xs font-semibold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full">
                  {savedBooks.length} {savedBooks.length === 1 ? 'Book' : 'Books'} Saved
                </span>
              </div>
              <p className="text-xs text-slate-500">
                All coloring books and digital coloring progress saved to your browser
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onSaveCurrentBook}
              className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl transition-all shadow-xs ${
                currentBookIsSaved
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                  : 'bg-amber-500 hover:bg-amber-600 text-amber-950'
              }`}
            >
              {currentBookIsSaved ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Current Book Saved</span>
                </>
              ) : (
                <>
                  <BookmarkPlus className="w-4 h-4" />
                  <span>Save Current Book</span>
                </>
              )}
            </button>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-stone-100 rounded-xl transition-colors ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 md:p-8">
          {savedBooks.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 max-w-md mx-auto space-y-4">
              <div className="w-16 h-16 rounded-3xl bg-amber-100 text-amber-600 flex items-center justify-center">
                <BookOpen className="w-8 h-8" />
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-900 font-display">
                  No Saved Creations Yet
                </h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Your customized coloring books and painted artwork will be preserved here in local storage so you can return and continue anytime.
                </p>
              </div>
              <button
                onClick={() => {
                  onSaveCurrentBook();
                }}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-amber-950 text-xs font-bold rounded-xl shadow-xs transition-colors"
              >
                Save Current Active Book
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {savedBooks.map((b) => {
                const isCurrentActive = b.id === activeBookId;
                const coloredCount = b.pages.filter((p) => p.coloredDataUrl).length;
                const coverThumb = b.cover.coloredDataUrl || b.cover.imageUrl;

                return (
                  <div
                    key={b.id}
                    className={`bg-white rounded-2xl border transition-all flex flex-col overflow-hidden shadow-xs hover:shadow-md ${
                      isCurrentActive
                        ? 'border-amber-400 ring-2 ring-amber-400/40'
                        : 'border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    {/* Thumbnail & Active Tag */}
                    <div className="relative aspect-[3/4] bg-stone-100 p-3 flex items-center justify-center border-b border-stone-100">
                      {coverThumb ? (
                        <img
                          src={coverThumb}
                          alt={b.title}
                          className="w-full h-full object-contain rounded-lg bg-white shadow-2xs border border-stone-200"
                        />
                      ) : (
                        <BookOpen className="w-12 h-12 text-stone-300" />
                      )}

                      {isCurrentActive && (
                        <div className="absolute top-2.5 left-2.5 bg-amber-500 text-amber-950 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs">
                          Currently Active
                        </div>
                      )}

                      <div className="absolute bottom-2.5 right-2.5 bg-white/90 backdrop-blur-xs text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-2xs border border-stone-200">
                        {b.resolution}
                      </div>
                    </div>

                    {/* Meta info */}
                    <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                      <div>
                        <div className="flex items-center gap-1.5 text-[11px] text-amber-800 font-semibold mb-1">
                          <span>For {b.childName}</span>
                          <span>·</span>
                          <span className="capitalize">{b.ageLevel.replace('_', ' ')}</span>
                        </div>

                        <h4 className="text-sm font-bold text-slate-900 font-display line-clamp-1">
                          {b.title}
                        </h4>
                        <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                          Theme: {b.theme}
                        </p>
                      </div>

                      {/* Coloring Progress Meter */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-slate-500 font-medium">Coloring Progress</span>
                          <span className="font-bold text-slate-700">
                            {coloredCount}/5 pages
                          </span>
                        </div>
                        <div className="w-full h-1.5 bg-stone-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-amber-500 rounded-full transition-all"
                            style={{ width: `${(coloredCount / 5) * 100}%` }}
                          />
                        </div>
                      </div>

                      {/* Card Action Strip */}
                      <div className="pt-2 border-t border-stone-100 flex items-center justify-between gap-1.5">
                        <button
                          onClick={() => {
                            onSelectBook(b);
                            onClose();
                          }}
                          className={`flex-1 flex items-center justify-center gap-1 py-1.5 px-2.5 rounded-lg text-xs font-bold transition-colors ${
                            isCurrentActive
                              ? 'bg-amber-100 text-amber-950 hover:bg-amber-200'
                              : 'bg-slate-900 hover:bg-slate-800 text-white'
                          }`}
                        >
                          <span>{isCurrentActive ? 'Editing' : 'Open Book'}</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>

                        <button
                          onClick={() => {
                            onOpenPrintPreviewForBook(b);
                            onClose();
                          }}
                          title="Print or Export PDF"
                          className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-stone-100 rounded-lg transition-colors border border-stone-200"
                        >
                          <Printer className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => onDeleteBook(b.id)}
                          title="Delete saved book"
                          className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-white border-t border-stone-200 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <span>All creations are securely saved in your browser's offline storage.</span>
          <button
            onClick={onClose}
            className="text-xs font-semibold text-slate-700 hover:text-slate-950"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
