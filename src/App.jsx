import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Login from './pages/Login'
import Home from './pages/Home'
import Services from './pages/Services'
import Carriers from "./pages/Carriers";
import Reviews from "./pages/Review";
import Reasons from "./pages/Reasons";
import Contact from "./pages/Contact";
import Layout from "./layout/Layout";
import Quote from "./pages/Quote";
import { BrowserRouter, Routes, Route, NavLink, Outlet, useNavigate } from "react-router-dom";


// --- App with Routes ---
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}> 
          <Route index element={<Home />} />
          <Route path="services" element={<Services />} />
          <Route path="reasons" element={<Reasons />} />
          <Route path="carriers" element={<Carriers />} />
          <Route path="reviews" element={<Reviews />} />
          <Route path="contact" element={<Contact />} />
          <Route path="quote" element={<Quote />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
