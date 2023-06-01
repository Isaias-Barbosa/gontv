import { Link } from "react-router-dom";
import { MdPlayCircleFilled } from "react-icons/md";

export default function SingleAnime({ anime }) {
  return (
    <div className="bg-gray-900">
      <main
        className="container mx-auto py-7 relative"
        style={{
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          className="background-container"
          style={{
            backgroundImage: `linear-gradient(to left, rgba(0, 0, 0, 0.8) 90%, transparent 100%), url(${anime.background})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            boxShadow: "0 0 90x rgba(0, 0, 0.0, 0.9)",
            opacity: 0.9,
            position: "relative",
          }}
        >
          <div className="flex md:flex-row sm:flex-col items-start relative">
            <div className="md:mr-4 mb-1 ms-4 relative w-80">
              <div
                className="w-full h-auto mx-auto md:ml-0"
                style={{
                  position: "relative",
                  boxShadow: "0 0 60px rgba(0, 0, 0, 0.9)",
                  opacity: 0.9,
                }}
              >
                <img
                  src={anime.coverImage}
                  alt={anime.title}
                  className="w-full h-full"
                  style={{
                    position: "relative",
                  }}
                />
              </div>
            </div>
            <div className="flex flex-col md:col-span-3e py-1 p-3">
              <h1 className="text-3xl text-white font-bold mb-2">
                {anime.title}
              </h1>
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
                <strong>Gêneros:</strong> {anime.genres.join(", ")}
              </p>
            </div>
          </div>
        </div>
        <div className="my-5">
          <h3 className="text-2xl text-white font-bold mb-4 text-center">
            Sinopse
          </h3>
          <div className="border border-white rounded-none p-2">
            <p className="text-white text-1xl text-justify">{anime.synopsis}</p>
          </div>
        </div>
        <div>
          <h3 className="text-2xl text-center text-white font-bold mb-4">
            Episódios
          </h3>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-4 gap-3">
              {anime.episodes.map((episode) => (
                <div key={episode.id} className="aspect-ratio-box w-full">
                  <Link
                    to={`/animes/${anime.slug}/${episode.titleSlug}/${episode.languageEpisode}`}
                  >
                    <div className="relative">
                      <img
                        src={episode.thumbnail}
                        alt={episode.titleEpisodio}
                        className="w-full h-full object-cover"
                      />
                      <div className="overlay">
                        <button className="play-button">
                          <MdPlayCircleFilled className="text-white text-5xl" />
                        </button>
                      </div>
                    </div>
                  </Link>
                  <p className="text-white text-lg text-center ms-3 font-">
                    {episode.titleEpisodio}
                  </p>
                </div>
              ))}
            </div>    
        </div>
      </main>
    </div>
  );
}
