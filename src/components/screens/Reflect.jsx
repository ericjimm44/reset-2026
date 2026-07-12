import { REFLECT } from "../../data/daily";
import { Screen } from "../ui";

export default function Reflect({ today, setRefl, onBack }) {
  return (
    <Screen title="Reflection" sub="How was your day?" onBack={onBack}>
      {REFLECT.map(([k, label]) => (
        <div key={k} className="r26-card">
          <label className="r26-reflabel" style={{ fontSize: 14 }}>{label}</label>
          <textarea className="r26-text" rows={3}
            value={today.reflection[k] || ""} onChange={(e) => setRefl(k, e.target.value)} />
        </div>
      ))}
    </Screen>
  );
}
