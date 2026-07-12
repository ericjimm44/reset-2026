import { useId } from "react";
import { C } from "../lib/theme";

/*
  The ensō — the app's signature. One brush circle that IS the day:
  faint at dawn, closing as boxes are checked, whole when sealed.
  Hand-drawn on purpose: turbulence-displaced strokes, a heavy brush
  head at the leading edge, a dry secondary bristle line.
*/
export default function Enso({
  pct = 0,          // 0..1 — how much of the day is done
  sealed = false,   // sealed day: full ring, caller usually centers the 済 stamp
  size = 200,
  drawing = false,  // seal ceremony: animate the stroke closing (CSS handles reduced motion)
  children,         // centered content (streak, stamp…)
}) {
  const id = useId().replace(/[«»:]/g, "");
  const R = 62;
  const CIRC = 2 * Math.PI * R;
  const shown = sealed ? 1 : Math.min(Math.max(pct, 0), 1);

  // Leading brush-head position (same rotated frame as the dash).
  const tipA = 2 * Math.PI * shown;
  const tipX = 80 + R * Math.cos(tipA);
  const tipY = 80 + R * Math.sin(tipA);

  const ink = sealed ? C.ink : C.ink;
  const main = {
    fill: "none",
    stroke: ink,
    strokeLinecap: "round",
    filter: `url(#brush-${id})`,
  };

  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 160 160"
        style={{ transform: "rotate(-92deg)", display: "block" }}
        aria-hidden="true"
      >
        <defs>
          <filter id={`brush-${id}`} x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence type="fractalNoise" baseFrequency="0.09 0.9" numOctaves="2" seed="7" result="n" />
            <feDisplacementMap in="SourceGraphic" in2="n" scale="3.4" />
          </filter>
          <filter id={`dry-${id}`} x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence type="fractalNoise" baseFrequency="0.12 1.4" numOctaves="2" seed="11" result="n" />
            <feDisplacementMap in="SourceGraphic" in2="n" scale="4.5" />
          </filter>
        </defs>

        {/* paper ghost — the whole circle, barely there */}
        <circle cx="80" cy="80" r={R} fill="none" stroke={C.line} strokeWidth="2.5"
          opacity="0.5" filter={`url(#brush-${id})`} />

        {shown > 0 && (
          <g
            className={drawing ? "r26-enso-draw" : undefined}
            style={drawing ? { "--enso-circ": CIRC } : undefined}
          >
            {/* body of the stroke */}
            <circle cx="80" cy="80" r={R} strokeWidth="7"
              strokeDasharray={`${CIRC * shown} ${CIRC}`}
              style={{ transition: drawing ? "none" : "stroke-dasharray 0.7s ease" }}
              opacity="0.96" {...main} />
            {/* dry bristle edge riding the outside */}
            <circle cx="80" cy="80" r={R + 3} strokeWidth="1.6"
              strokeDasharray={`${CIRC * shown * 0.97} ${CIRC * 2}`}
              style={{ transition: drawing ? "none" : "stroke-dasharray 0.7s ease" }}
              opacity="0.4" fill="none" stroke={ink} strokeLinecap="round"
              filter={`url(#dry-${id})`} />
            {/* heavy brush head at the leading edge */}
            {!drawing && (
              <circle cx={tipX} cy={tipY} r="5.6" fill={ink} opacity="0.92"
                filter={`url(#brush-${id})`}
                style={{ transition: "cx 0.7s ease, cy 0.7s ease" }} />
            )}
          </g>
        )}
      </svg>

      {children && (
        <div style={{
          position: "absolute", inset: 0,
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
        }}>
          {children}
        </div>
      )}
    </div>
  );
}

/*
  Dev gallery — open /?enso to eyeball the states without touching app data.
  Removed from the bundle path in production use; harmless if it ships.
*/
export function EnsoGallery() {
  const states = [
    { pct: 0, label: "0% · A new beginning." },
    { pct: 0.4, label: "40% · You're showing up." },
    { pct: 0.8, label: "80% · Keep going." },
    { pct: 1, label: "100% · Day complete." },
    { pct: 1, sealed: true, label: "Sealed." },
  ];
  return (
    <div style={{ minHeight: "100vh", background: C.washi, display: "flex", flexWrap: "wrap", gap: 24, alignItems: "center", justifyContent: "center", padding: 40 }}>
      {states.map((s, i) => (
        <div key={i} style={{ textAlign: "center" }}>
          <Enso pct={s.pct} sealed={s.sealed} size={170}>
            {s.sealed && <span className="r26-stamp" style={{ width: 44, height: 44, fontSize: 22 }}>済</span>}
          </Enso>
          <div className="r26-caption" style={{ marginTop: 8 }}>{s.label}</div>
        </div>
      ))}
    </div>
  );
}
