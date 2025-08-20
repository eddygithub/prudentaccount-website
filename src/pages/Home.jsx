import { useState } from "react";

import { BrowserRouter, Routes, Route, NavLink, Outlet, useNavigate } from "react-router-dom";

// --- Pages ---
export default function Home() {
  const navigate = useNavigate();
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
      <div className="grid items-center gap-8 lg:grid-cols-2">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-3 py-1 text-xs font-medium text-slate-700 shadow-sm">
            Trusted local brokerage <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Rated 5★ by clients
          </p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            Smart coverage for your <span className="text-indigo-600">home</span>, <span className="text-indigo-600">auto</span>, and <span className="text-indigo-600">business</span>
          </h1>
          <p className="mt-4 text-lg text-slate-600">
            Prudent Insurance Brokerage Inc. helps New Yorkers compare top carriers and save—without sacrificing protection.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <button onClick={() => navigate('/quote')} className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500">Get My Quote</button>
            <a href="tel:+17184459898" className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50">Call (718) 445-9898</a>
          </div>
          <div className="mt-6 text-sm text-slate-500">Fast, personalized quotes • No hidden fees • Bilingual support (EN/中文)</div>
        </div>
        <div className="rounded-2xl bg-white p-6 shadow-xl ring-1 ring-slate-200">
          <h3 className="text-lg font-semibold text-slate-900">Quick Links</h3>
          <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
            <NavLink to="/services" className="rounded-lg border border-slate-200 p-3 hover:bg-slate-50">Services</NavLink>
            <NavLink to="/reasons" className="rounded-lg border border-slate-200 p-3 hover:bg-slate-50">Why Us</NavLink>
            <NavLink to="/carriers" className="rounded-lg border border-slate-200 p-3 hover:bg-slate-50">Carriers</NavLink>
            <NavLink to="/reviews" className="rounded-lg border border-slate-200 p-3 hover:bg-slate-50">Reviews</NavLink>
          </div>
        </div>
      </div>
    </section>
  );
}