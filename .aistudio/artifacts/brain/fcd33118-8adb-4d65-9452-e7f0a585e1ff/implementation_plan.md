# WonderCraft: Children's Coloring Book Generator & Creative Studio

WonderCraft is an interactive, print-ready children's coloring book generator that creates personalized, five-page black-and-white coloring storybooks with custom covers bearing the child's name. It combines high-resolution line art generation (`gemini-3-pro-image-preview`), an interactive in-browser digital coloring canvas, an AI story brainstorming companion (`gemini-3.8-flash`), and multi-page print-ready PDF export.

---

### User Review & Critical Decisions

> [!IMPORTANT]
> The following product specifications were confirmed during the interactive interview:
> - **Line Art & Age Adaptation**: Selectable age brackets before generation: **Toddler (2–4 yrs)** (extra-thick outlines, minimal clutter), **Early Reader (5–7 yrs)** (balanced playful storytelling), and **Explorer (8+ yrs)** (intricate line work and detailed scenery).
> - **AI Chatbot Persona**: Creative Story and Theme Brainstormer powered by `gemini-3.8-flash`, capable of suggesting wacky themes, character names, and 5-page story outlines, with one-click actions to inject brainstormed ideas into the generator.
> - **Digital Coloring Studio**: Full in-app interactive canvas alongside the PDF export, featuring kid-friendly crayon palettes, adjustable brush sizes, flood-fill bucket, undo/redo history, and individual page PNG saving.
> - **Resolution Affordance**: User-selectable resolution toggle supporting **1K**, **2K**, and **4K** using `gemini-3-pro-image-preview` for crisp print fidelity.

---

### 1. Overview & Core Concept

WonderCraft turns simple ideas like *"space dinosaurs"* or *"underwater unicorns"* into a personalized, printed keepsake or digital activity book:
1. **Personalized Storybook Setup**: Parents or kids provide the child's name, book theme, chosen age bracket, and target print resolution (1K, 2K, or 4K).
2. **Page Concept & Outline Generation**: WonderCraft generates 5 distinct, sequential story scenes plus an ornate, personalized title cover frame (e.g. *"Leo's Cosmic Dino Odyssey: An Epic Coloring Book"*).
3. **Black-and-White Art Engine**: High-fidelity, pure black-and-white line art generation using `gemini-3-pro-image-preview` with prompt guardrails prohibiting greyscale shading, halftones, or photographic textures.
4. **Digital Colorist Canvas**: A playful, tactile coloring experience where children can color right on the screen using digital crayons, markers, flood fill bucket, and eraser before printing.
5. **Print-Ready PDF Assembly**: Single-click compilation into an 8.5" x 11" or A4 multi-page printable book featuring cover art, personalized dedication, page numbers, and five full-bleed coloring pages.
6. **Creative Brainstorming Companion**: A built-in chat drawer with a warm, encouraging storyteller role to help children brainstorm character quirks, scene twists, and catchy book titles.

---

### 2. User Experience & Visual Design

#### Visual Identity & Theme
- **Aesthetic Direction**: Playful, warm, tactile stationery aesthetic. Clean cream/off-white background (`bg-amber-50/40`), soft rounded cards, ink-drawn borders, and joyful pastel accents that celebrate childhood creativity without feeling cluttered.
- **Color Palette**:
  - *Dominant Canvas (60%)*: Crisp warm parchment white (`#FDFBF7`) and soft neutral backgrounds (`#F8F6F0`).
  - *Structural Panels (30%)*: Deep slate borders (`#E2E8F0`), warm stone cards (`#FFFFFF`), and dark ink text (`#1E293B`).
  - *Joyful Accents (10%)*: Cheerful coral (`#F43F5E`), sunshine marigold (`#F59E0B`), sky azure (`#0EA5E9`), and crayon violet (`#8B5CF6`).
- **Typography**: Friendly, highly legible typography pairing:
  - *Display / Book Titles*: Warm, characterful sans/display (`Outfit` / `Plus Jakarta Sans`, 600–700 weight).
  - *Body Prose & Controls*: Clean, highly legible sans (`Plus Jakarta Sans` / `DM Sans`).
  - *Page Numbers & Metrics*: Tabular numerals for clean alignment (`font-mono tabular-nums`).
