import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Player, ControlBar, ReplayControl, PlayToggle } from 'video-react';
import 'video-react/dist/video-react.css';


export default function Episodio({ anime, episodio }) {
  const navigate = useNavigate();
  const [episodeData, setEpisodeData] = useState(null);
  const [currentResolution, setCurrentResolution] = useState(0);


  useEffect(() => {
    const episode = anime.episodes.find((episode) => episode.id === episodio.id);
    if (!episode) {
      // Episódio não encontrado, redirecionar para página de erro
      navigate('/erro');
    } else {
      setEpisodeData(episode);
    }
  }, [anime, episodio, navigate]);

  if (!episodeData) {
    // Episódio não encontrado, exibir mensagem de erro
    return <div>Episódio não encontrado</div>;
  }

  const { titleEpisodio, videoUrl } = episodeData;

  // Array de resoluções de vídeo
  const resolutions = videoUrl.map((url) => url.resolution);

  // URL do vídeo atual com base na resolução selecionada
  const mp4Url = videoUrl[currentResolution]?.url;

  // Função para alternar entre as resoluções de vídeo
  const changeResolution = (index) => {
    setCurrentResolution(index);
  };

  return (
    <div className="bg-black-light  py-12">
      <main className="container mx-auto py-12 items-center flex justify-center">
      <div className="player-container py-3">
          <div className="player-wrapper">
            <Player src={mp4Url} fluid={false} width={800} height={450}>
              <ControlBar>
                <ReplayControl seconds={10} order={2.1} />
                <PlayToggle />
              </ControlBar>
            </Player>
          </div>
          <div className="info-container items-start">
            <h3 className="text-2xl text-white text-start font-bold mb-1">{titleEpisodio}</h3>
          </div>
          <div className="resolution-buttons">
            {resolutions.map((resolution, index) => (
              <button
                key={index}
                className={`resolution-button hover:bg-gray-900 hover:text-white ${currentResolution === index ? 'active' : ''}`}
                onClick={() => changeResolution(index)}
              >
                {resolution}
              </button>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
