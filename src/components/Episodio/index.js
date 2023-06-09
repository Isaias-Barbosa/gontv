import React, { useEffect, useState} from 'react';
import { Link, useNavigate,  useParams } from 'react-router-dom';
import 'video-react/dist/video-react.css';
import { AiOutlineLeft, AiOutlineRight } from 'react-icons/ai';
import './Episodio.css';
import Discus from 'components/Discus';



export default function Episodio({ anime, episodio, languageEpisode }) {
  const { slug } = useParams();
  const navigate = useNavigate();
  const episodioIndex = anime.episodes.findIndex((episode) => episode.id === episodio.id);
  const [episodeData, setEpisodeData] = useState({ imdb: anime.videoUrl });
  const { titleEpisodio } = episodeData;
  const currentEpisodeSlug = episodio.titleSlug; // Obtém o slug do episódio atual
  const currentEpisodeTitle = episodio.titleEpisodio; // Obtém o titulo do episódio atual
  const currentEpisodeId = episodio.id;
  const identifier = `${currentEpisodeSlug}-${currentEpisodeId}`;

  useEffect(() => {
    const episode = anime.episodes.find((episode) => episode.id === episodio.id);
    if (!episode) {
      // Episódio não encontrado, redirecionar para página de erro
      navigate('/erro');
    } else {
      setEpisodeData({ ...episodeData, ...episode });
    }
  }, [anime, episodio, navigate]);

  if (Object.keys(episodeData).length === 0) {
    // Dados do episódio ainda estão sendo carregados, exibir um loader ou uma mensagem de carregamento
    return <div>Carregando...</div>;
  }

  if (!episodeData) {
    // Episódio não encontrado, exibir mensagem de erro
    return <div>Episódio não encontrado</div>;
  }


  const { videoUrl } = episodeData;

  const defaultViews = 12345; // Número padrão de visualizações


  const disqusConfig = {
    shortname: 'https://gon-tv.disqus.com/embed.js',
    config: { identifier: `${currentEpisodeSlug}-${currentEpisodeId}`, title: currentEpisodeTitle },
  };

  const changeResolution = (index) => {
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

      <main className="container mx-auto">
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
                  <div className="player">
                  <iframe className="w-full h-auto object-cover custom-iframe-class"
                    title={currentEpisodeTitle}
                    src={`https://embed.warezcdn.net/serie/${videoUrl}/1/${currentEpisodeId}`}
                    allowfullscreen
                    noEpList
                    webkitallowfullscreen
                    mozallowfullscreen
                    scrolling="no"
                    frameBorder="0"
                  ></iframe>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>


        <div className="info-container">

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
