/*
  Service worker: offline precache + the daily reminder push.

  Tone rule applies here too — a notification is the app's voice on a day
  Jimmy might be avoiding it. Invitations, never scolding. No streak
  threats, no "you missed a day."
*/
import { precacheAndRoute, cleanupOutdatedCaches } from "workbox-precaching";

precacheAndRoute(self.__WB_MANIFEST);
cleanupOutdatedCaches();

self.skipWaiting();
self.addEventListener("activate", (e) => e.waitUntil(self.clients.claim()));

const APP_URL = "/reset-2026/";

self.addEventListener("push", (event) => {
  let payload = {};
  try {
    payload = event.data ? event.data.json() : {};
  } catch {
    payload = { body: event.data?.text() };
  }

  const title = payload.title || "2026 Reset";
  const options = {
    body: payload.body || "One box is enough today.",
    icon: `${APP_URL}icon-192.png`,
    badge: `${APP_URL}icon-192.png`,
    tag: "daily-reset",          // replaces any older nudge instead of stacking
    renotify: false,
    requireInteraction: false,   // never trap the notification on screen
    silent: false,
    data: { url: payload.url || APP_URL },
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const target = event.notification.data?.url || APP_URL;

  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((list) => {
      // Focus the app if it's already open somewhere.
      for (const c of list) {
        if (c.url.includes(APP_URL) && "focus" in c) return c.focus();
      }
      return self.clients.openWindow(target);
    })
  );
});
