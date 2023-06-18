import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import 'video-react/dist/video-react.css';
import { AiOutlineDownload, AiOutlineLeft, AiOutlineRight } from 'react-icons/ai';
import './Episodio.css';
import DPlayer from 'dplayer';
import Discus from 'components/Discus';



export default function Episodio({ anime, episodio, slug, languageEpisode }) {
  const navigate = useNavigate();
  const episodioIndex = anime.episodes.findIndex((episode) => episode.id === episodio.id);
  const [episodeData, setEpisodeData] = useState({});
  const [currentResolution, setCurrentResolution] = useState(0);
  const playerRef = useRef(null); // Referência ao elemento de contêiner do DPlayer



  useEffect(() => {
    const episode = anime.episodes.find((episode) => episode.id === episodio.id);
    if (!episode) {
      // Episódio não encontrado, redirecionar para página de erro
      navigate('/erro');
    } else {
      setEpisodeData(episode);
      setCurrentResolution(0); // Reinicia a resolução do vídeo quando o episódio muda
    }
  }, [anime, episodio, navigate]);

  useEffect(() => {
    setCurrentResolution(0); // Reinicia a resolução do vídeo quando a propriedade episodio muda
  }, [episodio]);


  useEffect(() => {
    // Cria e configura o DPlayer quando o componente é montado
    if (Object.keys(episodeData).length !== 0) {
      const dp = new DPlayer({
        container: playerRef.current,
        video: {
          url: episodeData.videoUrl[currentResolution].url,
          // Outras opções de configuração do DPlayer aqui...
        },
      });

      // Destrói o player quando o componente é desmontado
      return () => {
        dp.destroy();
      };
    }
  }, [episodeData, currentResolution]);



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

  const currentEpisodeSlug = episodio.titleSlug; // Obtém o slug do episódio atual
  const currentEpisodeTitle = episodio.titleEpisodio // Obtém o titulo do episódio atual
  const currentEpisodeId = episodio.id;
  const identifier = `${currentEpisodeSlug}-${currentEpisodeId}`;

  const disqusConfig = {
    shortname: 'https://gon-tv.disqus.com/embed.js',
    config: { identifier: `${currentEpisodeSlug}-${currentEpisodeId}`, title: currentEpisodeTitle },
  };


  const changeResolution = (index) => {
    setCurrentResolution(index);
    setTimeout(() => {
      // Renderizar o Disqus novamente
      const disqusThread = document.getElementById('disqus_thread');
      if (disqusThread) {
        disqusThread.innerHTML = ''; // Limpar o conteúdo existente do elemento
        window.DISQUS.reset({ reload: true, config: disqusConfig }); // Chamar a função de reset do Disqus com a nova configuração
      }
    }, 500); // Aguardar 500 milissegundos (0,5 segundos) antes de renderizar o Disqus novamente
  };

  return (

    <div className="bg-black-light py-8">
      <div className="title-container">
        <h3 className="text-2xl text-white text-center font-bold">
          <Link to={`/animes/${slug}`}><span className="border-b-2 border-emerald-400">{anime.title}</span>
          </Link> - {titleEpisodio}</h3>
      </div>

      <main className="container mx-auto py-4">
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
                <div className="aspect-ratio-inner">
                <div className={`dplayer-container ${currentResolution < 1280 ? 'small-player' : ''} ${window.innerWidth < 768 ? 'mobile-player' : ''}`} ref={playerRef}></div>
                </div>
              </div>
            </div>
          </div>
        </div>


        <div className="info-container">
          <div className="resolution-container">
            {resolutions.map((resolution, index) => (
              <button
                key={index}
                className={`resolution-button bg-emerald-700 hover:bg-emerald-400 hover:text-white ${currentResolution === index ? 'active' : ''}`}
                onClick={() => changeResolution(index)}
              >
                {resolution}
              </button>
            ))}
            <div className="button-container">
            <Link to={`/animes/${slug}/${currentEpisodeSlug}/${languageEpisode}/download`} >
              <button onClick={handleDownload} className="icon-button ">
                <AiOutlineDownload />
              </button>
              </Link>
            </div>

          </div>
          <div className="views-container">
            <span className="views-text font-bold ">Visualizações: {defaultViews}</span>
          </div>
        </div>
        <div className=" my-12">
        <Discus identifier={identifier} title={currentEpisodeTitle} />
        </div>
      </main>
    </div>
  );
}
