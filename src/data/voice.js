// The app's voice. Calm, plain, non-judgmental — never a coach yelling.
// All copy that isn't a task or a goal lives here.

// What the ensō says beneath itself as it fills.
export const ensoCaption = (pct, sealed) => {
  if (sealed) return "Day sealed.";
  if (pct >= 1) return "Day complete.";
  if (pct >= 0.7) return "Keep going.";
  if (pct > 0) return "You're showing up.";
  return "A new beginning.";
};

// Gentle notes for the Guidance moment. One per day, rotating by day number —
// deterministic so it doesn't change if you reopen the app.
export const GUIDANCE = [
  "You don't need to have it all figured out. You just need to be honest today.",
  "Every checked box is evidence that you're moving forward.",
  "You stop abandoning yourself trying to hold onto love.",
  "The day doesn't have to be perfect to count. It has to be yours.",
  "Anxiety tells a story about tomorrow. The list only asks about now.",
  "Small, done, and honest beats big, planned, and imagined.",
  "You are allowed to have a hard day and still be moving forward.",
  "Consistency is quietly changing your life.",
  "Nothing needs to be solved tonight. One box, then rest.",
  "The circle doesn't need to be perfect. It needs to be drawn.",
];

export const guidanceFor = (dayNum) => GUIDANCE[((dayNum - 1) % GUIDANCE.length + GUIDANCE.length) % GUIDANCE.length];

// The Why This moment. Icon keys match Icons.jsx.
export const WHYS = [
  { icon: "rel", text: "Be a better father" },
  { icon: "mind", text: "Heal emotionally" },
  { icon: "body", text: "Build a strong body" },
  { icon: "growth", text: "Grow every day" },
  { icon: "heart", text: "Love well" },
];

// Closing lines. The hub shows one; Trends closes with the consistency line.
export const MANTRA = "Every checked box is evidence that you're moving forward.";
export const TRENDS_LINE = "Consistency is quietly changing your life.";

// The seal ceremony.
export const SEAL_STEPS = {
  invite: "Reflect. Seal. Rest.",
  sealedTitle: "Day sealed.",
  sealedNote: "What did I do today that future me will be grateful for?",
};
