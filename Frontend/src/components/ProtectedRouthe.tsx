import { Navigate } from 'react-router-dom';
import { isAuthenticated } from '../services/api';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles = [] }) => {
  const autenticado = isAuthenticated();
  
  if (!autenticado) {
    return <Navigate to="/" replace />;
  }

  if (allowedRoles.length > 0) {
    const userData = localStorage.getItem('user');
    const user = userData ? JSON.parse(userData) : null;
    const userRole = user?.role?.toLowerCase();
    
    if (!userRole || !allowedRoles.map(r => r.toLowerCase()).includes(userRole)) {
      return <Navigate to="/" replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;