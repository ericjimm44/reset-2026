import { C } from "../lib/theme";
import { YEAR, YEAR_TOTAL } from "../data/goals";
import { START, END, dayKey, daysBetween, addDays } from "../lib/dates";
import { Check, Row, Ring } from "./ui";

function MonthHistory({ days, now }) {
  const stats = [6, 7, 8, 9, 10, 11].map((m) => {
    const first = new Date(2026, m, 1);
    const last = new Date(2026, m + 1, 0);
    const start = first < START ? START : first;
    const end = now < last ? now : last;
    let elapsed = 0, sealed = 0;
    if (end >= start) {
      elapsed = daysBetween(start, end) + 1;
      for (let i = 0; i < elapsed; i++) {
        if (days[dayKey(addDays(start, i))]?.closed) sealed++;
      }
    }
    return { name: first.toLocaleString("en-US", { month: "short" }), elapsed, sealed, future: end < start };
  });

  return (
    <section className="r26-card">
      <div className="r26-grouphead">Momentum by month</div>
      {stats.map((s, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 0" }}>
          <span style={{ width: 34, fontSize: 12, color: C.sub }}>{s.name}</span>
          <div className="r26-bar" style={{ flex: 1 }}>
            <div style={{ width: s.elapsed ? `${(s.sealed / s.elapsed) * 100}%` : "0%", height: "100%", background: C.moss, transition: "width .4s" }} />
          </div>
          <span style={{ width: 52, textAlign: "right", fontSize: 11.5, color: s.future ? C.faint : C.sub }}>
            {s.future ? "—" : `${s.sealed}/${s.elapsed}`}
          </span>
        </div>
      ))}
    </section>
  );
}

export default function Year({ data, now, workout, goalDone, yearChecked, onToggleGoal, onSetWorkoutTarget, onGoToLog }) {
  const { adherence, completed, scheduled, target } = workout;
  const daysLeft = Math.max(daysBetween(now, END) + 1, 0);
  const logs = data.logs;

  return (
    <>
      <div style={{ display: "flex", justifyContent: "center", margin: "14px 0 4px" }}>
        <Ring pct={yearChecked / YEAR_TOTAL} closed={false} streak={yearChecked} sub={`of ${YEAR_TOTAL}`} />
      </div>
      <div style={{ textAlign: "center", marginBottom: 12 }}>
        <span className="r26-eyebrow">{yearChecked} of {YEAR_TOTAL} milestones · {daysLeft} days left</span>
      </div>

      <MonthHistory days={data.days} now={now} />

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
                      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "0 0 8px 34px" }}>
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
