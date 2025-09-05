// src/pages/LoginPage.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import GoogleButton from "react-google-button";
import api from "@/lib/api";

export default function LoginPage({ onSignedIn }) {
  const navigate = useNavigate();

  // form state
  const [error, setError] = useState("");
  const [submittingPwd, setSubmittingPwd] = useState(false);
  const [submittingGoogle, setSubmittingGoogle] = useState(false);

  // ---------- Email/Password sign in ----------
  async function onSubmitPassword(e) {
    e.preventDefault();
    setError("");
    setSubmittingPwd(true);
    try {
      const fd = new FormData(e.currentTarget);
      const email = fd.get("email");
      const password = fd.get("password");

      const res = await api.authWithPassword(email, password);
      const profile = res?.profile ?? res;

      onSignedIn?.(profile);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err.message || "Sign in failed.");
    } finally {
      setSubmittingPwd(false);
    }
  }

  // ---------- Google OAuth (auth-code flow via GIS) ----------
  const loginWithGoogle = useGoogleLogin({
    flow: "auth-code",
    ux_mode: "popup",
    prompt: "select_account", // always show chooser
    scope: "openid profile email",
    onSuccess: async ({ code }) => {
      setError("");
      setSubmittingGoogle(true);
      try {
        const res = await api.authWithGoogleCode(code);
        // { accessToken, profile, requiresRegistration? }
        const profile = res?.profile ?? res;
        const requiresRegistration = !!res?.requiresRegistration;

        onSignedIn?.(profile);
        navigate(requiresRegistration ? "/register" : "/dashboard", { replace: true });
      } catch (e) {
        setError(e.message || "Google sign-in failed.");
      } finally {
        setSubmittingGoogle(false);
      }
    },
    onError: () => setError("Google sign-in failed."),
  });

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-200 antialiased flex items-center justify-center p-3">
      <div className="w-full max-w-md">
        {/* Brand */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-3 grid h-20 w-20 place-items-center rounded-2xl bg-slate-900/90 text-white font-semibold">
            Prudent
          </div>
          <h1 className="text-2xl font-semibold text-slate-900">Welcome back</h1>
          <p className="mt-1 text-sm text-slate-600">Sign in to your account</p>
        </div>

        {/* Card */}
        <div className="rounded-2xl bg-white p-6 shadow-lg ring-1 ring-slate-200">
          {/* Email/Password form */}
          <form className="space-y-5" onSubmit={onSubmitPassword}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="mt-1 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                  Password
                </label>
                <Link to="/forgot" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                  Forgot?
                </Link>
              </div>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="mt-1 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={submittingPwd}
              className="inline-flex w-full items-center justify-center rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 disabled:opacity-60"
            >
              {submittingPwd ? "Signing in…" : "Sign in"}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-2 text-xs uppercase tracking-wide text-slate-500">or</span>
            </div>
          </div>

          {/* Google button (from react-google-button) */}
          <div className="flex justify-center">
            <GoogleButton
              label={submittingGoogle ? "Opening Google…" : "Sign in with Google"}
              onClick={() => !submittingGoogle && loginWithGoogle()}
              disabled={submittingGoogle}
              // You can tweak inline styles that the component supports:
              style={{ width: "100%" }}
              aria-label="Sign in with Google"
            />
          </div>

          {error && <p className="mt-3 text-xs text-red-600 text-center">{error}</p>}

          {/* Create account */}
          <p className="mt-6 text-center text-sm text-slate-600">
            Don’t have an account?{" "}
            <Link to="/register" className="font-medium text-indigo-600 hover:text-indigo-500">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}