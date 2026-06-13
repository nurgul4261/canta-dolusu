import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

const AdminRoute = ({ children }) => {
  const { user, isAdmin } = useAuth();
  if (!user) return <Navigate to="/giris" replace />;
  if (!isAdmin) return <Navigate to="/" replace />;
  return children;
};
export default AdminRoute;
