// Real localStorage — no shim. Persists across sessions on this device.
const KEY = "reset2026-v2";

export const emptyState = () => ({
  days: {},
  yearGoals: {},
  months: {},
  logs: { books: [], recipes: [], concepts: [] },
  pathProgress: {},
  pathScores: {},
  settings: { workoutTarget: 4, pathWeek: 1 },
});

export function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return emptyState();
    const p = JSON.parse(raw);
    const base = emptyState();
    return {
      ...base,
      ...p,
      logs: { ...base.logs, ...(p.logs || {}) },
      pathProgress: { ...(p.pathProgress || {}) },
      pathScores: { ...(p.pathScores || {}) },
      settings: { ...base.settings, ...(p.settings || {}) },
    };
  } catch {
    return emptyState();
  }
}

export function save(state) {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
    return true;
  } catch {
    return false;
  }
}

export const exportData = (state) => JSON.stringify(state);

export function importData(text) {
  const p = JSON.parse(text);
  return { ...emptyState(), ...p };
}
