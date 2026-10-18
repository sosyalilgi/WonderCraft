import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json({ limit: '30mb' }));

// CORS headers to prevent 404/CORS issues on reverse proxy or external domains
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  next();
});

// Serve public assets (favicon.svg, etc.)
app.use(express.static(path.resolve(__dirname, 'public')));

// Verify and log whether process.env.GEMINI_API_KEY is defined or undefined upon server startup
console.log(`process.env.GEMINI_API_KEY is: ${process.env.GEMINI_API_KEY !== undefined ? 'defined' : 'undefined'}`);

const rawGeminiKey = process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.trim() : '';
if (rawGeminiKey) {
  const masked = rawGeminiKey.length > 8
    ? `${rawGeminiKey.slice(0, 4)}...${rawGeminiKey.slice(-4)}`
    : '***';
  console.log(`[Config] GEMINI_API_KEY is successfully loaded from environment: ${masked} (length: ${rawGeminiKey.length})`);
} else {
  console.warn('[Config] WARNING: GEMINI_API_KEY is not defined or empty in process.env. Ensure GEMINI_API_KEY is set in .env or Dokploy/Docker environment variables.');
}

const ai = new GoogleGenAI({
  apiKey: rawGeminiKey || undefined,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Root API discovery endpoint
app.get('/api', (req, res) => {
  res.json({
    name: 'WonderCraft API',
    status: 'online',
    version: '1.0.0',
    endpoints: [
      'GET  /api/health',
      'POST /api/outline',
      'POST /api/generate-image',
      'POST /api/chat',
      'POST /api/share',
      'GET  /api/share/:shareId',
    ],
  });
});

// Health check endpoint for container monitoring (Dokploy, Traefik, Docker)
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'wondercraft',
    geminiKeyStatus: process.env.GEMINI_API_KEY !== undefined ? 'defined' : 'undefined',
    geminiConfigured: Boolean(rawGeminiKey),
    timestamp: new Date().toISOString()
  });
});

// Favicon & SEO Static Handlers to guarantee correct MIME types across reverse proxies
app.get(['/favicon.ico', '/favicon.svg'], (req, res) => {
  const publicSvg = path.resolve(__dirname, 'public', 'favicon.svg');
  if (fs.existsSync(publicSvg)) {
    res.setHeader('Content-Type', 'image/svg+xml');
    return res.sendFile(publicSvg);
  }
  const distSvg = path.resolve(__dirname, 'dist', 'favicon.svg');
  if (fs.existsSync(distSvg)) {
    res.setHeader('Content-Type', 'image/svg+xml');
    return res.sendFile(distSvg);
  }
  return res.status(204).end();
});

app.get('/robots.txt', (req, res) => {
  const file = fs.existsSync(path.resolve(__dirname, 'public', 'robots.txt'))
    ? path.resolve(__dirname, 'public', 'robots.txt')
    : path.resolve(__dirname, 'dist', 'robots.txt');
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  if (fs.existsSync(file)) {
    return res.sendFile(file);
  }
  return res.send('User-agent: *\nAllow: /\nDisallow: /api/\nSitemap: /sitemap.xml\n');
});

app.get('/sitemap.xml', (req, res) => {
  const file = fs.existsSync(path.resolve(__dirname, 'public', 'sitemap.xml'))
    ? path.resolve(__dirname, 'public', 'sitemap.xml')
    : path.resolve(__dirname, 'dist', 'sitemap.xml');
  res.setHeader('Content-Type', 'application/xml; charset=utf-8');
  if (fs.existsSync(file)) {
    return res.sendFile(file);
  }
  return res.status(404).send('Sitemap not found');
});

app.get('/site.webmanifest', (req, res) => {
  const file = fs.existsSync(path.resolve(__dirname, 'public', 'site.webmanifest'))
    ? path.resolve(__dirname, 'public', 'site.webmanifest')
    : path.resolve(__dirname, 'dist', 'site.webmanifest');
  res.setHeader('Content-Type', 'application/manifest+json; charset=utf-8');
  if (fs.existsSync(file)) {
    return res.sendFile(file);
  }
  return res.status(404).send('Manifest not found');
});

app.get('/og-image.svg', (req, res) => {
  const file = fs.existsSync(path.resolve(__dirname, 'public', 'og-image.svg'))
    ? path.resolve(__dirname, 'public', 'og-image.svg')
    : path.resolve(__dirname, 'dist', 'og-image.svg');
  res.setHeader('Content-Type', 'image/svg+xml');
  if (fs.existsSync(file)) {
    return res.sendFile(file);
  }
  return res.status(404).end();
});

// Temporary in-memory storage for shared coloring books (7-day TTL)
interface SharedBookRecord {
  book: any;
  expiresAt: number;
  createdAt: number;
}
const sharedBooks = new Map<string, SharedBookRecord>();

