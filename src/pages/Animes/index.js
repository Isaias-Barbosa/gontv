import animes from 'json/animes.json'
import { Link } from 'react-router-dom'

export default function Animes() {

    const MAX_TITLE_LENGTH = 20; // Define o número máximo de caracteres do título

    const truncateTitle = (title) => {
      if (title.length > MAX_TITLE_LENGTH) {
        return title.substring(0, MAX_TITLE_LENGTH) + '...';
      }
      return title;
    };


    return (
        <div className="bg-gray-900">
            <h2 className="text-2xl text-white text-center font-bold mb-4 py-7">
                <span className="border-b-4 border-emerald-600 pb-1"> Animes Legendados</span>
            </h2>
            <div class="container mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-1" style={{ gridGap: '1rem' }}>
                    {animes.map((anime) => (
                        <Link to={`/animes/${anime.id}`} key={anime.id}>
                            <div className="flex flex-col items-center">
                            <img
                src={anime.coverImage}
                alt={anime.title}
                className="h-80 mb-3 rounded-lg"
              />
                                <h3 className="text-lg text-white mb-3 font-semibold">{truncateTitle(anime.title)}</h3>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    )
}
