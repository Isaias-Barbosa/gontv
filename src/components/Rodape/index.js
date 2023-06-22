import React from 'react'
import { Link } from 'react-router-dom'



export default function Rodape() {

  const generateAlphabet = () => {
    const letters = Array.from({ length: 26 }, (_, index) =>
      String.fromCharCode(65 + index)
    );
    const modifiedLetters = ['All', '0-9', ...letters];
    return modifiedLetters;
  };

  return (
    <footer className="bg-black py-4 h-96 text-white text-center  ">
      <div className="relative">
        <img
          src="https://4kwallpapers.com/images/wallpapers/gon-freecss-hunter-3840x2160-10431.png"
          className="absolute inset-0 w-full h-96 opacity-20 object-cover"
          alt="Background"
        />
        <div className="z-10 relative">
          <h2 className="text-white font-bold ms-5 mb-3">ListaAZ <p>Pesquisa pela ordem do anime pelo nome do alfabeto de A a Z.</p></h2>
          <ul className="flex justify-center ms-3 flex-wrap mb-1">
            {generateAlphabet().map((letter) => (
              <li key={letter} className="mx-1">
                <Link
                  to={`/az-list/${letter}`}
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
        </div>
      </div>
    </footer>
  )
}
