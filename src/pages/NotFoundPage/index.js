import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';

export default function NotFoundPage() {

  const pageTitle = 'Gon.TV - Page Not Found'

  return (
    <>
    <Helmet>
        <title>{pageTitle}</title>
    </Helmet>


    <div className="flex flex-col items-center justify-center h-screen bg-black-dark">
      <h1 className="text-4xl font-bold text-white mb-6">Essa Página Não Existe</h1>
      <img
        className="max-w-sm w-full mb-6"
        src="https://i.pinimg.com/originals/d0/af/43/d0af430ef721e6a6cfa3f0225caee3d8.jpg"
        alt="Personagem"
      />
      <Link to="/">
      <button>
       <h1 className="text-3xl text-emerald-400 font-bold">Voltar</h1> 
      </button>
      </Link>
    </div>
    </>
  );
}
