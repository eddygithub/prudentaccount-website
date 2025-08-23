import { createContext, useContext, useEffect, useState } from "react";
import { GoogleOAuthProvider, googleLogout } from "@react-oauth/google";

const AuthCtx = createContext(null);

function decodeJwt(token) { /* your decoder from App.jsx */ }

export function AuthProvider({ clientId, children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem("auth:user");
    if (saved) setUser(JSON.parse(saved));
  }, []);

  const signInWithIdToken = (credential) => {
    const payload = decodeJwt(credential);
    if (!payload) return;
    const u = { name: payload.name, email: payload.email, picture: payload.picture, sub: payload.sub };
    localStorage.setItem("auth:user", JSON.stringify(u));
    setUser(u);
  };

  const signOut = () => {
    googleLogout();
    localStorage.removeItem("auth:user");
    setUser(null);
  };

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <AuthCtx.Provider value={{ user, signInWithIdToken, signOut }}>
        {children}
      </AuthCtx.Provider>
    </GoogleOAuthProvider>
  );
}

export function useAuth() {
  return useContext(AuthCtx);
}
