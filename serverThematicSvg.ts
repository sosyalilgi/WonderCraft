// Rich vector SVG coloring illustration generator for offline & fallback use
export function generateThematicColoringSvg(params: {
  prompt: string;
  childName: string;
  isCover: boolean;
  ageLevel?: string;
  pageNumber?: number;
}): string {
  const { prompt = '', childName = 'Explorer', isCover = false, pageNumber = 1 } = params;
  const lower = prompt.toLowerCase();

  // Detect theme category
  const isSpace = lower.includes('space') || lower.includes('rocket') || lower.includes('planet') || lower.includes('moon') || lower.includes('star') || lower.includes('galaxy') || lower.includes('cosmic');
  const isDino = lower.includes('dino') || lower.includes('rex') || lower.includes('saur') || lower.includes('fossil');
  const isOcean = lower.includes('ocean') || lower.includes('sea') || lower.includes('water') || lower.includes('fish') || lower.includes('mermaid') || lower.includes('whale') || lower.includes('dolphin');
  const isAnimal = lower.includes('animal') || lower.includes('cat') || lower.includes('dog') || lower.includes('bear') || lower.includes('bunny') || lower.includes('panda') || lower.includes('kitten') || lower.includes('puppy');

  let centerArt = '';

  if (isCover) {
    centerArt = `
      <!-- Large Cover Mascot & Frame -->
      <g transform="translate(0, 40)">
        <!-- Decorative Cover Arch -->
        <path d="M80,320 C80,180 520,180 520,320 L520,440 L80,440 Z" fill="none" stroke="#111827" stroke-width="6" stroke-dasharray="12 8" />
        
        <!-- Big Mascot (Dino or Bear with Party Hat/Helmet) -->
        <circle cx="300" cy="270" r="75" fill="none" stroke="#111827" stroke-width="8" />
        ${
          isSpace
            ? '<circle cx="300" cy="270" r="95" fill="none" stroke="#111827" stroke-width="6" />'
            : '<polygon points="280,195 300,140 320,195" fill="none" stroke="#111827" stroke-width="6" />'
        }
        <!-- Eyes & Big Happy Smile -->
        <circle cx="275" cy="260" r="9" fill="#111827" />
        <circle cx="325" cy="260" r="9" fill="#111827" />
        <path d="M280,285 Q300,310 320,285" fill="none" stroke="#111827" stroke-width="6" stroke-linecap="round" />
        <!-- Rosy Cheeks -->
        <circle cx="260" cy="285" r="12" fill="none" stroke="#111827" stroke-width="4" stroke-dasharray="4 4" />
        <circle cx="340" cy="285" r="12" fill="none" stroke="#111827" stroke-width="4" stroke-dasharray="4 4" />
        
        <!-- Mascot Body -->
        <path d="M225,340 Q210,480 300,480 Q390,480 375,340 Z" fill="none" stroke="#111827" stroke-width="8" />
        <!-- Paws waving -->
        <ellipse cx="205" cy="370" rx="25" ry="18" fill="none" stroke="#111827" stroke-width="7" transform="rotate(-30 205 370)" />
        <ellipse cx="395" cy="370" rx="25" ry="18" fill="none" stroke="#111827" stroke-width="7" transform="rotate(30 395 370)" />
        
        <!-- Stars and Confetti around -->
        <polygon points="140,220 146,236 163,236 149,247 154,263 140,252 126,263 131,247 117,236 134,236" fill="none" stroke="#111827" stroke-width="5" />
        <polygon points="460,220 466,236 483,236 469,247 474,263 460,252 446,263 451,247 437,236 454,236" fill="none" stroke="#111827" stroke-width="5" />
        <circle cx="170" cy="350" r="16" fill="none" stroke="#111827" stroke-width="5" />
        <circle cx="430" cy="350" r="16" fill="none" stroke="#111827" stroke-width="5" />
        <polygon points="300,105 306,120 322,120 309,130 314,145 300,135 286,145 291,130 278,120 294,120" fill="none" stroke="#111827" stroke-width="5" />
      </g>
    `;
  } else if (pageNumber === 1 || lower.includes('blast') || lower.includes('start') || lower.includes('begin')) {
    // Chapter 1: The Launch / Beginning
    centerArt = `
      <!-- Rocket or Hot Air Balloon -->
      <path d="M300,150 C350,230 350,330 300,390 C250,330 250,230 300,150 Z" fill="none" stroke="#111827" stroke-width="8" stroke-linecap="round" />
      <circle cx="300" cy="250" r="38" fill="none" stroke="#111827" stroke-width="6" />
      <!-- Pilot Waving -->
      <circle cx="300" cy="245" r="20" fill="none" stroke="#111827" stroke-width="5" />
      <circle cx="294" cy="242" r="3" fill="#111827" />
      <circle cx="306" cy="242" r="3" fill="#111827" />
      <path d="M295,252 Q300,258 305,252" fill="none" stroke="#111827" stroke-width="3" />
      <!-- Wings / Fins -->
      <path d="M255,330 L190,380 L255,380 Z" fill="none" stroke="#111827" stroke-width="7" stroke-linejoin="round" />
      <path d="M345,330 L410,380 L345,380 Z" fill="none" stroke="#111827" stroke-width="7" stroke-linejoin="round" />
      <!-- Thruster flame -->
      <path d="M280,395 Q300,470 300,480 Q320,430 320,395" fill="none" stroke="#111827" stroke-width="6" />
      <!-- Swirling Launch Clouds -->
      <path d="M80,480 Q140,430 220,470 Q300,440 380,470 Q460,430 520,480" fill="none" stroke="#111827" stroke-width="7" />
      <circle cx="140" cy="200" r="24" fill="none" stroke="#111827" stroke-width="5" />
      <polygon points="450,180 455,192 468,192 458,200 462,212 450,204 438,212 442,200 432,192 445,192" fill="none" stroke="#111827" stroke-width="4" />
    `;
  } else if (pageNumber === 2 || lower.includes('land') || lower.includes('explore') || lower.includes('discover')) {
    // Chapter 2: Exploring the New Land
    centerArt = `
      <!-- Rolling Hills or Moon Craters -->
      <path d="M60,430 Q180,370 300,400 Q420,360 540,420" fill="none" stroke="#111827" stroke-width="8" />
      <circle cx="160" cy="450" r="22" fill="none" stroke="#111827" stroke-width="5" />
      <circle cx="440" cy="445" r="18" fill="none" stroke="#111827" stroke-width="5" />
      
      <!-- Big Friendly Explorer Character -->
      <path d="M250,420 Q230,320 280,260 Q320,220 370,220 Q420,260 410,340 Q430,370 410,420" fill="none" stroke="#111827" stroke-width="8" stroke-linecap="round" />
      <circle cx="340" cy="220" r="42" fill="none" stroke="#111827" stroke-width="6" />
      <circle cx="330" cy="215" r="4" fill="#111827" />
      <circle cx="350" cy="215" r="4" fill="#111827" />
      <path d="M332,230 Q340,238 348,230" fill="none" stroke="#111827" stroke-width="4" stroke-linecap="round" />
      
      <!-- Exploration Flag -->
      <line x1="200" y1="430" x2="200" y2="280" stroke="#111827" stroke-width="7" stroke-linecap="round" />
      <polygon points="200,280 260,305 200,330" fill="none" stroke="#111827" stroke-width="6" stroke-linejoin="round" />
      <text x="215" y="312" font-family="Outfit, sans-serif" font-size="16" font-weight="bold" fill="#111827">#1</text>
      
      <!-- Distant celestial body or floating island -->
      <circle cx="130" cy="180" r="40" fill="none" stroke="#111827" stroke-width="6" />
      <ellipse cx="130" cy="180" rx="60" ry="14" fill="none" stroke="#111827" stroke-width="4" transform="rotate(-20 130 180)" />
    `;
  } else if (pageNumber === 3 || lower.includes('party') || lower.includes('picnic') || lower.includes('friend') || lower.includes('tea')) {
    // Chapter 3: Gathering & Picnic
    centerArt = `
      <!-- Festive Table / Meadow Blanket -->
      <ellipse cx="300" cy="400" rx="160" ry="40" fill="none" stroke="#111827" stroke-width="7" />
      <!-- Delicious treats -->
      <path d="M280,360 Q280,320 300,320 Q320,320 320,360 Z" fill="none" stroke="#111827" stroke-width="6" />
      <circle cx="300" cy="315" r="6" fill="#111827" />
      <ellipse cx="240" cy="375" rx="14" ry="8" fill="none" stroke="#111827" stroke-width="4" />
      <ellipse cx="360" cy="375" rx="14" ry="8" fill="none" stroke="#111827" stroke-width="4" />
      
      <!-- Left Friend -->
      <circle cx="180" cy="340" r="35" fill="none" stroke="#111827" stroke-width="7" />
      <circle cx="170" cy="335" r="4" fill="#111827" />
      <circle cx="190" cy="335" r="4" fill="#111827" />
      <path d="M175,350 Q180,358 185,350" fill="none" stroke="#111827" stroke-width="3" />
      <!-- Ears or Horns -->
      <polygon points="155,315 165,285 178,310" fill="none" stroke="#111827" stroke-width="5" />
      <polygon points="182,310 195,285 205,315" fill="none" stroke="#111827" stroke-width="5" />
      
      <!-- Right Friend -->
      <circle cx="420" cy="340" r="35" fill="none" stroke="#111827" stroke-width="7" />
      <circle cx="410" cy="335" r="4" fill="#111827" />
      <circle cx="430" cy="335" r="4" fill="#111827" />
      <path d="M415,350 Q420,358 425,350" fill="none" stroke="#111827" stroke-width="3" />
      <ellipse cx="395" cy="315" rx="8" ry="18" fill="none" stroke="#111827" stroke-width="5" transform="rotate(-20 395 315)" />
      <ellipse cx="445" cy="315" rx="8" ry="18" fill="none" stroke="#111827" stroke-width="5" transform="rotate(20 445 315)" />
      
      <!-- Bunting Garland -->
      <path d="M100,180 Q300,240 500,180" fill="none" stroke="#111827" stroke-width="4" stroke-dasharray="6 4" />
      <polygon points="160,195 180,230 200,198" fill="none" stroke="#111827" stroke-width="4" />
      <polygon points="240,205 260,240 280,208" fill="none" stroke="#111827" stroke-width="4" />
      <polygon points="320,208 340,240 360,205" fill="none" stroke="#111827" stroke-width="4" />
      <polygon points="400,198 420,230 440,195" fill="none" stroke="#111827" stroke-width="4" />
    `;
  } else if (pageNumber === 4 || lower.includes('star') || lower.includes('magic') || lower.includes('telescope') || lower.includes('hero')) {
    // Chapter 4: Stargazing / Cosmic Wonders
    centerArt = `
      <!-- Big Telescope or Magic Wand -->
      <line x1="200" y1="450" x2="270" y2="350" stroke="#111827" stroke-width="8" stroke-linecap="round" />
      <line x1="270" y1="350" x2="310" y2="450" stroke="#111827" stroke-width="8" stroke-linecap="round" />
      <line x1="270" y1="350" x2="270" y2="460" stroke="#111827" stroke-width="7" stroke-linecap="round" />
      <rect x="240" y="320" width="100" height="30" rx="8" fill="none" stroke="#111827" stroke-width="7" transform="rotate(-35 290 335)" />
      
      <!-- Character peering into eyepiece -->
      <circle cx="210" cy="380" r="32" fill="none" stroke="#111827" stroke-width="6" />
      <circle cx="212" cy="376" r="4" fill="#111827" />
      
      <!-- Constellations in the sky -->
      <circle cx="380" cy="160" r="8" fill="#111827" />
      <circle cx="450" cy="140" r="8" fill="#111827" />
      <circle cx="490" cy="200" r="8" fill="#111827" />
      <circle cx="440" cy="260" r="8" fill="#111827" />
      <circle cx="360" cy="230" r="8" fill="#111827" />
      <line x1="380" y1="160" x2="450" y2="140" stroke="#111827" stroke-width="3" stroke-dasharray="6 4" />
      <line x1="450" y1="140" x2="490" y2="200" stroke="#111827" stroke-width="3" stroke-dasharray="6 4" />
      <line x1="490" y1="200" x2="440" y2="260" stroke="#111827" stroke-width="3" stroke-dasharray="6 4" />
      <line x1="440" y1="260" x2="360" y2="230" stroke="#111827" stroke-width="3" stroke-dasharray="6 4" />
      <line x1="360" y1="230" x2="380" y2="160" stroke="#111827" stroke-width="3" stroke-dasharray="6 4" />
      
      <!-- Crescent Moon with smiling face -->
      <path d="M140,140 Q60,200 110,290 Q170,360 250,300 Q180,310 140,240 Q110,180 140,140 Z" fill="none" stroke="#111827" stroke-width="7" />
    `;
  } else {
    // Chapter 5: Bedtime & Sweet Dreams
    centerArt = `
      <!-- Crescent Moon Cradle -->
      <path d="M220,160 Q120,240 180,360 Q260,460 380,390 Q290,400 240,320 Q200,240 220,160 Z" fill="none" stroke="#111827" stroke-width="8" />
      
      <!-- Sleeping Mascot with sleeping cap -->
      <path d="M260,330 Q310,300 350,340 Q330,380 280,370 Z" fill="none" stroke="#111827" stroke-width="7" />
      <path d="M295,330 Q305,322 315,330" fill="none" stroke="#111827" stroke-width="4" stroke-linecap="round" />
      
      <!-- Night Cap with Pom-pom -->
      <path d="M300,305 Q330,270 380,300" fill="none" stroke="#111827" stroke-width="5" />
      <circle cx="385" cy="305" r="9" fill="none" stroke="#111827" stroke-width="5" />
      
      <!-- Floating Zzz's -->
      <text x="365" y="250" font-family="Outfit, sans-serif" font-size="32" font-weight="800" fill="#111827">Z</text>
      <text x="400" y="215" font-family="Outfit, sans-serif" font-size="24" font-weight="700" fill="#111827">z</text>
      <text x="430" y="190" font-family="Outfit, sans-serif" font-size="18" font-weight="600" fill="#111827">z</text>
      
      <!-- Fluffy clouds below -->
      <path d="M100,480 Q160,440 240,470 Q320,440 400,470 Q480,440 540,480" fill="none" stroke="#111827" stroke-width="7" />
    `;
  }

  const titleText = isCover
    ? `${childName}'s Adventure`
    : `Page ${pageNumber}: Story Scene`;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 800" width="600" height="800">
    <rect width="600" height="800" fill="#FFFFFF" />
    
    <!-- Outer Printable Border -->
    <rect x="22" y="22" width="556" height="756" rx="16" fill="none" stroke="#111827" stroke-width="6" />
    <rect x="34" y="34" width="532" height="732" rx="10" fill="none" stroke="#111827" stroke-width="2" stroke-dasharray="8 6" />
    
    <!-- Title Area (Bubble letters look) -->
    <text x="300" y="85" font-family="Outfit, sans-serif" font-size="24" font-weight="800" text-anchor="middle" fill="#111827" letter-spacing="1">
      ${titleText.toUpperCase()}
    </text>
    <text x="300" y="112" font-family="Plus Jakarta Sans, sans-serif" font-size="13" font-weight="600" text-anchor="middle" fill="#4B5563">
      WonderCraft Coloring Edition • Specially for ${childName}
    </text>
    
    <!-- Center Line Art -->
    ${centerArt}
    
    <!-- Bottom Decorative Badge -->
    <circle cx="300" cy="715" r="14" fill="none" stroke="#111827" stroke-width="4" />
    <circle cx="272" cy="715" r="8" fill="none" stroke="#111827" stroke-width="3" />
    <circle cx="328" cy="715" r="8" fill="none" stroke="#111827" stroke-width="3" />
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}