// Periodic cleanup of expired shares every hour
setInterval(() => {
  const now = Date.now();
  for (const [id, record] of sharedBooks.entries()) {
    if (record.expiresAt < now) {
      sharedBooks.delete(id);
    }
  }
}, 60 * 60 * 1000);

// Endpoint to generate unique temporary share URL
app.post('/api/share', (req, res) => {
  try {
    const { book } = req.body;
    if (!book || !book.id) {
      return res.status(400).json({ error: 'Book data is required to create a share link.' });
    }

    // Generate unique short slug
    const randomHex = Math.random().toString(36).substring(2, 8);
    const timestamp = Date.now().toString(36);
    const shareId = `wc_${randomHex}_${timestamp}`;

    // 7 days expiration (in ms)
    const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;
    const expiresAt = Date.now() + SEVEN_DAYS_MS;

    sharedBooks.set(shareId, {
      book,
      expiresAt,
      createdAt: Date.now(),
    });

    const host = req.get('host') || 'localhost:3000';
    const protocol = req.headers['x-forwarded-proto'] || req.protocol || 'http';
    const baseUrl = process.env.APP_URL || `${protocol}://${host}`;
    const shareUrl = `${baseUrl.replace(/\/$/, '')}?share=${shareId}`;

    return res.json({
      shareId,
      shareUrl,
      expiresAt: new Date(expiresAt).toISOString(),
      expiresInDays: 7,
    });
  } catch (error: any) {
    console.error('Error generating share link:', error);
    return res.status(500).json({ error: 'Failed to create share link.' });
  }
});

// Endpoint to fetch shared book by shareId
app.get('/api/share/:shareId', (req, res) => {
  const { shareId } = req.params;
  const record = sharedBooks.get(shareId);

  if (!record) {
    return res.status(404).json({ error: 'Shared coloring book not found or link has expired.' });
  }

  if (record.expiresAt < Date.now()) {
    sharedBooks.delete(shareId);
    return res.status(410).json({ error: 'This temporary share link has expired.' });
  }

  return res.json({
    book: record.book,
    expiresAt: new Date(record.expiresAt).toISOString(),
    createdAt: new Date(record.createdAt).toISOString(),
  });
});

// Helper for age-specific style descriptors
function getAgeStylePrompt(ageLevel: string): string {
  switch (ageLevel) {
    case 'toddler':
      return 'Simple bold chunky lines, thick distinct black contours, extra large open spaces to color, adorable cute baby characters, minimal clutter, large shapes, designed for toddlers and preschool kids ages 2-4.';
    case 'explorer':
      return 'Intricate black line art, detailed patterned scenery, dynamic composition, clean linework, fascinating details and textures, designed for creative older kids ages 8+.';
    case 'early_reader':
    default:
      return 'Thick clean black outlines, cheerful expressive cartoon characters, balanced playful background elements, clear coloring sections, designed for early elementary kids ages 5-7.';
  }
}

