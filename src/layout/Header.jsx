import React, { useState } from "react";
import { NavLink } from "react-router-dom";

// Props:
// - user?: { name?: string; email?: string; picture?: string; status?: 'ACTIVE'|'PENDING'|'DISABLED'; roles?: string[] }
//         or { profile: {...same...}, requiresRegistration?: boolean }
// - onSignOut?: () => void
export default function Header({ user, onSignOut }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);

  // unwrap either shape
  const u = user?.profile ?? user;

  // pending if server marked it OR caller added a top-level flag
  const isPending =
    !!user?.requiresRegistration ||
    (typeof u?.status === "string" && u.status.toUpperCase() === "PENDING");

  // treat pending as authenticated (they can access dashboard/profile)
  const isAuthenticated = !!u;

  const displayName = u?.name || u?.email || "";
  const picture = u?.picture || "";
  const initial = (displayName?.trim()?.[0] || "U").toUpperCase();

  const linkClass = ({ isActive }) =>
    `px-2 py-1 rounded-md text-sm font-medium ${
      isActive ? "text-slate-900" : "text-slate-700 hover:text-slate-900"
    }`;

  const closeMobile = () => setMobileOpen(false);
  const toggleAccount = () => setAccountOpen((v) => !v);
  const handleSignOut = () => {
    onSignOut?.();
    setAccountOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b border-slate-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <NavLink to="/" className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-slate-900 text-white grid place-items-center font-semibold">PI</div>
          <div className="leading-tight">
            <div className="font-semibold">Prudent Insurance Brokerage Inc.</div>
            <div className="text-xs text-slate-500">Serving New York • Since 2010+</div>
          </div>
        </NavLink>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-4 text-sm">
          <NavLink to="/services" className={linkClass}>Services</NavLink>
          <NavLink to="/reasons" className={linkClass}>Why Us</NavLink>
          <NavLink to="/reviews" className={linkClass}>Reviews</NavLink>
          <NavLink to="/contact" className={linkClass}>Contact</NavLink>
        </nav>

        {/* Desktop actions */}
        <div className="hidden md:flex items-center gap-3">
          {/* If authenticated & pending, show a gentle nudge chip next to avatar */}
          {isAuthenticated && isPending && (
            <NavLink
              to="/register"
              className="inline-flex items-center gap-1 rounded-full bg-amber-100 text-amber-900 px-3 py-1 text-xs font-medium ring-1 ring-amber-200 hover:bg-amber-200"
              title="Your account setup isn’t finished"
            >
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-amber-500" />
              Finish registration
            </NavLink>
          )}

          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={toggleAccount}
                aria-expanded={accountOpen}
                aria-haspopup="menu"
                className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                {picture ? (
                  <img
                    src={picture}
                    alt={displayName || "User"}
                    className="h-6 w-6 rounded-full ring-1 ring-slate-300"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <span className="inline-grid place-items-center h-6 w-6 rounded-full bg-slate-900 text-white text-xs font-semibold">
                    {initial}
                  </span>
                )}
                <span className="hidden sm:inline">{displayName || "Account"}</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                     strokeLinecap="round" strokeLinejoin="round" className="text-slate-700">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>

              {accountOpen && (
                <div
                  role="menu"
                  className="absolute right-0 mt-2 w-56 rounded-lg border border-slate-200 bg-white shadow-lg p-2"
                >
                  <div className="px-3 py-2 text-xs text-slate-500 border-b border-slate-100">
                    Signed in as{" "}
                    <span className="font-medium text-slate-700">{displayName || "—"}</span>
                    {isPending && (
                      <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-amber-100 text-amber-900 px-2 py-0.5 text-[10px] font-medium ring-1 ring-amber-200">
                        Pending
                      </span>
                    )}
                  </div>

                  {/* Pending-first item */}
                  {isPending && (
                    <NavLink
                      to="/register"
                      onClick={() => setAccountOpen(false)}
                      className="block px-3 py-2 rounded-md text-sm font-medium text-amber-900 bg-amber-50 hover:bg-amber-100 ring-1 ring-amber-200 mb-1"
                    >
                      Finish registration
                    </NavLink>
                  )}

                  <NavLink
                    to="/dashboard"
                    onClick={() => setAccountOpen(false)}
                    className="block px-3 py-2 rounded-md text-sm text-slate-700 hover:bg-slate-50"
                  >
                    Dashboard
                  </NavLink>
                  <NavLink
                    to="/profile"
                    onClick={() => setAccountOpen(false)}
                    className="block px-3 py-2 rounded-md text-sm text-slate-700 hover:bg-slate-50"
                  >
                    Profile
                  </NavLink>
                  <button
                    onClick={handleSignOut}
                    className="w-full text-left px-3 py-2 rounded-md text-sm text-slate-700 hover:bg-slate-50"
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <NavLink
                to="/login"
                className="inline-flex items-center justify-center rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Log in
              </NavLink>
              <NavLink
                to="/register"
                className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-500/30"
              >
                Sign up
              </NavLink>
            </div>
          )}

      
          <NavLink
            to="/quote"
            className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
          >
            Request Quote
          </NavLink>
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-300 hover:bg-slate-50"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-slate-700"
          >
            {mobileOpen ? (
              <path d="M18 6L6 18M6 6l12 12" />
            ) : (
              <>
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </>
            )}
          </svg>
        </button>
      </div>

      {/* Mobile nav */}
      <div
        className={`md:hidden border-t border-slate-200 transition-[max-height] duration-300 overflow-hidden ${
          mobileOpen ? "max-h-96" : "max-h-0"
        }`}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3 flex flex-col gap-2">
          <NavLink to="/services" className={linkClass} onClick={closeMobile}>
            Services
          </NavLink>
          <NavLink to="/reasons" className={linkClass} onClick={closeMobile}>
            Why Us
          </NavLink>
          <NavLink to="/reviews" className={linkClass} onClick={closeMobile}>
            Reviews
          </NavLink>
          <NavLink to="/contact" className={linkClass} onClick={closeMobile}>
            Contact
          </NavLink>

          {isAuthenticated ? (
            <div className="mt-2 grid gap-2">
              {isPending && (
                <NavLink
                  to="/register"
                  className="px-2 py-1 rounded-md text-sm font-medium text-amber-900 bg-amber-50 hover:bg-amber-100 ring-1 ring-amber-200"
                  onClick={closeMobile}
                >
                  Finish registration
                </NavLink>
              )}
              <NavLink to="/dashboard" className={linkClass} onClick={closeMobile}>
                Dashboard
              </NavLink>
              <NavLink to="/profile" className={linkClass} onClick={closeMobile}>
                Profile
              </NavLink>
              <button
                onClick={() => {
                  handleSignOut();
                  closeMobile();
                }}
                className="px-2 py-1 rounded-md text-left text-sm font-medium text-slate-700 hover:text-slate-900"
              >
                Sign out
              </button>
            </div>
          ) : (
            <div className="pt-2 flex items-center gap-3">
              <NavLink
                to="/login"
                onClick={closeMobile}
                className="inline-flex items-center justify-center rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700"
              >
                Log in
              </NavLink>
              <NavLink
                to="/register"
                onClick={closeMobile}
                className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
              >
                Sign up
              </NavLink>
            </div>
          )}

          {/* Phone + Quote */}
          <div className="pt-2 flex items-center gap-3">
            <a href="tel:+17184459898" className="text-sm font-medium text-slate-700">
              (718) 445-9898
            </a>
            <NavLink
              to="/quote"
              onClick={closeMobile}
              className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white"
            >
              Request Quote
            </NavLink>
          </div>
        </div>
      </div>
    </header>
  );
}