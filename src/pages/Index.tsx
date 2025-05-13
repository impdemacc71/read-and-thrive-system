
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const { isAuthenticated } = useAuth();
  
  return isAuthenticated 
    ? <Navigate to="/catalog" replace /> 
    : <Navigate to="/login" replace />;
};

export default Index;
