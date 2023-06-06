import React, { useEffect, useState } from 'react';
import {Link, useNavigate } from 'react-router-dom';
import { Player, ControlBar, ReplayControl, PlayToggle } from 'video-react';
import 'video-react/dist/video-react.css';
import { AiOutlineLike, AiOutlineDislike, AiOutlineEye, AiOutlineDownload, AiOutlineLeft, AiOutlineRight, AiOutlineBars } from 'react-icons/ai';
import './Episodio.css';


export default function Episodio({anime, episodio, slug, languageEpisode}) {
  const navigate = useNavigate();
  const episodioIndex = anime.episodes.findIndex((episode) => episode.id=== episodio.id);
  const [episodeData, setEpisodeData] = useState({});
  const [currentResolution, setCurrentResolution] = useState(0);
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [viewed, setViewed] = useState(false);


  useEffect(() => {
    const episode = anime.episodes.find((episode) => episode.id === episodio.id);
    if (!episode) {
      // Episódio não encontrado, redirecionar para página de erro
      navigate('/erro');
    } else {
      setEpisodeData(episode);
      setCurrentResolution(0); // Reinicia a resolução do vídeo quando o episódio muda
      setLiked(false); // Reinicia o estado de curtida quando o episódio muda
      setDisliked(false); // Reinicia o estado de descurtida quando o episódio muda
      setViewed(false); // Reinicia o estado de visualização quando o episódio muda
    }
  }, [anime, episodio, navigate]);

  const handleLike = () => {
    if (liked) {
      setLiked(false);
    } else {
      setLiked(true);
      setDisliked(false); // Desmarca o botão de dislike ao clicar em like
    }
  };

  const handleDislike = () => {
    if (disliked) {
      setDisliked(false);
    } else {
      setDisliked(true);
      setLiked(false); // Desmarca o botão de like ao clicar em dislike
    }
  };

  const handleView = () => {
    if (viewed) {
      setViewed(false);
    } else {
      setViewed(true);
    }
  };

  const handleDownload = () => {
    // Lógica de download do episódio
    console.log('Realizando o download do episódio');
  };

  if (Object.keys(episodeData).length === 0) {
    // Dados do episódio ainda estão sendo carregados, exibir um loader ou uma mensagem de carregamento
    return <div>Carregando...</div>;
  }

  if (!episodeData) {
    // Episódio não encontrado, exibir mensagem de erro
    return <div>Episódio não encontrado</div>;
  }

  const { titleEpisodio, videoUrl } = episodeData;
  const defaultViews = 12345; // Número padrão de visualizações

  const resolutions = videoUrl.map((url) => url.resolution);
  const mp4Url = videoUrl[currentResolution]?.url;

  const changeResolution = (index) => {
    setCurrentResolution(index);
  };

  const handleEpisodesList = () => {
    navigate(`/animes/${anime.slug}`);
  };

  return (
    <div className="bg-black-light py-8">
    <div className="title-container">
      <h3 className="text-2xl text-white text-center font-bold">
        <Link to={`/animes/${slug}`}><span className="border-b-2 border-emerald-400">{anime.title}</span>
        </Link> - {titleEpisodio}</h3>
    </div>
    <main className="container mx-auto py-8">
      <div className="player-container relative">
        <div className="top-button-container">
          {episodioIndex > 0 && (
            <div className="top-button-left">
              <Link to={`/animes/${slug}/${anime.episodes[episodioIndex - 1].titleSlug}/${languageEpisode}`}>
                <button className="top-icon-button">
                  <AiOutlineLeft />
                  Anterior
                </button>
              </Link>
            </div>
          )}
          <div className="top-button-menu-container"></div>
          {episodioIndex < anime.episodes.length - 1 && (
            <div className="top-button-right">
              <Link to={`/animes/${slug}/${anime.episodes[episodioIndex + 1].titleSlug}/${languageEpisode}`}>
                <button className="top-icon-button">
                  Próximo
                  <AiOutlineRight />
                </button>
              </Link>
            </div>
          )}
        </div>
        <div className="player-wrapper">
          <div className="aspect-ratio-container">
            <div className="aspect-ratio-inner">
              <Player src={mp4Url} fluid={true}>
                <ControlBar>
                  <ReplayControl seconds={10} order={2.1} />
                  <PlayToggle />
                </ControlBar>
              </Player>
            </div>
          </div>
        </div>
      </div>

      <div className="info-container">
      <div className="views-container">
      <span className="views-text">Visualizações: {defaultViews}</span>
    </div>
       <div className="resolution-container">
          {resolutions.map((resolution, index) => (
      <button
        key={index}
        className={`resolution-button bg-emerald-700 hover:bg-emerald-400 hover:text-white ${
          currentResolution === index ? 'active' : ''
        }`}
        onClick={() => changeResolution(index)}
      >
        {resolution}
      </button>
    ))}
      <div className="button-container">
    <button onClick={handleDownload} className="icon-button">
      <AiOutlineDownload />
    </button>
  </div>
  </div>

      </div>
    </main>
  </div>
  );
}
