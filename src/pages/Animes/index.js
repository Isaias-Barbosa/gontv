import React, { useState } from 'react';
import { Helmet } from "react-helmet";
import { LinearProgress } from "@mui/material";
import { useEffect } from 'react';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import CardAnime from 'components/CardAnime';
import { usePublicAnimes } from 'context/AnimeCatalogContext';

export default function Animes() {
    const animes = usePublicAnimes();
    // Estado para armazenar os dados dos animes
    const [isLoading, setIsLoading] = useState(true);
    const [animesData, setAnimesData] = useState([]);

     /*   
    // Função para buscar os animes do servidor
    const fetchAnimes = () => {
        fetch('https://animes.vision/api/v2/search?ordenar=adicionado_recentemente')
          .then(response => response.json())
          .then(data => {
            console.log(data); // Verifica se os dados estão sendo recebidos corretamente
    
            if (Array.isArray(data)) { // Verifica se data é um array
                // Filtra os animes com a propriedade category igual a "Animes"
                const currentAnimes = data.filter(anime => anime.category === 'Animes' && anime.dubbed === false).map(anime => ({
                    id: anime.id,
                    title: anime.title,
                    imageUrl: anime.thumbnail,
                    // outras propriedades do anime que você deseja exibir
                }));
    
            console.log(currentAnimes); // Verifica os animes convertidos
    
            setAnimesData(currentAnimes);
            setIsLoading(false);
        } else {
            console.log('Dados inválidos ou ausentes.');
        }
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
    const currentAnimes = animesData.slice(startIndex, endIndex);



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
                        <h2 className="text-2xl text-white text-start font-bold mb-8 p-1">
                            <span className="border-b-4 border-emerald-600 pb-1"> Animes Legendados</span>
                        </h2>
                        <div className="container mx-auto">
                            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-6 2xl:grid-cols-6 gap-3">
                                {currentAnimes.map((anime) => (
                                 <CardAnime 
                                 key={anime.id}
                                 anime={{
                                    title: anime.title,
                                    coverImage: anime.imageUrl,
                                 }}
                                 />   
                                ))}
                            </div>
                        </div>
                        
                        
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
*/
 // Função para buscar os animes do servidor
 useEffect(() => {
    // Simulação de uma requisição assíncrona
    setTimeout(() => {
        setIsLoading(false);
    }, 2000); // Tempo de simulação de carregamento (2 segundos)
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
const TVAnimes = animes.filter((anime) => anime.Type === 'TV');

// const currentAnimes = TVAnimes ? TVAnimes.slice(startIndex, endIndex) : [];

const currentAnimes = TVAnimes.slice(startIndex, endIndex);



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
                    <h2 className="text-2xl text-white text-start font-bold mb-8 p-1">
                        <span className="border-b-4 border-emerald-600 pb-1"> Animes Legendados</span>
                    </h2>
                    <div className="container mx-auto">
                        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-6 2xl:grid-cols-6 gap-3">
                            {currentAnimes.map((anime) => (
                             <CardAnime 
                             key={anime._id}
                             anime={{
                                title: anime.title,
                                coverImage: anime.coverImage,
                             }}
                             />   
                            ))}
                        </div>
                    </div>
                    {/* Paginação */}
                    {TVAnimes.length > itemsPerPage && (
                        <div className="flex justify-center mt-10">
                            <Stack spacing={2}>
                                <Pagination
                                    className="bg-zinc-800"
                                    size="large"
                                    color="primary"
                                    count={Math.ceil(TVAnimes.length / itemsPerPage)}
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