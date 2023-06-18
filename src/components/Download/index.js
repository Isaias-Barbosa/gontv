import React from 'react';
import { AiOutlineDownload, AiOutlineLeft, AiOutlineRight } from 'react-icons/ai';
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

    return (
        <div className="bg-black-light py-8">
            <div className="flex justify-center">
                <div className="w-3/4 p-8 bg-zinc-800 rounded-lg shadow-lg">
                    <div className="flex items-center justify-center">
                        <h3 className="text-2xl font-bold mr-2 text-white"><span className="border-b-2 border-emerald-400 ">Download</span></h3>
                        <AiOutlineDownload className="text-3xl text-white" />
                    </div>
                    <div className="mt-8 flex ">
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
                    <div className="flex flex-row  justify-center">
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
                        <div className="mx-12"></div>
                        <div className="mt-8 flex">
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
                    <div className="mt-8 flex items-center justify-center">
                        <img src={coverImage} alt="Imagem do Anime" className="w-auto md:w-96 lg:w-3/4 xl:w-2/3 2xl:w-2/3 mr-4" />
                    </div>
                    <div className="mt-8">
                        <div className="my-7">
                            <p className="text-2xl font-bold text-white text-center">
                                <Link to={`/animes/${slug}`}>
                                <span className="border-b-2 border-emerald-400">{animeTitle}</span></Link> - {episodeTitle}
                            </p>
                        </div>
                        <h4 className="text-lg font-bold text-white text-center"><span className="border-b-2 border-emerald-400 text-2xl">Links Disponíveis:</span></h4>
                        <div className="mt-4">
                            <h4 className="text-xl font-bold text-white text-center">Download <span className="text-yellow-400">Premium:</span></h4>
                            <div className="flex mt-2 justify-center">
                                <button className="px-5 py-2 mr-2 bg-emerald-500 text-white rounded-md hover:bg-neutral-900">FHD</button>
                                <button className="px-5 py-2 mr-2 bg-emerald-500 text-white rounded-md hover:bg-neutral-900">HD</button>
                                <button className="px-5 py-2 bg-emerald-500 text-white rounded-md hover:bg-neutral-900">SD</button>
                            </div>
                        </div>
                        <div className="mt-4">
                            <h4 className="text-xl font-bold text-white text-center">Download <span className="text-blue-500">Free:</span></h4>
                            <div className="flex mt-2 justify-center">
                                <button className="px-5 py-2 mr-2 bg-emerald-500 text-white rounded-md hover:bg-neutral-900">FHD</button>
                                <button className="px-5 py-2 mr-2 bg-emerald-500 text-white rounded-md hover:bg-neutral-900">HD</button>
                                <button className="px-5 py-2 bg-emerald-500 text-white rounded-md hover:bg-neutral-900">SD</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
