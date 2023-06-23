import React, {useEffect, useState} from 'react';
import { Link, useParams } from 'react-router-dom';
import animes from 'json/animes.json';
import { MdPlayCircleFilled } from 'react-icons/md';
import { Helmet } from 'react-helmet';
import { LinearProgress } from '@mui/material';

export default function SearchGenero() {

    const [isLoading, setIsLoading] = useState(true);


    useEffect(() => {
        // Simulação de uma requisição assíncrona
        setTimeout(() => {
            setIsLoading(false);
        }, 2000); // Tempo de simulação de carregamento (2 segundos)
    }, []);

    const MAX_TITLE_LENGTH = 15; // Define o número máximo de caracteres do título

    const truncateTitle = (title) => {
        if (title.length > MAX_TITLE_LENGTH) {
            return title.substring(0, MAX_TITLE_LENGTH) + '...';
        }
        return title;
    };


    const { genero } = useParams();

    // Filtrar os animes pelo gênero selecionado
    const animesPorGenero = animes.filter(anime => anime.genres.includes(genero));

    const pageTitle = `Gon.TV - ${genero} `;

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
            <div className="bg-black-dark min-h-screen py-8">
                <div className="container mx-auto px-7 max-w-7xl mb-6 xl:px-1 2xl:px-1" >
                    <h1 className="text-3xl text-white font-bold mb-2 text-center">Gênero - <span className="text-emerald-400">{genero}</span></h1>
                    <div className="container mx-auto py-8">
                        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-6 2xl:grid-cols-6 gap-3">
                            {animesPorGenero.map((anime) => (
                                <div className="aspect-ratio-box" key={anime.id} >
                                    <div className="relative">
                                        <Link to={`/animes/${anime.slug}`}>
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
                </div>
            </div>
      )}
        </>

    )
}
