const MOOD_COLORS: Record<string, string> = {
  happy: "#D4A017", calm: "#5EA88A", relaxed: "#9B8EC4", grateful: "#D4789A",
  motivated: "#2E9E6A", sad: "#5B8DB8", anxious: "#CC8C35", stressed: "#C46050",
  angry: "#C04848", lonely: "#8A6AAE", overwhelmed: "#4A8A8A", tired: "#708898",
  insecure: "#A87890", frustrated: "#B87A3E", bored: "#7A946A",
};

export function moodColor(mood: string) {
  return MOOD_COLORS[mood] ?? "#5EA88A";
}

export default function MoodFace({ mood, size = 28 }: { mood: string; size?: number }) {
  const c = moodColor(mood);
  const sw = 1.5;
  const head = <circle cx="14" cy="14" r="11.5" stroke={c} strokeWidth={sw} fill={c + "15"} />;

  switch (mood) {
    case "happy":
      return (<svg width={size} height={size} viewBox="0 0 28 28" fill="none">{head}<path d="M8 12 Q10 10 12 12" stroke={c} strokeWidth={sw} strokeLinecap="round" /><path d="M16 12 Q18 10 20 12" stroke={c} strokeWidth={sw} strokeLinecap="round" /><path d="M8 17 Q14 22 20 17" stroke={c} strokeWidth={sw} strokeLinecap="round" /></svg>);
    case "calm":
      return (<svg width={size} height={size} viewBox="0 0 28 28" fill="none">{head}<path d="M8 12.5 L12 12.5" stroke={c} strokeWidth={sw} strokeLinecap="round" /><path d="M16 12.5 L20 12.5" stroke={c} strokeWidth={sw} strokeLinecap="round" /><path d="M11 17.5 Q14 19 17 17.5" stroke={c} strokeWidth={sw} strokeLinecap="round" /></svg>);
    case "relaxed":
      return (<svg width={size} height={size} viewBox="0 0 28 28" fill="none">{head}<circle cx="10" cy="12.5" r="1.2" fill={c} /><path d="M7.5 11 L12.5 11" stroke={c} strokeWidth={sw} strokeLinecap="round" /><circle cx="18" cy="12.5" r="1.2" fill={c} /><path d="M15.5 11 L20.5 11" stroke={c} strokeWidth={sw} strokeLinecap="round" /><path d="M10 17.5 Q14 20 18 17.5" stroke={c} strokeWidth={sw} strokeLinecap="round" /></svg>);
    case "grateful":
      return (<svg width={size} height={size} viewBox="0 0 28 28" fill="none">{head}<path d="M8 13 Q10 11 12 13" stroke={c} strokeWidth={sw} strokeLinecap="round" /><path d="M16 13 Q18 11 20 13" stroke={c} strokeWidth={sw} strokeLinecap="round" /><path d="M9 17 Q14 21 19 17" stroke={c} strokeWidth={sw} strokeLinecap="round" /><circle cx="7" cy="15" r="1.8" fill={c} opacity="0.25" /><circle cx="21" cy="15" r="1.8" fill={c} opacity="0.25" /></svg>);
    case "motivated":
      return (<svg width={size} height={size} viewBox="0 0 28 28" fill="none">{head}<circle cx="10" cy="12" r="1.5" fill={c} /><circle cx="18" cy="12" r="1.5" fill={c} /><path d="M9 16 L19 16 Q19 20.5 14 20.5 Q9 20.5 9 16 Z" stroke={c} strokeWidth={sw} fill={c + "20"} strokeLinejoin="round" /></svg>);
    case "sad":
      return (<svg width={size} height={size} viewBox="0 0 28 28" fill="none">{head}<path d="M8 10 L11.5 9" stroke={c} strokeWidth="1.4" strokeLinecap="round" /><path d="M20 10 L16.5 9" stroke={c} strokeWidth="1.4" strokeLinecap="round" /><circle cx="10" cy="12.5" r="1.2" fill={c} /><circle cx="18" cy="12.5" r="1.2" fill={c} /><path d="M9.5 19 Q14 16 18.5 19" stroke={c} strokeWidth={sw} strokeLinecap="round" /><circle cx="20" cy="16" r="1.2" fill={c} /></svg>);
    case "anxious":
      return (<svg width={size} height={size} viewBox="0 0 28 28" fill="none">{head}<circle cx="10" cy="12" r="2.2" stroke={c} strokeWidth="1.2" fill="none" /><circle cx="10" cy="12" r="0.9" fill={c} /><circle cx="18" cy="12" r="2.2" stroke={c} strokeWidth="1.2" fill="none" /><circle cx="18" cy="12" r="0.9" fill={c} /><path d="M9 18 Q11 16.5 14 18 Q17 19.5 19 18" stroke={c} strokeWidth={sw} strokeLinecap="round" fill="none" /><path d="M21.5 7.5 Q22 9.5 21.5 11 Q21 9.5 21.5 7.5 Z" fill={c} /></svg>);
    case "stressed":
      return (<svg width={size} height={size} viewBox="0 0 28 28" fill="none">{head}<path d="M8.5 11 L11.5 13.5" stroke={c} strokeWidth={sw} strokeLinecap="round" /><path d="M11.5 11 L8.5 13.5" stroke={c} strokeWidth={sw} strokeLinecap="round" /><path d="M16.5 11 L19.5 13.5" stroke={c} strokeWidth={sw} strokeLinecap="round" /><path d="M19.5 11 L16.5 13.5" stroke={c} strokeWidth={sw} strokeLinecap="round" /><path d="M8.5 18 L11 16.5 L14 18 L17 16.5 L19.5 18" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" fill="none" /></svg>);
    case "angry":
      return (<svg width={size} height={size} viewBox="0 0 28 28" fill="none">{head}<path d="M7 9.5 L12 11.5" stroke={c} strokeWidth="1.8" strokeLinecap="round" /><path d="M21 9.5 L16 11.5" stroke={c} strokeWidth="1.8" strokeLinecap="round" /><circle cx="10" cy="13.5" r="1.3" fill={c} /><circle cx="18" cy="13.5" r="1.3" fill={c} /><rect x="9" y="17" width="10" height="3" rx="0.5" stroke={c} strokeWidth="1.3" fill="none" /><path d="M12 17 L12 20" stroke={c} strokeWidth="1" /><path d="M15.5 17 L15.5 20" stroke={c} strokeWidth="1" /></svg>);
    case "lonely":
      return (<svg width={size} height={size} viewBox="0 0 28 28" fill="none">{head}<circle cx="10" cy="13" r="1" fill={c} /><circle cx="18" cy="13" r="1" fill={c} /><path d="M11 18 Q14 16.5 17 18" stroke={c} strokeWidth={sw} strokeLinecap="round" /></svg>);
    case "overwhelmed":
      return (<svg width={size} height={size} viewBox="0 0 28 28" fill="none">{head}<path d="M7.5 9 L12.5 9" stroke={c} strokeWidth="1.4" strokeLinecap="round" /><path d="M15.5 9 L20.5 9" stroke={c} strokeWidth="1.4" strokeLinecap="round" /><circle cx="10" cy="12.5" r="2.3" stroke={c} strokeWidth="1.3" fill="none" /><circle cx="10" cy="12.5" r="1" fill={c} /><circle cx="18" cy="12.5" r="2.3" stroke={c} strokeWidth="1.3" fill="none" /><circle cx="18" cy="12.5" r="1" fill={c} /><ellipse cx="14" cy="19" rx="2.2" ry="2" stroke={c} strokeWidth={sw} fill="none" /></svg>);
    case "tired":
      return (<svg width={size} height={size} viewBox="0 0 28 28" fill="none">{head}<path d="M8 13 Q10 11.5 12 13" stroke={c} strokeWidth="1.8" strokeLinecap="round" fill="none" /><path d="M16 13 Q18 11.5 20 13" stroke={c} strokeWidth="1.8" strokeLinecap="round" fill="none" /><ellipse cx="14" cy="19" rx="2.5" ry="2" stroke={c} strokeWidth={sw} fill={c + "15"} /><path d="M18 7 L20.5 7 L18 9.5 L20.5 9.5" stroke={c} strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" fill="none" /><path d="M24 1.5 L26.5 1.5 L24 3.5 L26.5 3.5" stroke={c} strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" fill="none" /></svg>);
    case "insecure":
      return (<svg width={size} height={size} viewBox="0 0 28 28" fill="none">{head}<path d="M8 11 L10.5 12.5 L8 14" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" fill="none" /><path d="M20 11 L17.5 12.5 L20 14" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" fill="none" /><path d="M10 17.5 Q12 18.5 14 17.5 Q16 16.8 18 17.8" stroke={c} strokeWidth={sw} strokeLinecap="round" fill="none" /></svg>);
    case "frustrated":
      return (<svg width={size} height={size} viewBox="0 0 28 28" fill="none">{head}<path d="M8 9 L12 10.5" stroke={c} strokeWidth="1.6" strokeLinecap="round" /><path d="M20 10 L16.5 11" stroke={c} strokeWidth="1.6" strokeLinecap="round" /><circle cx="10" cy="13" r="1.3" fill={c} /><circle cx="18" cy="13" r="1.3" fill={c} /><path d="M9 19.5 Q14 16 19 19.5" stroke={c} strokeWidth={sw} strokeLinecap="round" fill="none" /><circle cx="4.5" cy="14" r="1.8" fill={c + "30"} /><circle cx="3.5" cy="12" r="1.2" fill={c + "25"} /><circle cx="23.5" cy="14" r="1.8" fill={c + "30"} /><circle cx="24.5" cy="12" r="1.2" fill={c + "25"} /></svg>);
    case "bored":
      return (<svg width={size} height={size} viewBox="0 0 28 28" fill="none">{head}<circle cx="10" cy="12" r="2" stroke={c} strokeWidth="1.2" fill="none" /><circle cx="10" cy="11.2" r="0.9" fill={c} /><circle cx="18" cy="12" r="2" stroke={c} strokeWidth="1.2" fill="none" /><circle cx="18" cy="11.2" r="0.9" fill={c} /><path d="M10.5 18 L17.5 18" stroke={c} strokeWidth={sw} strokeLinecap="round" /></svg>);
    default:
      return (<svg width={size} height={size} viewBox="0 0 28 28" fill="none">{head}<circle cx="10" cy="12.5" r="1.2" fill={c} /><circle cx="18" cy="12.5" r="1.2" fill={c} /><path d="M10 17 L18 17" stroke={c} strokeWidth={sw} strokeLinecap="round" /></svg>);
  }
}
