import React, { useState, useEffect } from 'react';
import animes from 'json/animes.json'; // Importe seu arquivo animes.json
import { Link } from 'react-router-dom';
import { MdPlayCircleFilled } from "react-icons/md";
import perfilData from 'json/perfil.json';
import { Helmet } from 'react-helmet';


export default function MeuPerfil() {

    const pageTitle = 'Gon.TV - MeuPerfil'

    const MAX_TITLE_LENGTH = 15; // Define o número máximo de caracteres do título

    const truncateTitle = (title) => {
        if (title.length > MAX_TITLE_LENGTH) {
            return title.substring(0, MAX_TITLE_LENGTH) + '...';
        }
        return title;
    };

    const [activeButton, setActiveButton] = useState('favoritos');
    const animesFavoritos = animes.filter(anime => anime.status === 'favorito');
    const animesAssistindo = animes.filter(anime => anime.status === 'assistindo');
    const animesPausado = animes.filter(anime => anime.status === 'pausado');
    const animesDropado = animes.filter(anime => anime.status === 'dropado');
    const animesPretendoVer = animes.filter(anime => anime.status === 'pretendo-ver');

    const [perfil, setPerfil] = useState({});

    useEffect(() => {
        // Aqui você pode obter o anime desejado do animeData
        const perfilId = 1; // ID do anime que você deseja exibir no perfil
        const selectedPerfil = perfilData.find((perfil) => perfil.id === perfilId);
        setPerfil(selectedPerfil);
    }, []);

    const handleButtonClick = (button) => {
        setActiveButton(button);
    };

    const renderAnimeList = () => {
        let animeList = [];

        switch (activeButton) {
            case 'favoritos':
                animeList = animesFavoritos;
                break;
            case 'assistindo':
                animeList = animesAssistindo;
                break;
            case 'pausado':
                animeList = animesPausado;
                break;
            case 'dropado':
                animeList = animesDropado;
                break;
            case 'pretendo-ver':
                animeList = animesPretendoVer;
                break;
            default:
                animeList
                    = [];
        }

        return (
            <div className="container mx-auto px-7 max-w-7xl mb-6 xl:px-1 2xl:px-1">
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-6 gap-3">
                    {animeList.map((anime) => (
                        <div key={anime.id} className="aspect-ratio-box">
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
        );
    };

    return (

        <>
            <Helmet>
                <title>{pageTitle}</title>
            </Helmet>

            <div className="bg-black-light">
                <main className="container mx-auto py-7 relative" style={{ position: "relative", overflow: "hidden" }}>
                    <div className="background-container relative rounded-lg border-b-2 border-lime-400">
                        <div
                            className="w-full h-auto bg-cover bg-center rounded-lg"
                            style={{
                                backgroundImage: `url(${perfil.background ? perfil.background : perfil.coverImage})`,
                                filter: "brightness(0.8) contrast(1.0) opacity(0.4)",
                                boxShadow: "0 0 10px rgba(0, 0, 0, 0.8)",
                                position: "absolute",
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                            }}
                        />
                        <div className="content-container flex flex-col items-start px-4 py-6 rounded-lg">
                            <div className="flex flex-col xl:flex-row lg:flex-row 2xl:flex-row md:flex-row items-start relative">
                                <div className="flex flex-col p-4 md:p-8 md:w-1/2 md:h-auto md:items-start md:justify-center md:flex-row md:flex-wrap md">
                                    <div className="w-full h-auto mx-auto md:ml-0" style={{ position: "relative" }}>
                                        <img src={perfil.coverImage} alt="imagem de perfil" className="w-auto h-72 rounded-full" style={{ position: "relative" }} />
                                    </div>
                                </div>
                                <div className="relative mb-8 ms-8 flex items-center justify-start">
                                    <div className="bg-black-light bg-opacity-75 rounded-lg p-4 backdrop-filter backdrop-blur-lg backdrop-opacity-50">
                                        <h1 className="text-3xl font-bold text-white py-8">Olá, <span className="text-emerald-400">Gon Freecss</span></h1>
                                        <p className="text-white">Quantidade de Animes Vistos: <span className="text-emerald-400">{animes.length}</span></p>
                                        <p className="text-white">Quantidade de Animes Favoritados: <span className="text-emerald-400">{animesFavoritos.length}</span></p>
                                        <p className="text-white">Quantidade de Animes Marcados como Gostei: <span className="text-emerald-400">{animes.filter(anime => anime.avaliacao === 'gostei').length}</span></p>
                                        <p className="text-white">Quantidade de Animes Marcados como Não Gostei: <span className="text-emerald-400">{animes.filter(anime => anime.avaliacao === 'nao-gostei').length}</span></p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <h2 className="text-2xl text-white font-bold mb-4 my-5 text-center ">
                        <span className="border-b-4 border-emerald-600 pb-1">Minha Lista de Animes</span>
                    </h2>
                    <div className="mt-6 flex justify-center">
                        <button
                            className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 mr-2 px-4 rounded ${activeButton === 'favoritos' ? 'bg-gray-700' : ''
                                }`}
                            onClick={() => handleButtonClick('favoritos')}
                        >
                            Favoritos
                        </button>
                        <button
                            className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 mr-2 px-4 rounded ${activeButton === 'assistindo' ? 'bg-gray-700' : ''
                                }`}
                            onClick={() => handleButtonClick('assistindo')}
                        >
                            Assistindo
                        </button>
                        <button
                            className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 mr-2 px-4 rounded ${activeButton === 'pausado' ? 'bg-gray-700' : ''
                                }`}
                            onClick={() => handleButtonClick('pausado')}
                        >
                            Pausado
                        </button>
                        <button
                            className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 mr-2 px-4 rounded ${activeButton === 'dropado' ? 'bg-gray-700' : ''
                                }`}
                            onClick={() => handleButtonClick('dropado')}
                        >
                            Dropado
                        </button>
                        <button
                            className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 mr-2 px-4 rounded ${activeButton === 'pretendo-ver' ? 'bg-gray-700' : ''
                                }`}
                            onClick={() => handleButtonClick('pretendo-ver')}
                        >
                            Pretendo Ver
                        </button>
                    </div>
                    <div className="mt-8">
                        {renderAnimeList()}
                    </div>
                </main >
            </div>
        </>
    );
}
