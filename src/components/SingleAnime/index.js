import { Link } from 'react-router-dom';

export default function SingleAnime({ anime }) {

  return (
    <div className="bg-gray-900">
      <main className="container mx-auto py-7 relative" style={{
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div className="background-container" style={{
          backgroundImage: `linear-gradient(to left, rgba(0, 0, 0, 0.8) 90%, transparent 100%), url(${anime.background})`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          boxShadow: '0 0 30px rgba(0.8, 0, 0.9, 0.9)',
          opacity: 0.9,
          position: 'relative',
        }}>
          <div className="flex md:flex-row sm:flex-col items-start relative">
            <div className="md:mr-4 mb-1 ms-4 relative w-80">
              <div className="w-full h-auto mx-auto md:ml-0" style={{
                position: 'relative',
                boxShadow: '0 0 30px rgba(0, 0, 0, 0.9)',
                opacity: 0.9,
              }}>
                <img src={anime.coverImage} alt={anime.title} className="w-full h-full" style={{
                  position: 'relative',
                }} />
              </div>
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
          <div className="border border-white rounded-none p-2">
            <p className="text-white text-1xl text-justify">{anime.synopsis}</p>
          </div>
        </div>
        <div>
          <h3 className="text-2xl text-center text-white font-bold mb-4">Episódios</h3>
          <div className="container mx-auto px-7 max-w-7xl mb-6 xl:px-1 2xl:px-1">
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-4">
            {anime.episodes.map((episode) => (
              <div key={episode.id} className="flex flex-col items-center">
                <Link to={`/animes/${anime.slug}/${episode.titleSlug}/${episode.languageEpisode}`}>
                <div className="absolute bg-emerald-700 rounded-none mx-2 m-2 p-1">
                      <p className="text-white text-xs font-bold">{episode.videoUrl[0].resolution}</p>
                    </div>
                  <img src={episode.thumbnail} alt={episode.titleEpisodio} className="w-80 h-auto px-2" />
                </Link>
                <p className="text-white text-sm text-start ms-3">{episode.titleEpisodio}</p>
              </div>
            ))}
          </div>
          </div>
        </div>
      </main >
    </div>
  );
}
