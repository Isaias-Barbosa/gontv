import React from 'react'

export default function LastAddedAnimes() {

    const lastAddedAnimeData = [
        {
          id: 1,
          title: 'Oshi No Ko',
          image: 'https://myanimelist.net/images/anime/1812/134736.jpg',
        },
        {
          id: 2,
          title: 'Steins Gate',
          image: 'https://myanimelist.net/images/anime/1935/127974.jpg',
        },
        {
            id: 3,
            title: 'Anime 3',
            image: 'https://myanimelist.net/images/anime/1109/130452.jpg',
        },
        {
            id: 4,
            title: 'Angel Beats',
            image: 'https://myanimelist.net/images/anime/1244/111115.jpg',
        },
        {
            id: 5,
            title: 'Anime 5',
            image: 'https://myanimelist.net/images/anime/1284/108937.jpg',
          },
          {
            id: 6,
            title: 'Rokudou no Onna-tachi',
            image: 'https://myanimelist.net/images/anime/1933/134709.jpg',
          },
          {
              id: 7,
              title: 'Another',
              image: 'https://cdn.myanimelist.net/images/anime/4/75509.jpg',
          },
          {
              id: 8,
              title: 'Hells Paradise',
              image: 'https://myanimelist.net/images/anime/1075/131925.jpg',
          },
          {
            id: 9,
            title: 'Watashi no Yuri wa Oshigoto desu!',
            image: 'https://myanimelist.net/images/anime/1708/133360.jpg',
          },
          {
            id: 10,
            title: 'Anime 10',
            image: 'https://myanimelist.net/images/anime/1078/131921.jpg',
          },
          {
              id:11,
              title: 'Anime 11',
              image: 'https://myanimelist.net/images/anime/1132/134608.jpg',
          },
          {
              id: 12,
              title: 'Gintama',
              image: 'https://myanimelist.net/images/anime/1245/116760.jpg',
          },
        
        // Adicione mais objetos de dados para cada anime
      ];
  return (

    
    <section>
    <h2 className="text-2xl text-white text-center font-bold mb-12">
    <span className="border-b-4 border-emerald-600 pb-1"> Últimos Animes Adicionados</span>
      </h2>
    <div class="container mx-auto">
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
      {lastAddedAnimeData.map((anime) => (
        <a href='#'><div key={anime.id} className="flex flex-col items-center">
          <img src={anime.image} alt={anime.title} className="w-220 h-auto rounded-lg" />
          <h3 className="text-lg text-white font-semibold">{anime.title}</h3>
        </div></a>
      ))}
    </div>
    </div>
  </section>
  )
}
