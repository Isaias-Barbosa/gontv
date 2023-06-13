import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from './auth';

export function RequireAuth({ children }) {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    // Redirecionar para a página de login se o usuário não estiver autenticado
    navigate('/login');
    return null;
  }

  if (!user.isAdmin) {
    // Redirecionar para a página NotFoundPage se o usuário não for administrador
    return <Navigate to="*" replace />;
  }

  return <>{children}</>;
}