// 1. Outline Generation Endpoint
app.post('/api/outline', async (req, res) => {
  try {
    const { childName = 'Alex', theme = 'space dinosaurs', ageLevel = 'early_reader' } = req.body;

    const ageDesc = getAgeStylePrompt(ageLevel);

    const prompt = `You are a professional children's coloring book author and illustrator planner.
Create a personalized 5-page coloring storybook for a child named "${childName}" based on the theme "${theme}".
Target Age Group: "${ageLevel}" (${ageDesc}).

The book must have:
1. A personalized, exciting "bookTitle" (e.g. "${childName}'s Galactic Dinosaur Adventure").
2. A "coverPrompt" describing a magnificent coloring book front cover. It should feature an ornate decorative coloring border, big friendly coloring-ready bubble lettering spelling "${childName}'s ${theme.toUpperCase()} COLORING ADVENTURE", and the main cute characters welcoming the child.
3. An array of exactly 5 chronological, sequential story "pages". Each page must have:
   - "pageNumber" (1 to 5)
   - "title" (e.g. "Chapter 1: The Rocket Hatch Opens")
   - "description" (1-2 sentences of fun, warm, kid-friendly storytelling that parents or kids can read)
   - "prompt" (detailed art prompt specifying pure black and white line art coloring page, no shading, no grayscale, no color fills, clean white background, depicting the scene clearly).`;

    let responseText = '';
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              bookTitle: { type: Type.STRING },
              coverPrompt: { type: Type.STRING },
              pages: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    pageNumber: { type: Type.INTEGER },
                    title: { type: Type.STRING },
                    description: { type: Type.STRING },
                    prompt: { type: Type.STRING },
                  },
                  required: ['pageNumber', 'title', 'description', 'prompt'],
                },
              },
            },
            required: ['bookTitle', 'coverPrompt', 'pages'],
          },
        },
      });
      responseText = response.text || '';
    } catch (modelErr: any) {
      console.warn('Primary model experienced spike, attempting fallback:', modelErr.message);
      // Fallback to gemini-2.5-flash if gemini-3.8-flash is temporarily 503
      try {
        const fallbackRes = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: `${prompt}\nReturn valid JSON only matching the schema.`,
          config: {
            responseMimeType: 'application/json',
          },
        });
        responseText = fallbackRes.text || '';
      } catch (fallbackErr) {
        console.warn('Fallback model also busy, generating curated structured outline');
      }
    }

    if (responseText) {
      try {
        const parsed = JSON.parse(responseText);
        if (parsed.pages && parsed.pages.length >= 5) {
          return res.json(parsed);
        }
      } catch (e) {
        console.error('JSON parse issue on model output:', e);
      }
    }

    // High quality tailored fallback outline if APIs are experiencing temporary 503 demand spikes
    const fallbackOutline = {
      bookTitle: `${childName}'s ${theme.charAt(0).toUpperCase() + theme.slice(1)} Adventure`,
      coverPrompt: `Coloring book cover with ornate decorative frame, large bold bubble letters "${childName.toUpperCase()}'S ${theme.toUpperCase()} ADVENTURE", thick black outlines on white background.`,
      pages: [
        {
          pageNumber: 1,
          title: `Chapter 1: The Adventure Begins`,
          description: `${childName} steps into a magical world of ${theme}, greeted by cheerful smiling friends.`,
          prompt: `Children coloring book page, ${theme} setting out on an exciting journey, friendly character waving, bold black outlines, pure white background.`,
        },
        {
          pageNumber: 2,
          title: `Chapter 2: Discovery and Wonders`,
          description: `Deep in the realm of ${theme}, an unexpected joyful surprise is discovered!`,
          prompt: `Children coloring book page, ${theme} exploring a wondrous landscape, fun playful details, clean thick line art, white background.`,
        },
        {
          pageNumber: 3,
          title: `Chapter 3: Playful Friends Gathering`,
          description: `All the cute ${theme} companions gather together for a festive celebration.`,
          prompt: `Children coloring book page, cute animal and character friends from ${theme} having a fun party, thick ink lines, coloring sheet.`,
        },
        {
          pageNumber: 4,
          title: `Chapter 4: The Great Expedition`,
          description: `Reaching the highest peaks and brightest stars in the ${theme} kingdom.`,
          prompt: `Children coloring book page, heroic ${theme} scene with playful action, large open spaces for coloring, clean outlines.`,
        },
        {
          pageNumber: 5,
          title: `Chapter 5: Sweet Dreams and Memories`,
          description: `As golden twilight settles over the land, ${childName} and friends rest peacefully under the stars.`,
          prompt: `Children coloring book page, sleepy calm ${theme} characters cozying up for bedtime under smiling stars, thick black line art.`,
        },
      ],
    };

    return res.json(fallbackOutline);
  } catch (error: any) {
    console.error('Error generating outline:', error);
    return res.status(500).json({
      error: error.message || 'Failed to generate storybook outline.',
    });
  }
});

import { generateThematicColoringSvg } from './serverThematicSvg.ts';

// 2. Image Generation Endpoint using gemini-3-pro-image-preview with graceful fallback
app.post('/api/generate-image', async (req, res) => {
  const {
    prompt,
    ageLevel = 'early_reader',
    resolution = '1K', // '1K' | '2K' | '4K'
    isCover = false,
    childName = '',
    pageNumber = 1,
  } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required.' });
  }

  const ageStyle = getAgeStylePrompt(ageLevel);
  const sizeConfig = resolution === '4K' ? '4K' : resolution === '2K' ? '2K' : '1K';

  // Strict prompt formatting to ensure pure line art coloring page
  let finalPrompt = `Children's coloring book page, black and white line art only, thick bold black ink outlines, pure solid white background, zero grayscale, zero shading, zero color, zero gradients, crisp vector coloring sheet style, printable coloring page. `;

  if (isCover && childName) {
    finalPrompt += `Front cover of children's coloring book with ornate printable coloring frame and large bubble letters text reading "${childName}'s Adventure". `;
  }

  finalPrompt += `Subject: ${prompt}. Style notes: ${ageStyle}`;

  let imageUrl = '';
  let isFallback = false;
  let quotaNotice = '';

  // Attempt 1: gemini-3-pro-image-preview (High Quality resolution 1K/2K/4K)
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: {
        parts: [{ text: finalPrompt }],
      },
      config: {
        imageConfig: {
          aspectRatio: '3:4',
          imageSize: sizeConfig,
        },
      },
    });

    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData?.data) {
          const mime = part.inlineData.mimeType || 'image/png';
          imageUrl = `data:${mime};base64,${part.inlineData.data}`;
          break;
        }
      }
    }
  } catch (proErr: any) {
    console.warn(`gemini-3-pro-image failed: ${proErr.message}`);
    quotaNotice = proErr.message || 'Quota exceeded on gemini-3-pro-image';

    // Attempt 2: gemini-3.1-flash-lite-image
    try {
      const flashResponse = await ai.models.generateContent({
        model: 'gemini-3.1-flash-lite-image',
        contents: {
          parts: [{ text: finalPrompt }],
        },
      });

      if (flashResponse.candidates?.[0]?.content?.parts) {
        for (const part of flashResponse.candidates[0].content.parts) {
          if (part.inlineData?.data) {
            const mime = part.inlineData.mimeType || 'image/png';
            imageUrl = `data:${mime};base64,${part.inlineData.data}`;
            break;
          }
        }
      }
    } catch (flashErr: any) {
      console.warn(`gemini-3.1-flash-lite-image also unavailable: ${flashErr.message}`);
    }
  }

  // Attempt 3: High quality printable vector SVG line art
  if (!imageUrl) {
    isFallback = true;
    imageUrl = generateThematicColoringSvg({
      prompt,
      childName,
      isCover,
      ageLevel,
      pageNumber,
    });
  }

  return res.json({
    imageUrl,
    isFallback,
    quotaNotice: isFallback ? quotaNotice : undefined,
  });
});

