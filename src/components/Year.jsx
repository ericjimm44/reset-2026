import { C } from "../lib/theme";
import { YEAR, YEAR_TOTAL } from "../data/goals";
import { START, END, dayKey, daysBetween, addDays } from "../lib/dates";
import { Check, Row } from "./ui";

/*
  The whole reset at a glance: 175 days as dots, one row per month.
  Sealed days fill in moss. Nothing shames the empty ones.
*/
function DayDots({ days, now }) {
  const tk = dayKey(now);
  const months = [];
  for (let d = new Date(START); d <= END; d = addDays(d, 1)) {
    const m = d.toLocaleString("en-US", { month: "short" });
    if (!months.length || months[months.length - 1].name !== m) months.push({ name: m, days: [] });
    const k = dayKey(d);
    months[months.length - 1].days.push({
      k,
      sealed: !!days[k]?.closed,
      isToday: k === tk,
      future: d > now,
    });
  }

  const dot = (d) => ({
    width: 10, height: 10, borderRadius: 10, flexShrink: 0,
    background: d.sealed ? C.moss : d.isToday ? "rgba(108,122,79,0.35)" : "transparent",
    border: d.sealed ? `1px solid ${C.moss}` : d.isToday ? "1px solid rgba(108,122,79,0.5)" : `1px solid ${d.future ? "rgba(216,210,196,0.6)" : C.line}`,
  });

  return (
    <section className="r26-card">
      <div className="r26-grouphead">2026 Reset · {daysBetween(START, END) + 1} days</div>
      {months.map((m) => (
        <div key={m.name} style={{ display: "flex", alignItems: "center", gap: 10, padding: "5px 0" }}>
          <span style={{ width: 30, fontSize: 11, color: C.faint, letterSpacing: 0.5 }}>{m.name}</span>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 3.5, flex: 1 }}>
            {m.days.map((d) => <span key={d.k} style={dot(d)} />)}
          </div>
        </div>
      ))}
      <div style={{ display: "flex", gap: 16, justifyContent: "center", marginTop: 12 }}>
        {[["Sealed", C.moss, C.moss], ["Today", "rgba(108,122,79,0.35)", "rgba(108,122,79,0.5)"], ["Open", "transparent", C.line]].map(([l, bg, bc]) => (
          <span key={l} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: C.sub }}>
            <span style={{ width: 9, height: 9, borderRadius: 9, background: bg, border: `1px solid ${bc}` }} />{l}
          </span>
        ))}
      </div>
    </section>
  );
}

export default function Year({ data, now, workout, goalDone, yearChecked, onToggleGoal, onSetWorkoutTarget, onGoToLog }) {
  const { adherence, completed, scheduled, target } = workout;
  const daysLeft = Math.max(daysBetween(now, END) + 1, 0);
  const logs = data.logs;

  return (
    <>
      <div style={{ textAlign: "center", marginBottom: 14 }}>
        <span className="r26-eyebrow">{yearChecked} of {YEAR_TOTAL} milestones · {daysLeft} days left</span>
      </div>

      <DayDots days={data.days} now={now} />

      {YEAR.map((cat) => {
        const done = cat.goals.filter((g, i) => goalDone(cat.label, i, g)).length;
        return (
          <section key={cat.label} className="r26-card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <div className="r26-grouphead" style={{ marginBottom: 0 }}>{cat.label}</div>
              <span style={{ fontSize: 11, color: C.faint, letterSpacing: 1 }}>{done}/{cat.goals.length}</span>
            </div>
            <div className="r26-bar">
              <div style={{ width: `${(done / cat.goals.length) * 100}%`, height: "100%", background: C.moss, transition: "width .4s" }} />
            </div>
            <div style={{ marginTop: 10 }}>
              {cat.goals.map((g, i) => {
                const id = `${cat.label}-${i}`;

                // Auto-tracked from daily workout checks
                if (g.workout) {
                  const dn = adherence >= 0.9 && completed >= 8;
                  return (
                    <div key={id}>
                      <div className="r26-row" style={{ cursor: "default" }}>
                        <span className="r26-box" style={{ background: dn ? C.moss : "transparent", borderColor: dn ? C.moss : C.line }}>{dn && <Check />}</span>
                        <span style={{ flex: 1, textAlign: "left", fontSize: 13.5, color: dn ? C.faint : C.ink }}>{g.text}</span>
                        <span style={{ fontSize: 12, color: adherence >= 0.9 ? C.moss : C.indigo }}>{Math.round(adherence * 100)}%</span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "0 0 8px 36px" }}>
                        <span style={{ fontSize: 11.5, color: C.faint }}>{completed} done · {scheduled} scheduled</span>
                        <span style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8 }}>
                          <button className="r26-step" onClick={() => onSetWorkoutTarget(target - 1)}>−</button>
                          <span style={{ fontSize: 11.5, color: C.sub }}>{target}/wk</span>
                          <button className="r26-step" onClick={() => onSetWorkoutTarget(target + 1)}>+</button>
                        </span>
                      </div>
                    </div>
                  );
                }

                // Auto-tracked from the Log tab
                if (g.track) {
                  const c = (logs[g.track] || []).length;
                  const dn = c >= g.target;
                  return (
                    <button key={id} className="r26-row" onClick={onGoToLog}>
                      <span className="r26-box" style={{ background: dn ? C.moss : "transparent", borderColor: dn ? C.moss : C.line }}>{dn && <Check />}</span>
                      <span style={{ flex: 1, textAlign: "left", fontSize: 13.5, color: dn ? C.faint : C.ink }}>{g.text}</span>
                      <span style={{ fontSize: 12, color: C.indigo }}>{c}/{g.target} ›</span>
                    </button>
                  );
                }

                return <Row key={id} checked={!!data.yearGoals[id]} onToggle={() => onToggleGoal(id)} text={g.text} small />;
              })}
            </div>
          </section>
        );
      })}
    </>
  );
}
