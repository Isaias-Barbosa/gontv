import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from 'Auth/auth';

export default function Navbar () {
    const {user, logout } = useAuth(); // Obtenha o usuário e a função de logout do useAuth
    const navigate = useNavigate();

  
    return (
      <div className="bg-neutral-900 text-white p-5 flex items-center"> 
      <div className="flex justify-center items-center flex-grow">
        <h2 className="text-xl font-bold text-center">Bem-Vindo, {user.nome}</h2>
      </div>
      <div className="justify-end">
      <Link to="/">       
      <button className="text-white border-b-2 border-emerald-400 text-lg hover:text-blue-400 px-4">
          Home | 
        </button>
        </Link>
        <button className="text-white border-b-2 border-emerald-400 text-lg hover:text-blue-400"  onClick={() => logout(navigate)}>
         |  Sair
        </button>
        </div>
      </div>
    );
  };
