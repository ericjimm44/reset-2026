import { useState } from "react";
import { C } from "../lib/theme";
import { PATH, PATH_FLAT, TOTAL_WEEKS, SCORE, LISTEN } from "../data/path";
import { dayKey } from "../lib/dates";
import { fullPathText, weekText, downloadText } from "../lib/curriculum";
import { Check, SecHead, Scale } from "./ui";

/*
  The path measures SEQUENCE, not schedule. There are deliberately no week
  dates and no "the calendar says you should be on week N" nudge: a calendar
  is the thing that manufactures "behind," and this path was always meant to
  run at the pace Jimmy can absorb. It advances when he advances it.
*/
export default function Path({ data, now, actions, onNav }) {
  const [overview, setOverview] = useState(false);
  const [scoreOpen, setScoreOpen] = useState(false);
  const [copied, setCopied] = useState(null);
  const [showText, setShowText] = useState(false);
  const { setPathWeek, togglePathProject, togglePathMilestone, setPathNotes, setPathScore } = actions;

  const pw = data.settings?.pathWeek || 1;
  const idx = Math.max(0, PATH_FLAT.findIndex((w) => w.n === pw));
  const wk = PATH_FLAT[idx] || PATH_FLAT[0];
  const prog = data.pathProgress?.[wk.n] || { projects: {}, milestone: false, notes: "" };
  const prev = PATH_FLAT[idx - 1];
  const next = PATH_FLAT[idx + 1];

  const book = wk.wbook || wk.book;

  const flash = (msg) => { setCopied(msg); setTimeout(() => setCopied(null), 2000); };
  const copy = (text, msg) => {
    const p = navigator.clipboard?.writeText(text);
    if (p?.catch) p.catch(() => flash("Couldn't reach the clipboard — use Download instead."));
    flash(msg);
  };

  const ym = dayKey(now).slice(0, 7);
  const scores = data.pathScores?.[ym] || {};
  const scored = SCORE.filter(([k]) => typeof scores[k] === "number");
  const avg = scored.length ? scored.reduce((s, [k]) => s + scores[k], 0) / scored.length : null;

  return (
    <>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", margin: "16px 0 10px" }}>
        <button className="r26-nav" onClick={() => prev && setPathWeek(prev.n)} disabled={!prev} style={{ opacity: prev ? 1 : 0.25 }}>‹</button>
        <div style={{ textAlign: "center" }}>
          <div className="r26-eyebrow">Week {wk.n} of {TOTAL_WEEKS} · at your pace</div>
          <div style={{ fontFamily: "var(--serif)", fontSize: 18, color: C.ink, marginTop: 2 }}>{wk.theme}</div>
          {book && <div style={{ fontSize: 12.5, color: C.mossDeep, marginTop: 3 }}>{book}</div>}
        </div>
        <button className="r26-nav" onClick={() => next && setPathWeek(next.n)} disabled={!next} style={{ opacity: next ? 1 : 0.25 }}>›</button>
      </div>

      <div style={{ textAlign: "center", marginBottom: 10 }}>
        <button className="r26-link" onClick={() => onNav?.("behind")}>Feeling behind?</button>
      </div>

      <section className="r26-card">
        <div className="r26-grouphead">{wk.focus}</div>
        {wk.read && (
          <div style={{ fontSize: 13.5, color: C.ink, marginBottom: 10 }}>
            <span style={{ color: C.faint }}>Read · </span>{wk.read}
          </div>
        )}

        {LISTEN[wk.n] && (
          <div style={{ marginBottom: 12, padding: "10px 12px", background: C.washi, borderRadius: 10 }}>
            <div className="r26-eyebrow" style={{ marginBottom: 4, color: C.indigo }}>Listen this week</div>
            <div style={{ fontSize: 13.5, color: C.ink }}>{LISTEN[wk.n].who}</div>
            <div style={{ fontSize: 13, color: C.sub, marginTop: 2 }}>{LISTEN[wk.n].topic}</div>
            {/* live search links — episode URLs rot, searches don't */}
            <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
              <a className="r26-listenlink" target="_blank" rel="noopener noreferrer"
                href={`https://www.youtube.com/results?search_query=${encodeURIComponent(LISTEN[wk.n].search)}`}>
                ▶ YouTube
              </a>
              <a className="r26-listenlink" target="_blank" rel="noopener noreferrer"
                href={`https://open.spotify.com/search/${encodeURIComponent(LISTEN[wk.n].search)}`}>
                ♫ Spotify
              </a>
            </div>
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

        <div style={{ display: "flex", justifyContent: "center", marginTop: 12 }}>
          <button className="r26-link" onClick={() => copy(weekText(wk, prog), "This week copied.")}>
            Copy this week
          </button>
        </div>

        {next && (
          <button className="r26-return" style={{ marginTop: 10 }} onClick={() => setPathWeek(next.n)}>
            Move to Week {next.n} →
          </button>
        )}
      </section>

      {/* Take the whole thing with you — your checkmarks and notes included. */}
      <section className="r26-card">
        <div className="r26-grouphead">Your curriculum</div>
        <p style={{ fontSize: 12.5, color: C.sub, marginTop: 0 }}>
          All {TOTAL_WEEKS} weeks as plain text, with everything you&rsquo;ve checked off and written.
        </p>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button className="r26-mini"
            onClick={() => copy(fullPathText(data.pathProgress, wk.n), "Whole path copied.")}>
            Copy the whole path
          </button>
          <button className="r26-mini"
            onClick={() => { downloadText("2026-reset-path.txt", fullPathText(data.pathProgress, wk.n)); flash("Downloaded."); }}>
            Download
          </button>
          <button className="r26-link" onClick={() => setShowText((s) => !s)}>
            {showText ? "Hide text" : "Show as text"}
          </button>
        </div>
        {copied && <p style={{ fontSize: 12.5, color: C.mossDeep, margin: "10px 0 0" }}>{copied}</p>}
        {/* Always-works fallback: clipboard and downloads are both flaky on phones. */}
        {showText && (
          <textarea className="r26-text" readOnly rows={10} style={{ marginTop: 10, fontSize: 11, fontFamily: "monospace" }}
            onFocus={(e) => e.target.select()}
            value={fullPathText(data.pathProgress, wk.n)} />
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
                  <span style={{ fontSize: 13, color: C.mossDeep, fontFamily: "var(--serif)" }}>{scores[k] || "–"}</span>
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
