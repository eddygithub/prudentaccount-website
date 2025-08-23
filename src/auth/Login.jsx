// src/pages/LoginPage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8080";

async function postJSON(path, body) {
  const r = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(body),
  });
  if (!r.ok) {
    let msg = `HTTP ${r.status}`; try {
      const j = await r.json(); if (j?.error || j?.message) msg += ` — ${j.error || j.message}`;
    } catch {}
    throw new Error(msg);
  }
  return r.json().catch(() => ({}));
}

export default function LoginPage({ onSignedIn }) {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const login = useGoogleLogin({
    flow: "auth-code",
    prompt: "select_account",     // always show the chooser (Atlas-style)
    onSuccess: async ({ code }) => {
      setError(""); setLoading(true);
      try {
        const profile = await postJSON("/auth/google/code", { code });
        onSignedIn?.(profile);
        navigate("/");
      } catch (e) {
        setError(e.message || "Google sign-in failed.");
      } finally {
        setLoading(false);
      }
    },
    onError: () => setError("Google sign-in failed."),
  });

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-200 antialiased flex items-center justify-center p-2">
      <div className="w-full max-w-md">
        {/* ...your brand + optional email/password form... */}

        <div className="rounded-2xl bg-white p-6 shadow-lg ring-1 ring-slate-200">
          {/* …divider… */}
          <div className="flex justify-center">
            <button
              type="button"
              onClick={() => login()}
              disabled={loading}
              className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60"
            >
              Continue with Google
            </button>
          </div>
          {error && <p className="mt-3 text-xs text-red-600 text-center">{error}</p>}
        </div>
      </div>
    </main>
  );
}