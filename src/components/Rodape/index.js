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
    <footer className="bg-black py-4 text-white text-center  ">
     <h2 className="text-white font-bold ms-5 mb-3">ListaAZ <p>Pesquisa pela ordem do anime pelo nome do alfabeto de A a Z.</p></h2>     
      <ul className="flex justify-center ms-3 flex-wrap mb-1">
      {generateAlphabet().map((letter) => (
          <li key={letter} className="mx-1">
            <Link
               to={`/az-list/${encodeURIComponent(letter)}`}
              className="text-white border-b-2 bg-neutral-800 hover:text-emerald-500 text-xl md:text-xl lg:text-xl xl:text-xl 2xl:text-xl px-2"
            >
             {letter}
            </Link>
          </li>
        ))}
      </ul>
      <div className="footer-content text-center">
        <p>
          Desenvolvido por: <span className="text-bold text-emerald-400">GonFreecss</span>
        </p>
      </div>
    </footer>
  )
}
