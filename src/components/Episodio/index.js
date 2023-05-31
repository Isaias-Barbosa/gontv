import ReactPlayer from 'react-player';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';



export default function Episodio({ anime, episodio }) {

  const navigate = useNavigate();

  useEffect(() => {
    const episode = anime.episodes.find((episode) => episode.id === episodio);
    if (!episode) {
      // Episódio não encontrado, redirecionar para página de erro
      navigate('/erro');
    }
  }, [anime, episodio, navigate]);

  const episode = anime.episodes.find((episode) => episode.id === episodio);

  if (!episode) {
    // Episódio não encontrado, exibir mensagem de erro
    return <div>Episódio não encontrado</div>;
  }

  const { title, duration, videoUrl } = episode;

  return (
    <div className="bg-gray-900">
      <main className="container mx-auto py-10">
        <div style={{ marginBottom: '23vh' }}>
          <div className="mb-1 flex justify-center" >
            <ReactPlayer url={videoUrl} controls width="800px" height="450px" />
          </div>
          <h3 className="text-2xl text-white text-center font-bold mb-1">{title}</h3>
          <p className="text-white text-center">Duração: {duration}</p>
          </div>
      </main>
    </div>
  )
}
