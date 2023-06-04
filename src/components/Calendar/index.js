import React from 'react'

export default function Calendar({ animesByDate }) {
    const MAX_TITLE_LENGTH = 20; // Define o número máximo de caracteres do título

    const truncateTitle = (title) => {
        if (title.length > MAX_TITLE_LENGTH) {
            return title.substring(0, MAX_TITLE_LENGTH) + '...';
        }
        return title;
    };


  return (
    <div className="bg-black-light">
    {Object.entries(animesByDate).map(([date, animes]) => (
      <div key={date} className="mb-8">
        <h2 className="text-2xl font-bold text-emerald-400 ms-5 flex justify-start">{date}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-x-[-1px] gap-y-4">
          {animes.map((anime, index) => (
             <div className="aspect-ratio-box" >
                   <div className="relative">
            <div className="bg-black-light p-4 rounded-lg shadow-md flex flex-col items-center" key={index}>
              <img className="w-full h-full custom-height- object-cover" src={anime.coverImage} alt={anime.title} />
              <h3 className="text-center text-white font-bold mt-2">{truncateTitle(anime.title)}</h3>
            </div>
            </div>
            </div>
          ))}
        </div>
      </div>
    ))}
  </div>
  )
}
