import animes from 'json/animes.json'
import { Link } from 'react-router-dom'
import { MdPlayCircleFilled } from 'react-icons/md';
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Pagination, Stack } from '@mui/material';
import { LinearProgress } from "@mui/material";
import CardAnime from 'components/CardAnime';

export default function Filmes() {

  // Estado para armazenar os dados dos animes
  const [isLoading, setIsLoading] = useState(true);
  const [animesData, setAnimesData] = useState([]);

  // Função para buscar os animes do servidor
  const fetchAnimes = () => {
    fetch('http://localhost:3001/animes')
      .then(response => response.json())
      .then(data => {
        console.log(data); // Verifica se os dados estão sendo recebidos corretamente

        const currentAnimes = data.map(anime => ({
          id: anime.data.mal_id,
          title: anime.data.title,
          imageUrl: anime.data.images?.jpg?.large_image_url,
          tv: anime.data.type,
          // outras propriedades do anime que você deseja exibir

        }));

        console.log(currentAnimes); // Verifica os animes convertidos

        setAnimesData(currentAnimes);
        setTimeout(() => {
          setIsLoading(false);
        }, 2000);
      })
      .catch(error => {
        console.log('Ocorreu um erro:', error);
      });
  };

  useEffect(() => {
    fetchAnimes();
  }, []);

  console.log(animesData)

  const pageTitle = `Gon.TV - Lista de Animes Legendados`;

  // Filtra os animes legendados

  const itemsPerPage = 36; // Número de animes por página

  // Estado para controlar a página atual
  const [currentPage, setCurrentPage] = useState(1);

  // Cálculo dos índices inicial e final dos animes a serem exibidos
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  // Animes da página atual
  const TVAnimes = animesData.filter((anime) => anime.tv === 'Movie');
  const currentAnimes = TVAnimes ? TVAnimes.slice(startIndex, endIndex) : [];



  console.log(currentAnimes)

  // Função para navegar para a página selecionada
  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage);
  };

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
        <div className="bg-black-dark py-8">
          <div className="container mx-auto px-7 max-w-7xl mb-6 xl:px-1 2xl:px-1">
            <h2 className="text-2xl text-white text-start font-bold mb-4 pb-1 py-7">
              <span className="border-b-4 border-emerald-600 pb-1"> Filmes</span>
            </h2>
            <div class="container mx-auto">
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 xl:grid-cols-6 2xl:grid-cols-6 gap-3">
                {currentAnimes.map((anime) => (
                  <CardAnime
                    key={anime._id}
                    anime={{
                      title: anime.title,
                      coverImage: anime.imageUrl,
                    }}
                  />
                ))}
              </div>
            </div>
            {/* Paginação */}
            {animesData.length > itemsPerPage && (
              <div className="flex justify-center mt-10">
                <Stack spacing={2}>
                  <Pagination
                    className="bg-zinc-800"
                    size="large"
                    color="primary"
                    count={Math.ceil(animesData.length / itemsPerPage)}
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
        </div>
      )}
    </>
  )
}
