"use client";

export default function AuthLeftPanel() {
  return (
    <div
      className="relative flex min-h-[300px] flex-col justify-between overflow-hidden px-8 py-10 md:min-h-screen md:px-12 md:py-14"
      style={{
        background:
          "linear-gradient(175deg, #9DC9AF 0%, #7BBD9E 9%, #52AB84 20%, #3D8B6E 36%, #2D6A4F 54%, #1E4D38 70%, #132A1A 86%, #0A1A10 100%)",
      }}
    >
      {/* ═══════════════════════════════════════
          LAYERED NATURE ILLUSTRATION
      ═══════════════════════════════════════ */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <svg
          viewBox="0 0 480 760"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="absolute inset-0 h-full w-full"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <radialGradient id="sunGlow" cx="58%" cy="16%" r="52%" gradientUnits="userSpaceOnUse">
              <stop offset="0%"   stopColor="rgba(255,245,200,0.26)" />
              <stop offset="45%"  stopColor="rgba(255,228,150,0.10)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0)" />
            </radialGradient>
            <radialGradient id="mistLeft" cx="12%" cy="48%" r="38%" gradientUnits="userSpaceOnUse">
              <stop offset="0%"   stopColor="rgba(200,232,215,0.16)" />
              <stop offset="100%" stopColor="rgba(200,232,215,0)" />
            </radialGradient>
            <radialGradient id="mistRight" cx="88%" cy="35%" r="32%" gradientUnits="userSpaceOnUse">
              <stop offset="0%"   stopColor="rgba(190,225,208,0.12)" />
              <stop offset="100%" stopColor="rgba(190,225,208,0)" />
            </radialGradient>
          </defs>

          {/* ── LAYER 1: Atmospheric light ── */}
          <ellipse cx="278" cy="122" rx="230" ry="188" fill="url(#sunGlow)" />
          <ellipse cx="58"  cy="364" rx="178" ry="288" fill="url(#mistLeft)" />
          <ellipse cx="422" cy="266" rx="152" ry="220" fill="url(#mistRight)" />

          {/* ── LAYER 2: Distant tree silhouettes ── */}
          <path d="M0 760 C0 610 -14 465 24 358 C52 272 40 215 62 155 C84 95 56 52 34 0 L0 0 Z"
            fill="rgba(5,15,9,0.33)" />
          <path d="M480 760 C480 610 494 465 456 358 C428 272 440 215 418 155 C396 95 424 52 446 0 L480 0 Z"
            fill="rgba(5,15,9,0.28)" />

          {/* ── LAYER 3: Mid-distance tree canopies ── */}
          <ellipse cx="62"  cy="295" rx="72"  ry="102" fill="rgba(8,22,13,0.20)" />
          <ellipse cx="30"  cy="205" rx="50"  ry="82"  fill="rgba(8,22,13,0.16)" />
          <ellipse cx="418" cy="275" rx="82"  ry="112" fill="rgba(8,22,13,0.18)" />
          <ellipse cx="452" cy="180" rx="56"  ry="90"  fill="rgba(8,22,13,0.14)" />

          {/* ── LAYER 4: Branch system ── */}
          <path d="M-20 780 C60 640 170 520 290 370 C380 250 440 162 500 62"
            stroke="rgba(255,255,255,0.16)" strokeWidth="3.2" strokeLinecap="round" />
          <path d="M232 462 C292 412 374 388 452 362"
            stroke="rgba(255,255,255,0.10)" strokeWidth="2.2" strokeLinecap="round" />
          <path d="M178 514 C132 462 92 412 55 354"
            stroke="rgba(255,255,255,0.09)" strokeWidth="1.9" strokeLinecap="round" />

          {/* ── LAYER 5: Leaves ── */}
          <g transform="translate(74,692) rotate(-48)">
            <path d="M0,-26 C12,-16 12,16 0,26 C-12,16 -12,-16 0,-26 Z" fill="rgba(168,213,181,0.48)" />
            <line x1="0" y1="-22" x2="0" y2="22" stroke="rgba(168,213,181,0.62)" strokeWidth="0.9" />
          </g>
          <g transform="translate(150,595) rotate(-62)">
            <path d="M0,-22 C10,-13 10,13 0,22 C-10,13 -10,-13 0,-22 Z" fill="rgba(168,213,181,0.40)" />
            <line x1="0" y1="-18" x2="0" y2="18" stroke="rgba(168,213,181,0.54)" strokeWidth="0.8" />
          </g>
          <g transform="translate(222,482) rotate(-72)">
            <path d="M0,-24 C11,-15 11,15 0,24 C-11,15 -11,-15 0,-24 Z" fill="rgba(168,213,181,0.50)" />
            <line x1="0" y1="-20" x2="0" y2="20" stroke="rgba(168,213,181,0.62)" strokeWidth="0.8" />
          </g>
          <g transform="translate(312,392) rotate(-80)">
            <path d="M0,-20 C9,-12 9,12 0,20 C-9,12 -9,-12 0,-20 Z" fill="rgba(168,213,181,0.38)" />
            <line x1="0" y1="-16" x2="0" y2="16" stroke="rgba(168,213,181,0.52)" strokeWidth="0.7" />
          </g>
          <g transform="translate(312,418) rotate(-22)">
            <path d="M0,-17 C7,-10 7,10 0,17 C-7,10 -7,-10 0,-17 Z" fill="rgba(168,213,181,0.32)" />
          </g>
          <g transform="translate(392,382) rotate(-38)">
            <path d="M0,-15 C6,-9 6,9 0,15 C-6,9 -6,-9 0,-15 Z" fill="rgba(168,213,181,0.28)" />
          </g>
          <g transform="translate(107,443) rotate(24)">
            <path d="M0,-16 C7,-10 7,10 0,16 C-7,10 -7,-10 0,-16 Z" fill="rgba(168,213,181,0.29)" />
          </g>

          {/* ── LAYER 6: Cherry blossom flowers ── */}
          <g transform="translate(297,380)">
            <ellipse cx="0"  cy="-10" rx="6.5" ry="10" fill="rgba(245,208,216,0.75)" />
            <ellipse cx="0"  cy="10"  rx="6.5" ry="10" fill="rgba(245,208,216,0.75)" />
            <ellipse cx="-10" cy="0"  rx="10"  ry="6.5" fill="rgba(245,208,216,0.75)" />
            <ellipse cx="10"  cy="0"  rx="10"  ry="6.5" fill="rgba(245,208,216,0.75)" />
            <ellipse cx="-7" cy="-7" rx="6" ry="9" fill="rgba(245,208,216,0.58)" transform="rotate(45 -7 -7)" />
            <ellipse cx="7"  cy="-7" rx="6" ry="9" fill="rgba(245,208,216,0.58)" transform="rotate(-45 7 -7)" />
            <circle  cx="0"  cy="0"  r="5"  fill="rgba(232,201,122,0.94)" />
          </g>
          <g transform="translate(165,508)">
            <ellipse cx="0"  cy="-8" rx="5" ry="8" fill="rgba(245,208,216,0.64)" />
            <ellipse cx="0"  cy="8"  rx="5" ry="8" fill="rgba(245,208,216,0.64)" />
            <ellipse cx="-8" cy="0"  rx="8" ry="5" fill="rgba(245,208,216,0.64)" />
            <ellipse cx="8"  cy="0"  rx="8" ry="5" fill="rgba(245,208,216,0.64)" />
            <circle  cx="0"  cy="0"  r="4"  fill="rgba(232,201,122,0.87)" />
          </g>
          <g transform="translate(438,364)">
            <ellipse cx="0"  cy="-6" rx="4" ry="6" fill="rgba(245,208,216,0.54)" />
            <ellipse cx="0"  cy="6"  rx="4" ry="6" fill="rgba(245,208,216,0.54)" />
            <ellipse cx="-6" cy="0"  rx="6" ry="4" fill="rgba(245,208,216,0.54)" />
            <ellipse cx="6"  cy="0"  rx="6" ry="4" fill="rgba(245,208,216,0.54)" />
            <circle  cx="0"  cy="0"  r="3"  fill="rgba(232,201,122,0.77)" />
          </g>
          <g transform="translate(90,675)">
            <ellipse cx="0"    cy="-5.5" rx="3.2" ry="5.5" fill="rgba(245,208,216,0.48)" />
            <ellipse cx="0"    cy="5.5"  rx="3.2" ry="5.5" fill="rgba(245,208,216,0.48)" />
            <ellipse cx="-5.5" cy="0"    rx="5.5" ry="3.2" fill="rgba(245,208,216,0.48)" />
            <ellipse cx="5.5"  cy="0"    rx="5.5" ry="3.2" fill="rgba(245,208,216,0.48)" />
            <circle  cx="0"    cy="0"    r="2.8"             fill="rgba(232,201,122,0.70)" />
          </g>

          {/* ── LAYER 7: Birds ── */}
          <path d="M338 138 C349 127 363 127 374 138" stroke="rgba(255,255,255,0.85)" strokeWidth="2.2" strokeLinecap="round" />
          <path d="M384 110 C393 102 403 102 412 110" stroke="rgba(255,255,255,0.70)" strokeWidth="1.9" strokeLinecap="round" />
          <path d="M416 157 C423 150 431 150 438 157" stroke="rgba(255,255,255,0.60)" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M360 168 C365 163 371 163 376 168" stroke="rgba(255,255,255,0.46)" strokeWidth="1.2" strokeLinecap="round" />
          <path d="M428 126 C432 122 437 122 441 126" stroke="rgba(255,255,255,0.36)" strokeWidth="1.1" strokeLinecap="round" />

          {/* ── LAYER 8: Meadow ground ── */}
          <path d="M0 724 Q80 704 180 712 Q290 722 400 708 Q440 703 480 708 L480 760 L0 760 Z"
            fill="rgba(32,60,38,0.45)" />
          <path d="M0 740 Q100 727 220 732 Q340 737 480 724 L480 760 L0 760 Z"
            fill="rgba(48,86,56,0.35)" />

          {/* ── LAYER 9: Grass blades ── */}
          <path d="M34 760 Q38 738 32 712"  stroke="rgba(168,213,181,0.52)" strokeWidth="1.8" strokeLinecap="round" fill="none" />
          <path d="M48 760 Q43 742 50 717"  stroke="rgba(168,213,181,0.44)" strokeWidth="1.5" strokeLinecap="round" fill="none" />
          <path d="M63 760 Q68 745 61 722"  stroke="rgba(168,213,181,0.46)" strokeWidth="1.6" strokeLinecap="round" fill="none" />
          <path d="M79 760 Q75 747 82 724"  stroke="rgba(168,213,181,0.38)" strokeWidth="1.4" strokeLinecap="round" fill="none" />
          <path d="M398 760 Q402 738 397 714" stroke="rgba(168,213,181,0.48)" strokeWidth="1.7" strokeLinecap="round" fill="none" />
          <path d="M414 760 Q410 742 416 718" stroke="rgba(168,213,181,0.40)" strokeWidth="1.4" strokeLinecap="round" fill="none" />
          <path d="M430 760 Q435 745 429 722" stroke="rgba(168,213,181,0.44)" strokeWidth="1.5" strokeLinecap="round" fill="none" />
          <path d="M192 760 Q196 743 191 720" stroke="rgba(168,213,181,0.32)" strokeWidth="1.3" strokeLinecap="round" fill="none" />
          <path d="M282 760 Q278 746 284 724" stroke="rgba(168,213,181,0.30)" strokeWidth="1.2" strokeLinecap="round" fill="none" />

          {/* ── LAYER 10: Floating petals / pollen ── */}
          <ellipse cx="130" cy="308" rx="4.5" ry="7.5" fill="rgba(245,208,216,0.42)" transform="rotate(22 130 308)" />
          <ellipse cx="344" cy="432" rx="3.5" ry="6"   fill="rgba(245,208,216,0.34)" transform="rotate(-18 344 432)" />
          <ellipse cx="84"  cy="462" rx="3"   ry="5.5" fill="rgba(245,208,216,0.32)" transform="rotate(35 84 462)" />
          <ellipse cx="410" cy="282" rx="4"   ry="7"   fill="rgba(245,208,216,0.28)" transform="rotate(-28 410 282)" />
          <circle cx="108" cy="542" r="2.4" fill="rgba(168,213,181,0.46)" />
          <circle cx="262" cy="492" r="1.8" fill="rgba(168,213,181,0.36)" />
          <circle cx="364" cy="332" r="2.1" fill="rgba(168,213,181,0.40)" />
          <circle cx="204" cy="592" r="1.6" fill="rgba(245,208,216,0.50)" />
          <circle cx="458" cy="212" r="1.6" fill="rgba(245,208,216,0.37)" />
          <circle cx="142" cy="464" r="1.3" fill="rgba(245,208,216,0.42)" />
          <circle cx="424" cy="292" r="1.9" fill="rgba(168,213,181,0.32)" />
        </svg>
      </div>

      {/* ═══════════════════════════════════════
          BRAND MARK
      ═══════════════════════════════════════ */}
      <div className="relative">
        <span
          className="inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-widest"
          style={{
            backgroundColor: "rgba(255,255,255,0.10)",
            color: "#B8E0C8",
            border: "1px solid rgba(255,255,255,0.18)",
            letterSpacing: "0.12em",
          }}
        >
          <span>🌿</span>
          MySafePlace
        </span>
      </div>

      {/* ═══════════════════════════════════════
          MAIN CONTENT
      ═══════════════════════════════════════ */}
      <div className="relative flex flex-col gap-7 py-4">
        <div className="relative">
          {/* Soft glow behind heading text */}
          <div
            className="pointer-events-none absolute"
            style={{
              top: -16, left: -24,
              width: 340, height: 130,
              borderRadius: "50%",
              background: "rgba(168,213,186,0.22)",
              filter: "blur(38px)",
            }}
          />
          <h1
            className="relative text-3xl font-bold leading-tight tracking-tight text-white md:text-[2.7rem] md:leading-[1.15]"
          >
            Welcome to
            <br />
            <span
              style={{
                color: "#A8D5B5",
                textShadow: "0 0 30px rgba(168,213,181,0.35)",
              }}
            >
              MySafePlace
            </span>
            <span className="ml-2 text-2xl">🪷</span>
          </h1>
          <p
            className="relative mt-4 text-[15px] leading-relaxed"
            style={{ color: "#B8DEC9" }}
          >
            Your personal wellness companion,
            <br className="hidden md:block" />
            anytime, anywhere.
          </p>
        </div>

        {/* About card — glass morphism */}
        <div
          className="rounded-2xl p-5"
          style={{
            backgroundColor: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.14)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.12)",
          }}
        >
          <p
            className="mb-3 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest"
            style={{ color: "#A8D5B5", letterSpacing: "0.10em" }}
          >
            <span>🌸</span>
            About MySafePlace
          </p>
          <div
            className="flex flex-col gap-2.5 text-sm leading-relaxed"
            style={{ color: "rgba(255,255,255,0.86)" }}
          >
            <p>
              You don&apos;t know where to start to take care of yourself?
              You&apos;re in the right place.
            </p>
            <p>
              MySafePlace is a gentle pause in your day — a corner just for
              you. Come here whenever you need a break, to breathe, recharge,
              and do something kind for yourself.
            </p>
            <p style={{ color: "rgba(168,213,181,0.92)" }}>
              Because you deserve it. 🌿🪷
            </p>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════
          FOOTER ACCENT
      ═══════════════════════════════════════ */}
      <div className="relative flex items-center gap-3">
        <div
          className="h-px flex-1 rounded-full"
          style={{ backgroundColor: "rgba(168,213,181,0.28)" }}
        />
        <p
          className="text-xs font-medium uppercase tracking-widest"
          style={{ color: "rgba(168,213,181,0.65)", letterSpacing: "0.12em" }}
        >
          Start your journey
        </p>
        <div
          className="h-px flex-1 rounded-full"
          style={{ backgroundColor: "rgba(168,213,181,0.28)" }}
        />
      </div>
    </div>
  );
}
