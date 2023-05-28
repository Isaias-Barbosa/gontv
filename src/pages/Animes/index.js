import animes from 'json/lista.json'
import { Link } from 'react-router-dom'

export default function Animes() {
    return (
        <div className="bg-gray-900">
            <h2 className="text-2xl text-white text-center font-bold mb-11">
                <span className="border-b-4 border-emerald-600 pb-1"> Animes Legendados</span>
            </h2>
            <div class="container mx-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                    {animes.map((anime) => (
                        <Link to={`/animes/${anime.id}`} key={anime.id}>
                            <div className="flex flex-col items-center">
                                <img src={anime.image} alt={anime.title} className="w-220 h-auto rounded-lg" />
                                <h3 className="text-lg text-white font-semibold">{anime.title}</h3>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    )
}
