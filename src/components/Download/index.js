import React from 'react';
import { AiOutlineLeft, AiOutlineRight } from 'react-icons/ai';
import { Link } from 'react-router-dom';

export default function Download({ anime, coverImage, animeTitle, episodeTitle, currentPage, episodes, slug, languageEpisode }) {

    // Defina o número total de páginas de download
    const totalPages = episodes.length;

    // Verifica se é a primeira página
    const isFirstPage = currentPage === 1;

    // Verifica se é a última página
    const isLastPage = currentPage === totalPages;

    // Obtém o índice do episódio atual
    const episodeIndex = currentPage - 1;

    // Calcula o índice do episódio anterior
    const previousEpisodeIndex = episodeIndex - 1;

    // Calcula o índice do próximo episódio
    const nextEpisodeIndex = episodeIndex + 1;

    // Obtém as resoluções disponíveis para o episódio atual
    const resolutions = episodeIndex !== -1 ? anime.episodes[episodeIndex].videoUrl : [];

    return (
        <div className="bg-black-light py-8">
            <div className="flex justify-center">
                <div className="w-3/4 p-8 bg-zinc-900 rounded-lg shadow-lg">
                    <div className="flex items-center justify-start">
                        <div className="my-2">
                            <Link
                                to={`/animes/${slug}/${anime.episodes[episodeIndex].titleSlug}/${languageEpisode}`}
                                className="text-emerald-400 hover:text-white"
                            >
                                <button className="flex items-center">
                                    <AiOutlineLeft className="mr-1 text-4xl" />
                                    Voltar
                                </button>
                            </Link>
                        </div>
                    </div>
                    <div className="items-center ">
                        <p className="text-2xl font-bold text-white text-center">
                            <Link to={`/animes/${slug}`}>
                                <span className="border-b-2 border-emerald-400">{animeTitle}</span></Link> - {episodeTitle}
                        </p>
                    </div>
                    <div className="flex ">
                        <div className="mt-8 flex">
                            {!isFirstPage && (
                                <Link
                                    to={`/animes/${slug}/${anime.episodes[previousEpisodeIndex].titleSlug}/${languageEpisode}/download`}
                                    className="text-emerald-400 hover:text-white"
                                >
                                    <button className="flex items-center">
                                        <AiOutlineLeft className="mr-1 text-4xl" />
                                        Anterior
                                    </button>
                                </Link>
                            )}
                        </div>
                        <div className="mt-8 flex flex-grow justify-end">
                            {!isLastPage && (
                                <Link
                                    to={`/animes/${slug}/${anime.episodes[nextEpisodeIndex].titleSlug}/${languageEpisode}/download`}
                                    className="text-emerald-400 hover:text-white"
                                >
                                    <button className="flex items-center">
                                        Próximo
                                        <AiOutlineRight className="ml-1 text-4xl" />
                                    </button>
                                </Link>
                            )}
                        </div>
                    </div>
                    <div className="mt-8 flex items-center justify-center ">
                        <img src={coverImage} alt="Imagem do Anime" className="w-auto md:w-96 lg:w-3/4 xl:w-2/3 2xl:w-1/2 mr-4" />
                    </div>
                    <div className="mt-8">

                        <h4 className="text-lg font-bold text-white text-center"><span className="border-b-2 border-emerald-400 text-xl">Links Disponíveis:</span></h4>
                        <div className="mt-4">
                            <h4 className="text-xl font-bold text-white text-center">Download <span className="text-yellow-400">Premium:</span></h4>
                            <div className="flex mt-2 justify-center">
                                {resolutions.map((resolution, index) => (
                                    <a
                                        key={index}
                                        href={resolution.url}
                                        className="px-5 py-2 mr-2 bg-emerald-500 text-white rounded-md hover:bg-neutral-900"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {resolution.resolution}
                                    </a>
                                ))}
                            </div>
                        </div>
                        <div className="mt-4">
                            <h4 className="text-xl font-bold text-white text-center">Download <span className="text-blue-500">Free:</span></h4>
                            <div className="flex mt-2 justify-center">
                                {resolutions.map((resolution, index) => (
                                    <a
                                        key={index}
                                        href={resolution.url}
                                        className="px-5 py-2 mr-2 bg-emerald-500 text-white rounded-md hover:bg-neutral-900"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {resolution.resolution}
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