- **Layout Rhythm**:
  - *Top Bar*: Clean 3-zone contract with brand wordmark, quick preset themes, and direct action button.
  - *Main Stage (Hero / Creation Panel)*: Two-column split between generation controls (Theme, Child's Name, Age Bracket, Resolution) and live book preview.
  - *Interactive Book Stage*: Carousel/tabbed view of the Cover + 5 Pages with single-page zoom, page regeneration modal, and direct "Color Online" mode.
  - *Digital Canvas Studio Modal*: Full-screen or large modal with tool palette (Crayon, Brush, Fill Bucket, Eraser, Color Wheel, Undo/Redo) and printable export.

---

### 3. Key Product Decisions & Trade-Offs

1. **Server-Side Gemini Generation with Direct Express Endpoints**:
   - *Chosen Approach*: Implement full-stack Express routes (`/api/generate-outline`, `/api/generate-page-image`, `/api/chat`) calling the `@google/genai` SDK on the backend.
   - *Why*: Strict adherence to API key security constraints and consistent prompt formatting for pure line art styling.
2. **Client-Side Vector/Raster PDF Compilation (`jspdf`)**:
   - *Chosen Approach*: Use client-side `jspdf` to compile high-resolution 1K/2K/4K image data URLs into a multi-page PDF document.
   - *Why*: Instant download without uploading heavy multi-megabyte PDFs back and forth to the server; provides responsive progress indicators during generation.
3. **Canvas-Based Flood Fill & Brush Engine**:
   - *Chosen Approach*: HTML5 Canvas 2D context with an optimized scanline flood-fill algorithm that detects line art boundaries (black contours) while filling interior white regions.
   - *Why*: Gives children the intuitive joy of both "magic tap-to-fill" coloring and freehand brush strokes.
4. **Sequential & Per-Page Regenerate Flow**:
   - *Chosen Approach*: Allow generation of all 5 pages at once, or regenerating any individual page with a specific prompt adjustment.
   - *Why*: Parents and kids can tweak a single scene if a dinosaur is missing its helmet or needs a cupcake, without wasting credits rebuilding the entire book.

---

### 4. Technical Architecture & Data Strategy

#### Architecture & Component Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                             WonderCraft Frontend                            │
├──────────────────────┬──────────────────────────────────────────────────────┤
│  Navigation Top Bar  │ Brand Wordmark · Quick Themes · Help / Chat Toggle   │
├──────────────────────┼──────────────────────────────────────────────────────┤
│  Book Creator Form   │ Child's Name · Theme · Age Group · Resolution (1K/2K)│
├──────────────────────┴──────────────────────────────────────────────────────┤
│                             Book Workspace View                             │
│  ┌─────────────────────────────┐  ┌──────────────────────────────────────┐  │
│  │   Book Cover & 5 Pages Grid │  │   Interactive Digital Canvas Modal   │  │
│  │   - High-Res Image Card     │  │   - Flood Fill & Crayon Brushes      │  │
│  │   - Scene Prompt & Title    │  │   - Undo / Redo & Color Swatches     │  │
│  │   - Regenerate Single Page  │  │   - Save Colored Version / Print     │  │
│  │   - Reorder & Page Flip     │  │                                      │  │
│  └─────────────────────────────┘  └──────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │ Actions Deck: Multi-Page PDF Download · Print Book · Save Project     │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
├─────────────────────────────────────────────────────────────────────────────┤
│  Gemini Chat Companion Drawer (gemini-3.8-flash: Story & Theme Assistant)   │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │ HTTP POST /api/*
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                             Backend Express API                             │
│  - POST /api/storybook/outline    -> Generates 5 scenes + cover story plan  │
│  - POST /api/storybook/page-image -> gemini-3-pro-image-preview (1K/2K/4K)  │
│  - POST /api/chat                 -> gemini-3.8-flash conversation thread   │
└─────────────────────────────────────────────────────────────────────────────┘
```

#### Data Model & State

```ts
export type AgeLevel = 'toddler' | 'early_reader' | 'explorer';
export type ImageResolution = '1K' | '2K' | '4K';

export interface ColoringPage {
  id: string;
  pageNumber: number; // 0 for Cover, 1 to 5 for pages
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
  suggestedTheme?: string;
  suggestedScenes?: string[];
  timestamp: string;
}
```

#### Interactive Component & State Mapping

1. **Book Setup (`BookForm.tsx`)**:
   - Collects `childName`, `theme`, `ageLevel` (Toddler/Early/Explorer), and `resolution` (1K/2K/4K).
   - Validates inputs and triggers `/api/storybook/outline`, populating the 5 story scenes and cover title.
2. **Generation Progress & Page Grid (`PageGrid.tsx` & `PageCard.tsx`)**:
   - Displays real-time generation status with playful kid-friendly messages ("Sharpening crayons...", "Sketching the dinosaurs...", "Inking the line art...").
   - Supports individual page regeneration with custom prompt tweaks.
3. **Interactive Coloring Canvas (`ColoringStudioModal.tsx`)**:
   - Loads the black-and-white page onto an HTML5 canvas.
   - Provides tool switching (Flood Fill, Crayon, Brush, Eraser, Color Picker, Palette Presets).
   - Manages state history (undo/redo stack) and allows saving colored state back to the book.
4. **PDF Exporter (`pdfExport.ts`)**:
   - Uses `jspdf` to create a multi-page document:
     - Page 1: Custom illustrated Cover with bold title, "Created specially for [Child Name]", and decorative border.
     - Pages 2–6: The 5 coloring scenes with page numbers and scene captions.
   - Formatted for direct home printing (Letter / A4) with generous margins.
5. **Story Brainstormer Chat (`ChatDrawer.tsx`)**:
   - Multi-turn conversation with `gemini-3.8-flash`.
   - Maintains chat thread history.
   - Suggests playful scene ideas, funny plot points, and catchy titles with one-click "Use this theme" action.

---

### Verification Checklist & Plan Milestones

- [ ] Create server routes for outline generation, image generation (`gemini-3-pro-image-preview` with 1K/2K/4K support), and multi-turn chat (`gemini-3.8-flash`).
- [ ] Build responsive UI with TopBar, Setup Form, Theme Presets, Page Carousel, and Coloring Canvas.
- [ ] Implement flood-fill and freehand drawing on HTML5 canvas.
- [ ] Implement high-resolution multi-page PDF generation with personalized cover.
- [ ] Verify compilation with `compile_applet` and test end-to-end user journey.
