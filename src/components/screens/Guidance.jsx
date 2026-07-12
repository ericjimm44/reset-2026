import { C } from "../../lib/theme";
import { guidanceFor } from "../../data/voice";
import { Screen } from "../ui";

/* A quiet sumi mountain — mist and distance, nothing to solve. */
function Mountains() {
  return (
    <svg viewBox="0 0 300 110" width="100%" aria-hidden="true" style={{ display: "block" }}>
      <defs>
        <filter id="mist"><feGaussianBlur stdDeviation="0.4" /></filter>
      </defs>
      <path d="M0 95 Q40 68 78 82 T150 74 T225 84 T300 72 V110 H0 Z" fill={C.line} opacity="0.5" filter="url(#mist)" />
      <path d="M0 100 L52 62 L88 88 L134 46 L178 90 L216 66 L258 92 L300 78 V110 H0 Z" fill={C.sub} opacity="0.45" filter="url(#mist)" />
      <path d="M0 110 L70 84 L128 100 L196 78 L252 100 L300 90 V110 Z" fill={C.ink} opacity="0.55" filter="url(#mist)" />
    </svg>
  );
}

export default function Guidance({ dayNum, onBack }) {
  return (
    <Screen title="Guidance" sub="A note for you." onBack={onBack}>
      <div className="r26-card" style={{ padding: 0, overflow: "hidden", textAlign: "center" }}>
        <Mountains />
        <p className="r26-serif" style={{ fontSize: 19, fontStyle: "italic", lineHeight: 1.65, color: C.ink, padding: "26px 30px 34px", margin: 0 }}>
          {guidanceFor(dayNum)}
        </p>
      </div>
      <p style={{ fontSize: 12, color: C.faint, textAlign: "center", margin: "4px 0 0" }}>
        A new note each day. Nothing to do here — just read it.
      </p>
    </Screen>
  );
}
