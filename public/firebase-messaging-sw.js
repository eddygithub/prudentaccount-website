/* public/firebase-messaging-sw.js */
/* eslint-disable no-undef */
// Import the compat scripts for SW (recommended pattern by Firebase)
importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js");

// Must match your env (safe to inline in SW; or generate at build time)
firebase.initializeApp({
  apiKey: "AIzaSyC2OaLtQKs24V-oJIbXzljbRzYCxC1Im8E",
  authDomain: "prudent-insurance-fcm-service.firebaseapp.com",
  projectId: "prudent-insurance-fcm-service",
  storageBucket: "prudent-insurance-fcm-service.firebasestorage.app",
  messagingSenderId: "1058759897449",
  appId: "1:1058759897449:web:dede1788a7ce1c6a0f4df8",
  measurementId: "G-W4JBXHEFH6"
});

const messaging = firebase.messaging();

// Background handler: show a notification
messaging.onBackgroundMessage((payload) => {
  const title = payload?.notification?.title || "New message";
  const body  = payload?.notification?.body || "";
  const icon  = payload?.notification?.icon || "/icon-192.png";

  self.registration.showNotification(title, {
    body,
    icon,
    data: payload?.data || {},
    // tag, actions, etc. can be added here
  });
});

// Optional: handle clicks to focus or open a page
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = event.notification?.data?.url || "/";
  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if ("focus" in client) return client.focus();
      }
      if (clients.openWindow) return clients.openWindow(url);
    })
  );
});
