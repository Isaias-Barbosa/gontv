import { Link, useLocation } from 'react-router-dom';

export default function SingleAnime({ anime }) {

  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const language = query.get('language');


  return (
    <div className="bg-gray-900">
      <main className="container mx-auto py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-1">
          <div className="flex justify-start">
            <img src={anime.coverImage} alt={anime.title} className="w-80 h-auto mx-auto" />
          </div>
          <div className="flex flex-col justify-normal">
            <h1 className="text-3xl text-white font-bold mb-5">{anime.title}</h1>
            <h2 className="text-xl text-white mb-4">{anime.subtitle}</h2>
            <p className="text-white ">
              <strong>Tipo: </strong> {anime.Type}
            </p>
            <p className="text-white ">
              <strong>Estúdio:</strong> {anime.studio}
            </p>
            <p className="text-white">
              <strong>Diretor:</strong> {anime.director}
            </p>
            <p className="text-white">
              <strong>Ano:</strong> {anime.year}
            </p>
            <p className="text-white">
              <strong>Duração por Episódio:</strong> {anime.episodeDuration}
            </p>
            <p className="text-white">
              <strong>Linguagem:</strong> {anime.Linguagem}
            </p>
            <p className="text-white">
              <strong>Gêneros:</strong> {anime.genres.join(', ')}
            </p>
          </div>
        </div>
        <div className="my-8">
          <h3 className="text-2xl text-white font-bold mb-4 text-center">Sinopse</h3>
          <p className="text-white text-justify">{anime.synopsis}</p>
        </div>
        <div>
          <h3 className="text-2xl text-white font-bold mb-4">Episódios</h3>
          <ul>
            {anime.episodes.map((episode) => (
              <li key={episode.id}>
                  <Link 
                  to={`/singleplay/${anime.id}/${episode.id}?language=${language}`}
                  className="font-bold text-white"
                  >
                  {episode.title}
                </Link>
                - <span className="text-white">Duração: {episode.duration}</span>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
}
