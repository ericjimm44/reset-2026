// The reset window. Daily engine runs Jul 10 - Dec 31 2026.
// The reading path runs longer (40 weeks, into Apr 2027) — that's intentional.
export const START = new Date(2026, 6, 10);
export const END = new Date(2026, 11, 31);

export const dayKey = (d) => {
  const x = new Date(d);
  return `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, "0")}-${String(
    x.getDate()
  ).padStart(2, "0")}`;
};

// Calendar-day difference — ignores time of day, so "Day 1" stays Day 1 all day.
export const daysBetween = (a, b) => {
  const s = new Date(a);
  s.setHours(0, 0, 0, 0);
  const e = new Date(b);
  e.setHours(0, 0, 0, 0);
  return Math.round((e - s) / 86400000);
};

export const addDays = (d, n) => {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
};

export const emptyDay = () => ({
  checks: {},
  gratitude: ["", "", ""],
  reflection: {},
  hasKids: true,
  ratings: {},
  onePercent: null,
  closed: false,
});

export const normDay = (d) => ({
  ...emptyDay(),
  ...(d || {}),
  checks: { ...((d && d.checks) || {}) },
  gratitude: [...((d && d.gratitude) || ["", "", ""])],
  reflection: { ...((d && d.reflection) || {}) },
  ratings: { ...((d && d.ratings) || {}) },
});
