import { C } from "../../lib/theme";
import { GROUPS, ONE_RULE } from "../../data/daily";
import { Screen } from "../ui";
import { GroupIcon } from "../Icons";

/*
  For the overwhelmed days. Not the whole list — just one small,
  doable thing per area of life. Tap it, it's done, the next one
  appears. Progress without having to solve anything.
*/
export default function Overwhelmed({ today, toggleCheck, onBack }) {
  const rows = GROUPS.map((g) => {
    const items = g.items.filter((i) => i.withKids === undefined || i.withKids === today.hasKids);
    const next = items.find((i) => !today.checks[i.id]);
    const done = items.filter((i) => today.checks[i.id]).length;
    return { g, next, done, total: items.length };
  });
  const allDone = rows.every((r) => !r.next);

  return (
    <Screen title="Feeling overwhelmed?" sub="One small thing per area. That's all." onBack={onBack}>
      <p style={{ fontSize: 13.5, color: C.sub, textAlign: "center", lineHeight: 1.6, margin: "0 0 18px", padding: "0 10px" }}>
        {ONE_RULE}
      </p>

      {allDone ? (
        <div className="r26-card" style={{ textAlign: "center", padding: "26px 18px" }}>
          <div className="r26-serif" style={{ fontSize: 17, color: C.mossDeep }}>Everything is already done.</div>
          <div style={{ fontSize: 13, color: C.sub, marginTop: 6 }}>The overwhelm was lying to you. Rest now.</div>
        </div>
      ) : (
        rows.map(({ g, next, done, total }) => (
          <div key={g.key} className="r26-card" style={{ padding: "12px 16px", marginBottom: 10 }}>
            {next ? (
              <button onClick={() => toggleCheck(next.id)}
                style={{ display: "flex", alignItems: "center", gap: 13, width: "100%", minHeight: 48, background: "none", border: "none", cursor: "pointer", textAlign: "left", padding: 0 }}>
                <GroupIcon k={g.key} size={20} color={C.mossDeep} />
                <span style={{ flex: 1 }}>
                  <span style={{ display: "block", fontSize: 11, letterSpacing: 1, textTransform: "uppercase", color: C.faint }}>{g.label}</span>
                  <span style={{ fontSize: 14.5, color: C.ink }}>{next.text}</span>
                </span>
                <span style={{ width: 24, height: 24, borderRadius: 12, border: `1.6px solid ${C.line}`, flexShrink: 0 }} />
              </button>
            ) : (
              <div style={{ display: "flex", alignItems: "center", gap: 13, minHeight: 40, opacity: 0.7 }}>
                <GroupIcon k={g.key} size={20} color={C.faint} />
                <span style={{ flex: 1 }}>
                  <span style={{ display: "block", fontSize: 11, letterSpacing: 1, textTransform: "uppercase", color: C.faint }}>{g.label}</span>
                  <span style={{ fontSize: 13.5, color: C.mossDeep }}>All done here.</span>
                </span>
              </div>
            )}
            {total > 1 && <div style={{ fontSize: 10.5, color: C.faint, marginTop: 4, paddingLeft: 33 }}>{done} of {total} in this area</div>}
          </div>
        ))
      )}

      <p className="r26-mantra" style={{ marginTop: 12 }}>You don&rsquo;t have to do it all. Just the next box.</p>
    </Screen>
  );
}
