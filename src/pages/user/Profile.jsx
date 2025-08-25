import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/lib/api";

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.me().then(setUser).catch(() => setUser(null)).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="animate-pulse text-slate-500">Loading profile…</div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="rounded-2xl bg-white p-8 shadow-lg ring-1 ring-slate-200">
          <h1 className="text-2xl font-bold text-slate-900">Please sign in</h1>
          <p className="mt-2 text-slate-600">You need to sign in to view your profile.</p>
          <button
            onClick={() => navigate("/login")}
            className="mt-5 inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
          >
            Go to Login
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="rounded-2xl bg-white p-6 shadow-lg ring-1 ring-slate-200">
        <div className="flex items-center gap-4">
          {user.picture ? (
            <img
              src={user.picture}
              alt={user.name || user.email}
              className="h-16 w-16 rounded-full ring-2 ring-slate-200"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="h-16 w-16 rounded-full bg-slate-900 text-white grid place-items-center text-xl font-semibold">
              {(user.name || user.email || "U").charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <h1 className="text-xl font-bold text-slate-900">{user.name || "Your profile"}</h1>
            <p className="text-slate-600">{user.email}</p>
          </div>
        </div>

        {/* Read-only details for now */}
        <dl className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div className="rounded-lg border border-slate-200 p-4">
            <dt className="text-slate-500">Full name</dt>
            <dd className="mt-1 font-medium text-slate-900">{user.name || "—"}</dd>
          </div>
          <div className="rounded-lg border border-slate-200 p-4">
            <dt className="text-slate-500">Email</dt>
            <dd className="mt-1 font-medium text-slate-900">{user.email || "—"}</dd>
          </div>
          <div className="rounded-lg border border-slate-200 p-4">
            <dt className="text-slate-500">Picture</dt>
            <dd className="mt-1 text-slate-900 truncate">{user.picture || "—"}</dd>
          </div>
          <div className="rounded-lg border border-slate-200 p-4">
            <dt className="text-slate-500">Roles</dt>
            <dd className="mt-1 font-medium text-slate-900">
              {Array.isArray(user.roles) ? user.roles.join(", ") : (user.roles || "—")}
            </dd>
          </div>
        </dl>

        {/* Placeholders for future profile editing */}
        <div className="mt-6 text-xs text-slate-500">
          To support profile updates, add an API like <code>PATCH /me</code> and wire inputs here.
        </div>
      </div>
    </main>
  );
}