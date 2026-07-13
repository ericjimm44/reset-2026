import { useState } from "react";
import { C } from "../../lib/theme";
import { GROUPS } from "../../data/daily";
import { Check, Screen, SecHead } from "../ui";
import { GroupIcon } from "../Icons";

/*
  The full checklist — but still focus-mode at heart: checking a box makes
  it disappear. What's done today waits quietly in a collapsed section
  below, so the list only ever shows what's LEFT.
*/
export default function List({ today, actions, onBack }) {
  const [gratOpen, setGratOpen] = useState(false);
  const [doneOpen, setDoneOpen] = useState(false);
  const { toggleCheck, setGrat, setHasKids } = actions;

  const forToday = (items) => items.filter((i) => i.withKids === undefined || i.withKids === today.hasKids);
  const doneItems = GROUPS.flatMap((g) => forToday(g.items).filter((i) => today.checks[i.id]).map((i) => ({ ...i, gkey: g.key, glabel: g.label })));
  const anythingLeft = GROUPS.some((g) => forToday(g.items).some((i) => !today.checks[i.id]));

  return (
    <Screen title="Today's List" sub="Keep it simple." onBack={onBack}>
      {/* which relationship item exists today */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "4px 2px 14px" }}>
        <span style={{ fontSize: 13, color: C.sub }}>Do you have Ana &amp; Adriel today?</span>
        <span style={{ display: "flex", gap: 6 }}>
          {[["Yes", true], ["No", false]].map(([l, v]) => (
            <button key={l} onClick={() => setHasKids(v)}
              className={`r26-toggle${today.hasKids === v ? " on" : ""}`}>{l}</button>
          ))}
        </span>
      </div>

      <div className="r26-card" style={{ padding: "8px 18px" }}>
        {!anythingLeft ? (
          <div style={{ textAlign: "center", padding: "22px 8px" }}>
            <div className="r26-serif" style={{ fontSize: 16, color: C.mossDeep }}>Every box checked.</div>
            <div style={{ fontSize: 13, color: C.sub, marginTop: 4 }}>That&rsquo;s the evidence. Seal it from Today.</div>
          </div>
        ) : (
          GROUPS.map((g) => {
            const items = forToday(g.items).filter((i) => !today.checks[i.id]);
            if (items.length === 0) return null;
            return (
              <div key={g.key} style={{ padding: "10px 0", borderBottom: "1px solid rgba(216,210,196,0.4)" }} className="r26-group">
                {items.map((it, ii) => {
                  const isGrat = it.kind === "gratitude";
                  return (
                    <div key={it.id}>
                      <div style={{ display: "flex", alignItems: "center", gap: 13, minHeight: 52 }}>
                        {ii === 0
                          ? <GroupIcon k={g.key} size={20} color={C.mossDeep} />
                          : <span style={{ width: 20, flexShrink: 0 }} />}
                        <button
                          onClick={() => (isGrat ? setGratOpen((o) => !o) : toggleCheck(it.id))}
                          style={{ flex: 1, textAlign: "left", background: "none", border: "none", cursor: "pointer", padding: "8px 0" }}>
                          <span style={{ display: "block", fontSize: 11, letterSpacing: 1, textTransform: "uppercase", color: C.faint }}>
                            {ii === 0 ? g.label : " "}
                          </span>
                          <span style={{ fontSize: 14.5, color: C.ink }}>
                            {it.text}
                            {it.note && <span style={{ color: C.faint }}> · {it.note}</span>}
                          </span>
                        </button>
                        <button className="r26-box" onClick={() => toggleCheck(it.id)}
                          style={{ borderRadius: 12 }} aria-label={`Check ${it.text}`} />
                      </div>
                      {isGrat && gratOpen && (
                        <div className="r26-grat" style={{ paddingLeft: 33 }}>
                          {[0, 1, 2].map((i) => (
                            <input key={i} className="r26-input" placeholder="Grateful for…"
                              value={today.gratitude[i] || ""} onChange={(e) => setGrat(i, e.target.value)} />
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })
        )}
      </div>

      {/* what's already done waits here, quietly */}
      {doneItems.length > 0 && (
        <div className="r26-card" style={{ padding: "8px 18px" }}>
          <SecHead label="Done today" count={doneItems.length} open={doneOpen} onClick={() => setDoneOpen((o) => !o)} />
          {doneOpen && (
            <div style={{ paddingTop: 4 }}>
              {doneItems.map((it) => (
                <div key={it.id} style={{ display: "flex", alignItems: "center", gap: 13, minHeight: 48 }}>
                  <GroupIcon k={it.gkey} size={18} color={C.faint} />
                  <span style={{ flex: 1, fontSize: 14, color: C.faint }}>{it.text}</span>
                  <button className="r26-box" onClick={() => toggleCheck(it.id)}
                    style={{ borderRadius: 12, background: C.moss, borderColor: C.moss }} aria-label={`Uncheck ${it.text}`}>
                    <Check />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </Screen>
  );
}
