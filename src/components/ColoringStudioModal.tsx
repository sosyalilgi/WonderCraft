import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  X,
  RotateCcw,
  RotateCw,
  Trash2,
  Download,
  Printer,
  Check,
  PaintBucket,
  Brush,
  Eraser,
  Sparkles,
} from 'lucide-react';
import { ColoringPage } from '../types';

interface ColoringStudioModalProps {
  page: ColoringPage;
  childName: string;
  isOpen: boolean;
  onClose: () => void;
  onSaveColoredPage: (pageId: string, dataUrl: string) => void;
}

const CRAYON_PALETTE = [
  { name: 'Cherry Red', hex: '#EF4444' },
  { name: 'Bubblegum', hex: '#EC4899' },
  { name: 'Rose Petal', hex: '#F472B6' },
  { name: 'Tangerine', hex: '#F97316' },
  { name: 'Golden Sun', hex: '#F59E0B' },
  { name: 'Lemon Drop', hex: '#FBBF24' },
  { name: 'Lime Zest', hex: '#84CC16' },
  { name: 'Grass Green', hex: '#22C55E' },
  { name: 'Emerald', hex: '#10B981' },
  { name: 'Mint Candy', hex: '#6EE7B7' },
  { name: 'Sky Breeze', hex: '#38BDF8' },
  { name: 'Ocean Cyan', hex: '#06B6D4' },
  { name: 'Royal Blue', hex: '#3B82F6' },
  { name: 'Deep Navy', hex: '#1E3A8A' },
  { name: 'Grape Violet', hex: '#8B5CF6' },
  { name: 'Lilac', hex: '#A855F7' },
  { name: 'Plum', hex: '#6B21A8' },
  { name: 'Chocolate', hex: '#78350F' },
  { name: 'Caramel', hex: '#B45309' },
  { name: 'Peach', hex: '#FDBA74' },
  { name: 'Warm Cream', hex: '#FEF3C7' },
  { name: 'Pebble Gray', hex: '#94A3B8' },
  { name: 'Dark Slate', hex: '#334155' },
  { name: 'Midnight', hex: '#0F172A' },
];

const BRUSH_SIZES = [
  { label: 'Fine', size: 6 },
  { label: 'Medium', size: 14 },
  { label: 'Chunky', size: 28 },
  { label: 'Jumbo', size: 50 },
];

