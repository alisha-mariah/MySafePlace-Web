"use client";

export default function AuthLeftPanel() {
  return (
    <div
      className="relative flex min-h-[320px] flex-col justify-between overflow-hidden px-9 py-9 md:min-h-screen md:px-12 md:py-12"
      style={{
        background: "linear-gradient(165deg, #A0D4B4 0%, #7EC09C 35%, #5EAC86 65%, #4A9874 100%)",
      }}
    >
      {/* Illustration layer */}
      <div className="pointer-events-none absolute inset-0">
        <svg viewBox="0 0 480 800" fill="none" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice">
          {/* Sun glow */}
          <defs>
            <radialGradient id="sun" cx="75%" cy="6%" r="35%">
              <stop offset="0%" stopColor="rgba(255,245,200,0.30)" />
              <stop offset="100%" stopColor="rgba(255,245,200,0)" />
            </radialGradient>
          </defs>
          <rect width="480" height="800" fill="url(#sun)" />

          {/* Topographic contour lines */}
          <path d="M-20 120 Q110 90 240 115 Q370 140 500 105" stroke="rgba(255,255,255,0.07)" strokeWidth="1" />
          <path d="M-20 200 Q130 175 260 195 Q390 215 500 185" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
          <path d="M-20 280 Q80 255 200 275 Q340 300 500 260" stroke="rgba(255,255,255,0.07)" strokeWidth="1" />
          <path d="M-20 360 Q140 335 270 355 Q400 375 500 345" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
          <path d="M-20 440 Q90 415 220 435 Q370 455 500 420" stroke="rgba(255,255,255,0.065)" strokeWidth="1" />
          <path d="M-20 520 Q100 498 230 515 Q380 535 500 505" stroke="rgba(255,255,255,0.055)" strokeWidth="1" />
          <path d="M-20 600 Q130 580 270 595 Q410 615 500 590" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
          <path d="M-20 680 Q90 660 210 675 Q360 695 500 665" stroke="rgba(255,255,255,0.045)" strokeWidth="1" />

          {/* Right vine */}
          <path d="M480 790 C440 680 405 560 385 460 C370 380 372 300 388 190" stroke="rgba(255,255,255,0.14)" strokeWidth="2" strokeLinecap="round" />
          <path d="M385 460 C352 430 310 415 265 425" stroke="rgba(255,255,255,0.10)" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M390 320 C415 298 445 260 458 228" stroke="rgba(255,255,255,0.09)" strokeWidth="1.3" strokeLinecap="round" />
          <path d="M392 245 C412 235 435 215 445 190" stroke="rgba(255,255,255,0.08)" strokeWidth="1.1" strokeLinecap="round" />

          {/* Left vine */}
          <path d="M-10 790 C35 695 65 590 82 490 C95 410 98 340 92 270" stroke="rgba(255,255,255,0.10)" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M82 490 C112 465 142 452 172 458" stroke="rgba(255,255,255,0.08)" strokeWidth="1.2" strokeLinecap="round" />
          <path d="M88 370 C62 350 42 320 32 290" stroke="rgba(255,255,255,0.07)" strokeWidth="1.1" strokeLinecap="round" />

          {/* Right vine leaves */}
          <g transform="translate(372,392) rotate(-55)">
            <path d="M0,-18 C8,-11 8,11 0,18 C-8,11 -8,-11 0,-18 Z" fill="rgba(140,200,168,0.40)" stroke="rgba(255,255,255,0.20)" strokeWidth="0.7" />
            <line x1="0" y1="-14" x2="0" y2="14" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" />
          </g>
          <g transform="translate(402,285) rotate(-68)">
            <path d="M0,-16 C7,-10 7,10 0,16 C-7,10 -7,-10 0,-16 Z" fill="rgba(140,200,168,0.35)" stroke="rgba(255,255,255,0.16)" strokeWidth="0.7" />
            <line x1="0" y1="-12" x2="0" y2="12" stroke="rgba(255,255,255,0.12)" strokeWidth="0.5" />
          </g>
          <g transform="translate(445,238) rotate(-38)">
            <path d="M0,-13 C6,-7 6,7 0,13 C-6,7 -6,-7 0,-13 Z" fill="rgba(140,200,168,0.32)" stroke="rgba(255,255,255,0.14)" strokeWidth="0.6" />
          </g>
          <g transform="translate(275,438) rotate(-18)">
            <path d="M0,-14 C6,-8 6,8 0,14 C-6,8 -6,-8 0,-14 Z" fill="rgba(140,200,168,0.30)" stroke="rgba(255,255,255,0.12)" strokeWidth="0.6" />
            <line x1="0" y1="-10" x2="0" y2="10" stroke="rgba(255,255,255,0.10)" strokeWidth="0.5" />
          </g>
          <g transform="translate(420,520) rotate(-42)">
            <path d="M0,-16 C7,-10 7,10 0,16 C-7,10 -7,-10 0,-16 Z" fill="rgba(140,200,168,0.38)" stroke="rgba(255,255,255,0.18)" strokeWidth="0.7" />
            <line x1="0" y1="-12" x2="0" y2="12" stroke="rgba(255,255,255,0.12)" strokeWidth="0.5" />
          </g>
          <g transform="translate(442,640) rotate(-52)">
            <path d="M0,-13 C6,-7 6,7 0,13 C-6,7 -6,-7 0,-13 Z" fill="rgba(140,200,168,0.28)" stroke="rgba(255,255,255,0.12)" strokeWidth="0.6" />
          </g>

          {/* Left vine leaves */}
          <g transform="translate(72,450) rotate(30)">
            <path d="M0,-16 C7,-10 7,10 0,16 C-7,10 -7,-10 0,-16 Z" fill="rgba(140,200,168,0.38)" stroke="rgba(255,255,255,0.18)" strokeWidth="0.7" />
            <line x1="0" y1="-12" x2="0" y2="12" stroke="rgba(255,255,255,0.12)" strokeWidth="0.5" />
          </g>
          <g transform="translate(92,355) rotate(48)">
            <path d="M0,-14 C6,-8 6,8 0,14 C-6,8 -6,-8 0,-14 Z" fill="rgba(140,200,168,0.32)" stroke="rgba(255,255,255,0.14)" strokeWidth="0.6" />
            <line x1="0" y1="-10" x2="0" y2="10" stroke="rgba(255,255,255,0.10)" strokeWidth="0.5" />
          </g>
          <g transform="translate(38,300) rotate(22)">
            <path d="M0,-12 C5,-7 5,7 0,12 C-5,7 -5,-7 0,-12 Z" fill="rgba(140,200,168,0.28)" stroke="rgba(255,255,255,0.12)" strokeWidth="0.6" />
          </g>
          <g transform="translate(165,462) rotate(10)">
            <path d="M0,-11 C5,-6 5,6 0,11 C-5,6 -5,-6 0,-11 Z" fill="rgba(140,200,168,0.25)" stroke="rgba(255,255,255,0.10)" strokeWidth="0.6" />
          </g>
          <g transform="translate(58,565) rotate(40)">
            <path d="M0,-15 C7,-9 7,9 0,15 C-7,9 -7,-9 0,-15 Z" fill="rgba(140,200,168,0.34)" stroke="rgba(255,255,255,0.14)" strokeWidth="0.7" />
            <line x1="0" y1="-11" x2="0" y2="11" stroke="rgba(255,255,255,0.10)" strokeWidth="0.5" />
          </g>

          {/* ═══ FLOWERS (vivid pink) ═══ */}

          {/* Hero bloom — upper right */}
          <g transform="translate(388,190)">
            <ellipse cx="0" cy="-12" rx="8" ry="12" fill="rgba(242,175,200,0.62)" stroke="rgba(255,255,255,0.30)" strokeWidth="0.7" />
            <ellipse cx="0" cy="12" rx="8" ry="12" fill="rgba(242,175,200,0.62)" stroke="rgba(255,255,255,0.30)" strokeWidth="0.7" />
            <ellipse cx="-12" cy="0" rx="12" ry="8" fill="rgba(242,175,200,0.60)" stroke="rgba(255,255,255,0.28)" strokeWidth="0.7" />
            <ellipse cx="12" cy="0" rx="12" ry="8" fill="rgba(242,175,200,0.60)" stroke="rgba(255,255,255,0.28)" strokeWidth="0.7" />
            <ellipse cx="-8" cy="-8" rx="7" ry="10" fill="rgba(242,175,200,0.45)" stroke="rgba(255,255,255,0.22)" strokeWidth="0.6" transform="rotate(45 -8 -8)" />
            <ellipse cx="8" cy="-8" rx="7" ry="10" fill="rgba(242,175,200,0.45)" stroke="rgba(255,255,255,0.22)" strokeWidth="0.6" transform="rotate(-45 8 -8)" />
            <circle cx="0" cy="0" r="5.5" fill="rgba(232,195,100,0.75)" stroke="rgba(255,255,255,0.35)" strokeWidth="0.6" />
            <circle cx="-1.5" cy="-1.5" r="1" fill="rgba(255,255,255,0.40)" />
            <circle cx="1.5" cy="0.5" r="0.8" fill="rgba(255,255,255,0.30)" />
          </g>

          {/* Left bloom */}
          <g transform="translate(100,300)">
            <ellipse cx="0" cy="-10" rx="7" ry="10" fill="rgba(242,175,200,0.55)" stroke="rgba(255,255,255,0.26)" strokeWidth="0.7" />
            <ellipse cx="0" cy="10" rx="7" ry="10" fill="rgba(242,175,200,0.55)" stroke="rgba(255,255,255,0.26)" strokeWidth="0.7" />
            <ellipse cx="-10" cy="0" rx="10" ry="7" fill="rgba(242,175,200,0.52)" stroke="rgba(255,255,255,0.24)" strokeWidth="0.7" />
            <ellipse cx="10" cy="0" rx="10" ry="7" fill="rgba(242,175,200,0.52)" stroke="rgba(255,255,255,0.24)" strokeWidth="0.7" />
            <circle cx="0" cy="0" r="4.5" fill="rgba(232,195,100,0.65)" stroke="rgba(255,255,255,0.28)" strokeWidth="0.6" />
          </g>

          {/* Mid bloom */}
          <g transform="translate(270,430)">
            <ellipse cx="0" cy="-8.5" rx="6" ry="8.5" fill="rgba(242,175,200,0.50)" stroke="rgba(255,255,255,0.22)" strokeWidth="0.6" />
            <ellipse cx="0" cy="8.5" rx="6" ry="8.5" fill="rgba(242,175,200,0.50)" stroke="rgba(255,255,255,0.22)" strokeWidth="0.6" />
            <ellipse cx="-8.5" cy="0" rx="8.5" ry="6" fill="rgba(242,175,200,0.48)" stroke="rgba(255,255,255,0.20)" strokeWidth="0.6" />
            <ellipse cx="8.5" cy="0" rx="8.5" ry="6" fill="rgba(242,175,200,0.48)" stroke="rgba(255,255,255,0.20)" strokeWidth="0.6" />
            <circle cx="0" cy="0" r="3.5" fill="rgba(232,195,100,0.55)" stroke="rgba(255,255,255,0.22)" strokeWidth="0.6" />
          </g>

          {/* Small bloom — lower right */}
          <g transform="translate(430,565)">
            <ellipse cx="0" cy="-7" rx="5" ry="7" fill="rgba(242,175,200,0.45)" stroke="rgba(255,255,255,0.18)" strokeWidth="0.6" />
            <ellipse cx="0" cy="7" rx="5" ry="7" fill="rgba(242,175,200,0.45)" stroke="rgba(255,255,255,0.18)" strokeWidth="0.6" />
            <ellipse cx="-7" cy="0" rx="7" ry="5" fill="rgba(242,175,200,0.42)" stroke="rgba(255,255,255,0.16)" strokeWidth="0.6" />
            <ellipse cx="7" cy="0" rx="7" ry="5" fill="rgba(242,175,200,0.42)" stroke="rgba(255,255,255,0.16)" strokeWidth="0.6" />
            <circle cx="0" cy="0" r="3" fill="rgba(232,195,100,0.50)" strokeWidth="0.5" />
          </g>

          {/* Tiny bloom — left vine */}
          <g transform="translate(58,530)">
            <ellipse cx="0" cy="-5.5" rx="4" ry="5.5" fill="rgba(242,175,200,0.40)" stroke="rgba(255,255,255,0.16)" strokeWidth="0.5" />
            <ellipse cx="0" cy="5.5" rx="4" ry="5.5" fill="rgba(242,175,200,0.40)" stroke="rgba(255,255,255,0.16)" strokeWidth="0.5" />
            <ellipse cx="-5.5" cy="0" rx="5.5" ry="4" fill="rgba(242,175,200,0.38)" stroke="rgba(255,255,255,0.14)" strokeWidth="0.5" />
            <ellipse cx="5.5" cy="0" rx="5.5" ry="4" fill="rgba(242,175,200,0.38)" stroke="rgba(255,255,255,0.14)" strokeWidth="0.5" />
            <circle cx="0" cy="0" r="2.2" fill="rgba(232,195,100,0.42)" strokeWidth="0.5" />
          </g>

          {/* ═══ BUTTERFLIES ═══ */}

          {/* Butterfly 1 */}
          <g transform="translate(195,245) rotate(-15)">
            <path d="M0,0 C-7,-12 -16,-9 -11,0 C-16,9 -7,12 0,0" fill="rgba(242,180,210,0.50)" stroke="rgba(255,255,255,0.24)" strokeWidth="0.5" />
            <path d="M0,0 C7,-12 16,-9 11,0 C16,9 7,12 0,0" fill="rgba(235,165,195,0.45)" stroke="rgba(255,255,255,0.20)" strokeWidth="0.5" />
            <line x1="0" y1="-5" x2="0" y2="5" stroke="rgba(200,150,170,0.50)" strokeWidth="1" />
            <path d="M0,-5 C-3,-9 -4,-10 -5,-9" stroke="rgba(200,150,170,0.35)" strokeWidth="0.5" fill="none" />
            <path d="M0,-5 C3,-9 4,-10 5,-9" stroke="rgba(200,150,170,0.35)" strokeWidth="0.5" fill="none" />
          </g>

          {/* Butterfly 2 */}
          <g transform="translate(340,495) rotate(12)">
            <path d="M0,0 C-6,-10 -13,-7 -9,0 C-13,7 -6,10 0,0" fill="rgba(190,170,220,0.42)" stroke="rgba(255,255,255,0.20)" strokeWidth="0.5" />
            <path d="M0,0 C6,-10 13,-7 9,0 C13,7 6,10 0,0" fill="rgba(180,160,210,0.38)" stroke="rgba(255,255,255,0.16)" strokeWidth="0.5" />
            <line x1="0" y1="-4" x2="0" y2="4" stroke="rgba(170,150,195,0.45)" strokeWidth="0.8" />
            <path d="M0,-4 C-2,-7 -3,-8 -4,-7" stroke="rgba(170,150,195,0.28)" strokeWidth="0.4" fill="none" />
            <path d="M0,-4 C2,-7 3,-8 4,-7" stroke="rgba(170,150,195,0.28)" strokeWidth="0.4" fill="none" />
          </g>

          {/* ═══ LADYBUG on right vine leaf ═══ */}
          <g transform="translate(378,380) rotate(25)">
            <ellipse cx="0" cy="0" rx="4.5" ry="5.5" fill="rgba(210,90,85,0.55)" stroke="rgba(170,65,65,0.28)" strokeWidth="0.5" />
            <line x1="0" y1="-5.5" x2="0" y2="5.5" stroke="rgba(40,25,25,0.28)" strokeWidth="0.5" />
            <circle cx="-1.5" cy="-1.5" r="0.8" fill="rgba(40,25,25,0.25)" />
            <circle cx="1.5" cy="0" r="0.7" fill="rgba(40,25,25,0.22)" />
            <circle cx="-1" cy="2.5" r="0.6" fill="rgba(40,25,25,0.20)" />
            <circle cx="0" cy="-6.8" r="2" fill="rgba(40,25,25,0.28)" />
          </g>

          {/* ═══ DRAGONFLY ═══ */}
          <g transform="translate(155,135) rotate(-20)">
            <line x1="0" y1="-10" x2="0" y2="10" stroke="rgba(100,175,140,0.42)" strokeWidth="1.2" strokeLinecap="round" />
            <ellipse cx="-7" cy="-2" rx="8" ry="2.5" fill="rgba(195,225,215,0.30)" stroke="rgba(255,255,255,0.15)" strokeWidth="0.4" transform="rotate(-10 -7 -2)" />
            <ellipse cx="7" cy="-2" rx="8" ry="2.5" fill="rgba(195,225,215,0.30)" stroke="rgba(255,255,255,0.15)" strokeWidth="0.4" transform="rotate(10 7 -2)" />
            <ellipse cx="-5.5" cy="3" rx="6" ry="2" fill="rgba(195,225,215,0.24)" stroke="rgba(255,255,255,0.10)" strokeWidth="0.4" />
            <ellipse cx="5.5" cy="3" rx="6" ry="2" fill="rgba(195,225,215,0.24)" stroke="rgba(255,255,255,0.10)" strokeWidth="0.4" />
            <circle cx="0" cy="-11.5" r="2.2" fill="rgba(100,175,140,0.38)" />
          </g>

          {/* ═══ BIRDS ═══ */}
          <path d="M295 72 C308 56 325 56 338 72" stroke="rgba(255,255,255,0.35)" strokeWidth="1.6" strokeLinecap="round" fill="none" />
          <path d="M355 48 C364 37 377 37 386 48" stroke="rgba(255,255,255,0.26)" strokeWidth="1.4" strokeLinecap="round" fill="none" />
          <path d="M400 68 C406 60 415 60 421 68" stroke="rgba(255,255,255,0.18)" strokeWidth="1.1" strokeLinecap="round" fill="none" />
          <path d="M215 95 C222 86 232 86 239 95" stroke="rgba(255,255,255,0.15)" strokeWidth="1" strokeLinecap="round" fill="none" />

          {/* ═══ FLOATING PETALS ═══ */}
          <ellipse cx="200" cy="160" rx="3.5" ry="5.5" fill="rgba(242,175,200,0.38)" transform="rotate(30 200 160)" />
          <ellipse cx="320" cy="275" rx="3" ry="5" fill="rgba(242,175,200,0.30)" transform="rotate(-25 320 275)" />
          <ellipse cx="148" cy="415" rx="2.5" ry="4.5" fill="rgba(242,175,200,0.28)" transform="rotate(45 148 415)" />
          <ellipse cx="438" cy="455" rx="2.5" ry="4" fill="rgba(242,175,200,0.25)" transform="rotate(-15 438 455)" />
          <ellipse cx="210" cy="565" rx="2" ry="3.5" fill="rgba(242,175,200,0.22)" transform="rotate(35 210 565)" />
          <ellipse cx="348" cy="148" rx="2" ry="3.5" fill="rgba(242,175,200,0.32)" transform="rotate(-40 348 148)" />
          <ellipse cx="125" cy="220" rx="2.5" ry="4" fill="rgba(242,175,200,0.25)" transform="rotate(20 125 220)" />
          <ellipse cx="410" cy="340" rx="2" ry="3.5" fill="rgba(242,175,200,0.22)" transform="rotate(55 410 340)" />

          {/* ═══ POLLEN ═══ */}
          <circle cx="248" cy="195" r="2" fill="rgba(255,255,255,0.14)" />
          <circle cx="178" cy="335" r="1.8" fill="rgba(242,175,200,0.22)" />
          <circle cx="338" cy="365" r="1.5" fill="rgba(255,255,255,0.12)" />
          <circle cx="418" cy="128" r="1.6" fill="rgba(242,175,200,0.20)" />
          <circle cx="128" cy="515" r="1.4" fill="rgba(168,213,186,0.18)" />
          <circle cx="298" cy="495" r="1.3" fill="rgba(242,175,200,0.17)" />
          <circle cx="58" cy="395" r="1.5" fill="rgba(255,255,255,0.10)" />
          <circle cx="458" cy="305" r="1.2" fill="rgba(242,175,200,0.16)" />

          {/* ═══ MEADOW ═══ */}
          <path d="M0 752 Q80 735 200 745 Q330 755 480 738 L480 800 L0 800 Z" fill="rgba(20,55,35,0.22)" />
          <path d="M0 770 Q120 760 260 768 Q400 776 480 762 L480 800 L0 800 Z" fill="rgba(25,60,38,0.16)" />
          <path d="M30 800 Q34 768 28 738" stroke="rgba(140,200,168,0.24)" strokeWidth="1.3" strokeLinecap="round" />
          <path d="M50 800 Q46 772 52 742" stroke="rgba(140,200,168,0.20)" strokeWidth="1.1" strokeLinecap="round" />
          <path d="M70 800 Q74 776 68 748" stroke="rgba(140,200,168,0.22)" strokeWidth="1.2" strokeLinecap="round" />
          <path d="M195 800 Q200 778 194 755" stroke="rgba(140,200,168,0.16)" strokeWidth="1" strokeLinecap="round" />
          <path d="M275 800 Q272 780 278 758" stroke="rgba(140,200,168,0.14)" strokeWidth="0.9" strokeLinecap="round" />
          <path d="M385 800 Q390 770 384 742" stroke="rgba(140,200,168,0.22)" strokeWidth="1.3" strokeLinecap="round" />
          <path d="M435 800 Q440 778 434 752" stroke="rgba(140,200,168,0.16)" strokeWidth="1" strokeLinecap="round" />
          <path d="M455 800 Q452 780 458 756" stroke="rgba(140,200,168,0.14)" strokeWidth="0.9" strokeLinecap="round" />

          {/* Small meadow flowers */}
          <g transform="translate(120,758)">
            <ellipse cx="0" cy="-4" rx="3" ry="4" fill="rgba(242,175,200,0.35)" />
            <ellipse cx="0" cy="4" rx="3" ry="4" fill="rgba(242,175,200,0.35)" />
            <ellipse cx="-4" cy="0" rx="4" ry="3" fill="rgba(242,175,200,0.32)" />
            <ellipse cx="4" cy="0" rx="4" ry="3" fill="rgba(242,175,200,0.32)" />
            <circle cx="0" cy="0" r="1.8" fill="rgba(232,195,100,0.40)" />
          </g>
          <g transform="translate(345,752)">
            <ellipse cx="0" cy="-3.5" rx="2.5" ry="3.5" fill="rgba(242,175,200,0.30)" />
            <ellipse cx="0" cy="3.5" rx="2.5" ry="3.5" fill="rgba(242,175,200,0.30)" />
            <ellipse cx="-3.5" cy="0" rx="3.5" ry="2.5" fill="rgba(242,175,200,0.28)" />
            <ellipse cx="3.5" cy="0" rx="3.5" ry="2.5" fill="rgba(242,175,200,0.28)" />
            <circle cx="0" cy="0" r="1.5" fill="rgba(232,195,100,0.35)" />
          </g>
        </svg>
      </div>

      {/* Dark overlay for text readability */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[50%]"
        style={{
          background: "linear-gradient(to top, rgba(20,45,30,0.48) 0%, rgba(20,45,30,0.15) 50%, transparent 100%)",
        }}
      />

      {/* Brand */}
      <div className="relative z-10 flex items-center gap-2.5">
        <div className="h-2 w-2 rounded-full" style={{ backgroundColor: "rgba(255,255,255,0.55)" }} />
        <span className="text-[12px] font-semibold uppercase tracking-[0.14em]" style={{ color: "rgba(255,255,255,0.75)" }}>
          MySafePlace
        </span>
      </div>

      {/* Main content */}
      <div className="relative z-10">
        <h1 className="font-bold leading-[1.12] tracking-tight text-white" style={{ fontSize: "clamp(2rem, 4.5vw, 3rem)" }}>
          A space that&apos;s
          <br />
          just yours.
        </h1>
        <p className="mt-5 max-w-[280px] text-[14px] leading-[1.75]" style={{ color: "rgba(255,255,255,0.65)" }}>
          Track how you feel, write what&apos;s on your mind, and find what helps you grow — at your own pace.
        </p>
        <div className="mt-8 flex flex-wrap gap-2">
          {["Mood tracking", "Journaling", "Resources"].map((f) => (
            <span
              key={f}
              className="rounded-full px-3.5 py-1.5 text-[11px] font-medium"
              style={{ color: "rgba(255,255,255,0.65)", backgroundColor: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.18)" }}
            >
              {f}
            </span>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10">
        <div className="h-px" style={{ backgroundColor: "rgba(255,255,255,0.10)" }} />
        <p className="mt-4 text-[11px]" style={{ color: "rgba(255,255,255,0.38)" }}>
          You deserve a safe space.
        </p>
      </div>
    </div>
  );
}
