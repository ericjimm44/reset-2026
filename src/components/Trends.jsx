import { useState } from "react";
import { C } from "../lib/theme";
import { RATINGS } from "../data/daily";
import { START, addDays, dayKey } from "../lib/dates";

// Weekly averages of the daily 1-10s. "Track trends weekly, not perfection daily."
export default function Trends({ days, now }) {
  const [metric, setMetric] = useState("regulation");

  const weeks = [];
  for (let ws = new Date(START); ws <= now; ws = addDays(ws, 7)) weeks.push(new Date(ws));

  const avgFor = (ws, key) => {
    let sum = 0, cnt = 0;
    for (let i = 0; i < 7; i++) {
      const d = addDays(ws, i);
      if (d > now) break;
      const v = days[dayKey(d)]?.ratings?.[key];
      if (typeof v === "number") { sum += v; cnt++; }
    }
    return cnt ? sum / cnt : null;
  };

  const series = weeks.map((ws, i) => ({ wk: i + 1, val: avgFor(ws, metric) }));
  const hasData = series.some((s) => s.val != null);
  const latest = [...series].reverse().find((s) => s.val != null);
  const label = RATINGS.find(([k]) => k === metric)?.[1];
  const inverted = metric === "anxiety";

  return (
    <>
      <p style={{ fontSize: 13.5, color: C.sub, textAlign: "center", margin: "14px 0 10px" }}>
        Weekly averages. Watch the direction, not any single day.
      </p>

      <div className="r26-chips">
        {RATINGS.map(([k, l]) => (
          <button key={k} onClick={() => setMetric(k)} className="r26-chip"
            style={{ background: metric === k ? C.ink : "transparent", color: metric === k ? C.washi : C.sub, borderColor: metric === k ? C.ink : C.line }}>
            {l}
          </button>
        ))}
      </div>

      <section className="r26-card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 12 }}>
          <div className="r26-grouphead" style={{ marginBottom: 0 }}>
            {label}
            {inverted && <span style={{ color: C.faint, letterSpacing: 1 }}> · lower is better</span>}
          </div>
          <span style={{ fontFamily: "Georgia,serif", fontSize: 22, color: C.ink }}>
            {latest?.val != null ? latest.val.toFixed(1) : "–"}
            <span style={{ fontSize: 11, color: C.faint }}> now</span>
          </span>
        </div>

        {hasData ? (
          <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 120, borderBottom: `1px solid ${C.line}`, paddingBottom: 2 }}>
            {series.map((s, i) => (
              <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end", height: "100%" }}>
                {s.val != null && <span style={{ fontSize: 9, color: C.faint, marginBottom: 2 }}>{s.val.toFixed(1)}</span>}
                <div style={{ width: "70%", height: `${s.val != null ? (s.val / 10) * 100 : 0}%`, minHeight: s.val != null ? 3 : 0, background: inverted ? C.indigo : C.moss, borderRadius: 3, transition: "height .4s" }} />
                <span style={{ fontSize: 9, color: C.faint, marginTop: 3 }}>{s.wk}</span>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "24px 8px", color: C.faint, fontSize: 13 }}>
            Rate a few days on the Today tab and your weekly trend will appear here.
          </div>
        )}
        <div style={{ fontSize: 10.5, color: C.faint, letterSpacing: 1.5, textTransform: "uppercase", textAlign: "center", marginTop: 6 }}>
          week of the reset
        </div>
      </section>

      <section className="r26-card">
        <div className="r26-grouphead">This week, at a glance</div>
        {RATINGS.map(([k, l]) => {
          const v = avgFor(weeks[weeks.length - 1], k);
          return (
            <div key={k} style={{ display: "flex", alignItems: "center", gap: 10, padding: "7px 0", borderBottom: `1px solid ${C.washi}` }}>
              <span style={{ flex: 1, fontSize: 13, color: C.ink }}>{l}</span>
              <div className="r26-bar" style={{ width: 90 }}>
                <div style={{ width: `${v != null ? (v / 10) * 100 : 0}%`, height: "100%", background: k === "anxiety" ? C.indigo : C.moss }} />
              </div>
              <span style={{ width: 28, textAlign: "right", fontSize: 12.5, color: C.sub }}>{v != null ? v.toFixed(1) : "–"}</span>
            </div>
          );
        })}
      </section>
    </>
  );
}
