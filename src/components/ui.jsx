import { C } from "../lib/theme";
import { ChevronLeft } from "./Icons";

/*
  Shared chrome for every spoke screen: back chevron, eyebrow title,
  serif subline, and a full-width way home at the bottom.
  Each screen is a single moment — it should feel like one page of a journal.
*/
export function Screen({ title, sub, onBack, children }) {
  return (
    <div className="r26-screen">
      <button className="r26-back" onClick={onBack}><ChevronLeft /> Today</button>
      <div style={{ textAlign: "center", margin: "6px 0 18px" }}>
        <div className="r26-eyebrow" style={{ color: C.mossDeep }}>{title}</div>
        {sub && <div className="r26-caption" style={{ marginTop: 6 }}>{sub}</div>}
      </div>
      {children}
      <button className="r26-return" onClick={onBack}>Back to Today</button>
    </div>
  );
}

export function Check() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12">
      <path d="M2.5 6.2 L5 8.6 L9.5 3.4" fill="none" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Row({ checked, onToggle, text, note, guard, small, tag }) {
  return (
    <button className="r26-row" onClick={onToggle}>
      <span className="r26-box" style={{ background: checked ? (guard ? C.indigo : C.moss) : "transparent", borderColor: checked ? (guard ? C.indigo : C.moss) : C.line }}>
        {checked && <Check />}
      </span>
      <span style={{ flex: 1, textAlign: "left" }}>
        <span style={{ fontSize: small ? 13.5 : 14.5, color: checked ? C.faint : C.ink, textDecoration: checked ? "line-through" : "none", textDecorationColor: C.line }}>{text}</span>
        {note && <span style={{ display: "block", fontSize: 11.5, color: C.faint, marginTop: 1 }}>{note}</span>}
      </span>
      {tag && <span className="r26-tag">{tag}</span>}
    </button>
  );
}

export function SecHead({ label, count, open, onClick }) {
  return (
    <button className="r26-sechead" onClick={onClick}>
      <span className="r26-grouphead" style={{ marginBottom: 0 }}>
        {label}
        {count != null && <span style={{ color: C.faint, letterSpacing: 1 }}> · {count}</span>}
      </span>
      <span style={{ color: C.faint, fontSize: 13, transform: open ? "rotate(90deg)" : "none", transition: "transform .2s" }}>›</span>
    </button>
  );
}

export function Scale({ value, onSet, invert }) {
  return (
    <div style={{ display: "flex", gap: 4 }}>
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
        <button key={n} onClick={() => onSet(n)} className="r26-scaledot"
          style={{ background: value && n <= value ? (invert ? C.indigo : C.moss) : "transparent", borderColor: value && n <= value ? (invert ? C.indigo : C.moss) : C.line }} />
      ))}
    </div>
  );
}

// (The old Ring lived here — replaced by components/Enso.jsx.)
