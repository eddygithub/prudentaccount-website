// Profile.jsx
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/auth/AuthProvider";

export default function Profile() {
  const navigate = useNavigate();
  const { user } = useAuth();

  if (!user) {
    return (
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="rounded-2xl bg-white p-8 shadow-lg ring-1 ring-slate-200">
          <h1 className="text-2xl font-bold text-slate-900">Please sign in</h1>
          <p className="mt-2 text-slate-600">
            You need to sign in to view your profile.
          </p>
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

  const formatDate = (d) =>
    d ? new Date(d).toLocaleString() : "—";

  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <header className="flex items-center gap-4">
        {user.picture ? (
          <img
            src={user.picture}
            alt={user.name || user.email}
            className="h-20 w-20 rounded-full ring-2 ring-slate-200"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="h-20 w-20 rounded-full bg-slate-900 text-white grid place-items-center text-xl font-semibold">
            {(user.name || user.email || "U").charAt(0).toUpperCase()}
          </div>
        )}
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            {user.name || "User"}
          </h1>
          <p className="text-slate-600">{user.email}</p>
        </div>
      </header>

      <section className="mt-8 rounded-xl bg-white p-6 shadow-md ring-1 ring-slate-200">
        <h2 className="text-lg font-semibold text-slate-900">Profile Details</h2>
        <dl className="mt-4 space-y-3">
          <div>
            <dt className="text-sm text-slate-500">Name</dt>
            <dd className="text-base text-slate-900">{user.name || "—"}</dd>
          </div>
          <div>
            <dt className="text-sm text-slate-500">Email</dt>
            <dd className="text-base text-slate-900">{user.email}</dd>
          </div>
          <div>
            <dt className="text-sm text-slate-500">Phone Number</dt>
            <dd className="text-base text-slate-900">{user.phoneNumber || "—"}</dd>
          </div>
          <div>
            <dt className="text-sm text-slate-500">Status</dt>
            <dd className="text-base text-slate-900">{user.status || "—"}</dd>
          </div>
          <div>
            <dt className="text-sm text-slate-500">Notes</dt>
            <dd className="text-base text-slate-900">{user.notes || "—"}</dd>
          </div>
          <div>
            <dt className="text-sm text-slate-500">Created At</dt>
            <dd className="text-base text-slate-900">{formatDate(user.createdAt)}</dd>
          </div>
          <div>
            <dt className="text-sm text-slate-500">Last Login</dt>
            <dd className="text-base text-slate-900">{formatDate(user.lastLoginAt)}</dd>
          </div>
          <div>
            <dt className="text-sm text-slate-500">Updated At</dt>
            <dd className="text-base text-slate-900">{formatDate(user.updatedAt)}</dd>
          </div>
        </dl>
      </section>
    </main>
  );
}