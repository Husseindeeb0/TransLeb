import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Loader from '../Loader';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <Loader />;
  }

  if (!isAuthenticated) {
    // Redirect to landing page if not authenticated
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  // Block inactive drivers from accessing other protected routes (like dashboard/scheduling)
  if (user?.role === 'driver' && !user?.active) {
    if (location.pathname.endsWith('/dashboard')) {
      const lang = location.pathname.split('/')[1] || 'en';
      return <Navigate to={`/${lang}/profile`} replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
