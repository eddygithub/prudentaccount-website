// src/layout/Layout.jsx
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./footer";

export default function Layout({ user, onSignOut }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 text-slate-800 flex flex-col">
      <Header
        user={user}
        onSignOut={onSignOut}
      />

      <div className="flex-1">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}
