// src/App.jsx
import { useEffect, useState } from 'react'
import './App.css'
import Home from './pages/Home'
import Services from './pages/Services'
import Carriers from './pages/Carriers'
import Reviews from './pages/Review'
import Reasons from './pages/Reasons'
import Contact from './pages/Contact'
import Layout from './layout/Layout'
import Quote from './pages/Quote'
import Login from '@/auth/Login'
import { AuthProvider } from './auth/AuthProvider'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { googleLogout } from '@react-oauth/google'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8080'
async function getJSON(path) {
  const r = await fetch(`${API_BASE}${path}`, { credentials: 'include' })
  if (!r.ok) throw new Error(`HTTP ${r.status}`)
  return r.json()
}

export default function App() {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || ''
  const [user, setUser] = useState(null)
  console.log(clientId)
  useEffect(() => {
    // restore session from backend
    getJSON('/me').then(setUser).catch(() => {})
  }, [])

  const handleSignOut = async () => {
    try { await fetch(`${API_BASE}/auth/logout`, { method: "POST", credentials: "include" }); } catch {}
    setUser(null);
  };

  return (
    <AuthProvider clientId={clientId}>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout user={user} onSignOut={handleSignOut} />}>
            <Route index element={<Home />} />
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

          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}