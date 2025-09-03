// src/lib/api.jsx
let ACCESS_TOKEN = null; // in-memory only

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8080";

/** Optional client hints (match server CORS allow-list) */
function clientHeaders() {
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
  return {
    "Accept-Language": navigator.language || "en-US",
    "X-Timezone": tz,
  };
}

/** Set / clear access token (in memory) */
export function setAccessToken(token) {
  ACCESS_TOKEN = token || null;
}
export function getAccessToken() {
  return ACCESS_TOKEN;
}
export function clearAccessToken() {
  ACCESS_TOKEN = null;
}

/** Low-level fetch wrapper with auto refresh+retry */
async function request(method, path, body) {
  const headers = { ...clientHeaders() };
  if (ACCESS_TOKEN) headers.Authorization = `Bearer ${ACCESS_TOKEN}`;
  if (body !== undefined) headers["Content-Type"] = "application/json";

  const run = () =>
    fetch(`${API_BASE}${path}`, {
      method,
      headers,
      credentials: "include", // needed for refresh cookie
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });

  let res = await run();

  // If access token expired, try refresh once then retry the original request
  if (res.status === 401 && path !== "/auth/refresh") {
    const ok = await refreshAccessToken();
    if (ok) {
      // update header and retry
      const h2 = { ...headers, Authorization: `Bearer ${ACCESS_TOKEN}` };
      res = await fetch(`${API_BASE}${path}`, {
        method,
        headers: h2,
        credentials: "include",
        body: body !== undefined ? JSON.stringify(body) : undefined,
      });
    }
  }

  if (!res.ok) {
    // Build a helpful error
    let msg = `HTTP ${res.status}`;
    try {
      const j = await res.json();
      if (j?.error || j?.message) msg += ` — ${j.error || j.message}`;
    } catch {}
    const err = new Error(msg);
    err.status = res.status;
    throw err;
  }

  // Handle empty bodies gracefully
  const ct = res.headers.get("content-type") || "";
  return ct.includes("application/json") ? res.json() : {};
}

/** Ask server to mint a new access token using the HttpOnly refresh cookie */
async function refreshAccessToken() {
  try {
    const res = await fetch(`${API_BASE}/auth/refresh`, {
      method: "POST",
      credentials: "include",
      headers: clientHeaders(),
    });
    if (!res.ok) return false;
    const data = await res.json();
    if (data?.accessToken) {
      setAccessToken(data.accessToken);
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

/* -------------------------
   Public API surface
-------------------------- */

/** Generic helpers */
const get = (path) => request("GET", path);
const post = (path, body) => request("POST", path, body);
const put = (path, body) => request("PUT", path, body);
const del = (path) => request("DELETE", path);

/** Auth flows */

/**
 * Exchange Google auth code for tokens+profile.
 * Returns: { requiresRegistration: boolean, accessToken: string, profile: {...} }
 * Side effect: stores access token in memory.
 */
async function authWithGoogleCode(code) {
  const data = await post("/auth/google/code", { code });
  if (data?.accessToken) setAccessToken(data.accessToken);
  return data;
}

/** Complete registration (works for PENDING users). Returns new accessToken + profile. */
async function completeRegistration(form) {
  const data = await post("/users/register", form);
  if (data?.accessToken) setAccessToken(data.accessToken);
  return data;
}

/** Get current user profile from server using Bearer access token */
async function me() {
  return get("/me"); // throws if 401
}

/** Logout: revokes via tokenVersion and clears refresh cookie. */
async function logout() {
  try {
    await post("/auth/logout");
  } finally {
    clearAccessToken();
  }
}

/** Export as both named and default for convenience */
export const api = {
  get,
  post,
  put,
  del,
  me,
  logout,
  authWithGoogleCode,
  completeRegistration,
  setAccessToken,
  getAccessToken,
  clearAccessToken,
};

export default api;
