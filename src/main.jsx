// main.jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';
import { GoogleOAuthProvider } from "@react-oauth/google";
import App from "./App.jsx";
import "./index.css";
import { AuthProvider } from "./auth/AuthProvider.jsx";

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={CLIENT_ID}>
      <BrowserRouter>
        <AuthProvider>
          <GoogleReCaptchaProvider 
            reCaptchaKey={import.meta.env.VITE_RECAPTCHA_SITE_KEY} 
            scriptProps={{ async: true, defer: true, appendTo: "head", nonce: undefined }}>
          <App />
          </GoogleReCaptchaProvider>
        </AuthProvider>
      </BrowserRouter>
    </GoogleOAuthProvider>
  </StrictMode>
);