import { useState, useEffect, useRef } from "react";
import { C } from "./lib/theme";
import { load, save, exportData, importData, emptyState } from "./lib/storage";
import { START, END, dayKey, daysBetween, addDays, normDay } from "./lib/dates";
import { YEAR, YEAR_TOTAL } from "./data/goals";
import { visibleItems } from "./data/daily";
import Enso from "./components/Enso";
import Home from "./components/Home";
import { Screen } from "./components/ui";
import List from "./components/screens/List";
import Reflect from "./components/screens/Reflect";
import Rate from "./components/screens/Rate";
import Trends from "./components/Trends";
import Path from "./components/Path";
import Log from "./components/Log";
import Year from "./components/Year";

export default function App() {
  const [screen, setScreen] = useState("home");
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

  // Scroll to the top of each new screen — every moment starts at its beginning.
  useEffect(() => { window.scrollTo(0, 0); }, [screen]);

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

  // Today's list, focus math — shared by the hub and the List screen.
  const items = visibleItems(today.hasKids);
  const remaining = items.filter((i) => !today.checks[i.id]);
  const pct = items.length ? (items.length - remaining.length) / items.length : 0;

  const hour = now.getHours();
  const greeting = hour < 5 ? "Late night" : hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const eveningReady = remaining.length === 0 || hour >= 19;

  const doReset = () => { const f = emptyState(); setData(f); save(f); setConfirmReset(false); };
  const goHome = () => setScreen("home");

  if (!ready) {
    return (
      <div style={{ ...page, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Enso pct={0} size={160} />
      </div>
    );
  }

  return (
    <div style={page}>
      <div style={shell}>
        {screen === "home" && (
          <Home
            today={today} items={items} remaining={remaining} pct={pct}
            dayNum={dayNum} totalDays={totalDays} greeting={greeting} streak={streak}
            stats={{ totalSealed, bestStreak, yearPct: Math.round((yearChecked / YEAR_TOTAL) * 100) }}
            actions={dayActions} onNav={setScreen} eveningReady={eveningReady}
          />
        )}

        {screen === "list" && <List today={today} actions={dayActions} onBack={goHome} />}
        {screen === "reflect" && <Reflect today={today} setRefl={dayActions.setRefl} onBack={goHome} />}
        {screen === "rate" && <Rate today={today} setRating={dayActions.setRating} onBack={goHome} />}

        {screen === "trends" && (
          <Screen title="Trends" sub="Your weeks, at a glance." onBack={goHome}>
            <Trends days={data.days} now={now} />
          </Screen>
        )}
        {screen === "path" && (
          <Screen title="The Path" sub="One week at a time." onBack={goHome}>
            <Path data={data} now={now} actions={pathActions} />
          </Screen>
        )}
        {screen === "log" && (
          <Screen title="Log" sub="What you finish, counted." onBack={goHome}>
            <Log logs={data.logs} today={tk} actions={logActions} />
          </Screen>
        )}
        {screen === "year" && (
          <Screen title="2026" sub="175 days. One circle at a time." onBack={goHome}>
            <Year data={data} now={now} goalDone={goalDone} yearChecked={yearChecked}
              workout={{ adherence, completed: completedWorkouts, scheduled, target }}
              onToggleGoal={(id) => setData((d) => ({ ...d, yearGoals: { ...d.yearGoals, [id]: !d.yearGoals[id] } }))}
              onSetWorkoutTarget={(v) => setData((d) => ({ ...d, settings: { ...d.settings, workoutTarget: Math.max(1, Math.min(14, v)) } }))}
              onGoToLog={() => setScreen("log")} />
          </Screen>
        )}

        {error && <p className="r26-err">{error}</p>}

        {screen === "home" && (
          <>
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
          </>
        )}
      </div>
    </div>
  );
}

const page = { minHeight: "100vh", background: C.washi, color: C.ink, fontFamily: "var(--sans)" };
const shell = { maxWidth: 440, margin: "0 auto", padding: "20px 20px 60px" };
