import { useEffect, useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import api from "@/lib/api";

export default function Dashboard() {
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
        <div className="animate-pulse text-slate-500">Loading your dashboard…</div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="rounded-2xl bg-white p-8 shadow-lg ring-1 ring-slate-200">
          <h1 className="text-2xl font-bold text-slate-900">Please sign in</h1>
          <p className="mt-2 text-slate-600">You need to sign in to view your dashboard.</p>
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
    <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <header className="flex items-center gap-4">
        {user.picture ? (
          <img
            src={user.picture}
            alt={user.name || user.email}
            className="h-14 w-14 rounded-full ring-2 ring-slate-200"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="h-14 w-14 rounded-full bg-slate-900 text-white grid place-items-center text-lg font-semibold">
            {(user.name || user.email || "U").charAt(0).toUpperCase()}
          </div>
        )}
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Welcome back{user.name ? `, ${user.name}` : ""}!</h1>
          <p className="text-slate-600">{user.email}</p>
        </div>
      </header>

      {/* Quick stats (placeholders you can wire to real data later) */}
      <section className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { t: "Active Policies", v: "—", to: "/policies" },
          { t: "Open Claims", v: "—", to: "/claims" },
          { t: "Documents", v: "—", to: "/documents" },
          { t: "Renewals This Month", v: "—", to: "/renewals" },
        ].map((card) => (
          <NavLink
            key={card.t}
            to={card.to}
            className="rounded-xl bg-white p-5 shadow-md ring-1 ring-slate-200 hover:bg-slate-50"
          >
            <div className="text-sm text-slate-500">{card.t}</div>
            <div className="mt-1 text-2xl font-semibold text-slate-900">{card.v}</div>
          </NavLink>
        ))}
      </section>

      {/* Recent activity (placeholder list) */}
      <section className="mt-10">
        <h2 className="text-lg font-semibold text-slate-900">Recent Activity</h2>
        <ul className="mt-4 divide-y divide-slate-200 rounded-xl bg-white shadow-md ring-1 ring-slate-200">
          {[
            "Viewed Homeowners policy",
            "Requested certificate of insurance",
          ].map((item, i) => (
            <li key={i} className="p-4 text-sm text-slate-700">{item}</li>
          ))}
        </ul>
      </section>
    </main>
  );
}
