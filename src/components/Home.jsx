import { useState } from "react";
import { C } from "../lib/theme";
import { SEAL_Q } from "../data/daily";
import { ensoCaption, MANTRA, SEAL_STEPS } from "../data/voice";
import Enso from "./Enso";
import { GroupIcon, ChevronRight } from "./Icons";

/*
  The hub. One question, one next step, nothing else above the fold.
  Everything deeper is a single tap away — and comes right back.
*/
export default function Home({
  today, items, remaining, pct,
  dayNum, totalDays, greeting, streak,
  stats, // { totalSealed, bestStreak, yearPct }
  actions, // { toggleCheck, setPct, closeDay, reopenDay }
  onNav,
  eveningReady, // remaining done OR evening hour
}) {
  const [sealing, setSealing] = useState(false);
  const nextBox = remaining[0];
  const left = remaining.length;

  const moments = [
    { k: "list", label: "Today's list", meta: left === 0 ? "done" : `${left} left`, icon: "home" },
    { k: "reflect", label: "Evening reflection", icon: "mind" },
    { k: "rate", label: "Rate your day", meta: "optional", icon: "growth" },
  ];
  const quiet = [
    { k: "trends", label: "Trends" },
    { k: "path", label: "Path" },
    { k: "log", label: "Log" },
    { k: "year", label: "2026" },
  ];

  return (
    <div className="r26-hub r26-screen">
      <div className="r26-wordmark" style={{ marginTop: 4 }}>JIMMY&rsquo;S 2026 RESET</div>

      <div className="r26-greeting" style={{ marginTop: 26 }}>{greeting}, Jimmy.</div>
      <div className="r26-eyebrow" style={{ marginTop: 6 }}>Day {dayNum} of {totalDays}</div>

      <div style={{ margin: "26px 0 4px" }}>
        <Enso pct={pct} sealed={today.closed} size={216}>
          {today.closed && <span className="r26-stamp" style={{ width: 52, height: 52, fontSize: 26 }}>済</span>}
        </Enso>
      </div>
      <div className="r26-caption">{ensoCaption(pct, today.closed)}</div>

      {/* ——— the day's single focus ——— */}
      {today.closed ? (
        <div style={{ marginTop: 26, maxWidth: 320 }}>
          <div className="r26-serif" style={{ fontSize: 17, lineHeight: 1.55 }}>
            {SEAL_STEPS.sealedNote}
          </div>
          <div style={{ marginTop: 14, fontSize: 13, color: C.mossDeep }}>
            {streak} {streak === 1 ? "day" : "days"} sealed in a row.
          </div>
          <button className="r26-link" style={{ marginTop: 10 }} onClick={actions.reopenDay}>
            Reopen today
          </button>
        </div>
      ) : sealing ? (
        /* the seal question — honesty seals, either answer counts */
        <div style={{ marginTop: 24, width: "100%", maxWidth: 340 }}>
          <div className="r26-question">
            <em>&ldquo;{SEAL_Q}&rdquo;</em>
            <div className="r26-yesno">
              {["yes", "no"].map((v) => (
                <button key={v} onClick={() => actions.setPct(v)} className="r26-pick"
                  style={{
                    background: today.onePercent === v ? (v === "yes" ? C.moss : C.ink) : "transparent",
                    color: today.onePercent === v ? "#F3F0E8" : C.ink,
                    borderColor: today.onePercent === v ? (v === "yes" ? C.moss : C.ink) : C.line,
                  }}>
                  {v === "yes" ? "Yes" : "Not today"}
                </button>
              ))}
            </div>
          </div>
          <button className="r26-sealbtn" disabled={!today.onePercent}
            onClick={() => { actions.closeDay(); setSealing(false); }}>
            Seal the day <span className="r26-stamp" style={{ width: 26, height: 26, fontSize: 14 }}>済</span>
          </button>
          <button className="r26-link" style={{ marginTop: 8 }} onClick={() => setSealing(false)}>
            Not yet
          </button>
        </div>
      ) : eveningReady ? (
        <div style={{ marginTop: 24, width: "100%", maxWidth: 340 }}>
          <div className="r26-serif" style={{ fontSize: 18 }}>{SEAL_STEPS.invite}</div>
          <button className="r26-sealbtn" onClick={() => setSealing(true)}>
            Seal the day <span className="r26-stamp" style={{ width: 26, height: 26, fontSize: 14 }}>済</span>
          </button>
        </div>
      ) : nextBox ? (
        <div style={{ marginTop: 24, width: "100%", maxWidth: 340 }}>
          {/* The One Rule, embodied. Never remove this. */}
          <div style={{ fontSize: 13, color: C.sub, lineHeight: 1.5, marginBottom: 6 }}>
            Don&rsquo;t try to solve your entire life.
          </div>
          <div className="r26-serif" style={{ fontSize: 18, marginBottom: 14 }}>
            What&rsquo;s the next box I can check?
          </div>
          <button className="r26-nextstep" onClick={() => actions.toggleCheck(nextBox.id)}>
            <GroupIcon k={nextBox.groupKey} size={22} color={C.mossDeep} />
            <span style={{ flex: 1 }}>
              <span style={{ display: "block", fontSize: 15, color: C.ink }}>{nextBox.text}</span>
              <span style={{ display: "block", fontSize: 11.5, color: C.faint, marginTop: 2 }}>{nextBox.group}</span>
            </span>
            <span style={{ width: 24, height: 24, borderRadius: 12, border: `1.6px solid ${C.line}`, flexShrink: 0 }} />
          </button>
        </div>
      ) : null}

      {/* ——— one tap deeper ——— */}
      <div style={{ width: "100%", marginTop: 30 }}>
        {moments.map((m) => (
          <button key={m.k} className="r26-moment" onClick={() => onNav(m.k)}>
            <GroupIcon k={m.icon} size={19} color={C.faint} />
            <span>{m.label}</span>
            {m.meta && <span style={{ fontSize: 11.5, color: C.faint, marginLeft: 8 }}>{m.meta}</span>}
            <span className="chev"><ChevronRight /></span>
          </button>
        ))}
      </div>

      <div style={{ width: "100%", marginTop: 18, display: "flex", gap: 6, justifyContent: "center", flexWrap: "wrap" }}>
        {quiet.map((q) => (
          <button key={q.k} className="r26-chip" onClick={() => onNav(q.k)}>{q.label}</button>
        ))}
      </div>

      <div className="r26-stats">
        <div><b>{stats.totalSealed}</b><span>days sealed</span></div>
        <div><b>{stats.bestStreak}</b><span>best streak</span></div>
        <div><b>{stats.yearPct}%</b><span>2026 goals</span></div>
      </div>

      <p className="r26-mantra">{MANTRA}</p>
    </div>
  );
}
