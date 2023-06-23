import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MdPlayCircleFilled } from 'react-icons/md';
import animes from 'json/animes.json';
import { LinearProgress, Pagination, Stack } from '@mui/material';

export default function AnimesLancamentos() {

  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
    // Simulação de uma requisição assíncrona
    setTimeout(() => {
      setIsLoading(false);
    }, 2000); // Tempo de simulação de carregamento (2 segundos)
  }, []);


  const MAX_TITLE_LENGTH = 20;

  const truncateTitle = (title) => {
    if (title.length > MAX_TITLE_LENGTH) {
      return title.substring(0, MAX_TITLE_LENGTH) + '...';
    }
    return title;
  };

  const itemsPerPage = 32; // Número de animes por página

  // Estado para controlar a página atual
  const [currentPage, setCurrentPage] = useState(1);

  // Cálculo dos índices inicial e final dos animes a serem exibidos
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  // Animes da página atual
  const currentAnimes = animes.slice(startIndex, endIndex);

  // Função para navegar para a página selecionada
  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage);
  };


  return (
    <section>
      {isLoading ? (
        // Exibir o spinner de pré-carregamento enquanto os dados estão sendo carregados   
        <div className="min-h-screen bg-black-dark flex justify-start flex-col">
          <LinearProgress />
        </div>
      ) : (
        <div className="bg-black-dark py-10">
          <div className="container mx-auto px-7 max-w-7xl mb-6 xl:px-1 2xl:px-1">
            <h2 className="text-2xl text-start text-white font-bold mb-8 p-1">
              <span className="border-b-4 border-emerald-600 pb-1">Todos os Lancamentos</span>
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-4">
              {currentAnimes.map((anime, index) => (
                <Link to={`/animes/${anime.slug}/${anime.episodes[0].titleSlug}/${anime.episodes[0].languageEpisode}`} key={index}>
                  <div className="p-1">
                    <div className="relative">
                      <div className="absolute top-0 left-8 flex items-center justify-center ms-1 p-2">
                        <div className={`text-xs font-bold ${anime.language === 'Legendado' ? 'bg-rose-500 text-white' : 'bg-blue-500 text-white'} rounded-md px-2 py-1`}>
                          {anime.language === 'Legendado' ? 'LEG' : 'DUB'}
                        </div>
                      </div>
                      <div className="absolute top-0 left-0 bg-emerald-700 rounded-md m-2 p-1">
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
          {animes.length > itemsPerPage && (
            <div className="flex justify-center mt-10">
              <Stack spacing={2}>
                <Pagination
                  className="bg-zinc-800"
                  size="large"
                  color="primary"
                  count={Math.ceil(animes.length / itemsPerPage)}
                  page={currentPage}
                  onChange={handlePageChange}
                  sx={{
                    '& .Mui-selected': {
                      color: 'white',
                    },
                    '& .MuiPaginationItem-root': {
                      color: 'white',
                    },
                    '& .MuiPaginationItem-page.Mui-selected': {
                      backgroundColor: '#00b894', // Defina a cor desejada para a bolinha selecionada
                    },
                    '& .MuiPaginationItem-page:hover': {
                      backgroundColor: 'transparent',
                      color: 'white',
                    },
                    '& .MuiPaginationItem-page.Mui-selected:hover': {
                      backgroundColor: '#00b894',
                    },
                  }}
                />
              </Stack>
            </div>
          )}
        </div>
      )}
    </section>
  );
}