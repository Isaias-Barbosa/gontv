import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import bcrypt from 'bcryptjs';



const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
  }

export function AuthProvider({ children}) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();


    const checkUserIsAdmin = async () => {
      try {
        const response = await axios.get('http://localhost:3006/api/admin', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
  
        if (response.data.isAdmin) {
          setUser((prevUser) => ({ ...prevUser, isAdmin: true }));
        } else {
          setUser((prevUser) => ({ ...prevUser, isAdmin: false }));
        }
      } catch (error) {
        console.error('Erro ao verificar permissão de administrador:', error);
      }
    };


  const login = async (email, password) => {
    try {
      const response = await axios.post('http://localhost:3006/api/login', {
        email,
        password,
      });

      const { token, user: userData } = response.data;

      // Verificar a senha fornecida com a senha armazenada no banco de dados
      const passwordMatch = await bcrypt.compare(password, userData.senha);

      if (passwordMatch) {
        localStorage.setItem('token', token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        setUser({ ...userData, isAdmin: false });
        navigate('/');
        checkUserIsAdmin();
        return response.data;
      } else {
        console.error('Credenciais inválidas');
        return null;
      }
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      return null;
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      checkUserIsAdmin();
    } else {
      setUser(null);
    }

    setLoading(false);
  }, []);


  const logout = () => { // Adicione 'navigate' como parâmetro
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
  };

  const value = {
    user,
    loading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );

  
}