// 3. Multi-turn Chat Endpoint with gemini-3.8-flash
app.post('/api/chat', async (req, res) => {
  try {
    const { messages = [], childName = '', currentTheme = '' } = req.body;

    // Convert messages to GoogleGenAI format
    const contents = messages.map((m: any) => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }],
    }));

    const systemInstruction = `You are "Tulpar", the legendary winged storyteller and imaginative creative companion inside WonderCraft (inspired by the noble winged steed of ancient Turkic mythology).
Your job is to help kids and parents brainstorm delightful, adventurous, and inspiring coloring book ideas, lifting their imagination to new heights!
Current context:
- Child's Name: ${childName || 'Not specified yet'}
- Current Theme: ${currentTheme || 'None yet'}

Always keep your tone warm, playful, positive, heroic, and child-safe.
When the user asks for suggestions or brainstorming:
1. Provide 2-3 creative, vivid theme ideas with catchy titles and brief 1-sentence explanations.
2. If they ask about characters or story pages, suggest fun scenes (e.g. "Page 1: Dino puts on his shiny helmet", "Page 2: Float past the cheese moon").
3. Suggest a clear "Recommended Theme" in bold (e.g., **Theme: Steampunk Safari Zoo**) so they can easily pick it.
Keep replies concise, formatted with friendly bullet points, and under 180 words.`;

    let replyText = '';
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: contents,
        config: {
          systemInstruction,
          temperature: 0.8,
        },
      });
      replyText = response.text || '';
    } catch (chatErr: any) {
      console.warn('Chat primary model spike, trying fallback:', chatErr.message);
      try {
        const fallbackChat = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: contents,
          config: {
            systemInstruction,
            temperature: 0.8,
          },
        });
        replyText = fallbackChat.text || '';
      } catch (e) {
        replyText = `I'd love to help! How about we try a magical adventure like **Theme: Space Dinosaurs on Mars** or **Theme: Tiny Animal Bakery**? Tell me what ${childName || 'your child'} likes most!`;
      }
    }

    return res.json({ text: replyText });
  } catch (error: any) {
    console.error('Error in chat:', error);
    return res.status(500).json({
      error: error.message || 'Failed to generate chat response.',
    });
  }
});

// Explicit 404 handler for any unmatched /api/* routes (ensures JSON 404 instead of HTML)
app.all('/api/*', (req, res) => {
  res.status(404).json({
    error: 'API endpoint not found',
    method: req.method,
    path: req.originalUrl,
    availableEndpoints: [
      'GET  /api',
      'GET  /api/health',
      'POST /api/outline',
      'POST /api/generate-image',
      'POST /api/chat',
      'POST /api/share',
      'GET  /api/share/:shareId',
    ],
  });
});

// Static / Dev Server integration
async function startServer() {
  const distPath = path.resolve(__dirname, 'dist');
  const hasDist = fs.existsSync(path.join(distPath, 'index.html'));
  const isProd = process.env.NODE_ENV === 'production' || (hasDist && process.env.NODE_ENV !== 'development');
  const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${port}`);
    console.log(`process.env.GEMINI_API_KEY is: ${process.env.GEMINI_API_KEY !== undefined ? 'defined' : 'undefined'}`);
    console.log(`[Startup Verification] GEMINI_API_KEY status: ${process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim() ? 'DETECTED & READY' : 'NOT DETECTED (Fallback mode active)'}`);
  });
}

startServer();
