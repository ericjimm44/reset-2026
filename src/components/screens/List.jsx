import { useState } from "react";
import { C } from "../../lib/theme";
import { GROUPS } from "../../data/daily";
import { Check, Screen } from "../ui";
import { GroupIcon } from "../Icons";

/*
  The full checklist — the "show everything" view. The hub is the focus
  mode now; here everything is visible, checked items stay put (softly),
  because this screen answers "what does my whole day look like?"
*/
export default function List({ today, actions, onBack }) {
  const [gratOpen, setGratOpen] = useState(false);
  const { toggleCheck, setGrat, setHasKids } = actions;

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
        {GROUPS.map((g, gi) => {
          const items = g.items.filter((i) => i.withKids === undefined || i.withKids === today.hasKids);
          return (
            <div key={g.key} style={{ padding: "10px 0", borderTop: gi > 0 ? "1px solid rgba(216,210,196,0.4)" : "none" }}>
              {items.map((it, ii) => {
                const checked = !!today.checks[it.id];
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
                          {ii === 0 ? g.label : " "}
                        </span>
                        <span style={{ fontSize: 14.5, color: checked ? C.faint : C.ink }}>
                          {it.text}
                          {it.note && <span style={{ color: C.faint }}> · {it.note}</span>}
                        </span>
                      </button>
                      <button className="r26-box" onClick={() => toggleCheck(it.id)}
                        style={{ borderRadius: 12, background: checked ? C.moss : "transparent", borderColor: checked ? C.moss : C.line }}>
                        {checked && <Check />}
                      </button>
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
        })}
      </div>
    </Screen>
  );
}
