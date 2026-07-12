/*
  Thin-line icons, drawn by hand — no icon library.
  All inherit currentColor; stroke 1.5 keeps them quiet.
*/

const base = { fill: "none", stroke: "currentColor", strokeWidth: 1.5, strokeLinecap: "round", strokeLinejoin: "round" };

function Svg({ size = 20, children, ...rest }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" {...rest}>
      {children}
    </svg>
  );
}

// Mind — an unwinding spiral, thought settling.
export const MindIcon = ({ size }) => (
  <Svg size={size}>
    <path {...base} d="M12 4.5a7.5 7.5 0 1 1-7.5 7.5c0-3 2.3-5.3 5.2-5.3 2.4 0 4.3 1.9 4.3 4.3 0 1.9-1.5 3.4-3.4 3.4-1.5 0-2.7-1.2-2.7-2.7" />
  </Svg>
);

// Body — a standing figure mid-stretch.
export const BodyIcon = ({ size }) => (
  <Svg size={size}>
    <circle {...base} cx="12" cy="5" r="2.4" />
    <path {...base} d="M5.5 11.5c2-1.6 4.2-2.4 6.5-2.4s4.5.8 6.5 2.4" />
    <path {...base} d="M12 9.1v6.1m0 0-3.4 5.3M12 15.2l3.4 5.3" />
  </Svg>
);

// Home — a house with a warm doorway.
export const HomeIcon = ({ size }) => (
  <Svg size={size}>
    <path {...base} d="M4.5 11 12 4.5 19.5 11" />
    <path {...base} d="M6.5 9.8V19h11V9.8" />
    <path {...base} d="M10.3 19v-4.6h3.4V19" />
  </Svg>
);

// Growth — a sprout, two leaves.
export const GrowthIcon = ({ size }) => (
  <Svg size={size}>
    <path {...base} d="M12 20.5V10" />
    <path {...base} d="M12 13.5C12 9.5 9.5 7 5.5 7c0 4 2.5 6.5 6.5 6.5Z" />
    <path {...base} d="M12 10c0-3.3 2.2-5.5 5.5-5.5 0 3.3-2.2 5.5-5.5 5.5Z" />
  </Svg>
);

// Relationships — two figures close together.
export const RelIcon = ({ size }) => (
  <Svg size={size}>
    <circle {...base} cx="8.5" cy="8" r="2.6" />
    <circle {...base} cx="16" cy="9.5" r="2.1" />
    <path {...base} d="M3.5 19c.5-3.4 2.5-5.4 5-5.4s4.5 2 5 5.4" />
    <path {...base} d="M14.6 14.4c2.4-.6 4.8 1 5.6 4.1" />
  </Svg>
);

// Heart — love, plainly.
export const HeartIcon = ({ size }) => (
  <Svg size={size}>
    <path {...base} d="M12 19.5c-4.5-3.2-7.5-6-7.5-9.2 0-2.2 1.7-3.8 3.8-3.8 1.5 0 2.9.9 3.7 2.3.8-1.4 2.2-2.3 3.7-2.3 2.1 0 3.8 1.6 3.8 3.8 0 3.2-3 6-7.5 9.2Z" />
  </Svg>
);

// Chevrons.
export const ChevronRight = ({ size = 16 }) => (
  <Svg size={size}><path {...base} d="M9 5.5 15.5 12 9 18.5" /></Svg>
);
export const ChevronLeft = ({ size = 16 }) => (
  <Svg size={size}><path {...base} d="M15 5.5 8.5 12 15 18.5" /></Svg>
);

// Group key → icon. Matches GROUPS keys in data/daily.js.
export const GROUP_ICONS = {
  mind: MindIcon,
  body: BodyIcon,
  home: HomeIcon,
  growth: GrowthIcon,
  rel: RelIcon,
  heart: HeartIcon,
};

export function GroupIcon({ k, size = 20, color }) {
  const I = GROUP_ICONS[k] || MindIcon;
  return <span style={{ display: "inline-flex", color: color || "inherit", flexShrink: 0 }}><I size={size} /></span>;
}
