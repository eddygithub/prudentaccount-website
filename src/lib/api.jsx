// src/lib/api.jsx
const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8080";

function clientHeaders() {
  // Optional: include language/timezone if you’re doing i18n on the server
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
  return {
    "Accept-Language": navigator.language || "en-US",
    "X-Timezone": tz,
  };
}

async function request(method, path, body) {
  const init = {
    method,
    credentials: "include", // send/receive httpOnly session cookie
    headers: { ...clientHeaders() },
  };
  if (body !== undefined) {
    init.headers["Content-Type"] = "application/json";
    init.body = JSON.stringify(body);
  }

  const res = await fetch(`${API_BASE}${path}`, init);
  if (!res.ok) {
    let msg = `HTTP ${res.status}`;
    try {
      const j = await res.json();
      if (j?.error || j?.message) msg += ` — ${j.error || j.message}`;
    } catch {}
    throw new Error(msg);
  }
  // Gracefully handle empty bodies
  const ct = res.headers.get("content-type") || "";
  return ct.includes("application/json") ? res.json() : {};
}

export const api = {
  get: (path) => request("GET", path),
  post: (path, body) => request("POST", path, body),
  // Auth-specific helpers
  authWithGoogleCode: (code) => request("POST", "/auth/google/code", { code }),
  me: () => request("GET", "/me"),
  logout: () => request("POST", "/auth/logout"),
};

export default api;
