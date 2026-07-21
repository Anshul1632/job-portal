import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

/**
 * Wrap a page with this to require login, and optionally a specific role.
 * Usage: <ProtectedRoute role="recruiter"><PostJob /></ProtectedRoute>
 */
export default function ProtectedRoute({ children, role }) {
  const { user } = useSelector((state) => state.auth);
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (role && user.role !== role) {
    return <Navigate to="/" replace />;
  }

  return children;
}