export const ColoringStudioModal: React.FC<ColoringStudioModalProps> = ({
  page,
  childName,
  isOpen,
  onClose,
  onSaveColoredPage,
}) => {
  const [selectedColor, setSelectedColor] = useState<string>('#3B82F6');
  const [activeTool, setActiveTool] = useState<'brush' | 'bucket' | 'eraser'>('bucket');
  const [brushSize, setBrushSize] = useState<number>(14);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  // References to the dual canvas layers:
  // 1. colorCanvas (bottom): stores painted colors and fills
  // 2. lineArtCanvas (top): loaded with black-and-white lines
  const colorCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const lineArtCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawingRef = useRef<boolean>(false);
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);

  // Undo / Redo history for colorCanvas
  const [history, setHistory] = useState<ImageData[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);

  const saveHistoryState = useCallback(() => {
    const canvas = colorCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);

    setHistory((prev) => {
      const updated = prev.slice(0, historyIndex + 1);
      return [...updated, snapshot].slice(-15); // keep up to 15 history steps
    });
    setHistoryIndex((prev) => Math.min(prev + 1, 14));
  }, [historyIndex]);

  // Initialize canvas with the page's image
  useEffect(() => {
    if (!isOpen || !page.imageUrl) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const colorCanvas = colorCanvasRef.current;
      const lineArtCanvas = lineArtCanvasRef.current;
      if (!colorCanvas || !lineArtCanvas) return;

      const width = 600;
      const height = 800;

      colorCanvas.width = width;
      colorCanvas.height = height;
      lineArtCanvas.width = width;
      lineArtCanvas.height = height;

      const colorCtx = colorCanvas.getContext('2d');
      const lineArtCtx = lineArtCanvas.getContext('2d');
      if (!colorCtx || !lineArtCtx) return;

      // Fill colorCanvas with pure white initially
      colorCtx.fillStyle = '#FFFFFF';
      colorCtx.fillRect(0, 0, width, height);

      // If user had previously colored this page, load that onto colorCanvas
      if (page.coloredDataUrl) {
        const coloredImg = new Image();
        coloredImg.crossOrigin = 'anonymous';
        coloredImg.onload = () => {
          colorCtx.drawImage(coloredImg, 0, 0, width, height);
          const initialSnapshot = colorCtx.getImageData(0, 0, width, height);
          setHistory([initialSnapshot]);
          setHistoryIndex(0);
        };
        coloredImg.src = page.coloredDataUrl;
      } else {
        const initialSnapshot = colorCtx.getImageData(0, 0, width, height);
        setHistory([initialSnapshot]);
        setHistoryIndex(0);
      }

      // Draw the black-and-white line art onto lineArtCanvas
      lineArtCtx.clearRect(0, 0, width, height);
      lineArtCtx.drawImage(img, 0, 0, width, height);
    };
    img.src = page.imageUrl;
  }, [isOpen, page.imageUrl, page.coloredDataUrl]);

  // Undo
  const handleUndo = () => {
    if (historyIndex > 0) {
      const canvas = colorCanvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      const newIndex = historyIndex - 1;
      ctx.putImageData(history[newIndex], 0, 0);
      setHistoryIndex(newIndex);
    }
  };

  // Redo
  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const canvas = colorCanvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      const newIndex = historyIndex + 1;
      ctx.putImageData(history[newIndex], 0, 0);
      setHistoryIndex(newIndex);
    }
  };

  // Reset to original line art
  const handleReset = () => {
    const canvas = colorCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    saveHistoryState();
  };

  // Canvas Coordinate Helper
  const getCanvasCoordinates = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = colorCanvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    return {
      x: Math.floor((clientX - rect.left) * scaleX),
      y: Math.floor((clientY - rect.top) * scaleY),
    };
  };

  // Flood Fill Algorithm
  const performFloodFill = (startX: number, startY: number, fillHex: string) => {
    const colorCanvas = colorCanvasRef.current;
    const lineCanvas = lineArtCanvasRef.current;
    if (!colorCanvas || !lineCanvas) return;

    const colorCtx = colorCanvas.getContext('2d');
    const lineCtx = lineCanvas.getContext('2d');
    if (!colorCtx || !lineCtx) return;

    const width = colorCanvas.width;
    const height = colorCanvas.height;

    const colorImgData = colorCtx.getImageData(0, 0, width, height);
    const lineImgData = lineCtx.getImageData(0, 0, width, height);

    const colorData = colorImgData.data;
    const lineData = lineImgData.data;

    // Convert target fillHex to RGB
    const fillR = parseInt(fillHex.slice(1, 3), 16);
    const fillG = parseInt(fillHex.slice(3, 5), 16);
    const fillB = parseInt(fillHex.slice(5, 7), 16);

    const startIndex = (startY * width + startX) * 4;

    // Check if start position is a black outline
    const lineR = lineData[startIndex];
    const lineG = lineData[startIndex + 1];
    const lineB = lineData[startIndex + 2];
    const lineLuminance = 0.299 * lineR + 0.587 * lineG + 0.114 * lineB;

    // If clicking directly on a dark outline, don't fill
    if (lineLuminance < 80) return;

    const targetR = colorData[startIndex];
    const targetG = colorData[startIndex + 1];
    const targetB = colorData[startIndex + 2];

    // Already the same color
    if (
      Math.abs(targetR - fillR) < 10 &&
      Math.abs(targetG - fillG) < 10 &&
      Math.abs(targetB - fillB) < 10
    ) {
      return;
    }

    // 4-way queue flood fill with line boundary barrier
    const queue: [number, number][] = [[startX, startY]];
    const visited = new Uint8Array(width * height);

    const matchesTarget = (idx: number) => {
      // Is it a line outline?
      const lr = lineData[idx];
      const lg = lineData[idx + 1];
      const lb = lineData[idx + 2];
      const lum = 0.299 * lr + 0.587 * lg + 0.114 * lb;
      if (lum < 90) return false; // Boundary line

      const cr = colorData[idx];
      const cg = colorData[idx + 1];
      const cb = colorData[idx + 2];

      return (
        Math.abs(cr - targetR) < 45 &&
        Math.abs(cg - targetG) < 45 &&
        Math.abs(cb - targetB) < 45
      );
    };

    while (queue.length > 0) {
      const [cx, cy] = queue.pop()!;
      if (cx < 0 || cx >= width || cy < 0 || cy >= height) continue;

      const pIndex = cy * width + cx;
      if (visited[pIndex]) continue;
      visited[pIndex] = 1;

      const byteIndex = pIndex * 4;
      if (!matchesTarget(byteIndex)) continue;

      // Color the pixel
      colorData[byteIndex] = fillR;
      colorData[byteIndex + 1] = fillG;
      colorData[byteIndex + 2] = fillB;
      colorData[byteIndex + 3] = 255;

      // Push adjacent neighbors
      if (cx + 1 < width && !visited[pIndex + 1]) queue.push([cx + 1, cy]);
      if (cx - 1 >= 0 && !visited[pIndex - 1]) queue.push([cx - 1, cy]);
      if (cy + 1 < height && !visited[pIndex + width]) queue.push([cx, cy + 1]);
      if (cy - 1 >= 0 && !visited[pIndex - width]) queue.push([cx, cy - 1]);
    }

    colorCtx.putImageData(colorImgData, 0, 0);
    saveHistoryState();
  };

  // Drawing Handlers
  const handlePointerDown = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const { x, y } = getCanvasCoordinates(e);

    if (activeTool === 'bucket') {
      performFloodFill(x, y, selectedColor);
      return;
    }

    isDrawingRef.current = true;
    lastPointRef.current = { x, y };

    const colorCanvas = colorCanvasRef.current;
    if (!colorCanvas) return;
    const ctx = colorCanvas.getContext('2d');
    if (!ctx) return;

    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = brushSize;
    ctx.strokeStyle = activeTool === 'eraser' ? '#FFFFFF' : selectedColor;

    ctx.beginPath();
    ctx.arc(x, y, brushSize / 2, 0, Math.PI * 2);
    ctx.fillStyle = ctx.strokeStyle;
    ctx.fill();
  };

  const handlePointerMove = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current || !lastPointRef.current) return;
    const { x, y } = getCanvasCoordinates(e);

    const colorCanvas = colorCanvasRef.current;
    if (!colorCanvas) return;
    const ctx = colorCanvas.getContext('2d');
    if (!ctx) return;

    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = brushSize;
    ctx.strokeStyle = activeTool === 'eraser' ? '#FFFFFF' : selectedColor;

    ctx.beginPath();
    ctx.moveTo(lastPointRef.current.x, lastPointRef.current.y);
    ctx.lineTo(x, y);
    ctx.stroke();

    lastPointRef.current = { x, y };
  };

  const handlePointerUp = () => {
    if (isDrawingRef.current) {
      isDrawingRef.current = false;
      lastPointRef.current = null;
      saveHistoryState();
    }
  };

  // Flatten both layers to get a clean final merged image
  const getMergedImageDataUrl = (): string => {
    const colorCanvas = colorCanvasRef.current;
    const lineCanvas = lineArtCanvasRef.current;
    if (!colorCanvas || !lineCanvas) return '';

    const exportCanvas = document.createElement('canvas');
    exportCanvas.width = colorCanvas.width;
    exportCanvas.height = colorCanvas.height;
    const ctx = exportCanvas.getContext('2d');
    if (!ctx) return '';

    // Draw bottom colored layer
    ctx.drawImage(colorCanvas, 0, 0);

    // Composite line art on top with multiply blend mode so pure black outlines pop over colors!
    ctx.globalCompositeOperation = 'multiply';
    ctx.drawImage(lineCanvas, 0, 0);
    ctx.globalCompositeOperation = 'source-over';

    return exportCanvas.toDataURL('image/png');
  };

  const handleSaveToBook = () => {
    const merged = getMergedImageDataUrl();
    if (!merged) return;
    onSaveColoredPage(page.id, merged);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleDownloadPng = () => {
    const merged = getMergedImageDataUrl();
    if (!merged) return;
    const link = document.createElement('a');
    link.download = `${childName}_page_${page.pageNumber}_colored.png`;
    link.href = merged;
    link.click();
  };

  const handlePrintPage = () => {
    const merged = getMergedImageDataUrl();
    if (!merged) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>${page.title} - Colored by ${childName}</title>
          <style>
            body { margin: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; font-family: sans-serif; }
            img { max-width: 90vw; max-height: 85vh; border: 2px solid #000; }
            h2 { margin: 12px 0 4px; font-size: 18px; }
            p { margin: 0 0 16px; color: #666; font-size: 13px; }
          </style>
        </head>
        <body>
          <h2>${page.title}</h2>
          <p>Created with WonderCraft for ${childName}</p>
          <img src="${merged}" onload="window.print();window.close();" />
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-slate-900/60 backdrop-blur-sm">
      <div className="relative flex flex-col w-full max-w-5xl h-[92vh] bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Studio Header */}
        <div className="flex items-center justify-between px-6 py-3.5 bg-amber-50/70 border-b border-amber-200/60 shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-amber-400 text-amber-950 font-bold shadow-sm">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900 font-display">
                  {page.title}
                </h3>
                <span className="text-xs text-amber-800 bg-amber-200/60 font-semibold px-2 py-0.5 rounded-full">
                  {page.pageNumber === 0 ? 'Cover Art' : `Page ${page.pageNumber} of 5`}
                </span>
              </div>
              <p className="text-xs text-slate-500 line-clamp-1">
                {page.description || 'Color your masterpiece with crayons or tap-to-fill!'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSaveToBook}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                savedSuccess
                  ? 'bg-emerald-600 text-white'
                  : 'bg-amber-500 hover:bg-amber-600 text-amber-950 shadow-sm'
              }`}
            >
              <Check className="w-4 h-4" />
              {savedSuccess ? 'Saved in Book!' : 'Save in Book'}
            </button>
            <button
              onClick={handleDownloadPng}
              title="Download PNG image"
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-amber-100/60 rounded-lg transition-colors"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              onClick={handlePrintPage}
              title="Print this page"
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-amber-100/60 rounded-lg transition-colors"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Studio Body (Two-zone layout: Tools Left & Canvas Center) */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left Toolbox */}
          <div className="w-72 bg-slate-50 border-r border-slate-200 p-4 flex flex-col gap-4 overflow-y-auto shrink-0">
            {/* Tool Modes */}
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
                Coloring Tools
              </span>
              <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-200/70 rounded-xl">
                <button
                  onClick={() => setActiveTool('bucket')}
                  className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg text-xs font-medium transition-all ${
                    activeTool === 'bucket'
                      ? 'bg-white text-slate-900 shadow-sm font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <PaintBucket className="w-4 h-4 mb-1 text-amber-600" />
                  Tap to Fill
                </button>
                <button
                  onClick={() => setActiveTool('brush')}
                  className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg text-xs font-medium transition-all ${
                    activeTool === 'brush'
                      ? 'bg-white text-slate-900 shadow-sm font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Brush className="w-4 h-4 mb-1 text-indigo-600" />
                  Crayon
                </button>
                <button
                  onClick={() => setActiveTool('eraser')}
                  className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg text-xs font-medium transition-all ${
                    activeTool === 'eraser'
                      ? 'bg-white text-slate-900 shadow-sm font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Eraser className="w-4 h-4 mb-1 text-rose-500" />
                  Eraser
                </button>
              </div>
            </div>

            {/* Brush Size (if in brush or eraser mode) */}
            {activeTool !== 'bucket' && (
              <div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
                  Stroke Size
                </span>
                <div className="grid grid-cols-4 gap-1">
                  {BRUSH_SIZES.map((b) => (
                    <button
                      key={b.label}
                      onClick={() => setBrushSize(b.size)}
                      className={`py-1.5 text-xs rounded-lg border transition-all ${
                        brushSize === b.size
                          ? 'border-indigo-600 bg-indigo-50 font-bold text-indigo-700'
                          : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      {b.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Crayon Color Palette */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Crayon Box
                </span>
                <label className="flex items-center gap-1 text-[11px] text-slate-500 cursor-pointer hover:text-slate-800">
                  <span>Custom:</span>
                  <input
                    type="color"
                    value={selectedColor}
                    onChange={(e) => setSelectedColor(e.target.value)}
                    className="w-5 h-5 rounded cursor-pointer border border-slate-300 p-0"
                  />
                </label>
              </div>

              <div className="grid grid-cols-4 gap-2">
                {CRAYON_PALETTE.map((c) => {
                  const isSelected = selectedColor.toLowerCase() === c.hex.toLowerCase();
                  return (
                    <button
                      key={c.name}
                      onClick={() => setSelectedColor(c.hex)}
                      title={c.name}
                      style={{ backgroundColor: c.hex }}
                      className={`h-9 rounded-xl border-2 transition-transform hover:scale-105 relative flex items-center justify-center ${
                        isSelected
                          ? 'border-slate-900 ring-2 ring-slate-900/20 scale-105 shadow-sm'
                          : 'border-white/60 shadow-xs'
                      }`}
                    >
                      {isSelected && (
                        <div className="w-2 h-2 rounded-full bg-white shadow-xs" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* History Controls */}
            <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-1">
                <button
                  onClick={handleUndo}
                  disabled={historyIndex <= 0}
                  title="Undo"
                  className="p-2 rounded-lg text-slate-600 hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button
                  onClick={handleRedo}
                  disabled={historyIndex >= history.length - 1}
                  title="Redo"
                  className="p-2 rounded-lg text-slate-600 hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <RotateCw className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={handleReset}
                title="Clear all colors"
                className="flex items-center gap-1 text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-2 py-1.5 rounded-lg transition-colors font-medium"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Clear
              </button>
            </div>
          </div>

          {/* Interactive Canvas Center Stage */}
          <div className="flex-1 bg-stone-100/80 flex items-center justify-center p-4 overflow-auto">
            <div className="relative shadow-xl rounded-xl border border-stone-300 bg-white overflow-hidden max-h-full aspect-[3/4] flex items-center justify-center">
              {/* Bottom Layer: Coloring / Paints */}
              <canvas
                ref={colorCanvasRef}
                className="absolute inset-0 w-full h-full object-contain"
                style={{ imageRendering: 'auto' }}
              />

              {/* Top Layer: Black & White Line Art (Multiply Blend Mode) */}
              <canvas
                ref={lineArtCanvasRef}
                onMouseDown={handlePointerDown}
                onMouseMove={handlePointerMove}
                onMouseUp={handlePointerUp}
                onMouseLeave={handlePointerUp}
                onTouchStart={handlePointerDown}
                onTouchMove={handlePointerMove}
                onTouchEnd={handlePointerUp}
                className={`relative w-full h-full object-contain cursor-crosshair select-none touch-none ${
                  activeTool === 'bucket' ? 'cursor-cell' : 'cursor-crosshair'
                }`}
                style={{
                  mixBlendMode: 'multiply',
                  imageRendering: 'crisp-edges',
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
