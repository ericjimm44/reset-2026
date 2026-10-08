// Turning the path into plain text you can keep, print, or paste anywhere.
// Includes your own progress and notes when you have them — it's your
// curriculum, not a brochure.
import { PATH, PATH_FLAT, TOTAL_WEEKS, LISTEN } from "../data/path";

const line = (s = "") => s;

function weekLines(w, prog) {
  const out = [];
  out.push(`WEEK ${w.n} · ${w.focus}`);
  if (w.read) out.push(`  Read: ${w.read}`);

  const L = LISTEN[w.n];
  if (L) {
    out.push(`  Listen: ${L.who} — ${L.topic}`);
    out.push(`    search: "${L.search}"`);
  }

  if (w.learn?.length) {
    out.push("  Learn:");
    w.learn.forEach((l) => out.push(`    · ${l}`));
  }

  if (w.projects?.length) {
    out.push("  Projects:");
    w.projects.forEach((p, i) => {
      const done = prog?.projects?.[i] ? "x" : " ";
      out.push(`    [${done}] ${p}`);
    });
  }

  if (w.note) out.push(`  Note: ${w.note}`);

  out.push(`  Milestone: ${prog?.milestone ? "[x] " : "[ ] "}${w.milestone}`);

  if (w.mistakes?.length) {
    out.push("  Mistakes to avoid:");
    w.mistakes.forEach((m) => out.push(`    × ${m}`));
  }

  if (w.reflect?.length) {
    out.push("  Reflect:");
    w.reflect.forEach((q) => out.push(`    ? ${q}`));
  }

  const notes = prog?.notes?.trim();
  if (notes) {
    out.push("  My notes:");
    notes.split("\n").forEach((n) => out.push(`    ${n}`));
  }

  return out;
}

// One week, on its own.
export function weekText(w, prog) {
  return weekLines(w, prog).join("\n");
}

// The whole 40 weeks, grouped by book.
export function fullPathText(pathProgress = {}, currentWeek = null) {
  const out = [
    "JIMMY'S 2026 RESET — THE PATH",
    `${TOTAL_WEEKS} weeks · ${PATH.length} books · at your pace`,
    "",
  ];

  PATH.forEach((m) => {
    out.push("─".repeat(52));
    out.push(`${m.month.toUpperCase()} — ${m.theme}`);
    if (m.book) out.push(`Book: ${m.book}`);
    out.push("─".repeat(52));
    out.push("");

    m.weeks.forEach((w) => {
      if (currentWeek && w.n === currentWeek) out.push("  ← you are here");
      out.push(...weekLines(w, pathProgress[w.n]));
      out.push("");
    });
  });

  out.push(line());
  out.push("The path waits. It moves when you move.");
  return out.join("\n");
}

// Count of weeks you've actually touched — milestone, a project, or notes.
export function weeksEngaged(pathProgress = {}) {
  return Object.values(pathProgress).filter(
    (p) => p?.milestone || Object.values(p?.projects || {}).some(Boolean) || p?.notes?.trim()
  ).length;
}

export { PATH_FLAT, TOTAL_WEEKS };

// Hand the text to the browser as a file. Falls back silently if blocked.
export function downloadText(filename, text) {
  try {
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    return true;
  } catch {
    return false;
  }
}
