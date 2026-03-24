"use client";

/* Tiny cherry blossom flower matching sidebar style */
function Flower({ x, y, s, o, anim }: { x: number; y: number; s: number; o: number; anim: string }) {
  return (
    <g transform={`translate(${x},${y}) scale(${s})`} opacity={o} className={anim}>
      <ellipse cx="0" cy="-4" rx="3" ry="4" fill="rgba(242,175,200,0.55)" />
      <ellipse cx="0" cy="4" rx="3" ry="4" fill="rgba(242,175,200,0.55)" />
      <ellipse cx="-4" cy="0" rx="4" ry="3" fill="rgba(242,175,200,0.50)" />
      <ellipse cx="4" cy="0" rx="4" ry="3" fill="rgba(242,175,200,0.50)" />
      <circle cx="0" cy="0" r="1.8" fill="rgba(232,195,100,0.65)" />
    </g>
  );
}

export default function FloatingPetals() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <svg viewBox="0 0 1400 900" fill="none" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice">
        {/* Soft glows */}
        <circle cx="1100" cy="100" r="250" fill="rgba(242,196,206,0.05)" />
        <circle cx="200" cy="700" r="200" fill="rgba(168,213,186,0.04)" />

        {/* Row 1 */}
        <Flower x={350} y={80} s={0.7} o={0.30} anim="petal-drift" />
        <Flower x={620} y={55} s={0.5} o={0.22} anim="petal-drift-1" />
        <Flower x={920} y={90} s={0.6} o={0.26} anim="petal-drift-2" />
        <Flower x={1180} y={70} s={0.5} o={0.20} anim="petal-drift" />

        {/* Row 2 */}
        <Flower x={220} y={200} s={0.6} o={0.25} anim="petal-drift-2" />
        <Flower x={500} y={230} s={0.5} o={0.22} anim="petal-drift" />
        <Flower x={780} y={190} s={0.7} o={0.28} anim="petal-drift-1" />
        <Flower x={1060} y={210} s={0.5} o={0.20} anim="petal-drift-2" />
        <Flower x={1300} y={175} s={0.45} o={0.18} anim="petal-drift" />

        {/* Row 3 */}
        <Flower x={160} y={350} s={0.55} o={0.24} anim="petal-drift-1" />
        <Flower x={420} y={380} s={0.7} o={0.28} anim="petal-drift" />
        <Flower x={680} y={340} s={0.5} o={0.20} anim="petal-drift-2" />
        <Flower x={960} y={370} s={0.65} o={0.26} anim="petal-drift-1" />
        <Flower x={1220} y={355} s={0.5} o={0.22} anim="petal-drift" />

        {/* Row 4 */}
        <Flower x={300} y={500} s={0.6} o={0.25} anim="petal-drift-2" />
        <Flower x={560} y={520} s={0.5} o={0.22} anim="petal-drift" />
        <Flower x={830} y={490} s={0.65} o={0.26} anim="petal-drift-1" />
        <Flower x={1110} y={510} s={0.5} o={0.20} anim="petal-drift-2" />

        {/* Row 5 */}
        <Flower x={190} y={650} s={0.55} o={0.22} anim="petal-drift" />
        <Flower x={460} y={680} s={0.7} o={0.28} anim="petal-drift-1" />
        <Flower x={740} y={640} s={0.5} o={0.20} anim="petal-drift-2" />
        <Flower x={1000} y={670} s={0.6} o={0.24} anim="petal-drift" />
        <Flower x={1260} y={650} s={0.5} o={0.22} anim="petal-drift-1" />

        {/* Row 6 */}
        <Flower x={370} y={800} s={0.6} o={0.24} anim="petal-drift-2" />
        <Flower x={650} y={820} s={0.5} o={0.20} anim="petal-drift" />
        <Flower x={1060} y={790} s={0.65} o={0.26} anim="petal-drift-1" />

        {/* Pollen dots */}
        <circle cx="450" cy="150" r="1.5" fill="#E8CA7A" opacity="0.10" />
        <circle cx="800" cy="280" r="1.3" fill="#E8CA7A" opacity="0.08" />
        <circle cx="300" cy="450" r="1.4" fill="#E8CA7A" opacity="0.09" />
        <circle cx="1000" cy="450" r="1.2" fill="#E8CA7A" opacity="0.08" />
        <circle cx="600" cy="600" r="1.5" fill="#E8CA7A" opacity="0.09" />
        <circle cx="1150" cy="300" r="1.3" fill="#E8CA7A" opacity="0.08" />
      </svg>
    </div>
  );
}
