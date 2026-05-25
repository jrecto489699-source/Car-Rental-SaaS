export default function RMLogo({ size = 220, className = '' }) {
  const h = size * (290 / 310)
  return (
    <svg viewBox="0 0 310 290" width={size} height={h} className={className} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="rmBg" cx="50%" cy="38%" r="62%">
          <stop offset="0%" stopColor="#1e1b4b" />
          <stop offset="100%" stopColor="#09090f" />
        </radialGradient>
        <linearGradient id="goldRing" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fde68a" />
          <stop offset="40%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#b45309" />
        </linearGradient>
        <linearGradient id="rmOrange" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#fb923c" />
          <stop offset="100%" stopColor="#c2410c" />
        </linearGradient>
        <filter id="shadow">
          <feDropShadow dx="2" dy="3" stdDeviation="3" floodColor="#000" floodOpacity="0.7" />
        </filter>
        <filter id="textShadow">
          <feDropShadow dx="3" dy="3" stdDeviation="2" floodColor="#000" floodOpacity="0.8" />
        </filter>
        <clipPath id="circleClip">
          <circle cx="150" cy="128" r="120" />
        </clipPath>
        {/* Arc along bottom of main circle for curved tagline */}
        <path id="taglinePath" d="M 102,238 A 120,120 0 0,1 198,238" />
      </defs>

      {/* ── Outer glow ring ── */}
      <circle cx="150" cy="128" r="126" fill="none" stroke="#f59e0b" strokeWidth="1.5" opacity="0.35" />

      {/* ── Main circle background ── */}
      <circle cx="150" cy="128" r="120" fill="url(#rmBg)" />

      {/* ── Tricolor strip — bottom ~12% of main circle, clipped to circle ──
           Full-height rects; banner paints over them leaving only the bottom strip visible */}
      <rect x="0"   y="170" width="127" height="82" fill="#16a34a" clipPath="url(#circleClip)" />
      <rect x="127" y="170" width="46"  height="82" fill="#f0f0ec" clipPath="url(#circleClip)" />
      <rect x="173" y="170" width="160" height="82" fill="#dc2626" clipPath="url(#circleClip)" />

      {/* ── Gold border rings ── */}
      <circle cx="150" cy="128" r="120" fill="none" stroke="url(#goldRing)" strokeWidth="7" />
      <circle cx="150" cy="128" r="113" fill="none" stroke="#0a0a14" strokeWidth="2.5" />
      <circle cx="150" cy="128" r="110" fill="none" stroke="#f59e0b" strokeWidth="0.8" opacity="0.4" />

      {/* ── Two gold stars ── */}
      <polygon
        points="112,24 115.5,35 127,35 118,41.5 121.5,52.5 112,46 102.5,52.5 106,41.5 97,35 108.5,35"
        fill="#fbbf24" filter="url(#shadow)"
      />
      <polygon
        points="148,22 151.5,33 163,33 154,39.5 157.5,50.5 148,44 138.5,50.5 142,39.5 133,33 144.5,33"
        fill="#fbbf24" filter="url(#shadow)"
      />

      {/* ── Car silhouette — behind RM text ── */}
      <g transform="translate(115, 62)" filter="url(#shadow)">
        <path
          d="M 168,88 L 168,60 C 157,48 149,36 139,24 C 129,12 115,8 101,8 L 70,8
             C 56,8 44,12 34,22 C 22,32 8,48 0,60 L 0,88
             Q 27,36 55,88 L 113,88 Q 141,36 168,88 Z"
          fill="#0d0d12"
        />
        <path d="M 34,22 L 26,52 L 68,52 L 70,8 C 56,8 44,12 34,22 Z" fill="#162440" opacity="0.92" />
        <path d="M 101,8 L 99,52 L 135,52 L 139,24 C 129,12 115,8 101,8 Z" fill="#162440" opacity="0.92" />
        <rect x="68" y="8" width="3" height="44" fill="#060c18" />
        <line x1="69" y1="52" x2="69" y2="76" stroke="#1a1a2e" strokeWidth="1.5" opacity="0.7" />
        <circle cx="27" cy="70" r="20" fill="#1c1c2e" />
        <circle cx="27" cy="70" r="14" fill="#08080e" />
        <circle cx="27" cy="70" r="8"  fill="#24243a" />
        <line x1="27" y1="56" x2="27" y2="84" stroke="#3a3a52" strokeWidth="1.5" />
        <line x1="13" y1="70" x2="41" y2="70" stroke="#3a3a52" strokeWidth="1.5" />
        <line x1="17" y1="60" x2="37" y2="80" stroke="#3a3a52" strokeWidth="1.5" />
        <line x1="37" y1="60" x2="17" y2="80" stroke="#3a3a52" strokeWidth="1.5" />
        <circle cx="27" cy="70" r="3.5" fill="#505068" />
        <circle cx="141" cy="70" r="20" fill="#1c1c2e" />
        <circle cx="141" cy="70" r="14" fill="#08080e" />
        <circle cx="141" cy="70" r="8"  fill="#24243a" />
        <line x1="141" y1="56" x2="141" y2="84" stroke="#3a3a52" strokeWidth="1.5" />
        <line x1="127" y1="70" x2="155" y2="70" stroke="#3a3a52" strokeWidth="1.5" />
        <line x1="131" y1="60" x2="151" y2="80" stroke="#3a3a52" strokeWidth="1.5" />
        <line x1="151" y1="60" x2="131" y2="80" stroke="#3a3a52" strokeWidth="1.5" />
        <circle cx="141" cy="70" r="3.5" fill="#505068" />
        <ellipse cx="166" cy="42" rx="3.5" ry="9" fill="#fef9c3" opacity="0.8" />
        <line x1="163" y1="52" x2="168" y2="55" stroke="#f97316" strokeWidth="2" opacity="0.85" />
      </g>

      {/* ── RM lettering — white outline ── */}
      <text x="12" y="162"
        fontFamily="'Arial Black', Arial, sans-serif"
        fontStyle="italic" fontSize="128" fontWeight="900"
        fill="none" stroke="white" strokeWidth="8" strokeLinejoin="round"
        clipPath="url(#circleClip)"
      >RM</text>

      {/* ── RM lettering — orange fill ── */}
      <text x="12" y="162"
        fontFamily="'Arial Black', Arial, sans-serif"
        fontStyle="italic" fontSize="128" fontWeight="900"
        fill="url(#rmOrange)" filter="url(#textShadow)"
        clipPath="url(#circleClip)"
      >RM</text>

      {/* ── Banner — renders over tricolor top, revealing only the bottom strip ── */}
      <rect x="30" y="172" width="250" height="38" fill="#111827" />
      <rect x="30" y="172" width="250" height="3.5" fill="#f97316" />
      <rect x="30" y="206.5" width="250" height="3.5" fill="#f97316" />
      <rect x="30" y="175.5" width="250" height="31" fill="#0f172a" opacity="0.6" />
      <text x="155" y="197" textAnchor="middle"
        fontFamily="'Arial', sans-serif" fontSize="14.5" fontWeight="700" letterSpacing="3" fill="white"
      >CAR RENTAL SERVICES</text>

      {/* ── Tagline curved along bottom of main circle ── */}
      <text fontFamily="'Georgia', serif" fontSize="5.4" fontStyle="italic" fontWeight="700" fill="#111">
        <textPath href="#taglinePath" startOffset="50%" textAnchor="middle">
          "Your Journey, Our Wheels"
        </textPath>
      </text>

    </svg>
  )
}
