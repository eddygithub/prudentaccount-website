// src/lib/fcm.js -- Not Used
import { initializeApp, getApps, getApp } from "firebase/app";
import { getMessaging, getToken, onMessage, isSupported } from "firebase/messaging";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FB_API_KEY,
  authDomain: import.meta.env.VITE_FB_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FB_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FB_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FB_SENDER_ID,
  appId: import.meta.env.VITE_FB_APP_ID,
};

const SW_URL = "/public/firebase-messaging-sw.js";

// --- simple singletons ---
let _app = null;
let _messaging = null;

function ensureFirebase() {
  if (!_app) _app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  if (!_messaging) _messaging = getMessaging(_app);
  return _messaging;
}

function whenActivated(reg) {
  if (reg.active) return Promise.resolve(reg);
  return new Promise((resolve) => {
    const tryResolve = () => reg.active && resolve(reg);

    if (reg.installing) {
      reg.installing.addEventListener("statechange", () => {
        if (reg.installing?.state === "activated") tryResolve();
      });
    }
    if (reg.waiting) {
      reg.waiting.addEventListener("statechange", () => {
        if (reg.waiting?.state === "activated") tryResolve();
      });
    }
    navigator.serviceWorker.addEventListener("controllerchange", tryResolve);
  });
}

/**
 * Initialize FCM, request notification permission, register SW,
 * and return the FCM token (or null if denied/unsupported).
 */
export async function initFcm(vapidKey) {
   console.log("FCM: initializing with VAPID key:", vapidKey);
  if (!(await isSupported())) {
    console.warn("FCM not supported in this browser.");
    return null;
  }

  // Ask permission first
  if (typeof Notification === "undefined") return null;
  const perm = await Notification.requestPermission();
  if (perm !== "granted") return null;

  // Register the SW at the origin root (Vite copies /public there)
//   let reg = await navigator.serviceWorker.getRegistration();

//   console.log("FCM: service worker registration found:", reg);
  if (!reg) reg = await navigator.serviceWorker.register(SW_URL, { scope: "/" });

  await whenActivated(reg);

  // Init firebase/messaging singletons
  const messaging = ensureFirebase();

  // Get token bound to this SW
  const token = await getToken(messaging, { vapidKey, serviceWorkerRegistration: reg });
  return token || null;
}

/**
 * Foreground messages (tab open/active).
 * Returns an unsubscribe function.
 */
export function onForegroundMessage(callback) {
  try {
    const messaging = ensureFirebase();
    return onMessage(messaging, (payload) => {
      // payload.notification / payload.data
      callback?.(payload);
    });
  } catch (e) {
    console.warn("onForegroundMessage skipped:", e?.message || e);
    return () => {};
  }
}
