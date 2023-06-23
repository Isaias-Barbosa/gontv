import { useParams } from 'react-router-dom';
import animes from 'json/animes.json';
import { Link } from 'react-router-dom';
import AzList from 'components/AzList';
import { MdPlayCircleFilled } from 'react-icons/md';
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { LinearProgress } from '@mui/material';

export default function AzListPage() {

    const [isLoading, setIsLoading] = useState(true);


    useEffect(() => {
        // Simulação de uma requisição assíncrona
        setTimeout(() => {
            setIsLoading(false);
        }, 2000); // Tempo de simulação de carregamento (2 segundos)
    }, []);

    const { letter } = useParams();

    const itemsPerPage = 36; // Número de animes por página


    // Verifica se a letra selecionada é "All"
    const isAllSelected = letter === 'All';
    const isNumericSelected = letter === '#';

    // Filtra os animes pela letra selecionada
    const filteredAnimes = animes.filter((anime) => {
        if (isAllSelected) {
            return true; // Retorna todos os animes
        } else if (isNumericSelected) {
            return /^[.0-9#[]/.test(anime.title); // Retorna animes com título começando por ".", números, "#" ou "["
        } else if (letter === '#') {
            return /^[.#[]/.test(anime.title); // Retorna animes com título começando por ".", "#" ou "["
        } else {
            return anime.title.startsWith(letter); // Retorna animes com título começando pela letra selecionada
        }
    });

    // Ordena os animes por título em ordem alfabética
    filteredAnimes.sort((anime1, anime2) => {
        const title1 = anime1.title.toLowerCase();
        const title2 = anime2.title.toLowerCase();
        if (title1 < title2) {
            return -1;
        }
        if (title1 > title2) {
            return 1;
        }
        return 0;
    });

    // Estado para controlar a página atual
    const [currentPage, setCurrentPage] = useState(1);

    // Cálculo dos índices inicial e final dos animes a serem exibidos
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    // Animes da página atual
    const currentAnimes = filteredAnimes.slice(startIndex, endIndex);


    const MAX_TITLE_LENGTH = 20; // Define o número máximo de caracteres do título

    const truncateTitle = (title) => {
        if (title.length > MAX_TITLE_LENGTH) {
            return title.substring(0, MAX_TITLE_LENGTH) + '...';
        }
        return title;
    };

    // Função para navegar para a página selecionada
    const handlePageChange = (event, newPage) => {
        setCurrentPage(newPage);
    };

    const pageTitle = `Gon.TV - AZ-List - ${letter}`

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

            <div className="bg-black-dark py-8 min-h-screen ">
                <div>
                    <h1 className="text-white font-bold text-lg text-center py-2">
                        <span className="border-b-2 border-emerald-400">Ordene por Letras</span></h1>
                </div>
                <div className="container mx-auto px-7 max-w-7xl mb-6 xl:px-1 2xl:px-1">
                    <AzList selectedLetter={letter} />
                    {filteredAnimes.length === 0 ? (
                        <h1 className="text-white text-xl font-bold text-center py-8">Não há animes com essa letra.</h1>
                    ) : (
                        <div class="container mx-auto py-7">
                            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-6 2xl:grid-cols-6 gap-3">
                                {currentAnimes.map((anime) => (
                                    <div className="aspect-ratio-box">
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
                            {filteredAnimes.length > itemsPerPage && (
                                <div className="flex justify-center mt-10">
                                    <Stack spacing={2}>
                                        <Pagination
                                            className="bg-zinc-800"
                                            size="large"
                                            color="primary"
                                            count={Math.ceil(filteredAnimes.length / itemsPerPage)}
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
                </div>
            </div>
      )}
        </>
    )
}
