import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from './auth';

export function RequireAuth({ children }) {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    // Redirecionar para a página de login se o usuário não estiver autenticado
    navigate('/404');
    return null;
  }

   // Verificar se a rota atual é a do dashboard/admin
   const isDashboardRoute = window.location.pathname.includes('/dashboard/admin');

   if (isDashboardRoute && !user.isAdmin) {
    // Redirecionar para a página NotFoundPage se o usuário não for administrador e estiver tentando acessar a rota do dashboard/admin
    return <Navigate to="*" replace />;
  }

  return <>{children}</>;
}