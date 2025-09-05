import { useMemo } from "react";
import { useLocation, Link } from "react-router-dom";
import api from "@/lib/api";

export default function CheckEmail() {
  const q = new URLSearchParams(useLocation().search);
  const email = useMemo(() => q.get("email") || "", [q]);

  return (
    <main className="min-h-screen grid place-items-center bg-slate-50 py-10">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow ring-1 ring-slate-200 text-center">
        <h1 className="text-xl font-semibold text-slate-900">Verify your email</h1>
        <p className="text-sm text-slate-600 mt-2">
          We sent a verification link to <span className="font-medium">{email}</span>.
          Click the link to activate your account.
        </p>
        <div className="mt-6">
          <button
            onClick={() => email && api.resendVerification(email)}
            className="btn-secondary"
          >
            Resend email
          </button>
        </div>
        <p className="mt-4 text-xs text-slate-500">
          Wrong email? <Link to="/register" className="underline">Create again</Link>
        </p>
      </div>
    </main>
  );
}
// .btn-secondary { @apply inline-flex justify-center rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50; }
