let ACCESS_TOKEN = null; // in-memory only (clears on tab refresh)

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8080";

/* -------------------------
   Client hints (CORS allow-listed)
-------------------------- */
function clientHeaders() {
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
  return {
    "Accept-Language": navigator.language || "en-US",
    "X-Timezone": tz,
  };
}

/* -------------------------
   Access token helpers (in-memory)
-------------------------- */
export function setAccessToken(token) {
  ACCESS_TOKEN = token || null;
}
export function getAccessToken() {
  return ACCESS_TOKEN;
}
export function clearAccessToken() {
  ACCESS_TOKEN = null;
}

/* -------------------------
   Low-level fetch with auto refresh + retry
-------------------------- */
async function request(method, path, body) {
  console.log("ACCESS_TOKEN", ACCESS_TOKEN);
  const headers = { ...clientHeaders() };
  if (ACCESS_TOKEN) headers.Authorization = `Bearer ${ACCESS_TOKEN}`;
  if (body !== undefined) headers["Content-Type"] = "application/json";

  const run = () =>
    fetch(`${API_BASE}${path}`, {
      method,
      headers,
      credentials: "include", // include refresh cookie
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });

  let res = await run();

  // If access token expired, try refresh once, then retry original
  if (res.status === 401 && path !== "/public/auth/refresh") {
    const ok = await refreshAccessToken();
    if (ok) {
      const retryHeaders = { ...headers, Authorization: `Bearer ${ACCESS_TOKEN}` };
      res = await fetch(`${API_BASE}${path}`, {
        method,
        headers: retryHeaders,
        credentials: "include",
        body: body !== undefined ? JSON.stringify(body) : undefined,
      });
    }
  }

  if (!res.ok) {
    // 401 after refresh attempt → clear token so UI can react
    if (res.status === 401) clearAccessToken();

    let msg = `HTTP ${res.status}`;
    try {
      const j = await res.json();
      if (j?.error || j?.message) msg += ` — ${j.error || j.message}`;
    } catch {}
    const err = new Error(msg);
    err.status = res.status;
    throw err;
  }

  const ct = res.headers.get("content-type") || "";
  return ct.includes("application/json") ? res.json() : {};
}

/* -------------------------
   Refresh access via HttpOnly cookie
-------------------------- */
async function refreshAccessToken() {
  try {
    const res = await fetch(`${API_BASE}/public/auth/refresh`, {
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
   Convenience wrappers
-------------------------- */
const get  = (p)    => request("GET", p);
const post = (p, b) => request("POST", p, b);
const put  = (p, b) => request("PUT", p, b);
const del  = (p)    => request("DELETE", p);

/* -------------------------
   Auth + Registration API
-------------------------- */

// Google (auth code → tokens + profile)
async function authWithGoogleCode(code) {
  const data = await post("/public/auth/google/code", { code });
  if (data?.accessToken) setAccessToken(data.accessToken);
  return data; // { requiresRegistration?, accessToken?, profile }
}

// Username/password login
async function authWithPassword(email, password) {
  const data = await post("/public/auth/login", { email, password });
  if (data?.accessToken) setAccessToken(data.accessToken);
  return data; // { accessToken, profile }
}

// Public registration (email verification flow)
async function registerPublic(form) {
  // form = { name, email, password, phone?, notes?, agreeToTerms: true }
  const data = await post("/public/users/register", form);
  if (data?.accessToken) setAccessToken(data.accessToken); // if backend auto-logs-in
  return data;
}

// Resend verification email
async function resendVerification(email) {
  return post("/public/email/resend-verification", { email });
}

// Verify email link
async function verifyEmail(token) {
  const data = await get(`/public/verify-email?token=${encodeURIComponent(token)}`);
  if (data?.accessToken) setAccessToken(data.accessToken);
  return data; // { accessToken, profile }
}

// Complete registration for PENDING users (requires Bearer)
async function completeRegistration(form) {
  const data = await post("/users/register", form);
  if (data?.accessToken) setAccessToken(data.accessToken);
  return data; // { accessToken, profile }
}

// Who am I (requires Bearer)
async function me() {
  return get("/me");
}

// Logout (revokes + clears cookie + clears in-memory token)
async function logout() {
  try {
    await post("/public/auth/logout");
  } finally {
    clearAccessToken();
  }
}

/* -------------------------
   Quotes
-------------------------- */
async function submitQuoteRequest(payload) {
  return post("/public/quotes", payload); // 201 or 200 with { id }
}

async function getQuoteRequestCount(email) {
  const res = await get(`/public/quotes/count/${encodeURIComponent(email)}`);
  return res.count;
}

/* -------------------------
   Push (FCM) tokens
-------------------------- */

// Save or upsert browser’s FCM token (public or authenticated; backend decides)
async function saveFcmToken({ token, platform = "web"}) {
  if (!token) throw new Error("FCM token is required");
  // Uses the same request() wrapper so Authorization is added if present.
  return post("/public/push/tokens", { token, platform });
}

// Remove token (on sign-out/uninstall)
async function deleteFcmToken(token) {
  if (!token) return true;
  return del(`/public/push/tokens/${encodeURIComponent(token)}`);
}

/* -------------------------
   Export
-------------------------- */
export const api = {
  // generic
  get, post, put, del,

  // tokens
  setAccessToken,
  getAccessToken,
  clearAccessToken,

  // auth
  authWithGoogleCode,
  authWithPassword,
  refresh: () => post("/public/auth/refresh"),
  logout,
  me,

  // registration
  registerPublic,
  resendVerification,
  verifyEmail,
  completeRegistration,

  // quotes
  getQuoteRequestCount,
  submitQuoteRequest,

  // FCM
  saveFcmToken,
  deleteFcmToken,
};

export default api;
