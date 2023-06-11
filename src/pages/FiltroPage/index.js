import Filtro from 'components/Filtro';
import React, { useState, useEffect } from 'react';
import data from 'json/animes.json';
import { Link } from 'react-router-dom';
import { MdPlayCircleFilled } from 'react-icons/md';
import { useLocation } from 'react-router-dom';


export default function FiltroPage() {

    const location = useLocation();

    const truncateTitle = (title) => {
        if (title.length > MAX_TITLE_LENGTH) {
            return title.substring(0, MAX_TITLE_LENGTH) + '...';
        }
        return title;
    };

    const MAX_TITLE_LENGTH = 15; // Define o número máximo de caracteres do título


    const [filtro, setFiltro] = useState({
        tipo: '',
        language: '',
        generos: [],
        estudio: '',
        diretor: '',
        ano: '',
        temporada: '',
        fansub: '',
        status: '',
    });

    const [animesFiltrados, setAnimesFiltrados] = useState([]);

    const extractOptions = () => {
        const options = {
            tipos: [],
            language: [],
            generos: [],
            estudios: [],
            diretores: [],
            anos: [],
            temporadas: [],
            fansubs: [],
            status: [],
        };

        data.forEach((anime) => {
            if (!options.tipos.includes(anime.Type)) {
                options.tipos.push(anime.Type);
            }

            if (!options.language.includes(anime.language)) {
                options.language.push(anime.language);
            }

            if (anime.genres && anime.genres.length > 0) {
                anime.genres.forEach((genre) => {
                    if (!options.generos.includes(genre)) {
                        options.generos.push(genre);
                    }
                });
            }


            if (anime.director && !options.diretores.includes(anime.director)) {
                options.diretores.push(anime.director);
            }


            if (anime.studio && !options.estudios.includes(anime.studio)) {
                options.estudios.push(anime.studio);
            }

            if (anime.year && !options.anos.includes(anime.year)) {
                options.anos.push(anime.year);
            }

            if (anime.Premiered && !options.temporadas.includes(anime.Premiered)) {
                options.temporadas.push(anime.Premiered);
            }

            if (anime.Fansub && !options.fansubs.includes(anime.Fansub)) {
                options.fansubs.push(anime.Fansub);
            }

            if (anime.Status && !options.status.includes(anime.Status)) {
                options.status.push(anime.Status);
            }
        });

        return options;
    };

    const options = extractOptions(); // Extrair as opções dos filtros

    const handleFiltroChange = (newFiltro) => {
        setFiltro(newFiltro);
    };

    const handleFilterButtonClick = () => {

        if (Object.values(filtro).every((value) => value === '')) {
            setAnimesFiltrados(data);
            return;
        }

        const filteredAnimes = data.filter((anime) => {
            let matchesFiltro = true;

            if (filtro.tipo && anime.Type !== filtro.tipo) {
                matchesFiltro = false;
            }

            if (filtro.language && anime.language !== filtro.language) {
                matchesFiltro = false;
            }


            if (
                filtro.generos &&
                filtro.generos.length > 0 &&
                (!anime.genres || !filtro.generos.every((genero) => anime.genres.includes(genero)))
              ) {
                matchesFiltro = false;
              }


            if (filtro.estudio && anime.studio && !anime.studio.includes(filtro.estudio)) {
                matchesFiltro = false;
            }

            if (filtro.diretor && anime.director && !anime.director.includes(filtro.diretor)) {
                matchesFiltro = false;
            }

            if (filtro.ano && anime.year !== filtro.ano) {
                matchesFiltro = false;
            }

            if (filtro.temporada && anime.Premiered !== filtro.temporada) {
                matchesFiltro = false;
            }

            if (filtro.fansub && anime.Fansub !== filtro.fansub) {
                matchesFiltro = false;
            }

            if (filtro.status && anime.Status !== filtro.status) {
                matchesFiltro = false;
            }

            return matchesFiltro;
        });

        setAnimesFiltrados(filteredAnimes);

        const searchParams = new URLSearchParams(filtro).toString();
        const newUrl = `${location.pathname}?${searchParams}`;
        window.history.pushState(null, '', newUrl);
    };

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const filtroFromParams = {};

        if (params.toString()) {
            for (let [key, value] of params.entries()) {
                filtroFromParams[key] = value;
            }
        }

        setFiltro(filtroFromParams);
        handleFilterButtonClick();
    }, []);



    return (
        <div className="bg-black-light h-screen ">
            <h1 className="text-white text-center font-bold text-xl">
                <span className="border-b-2 border-emerald-400">Página de Filtro</span>
            </h1>
            <div className="container mx-auto px-7 max-w-7xl mb-6 xl:px-1 2xl:px-1">
                <Filtro options={options} filtro={filtro} setFiltro={setFiltro} onFiltroChange={handleFiltroChange} />
                <div className="flex justify-center w-full mb-10">
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        onClick={handleFilterButtonClick}
                    >
                        Filtrar
                    </button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-6 gap-3">
                    {animesFiltrados.length > 0 ? (
                        animesFiltrados.map((anime, index) => (
                            <div className="aspect-ratio-box" key={index}>
                                <div className="relative" >
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
                        ))                        
                    ) : (
                        <h1 className="text-white font-bold text-center text-xl">Nenhum anime encontrado com os filtros selecionados.</h1>
                    )}
                </div>
            </div>
        </div>
    );
};
