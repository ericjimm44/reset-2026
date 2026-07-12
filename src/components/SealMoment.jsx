import { useState } from "react";
import { C } from "../lib/theme";
import { SEAL_Q } from "../data/daily";
import { SEAL_STEPS } from "../data/voice";
import Enso from "./Enso";

/*
  The seal — the app's peak moment, given the whole screen.
  Ask the one question, then close the circle like pressing a hanko.
  Honesty seals: "Not today" counts exactly as much as "Yes".
  Reduced motion collapses the ceremony to an instant (CSS handles it).
*/
export default function SealMoment({ today, streak, actions, onDone }) {
  // "ask" → answer the question · "sealed" → the circle closes
  const [stage, setStage] = useState(today.closed ? "sealed" : "ask");

  const answer = (v) => {
    actions.setPct(v);
    actions.closeDay();
    setStage("sealed");
  };

  if (stage === "ask") {
    return (
      <div className="r26-overlay">
        <div style={{ maxWidth: 340 }}>
          <div className="r26-eyebrow" style={{ color: C.mossDeep }}>Seal today</div>
          <p className="r26-serif" style={{ fontSize: 21, lineHeight: 1.55, fontStyle: "italic", margin: "22px 0 6px" }}>
            &ldquo;{SEAL_Q}&rdquo;
          </p>
          <p style={{ fontSize: 12.5, color: C.faint, margin: "0 0 8px" }}>
            Either answer seals the day. Honesty is showing up.
          </p>
          <div className="r26-yesno">
            <button className="r26-pick" style={{ background: C.moss, borderColor: C.moss, color: "#F3F0E8" }}
              onClick={() => answer("yes")}>Yes</button>
            <button className="r26-pick" onClick={() => answer("no")}>Not today</button>
          </div>
          <button className="r26-link" style={{ marginTop: 26 }} onClick={onDone}>Not yet — back to today</button>
        </div>
      </div>
    );
  }

  return (
    <div className="r26-overlay">
      <Enso pct={1} sealed drawing size={230}>
        <span className="r26-stamp-big">済</span>
      </Enso>
      <div className="r26-serif" style={{ fontSize: 24, marginTop: 26, color: C.seal }}>
        {SEAL_STEPS.sealedTitle}
      </div>
      <p className="r26-serif" style={{ fontSize: 16.5, fontStyle: "italic", lineHeight: 1.6, color: C.sub, maxWidth: 300, margin: "14px 0 0" }}>
        {SEAL_STEPS.sealedNote}
      </p>
      <div style={{ marginTop: 18, fontSize: 13, color: C.mossDeep }}>
        {streak} {streak === 1 ? "day" : "days"} sealed in a row.
      </div>
      <button className="r26-return" style={{ maxWidth: 240, marginTop: 30 }} onClick={onDone}>
        Rest now
      </button>
    </div>
  );
}
