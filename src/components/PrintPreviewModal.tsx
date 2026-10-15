import React, { useState } from 'react';
import {
  X,
  Printer,
  Download,
  Eye,
  Check,
  RefreshCw,
  Sparkles,
  Layers,
  FileText,
  SlidersHorizontal,
  Maximize2,
} from 'lucide-react';
import { ColoringBook, ColoringPage } from '../types';

interface PrintPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  book: ColoringBook;
  onDownloadPdf: (includeColors: boolean) => void;
  isDownloadingPdf: boolean;
  onOpenZoom?: (imageUrl: string, title: string) => void;
}

export const PrintPreviewModal: React.FC<PrintPreviewModalProps> = ({
  isOpen,
  onClose,
  book,
  onDownloadPdf,
  isDownloadingPdf,
  onOpenZoom,
}) => {
  const [includeColors, setIncludeColors] = useState<boolean>(false);
  const [paperFormat, setPaperFormat] = useState<'letter' | 'a4'>('letter');
  const [gridColumns, setGridColumns] = useState<2 | 3>(3);
  const [selectedPageIds, setSelectedPageIds] = useState<string[]>(() => [
    book.cover.id,
    ...book.pages.map((p) => p.id),
  ]);

  if (!isOpen) return null;

  const allPages: ColoringPage[] = [book.cover, ...book.pages];
  const coloredCount = book.pages.filter((p) => p.coloredDataUrl).length;

  const togglePageSelection = (pageId: string) => {
    setSelectedPageIds((prev) =>
      prev.includes(pageId) ? prev.filter((id) => id !== pageId) : [...prev, pageId]
    );
  };

  const handleSelectAll = () => {
    setSelectedPageIds(allPages.map((p) => p.id));
  };

  const handleDirectPrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-slate-950/75 backdrop-blur-sm overflow-hidden">
      <div className="relative flex flex-col w-full max-w-7xl h-[94vh] bg-stone-100 rounded-3xl shadow-2xl border border-stone-300 overflow-hidden">
        {/* Top Control Bar */}
        <div className="px-5 py-4 bg-white border-b border-stone-200 flex flex-wrap items-center justify-between gap-4 shrink-0 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500 text-amber-950 flex items-center justify-center font-bold shadow-xs">
              <Printer className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900 font-display">
                  Print Preview: {book.title}
                </h3>
                <span className="text-[11px] font-semibold text-amber-800 bg-amber-100/80 px-2 py-0.5 rounded-full">
                  {selectedPageIds.length} of {allPages.length} Sheets Selected
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Print-optimized layout for <strong>{book.childName}</strong> • {paperFormat.toUpperCase()} Paper (8.5" × 11")
              </p>
            </div>
          </div>

          {/* Configuration Toolbar */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Color Mode Switcher */}
            <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl border border-stone-200 text-xs">
              <button
                onClick={() => setIncludeColors(false)}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                  !includeColors
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Line Art (For Coloring)
              </button>
              <button
                onClick={() => setIncludeColors(true)}
                disabled={coloredCount === 0 && !book.cover.coloredDataUrl}
                title={coloredCount === 0 ? 'No pages colored yet in studio' : ''}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1 ${
                  includeColors
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 disabled:opacity-40 disabled:cursor-not-allowed'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>Colored Art</span>
              </button>
            </div>

            {/* Paper Format Selector */}
            <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl border border-stone-200 text-xs">
              <button
                onClick={() => setPaperFormat('letter')}
                className={`px-2.5 py-1.5 rounded-lg font-medium transition-all ${
                  paperFormat === 'letter'
                    ? 'bg-white text-slate-900 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                US Letter
              </button>
              <button
                onClick={() => setPaperFormat('a4')}
                className={`px-2.5 py-1.5 rounded-lg font-medium transition-all ${
                  paperFormat === 'a4'
                    ? 'bg-white text-slate-900 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                A4
              </button>
            </div>

            {/* Grid Density */}
            <div className="hidden sm:flex items-center gap-1 bg-stone-100 p-1 rounded-xl border border-stone-200 text-xs">
              <button
                onClick={() => setGridColumns(2)}
                className={`px-2.5 py-1.5 rounded-lg font-medium transition-all ${
                  gridColumns === 2
                    ? 'bg-white text-slate-900 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                2 Columns
              </button>
              <button
                onClick={() => setGridColumns(3)}
                className={`px-2.5 py-1.5 rounded-lg font-medium transition-all ${
                  gridColumns === 3
                    ? 'bg-white text-slate-900 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                3 Columns
              </button>
            </div>

            {/* Primary Action Buttons */}
            <button
              onClick={handleDirectPrint}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold bg-white hover:bg-stone-50 text-slate-800 border border-stone-300 rounded-xl shadow-2xs transition-colors"
            >
              <Printer className="w-4 h-4 text-slate-700" />
              <span className="hidden md:inline">Print via Browser</span>
            </button>

            <button
              onClick={() => onDownloadPdf(includeColors)}
              disabled={isDownloadingPdf}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 disabled:opacity-40 rounded-xl shadow-sm transition-colors whitespace-nowrap"
            >
              {isDownloadingPdf ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Compiling PDF...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Download PDF ({selectedPageIds.length} Pages)</span>
                </>
              )}
            </button>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-stone-200/60 rounded-xl transition-colors ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Info Strip */}
        <div className="px-6 py-2 bg-amber-50/80 border-b border-amber-200/60 flex items-center justify-between text-[11px] text-amber-900 shrink-0">
          <div className="flex items-center gap-2">
            <span className="font-bold">Printing Tip:</span>
            <span>
              Each page is laid out with 0.5" printable margins for standard home printers.
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleSelectAll}
              className="font-bold underline hover:text-amber-950"
            >
              Select All 6 Pages
            </button>
          </div>
        </div>

        {/* Scrollable Printable Sheets Grid */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 bg-stone-200/60 print-container">
          <div
            className={`grid gap-6 sm:gap-8 max-w-6xl mx-auto ${
              gridColumns === 2 ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
            }`}
          >
            {allPages.map((page) => {
              const isCover = page.pageNumber === 0;
              const isSelected = selectedPageIds.includes(page.id);
              const displayImage =
                includeColors && page.coloredDataUrl
                  ? page.coloredDataUrl
                  : page.imageUrl;

              return (
                <div
                  key={page.id}
                  className={`print-page-sheet relative bg-white rounded-xl shadow-md border transition-all flex flex-col p-5 sm:p-6 ${
                    isSelected
                      ? 'border-stone-300 ring-2 ring-amber-500/30'
                      : 'border-stone-200 opacity-60'
                  }`}
                  style={{
                    aspectRatio: paperFormat === 'letter' ? '8.5 / 11' : '1 / 1.414',
                  }}
                >
                  {/* Selection Checkbox & Quick Toolbar */}
                  <div className="flex items-center justify-between pb-3 border-b border-stone-200 mb-3 shrink-0">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => togglePageSelection(page.id)}
                        className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 border-stone-300 cursor-pointer"
                      />
                      <span className="text-xs font-bold text-slate-800">
                        {isCover ? 'Cover Page' : `Sheet ${page.pageNumber} of 5`}
                      </span>
                    </label>

                    <div className="flex items-center gap-1.5">
                      {page.coloredDataUrl && (
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded-sm">
                          Colored
                        </span>
                      )}
                      {displayImage && onOpenZoom && (
                        <button
                          onClick={() => onOpenZoom(displayImage, page.title)}
                          title="Zoom Sheet"
                          className="p-1 text-slate-400 hover:text-slate-700 hover:bg-stone-100 rounded-md transition-colors"
                        >
                          <Maximize2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Sheet Header Area */}
                  <div className="text-center mb-3 shrink-0">
                    <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 font-display tracking-tight uppercase">
                      {isCover ? book.title : page.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5 font-medium">
                      {isCover
                        ? `Specially Created for ${book.childName}`
                        : page.description}
                    </p>
                  </div>

                  {/* Center Line Art Frame (Print Optimized) */}
                  <div className="flex-1 bg-stone-50 border-2 border-slate-900 rounded-lg p-2 flex items-center justify-center overflow-hidden min-h-0">
                    {displayImage ? (
                      <img
                        src={displayImage}
                        alt={page.title}
                        className="w-full h-full object-contain bg-white rounded-xs"
                      />
                    ) : (
                      <div className="text-xs text-slate-400 font-medium">
                        Drawing artwork...
                      </div>
                    )}
                  </div>

                  {/* Sheet Footer Area */}
                  <div className="pt-3 mt-3 border-t border-stone-200 flex items-center justify-between text-[10px] text-slate-400 font-mono shrink-0">
                    <span className="truncate max-w-[200px]">
                      {book.childName}'s {book.theme} Adventure
                    </span>
                    <span>
                      {isCover ? 'Front Cover' : `Page ${page.pageNumber}`}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal Bottom Sticky Bar */}
        <div className="px-6 py-3.5 bg-white border-t border-stone-200 flex items-center justify-between text-xs text-slate-600 shrink-0">
          <div className="flex items-center gap-3">
            <span className="font-bold text-slate-900">
              {selectedPageIds.length} Sheets selected
            </span>
            <span>·</span>
            <span>
              Format: {paperFormat.toUpperCase()} ({paperFormat === 'letter' ? '8.5" × 11"' : '210 × 297 mm'})
            </span>
            <span>·</span>
            <span>
              Mode: {includeColors ? 'Full Color Artwork' : 'Black & White Coloring Book'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
            >
              Back to Workspace
            </button>
            <button
              onClick={() => onDownloadPdf(includeColors)}
              disabled={isDownloadingPdf}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 disabled:opacity-40 rounded-xl shadow-xs transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Download PDF</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
