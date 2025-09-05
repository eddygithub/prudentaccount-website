import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api, { getAccessToken } from "@/lib/api";

export default function Register({ onRegistered }) {
  const navigate = useNavigate();

  // modes: "public" | "pending" | "verify-sent"
  const [mode, setMode] = useState("public");
  const [me, setMe] = useState(null);
  const [loading, setLoading] = useState(true);

  // public registration fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [pwd2, setPwd2] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [agree, setAgree] = useState(false);

  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [resendBusy, setResendBusy] = useState(false);
  const [resendMsg, setResendMsg] = useState("");

  // Decide mode:
  // If we have an access token, try /me; if status=PENDING -> "pending" mode
  // Otherwise, show public sign-up
  useEffect(() => {
    const hasToken = !!getAccessToken();
    if (!hasToken) {
      setMode("public");
      setLoading(false);
      return;
    }
    api
      .me()
      .then((u) => {
        setMe(u);
        if (u?.status?.toUpperCase() === "PENDING") {
          setMode("pending");
          setName(u?.name || "");
          setEmail(u?.email || "");
        } else {
          // Already ACTIVE; no need to register — send them somewhere useful
          setMode("public");
          navigate("/dashboard", { replace: true });
        }
      })
      .catch(() => setMode("public"))
      .finally(() => setLoading(false));
  }, [navigate]);

  const submitPublic = async (e) => {
    e.preventDefault();
    setError("");

    if (!agree) return setError("Please agree to the terms to continue.");
    if (!name.trim()) return setError("Name is required.");
    if (!email.trim()) return setError("Email is required.");
    if (pwd.length < 8) return setError("Password must be at least 8 characters.");
    if (pwd !== pwd2) return setError("Passwords do not match.");

    setSubmitting(true);
    try {
      // Server may either:
      //  - auto-issue { accessToken, profile } (auto-login)
      //  - require email verification → 202/200 without token
      const res = await api.registerPublic({
        name,
        email,
        password: pwd,
        phone,
        notes,
        agreeToTerms: true,
      });

      if (res?.accessToken && res?.profile) {
        onRegistered?.(res.profile);
        navigate("/dashboard", { replace: true });
      } else {
        // verification-required path
        setMode("verify-sent");
        setResendMsg(
          "We’ve sent a verification link to your email. Please verify to activate your account."
        );
      }
    } catch (err) {
      setError(err.message || "Registration failed.");
    } finally {
      setSubmitting(false);
    }
  };

  const submitPending = async (e) => {
    e.preventDefault();
    setError("");
    if (!agree) return setError("Please agree to the terms to continue.");

    setSubmitting(true);
    try {
      const { accessToken, profile } = await api.completeRegistration({
        phone,
        notes,
        agreeToTerms: true,
      });
      onRegistered?.(profile);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err.message || "Registration failed.");
    } finally {
      setSubmitting(false);
    }
  };

  const resendVerification = async () => {
    setResendMsg("");
    setError("");
    if (!email) {
      setError("Enter your email first.");
      return;
    }
    setResendBusy(true);
    try {
      await api.resendVerification(email);
      setResendMsg("Verification email re-sent. Please check your inbox (and spam).");
    } catch (err) {
      setError(err.message || "Failed to resend verification email.");
    } finally {
      setResendBusy(false);
    }
  };

  if (loading) {
    return (
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="animate-pulse text-slate-500">Loading…</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-200 antialiased flex items-center justify-center p-3">
      <div className="w-full max-w-xl">
        {/* Brand */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-3 grid h-20 w-20 place-items-center rounded-2xl bg-slate-900/90 text-white font-semibold">
            Prudent
          </div>
          <h1 className="text-2xl font-semibold text-slate-900">
            {mode === "pending"
              ? "Complete your registration"
              : mode === "verify-sent"
              ? "Verify your email"
              : "Create your account"}
          </h1>
          {mode === "pending" && (me?.name || me?.email) && (
            <p className="mt-1 text-sm text-slate-600">
              Signing in as <span className="font-medium">{me.name || me.email}</span>
            </p>
          )}
        </div>

        {/* Card */}
        <div className="rounded-2xl bg-white p-6 shadow-lg ring-1 ring-slate-200">
          {mode === "verify-sent" ? (
            // -------- After public signup (verification required) --------
            <div className="space-y-4">
              <p className="text-sm text-slate-700">
                {resendMsg ||
                  "We’ve sent a verification link to your email. Please verify to activate your account."}
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => navigate("/login", { replace: true })}
                  className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Go to Login
                </button>
                <button
                  type="button"
                  disabled={resendBusy}
                  onClick={resendVerification}
                  className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:opacity-60"
                >
                  {resendBusy ? "Resending…" : "Resend verification email"}
                </button>
              </div>

              <div className="mt-4">
                <label className="block">
                  <span className="block text-xs font-medium text-slate-600">Email</span>
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                    placeholder="you@example.com"
                  />
                </label>
              </div>

              {error && <p className="text-sm text-red-600">{error}</p>}
            </div>
          ) : mode === "pending" ? (
            // -------- Pending-completion (token required, Google user) --------
            <form className="grid grid-cols-1 gap-4" onSubmit={submitPending}>
              <div className="rounded-lg bg-slate-50 border border-slate-200 p-3 text-sm">
                <div>
                  <span className="text-slate-500">Name:</span>{" "}
                  <span className="font-medium">{me?.name || "—"}</span>
                </div>
                <div>
                  <span className="text-slate-500">Email:</span>{" "}
                  <span className="font-medium">{me?.email || "—"}</span>
                </div>
              </div>

              <label className="block">
                <span className="block text-sm font-medium text-slate-700">Phone</span>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  type="tel"
                  required
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                  placeholder="(555) 123-4567"
                />
              </label>

              <label className="block">
                <span className="block text-sm font-medium text-slate-700">Notes (optional)</span>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="mt-1 min-h-[96px] w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                  placeholder="Anything we should know?"
                />
              </label>

              <label className="flex items-start gap-2">
                <input
                  type="checkbox"
                  checked={agree}
                  onChange={(e) => setAgree(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-sm text-slate-700">
                  I agree to the{" "}
                  <a href="/terms" className="text-indigo-600 hover:text-indigo-500 underline">
                    Terms
                  </a>{" "}
                  and acknowledge the{" "}
                  <a href="/privacy" className="text-indigo-600 hover:text-indigo-500 underline">
                    Privacy Policy
                  </a>
                  .
                </span>
              </label>

              {error && <p className="text-sm text-red-600">{error}</p>}

              <div className="mt-2 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => navigate("/", { replace: true })}
                  className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 disabled:opacity-60"
                >
                  {submitting ? "Submitting…" : "Complete registration"}
                </button>
              </div>
            </form>
          ) : (
            // -------- Public Sign-up (no token required) --------
            <form className="grid grid-cols-1 gap-4" onSubmit={submitPublic}>
              <label className="block">
                <span className="block text-sm font-medium text-slate-700">Full name</span>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                  placeholder="Jane Appleseed"
                />
              </label>

              <label className="block">
                <span className="block text-sm font-medium text-slate-700">Email</span>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  required
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                  placeholder="you@example.com"
                />
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="block">
                  <span className="block text-sm font-medium text-slate-700">Password</span>
                  <input
                    value={pwd}
                    onChange={(e) => setPwd(e.target.value)}
                    type="password"
                    required
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                    placeholder="At least 8 characters"
                  />
                </label>

                <label className="block">
                  <span className="block text-sm font-medium text-slate-700">Confirm password</span>
                  <input
                    value={pwd2}
                    onChange={(e) => setPwd2(e.target.value)}
                    type="password"
                    required
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                    placeholder="Re-enter password"
                  />
                </label>
              </div>

              <label className="block">
                <span className="block text-sm font-medium text-slate-700">Phone (optional)</span>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  type="tel"
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                  placeholder="(555) 123-4567"
                />
              </label>

              <label className="block">
                <span className="block text-sm font-medium text-slate-700">Notes (optional)</span>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="mt-1 min-h-[96px] w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                  placeholder="Anything we should know about your insurance needs?"
                />
              </label>

              <label className="flex items-start gap-2">
                <input
                  type="checkbox"
                  checked={agree}
                  onChange={(e) => setAgree(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-sm text-slate-700">
                  I agree to the{" "}
                  <a href="/terms" className="text-indigo-600 hover:text-indigo-500 underline">
                    Terms
                  </a>{" "}
                  and acknowledge the{" "}
                  <a href="/privacy" className="text-indigo-600 hover:text-indigo-500 underline">
                    Privacy Policy
                  </a>
                  .
                </span>
              </label>

              {error && <p className="text-sm text-red-600">{error}</p>}

              <div className="mt-2 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => navigate("/", { replace: true })}
                  className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 disabled:opacity-60"
                >
                  {submitting ? "Submitting…" : "Create account"}
                </button>
              </div>
            </form>
          )}
        </div>

        <p className="mt-6 text-center text-xs text-slate-500">
          Need help? Email{" "}
          <a href="mailto:info@prudentbrokerage.com" className="underline">
            info@prudentbrokerage.com
          </a>
        </p>
      </div>
    </main>
  );
}