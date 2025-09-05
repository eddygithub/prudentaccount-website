// src/pages/VerifyEmail.jsx
import { useEffect, useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import api, { setAccessToken } from "@/lib/api";

export default function VerifyEmail({ onVerified }) {
  const navigate = useNavigate();
  const { search } = useLocation();
  const [status, setStatus] = useState("verifying"); // verifying | success | error
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Extract token from query param
    const params = new URLSearchParams(search);
    const token = params.get("token");

    if (!token) {
      setStatus("error");
      setMessage("Verification token missing.");
      return;
    }

    // Optional: remove token from URL for privacy (keeps same page)
    window.history.replaceState({}, document.title, "/verify-email");

    (async () => {
      try {
        // Backend will: activate account, set refresh cookie, return access token + profile
        const res = await api.verifyEmail(token);
        if (res?.accessToken) setAccessToken(res.accessToken);
        const profile = res?.profile ?? res;

        setStatus("success");
        setMessage("Your email has been verified.");

        // Push user to app state (header/avatar)
        onVerified?.(profile);

        // Auto-redirect after a short delay (optional)
        const t = setTimeout(() => navigate("/dashboard", { replace: true }), 1200);
        return () => clearTimeout(t);
      } catch (e) {
        setStatus("error");
        setMessage(e?.message || "Verification failed. The link may be invalid or expired.");
      }
    })();
  }, [search, navigate, onVerified]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-200 antialiased flex items-center justify-center p-3">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-3 grid h-20 w-20 place-items-center rounded-2xl bg-slate-900/90 text-white font-semibold">
            Prudent
          </div>
          <h1 className="text-2xl font-semibold text-slate-900">
            {status === "verifying" ? "Verifying your email…" :
             status === "success" ? "Email verified" : "Verification error"}
          </h1>
          <p className="mt-2 text-sm text-slate-600">{message}</p>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-lg ring-1 ring-slate-200 text-center">
          {status === "verifying" && (
            <div className="text-slate-500 animate-pulse">Please wait…</div>
          )}

          {status === "success" && (
            <div className="space-y-4">
              <p className="text-slate-700">Redirecting you to your dashboard…</p>
              <Link
                to="/dashboard"
                className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500"
              >
                Go to Dashboard now
              </Link>
            </div>
          )}

          {status === "error" && (
            <div className="space-y-4">
              <Link
                to="/login"
                className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
              >
                Back to Login
              </Link>
              <p className="text-xs text-slate-500">
                Need help? <a className="underline" href="mailto:info@prudentbrokerage.com">Contact support</a>.
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}