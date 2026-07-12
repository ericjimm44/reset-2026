import { useState, useEffect, useRef } from "react";
import { C } from "./lib/theme";
import { load, save, exportData, importData, emptyState } from "./lib/storage";
import { START, END, dayKey, daysBetween, addDays, normDay } from "./lib/dates";
import { YEAR, YEAR_TOTAL } from "./data/goals";
import { Ring } from "./components/ui";
import Today from "./components/Today";
import Trends from "./components/Trends";
import Path from "./components/Path";
import Log from "./components/Log";
import Year from "./components/Year";

const TABS = [["today", "Today"], ["trends", "Trends"], ["path", "Path"], ["log", "Log"], ["year", "2026"]];

export default function App() {
  const [tab, setTab] = useState("today");
  const [data, setData] = useState(emptyState);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState(null);
  const [confirmReset, setConfirmReset] = useState(false);
  const [backup, setBackup] = useState(null);
  const timer = useRef(null);

  const now = new Date();
  const tk = dayKey(now);
  const today = normDay(data.days[tk]);

  useEffect(() => {
    setData(load());
    setReady(true);
  }, []);

  // Debounced save — every change persists ~450ms after you stop.
  useEffect(() => {
    if (!ready) return;
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      setError(save(data) ? null : "Couldn't save to this device. Changes are safe for this session.");
    }, 450);
    return () => clearTimeout(timer.current);
  }, [data, ready]);

  /* ---- day mutations ---- */
  const patchDay = (fn) => setData((d) => ({ ...d, days: { ...d.days, [tk]: fn(normDay(d.days[tk])) } }));

  const dayActions = {
    toggleCheck: (id) => patchDay((day) => ({ ...day, checks: { ...day.checks, [id]: !day.checks[id] } })),
    setGrat: (i, v) => patchDay((day) => {
      const g = [...day.gratitude];
      g[i] = v;
      return { ...day, gratitude: g, checks: { ...day.checks, gratitude: g.filter((x) => x.trim()).length >= 3 } };
    }),
    setRefl: (k, v) => patchDay((day) => ({ ...day, reflection: { ...day.reflection, [k]: v } })),
    setHasKids: (v) => patchDay((day) => ({ ...day, hasKids: v })),
    setRating: (k, v) => patchDay((day) => ({ ...day, ratings: { ...day.ratings, [k]: day.ratings[k] === v ? null : v } })),
    setPct: (v) => patchDay((day) => ({ ...day, onePercent: v })),
    closeDay: () => patchDay((day) => ({ ...day, closed: true })),
    reopenDay: () => patchDay((day) => ({ ...day, closed: false })),
  };

  const pathActions = {
    setPathWeek: (n) => setData((d) => ({ ...d, settings: { ...d.settings, pathWeek: n } })),
    togglePathProject: (wn, i) => setData((d) => {
      const cur = d.pathProgress[wn] || { projects: {}, milestone: false, notes: "" };
      return { ...d, pathProgress: { ...d.pathProgress, [wn]: { ...cur, projects: { ...cur.projects, [i]: !cur.projects?.[i] } } } };
    }),
    togglePathMilestone: (wn) => setData((d) => {
      const cur = d.pathProgress[wn] || { projects: {}, milestone: false, notes: "" };
      return { ...d, pathProgress: { ...d.pathProgress, [wn]: { ...cur, milestone: !cur.milestone } } };
    }),
    setPathNotes: (wn, v) => setData((d) => {
      const cur = d.pathProgress[wn] || { projects: {}, milestone: false, notes: "" };
      return { ...d, pathProgress: { ...d.pathProgress, [wn]: { ...cur, notes: v } } };
    }),
    setPathScore: (ym, k, v) => setData((d) => {
      const cur = d.pathScores[ym] || {};
      return { ...d, pathScores: { ...d.pathScores, [ym]: { ...cur, [k]: cur[k] === v ? null : v } } };
    }),
  };

  const logActions = {
    addLog: (key, name, date) => setData((d) => ({ ...d, logs: { ...d.logs, [key]: [{ name, date }, ...(d.logs[key] || [])] } })),
    removeLog: (key, i) => setData((d) => ({ ...d, logs: { ...d.logs, [key]: d.logs[key].filter((_, x) => x !== i) } })),
  };

  /* ---- derived ---- */
  const closedDates = Object.keys(data.days).filter((k) => data.days[k].closed).sort();
  const totalSealed = closedDates.length;
  const bestStreak = (() => {
    let best = 0, run = 0, prev = null;
    for (const k of closedDates) {
      const d = new Date(k);
      run = prev && daysBetween(prev, d) === 1 ? run + 1 : 1;
      best = Math.max(best, run);
      prev = d;
    }
    return best;
  })();
  const streak = (() => {
    let d = today.closed ? new Date(now) : addDays(now, -1);
    let n = 0;
    while (n < 400 && data.days[dayKey(d)]?.closed) { n++; d = addDays(d, -1); }
    return n;
  })();
  const nextMile = [7, 30, 60, 90, 120, 175].find((m) => m > streak);

  const dayNum = Math.min(Math.max(daysBetween(START, now) + 1, 1), daysBetween(START, END) + 1);
  const totalDays = daysBetween(START, END) + 1;

  const target = data.settings.workoutTarget || 4;
  const completedWorkouts = Object.keys(data.days).filter((k) => {
    const d = new Date(k);
    return d >= START && d <= now && data.days[k].checks?.workout;
  }).length;
  const scheduled = Math.max(1, Math.ceil((daysBetween(START, now) + 1) / 7)) * target;
  const adherence = scheduled ? completedWorkouts / scheduled : 0;

  const goalDone = (cat, i, g) =>
    g.track ? (data.logs[g.track] || []).length >= g.target
    : g.workout ? adherence >= 0.9 && completedWorkouts >= 8
    : !!data.yearGoals[`${cat}-${i}`];
  const yearChecked = YEAR.reduce((n, c) => n + c.goals.filter((g, i) => goalDone(c.label, i, g)).length, 0);

  const strip = Array.from({ length: 14 }, (_, i) => {
    const d = addDays(now, -(13 - i));
    const rec = data.days[dayKey(d)];
    return { closed: rec?.closed, yes: rec?.onePercent === "yes", isToday: dayKey(d) === tk };
  });

  const hour = now.getHours();
  const greeting = hour < 5 ? "Late night" : hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  const doReset = () => { const f = emptyState(); setData(f); save(f); setConfirmReset(false); };

  if (!ready) {
    return (
      <div style={{ ...page, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Ring pct={0} closed={false} streak={0} loading />
      </div>
    );
  }

  return (
    <div style={page}>
      <div style={shell}>
        <div className="r26-wordmark">JIMMY&rsquo;S 2026 RESET</div>
        <div className="r26-eyebrow" style={{ marginTop: 6 }}>The Reset · Day {dayNum} of {totalDays}</div>
        <div style={{ fontSize: 15, color: C.sub, marginTop: 2 }}>{greeting}, Jimmy.</div>

        <div className="r26-tabs">
          {TABS.map(([k, l]) => (
            <button key={k} onClick={() => setTab(k)} className="r26-tab"
              style={{ background: tab === k ? C.ink : "transparent", color: tab === k ? C.washi : C.sub }}>{l}</button>
          ))}
        </div>

        {tab === "today" && <Today today={today} actions={dayActions} streak={streak} nextMile={nextMile} strip={strip} />}
        {tab === "trends" && <Trends days={data.days} now={now} />}
        {tab === "path" && <Path data={data} now={now} actions={pathActions} />}
        {tab === "log" && <Log logs={data.logs} today={tk} actions={logActions} />}
        {tab === "year" && (
          <Year data={data} now={now} goalDone={goalDone} yearChecked={yearChecked}
            workout={{ adherence, completed: completedWorkouts, scheduled, target }}
            onToggleGoal={(id) => setData((d) => ({ ...d, yearGoals: { ...d.yearGoals, [id]: !d.yearGoals[id] } }))}
            onSetWorkoutTarget={(v) => setData((d) => ({ ...d, settings: { ...d.settings, workoutTarget: Math.max(1, Math.min(14, v)) } }))}
            onGoToLog={() => setTab("log")} />
        )}

        {tab === "today" && (
          <div className="r26-stats">
            <div><b>{totalSealed}</b><span>days sealed</span></div>
            <div><b>{bestStreak}</b><span>best streak</span></div>
            <div><b>{Math.round((yearChecked / YEAR_TOTAL) * 100)}%</b><span>2026 goals</span></div>
          </div>
        )}

        {error && <p className="r26-err">{error}</p>}

        <div style={{ textAlign: "center", marginTop: 18, display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
          <button className="r26-link" onClick={() => setBackup(exportData(data))}>Backup &amp; restore</button>
          {confirmReset ? (
            <span style={{ fontSize: 12.5, color: C.sub }}>
              Erase everything? <button className="r26-link" onClick={doReset}>Yes</button>
              {" · "}<button className="r26-link" onClick={() => setConfirmReset(false)}>Keep it</button>
            </span>
          ) : (
            <button className="r26-link" onClick={() => setConfirmReset(true)}>Reset</button>
          )}
        </div>

        {backup !== null && (
          <div className="r26-card" style={{ marginTop: 14 }}>
            <div className="r26-grouphead">Backup &amp; restore</div>
            <p style={{ fontSize: 12.5, color: C.sub, marginTop: 0 }}>
              Data lives on this device only. Copy this somewhere safe; paste it back to restore or move devices.
            </p>
            <textarea className="r26-text" rows={4} value={backup} onChange={(e) => setBackup(e.target.value)}
              style={{ fontFamily: "monospace", fontSize: 11 }} />
            <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
              <button className="r26-mini" onClick={() => navigator.clipboard?.writeText(backup)}>Copy</button>
              <button className="r26-mini" onClick={() => {
                try { setData(importData(backup)); setBackup(null); }
                catch { setError("That backup couldn't be read. Check it was pasted whole."); }
              }}>Restore</button>
              <button className="r26-mini" style={{ marginLeft: "auto" }} onClick={() => setBackup(null)}>Close</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const page = { minHeight: "100vh", background: C.washi, color: C.ink, fontFamily: "'Helvetica Neue', Inter, system-ui, sans-serif" };
const shell = { maxWidth: 460, margin: "0 auto", padding: "24px 18px 60px" };
