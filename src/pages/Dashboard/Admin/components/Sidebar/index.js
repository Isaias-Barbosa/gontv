import React from 'react';
import { Link } from 'react-router-dom';

export default function Sidebar () {

  return (
    <div className="bg-gray-900 text-white h-screen w-64 fixed left-0 top-0">
      <div className="p-4">
        <h2 className="text-xl font-bold text-center text-emerald-400">Painel Adm</h2>
      </div>
      <nav className="mt-4 py-8">
        <ul>
          <li className="px-4 py-2 hover:bg-gray-800">
            <Link to="/dashboard/admin">
              <span className="mr-2">&#10148;</span>Temporadas
            </Link>
          </li>
          <li className="px-4 py-2 hover:bg-gray-800">
            <Link to="/dashboard/posts">
              <span className="mr-2">&#10148;</span>Posts
            </Link>
          </li>
          <li className="px-4 py-2 hover:bg-gray-800">
            <Link to="/dashboard/banners">
              <span className="mr-2">&#10148;</span>Banners
            </Link>
          </li>
          <li className="px-4 py-2 hover:bg-gray-800">
            <Link to="/dashboard/generos">
              <span className="mr-2">&#10148;</span>Gêneros
            </Link>
          </li>
        </ul>
      </nav>
      {/* Removido o bloco de usuários cadastrados */}
    </div>
  );
};
