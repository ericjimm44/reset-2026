import { useState } from "react";
import { C } from "../lib/theme";
import { TRACKERS } from "../data/goals";

// Logging here auto-completes the matching 2026 milestones. No manual tallying.
export default function Log({ logs, today, actions }) {
  const [drafts, setDrafts] = useState({ books: "", recipes: "", concepts: "" });
  const { addLog, removeLog } = actions;

  const submit = (key) => {
    const name = (drafts[key] || "").trim();
    if (!name) return;
    addLog(key, name, today);
    setDrafts((s) => ({ ...s, [key]: "" }));
  };

  return (
    <>
      <p style={{ fontSize: 13.5, color: C.sub, textAlign: "center", margin: "14px 0 4px" }}>
        Log what you finish. The counters and your 2026 milestones fill themselves.
      </p>
      {TRACKERS.map((t) => {
        const entries = logs[t.key] || [];
        const n = entries.length;
        return (
          <section key={t.key} className="r26-card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
              <div className="r26-grouphead" style={{ marginBottom: 0 }}>{t.label}</div>
              <span style={{ fontFamily: "Georgia,serif", fontSize: 18, color: C.ink }}>
                {n}<span style={{ fontSize: 12, color: C.faint }}> / {t.target}</span>
              </span>
            </div>
            <div className="r26-bar">
              <div style={{ width: `${Math.min(n / t.target, 1) * 100}%`, height: "100%", background: n >= t.target ? C.moss : C.indigo, transition: "width .4s" }} />
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
              <input className="r26-input" style={{ flex: 1 }} placeholder={t.ph} value={drafts[t.key]}
                onChange={(e) => setDrafts((s) => ({ ...s, [t.key]: e.target.value }))}
                onKeyDown={(e) => e.key === "Enter" && submit(t.key)} />
              <button className="r26-mini" onClick={() => submit(t.key)}>Add</button>
            </div>
            {entries.length > 0 && (
              <div style={{ marginTop: 10 }}>
                {entries.map((e, i) => (
                  <div key={i} className="r26-logrow">
                    <span style={{ flex: 1, fontSize: 13.5 }}>{e.name}</span>
                    <span style={{ fontSize: 11, color: C.faint, marginRight: 8 }}>{e.date.slice(5)}</span>
                    <button className="r26-x" onClick={() => removeLog(t.key, i)}>×</button>
                  </div>
                ))}
              </div>
            )}
          </section>
        );
      })}
    </>
  );
}
