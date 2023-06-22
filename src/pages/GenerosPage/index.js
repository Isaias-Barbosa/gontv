import React from 'react';
import { Link } from 'react-router-dom';
import animes from 'json/animes.json';

export default function GenerosPage() {
    const generosUnicos = [...new Set(animes.flatMap(anime => anime.genres))];

    const chunkedGeneros = [];
    const chunkSize = 10;

    for (let i = 0; i < generosUnicos.length; i += chunkSize) {
        chunkedGeneros.push(generosUnicos.slice(i, i + chunkSize));
      }

  return (
    <div className="bg-black-light min-h-screen py-12 ">
      <h1 className="text-2xl font-bold mb-4 text-white text-center">
        <span className="border-b-2 border-emerald-400">Gêneros:</span>
        </h1>
      <div className="flex flex-col mx-auto py-12 my-12">
      {chunkedGeneros.map((chunk, index) => (
      <ul key={index} className="flex flex-wrap items-center justify-center">
         {chunk.map(genero => (
          <li key={genero}>
            <Link 
            to={`/search-genero/${genero}`} 
            className="text-white hover:text-emerald-400 inline-block px-1 py-1 m-1">
              {genero}
            </Link>
          </li>
        ))}
      </ul>
          ))}
    </div>
    </div>
  )
}
