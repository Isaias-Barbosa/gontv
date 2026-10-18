import { getRecentEpisodes } from 'lib/homeFeed';
import Banner from "components/Banner";
import PopularAnime from "components/PopularAnime";
import React, { useState, useMemo } from 'react';
import { MdPlayCircleFilled } from 'react-icons/md';
import LastAddedAnimes from "components/LastAddedAnimes";
import LastAddedAnimesDublado from 'components/LastAddedAnimesDublado';
import { Link } from 'react-router-dom';
import LastAddedFilmes from "components/LastAddedFilmes";
import 'tailwindcss/tailwind.css';
import { Helmet } from "react-helmet";
import Calendar from "components/Calendar";
import { usePublicAnimes } from 'context/AnimeCatalogContext';

export default function Home() {
const animes = usePublicAnimes();
const recentEpisodes = useMemo(() => getRecentEpisodes(animes).slice(0, 20), [animes]);

const pageTitle = `Gon.TV - Animes Online em FHD`;

const MAX_TITLE_LENGTH = 30; // Define o número máximo de caracteres do título

const truncateTitle = (title) => {
  if (title.length > MAX_TITLE_LENGTH) {
    return title.substring(0, MAX_TITLE_LENGTH) + '...';
  }
  return title;
};

const [hoveredIndex, setHoveredIndex] = useState(null);

//Pegue a data do dia e compara com os dias da semana.
const date = new Date().toLocaleDateString('pt-BR', {
  weekday: 'long',
}).toLowerCase();

 //Filtra os animes que tem dentro da categoria "date" e compara o tamanho das letras
 const todayAnimes = animes.filter((anime) => String(anime.date || '').toLowerCase() === date);
 //const formattedDate = date.charAt(0).toUpperCase() + date.slice(1);

const title = `Animes de Hoje`;

return (

  <>
    <Helmet>
      <title>{pageTitle}</title>
    </Helmet>

      <div className="bg-black-dark">
        <Banner />
        <main className="container mx-auto py-8">

        <div className="calendar mb-5 items-center  mx-auto">
              <div>
              <Calendar animesByDate={{ [title]: todayAnimes }} />
              </div>
            </div>

            <div className="section">
              <PopularAnime />
            </div>

          <div className="section" role="region" aria-label="Lançamentos">

            <div className="container mx-auto px-7 max-w-7xl mb-6 xl:px-1 2xl:px-1">
              <h2 className="text-2xl text-start text-white font-bold p-1 ">
                <span className="border-b-4 border-emerald-600 pb-1"> Lançamentos</span>
              </h2>
              <div className="text-end">
                <Link to="/lancamentos" className="text-emerald-600 hover:text-emerald-500 text-end font-bold">
                  Ver Todos
                </Link>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-4">
                {recentEpisodes.map(({ anime, episode: lastEpisode }, index) => {
                  return (
                    <Link
                      to={`/animes/${anime.slug}/${lastEpisode.titleSlug}/${lastEpisode.languageEpisode}`}
                      key={`${anime.id}:${lastEpisode.id || lastEpisode.titleSlug}:${lastEpisode.languageEpisode}`}
                    >
                      <div
                        className="p-1 relative"
                        style={{ maxWidth: '320px', height: '100%' }}
                        onMouseEnter={() => setHoveredIndex(index)}
                        onMouseLeave={() => setHoveredIndex(null)}
                      >
                        <div className="relative thumbnail">
                          <img
                            src={lastEpisode.thumbnail}
                            loading="lazy" decoding="async"
                            alt={anime.title}
                            className="w-full h-auto"
                          />
                          {hoveredIndex === index && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity duration-300">
                              <MdPlayCircleFilled className="text-white text-5xl" />
                            </div>
                          )}
                          <div className="absolute top-0 left-8 flex items-center justify-center ms-1 p-2">
                            <div className={`text-xs font-bold ${lastEpisode.languageEpisode !== 'dublado' ? 'bg-rose-500 text-white' : 'bg-blue-500 text-white'} rounded-md px-2 py-1`}>
                              {lastEpisode.languageEpisode !== 'dublado' ? 'LEG' : 'Dub'}
                            </div>
                          </div>
                          <div className="absolute top-0 left-0 bg-emerald-700 rounded-md m-2 p-1">
                            <p className="text-white text-xs font-bold">{anime.resoAnime}</p>
                          </div>
                        </div>
                        <h3 className="text-center text-white font-bold text-base sm:text-lg md:text-xl xl:text-lg 2xl:text-lg">{truncateTitle(anime.title)}</h3>
                        <p className="text-base text-gray-500 text-center font-bold sm:text-sm md:text-base xl:text-sm 2xl:text-md">{lastEpisode.titleEpisodio}</p>
                      </div>
                    </Link>
                  )
                })}
              </div>

            </div>
          </div>
          <div className="section animes-legendados" role="region" aria-label="Novos Animes Legendados">
            <LastAddedAnimes animes={animes} />
          </div>
          <div className="section animes-dublados" role="region" aria-label="Novos Animes Dublados">
            <LastAddedAnimesDublado animes={animes} />
          </div>
          <div className="section filmes-animes" role="region" aria-label="Novos Filmes Adicionados">
            <LastAddedFilmes animes={animes} />
          </div>
        </main>
      </div>
  </>

)
}
