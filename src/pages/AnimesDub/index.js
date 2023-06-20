import animes from 'json/animes.json'
import { Link } from 'react-router-dom'
import { MdPlayCircleFilled } from 'react-icons/md';
import React, { useState } from 'react';
import { Helmet } from "react-helmet";

export default function AnimesDub() {

  const pageTitle = `Gon.TV - Lista de Animes Dublados`;

  const MAX_TITLE_LENGTH = 20; // Define o número máximo de caracteres do título

  const truncateTitle = (title) => {
    if (title.length > MAX_TITLE_LENGTH) {
      return title.substring(0, MAX_TITLE_LENGTH) + '...';
    }
    return title;
  };

  // Filtra os animes dublados
  const dubladoAnimes = animes.filter((anime) => anime.language === 'Dublado');

  const itemsPerPage = 36; // Número de animes por página

  // Estado para controlar a página atual
  const [currentPage, setCurrentPage] = useState(1);

  // Cálculo dos índices inicial e final dos animes a serem exibidos
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  // Animes da página atual
  const currentAnimes = dubladoAnimes.slice(startIndex, endIndex);

  // Função para navegar para a página anterior
  const goToPreviousPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  // Função para navegar para a próxima página
  const goToNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  return (
    <>

      <Helmet>
        <title>{pageTitle}</title>
      </Helmet>

      <div className="bg-black-dark py-8">
        <div className="container mx-auto px-7 max-w-7xl mb-6 xl:px-1 2xl:px-1">
          <h2 className="text-2xl text-white text-start font-bold mb-4 pb-1 py-7">
            <span className="border-b-4 border-emerald-600 pb-1"> Animes Dublados</span>
          </h2>
          <div class="container mx-auto">
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 xl:grid-cols-6 2xl:grid-cols-6 gap-3">
              {currentAnimes.map((anime) => (
                <div className="aspect-ratio-box" >
                  <div className="relative">
                    <Link to={`/animes/${anime.slug}`} key={anime.id}>
                      <div className="anime-cover">
                        <img
                          src={anime.coverImage}
                          alt={anime.title}
                          className="object-cover custom-height"

                        />
                        <div className="overlay"></div>
                        <button className="play-button">
                          <MdPlayCircleFilled className="text-white text-5xl" />
                        </button>
                      </div>
                    </Link>
                    <h3 className="text-lg text-white text-center mb-3 px-2 font-semibold">{truncateTitle(anime.title)}</h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Paginação */}
          {dubladoAnimes.length > itemsPerPage && (
            <div className="flex justify-center mt-6">
              {currentPage > 1 && (
                <button
                  className="mr-2 px-4 py-2 bg-emerald-400 text-white rounded-md hover:bg-emerald-500 focus:outline-none focus:bg-emerald-500"
                  onClick={goToPreviousPage}
                >
                  Anterior
                </button>
              )}
              {endIndex < dubladoAnimes.length && (
                <button
                  className="px-4 py-2 bg-emerald-400 text-white rounded-md hover:bg-emerald-500 focus:outline-none focus:bg-emerald-500"
                  onClick={goToNextPage}
                >
                  Próxima
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
