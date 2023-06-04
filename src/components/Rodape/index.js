import React from 'react'
import { Link } from 'react-router-dom'
import logo from 'assets/Gon_Freecss.png';


export default function Rodape() {
  return (
    <footer className="bg-gray-950 py-4 text-white text-center ">
      <ul className="flex justify-center ms-3 flex-wrap mb-1">
        {Array.from({ length: 26 }, (_, index) => (
          <li key={index} className="mx-1">
            <Link
              to={`/search/${String.fromCharCode(65 + index)}`}
              className="text-white border-b-2 border-emerald-400 hover:text-emerald-500 text-xl md:text-2xl lg:text-3xl xl:text-4xl 2xl:text-2xl px-2"
            >
              {String.fromCharCode(65 + index)}
            </Link>
          </li>
        ))}
      </ul>
      <div className="footer-content">
        <p>
          Desenvolvido por: <span className="text-bold text-emerald-400">GonFreecss</span>
        </p>
      </div>
    </footer>
  )
}
