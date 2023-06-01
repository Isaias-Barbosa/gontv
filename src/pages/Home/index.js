import Banner from "components/Banner";
import PopularAnime from "components/PopularAnime";
import React, { useState } from 'react';
import { MdPlayCircleFilled } from 'react-icons/md';
import animesG from 'json/lista.json';
import LastAddedAnimes from "components/LastAddedAnimes";
import LastAddedAnimesDublado from 'components/LastAddedAnimesDublado';
import animes from 'json/animes.json';

export default function Home() {

  const MAX_TITLE_LENGTH = 20; // Define o número máximo de caracteres do título

    const truncateTitle = (title) => {
        if (title.length > MAX_TITLE_LENGTH) {
            return title.substring(0, MAX_TITLE_LENGTH) + '...';
        }
        return title;
    };

  const [hoveredIndex, setHoveredIndex] = useState(null);

  const legendadoAnimes = animesG.filter((animeG) => animeG.language === 'Legendado');

  const animeList = [
    { title: 'Boku no Hero', episode: 'Episódio 10', resolution: 'FHD', image: 'https://i0.wp.com/img1.ak.crunchyroll.com/i/spire3-tmb/33c2d010cf4238ce66cc01f9335055cd1499180836_full.jpg' },
    { title: 'Isekai Shoukan wa Nidome desu', episode: 'Episódio 15', resolution: 'FHD', image: 'https://i.pinimg.com/originals/30/f8/85/30f885fa822e31d2c57015739beaeb12.png' },
    { title: 'Otonari ni Ginga', episode: 'Episódio 3', resolution: 'FHD', image: 'https://www.themoviedb.org/t/p/original/sqEwNXhe06Kbq9iQH77J5E8Uqvq.jpg' },
    { title: 'Yamada-kun to Lv999 no Koi wo Suru', episode: 'Episódio 4', resolution: 'FHD', image: 'https://img1.ak.crunchyroll.com/i/spire1/9cd1a6410f3e1e09dc1d22fd39036d591684755429_main.jpg' },
    { title: 'Edens Zero 2', episode: 'Episódio 10 ', resolution: 'FHD', image: 'https://i0.wp.com/img1.ak.crunchyroll.com/i/spire3-tmb/33c2d010cf4238ce66cc01f9335055cd1499180836_full.jpg' },
    { title: 'Megami no Café Terrace', episode: 'Episódio 15', resolution: 'FHD', image: 'https://i.pinimg.com/originals/30/f8/85/30f885fa822e31d2c57015739beaeb12.png' },
    { title: 'Mahou Shoujo Magical Destroyers', episode: 'Episódio 3', resolution: 'FHD', image: 'https://www.themoviedb.org/t/p/original/sqEwNXhe06Kbq9iQH77J5E8Uqvq.jpg' },
    { title: 'Tengoku Daimakyou', episode: 'Episódio 4', resolution: 'FHD', image: 'https://img1.ak.crunchyroll.com/i/spire1/9cd1a6410f3e1e09dc1d22fd39036d591684755429_main.jpg' },
    { title: 'Rokudou no Onna-tachi', episode: 'Episódio 10', resolution: 'FHD', image: 'https://i0.wp.com/img1.ak.crunchyroll.com/i/spire3-tmb/33c2d010cf4238ce66cc01f9335055cd1499180836_full.jpg' },
    { title: 'Tonikaku Kawaii 2', episode: 'Episódio 15', resolution: 'FHD', image: 'https://i.pinimg.com/originals/30/f8/85/30f885fa822e31d2c57015739beaeb12.png' },
    { title: 'Mashle', episode: 'Episódio 3', resolution: 'FHD', image: 'https://www.themoviedb.org/t/p/original/sqEwNXhe06Kbq9iQH77J5E8Uqvq.jpg' },
    { title: 'Isekai One Turn Kill Neesan', episode: 'Episódio 4', resolution: 'FHD', image: 'https://img1.ak.crunchyroll.com/i/spire1/9cd1a6410f3e1e09dc1d22fd39036d591684755429_main.jpg' },
    { title: 'Yuusha ga Shinda!', episode: 'Episódio 10', resolution: 'FHD', image: 'https://i0.wp.com/img1.ak.crunchyroll.com/i/spire3-tmb/33c2d010cf4238ce66cc01f9335055cd1499180836_full.jpg' },
    { title: 'Mahoutsukai no Yome 2', episode: 'Episódio 1', resolution: 'FHD', image: 'https://i.pinimg.com/originals/30/f8/85/30f885fa822e31d2c57015739beaeb12.png' },
    { title: 'Ousama Ranking: Yuuki no Takarabako', episode: 'Episódio 3', resolution: 'FHD', image: 'https://www.themoviedb.org/t/p/original/sqEwNXhe06Kbq9iQH77J5E8Uqvq.jpg' },
    { title: 'Dr. Stone: New World', episode: ' Episódio 4', resolution: 'FHD', image: 'https://img1.ak.crunchyroll.com/i/spire1/9cd1a6410f3e1e09dc1d22fd39036d591684755429_main.jpg' },
    // Adicione mais animes aqui...
  ];

  return (

    <>
      <Banner />
      <div className="bg-gray-900">
        <main className="container mx-auto py-8">
          <div className="section">
            <PopularAnime />
          </div>

          <div className="section">

            <div className="container mx-auto px-7 max-w-7xl mb-6 xl:px-1 2xl:px-1">
            <h2 className="text-2xl text-start text-white font-bold mb-5 p-1 ">
              <span className="border-b-4 border-emerald-600 pb-1"> Lançamentos</span>
            </h2>
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-4">
                {animeList.map((anime, index) => (
                  <a href="" key={index}>
                    <div
                      className="p-1"
                      style={{ maxWidth: '320px', height: '100%' }}
                      onMouseEnter={() => setHoveredIndex(index)}
                      onMouseLeave={() => setHoveredIndex(null)}
                    >
                      <div className="relative">
                        {hoveredIndex === index && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                            <MdPlayCircleFilled className="text-white text-5xl" />
                          </div>
                        )}
                        <div className="absolute bg-emerald-700 rounded-none m-2 p-1">
                          <p className="text-white text-xs font-bold">{anime.resolution}</p>
                        </div>
                        <img src={anime.image} alt={anime.title} className="w-full h-full object-cover" />
                      </div>
                      <h3 className="text-center text-white font-bold text-base sm:text-lg md:text-xl xl:text-lg 2xl:text-lg">{truncateTitle(anime.title)}</h3>
                      <p className="text-base text-gray-500 text-center font-bold sm:text-sm md:text-base xl:text-sm 2xl:text-md">{anime.episode}</p>
                    </div></a>
                ))}
              </div>
            </div>
          </div>
          <div className="section">
            <LastAddedAnimes animes={legendadoAnimes} />
          </div>
          <div className="section">
            <LastAddedAnimesDublado animes={animes} />
          </div>
        </main>
      </div>
    </>


  )
}
