import { useState } from "react";
import { C } from "../lib/theme";
import { PATH, PATH_FLAT, TOTAL_WEEKS, SCORE } from "../data/path";
import { START, addDays, daysBetween, dayKey } from "../lib/dates";
import { Check, SecHead, Scale } from "./ui";

export default function Path({ data, now, actions }) {
  const [overview, setOverview] = useState(false);
  const [scoreOpen, setScoreOpen] = useState(false);
  const { setPathWeek, togglePathProject, togglePathMilestone, setPathNotes, setPathScore } = actions;

  const pw = data.settings?.pathWeek || 1;
  const idx = Math.max(0, PATH_FLAT.findIndex((w) => w.n === pw));
  const wk = PATH_FLAT[idx] || PATH_FLAT[0];
  const prog = data.pathProgress?.[wk.n] || { projects: {}, milestone: false, notes: "" };
  const prev = PATH_FLAT[idx - 1];
  const next = PATH_FLAT[idx + 1];

  const wkStart = addDays(START, (wk.n - 1) * 7);
  const wkEnd = addDays(wkStart, 6);
  const fmt = (d) => d.toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric" });
  const calWeek = Math.min(TOTAL_WEEKS, Math.max(1, Math.floor(daysBetween(START, now) / 7) + 1));
  const book = wk.wbook || wk.book;

  const ym = dayKey(now).slice(0, 7);
  const scores = data.pathScores?.[ym] || {};
  const scored = SCORE.filter(([k]) => typeof scores[k] === "number");
  const avg = scored.length ? scored.reduce((s, [k]) => s + scores[k], 0) / scored.length : null;

  return (
    <>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", margin: "16px 0 10px" }}>
        <button className="r26-nav" onClick={() => prev && setPathWeek(prev.n)} disabled={!prev} style={{ opacity: prev ? 1 : 0.25 }}>‹</button>
        <div style={{ textAlign: "center" }}>
          <div className="r26-eyebrow">Week {wk.n} of {TOTAL_WEEKS} · {wk.month}</div>
          <div style={{ fontFamily: "Georgia,serif", fontSize: 18, color: C.ink, marginTop: 2 }}>{wk.theme}</div>
          <div style={{ fontSize: 11.5, color: C.faint, marginTop: 3 }}>{fmt(wkStart)} – {fmt(wkEnd)}</div>
          {book && <div style={{ fontSize: 12.5, color: C.mossDeep, marginTop: 3 }}>{book}</div>}
        </div>
        <button className="r26-nav" onClick={() => next && setPathWeek(next.n)} disabled={!next} style={{ opacity: next ? 1 : 0.25 }}>›</button>
      </div>

      {wk.n !== calWeek && (
        <div style={{ textAlign: "center", marginBottom: 10 }}>
          <button className="r26-link" onClick={() => setPathWeek(calWeek)}>
            This calendar week is Week {calWeek} · jump there
          </button>
        </div>
      )}

      <section className="r26-card">
        <div className="r26-grouphead">{wk.focus}</div>
        {wk.read && (
          <div style={{ fontSize: 13.5, color: C.ink, marginBottom: 10 }}>
            <span style={{ color: C.faint }}>Read · </span>{wk.read}
          </div>
        )}

        {wk.learn?.length > 0 && (
          <div style={{ marginBottom: 12 }}>
            <div className="r26-eyebrow" style={{ marginBottom: 6 }}>Learn</div>
            {wk.learn.map((l, i) => (
              <div key={i} style={{ fontSize: 13.5, color: C.sub, padding: "3px 0" }}>· {l}</div>
            ))}
          </div>
        )}

        {wk.projects?.length > 0 && (
          <div style={{ marginBottom: 6 }}>
            <div className="r26-eyebrow" style={{ marginBottom: 4 }}>Projects</div>
            {wk.projects.map((p, i) => {
              const done = !!prog.projects?.[i];
              return (
                <button key={i} className="r26-row" onClick={() => togglePathProject(wk.n, i)}>
                  <span className="r26-box" style={{ background: done ? C.moss : "transparent", borderColor: done ? C.moss : C.line }}>
                    {done && <Check />}
                  </span>
                  <span style={{ flex: 1, textAlign: "left", fontSize: 14, color: done ? C.faint : C.ink, textDecoration: done ? "line-through" : "none", textDecorationColor: C.line }}>{p}</span>
                </button>
              );
            })}
          </div>
        )}

        {wk.note && <div style={{ fontSize: 12.5, color: C.mossDeep, fontStyle: "italic", padding: "8px 0" }}>{wk.note}</div>}

        <div style={{ marginTop: 8, padding: 12, background: C.washi, borderRadius: 10 }}>
          <button className="r26-row" style={{ borderBottom: "none", padding: 0 }} onClick={() => togglePathMilestone(wk.n)}>
            <span className="r26-box" style={{ background: prog.milestone ? C.indigo : "transparent", borderColor: prog.milestone ? C.indigo : C.line }}>
              {prog.milestone && <Check />}
            </span>
            <span style={{ flex: 1, textAlign: "left" }}>
              <span className="r26-eyebrow" style={{ color: C.indigo }}>Milestone</span>
              <span style={{ display: "block", fontSize: 14, color: C.ink, marginTop: 2 }}>{wk.milestone}</span>
            </span>
          </button>
        </div>

        {/* Every week has these. They name the specific trap of that week's material. */}
        {wk.mistakes?.length > 0 && (
          <div style={{ marginTop: 12 }}>
            <div className="r26-eyebrow" style={{ marginBottom: 4, color: C.seal }}>Mistakes to avoid</div>
            {wk.mistakes.map((m, i) => (
              <div key={i} style={{ fontSize: 13, color: C.sub, padding: "2px 0" }}>× {m}</div>
            ))}
          </div>
        )}

        {wk.reflect?.length > 0 && (
          <div style={{ marginTop: 12 }}>
            <div className="r26-eyebrow" style={{ marginBottom: 4 }}>Reflect</div>
            {wk.reflect.map((q, i) => (
              <div key={i} style={{ fontSize: 13, color: C.sub, fontStyle: "italic", padding: "2px 0" }}>{q}</div>
            ))}
          </div>
        )}

        <div style={{ marginTop: 12 }}>
          <label className="r26-reflabel">This week&rsquo;s notes</label>
          <textarea className="r26-text" rows={3} value={prog.notes || ""} onChange={(e) => setPathNotes(wk.n, e.target.value)} />
        </div>

        {next && (
          <button className="r26-seal" style={{ marginTop: 14 }} onClick={() => setPathWeek(next.n)}>
            Move to Week {next.n} →
          </button>
        )}
      </section>

      <section className="r26-card">
        <SecHead label="The full path" open={overview} onClick={() => setOverview((o) => !o)} />
        {overview && (
          <div style={{ marginTop: 10 }}>
            {PATH.map((m) => (
              <div key={m.month} style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 12.5, color: C.mossDeep }}>
                  {m.month} · {m.theme}
                  {m.book && <span style={{ color: C.faint }}> — {m.book}</span>}
                </div>
                {m.weeks.map((w) => (
                  <button key={w.n} onClick={() => setPathWeek(w.n)}
                    style={{ display: "flex", width: "100%", gap: 8, alignItems: "center", background: "none", border: "none", cursor: "pointer", padding: "6px 0", fontFamily: "inherit", borderBottom: `1px solid ${C.washi}` }}>
                    <span style={{ width: 24, fontSize: 11, color: w.n === wk.n ? C.ink : C.faint }}>{w.n}</span>
                    <span style={{ flex: 1, textAlign: "left", fontSize: 13, color: w.n === wk.n ? C.ink : C.sub, fontWeight: w.n === wk.n ? 600 : 400 }}>{w.focus}</span>
                    {w.n === wk.n && <span style={{ fontSize: 10, color: C.moss, letterSpacing: 1 }}>NOW</span>}
                  </button>
                ))}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Monthly 10-point scorecard — deliberately separate from the daily 6.
          Rating 10 things every night is friction that kills consistency. */}
      <section className="r26-card">
        <SecHead label={`Monthly scorecard · ${now.toLocaleString("en-US", { month: "long" })}`} count={avg != null ? avg.toFixed(1) : null} open={scoreOpen} onClick={() => setScoreOpen((o) => !o)} />
        {scoreOpen && (
          <div style={{ marginTop: 12 }}>
            <div style={{ fontSize: 12, color: C.faint, marginBottom: 12 }}>
              Rate yourself once a month. Watch the shift month to month, not day to day.
            </div>
            {SCORE.map(([k, label, inv]) => (
              <div key={k} style={{ marginBottom: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                  <span style={{ fontSize: 13, color: C.ink }}>
                    {label}
                    {inv && <span style={{ color: C.faint }}> · lower is better</span>}
                  </span>
                  <span style={{ fontSize: 13, color: C.mossDeep, fontFamily: "Georgia,serif" }}>{scores[k] || "–"}</span>
                </div>
                <Scale value={scores[k]} onSet={(n) => setPathScore(ym, k, n)} invert={inv} />
              </div>
            ))}
          </div>
        )}
      </section>

      <p className="r26-mantra">You stop abandoning yourself trying to hold onto love.</p>
    </>
  );
}
