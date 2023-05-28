import React from 'react'

export default function PopularAnime() {

    const popularAnimeList = [
        {
            id: 1,
            title: 'Oshi no Ko',
            image: 'https://myanimelist.net/images/anime/1812/134736l.jpg',
          },
          {
            id: 2,
            title: 'Steins;Gate',
            image: 'https://myanimelist.net/images/anime/1935/127974l.jpg',
          },
          {
              id: 3,
              title: 'Shingeki no Kyojin',
              image: 'https://cdn.myanimelist.net/images/anime/1517/100633l.jpg',
          },
          {
              id: 4,
              title: 'Angel Beats',
              image: 'https://myanimelist.net/images/anime/1244/111115l.jpg',
          },
          {
              id: 5,
              title: 'Hunter x Hunter (2011)',
              image: 'https://cdn.myanimelist.net/images/anime/1735/117788l.jpg',
            },
      ];

    return (
        <section>
            <h2 className="text-2xl text-center text-white font-bold mb-1 p-6">
            <span className="border-b-4 border-emerald-600 pb-1">Animes Populares</span>
                </h2>
            <div className="flex justify-center">        
             <a href=''><div className="flex flex-wrap justify-center max-w-full lg:max-w-none">
                    {popularAnimeList.map((anime, index) => (
                        <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 rounded-lg p-3" key={index}>
                            <img 
                            src={anime.image} 
                            alt={anime.title} 
                            className="w-full h-auto mb-4 mx-auto" 
                            style={{width: "270px"}} />
                            <h3 className="text-xl text-center text-white font-bold">{anime.title}</h3>
                            <p className="text-xl text-gray-500 text-center font-bold">{anime.episode}</p>
                        </div>
                    ))}
                </div></a>
            </div>
        </section>
    )
}
