import { useState } from "react";
import { NavLink } from "react-router-dom";

// --- Shared UI ---
export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const linkClass = ({ isActive }) =>
    `px-2 py-1 rounded-md text-sm font-medium ${isActive ? "text-slate-900" : "text-slate-700 hover:text-slate-900"}`;

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

        <nav className="hidden md:flex items-center gap-4 text-sm">
          <NavLink to="/services" className={linkClass}>Services</NavLink>
          <NavLink to="/reasons" className={linkClass}>Why Us</NavLink>
          <NavLink to="/carriers" className={linkClass}>Carriers</NavLink>
          <NavLink to="/reviews" className={linkClass}>Reviews</NavLink>
          <NavLink to="/contact" className={linkClass}>Contact</NavLink>
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <a href="tel:+17184459898" className="text-sm font-medium text-slate-700 hover:text-slate-900">(718) 445-9898</a>
          <NavLink to="/quote" className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30">
            Request Quote
          </NavLink>
        </div>

        <button
          className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-300 hover:bg-slate-50"
          onClick={() => setMobileOpen(v => !v)}
          aria-label="Toggle menu"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-700">
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
      <div className={`md:hidden border-t border-slate-200 transition-[max-height] duration-300 overflow-hidden ${mobileOpen ? "max-h-96" : "max-h-0"}`}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3 flex flex-col gap-2">
          <NavLink to="/services" className={linkClass} onClick={() => setMobileOpen(false)}>Services</NavLink>
          <NavLink to="/reasons" className={linkClass} onClick={() => setMobileOpen(false)}>Why Us</NavLink>
          <NavLink to="/carriers" className={linkClass} onClick={() => setMobileOpen(false)}>Carriers</NavLink>
          <NavLink to="/reviews" className={linkClass} onClick={() => setMobileOpen(false)}>Reviews</NavLink>
          <NavLink to="/contact" className={linkClass} onClick={() => setMobileOpen(false)}>Contact</NavLink>
          <div className="pt-2 flex items-center gap-3">
            <a href="tel:+17184459898" className="text-sm font-medium text-slate-700">(718) 445-9898</a>
            <NavLink to="/quote" onClick={() => setMobileOpen(false)} className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white">Request Quote</NavLink>
          </div>
        </div>
      </div>
    </header>
  );
}