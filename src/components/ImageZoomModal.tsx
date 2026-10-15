import React from 'react';
import { X, Download, Printer } from 'lucide-react';

interface ImageZoomModalProps {
  imageUrl: string | null;
  title: string;
  onClose: () => void;
}

export const ImageZoomModal: React.FC<ImageZoomModalProps> = ({
  imageUrl,
  title,
  onClose,
}) => {
  if (!imageUrl) return null;

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    printWindow.document.write(`
      <html>
        <head>
          <title>${title} - WonderCraft Printable</title>
          <style>
            body { margin: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; font-family: sans-serif; }
            img { max-width: 90vw; max-height: 85vh; border: 2px solid #000; }
            h2 { margin: 12px 0 4px; font-size: 18px; }
            p { margin: 0 0 16px; color: #666; font-size: 13px; }
          </style>
        </head>
        <body>
          <h2>${title}</h2>
          <p>WonderCraft Black & White Line Art Edition</p>
          <img src="${imageUrl}" onload="window.print();window.close();" />
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative max-w-3xl w-full max-h-[90vh] bg-white rounded-2xl p-4 shadow-2xl flex flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-full flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-900 font-display">{title}</h3>
            <span className="text-[11px] text-slate-400">High-Fidelity Printable Line Art</span>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={handlePrint}
              title="Print single page"
              className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <Printer className="w-4 h-4" />
            </button>
            <a
              href={imageUrl}
              download={`${title.replace(/\s+/g, '_')}.png`}
              title="Download image"
              className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <Download className="w-4 h-4" />
            </a>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-2 flex items-center justify-center">
          <img
            src={imageUrl}
            alt={title}
            className="max-h-[75vh] w-auto object-contain rounded-lg shadow-xs border border-slate-200"
          />
        </div>
      </div>
    </div>
  );
};
