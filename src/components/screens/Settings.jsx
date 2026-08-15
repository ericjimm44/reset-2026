import { useState, useEffect } from "react";
import { C } from "../../lib/theme";
import { Screen } from "../ui";
import { pushSupported, isIOS, isStandalone, getExistingSubscription, subscribeToPush, unsubscribeFromPush, testNotification } from "../../lib/push";

/*
  Housekeeping lives here so the hub stays quiet.
  Data is device-local; the export is the only copy that leaves this browser.
*/
export default function Settings({ onExport, onImport, onReset, onBack }) {
  const [backup, setBackup] = useState(null);
  const [confirmReset, setConfirmReset] = useState(false);
  const [note, setNote] = useState(null);

  // ——— daily reminder ———
  const [sub, setSub] = useState(null);
  const [subJson, setSubJson] = useState(null);
  const [pushNote, setPushNote] = useState(null);
  const [busy, setBusy] = useState(false);
  const supported = pushSupported();
  const needsInstall = isIOS() && !isStandalone();

  useEffect(() => {
    getExistingSubscription().then(setSub).catch(() => {});
  }, []);

  const doSubscribe = async () => {
    setBusy(true);
    setPushNote(null);
    try {
      const s = await subscribeToPush();
      setSub(s);
      setSubJson(JSON.stringify(s));
      setPushNote("Notifications are on for this device. Last step below.");
    } catch (e) {
      setPushNote(e.message);
    }
    setBusy(false);
  };

  return (
    <Screen title="Settings" sub="Housekeeping, out of the way." onBack={onBack}>
      {/* ——— daily reminder ——— */}
      <div className="r26-card">
        <div className="r26-grouphead">Daily reminder</div>
        {!supported ? (
          <p style={{ fontSize: 12.5, color: C.sub, marginTop: 0, marginBottom: 0 }}>
            This browser can&rsquo;t send notifications. Open the app on your phone to set up a daily nudge.
          </p>
        ) : needsInstall ? (
          <p style={{ fontSize: 12.5, color: C.sub, marginTop: 0, marginBottom: 0 }}>
            On iPhone, add this app to your home screen first (Share → Add to Home Screen), then open it
            from that icon and come back here.
          </p>
        ) : (
          <>
            <p style={{ fontSize: 12.5, color: C.sub, marginTop: 0 }}>
              A quiet nudge once a day. No streak threats — just an open door.
            </p>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {!sub ? (
                <button className="r26-mini" onClick={doSubscribe} disabled={busy}>
                  {busy ? "Asking…" : "Turn on reminders"}
                </button>
              ) : (
                <>
                  <button className="r26-mini" onClick={() => testNotification()}>Send a test</button>
                  <button className="r26-mini" onClick={() => { setSubJson(JSON.stringify(sub)); }}>Show my code</button>
                  <button className="r26-link" style={{ marginLeft: "auto" }}
                    onClick={async () => { await unsubscribeFromPush(); setSub(null); setSubJson(null); setPushNote("Reminders off."); }}>
                    Turn off
                  </button>
                </>
              )}
            </div>

            {subJson && (
              <div style={{ marginTop: 12 }}>
                <p style={{ fontSize: 12.5, color: C.sub, marginTop: 0 }}>
                  Paste this into your GitHub repo under <b>Settings → Secrets and variables → Actions</b>,
                  as a secret named <b>PUSH_SUBSCRIPTION</b>. One time only.
                </p>
                <textarea className="r26-text" rows={4} readOnly value={subJson}
                  style={{ fontFamily: "monospace", fontSize: 10.5 }} />
                <button className="r26-mini" style={{ marginTop: 8 }}
                  onClick={() => { navigator.clipboard?.writeText(subJson); setPushNote("Copied."); }}>
                  Copy code
                </button>
              </div>
            )}

            {pushNote && (
              <p style={{ fontSize: 12.5, color: pushNote.includes("blocked") || pushNote.includes("can't") ? C.seal : C.mossDeep, marginBottom: 0 }}>
                {pushNote}
              </p>
            )}
          </>
        )}
      </div>

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
