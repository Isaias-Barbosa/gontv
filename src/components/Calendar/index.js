import { MdPlayCircleFilled } from 'react-icons/md';
import { Link } from 'react-router-dom'

export default function Calendar({ animesByDate }) {
  const MAX_TITLE_LENGTH = 20; // Define o número máximo de caracteres do título

  const truncateTitle = (title) => {
    if (title.length > MAX_TITLE_LENGTH) {
      return title.substring(0, MAX_TITLE_LENGTH) + '...';
    }
    return title;
  };


  return (
    <div className="bg-black-light py-4">
      <div className="container mx-auto px-7 max-w-7xl mb-6 xl:px-1 2xl:px-1">
        <h2 className="text-white text-center text-2xl mb-4">
          <span className="border-b-2 border-emerald-400">Calendário</span>
        </h2>
        {Object.entries(animesByDate).map(([date, animes]) => (
          <div key={date} className="mb-4">
            <h2 className="text-2xl font-bold text-white ms-1 flex justify-start mb-3">
              <span className="border-b-2 border-emerald-400">{date}</span>
              </h2>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-x-[-1px] gap-y-4">
              {animes.map((anime, index) => (
                <div className="aspect-ratio-box" >
                  <div key={index} className="relative">
                  <Link to={`/animes/${anime.slug}`}>
                    <div className="anime-cover">
                      <img
                        className="w-full h-auto px-1 object-cover custom-height-animes mb-1"
                        src={anime.coverImage} alt={anime.title} />
                      <div className="overlay"></div>
                      <button className="play-button">
                        <MdPlayCircleFilled className="text-white text-4xl" />
                      </button>
                    </div>
                    </Link>
                  </div>
                  <h3 className="text-center text-white font-bold mt-2">{truncateTitle(anime.title)}</h3>
                </div>

              ))}
            </div>
          </div>
        ))
        }
      </div >
    </div >
  )
}
