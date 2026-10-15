import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Send,
  Sparkles,
  Bot,
  User,
  ArrowRight,
  RefreshCw,
  Lightbulb,
} from 'lucide-react';
import { ChatMessage } from '../types';

interface ChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  childName: string;
  currentTheme: string;
  onSelectTheme: (theme: string) => void;
}

const QUICK_PROMPTS = [
  'Give me 3 wacky theme ideas for my child!',
  'Suggest a 5-page story about space dinosaurs',
  'What are some fun ocean adventure scenes?',
  'Make up a sweet animal bakery story',
];

export const ChatDrawer: React.FC<ChatDrawerProps> = ({
  isOpen,
  onClose,
  childName,
  currentTheme,
  onSelectTheme,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-msg',
      role: 'assistant',
      content: `Hello! I'm Barnaby the Bookish Bear, your coloring book creative partner! 🐻✨\n\nTell me what kind of stories or adventures ${
        childName || 'your child'
      } loves, and I'll brainstorm magical themes, character names, and 5-page story plots for your coloring book!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMsg],
          childName,
          currentTheme,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response from brainstormer');
      }

      const data = await response.json();
      const assistantMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: data.text || 'I love that idea! What else should happen in this story?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      console.error('Chat error:', err);
      const errorMsg: ChatMessage = {
        id: `assistant-err-${Date.now()}`,
        role: 'assistant',
        content: 'Oh bumbleberries! My brainstorming pencil broke for a second. Please try asking again!',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  // Extract recommended theme lines if present
  const extractThemesFromText = (content: string): string[] => {
    const matches: string[] = [];
    const boldThemeRegex = /\*\*Theme:?\s*([^*]+)\*\*/gi;
    let match;
    while ((match = boldThemeRegex.exec(content)) !== null) {
      if (match[1]?.trim()) {
        matches.push(match[1].trim());
      }
    }
    return matches;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-96 md:w-[420px] bg-white shadow-2xl border-l border-slate-200 flex flex-col transition-all">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 bg-amber-500 text-amber-950 border-b border-amber-600/30 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-amber-200/80 text-amber-950 font-bold shadow-xs">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-sm tracking-tight font-display">
              Barnaby's Story Den
            </h3>
            <span className="text-[11px] text-amber-900 font-medium">
              Creative Story & Theme Brainstormer (Gemini 3.8 Flash)
            </span>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-amber-900 hover:bg-amber-600/30 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Quick Prompts Strip */}
      <div className="px-4 py-2.5 bg-amber-50/60 border-b border-slate-100 flex items-center gap-1.5 overflow-x-auto text-xs shrink-0">
        <Lightbulb className="w-3.5 h-3.5 text-amber-600 shrink-0" />
        <span className="text-[11px] text-slate-500 font-semibold shrink-0">Try:</span>
        {QUICK_PROMPTS.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(prompt)}
            className="whitespace-nowrap px-2.5 py-1 bg-white hover:bg-amber-100/70 text-slate-700 hover:text-slate-900 border border-slate-200 rounded-full text-[11px] font-medium transition-colors shrink-0"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Messages Scrollable Thread */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/50">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          const detectedThemes = !isUser ? extractThemesFromText(msg.content) : [];

          return (
            <div
              key={msg.id}
              className={`flex gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                  isUser
                    ? 'bg-slate-900 text-white'
                    : 'bg-amber-400 text-amber-950 shadow-xs'
                }`}
              >
                {isUser ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
              </div>

              <div
                className={`max-w-[82%] rounded-2xl p-3 text-xs leading-relaxed ${
                  isUser
                    ? 'bg-slate-900 text-white rounded-tr-xs'
                    : 'bg-white text-slate-800 border border-slate-200/80 shadow-xs rounded-tl-xs'
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.content}</div>

                {/* If assistant suggested actionable themes, offer direct Apply buttons */}
                {detectedThemes.length > 0 && (
                  <div className="mt-3 pt-2.5 border-t border-slate-100 space-y-1.5">
                    <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block">
                      Use in Your Book:
                    </span>
                    {detectedThemes.map((theme, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          onSelectTheme(theme);
                          onClose();
                        }}
                        className="w-full flex items-center justify-between text-left px-2.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-950 font-semibold rounded-lg text-[11px] transition-colors border border-amber-200/80"
                      >
                        <span className="truncate">{theme}</span>
                        <ArrowRight className="w-3 h-3 text-amber-700 shrink-0 ml-1" />
                      </button>
                    ))}
                  </div>
                )}

                <span
                  className={`block text-[10px] mt-1 text-right ${
                    isUser ? 'text-slate-400' : 'text-slate-400'
                  }`}
                >
                  {msg.timestamp}
                </span>
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex gap-2.5 items-center">
            <div className="w-7 h-7 rounded-full bg-amber-400 text-amber-950 flex items-center justify-center shrink-0">
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-xs p-3 text-xs text-slate-500 flex items-center gap-2">
              <span className="animate-pulse">Barnaby is cooking up creative story ideas...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Field */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="p-3 bg-white border-t border-slate-200 flex items-center gap-2"
      >
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={`Ask Barnaby for themes or story ideas...`}
          className="flex-1 text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 bg-slate-50/60"
        />
        <button
          type="submit"
          disabled={!inputText.trim() || isLoading}
          className="p-2.5 bg-amber-500 hover:bg-amber-600 disabled:opacity-40 disabled:cursor-not-allowed text-amber-950 rounded-xl transition-colors font-medium shadow-xs"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
