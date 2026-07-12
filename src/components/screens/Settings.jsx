import { useState } from "react";
import { C } from "../../lib/theme";
import { Screen } from "../ui";

/*
  Housekeeping lives here so the hub stays quiet.
  Data is device-local; the export is the only copy that leaves this browser.
*/
export default function Settings({ onExport, onImport, onReset, onBack }) {
  const [backup, setBackup] = useState(null);
  const [confirmReset, setConfirmReset] = useState(false);
  const [note, setNote] = useState(null);

  return (
    <Screen title="Settings" sub="Housekeeping, out of the way." onBack={onBack}>
      <div className="r26-card">
        <div className="r26-grouphead">Backup &amp; restore</div>
        <p style={{ fontSize: 12.5, color: C.sub, marginTop: 0 }}>
          Your data lives on this device only. Copy this somewhere safe; paste it back to restore or move devices.
        </p>
        {backup === null ? (
          <button className="r26-mini" onClick={() => { setBackup(onExport()); setNote(null); }}>Show my data</button>
        ) : (
          <>
            <textarea className="r26-text" rows={5} value={backup} onChange={(e) => setBackup(e.target.value)}
              style={{ fontFamily: "monospace", fontSize: 11 }} />
            <div style={{ display: "flex", gap: 10, marginTop: 10, flexWrap: "wrap" }}>
              <button className="r26-mini" onClick={() => { navigator.clipboard?.writeText(backup); setNote("Copied."); }}>Copy</button>
              <button className="r26-mini" onClick={() => {
                try { onImport(backup); setBackup(null); setNote("Restored."); }
                catch { setNote("That backup couldn't be read. Check it was pasted whole."); }
              }}>Restore</button>
              <button className="r26-link" style={{ marginLeft: "auto" }} onClick={() => setBackup(null)}>Close</button>
            </div>
          </>
        )}
        {note && <p style={{ fontSize: 12.5, color: note.startsWith("That") ? C.seal : C.mossDeep, marginBottom: 0 }}>{note}</p>}
      </div>

      <div className="r26-card">
        <div className="r26-grouphead" style={{ color: C.seal }}>Start over</div>
        <p style={{ fontSize: 12.5, color: C.sub, marginTop: 0 }}>
          Erases everything on this device. Export a backup first if there&rsquo;s any doubt.
        </p>
        {confirmReset ? (
          <span style={{ fontSize: 13, color: C.sub }}>
            Erase everything?{" "}
            <button className="r26-mini" style={{ borderColor: C.seal, color: C.seal }} onClick={() => { onReset(); setConfirmReset(false); }}>Yes, erase</button>
            {" "}
            <button className="r26-mini" onClick={() => setConfirmReset(false)}>Keep it</button>
          </span>
        ) : (
          <button className="r26-mini" onClick={() => setConfirmReset(true)}>Reset the app</button>
        )}
      </div>
    </Screen>
  );
}
