export type AgeLevel = 'toddler' | 'early_reader' | 'explorer';
export type ImageResolution = '1K' | '2K' | '4K';

export interface ColoringPage {
  id: string;
  pageNumber: number; // 0 = Cover, 1..5 = Story Pages
  title: string;
  description: string;
  prompt: string;
  imageUrl?: string;
  coloredDataUrl?: string;
  isGenerating: boolean;
  error?: string;
}

export interface ColoringBook {
  id: string;
  title: string;
  childName: string;
  theme: string;
  ageLevel: AgeLevel;
  resolution: ImageResolution;
  cover: ColoringPage;
  pages: ColoringPage[];
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface OutlineResponse {
  bookTitle: string;
  coverPrompt: string;
  pages: {
    pageNumber: number;
    title: string;
    description: string;
    prompt: string;
  }[];
}
