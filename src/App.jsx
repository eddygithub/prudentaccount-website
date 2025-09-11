import { useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { useAuth } from "./auth/AuthProvider";
import api from "./lib/api";
import Layout from "./layout/Layout";
import Home from "./pages/Home";
import Services from "./pages/Services";
import Carriers from "./pages/Carriers";
import Reviews from "./pages/Review";
import Reasons from "./pages/Reasons";
import Contact from "./pages/Contact";
import Quote from "./pages/Quote";
import Login from "./auth/Login";
import Dashboard from "./pages/user/Dashboard";
import Profile from "./pages/user/Profile";
import Register from "./auth/Register";
import CheckEmail from "./pages/CheckEmail";
import VerifyEmail from "./pages/VerifyEmail";
import { u } from "framer-motion/client";

export default function App() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  // Only fetch /me if we don't already have a user.
  useEffect(() => {
    if (user == null) {
      api.me()
        .then(setUser)
        .catch(() => setUser(null));
    }
  }, [user, setUser]);

  const handleSignOut = async () => {
    try {
      await api.logout();
    } finally {
      setUser(null);
      navigate("/home", { replace: true });
    }
  };

  return (
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
        <Route path="login" element={<Login onSignedIn={(p) => setUser(p)} />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="profile" element={<Profile />} />
        <Route path="check-email" element={<CheckEmail />} />
        <Route path="verify-email" element={<VerifyEmail onVerified={(p) => setUser(p)} />} />
        <Route path="register" element={<Register onRegistered={(p) => setUser(p)} />} />
      </Route>
    </Routes>
  );
}