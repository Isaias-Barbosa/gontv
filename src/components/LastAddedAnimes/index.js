import { Link } from 'react-router-dom'
import lastAddedAnimeData from 'json/lista.json'

export default function LastAddedAnimes({animelist}) {

  return (
  <>
    <h2 className="text-2xl text-white text-center font-bold mb-12">
    <span className="border-b-4 border-emerald-600 pb-1"> Últimos Animes Adicionados</span>
      </h2>
    <div class="container mx-auto">
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
      {lastAddedAnimeData.map((anime) => (
        <Link to={`/animes/${anime.id}`}>
          <div key={anime.id} className="flex flex-col items-center">
          <img src={anime.image} alt={anime.title} className="w-220 h-auto rounded-lg" />
          <h3 className="text-lg text-white font-semibold">{anime.title}</h3>
        </div>
        </Link>
      ))}
    </div>
    </div>
    </>
  )
}
