import { C } from "../../lib/theme";
import { PATH_FLAT, TOTAL_WEEKS, LISTEN } from "../../data/path";
import { weeksEngaged } from "../../lib/curriculum";
import { Screen } from "../ui";

/*
  For when the path feels like a deadline you're losing.

  The honest answer is that it isn't one: the path moves when Jimmy moves,
  not when the calendar does. So this screen does three things and nothing
  else — reframe it, hand him the single smallest thing in the current week,
  and show the evidence that he has in fact been moving.

  No catch-up plans. No "you're N weeks behind." That math is the trap.
*/
export default function Behind({ data, actions, onBack }) {
  const pw = data.settings?.pathWeek || 1;
  const idx = Math.max(0, PATH_FLAT.findIndex((w) => w.n === pw));
  const wk = PATH_FLAT[idx] || PATH_FLAT[0];
  const next = PATH_FLAT[idx + 1];
  const prog = data.pathProgress?.[wk.n] || { projects: {}, milestone: false, notes: "" };

  // The smallest real thing available in this week, in order of lightness.
  const projectIdx = (wk.projects || []).findIndex((_, i) => !prog.projects?.[i]);
  const lightest =
    projectIdx >= 0
      ? { kind: "project", text: wk.projects[projectIdx], onDo: () => actions.togglePathProject(wk.n, projectIdx) }
      : !prog.milestone
      ? { kind: "milestone", text: wk.milestone, onDo: () => actions.togglePathMilestone(wk.n) }
      : null;

  const booksDone = (data.logs?.books || []).length;
  const weeks = weeksEngaged(data.pathProgress);
  const sealed = Object.values(data.days || {}).filter((d) => d?.closed).length;

  return (
    <Screen title="Feeling behind?" sub="You&rsquo;re not. Here&rsquo;s where you actually are." onBack={onBack} backLabel="the Path">
      <div className="r26-card">
        <p className="r26-serif" style={{ fontSize: 17, lineHeight: 1.6, color: C.ink, margin: 0 }}>
          The path isn&rsquo;t a schedule. It&rsquo;s a sequence.
        </p>
        <p style={{ fontSize: 13.5, color: C.sub, lineHeight: 1.65, marginBottom: 0 }}>
          You&rsquo;re on Week {wk.n} because that&rsquo;s where you are in the books — not because of
          what today&rsquo;s date is. Nothing here expires. Nothing is late. The path waits for you,
          and it moves when you move.
        </p>
      </div>

      {lightest ? (
        <div className="r26-card">
          <div className="r26-grouphead">The lightest thing in this week</div>
          <button className="r26-nextstep" style={{ boxShadow: "none" }} onClick={lightest.onDo}>
            <span style={{ flex: 1 }}>
              <span style={{ display: "block", fontSize: 11, letterSpacing: 1, textTransform: "uppercase", color: C.faint }}>
                {lightest.kind === "milestone" ? "Milestone" : "One project"}
              </span>
              <span style={{ fontSize: 15, color: C.ink }}>{lightest.text}</span>
            </span>
            <span style={{ width: 24, height: 24, borderRadius: 12, border: `1.6px solid ${C.line}`, flexShrink: 0 }} />
          </button>
          {wk.read && (
            <p style={{ fontSize: 12.5, color: C.faint, margin: "10px 0 0" }}>
              Or just read: {wk.read}
            </p>
          )}
          {LISTEN[wk.n] && (
            <p style={{ fontSize: 12.5, color: C.faint, margin: "6px 0 0" }}>
              Or put on {LISTEN[wk.n].who} while you do something else.
            </p>
          )}
        </div>
      ) : (
        <div className="r26-card" style={{ textAlign: "center", padding: "22px 18px" }}>
          <div className="r26-serif" style={{ fontSize: 16.5, color: C.mossDeep }}>
            Week {wk.n} is already done.
          </div>
          <p style={{ fontSize: 13, color: C.sub, marginBottom: 0 }}>
            You were further along than it felt.
          </p>
          {next && (
            <button className="r26-return" style={{ marginTop: 14 }} onClick={() => { actions.setPathWeek(next.n); onBack(); }}>
              Move to Week {next.n} when you&rsquo;re ready →
            </button>
          )}
        </div>
      )}

      <div className="r26-card">
        <div className="r26-grouphead">What you&rsquo;ve actually done</div>
        {[
          [booksDone, booksDone === 1 ? "book finished" : "books finished"],
          [weeks, weeks === 1 ? "week of the path worked" : "weeks of the path worked"],
          [sealed, sealed === 1 ? "day sealed" : "days sealed"],
        ].map(([n, label], i) => (
          <div key={i} style={{ display: "flex", alignItems: "baseline", gap: 12, minHeight: 40, borderTop: i > 0 ? "1px solid rgba(216,210,196,0.4)" : "none" }}>
            <span className="r26-serif" style={{ fontSize: 22, color: C.ink, minWidth: 34 }}>{n}</span>
            <span style={{ fontSize: 13.5, color: C.sub }}>{label}</span>
          </div>
        ))}
        <p style={{ fontSize: 12, color: C.faint, margin: "10px 0 0" }}>
          Week {wk.n} of {TOTAL_WEEKS}, at your pace.
        </p>
      </div>

      <p className="r26-mantra">You are not behind. You are somewhere on your own path.</p>
    </Screen>
  );
}
