// src/context/AuthContext.jsx
// Provides the global authentication state to all components via React Context.

import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChange } from "../services/authService";

const AuthContext = createContext(null);

/**
 * Wrap your app with <AuthProvider> so any component can call useAuth().
 */
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true); // true while we check auth state on mount

  useEffect(() => {
    // Subscribe to Firebase auth state changes
    const unsubscribe = onAuthStateChange((user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    // Cleanup listener on unmount
    return unsubscribe;
  }, []);

  const value = { currentUser, loading };

  // Don't render children until we know if user is logged in or not
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

/**
 * Custom hook to access the auth context from any component.
 * Usage: const { currentUser } = useAuth();
 */
export const useAuth = () => {
  return useContext(AuthContext);
};
