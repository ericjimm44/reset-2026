import { C } from "../../lib/theme";
import { WHYS } from "../../data/voice";
import { Screen } from "../ui";
import { GroupIcon } from "../Icons";

export default function Why({ onBack }) {
  return (
    <Screen title="Why This" sub="Remember your why." onBack={onBack}>
      <div className="r26-card" style={{ padding: "10px 22px" }}>
        {WHYS.map((w, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 16, minHeight: 56, borderTop: i > 0 ? "1px solid rgba(216,210,196,0.4)" : "none" }}>
            <GroupIcon k={w.icon} size={21} color={C.mossDeep} />
            <span style={{ fontSize: 15, color: C.ink }}>{w.text}</span>
          </div>
        ))}
      </div>
    </Screen>
  );
}
