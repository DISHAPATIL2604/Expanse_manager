// src/components/ProtectedRoute.jsx
// Wraps any route that requires authentication.
// If the user is NOT logged in, they are redirected to /login.

import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { currentUser } = useAuth();

  // If no authenticated user, redirect to login
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
