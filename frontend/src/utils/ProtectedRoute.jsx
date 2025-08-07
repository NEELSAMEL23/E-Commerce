import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Show loader while verifying authentication
  if (loading) return <div className="p-6 text-center">Checking authentication...</div>;

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/auth/login" replace state={{ from: location }} />;
  }

  // If used as a wrapper
  if (children) return children;

  // If used with nested routes
  return <Outlet />;
}
