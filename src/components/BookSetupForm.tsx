import React from 'react';
import {
  Sparkles,
  Wand2,
  HelpCircle,
  Layers,
  Baby,
  Smile,
  Compass,
} from 'lucide-react';
import { AgeLevel, ImageResolution } from '../types';
import { SAMPLE_THEMES } from '../utils/sampleData';

interface BookSetupFormProps {
  childName: string;
  theme: string;
  ageLevel: AgeLevel;
  resolution: ImageResolution;
  isGeneratingOutline: boolean;
  onChildNameChange: (name: string) => void;
  onThemeChange: (theme: string) => void;
  onAgeLevelChange: (level: AgeLevel) => void;
  onResolutionChange: (res: ImageResolution) => void;
  onSubmit: (e: React.FormEvent) => void;
  onOpenChat: () => void;
}

export const BookSetupForm: React.FC<BookSetupFormProps> = ({
  childName,
  theme,
  ageLevel,
  resolution,
  isGeneratingOutline,
  onChildNameChange,
  onThemeChange,
  onAgeLevelChange,
  onResolutionChange,
  onSubmit,
  onOpenChat,
}) => {
  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 border border-amber-200/70 shadow-sm relative overflow-hidden">
      {/* Decorative Warm Banner */}
      <div className="flex items-center justify-between pb-6 border-b border-slate-100 mb-6">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-slate-900 font-display">
            Create a Personalized Coloring Book
          </h2>
          <p className="text-xs md:text-sm text-slate-500 mt-1">
            Generate 5 distinct black-and-white story pages with a custom cover ready for printing.
          </p>
        </div>
        <button
          type="button"
          onClick={onOpenChat}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200/80 rounded-xl text-xs font-semibold transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>Need Ideas?</span>
        </button>
      </div>

      <form onSubmit={onSubmit} className="space-y-6">
        {/* Child Name & Theme Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Child's Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Child's Name
            </label>
            <input
              type="text"
              required
              value={childName}
              onChange={(e) => onChildNameChange(e.target.value)}
              placeholder="e.g. Leo, Maya, Noah"
              className="w-full px-4 py-3 rounded-xl border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 text-sm font-medium bg-slate-50/50"
            />
            <span className="text-[11px] text-slate-400 mt-1 block">
              Featured on the custom cover dedication and story headers.
            </span>
          </div>

          {/* Book Theme */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Coloring Theme or Story
            </label>
            <input
              type="text"
              required
              value={theme}
              onChange={(e) => onThemeChange(e.target.value)}
              placeholder="e.g. space dinosaurs, underwater safari, magical bakery"
              className="w-full px-4 py-3 rounded-xl border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 text-sm font-medium bg-slate-50/50"
            />
            <span className="text-[11px] text-slate-400 mt-1 block">
              Any imaginative idea! Barnaby can also brainstorm themes for you.
            </span>
          </div>
        </div>

        {/* Quick Theme Inspiration Pills */}
        <div>
          <span className="text-xs font-medium text-slate-500 mb-2 block">
            Popular Themes for Inspiration:
          </span>
          <div className="flex flex-wrap gap-2">
            {SAMPLE_THEMES.map((item) => (
              <button
                key={item.theme}
                type="button"
                onClick={() => {
                  onThemeChange(item.theme);
                  onAgeLevelChange(item.ageLevel);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors flex items-center gap-1.5 ${
                  theme.toLowerCase() === item.theme.toLowerCase()
                    ? 'border-amber-500 bg-amber-50 text-amber-900 font-semibold'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <span>{item.theme}</span>
                <span className="text-[10px] text-amber-600 font-normal">
                  ({item.badge})
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Age Level & Resolution Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
          {/* Age Level Selector */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Age Group & Art Style
              </label>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => onAgeLevelChange('toddler')}
                className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                  ageLevel === 'toddler'
                    ? 'border-amber-500 bg-amber-50/70 ring-1 ring-amber-500/50'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <Baby className="w-4 h-4 text-amber-600" />
                  <span className="text-[10px] font-bold text-amber-800">2-4 yrs</span>
                </div>
                <div className="font-bold text-xs text-slate-900">Toddler</div>
                <div className="text-[11px] text-slate-500 leading-tight mt-0.5">
                  Extra thick outlines, large simple shapes.
                </div>
              </button>

              <button
                type="button"
                onClick={() => onAgeLevelChange('early_reader')}
                className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                  ageLevel === 'early_reader'
                    ? 'border-amber-500 bg-amber-50/70 ring-1 ring-amber-500/50'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <Smile className="w-4 h-4 text-amber-600" />
                  <span className="text-[10px] font-bold text-amber-800">5-7 yrs</span>
                </div>
                <div className="font-bold text-xs text-slate-900">Early Reader</div>
                <div className="text-[11px] text-slate-500 leading-tight mt-0.5">
                  Balanced cheerful story scenes.
                </div>
              </button>

              <button
                type="button"
                onClick={() => onAgeLevelChange('explorer')}
                className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                  ageLevel === 'explorer'
                    ? 'border-amber-500 bg-amber-50/70 ring-1 ring-amber-500/50'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <Compass className="w-4 h-4 text-amber-600" />
                  <span className="text-[10px] font-bold text-amber-800">8+ yrs</span>
                </div>
                <div className="font-bold text-xs text-slate-900">Explorer</div>
                <div className="text-[11px] text-slate-500 leading-tight mt-0.5">
                  Intricate patterns and detailed linework.
                </div>
              </button>
            </div>
          </div>

          {/* Resolution Affordance (1K, 2K, 4K) using gemini-3-pro-image-preview */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1">
                <span>Print Resolution</span>
                <span className="text-slate-400 font-normal lowercase">(gemini-3-pro-image-preview)</span>
              </label>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {(['1K', '2K', '4K'] as ImageResolution[]).map((res) => (
                <button
                  key={res}
                  type="button"
                  onClick={() => onResolutionChange(res)}
                  className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                    resolution === res
                      ? 'border-indigo-600 bg-indigo-50/70 ring-1 ring-indigo-500/50'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <Layers className="w-4 h-4 text-indigo-600" />
                    <span className="text-[10px] font-bold text-indigo-800">
                      {res === '1K' ? 'Fast' : res === '2K' ? 'Crisp' : 'Ultra'}
                    </span>
                  </div>
                  <div className="font-bold text-xs text-slate-900">{res} Resolution</div>
                  <div className="text-[11px] text-slate-500 leading-tight mt-0.5">
                    {res === '1K'
                      ? '1024px standard'
                      : res === '2K'
                      ? '2048px crisp print'
                      : '4096px ultra detail'}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isGeneratingOutline || !childName.trim() || !theme.trim()}
            className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-amber-500 hover:bg-amber-600 active:bg-amber-700 disabled:opacity-40 disabled:cursor-not-allowed text-amber-950 font-bold text-sm shadow-md transition-all font-display"
          >
            {isGeneratingOutline ? (
              <>
                <Wand2 className="w-4 h-4 animate-spin" />
                <span>Crafting Your 5-Page Story Outline...</span>
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4" />
                <span>Generate {childName ? `${childName}'s` : ''} 5-Page Coloring Book</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
