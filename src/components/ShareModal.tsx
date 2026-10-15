import React, { useState } from 'react';
import {
  X,
  Copy,
  Check,
  Share2,
  Clock,
  Sparkles,
  ExternalLink,
  BookOpen,
} from 'lucide-react';
import { ColoringBook } from '../types';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  book: ColoringBook;
  shareUrl: string | null;
  expiresAt: string | null;
  isLoading: boolean;
  error?: string | null;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  book,
  shareUrl,
  expiresAt,
  isLoading,
  error,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopyLink = async () => {
    if (!shareUrl) return;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  const handleNativeShare = async () => {
    if (!shareUrl || !navigator.share) return;
    try {
      await navigator.share({
        title: `${book.childName}'s Coloring Book Adventure`,
        text: `Look at ${book.childName}'s coloring progress in WonderCraft!`,
        url: shareUrl,
      });
    } catch (err) {
      // User cancelled share
    }
  };

  const coloredCount = book.pages.filter((p) => p.coloredDataUrl).length;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-3xl max-w-md w-full p-6 md:p-7 shadow-2xl border border-slate-200 space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-amber-950 flex items-center justify-center font-bold shadow-xs">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 font-display">
                Share Coloring Progress
              </h3>
              <p className="text-xs text-slate-500">
                Let family and friends view {book.childName}'s artwork online
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Book Preview Card */}
        <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-4 flex items-center gap-3.5">
          <div className="w-12 h-16 bg-white rounded-lg border border-amber-200 shadow-2xs overflow-hidden flex items-center justify-center shrink-0">
            {book.cover.coloredDataUrl || book.cover.imageUrl ? (
              <img
                src={book.cover.coloredDataUrl || book.cover.imageUrl}
                alt="Book cover"
                className="w-full h-full object-cover"
              />
            ) : (
              <BookOpen className="w-5 h-5 text-amber-600" />
            )}
          </div>
          <div className="space-y-0.5 min-w-0 flex-1">
            <h4 className="text-xs font-bold text-slate-900 truncate">
              {book.title}
            </h4>
            <p className="text-[11px] text-slate-600">
              Created for <strong>{book.childName}</strong> • {book.theme}
            </p>
            <div className="flex items-center gap-2 pt-1 text-[11px] text-amber-800 font-medium">
              <Sparkles className="w-3 h-3 text-amber-600" />
              <span>
                {coloredCount > 0
                  ? `${coloredCount} of 5 pages colored`
                  : 'Ready to view & color'}
              </span>
            </div>
          </div>
        </div>

        {/* Share Link Generation State */}
        {isLoading ? (
          <div className="py-6 flex flex-col items-center justify-center space-y-2">
            <div className="w-8 h-8 rounded-full border-3 border-amber-500 border-t-transparent animate-spin" />
            <span className="text-xs font-medium text-slate-600">
              Generating unique viewer link...
            </span>
          </div>
        ) : error ? (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700">
            {error}
          </div>
        ) : shareUrl ? (
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
                Unique Temporary Link
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={shareUrl}
                  onClick={(e) => (e.target as HTMLInputElement).select()}
                  className="flex-1 text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 text-slate-700 font-mono focus:outline-none select-all"
                />
                <button
                  onClick={handleCopyLink}
                  className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-xs ${
                    copied
                      ? 'bg-emerald-600 text-white'
                      : 'bg-amber-500 hover:bg-amber-600 text-amber-950'
                  }`}
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copy link</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Native Mobile Share if supported */}
            {typeof navigator !== 'undefined' && typeof navigator.share === 'function' && (
              <button
                onClick={handleNativeShare}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5 text-slate-600" />
                <span>Share via Messages, WhatsApp, or Email</span>
              </button>
            )}

            {/* Expiry Details */}
            <div className="flex items-center gap-2 text-[11px] text-slate-500 pt-1">
              <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span>
                Valid for <strong>7 days</strong>
                {expiresAt ? ` (until ${new Date(expiresAt).toLocaleDateString()})` : ''} · Anyone with this link can view the progress.
              </span>
            </div>
          </div>
        ) : null}

        {/* Footer info */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
          <span>Read-only viewer link</span>
          <button
            onClick={onClose}
            className="text-xs font-semibold text-slate-600 hover:text-slate-900"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
