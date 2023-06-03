import React from 'react'
import { Link, useLocation } from 'react-router-dom';
import animes from 'json/animes.json';
import { MdPlayCircleFilled } from 'react-icons/md';



export default function SearchAnime() {

    const MAX_TITLE_LENGTH = 20; // Define o número máximo de caracteres do título

    const truncateTitle = (title) => {
        if (title.length > MAX_TITLE_LENGTH) {
            return title.substring(0, MAX_TITLE_LENGTH) + '...';
        }
        return title;
    };

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const searchQuery = queryParams.get('query') || '';

    // Filtra os animes com base na consulta de pesquisa
    const filteredAnimes = animes.filter((anime) =>
        anime.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    return (
        <div className='bg-black-light py-4'>
      <div className="container mx-auto px-7 max-w-7xl mb-6 xl:px-1 2xl:px-1">
        <h1 className='text-lg text-white text-center py-8'>Resultados da pesquisa para: 
        <span className="text-emerald-400 mx-3">"{searchQuery}"</span></h1>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3">
          {filteredAnimes.map((anime) => (
            <div className="aspect-ratio-box" key={anime.id}>
              <div className="relative">
                <Link to={`/animes/${anime.slug}`}>
                  <div className="anime-cover">
                    <img src={anime.coverImage} alt={anime.title} className="h-auto w-full custom-height-animes rounded-none object-cover" />
                    <div className="overlay"></div>
                    <button className="play-button">
                      <MdPlayCircleFilled className="text-white text-5xl" />
                    </button>
                  </div>
                </Link>
                <h2 className="text-lg text-white font-semibold mt-2">{truncateTitle(anime.title)}</h2>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
    )
}
