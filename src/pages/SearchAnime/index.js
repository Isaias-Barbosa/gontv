import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom';
import animes from 'json/animes.json';
import { MdPlayCircleFilled } from 'react-icons/md';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { LinearProgress } from '@mui/material';

export default function SearchAnime() {


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

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get('query') || '';
  const letter = useParams().letter || '';

  // Filtra os animes com base na consulta de pesquisa
  const filteredAnimes = animes.filter((anime) => {
    const animeTitle = anime.title.toLowerCase();
    if (searchQuery) {
      return animeTitle.includes(searchQuery.toLowerCase());
    } else if (letter) {
      return animeTitle.startsWith(letter.toLowerCase());
    }
    return true;
  });

  const itemsPerPage = 36; // Número de animes por página

  // Estado para controlar a página atual
  const [currentPage, setCurrentPage] = useState(1);

  // Cálculo dos índices inicial e final dos animes a serem exibidos
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  // Animes da página atual
  const currentAnimes = filteredAnimes.slice(startIndex, endIndex);

  // Função para navegar para a página anterior
  const goToPreviousPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  // Função para navegar para a próxima página
  const goToNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const pageTitle = `Gon.TV - ${searchQuery} `;

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
      </Helmet>
      {isLoading ? (
        // Exibir o spinner de pré-carregamento enquanto os dados estão sendo carregados   
        <div className="min-h-screen bg-black-dark flex justify-start flex-col">
          <LinearProgress />
        </div>
      ) : (
      <div className='bg-black-dark py-8 min-h-screen '>
        <div className="container mx-auto px-7 max-w-7xl mb-6 xl:px-1 2xl:px-1">
          <h1 className='text-lg text-white text-center py-8'>
            <>
              Resultados da pesquisa para:{" "}
              <span className="text-emerald-400 mx-3">"{searchQuery}"</span>
            </>
          </h1>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-6 2xl:grid-cols-6 gap-3">
            {currentAnimes.map((anime) => (
              <div className="aspect-ratio-box" >
                <div className="relative">
                  <Link to={`/animes/${anime.slug}`} key={anime.id}>
                    <div className="anime-cover">
                      <img src={anime.coverImage} alt={anime.title} className="object-cover custom-height" />
                      <div className="overlay"></div>
                      <button className="play-button">
                        <MdPlayCircleFilled className="text-white text-5xl" />
                      </button>
                    </div>
                  </Link>
                  <h2 className="text-lg text-white font-semibold mt-2">{truncateTitle(anime.title)}</h2>
                </div>
              </div>
            ))}
          </div>

          {/* Paginação */}
          {filteredAnimes.length > itemsPerPage && (
            <div className="flex justify-center mt-6">
              {currentPage > 1 && (
                <button
                  className="mr-2 px-4 py-2 bg-emerald-400 text-white rounded-md hover:bg-emerald-500 focus:outline-none focus:bg-emerald-500"
                  onClick={goToPreviousPage}
                >
                  Anterior
                </button>
              )}
              {endIndex < filteredAnimes.length && (
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
      )}
    </>
  )
}
