// src/auth/AuthProvider.jsx
import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { googleLogout } from "@react-oauth/google"
import api, { getAccessToken, setAccessToken, clearAccessToken } from "@/lib/api";

const AuthCtx = createContext(null);

/** Minimal JWT decoder (for legacy Google ID token path) */
function decodeJwt(token) {
  try {
    const [, payload] = token.split(".");
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64 + "===".slice((base64.length + 3) % 4);
    const json = atob(padded);
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // Hydrate user from localStorage on load (normalize {profile:{...}} → {...})
useEffect(() => {
  (async () => {
    try {
      const r = await api.refresh();                // POST /public/auth/refresh
      if (r?.accessToken) {
        const me = await api.me();                  // GET /me (now sends Authorization)
        setUser(me);
        localStorage.setItem("auth:user", JSON.stringify(me)); // optional
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    }
  })();
}, []);


  /** Persist normalized user to localStorage */
  const persistUser = useCallback((u) => {
    const normalized = u?.profile ?? u ?? null;
    setUser(normalized);
    if (normalized) localStorage.setItem("auth:user", JSON.stringify(normalized));
    else localStorage.removeItem("auth:user");
  }, []);

  /** Ensure we have a Bearer access token; try a refresh if missing */
  const ensureAccessToken = useCallback(async () => {
    if (getAccessToken()) return true;
    try {
      const { accessToken } = await api.refresh();
      if (accessToken) {
        setAccessToken(accessToken);
        return true;
      }
    } catch {
      /* no-op */
    }
    return false;
  }, []);

  /**
   * Call this after any successful auth flow.
   * Optionally pass the freshly minted accessToken so we skip a refresh.
   */
  const onAuthSuccess = useCallback(
    async (profile, accessToken) => {
      if (accessToken) setAccessToken(accessToken);
      persistUser(profile);
      // best-effort FCM registration
    },
    [persistUser]
  );

  /** Legacy: sign in with a Google ID token (if you still call this anywhere) */
  const signInWithIdToken = useCallback(
    (credential) => {
      const payload = decodeJwt(credential);
      if (!payload) return;
      const u = {
        name: payload.name,
        email: payload.email,
        picture: payload.picture,
        sub: payload.sub,
      };
      onAuthSuccess(u);
    },
    [onAuthSuccess]
  );

  /** Fully sign out: backend revoke + clear cookies + clear local state */
  const signOut = useCallback(async () => {
    try {
      await api.logout();
    } catch {
      /* ignore */
    } finally {
      try {
        googleLogout(); // safe to call even if GIS not active
      } catch {
        /* ignore */
      }
      clearAccessToken();
      // Clear all per-user FCM marks
      const saved = localStorage.getItem("auth:user");
      if (saved) {
        try {
          const u = JSON.parse(saved)?.profile ?? JSON.parse(saved);
          const markKey = `fcm:token:registered:${u?.email ?? u?.id ?? "anon"}`;
          localStorage.removeItem(markKey);
        } catch {}
      }
      localStorage.removeItem("auth:user");
      // keep "fcm:token" if you want to unregister later; otherwise:
      // localStorage.removeItem("fcm:token");
      setUser(null);
    }
  }, []);

  return (
    <AuthCtx.Provider
      value={{
        user,
        setUser: persistUser,
        onAuthSuccess,
        signInWithIdToken, // legacy/optional
        signOut,
        ensureAccessToken,  // optional helper if you need it elsewhere
      }}
    >
      {children}
    </AuthCtx.Provider>
  );
}

export function useAuth() {
  return useContext(AuthCtx);
}
