import animes from 'json/animes.json'
import { Link } from 'react-router-dom'
import { MdPlayCircleFilled } from 'react-icons/md';
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { LinearProgress, Pagination, Stack } from "@mui/material";


export default function TVAnimes() {

    const [isLoading, setIsLoading] = useState(true);


    useEffect(() => {
        // Simulação de uma requisição assíncrona
        setTimeout(() => {
            setIsLoading(false);
        }, 2000); // Tempo de simulação de carregamento (2 segundos)
    }, []);

    const pageTitle = `Gon.TV - Lista de Animes em Lançamento`;

    const MAX_TITLE_LENGTH = 15; // Define o número máximo de caracteres do título

    const truncateTitle = (title) => {
        if (title.length > MAX_TITLE_LENGTH) {
            return title.substring(0, MAX_TITLE_LENGTH) + '...';
        }
        return title;
    };

    // Filtra os animes com status de Lançamento
    const tvAnimes = animes.filter((anime) => anime.Status === 'Em Lançamento');

    const itemsPerPage = 36; // Número de animes por página

    // Estado para controlar a página atual
    const [currentPage, setCurrentPage] = useState(1);

    // Cálculo dos índices inicial e final dos animes a serem exibidos
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    // Animes da página atual
    const currentAnimes = tvAnimes.slice(startIndex, endIndex);

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
                            <span className="border-b-4 border-emerald-600 pb-1"> Animes Em Lançamento</span>
                        </h2>
                        <div class="container mx-auto">
                            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-6 2xl:grid-cols-6 gap-3">

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
                        {tvAnimes.length > itemsPerPage && (
                            <div className="flex justify-center mt-10">
                                <Stack spacing={2}>
                                    <Pagination
                                        className="bg-zinc-800"
                                        size="large"
                                        color="primary"
                                        count={Math.ceil(tvAnimes.length / itemsPerPage)}
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
