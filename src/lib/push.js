// Daily reminder plumbing. The public VAPID key is safe to ship — it only
// identifies who's allowed to push; the private half lives in a GitHub secret.
export const VAPID_PUBLIC_KEY =
  "BBFiNDUBHTL-27wbs6YbGu2loHS0Mvy_HpSgC-ke7Jw18HJV31n0EL5f053FmUvDan5lVPxlWOON8THzHDttois";

export const pushSupported = () =>
  typeof window !== "undefined" &&
  "serviceWorker" in navigator &&
  "PushManager" in window &&
  "Notification" in window;

// iOS only allows push once the app is installed to the home screen.
export const isStandalone = () =>
  window.matchMedia?.("(display-mode: standalone)").matches || window.navigator.standalone === true;

export const isIOS = () => /iphone|ipad|ipod/i.test(navigator.userAgent);

const urlBase64ToUint8Array = (base64String) => {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = window.atob(base64);
  return Uint8Array.from([...raw].map((c) => c.charCodeAt(0)));
};

export async function getExistingSubscription() {
  if (!pushSupported()) return null;
  const reg = await navigator.serviceWorker.ready;
  return reg.pushManager.getSubscription();
}

// Asks permission, then subscribes. Returns the subscription JSON to paste
// into the GitHub secret that the daily workflow sends from.
export async function subscribeToPush() {
  if (!pushSupported()) throw new Error("This browser can't do notifications.");

  const permission = await Notification.requestPermission();
  if (permission !== "granted") throw new Error("Notifications are blocked. Allow them in your browser settings, then try again.");

  const reg = await navigator.serviceWorker.ready;
  const existing = await reg.pushManager.getSubscription();
  if (existing) return existing;

  return reg.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
  });
}

export async function unsubscribeFromPush() {
  const sub = await getExistingSubscription();
  if (sub) await sub.unsubscribe();
}

// Local test — proves the service worker can display a notification,
// without involving the network at all.
export async function testNotification() {
  const reg = await navigator.serviceWorker.ready;
  await reg.showNotification("2026 Reset", {
    body: "This is what your daily nudge will look like.",
    icon: "/reset-2026/icon-192.png",
    tag: "daily-reset",
  });
}
