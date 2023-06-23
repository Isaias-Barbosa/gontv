import Banner from "components/Banner";
import PopularAnime from "components/PopularAnime";
import React, { useState, useEffect } from 'react';
import { MdPlayCircleFilled } from 'react-icons/md';
import LastAddedAnimes from "components/LastAddedAnimes";
import LastAddedAnimesDublado from 'components/LastAddedAnimesDublado';
import { Link } from 'react-router-dom';
import animes from 'json/animes.json';
import LastAddedFilmes from "components/LastAddedFilmes";
import 'tailwindcss/tailwind.css';
import { Helmet } from "react-helmet";
import { LinearProgress } from "@mui/material";
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';


export default function Home() {

  const pageTitle = `Gon.TV - Animes Online em FHD`;
  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
    // Simulação de uma requisição assíncrona
    setTimeout(() => {
      setIsLoading(false);
    }, 2000); // Tempo de simulação de carregamento (2 segundos)
  }, []);

  const MAX_TITLE_LENGTH = 20; // Define o número máximo de caracteres do título

  const truncateTitle = (title) => {
    if (title.length > MAX_TITLE_LENGTH) {
      return title.substring(0, MAX_TITLE_LENGTH) + '...';
    }
    return title;
  };

  const [hoveredIndex, setHoveredIndex] = useState(null);


  return (

    <>
      <Helmet>
        <title>{pageTitle}</title>
      </Helmet>

      {isLoading ? (
        // Exibir o progress de pré-carregamento enquanto os dados estão sendo carregados   
        <div className="min-h-screen bg-black-dark flex justify-start flex-col">
          <LinearProgress />
        </div>
      ) : (
        <div className="bg-black-dark">
          <Banner />
          <main className="container mx-auto py-8">
            <div className="section">
              <PopularAnime />
            </div>

            <div className="section">

              <div className="container mx-auto px-7 max-w-7xl mb-6 xl:px-1 2xl:px-1">
                <h2 className="text-2xl text-start text-white font-bold mb-1 p-1 ">
                  <span className="border-b-4 border-emerald-600 pb-1"> Lançamentos</span>
                </h2>
                <div className="text-end">
                  <Link to="/lancamentos" className="text-emerald-600 hover:text-emerald-500 text-end font-bold">
                    Ver Todos
                  </Link>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-4">
                  {animes.slice(0, 20).map((anime, index) => {
                    const lastEpisode = anime.episodes[anime.episodes.length - 1];
                    return (
                      <Link
                        to={`/animes/${anime.slug}/${lastEpisode.titleSlug}/${lastEpisode.languageEpisode}`}
                        key={index}
                      >
                        <div
                          className="p-1 relative"
                          style={{ maxWidth: '320px', height: '100%' }}
                          onMouseEnter={() => setHoveredIndex(index)}
                          onMouseLeave={() => setHoveredIndex(null)}
                        >
                          <div className="relative thumbnail">
                            <img
                              src={anime.episodes[anime.episodes.length - 1].thumbnail}
                              alt={anime.title}
                              className="w-full h-auto"
                            />
                            {hoveredIndex === index && (
                              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity duration-300">
                                <MdPlayCircleFilled className="text-white text-5xl" />
                              </div>
                            )}
                            <div className="absolute top-0 left-8 flex items-center justify-center ms-1 p-2">
                              <div className={`text-xs font-bold ${anime.language === 'Legendado' ? 'bg-rose-500 text-white' : 'bg-blue-500 text-white'} rounded-md px-2 py-1`}>
                                {anime.language === 'Legendado' ? 'LEG' : 'Dub'}
                              </div>
                            </div>
                            <div className="absolute top-0 left-0 bg-emerald-700 rounded-md m-2 p-1">
                              <p className="text-white text-xs font-bold">{anime.resoAnime}</p>
                            </div>
                          </div>
                          <h3 className="text-center text-white font-bold text-base sm:text-lg md:text-xl xl:text-lg 2xl:text-lg">{truncateTitle(anime.title)}</h3>
                          <p className="text-base text-gray-500 text-center font-bold sm:text-sm md:text-base xl:text-sm 2xl:text-md">{anime.episodes[anime.episodes.length - 1].titleEpisodio}</p>
                        </div>
                      </Link>
                    )
                  })}
                </div>

              </div>
            </div>
            <div className="section animes-legendados">
              <LastAddedAnimes animes={animes} />
            </div>
            <div className="section animes-dublados">
              <LastAddedAnimesDublado animes={animes} />
            </div>
            <div className="section filmes-animes">
              <LastAddedFilmes animes={animes} />
            </div>
          </main>
        </div>
      )}
    </>


  )
}
