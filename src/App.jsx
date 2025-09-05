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
import Register from "./auth/Register";
import CheckEmail from "./pages/CheckEmail";
import VerifyEmail from "./pages/VerifyEmail";
import { AuthProvider } from "./auth/AuthProvider";
import { Routes, Route, useNavigate } from "react-router-dom";
import api from "./lib/api";

export default function App() {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";
  const [user, setUser] = useState(null);
  const navigate = useNavigate(); // now App is INSIDE <BrowserRouter> (in main.jsx)

  useEffect(() => {
    api.me().then(setUser).catch(() => setUser(null));
  }, []);

  const handleSignOut = async () => {
    try {
      await api.logout();            // server clears refresh cookie; api clears access token
      console.log("User signed out successfully.");
    } finally {
      setUser(null);                 // clear app user
      navigate("/home", { replace: true }); // redirect to login
    }
  };

  return (
    <AuthProvider clientId={clientId}>
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
            element={<Login onSignedIn={(p) => setUser(p)} />}
          />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="profile" element={<Profile />} />
          <Route path="check-email" element={<CheckEmail />} />
          <Route path="verify-email" element={<VerifyEmail onVerified={(p) => setUser(p)} />} />
          <Route path="register" element={<Register onRegistered={(profile) => setUser(profile)} />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}