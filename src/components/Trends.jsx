import { useState } from "react";
import { C } from "../lib/theme";
import { RATINGS } from "../data/daily";
import { START, addDays, dayKey } from "../lib/dates";
import { TRENDS_LINE } from "../data/voice";

/*
  Weekly averages of the daily 1-10s, as quiet dot columns.
  Presence over performance: the shape of the weeks, not tonight's number.
*/
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

  // Last 12 weeks of the chosen metric.
  const recent = weeks.slice(-12);
  const firstShownWeek = weeks.length - recent.length + 1;
  const series = recent.map((ws, i) => ({ wk: firstShownWeek + i, val: avgFor(ws, metric) }));
  const hasData = series.some((s) => s.val != null);
  const latest = [...series].reverse().find((s) => s.val != null);
  const label = RATINGS.find(([k]) => k === metric)?.[1];
  const inverted = metric === "anxiety";

  return (
    <>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, justifyContent: "center", marginBottom: 16 }}>
        {RATINGS.map(([k, l]) => (
          <button key={k} onClick={() => setMetric(k)} className={`r26-chip${metric === k ? " on" : ""}`}>{l}</button>
        ))}
      </div>

      <section className="r26-card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 16 }}>
          <div className="r26-grouphead" style={{ marginBottom: 0 }}>
            {label}
            {inverted && <span style={{ color: C.faint, letterSpacing: 1 }}> · lower is better</span>}
          </div>
          <span className="r26-serif" style={{ fontSize: 22 }}>
            {latest?.val != null ? latest.val.toFixed(1) : "–"}
            <span style={{ fontSize: 11, color: C.faint, fontFamily: "var(--sans)" }}> now</span>
          </span>
        </div>

        {hasData ? (
          <>
            {/* five dot slots per week — each dot is two points of the 1-10 */}
            <div style={{ display: "flex", gap: 6, justifyContent: "space-between" }}>
              {series.map((s, i) => {
                const filled = s.val != null ? Math.max(1, Math.round(s.val / 2)) : 0;
                return (
                  <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
                    {[5, 4, 3, 2, 1].map((slot) => (
                      <span key={slot} className={`r26-dot${slot <= filled ? ` on${inverted ? " indigo" : ""}` : ""}`}
                        style={{ width: 11, height: 11, cursor: "default", opacity: s.val == null && slot === 1 ? 0.4 : 1 }} />
                    ))}
                    <span style={{ fontSize: 9.5, color: C.faint, marginTop: 3 }}>{s.wk}</span>
                  </div>
                );
              })}
            </div>
            <div className="r26-eyebrow" style={{ textAlign: "center", marginTop: 10 }}>week of the reset</div>
          </>
        ) : (
          <div style={{ textAlign: "center", padding: "24px 8px", color: C.faint, fontSize: 13 }}>
            Rate a few days from Today and your weeks will appear here.
          </div>
        )}
      </section>

      <section className="r26-card">
        <div className="r26-grouphead">This week, at a glance</div>
        {RATINGS.map(([k, l], ri) => {
          const v = avgFor(weeks[weeks.length - 1], k);
          const filled = v != null ? Math.max(1, Math.round(v / 2)) : 0;
          const inv = k === "anxiety";
          return (
            <div key={k} style={{ display: "flex", alignItems: "center", gap: 12, minHeight: 44, borderTop: ri > 0 ? "1px solid rgba(216,210,196,0.4)" : "none" }}>
              <span style={{ flex: 1, fontSize: 13.5, color: C.ink }}>{l}</span>
              <span style={{ display: "flex", gap: 5 }}>
                {[1, 2, 3, 4, 5].map((slot) => (
                  <span key={slot} className={`r26-dot${slot <= filled ? ` on${inv ? " indigo" : ""}` : ""}`}
                    style={{ width: 12, height: 12, cursor: "default" }} />
                ))}
              </span>
              <span style={{ width: 30, textAlign: "right", fontSize: 12.5, color: C.sub }}>{v != null ? v.toFixed(1) : "–"}</span>
            </div>
          );
        })}
      </section>

      <p className="r26-mantra">{TRENDS_LINE}</p>
    </>
  );
}
