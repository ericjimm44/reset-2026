import { useState } from "react";
import { C } from "../lib/theme";
import { GROUPS, REFLECT, RATINGS, SEAL_Q, visibleItems } from "../data/daily";
import { Check, SecHead, Scale, Ring } from "./ui";

export default function Today({ today, actions, streak, nextMile, strip }) {
  const [focus, setFocus] = useState(true);
  const [open, setOpen] = useState({});
  const [sec, setSec] = useState({ reflect: false, ratings: false, done: false });

  const { toggleCheck, setGrat, setRefl, setHasKids, setRating, setPct, closeDay, reopenDay } = actions;

  const items = visibleItems(today.hasKids);
  const remaining = items.filter((i) => !today.checks[i.id]);
  const completed = items.filter((i) => today.checks[i.id]);
  const left = remaining.length;
  const pct = items.length ? completed.length / items.length : 0;
  const nextBox = remaining[0];

  const renderItem = (it) => {
    const checked = !!today.checks[it.id];
    const isOpen = !!open[it.id];
    return (
      <div key={it.id} className="r26-coreitem">
        <div style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "11px 0" }}>
          <button className="r26-box" onClick={() => toggleCheck(it.id)}
            style={{ background: checked ? C.moss : "transparent", borderColor: checked ? C.moss : C.line, marginTop: 1 }}>
            {checked && <Check />}
          </button>
          <button style={{ flex: 1, textAlign: "left", background: "none", border: "none", cursor: "pointer", padding: 0, fontFamily: "inherit" }}
            onClick={() => (it.kind === "gratitude" ? setOpen((o) => ({ ...o, [it.id]: !o[it.id] })) : toggleCheck(it.id))}>
            <span style={{ fontSize: 14.5, color: checked ? C.faint : C.ink, textDecoration: checked ? "line-through" : "none", textDecorationColor: C.line }}>{it.text}</span>
            {it.note && <span style={{ display: "block", fontSize: 11.5, color: C.faint, marginTop: 1 }}>{it.note}</span>}
          </button>
          {it.group && <span className="r26-tag">{it.group}</span>}
          {it.kind === "gratitude" && (
            <button onClick={() => setOpen((o) => ({ ...o, [it.id]: !o[it.id] }))}
              style={{ background: "none", border: "none", color: C.faint, fontSize: 13, cursor: "pointer", transform: isOpen ? "rotate(90deg)" : "none", transition: "transform .2s", padding: "0 2px" }}>›</button>
          )}
        </div>
        {isOpen && it.kind === "gratitude" && (
          <div className="r26-grat">
            {[0, 1, 2].map((i) => (
              <input key={i} className="r26-input" placeholder="Grateful for…" value={today.gratitude[i] || ""} onChange={(e) => setGrat(i, e.target.value)} />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <div style={{ display: "flex", justifyContent: "center", margin: "14px 0 6px" }}>
        <Ring pct={today.closed ? 1 : pct} closed={today.closed} streak={streak} />
      </div>
      <div style={{ textAlign: "center", marginBottom: 4 }}>
        <span className="r26-headline">
          {today.closed ? "Today is sealed" : left === 0 ? "Every box checked" : `${left} ${left === 1 ? "box" : "boxes"} left today`}
        </span>
      </div>
      {nextMile && streak > 0 && (
        <div style={{ textAlign: "center", marginTop: 2 }}>
          <span style={{ fontSize: 12, color: C.mossDeep }}>
            {nextMile - streak} {nextMile - streak === 1 ? "day" : "days"} to a {nextMile}-day streak
          </span>
        </div>
      )}
      <div className="r26-strip">
        {strip.map((s, i) => (
          <span key={i} style={{ width: 9, height: 9, borderRadius: 9, border: `1.5px solid ${s.isToday ? C.ink : C.line}`, background: s.closed ? (s.yes ? C.moss : C.indigo) : "transparent" }} />
        ))}
      </div>

      {/* The One Rule — the anti-overwhelm device. Never remove this. */}
      {!today.closed && nextBox && (
        <div className="r26-rule">
          <div className="r26-eyebrow" style={{ color: C.indigo }}>The one rule</div>
          <div style={{ fontSize: 13.5, color: C.sub, margin: "6px 0 10px", lineHeight: 1.5 }}>
            Don&rsquo;t try to solve your entire life. Just ask: what&rsquo;s the next box I can check?
          </div>
          <button className="r26-nextbox" onClick={() => toggleCheck(nextBox.id)}>
            <span className="r26-box" style={{ borderColor: C.indigo }} />
            <span style={{ flex: 1, textAlign: "left", fontSize: 14.5, color: C.ink }}>{nextBox.text}</span>
          </button>
        </div>
      )}

      <div className="r26-kids">
        <span style={{ fontSize: 12.5, color: C.sub }}>Do you have Ana &amp; Adriel today?</span>
        <span style={{ display: "flex", gap: 6 }}>
          {[["Yes", true], ["No", false]].map(([l, v]) => (
            <button key={l} onClick={() => setHasKids(v)} className="r26-toggle"
              style={{ background: today.hasKids === v ? C.ink : "transparent", color: today.hasKids === v ? C.washi : C.sub, borderColor: today.hasKids === v ? C.ink : C.line }}>{l}</button>
          ))}
        </span>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", margin: "4px 0 8px" }}>
        <span className="r26-eyebrow">Today&rsquo;s list</span>
        <button className="r26-link" onClick={() => setFocus((f) => !f)}>
          {focus ? "Show everything" : "Focus on what's left"}
        </button>
      </div>

      <section className="r26-card">
        {focus ? (
          remaining.length === 0 ? (
            <div style={{ textAlign: "center", padding: "14px 6px" }}>
              <div style={{ fontSize: 15, color: C.mossDeep, marginBottom: 4 }}>Every box checked.</div>
              <div style={{ fontSize: 13, color: C.sub }}>That&rsquo;s the evidence. Close it out below.</div>
            </div>
          ) : (
            remaining.map(renderItem)
          )
        ) : (
          GROUPS.map((g) => {
            const gi = g.items.filter((i) => i.withKids === undefined || i.withKids === today.hasKids);
            return (
              <div key={g.key} style={{ marginBottom: 10 }}>
                <div className="r26-grouphead" style={{ marginTop: 6 }}>{g.label}</div>
                {gi.map(renderItem)}
              </div>
            );
          })
        )}
      </section>

      {focus && completed.length > 0 && (
        <section className="r26-card">
          <SecHead label="Done today" count={completed.length} open={sec.done} onClick={() => setSec((s) => ({ ...s, done: !s.done }))} />
          {sec.done && <div style={{ marginTop: 6 }}>{completed.map(renderItem)}</div>}
        </section>
      )}

      <section className="r26-card">
        <SecHead label="Evening reflection" open={sec.reflect} onClick={() => setSec((s) => ({ ...s, reflect: !s.reflect }))} />
        {sec.reflect && (
          <div style={{ marginTop: 12 }}>
            {REFLECT.map(([k, label]) => (
              <div key={k} style={{ marginBottom: 10 }}>
                <label className="r26-reflabel">{label}</label>
                <textarea className="r26-text" rows={2} value={today.reflection[k] || ""} onChange={(e) => setRefl(k, e.target.value)} />
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="r26-card">
        <SecHead label="How was today? · 1–10" open={sec.ratings} onClick={() => setSec((s) => ({ ...s, ratings: !s.ratings }))} />
        {sec.ratings && (
          <div style={{ marginTop: 12 }}>
            {RATINGS.map(([k, label]) => (
              <div key={k} style={{ marginBottom: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                  <span style={{ fontSize: 13, color: C.ink }}>
                    {label}
                    {k === "anxiety" && <span style={{ color: C.faint }}> · lower is better</span>}
                  </span>
                  <span style={{ fontSize: 13, color: C.mossDeep, fontFamily: "Georgia,serif" }}>{today.ratings[k] || "–"}</span>
                </div>
                <Scale value={today.ratings[k]} onSet={(n) => setRating(k, n)} invert={k === "anxiety"} />
              </div>
            ))}
            <div style={{ fontSize: 11.5, color: C.faint, marginTop: 4 }}>
              Optional. These feed Trends — watch the weekly line, not the daily number.
            </div>
          </div>
        )}
      </section>

      {/* Sealing requires answering the question — but "Not today" still seals.
          Honesty counts as showing up. Never gate the streak on a perfect list. */}
      <section className="r26-card">
        <div className="r26-question" style={{ marginTop: 4 }}>
          <em>&ldquo;{SEAL_Q}&rdquo;</em>
          <div className="r26-yesno">
            {["yes", "no"].map((v) => (
              <button key={v} onClick={() => setPct(v)} className="r26-pick"
                style={{ background: today.onePercent === v ? (v === "yes" ? C.moss : C.card) : "transparent", color: today.onePercent === v && v === "yes" ? "#fff" : C.ink, borderColor: today.onePercent === v ? (v === "yes" ? C.moss : C.ink) : C.line }}>
                {v === "yes" ? "Yes" : "Not today"}
              </button>
            ))}
          </div>
        </div>
        {today.closed ? (
          <button className="r26-seal r26-sealed" onClick={reopenDay}>Today is sealed · tap to reopen</button>
        ) : (
          <button className="r26-seal" onClick={closeDay} disabled={!today.onePercent} style={{ opacity: today.onePercent ? 1 : 0.4 }}>Seal today</button>
        )}
      </section>

      <p className="r26-mantra">Every checked box is evidence that you&rsquo;re moving forward.</p>
    </>
  );
}
