import animes from 'json/animes.json'
import { Link } from 'react-router-dom'
import { MdPlayCircleFilled } from 'react-icons/md';

export default function Filmes() {

  const MAX_TITLE_LENGTH = 20; // Define o número máximo de caracteres do título

  const truncateTitle = (title) => {
    if (title.length > MAX_TITLE_LENGTH) {
      return title.substring(0, MAX_TITLE_LENGTH) + '...';
    }
    return title;
  };

  // Filtra os animes dublados
  const filmes = animes.filter((anime) => anime.Type === 'Filme');

  return (
    <div className="bg-black-light py-8">
      <div className="container mx-auto px-7 max-w-7xl mb-6 xl:px-1 2xl:px-1">
        <h2 className="text-2xl text-white text-start font-bold mb-4 pb-1 py-7">
          <span className="border-b-4 border-emerald-600 pb-1"> Filmes</span>
        </h2>
        <div class="container mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3">
            {filmes.map((anime) => (
              <div className="aspect-ratio-box" >
                <div className="relative">
                  <Link to={`/animes/${anime.slug}`} key={anime.id}>
                    <div className="anime-cover">
                      <img
                        src={anime.coverImage}
                        alt={anime.title}
                        className="h-auto w-full custom-height-animes rounded-none object-cover"

                      />
                      <div className="overlay"></div>
                      <button className="play-button">
                        <MdPlayCircleFilled className="text-white text-5xl" />
                      </button>
                    </div>
                  </Link>
                  <h3 className="text-lg text-white text-center mb-3 px-2 font-semibold">{truncateTitle(anime.title)}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
