import { Link } from "react-router-dom";
import { MdPlayCircleFilled } from "react-icons/md";
import "./SingleAnime.css";
import Discus from "components/Discus";
import Genero from "components/Genero";
import { useEffect } from "react";
import { useState } from "react";
import { LinearProgress } from "@mui/material";
import { useDispatch } from 'react-redux';


export default function SingleAnime({ anime }) {
 
  const currentAnimeSlug = anime.slug; // Obtém o slug da pagina atual
  const currentAnimeTitle = anime.title // Obtém o titulo da pagina tual
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulação de uma requisição assíncrona
    setTimeout(() => {
      setIsLoading(false);
    }, 2000); // Tempo de simulação de carregamento (2 segundos)
  }, []);

  return (
    <>
    {isLoading ? (
      // Exibir o spinner de pré-carregamento enquanto os dados estão sendo carregados   
      <div className="min-h-screen bg-black-dark flex justify-start flex-col">
      <LinearProgress />
  </div>
    ) : (
    <div className="relative">
      <div className="bg-black-dark">
        <main className="container mx-auto py-7 relative" style={{ position: "relative", overflow: "hidden" }}>

          <div className="background-container relative rounded-lg border-b-2 border-lime-400 mx-2 sm:mx-2 md:mx-2 lg:mx-2 xl:mx-2 2xl:mx-2 ">
            <div
              className="w-full h-auto bg-cover bg-center rounded-lg"
              style={{
                backgroundImage: `url(${anime.background ? anime.background : anime.coverImage})`,
                filter: "brightness(0.7) contrast(1.1) opacity(0.5)",
                boxShadow: "0 0 10px rgba(0, 0, 0, 0.8)",
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
              }}
            />
            <div className="content-container flex flex-col items-start ">
              <div className="flex flex-col xl:flex-row lg:flex-row 2xl:flex-row md:flex-row  items-start relative">
                <div className="flex flex-col p-4 md:p-8 md:w-1/2 md:h-auto md:items-start md:justify-center md:flex-row md:flex-wrap md">
                  <div className="w-full h-auto mx-auto md:ml-0" style={{ position: "relative", boxShadow: "0 0 60px rgba(0, 0, 0, 0.9)", opacity: 0.9 }}>
                    <img src={anime.coverImage} alt={anime.title} className="w-full h-96 rounded-lg" style={{ position: "relative" }} />
                  </div>
                </div>
                <div className="flex flex-col md:col-span-3e py-1 p-3 mt-5 md:mt-0 md:ml-5">
                  <h1 className="text-3xl text-white font-bold mb-2">
                    {anime.title}
                  </h1>
                  <h2 className="text-xl text-white hover:text-emerald-400 mb-4">{anime.subtitule}</h2>
                  <p className="text-white ">
                    <strong className="hover:text-emerald-400">Tipo: </strong> {anime.Type}
                  </p>
                  <p className="text-white">
                    <strong className="hover:text-emerald-400">Estúdio:</strong> {anime.studio}
                  </p>
                  <p className="text-white">
                    <strong className="hover:text-emerald-400">Diretor:</strong> {anime.director}
                  </p>
                  <p className="text-white">
                    <strong className="hover:text-emerald-400">Ano:</strong> {anime.year}
                  </p>
                  <p className="text-white">
                    <strong className="hover:text-emerald-400">Duração por Episódio:</strong> {anime.episodeDuration}
                  </p>
                  <p className="text-white">
                    <strong className="hover:text-emerald-400">Linguagem:</strong> {anime.language}
                  </p>
                  <p className="text-white">
                    <strong className="hover:text-emerald-400">Temporada: </strong> {anime.Premiered}
                  </p>
                  <p className="text-white">
                    <strong className="hover:text-emerald-400">Fansub: </strong> {anime.Fansub}
                  </p>
                  <p className="text-white">
                    <strong className="hover:text-emerald-400">Status: </strong> {anime.Status}
                  </p>
                  <p className="text-white">
                    <strong className="hover:text-emerald-400">Gêneros: </strong>
                    {anime.genres.map((genre, index) => (
                        <Genero key={index} genero={genre} />
                    ))}
                  </p>
                </div>
              </div >
            </div>
          </div>
 
          <div className="my-5 mx-2 sm:mx-2 md:mx-2 lg:mx-2 xl:mx-2 2xl:mx-2">
            <h3 className="text-2xl text-white font-bold mb-4 text-center">
              <span className="border-b-2 border-emerald-400">Sinopse</span>
            </h3>
            <div className="border-b-2 border-lime-400 bg-gray-950 rounded-lg p-3 mx-auto lg:mx-3">
              <p className="text-white text-1xl text-justify">{anime.synopsis}</p>
            </div>
          </div>
          <div>
            <h3 className="text-2xl text-center text-white font-bold mb-4">
              <span className="border-b-2 border-emerald-400"> Episódios </span>
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-4 gap-3 mx-2 sm:mx-2 md:mx-2 lg:mx-2 xl:mx-2 2xl:mx-2 my-10 ">
              {anime.episodes.map((episode) => (
                <div key={episode.id} className="aspect-ratio-box w-full">
                  <Link to={`/animes/${anime.slug}/${episode.titleSlug}/${episode.languageEpisode}`}>
                    <div className="thumbnail relative border-b-2 rounded-sm border-lime-600">
                      <img
                        src={episode.thumbnail}
                        alt={episode.titleEpisodio}
                        className="absolute inset-0 w-full h-auto"
                      />
                      <div className="overlay"></div>

                      <button className="play-button absolute items-center justify-center">
                        <MdPlayCircleFilled className="text-white text-5xl" />
                      </button>
                    </div>
                    <p className="text-white text-lg text-center mt-2">{episode.titleEpisodio}</p>
                  </Link>
                </div>
              ))}
            </div>
          </div>
          <div className="mx-2 sm:mx-2 md:mx-3 lg:mx-3 xl:mx-3 2xl:mx-3">
          <Discus  identifier={currentAnimeSlug} title={currentAnimeTitle} />
          </div>
        </main >
      </div >
    </div>
             )}
    </>
  );
}


  /*
 
  const [anime, setAnime] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAnimeById = async () => {
      try {
        if (!animeDetails || !animeDetails.id) {
          throw new Error("ID do anime não encontrado");
        }

        const response = await fetch(
          `https://animes.vision/api/v2/post/${animeDetails.id}`
        );
        if (!response.ok) {
          throw new Error(
            `Erro na requisição: ${response.status} ${response.statusText}`
          );
        }

        const data = await response.json();
        console.log("Dados da API:", data);

        if (data && data.data && Object.keys(data.data).length > 0) {
          setAnime(data.data);
          setIsLoading(false);
        } else {
          console.log("Dados inválidos ou ausentes.", data);
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Ocorreu um erro:", error);
        setIsLoading(false); // Certifique-se de definir isLoading como falso em caso de erro
      }
    };

    if (!anime) {
      fetchAnimeById();
    } else {
      setIsLoading(false);
    }
    // Tempo de simulação de carregamento (2 segundos)
  }, [anime, animeDetails]);

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  const currentAnimeSlug = anime?.slug; // Obtém o slug da pagina atual
  const currentAnimeTitle = anime?.title // Obtém o titulo da pagina tual


    const dispatch = useDispatch();
  
    // Quando você deseja definir o id, despache a ação
    const handleEpisodeClick = (id) => {
      dispatch({ type: 'SET_EPISODE_ID', payload: id });
      // Navegue para a página SinglePlayPage
      // ...
    };

    

  return (
    <>
      {isLoading ? (
        // Exibir o spinner de pré-carregamento enquanto os dados estão sendo carregados
        <div className="min-h-screen bg-black-dark flex justify-start flex-col">
          <LinearProgress />
        </div>
      ) : (
        <div className="relative">
          <div className="bg-black-dark">
            <main
              className="container mx-auto py-7 relative"
              style={{ position: "relative", overflow: "hidden" }}
            >
              <div className="background-container relative rounded-lg border-b-2 border-lime-400 mx-2 sm:mx-2 md:mx-2 lg:mx-2 xl:mx-2 2xl:mx-2 ">
                <div
                  className="w-full h-auto bg-cover bg-center rounded-lg"
                  style={{
                    backgroundImage: `url(${anime?.thumbnail})`,
                    filter: "brightness(0.7) contrast(1.1) opacity(0.5)",
                    boxShadow: "0 0 10px rgba(0, 0, 0, 0.8)",
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                  }}
                />
                <div className="content-container flex flex-col items-start ">
                  <div className="flex flex-col xl:flex-row lg:flex-row 2xl:flex-row md:flex-row  items-start relative">
                    <div className="flex flex-col p-4 md:p-8 md:w-1/2 md:h-auto md:items-start md:justify-center md:flex-row md:flex-wrap md">
                      <div
                        className="w-full h-auto mx-auto md:ml-0"
                        style={{
                          position: "relative",
                          boxShadow: "0 0 60px rgba(0, 0, 0, 0.9)",
                          opacity: 0.9,
                        }}
                      >
                        <img
                          src={anime?.thumbnail}
                          alt={anime?.title}
                          className="w-full h-96 rounded-lg"
                          style={{ position: "relative" }}
                        />
                      </div>
                    </div>
                    <div className="flex flex-col md:col-span-3e py-1 p-3 mt-5 md:mt-0 md:ml-5">
                      <h1 className="text-3xl text-white font-bold mb-2">
                        {animeDetails?.title}
                      </h1>
                      <h2 className="text-xl text-white hover:text-emerald-400 mb-4">
                        {anime?.title_alternative}
                      </h2>
                      <p className="text-white ">
                        <strong className="hover:text-emerald-400">
                          Tipo:{" "}
                        </strong>{" "}
                        {anime?.type}
                      </p>
                      <p className="text-white">
                        <strong className="hover:text-emerald-400">
                          Estúdio:
                        </strong>{" "}
                        {anime?.studio}
                      </p>
                      <p className="text-white">
                        <strong className="hover:text-emerald-400">
                          Diretor:
                        </strong>{" "}
                        {anime?.direction}
                      </p>
                      <p className="text-white">
                        <strong className="hover:text-emerald-400">Ano:</strong>{" "}
                        {anime?.year}
                      </p>
                      <p className="text-white">
                        <strong className="hover:text-emerald-400">
                          Duração por Episódio:
                        </strong>{" "}
                        {anime?.duration}
                      </p>
                      <p className="text-white">
                        <strong className="hover:text-emerald-400">
                          Linguagem:
                        </strong>{" "}
                        {anime?.language}
                      </p>
                      <p className="text-white">
                        <strong className="hover:text-emerald-400">
                          Fansub:{" "}
                        </strong>{" "}
                        {anime?.fansub}
                      </p>
                      <p className="text-white">
                        <strong className="hover:text-emerald-400">
                          Status:{" "}
                        </strong>{" "}
                        {anime?.status}
                        {anime?.status ? "Finalizado" : "Em Lançamento"}
                      </p>
                      <p className="text-white">
                        <strong className="hover:text-emerald-400">
                          Gêneros:{" "}
                        </strong>
                        {Array.isArray(anime?.genres) ? (
                          anime?.genres.map((genre, index) => (
                            <Genero key={index} genero={capitalizeFirstLetter(genre)} />
                          ))
                        ) : Array.isArray(anime?.genres.split(",")) ? ( // Converta a string em um array usando split(',')
                          anime?.genres.split(",").map((genre, index) => (
                            <Genero key={index} genero={capitalizeFirstLetter(genre.trim())} /> // Use trim() para remover espaços em branco extras
                          ))
                        ) : (
                          <span>Genero não disponivel</span>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="my-5 mx-2 sm:mx-2 md:mx-2 lg:mx-2 xl:mx-2 2xl:mx-2">
                <h3 className="text-2xl text-white font-bold mb-4 text-center">
                  <span className="border-b-2 border-emerald-400">Sinopse</span>
                </h3>
                <div className="border-b-2 border-lime-400 bg-gray-950 rounded-lg p-3 mx-auto lg:mx-3">
                  <p className="text-white text-1xl text-justify">
                    {anime?.description}
                  </p>
                </div>
              </div>
              <div>
                <h3 className="text-2xl text-center text-white font-bold mb-4">
                  <span className="border-b-2 border-emerald-400">
                    {" "}
                    Episódios{" "}
                  </span>
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-4 gap-3 mx-2 sm:mx-2 md:mx-2 lg:mx-2 xl:mx-2 2xl:mx-2 my-10 ">
                  {anime?.episodes &&
                    Array.isArray(anime.episodes) &&
                    anime.episodes.map((ep) => (
                      <div key={ep.id} className="aspect-ratio-box w-full">
                        <Link
                          to={`/animes/${anime.title.replace(/[^\w\s]/gi, '').replace(/\s+/g, '-').toLowerCase()}/${ep.title.replace(/\s+/g, '-').toLowerCase()}/${anime.language.toLowerCase()}`}
                        >
                          <div onClick={() => handleEpisodeClick(ep.id)}>
                          <div className="thumbnail relative border-b-2 rounded-sm border-lime-600">
                            <img
                             src={ep.thumbnail}
                             alt={ep.title}
                              className="absolute inset-0 w-full h-auto"
                            />
                            <div className="overlay"></div>

                            <button className="play-button absolute items-center justify-center">
                              <MdPlayCircleFilled className="text-white text-5xl" />
                            </button>
                          </div>
                          <p className="text-white text-lg text-center mt-2">
                          {ep.title}
                          </p>
                          </div>
                        </Link>
                      </div>
                    ))}
                </div>
              </div>
              <div className="mx-2 sm:mx-2 md:mx-3 lg:mx-3 xl:mx-3 2xl:mx-3">
              
              <Discus  identifier={currentAnimeSlug} title={currentAnimeTitle} />
             
              </div>
            </main>
          </div>
        </div>
      )}
    </>
  );
}
  */
