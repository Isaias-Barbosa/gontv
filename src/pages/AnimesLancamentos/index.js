import React from 'react';
import { Link } from 'react-router-dom';
import { MdPlayCircleFilled } from 'react-icons/md';
import animes from 'json/animes.json';

export default function AnimesLancamentos() {
  const MAX_TITLE_LENGTH = 20;

  const truncateTitle = (title) => {
    if (title.length > MAX_TITLE_LENGTH) {
      return title.substring(0, MAX_TITLE_LENGTH) + '...';
    }
    return title;
  };

  return (
    <section>
        <div className="bg-black-light py-10">
      <div className="container mx-auto px-7 max-w-7xl mb-6 xl:px-1 2xl:px-1">
        <h2 className="text-2xl text-start text-white font-bold mb-8 p-1">
          <span className="border-b-4 border-emerald-600 pb-1">Todos os Lancamentos</span>
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-4">
          {animes.map((anime, index) => (
            <Link to={`/animes/${anime.slug}`} key={index}>
              <div className="p-1">
                <div className="relative">
                  <div className="absolute bg-emerald-700 rounded-none m-2 p-1">
                    <p className="text-white text-xs font-bold">{anime.resoAnime}</p>
                  </div>
                  <img src={anime.episodes[0].thumbnail} alt={anime.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity duration-300">
                    <MdPlayCircleFilled className="text-white text-5xl" />
                  </div>
                </div>
                <h3 className="text-center text-white font-bold text-base sm:text-lg md:text-xl xl:text-lg 2xl:text-lg">{truncateTitle(anime.title)}</h3>
                <p className="text-base text-gray-500 text-center font-bold sm:text-sm md:text-base xl:text-sm 2xl:text-md">{anime.episodes[0].titleEpisodio}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>    
      </div>
    </section>
  );
}