import { ColoringBook } from '../types';

// Helper to create clean printable SVG line-art data URLs as fallback/sample illustrations
function createColoringSvgDataUrl(title: string, subtitle: string, iconType: string): string {
  let centerArt = '';
  if (iconType === 'cover') {
    centerArt = `
      <!-- Cover Decorative Stars and Dino -->
      <path d="M250,180 Q320,130 380,180 Q430,240 390,320 Q350,390 280,380 Q210,370 190,300 Q170,220 250,180 Z" fill="none" stroke="#111827" stroke-width="8" stroke-linecap="round" />
      <!-- Astronaut helmet -->
      <circle cx="280" cy="220" r="45" fill="none" stroke="#111827" stroke-width="8" />
      <path d="M250,215 Q280,195 310,215 Q305,245 280,245 Q255,245 250,215 Z" fill="none" stroke="#111827" stroke-width="6" />
      <!-- Cute Dino Eyes & Smile -->
      <circle cx="270" cy="210" r="5" fill="#111827" />
      <circle cx="290" cy="210" r="5" fill="#111827" />
      <path d="M272,225 Q280,233 288,225" fill="none" stroke="#111827" stroke-width="4" stroke-linecap="round" />
      <!-- Spikes -->
      <polygon points="340,160 365,140 375,170" fill="none" stroke="#111827" stroke-width="6" />
      <polygon points="380,200 410,195 405,225" fill="none" stroke="#111827" stroke-width="6" />
      <polygon points="395,250 425,260 405,280" fill="none" stroke="#111827" stroke-width="6" />
      <!-- Cute Planets and Stars -->
      <circle cx="120" cy="120" r="35" fill="none" stroke="#111827" stroke-width="6" />
      <ellipse cx="120" cy="120" rx="55" ry="12" fill="none" stroke="#111827" stroke-width="5" transform="rotate(-25 120 120)" />
      <polygon points="450,110 456,125 472,125 459,135 464,150 450,140 436,150 441,135 428,125 444,125" fill="none" stroke="#111827" stroke-width="5" />
      <polygon points="100,380 105,392 118,392 108,400 112,412 100,404 88,412 92,400 82,392 95,392" fill="none" stroke="#111827" stroke-width="5" />
      <polygon points="470,390 475,402 488,402 478,410 482,422 470,414 458,422 462,410 452,402 465,402" fill="none" stroke="#111827" stroke-width="5" />
    `;
  } else if (iconType === 'rocket') {
    centerArt = `
      <!-- Rocket Body -->
      <path d="M300,140 C340,220 340,320 300,380 C260,320 260,220 300,140 Z" fill="none" stroke="#111827" stroke-width="8" stroke-linecap="round" />
      <circle cx="300" cy="240" r="32" fill="none" stroke="#111827" stroke-width="6" />
      <!-- Little Dino in Window -->
      <path d="M290,230 Q300,220 310,230 Q315,245 300,245 Q285,245 290,230 Z" fill="none" stroke="#111827" stroke-width="4" />
      <circle cx="296" cy="232" r="3" fill="#111827" />
      <circle cx="304" cy="232" r="3" fill="#111827" />
      <!-- Fins -->
      <path d="M260,320 L200,370 L260,370 Z" fill="none" stroke="#111827" stroke-width="7" stroke-linejoin="round" />
      <path d="M340,320 L400,370 L340,370 Z" fill="none" stroke="#111827" stroke-width="7" stroke-linejoin="round" />
      <!-- Exhaust Flames -->
      <path d="M280,385 Q300,450 300,460 Q320,410 320,385" fill="none" stroke="#111827" stroke-width="6" stroke-linecap="round" />
      <!-- Fluffy clouds / Moon surface -->
      <path d="M80,480 Q140,430 220,470 Q300,440 380,470 Q460,430 520,480" fill="none" stroke="#111827" stroke-width="7" />
    `;
  } else if (iconType === 'moon') {
    centerArt = `
      <!-- Moon Surface & Craters -->
      <circle cx="150" cy="160" r="60" fill="none" stroke="#111827" stroke-width="8" />
      <circle cx="130" cy="140" r="14" fill="none" stroke="#111827" stroke-width="5" />
      <circle cx="170" cy="175" r="18" fill="none" stroke="#111827" stroke-width="5" />
      <!-- Cute Brachiosaurus on Moon -->
      <path d="M280,400 Q270,300 320,240 Q350,200 370,160 Q390,140 410,160 Q400,200 360,260 Q400,290 440,320 Q480,360 480,400" fill="none" stroke="#111827" stroke-width="8" stroke-linecap="round" />
      <!-- Dino head & helmet -->
      <circle cx="395" cy="155" r="30" fill="none" stroke="#111827" stroke-width="6" />
      <circle cx="400" cy="150" r="4" fill="#111827" />
      <path d="M395,160 Q403,166 410,160" fill="none" stroke="#111827" stroke-width="3" />
      <!-- Flag planted -->
      <line x1="220" y1="410" x2="220" y2="280" stroke="#111827" stroke-width="7" stroke-linecap="round" />
      <polygon points="220,280 280,305 220,330" fill="none" stroke="#111827" stroke-width="6" stroke-linejoin="round" />
      <!-- Moon Ground -->
      <path d="M60,420 Q200,380 340,410 Q480,390 540,420" fill="none" stroke="#111827" stroke-width="8" />
    `;
  } else if (iconType === 'tea') {
    centerArt = `
      <!-- Space Picnic Table -->
      <ellipse cx="300" cy="380" rx="140" ry="35" fill="none" stroke="#111827" stroke-width="7" />
      <line x1="200" y1="390" x2="190" y2="450" stroke="#111827" stroke-width="7" stroke-linecap="round" />
      <line x1="400" y1="390" x2="410" y2="450" stroke="#111827" stroke-width="7" stroke-linecap="round" />
      <!-- Floating Teapot & Star Cookies -->
      <path d="M270,330 Q270,290 300,290 Q330,290 330,330 Z" fill="none" stroke="#111827" stroke-width="6" />
      <path d="M330,305 Q355,305 345,325" fill="none" stroke="#111827" stroke-width="5" />
      <path d="M270,310 Q250,300 245,315" fill="none" stroke="#111827" stroke-width="5" />
      <!-- Cute Triceratops Guest -->
      <path d="M140,360 Q120,320 140,270 Q170,250 200,280 Q220,320 200,360 Z" fill="none" stroke="#111827" stroke-width="7" />
      <polygon points="120,260 135,275 115,280" fill="none" stroke="#111827" stroke-width="5" />
      <polygon points="160,240 170,258 150,260" fill="none" stroke="#111827" stroke-width="5" />
      <polygon points="205,260 215,278 195,280" fill="none" stroke="#111827" stroke-width="5" />
    `;
  } else if (iconType === 'stars') {
    centerArt = `
      <!-- Constellation connecting Dino -->
      <circle cx="160" cy="180" r="10" fill="none" stroke="#111827" stroke-width="6" />
      <circle cx="250" cy="150" r="10" fill="none" stroke="#111827" stroke-width="6" />
      <circle cx="350" cy="190" r="10" fill="none" stroke="#111827" stroke-width="6" />
      <circle cx="420" cy="280" r="10" fill="none" stroke="#111827" stroke-width="6" />
      <circle cx="340" cy="340" r="10" fill="none" stroke="#111827" stroke-width="6" />
      <circle cx="210" cy="310" r="10" fill="none" stroke="#111827" stroke-width="6" />
      <line x1="168" y1="176" x2="242" y2="154" stroke="#111827" stroke-width="4" stroke-dasharray="8 6" />
      <line x1="258" y1="154" x2="342" y2="186" stroke="#111827" stroke-width="4" stroke-dasharray="8 6" />
      <line x1="358" y1="194" x2="412" y2="274" stroke="#111827" stroke-width="4" stroke-dasharray="8 6" />
      <line x1="412" y1="284" x2="346" y2="334" stroke="#111827" stroke-width="4" stroke-dasharray="8 6" />
      <line x1="332" y1="338" x2="218" y2="312" stroke="#111827" stroke-width="4" stroke-dasharray="8 6" />
      <!-- Baby Stegosaurus looking through Telescope -->
      <line x1="220" y1="440" x2="280" y2="370" stroke="#111827" stroke-width="8" stroke-linecap="round" />
      <rect x="260" y="350" width="70" height="25" rx="5" fill="none" stroke="#111827" stroke-width="6" transform="rotate(-30 295 362)" />
    `;
  } else {
    // Bedtime / Journey Home
    centerArt = `
      <!-- Sleeping Dino on a cloud crescent moon -->
      <path d="M220,160 Q120,240 180,360 Q260,460 380,390 Q290,400 240,320 Q200,240 220,160 Z" fill="none" stroke="#111827" stroke-width="8" />
      <!-- Sleeping little T-Rex -->
      <path d="M260,320 Q310,290 350,330 Q330,370 280,360 Z" fill="none" stroke="#111827" stroke-width="7" />
      <path d="M300,320 Q310,312 320,320" fill="none" stroke="#111827" stroke-width="4" stroke-linecap="round" />
      <text x="360" y="270" font-family="Outfit, sans-serif" font-size="28" font-weight="bold" fill="#111827">Z</text>
      <text x="390" y="240" font-family="Outfit, sans-serif" font-size="22" font-weight="bold" fill="#111827">z</text>
      <text x="415" y="220" font-family="Outfit, sans-serif" font-size="16" font-weight="bold" fill="#111827">z</text>
    `;
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 800" width="600" height="800">
    <!-- Pure White Paper Background -->
    <rect width="600" height="800" fill="#FFFFFF" />
    
    <!-- Outer Printable Border -->
    <rect x="24" y="24" width="552" height="752" rx="16" fill="none" stroke="#111827" stroke-width="6" />
    <rect x="36" y="36" width="528" height="728" rx="10" fill="none" stroke="#111827" stroke-width="2" stroke-dasharray="10 6" />
    
    <!-- Title Area (Bubble letters look) -->
    <text x="300" y="90" font-family="Outfit, sans-serif" font-size="26" font-weight="800" text-anchor="middle" fill="#111827" letter-spacing="1">
      ${title.toUpperCase()}
    </text>
    <text x="300" y="118" font-family="Plus Jakarta Sans, sans-serif" font-size="14" font-weight="600" text-anchor="middle" fill="#4B5563">
      ${subtitle}
    </text>
    
    <!-- Line Art Center Illustration -->
    ${centerArt}
    
    <!-- Bottom Cute Border Doodle -->
    <circle cx="300" cy="710" r="14" fill="none" stroke="#111827" stroke-width="4" />
    <circle cx="270" cy="710" r="8" fill="none" stroke="#111827" stroke-width="3" />
    <circle cx="330" cy="710" r="8" fill="none" stroke="#111827" stroke-width="3" />
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export const SAMPLE_THEMES = [
  {
    theme: 'Space Dinosaurs',
    subtitle: 'Astronaut T-Rex exploring glowing starry moons',
    ageLevel: 'early_reader' as const,
    badge: 'Popular',
  },
  {
    theme: 'Undersea Mermaid Safari',
    subtitle: 'Friendly dolphins, coral castles and glowing jellyfish',
    ageLevel: 'early_reader' as const,
    badge: 'Magical',
  },
  {
    theme: 'Tiny Animal Bakery',
    subtitle: 'Bear cubs and bunny bakers making berry pies',
    ageLevel: 'toddler' as const,
    badge: 'Sweet & Simple',
  },
  {
    theme: 'Superhero Kittens & Puppies',
    subtitle: 'Caped kittens flying over yarn towers and squeaky toys',
    ageLevel: 'early_reader' as const,
    badge: 'Action-Packed',
  },
  {
    theme: 'Enchanted Dragon Treehouse',
    subtitle: 'Baby fireflies, rope bridges and friendly leaf dragons',
    ageLevel: 'explorer' as const,
    badge: 'Intricate',
  },
];

export function getSampleColoringBook(childName = 'Leo'): ColoringBook {
  return {
    id: 'sample-book-1',
    title: `${childName}'s Space Dinosaur Adventure`,
    childName: childName,
    theme: 'Space Dinosaurs',
    ageLevel: 'early_reader',
    resolution: '2K',
    createdAt: new Date().toISOString(),
    cover: {
      id: 'page-0',
      pageNumber: 0,
      title: 'Cover: Cosmic Dino Explorer',
      description: `Official coloring book cover personalized for ${childName}.`,
      prompt: `Front cover of children's coloring book with thick black line art, featuring ${childName}'s Space Dinosaur Adventure title.`,
      imageUrl: createColoringSvgDataUrl(`${childName}'s Space Dino Book`, 'Front Cover Edition', 'cover'),
      isGenerating: false,
    },
    pages: [
      {
        id: 'page-1',
        pageNumber: 1,
        title: 'The Rocket Blastoff',
        description: 'Captain Rex straps into his shiny spaceship while counting down: 3... 2... 1... Blastoff!',
        prompt: 'Cute cartoon astronaut T-Rex waving from rocket cockpit, thick black outlines, pure white background.',
        imageUrl: createColoringSvgDataUrl('Page 1: Rocket Blastoff', 'Countdown to the Stars!', 'rocket'),
        isGenerating: false,
      },
      {
        id: 'page-2',
        pageNumber: 2,
        title: 'Touching Down on Crater Moon',
        description: 'Rex lands safely on the bubbly moon surface and plants a cheerful exploration flag.',
        prompt: 'Astronaut dinosaur walking on the moon with craters and floating Earth in background, bold black lines.',
        imageUrl: createColoringSvgDataUrl('Page 2: Crater Moon', 'First Steps on Lunar Dust', 'moon'),
        isGenerating: false,
      },
      {
        id: 'page-3',
        pageNumber: 3,
        title: 'The Zero-Gravity Picnic',
        description: 'Triceratops and Stegosaurus float in orbit while sipping zero-gravity starlight cocoa.',
        prompt: 'Two baby dinosaurs having a tea party with floating cookies in space, children coloring page.',
        imageUrl: createColoringSvgDataUrl('Page 3: Starlight Picnic', 'Floating Cocoa & Star Cakes', 'tea'),
        isGenerating: false,
      },
      {
        id: 'page-4',
        pageNumber: 4,
        title: 'Dancing Among Constellations',
        description: 'Looking through the cosmic telescope, Rex spots friendly star patterns shaped like prehistoric footprints.',
        prompt: 'Little dinosaur looking through big telescope at starry constellations, bold lines, coloring sheet.',
        imageUrl: createColoringSvgDataUrl('Page 4: Starry Patterns', 'Connecting the Cosmic Dots', 'stars'),
        isGenerating: false,
      },
      {
        id: 'page-5',
        pageNumber: 5,
        title: 'Sweet Dreams Under the Nebula',
        description: 'After a grand day of interstellar discovery, Captain Rex curls up for bedtime beneath the soft cosmic glow.',
        prompt: 'Baby dinosaur sleeping peacefully on a crescent moon pillow, calm space bedtime coloring page.',
        imageUrl: createColoringSvgDataUrl('Page 5: Bedtime Nebula', 'Goodnight Little Cosmic Explorer', 'bedtime'),
        isGenerating: false,
      },
    ],
  };
}
