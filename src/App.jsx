// src/App.jsx
import { useEffect, useState } from "react";
import "./App.css";
import Home from "./pages/Home";
import Services from "./pages/Services";
import Carriers from "./pages/Carriers";
import Reviews from "./pages/Review";
import Reasons from "./pages/Reasons";
import Contact from "./pages/Contact";
import Layout from "./layout/Layout";
import Quote from "./pages/Quote";
import Login from "@/auth/Login";
import Dashboard from "./pages/user/Dashboard";
import Profile from "./pages/user/Profile";
import { AuthProvider } from "./auth/AuthProvider";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { googleLogout } from "@react-oauth/google";
import api from "./lib/api";

export default function App() {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";
  const [user, setUser] = useState(null);
  useEffect(() => {
    // restore session from backend
    api.me().then(setUser).catch(() => setUser(null));
  }, []);

  const handleSignOut = async () => {
    try {
      await api.logout();
    } catch {}
    setUser(null);
  };

  return (
    <AuthProvider clientId={clientId}>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout user={user} onSignOut={handleSignOut} />}>
            <Route index element={<Home />} />
            <Route path="home" element={<Home />} />
            <Route path="services" element={<Services />} />
            <Route path="reasons" element={<Reasons />} />
            <Route path="carriers" element={<Carriers />} />
            <Route path="reviews" element={<Reviews />} />
            <Route path="contact" element={<Contact />} />
            <Route path="quote" element={<Quote />} />
            <Route
              path="login"
              element={
                <Login
                  onSignedIn={(p) => {
                    setUser(p);
                  }}
                />
              }
            />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="profile" element={<Profile />} />  
          </Route>

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
