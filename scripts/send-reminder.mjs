/*
  Sends the daily reminder push. Run by .github/workflows/reminder.yml.

  Tone: an open door, never a scold. The app exists to break a rumination
  trap — a notification that says "you're falling behind" would feed it.
  So: no streak counts, no guilt, no urgency. Just an invitation.
*/
import webpush from "web-push";

const { VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY, PUSH_SUBSCRIPTION, VAPID_SUBJECT } = process.env;

if (!VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY) {
  console.error("Missing VAPID keys. Set VAPID_PUBLIC_KEY and VAPID_PRIVATE_KEY secrets.");
  process.exit(1);
}
if (!PUSH_SUBSCRIPTION) {
  console.log("No PUSH_SUBSCRIPTION secret set yet — nothing to send. Turn on reminders in the app, then add the secret.");
  process.exit(0);
}

webpush.setVapidDetails(VAPID_SUBJECT || "mailto:ericjimm44@gmail.com", VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);

const NUDGES = [
  { title: "2026 Reset", body: "One box is enough today." },
  { title: "2026 Reset", body: "What's the next box you can check?" },
  { title: "2026 Reset", body: "The circle is waiting. No rush." },
  { title: "2026 Reset", body: "Small and honest beats big and imagined." },
  { title: "2026 Reset", body: "Even on a hard day, one thing counts." },
  { title: "2026 Reset", body: "A minute here is enough to keep going." },
  { title: "2026 Reset", body: "Nothing to solve. Just one box." },
];

// Rotate by day-of-year so it doesn't read like the same robot every morning.
const dayOfYear = Math.floor((Date.now() - Date.UTC(new Date().getUTCFullYear(), 0, 0)) / 86400000);
const pick = NUDGES[dayOfYear % NUDGES.length];

let subscription;
try {
  subscription = JSON.parse(PUSH_SUBSCRIPTION);
} catch {
  console.error("PUSH_SUBSCRIPTION isn't valid JSON. Re-copy it from the app's Settings screen.");
  process.exit(1);
}

try {
  await webpush.sendNotification(
    subscription,
    JSON.stringify({ ...pick, url: "/reset-2026/" })
  );
  console.log(`Sent: "${pick.body}"`);
} catch (err) {
  // 404/410 mean the browser threw the subscription away — it needs re-adding,
  // but that's not a reason to fail the workflow every day afterwards.
  if (err.statusCode === 404 || err.statusCode === 410) {
    console.log("Subscription expired. Open the app → Settings → Turn on reminders, then update the PUSH_SUBSCRIPTION secret.");
    process.exit(0);
  }
  console.error("Push failed:", err.statusCode, err.body || err.message);
  process.exit(1);
}
