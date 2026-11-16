import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export function PrivateRoute() {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) return <p role="status">Зареждане...</p>;
  return user ? <Outlet /> : <Navigate to="/login" replace state={{ from: location }} />;
}

export function GuestRoute() {
  const { user, loading } = useAuth();
  if (loading) return <p role="status">Зареждане...</p>;
  return user ? <Navigate to="/my-diary" replace /> : <Outlet />;
}
