import { Link } from 'react-router-dom';

export default function SingleAnime({ anime }) {

  return (
    <div className="bg-gray-900">
      <main className="container mx-auto py-9">
      <div className="relative">
      <div className="flex md:flex-row sm:flex-col items-start relative">
         <div className="md:mr-4 mb-4 relative w-80">
        <img src={anime.coverImage} alt={anime.title} className="w-full h-auto mx-auto md:ml-0" />
      </div>
          <div className="flex flex-col md:col-span-3e py-1 p-3">  
            <h1 className="text-3xl text-white font-bold mb-2">{anime.title}</h1>
            <h2 className="text-xl text-white mb-4">{anime.subtitle}</h2>
            <p className="text-white">
              <strong>Tipo: </strong> {anime.Type}
            </p>
            <p className="text-white">
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
              <strong>Linguagem:</strong> {anime.language}
            </p>
            <p className="text-white">
              <strong>Temporada: </strong> {anime.Premiered}
            </p>
            <p className="text-white">
              <strong>Fansub: </strong> {anime.Fansub}
            </p>
            <p className="text-white">
              <strong>Gêneros:</strong> {anime.genres.join(', ')}
            </p>
          </div>
        </div>
        </div>
        <div className="my-5">
          <h3 className="text-2xl text-white font-bold mb-4 text-center">Sinopse</h3>
          <div className="border border-white rounded-none p-4">
            <p className="text-white text-1xl text-justify">{anime.synopsis}</p>
          </div>
        </div>
        <div>
          <h3 className="text-2xl text-center text-white font-bold mb-4">Episódios</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {anime.episodes.map((episode) => (
              <div key={episode.id}>
                <Link to={`/animes/${anime.slug}/${episode.titleSlug}/${episode.languageEpisode}`}>
                  <img src={episode.thumbnail} alt={episode.titleEpisodio} className="w-80 h-auto px-2" />
                </Link>
                <p className="text-white text-sm text-start ms-3">{episode.titleEpisodio}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
