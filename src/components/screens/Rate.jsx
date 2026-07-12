import { C } from "../../lib/theme";
import { RATINGS } from "../../data/daily";
import { Screen } from "../ui";

/*
  The daily 1–10s as quiet dot rows. Optional, always.
  These feed Trends — the weekly line matters, not tonight's number.
*/
export default function Rate({ today, setRating, onBack }) {
  return (
    <Screen title="Rate Your Day" sub="Not a score. Just awareness." onBack={onBack}>
      <div className="r26-card">
        {RATINGS.map(([k, label], ri) => {
          const v = today.ratings[k];
          const invert = k === "anxiety";
          return (
            <div key={k} style={{ padding: "10px 0", borderTop: ri > 0 ? "1px solid rgba(216,210,196,0.4)" : "none" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 2 }}>
                <span style={{ fontSize: 13.5, color: C.ink }}>
                  {label}
                  {invert && <span style={{ color: C.faint }}> · lower is better</span>}
                </span>
                <span className="r26-serif" style={{ fontSize: 15, color: C.mossDeep }}>{v || "–"}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                  <button key={n} className="r26-dothit" onClick={() => setRating(k, n)}
                    aria-label={`${label} ${n}`}>
                    <span className={`r26-dot${v && n <= v ? ` on${invert ? " indigo" : ""}` : ""}`} />
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
      <p style={{ fontSize: 12, color: C.faint, textAlign: "center", margin: "4px 0 0" }}>
        Optional. These feed Trends — watch the weekly line, not the daily number.
      </p>
    </Screen>
  );
}
