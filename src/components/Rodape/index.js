import React from 'react'
import { Link } from 'react-router-dom'


export default function Rodape() {


  const generateAlphabet = () => {
    const letters = Array.from({ length: 26 }, (_, index) =>
      String.fromCharCode(65 + index)
    );
    const modifiedLetters = ['All', '#', ...letters];
    return modifiedLetters;
  };

  return (
    <footer className="footer-container  py-4 text-white text-start">
        <div className="footer-background "></div>
      <div className="flex justify-start ">
        <h2 className="text-white font-bold ms-6 mb-3">Lista A-Z <p className="text-sm">Pesquisa pela ordem do anime pelo nome do alfabeto de A a Z.</p></h2>
      </div>
      <ul className="flex justify-start ms-5 flex-wrap mb-1">
        {generateAlphabet().map((letter) => (
          <li key={letter} className="mx-1">
            <Link
              to={`/az-list/${encodeURIComponent(letter)}`}
              className="text-white border-b-2 bg-neutral-800 hover:text-emerald-500 text-xl md:text-xl lg:text-xl xl:text-xl 2xl:text-lg px-2"
            >
              {letter}
            </Link>
          </li>
        ))}
      </ul>
      <ul className="justify-start flex flex-row gap-4 py-3 ms-5 text-center text-md font-bold">
        <li>
          <span className="text-bold text-emerald-400">Termos de Serviço</span>
        </li>
        <li>
          <span className="text-bold text-emerald-400">DMCA</span>
        </li>
        <li>
          <span className="text-bold text-emerald-400">Contato</span>
        </li>
      </ul>
      <div className="text-sm ms-5 py-1 text-slate-400 font-bold brightness-110">
        <p>
          Todos os direitos reservados aos seus respectivos proprietários.
        </p>
        <p>
          Gon.TV, <span className="text-emerald-400">2023</span>
        </p>
      </div>
      <div className="footer-content font-bold text-center md:text-start lg:text-start xl:text-start 2xl:text-start">
        <p>
          Desenvolvido por: <span className="text-bold text-emerald-400">GonFreecss</span>
        </p>
      </div>
    </footer>
  )
}
