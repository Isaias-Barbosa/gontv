import Banner from "components/Banner";
import LastAddedAnimes from "components/LastAddedAnimes";
import PopularAnime from "components/PopularAnime";
import React, { useState } from 'react';
import { MdPlayCircleFilled } from 'react-icons/md';
import animes from 'json/lista.json';

export default function Home() {

  const [hoveredIndex, setHoveredIndex] = useState(null);

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
      <section>
        <PopularAnime />
      </section>

          <section>
            <h2 className="text-2xl text-center text-white font-bold mb-5">
              <span className="border-b-4 border-emerald-600 pb-1"> Animes em Lançamento</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {animeList.map((anime, index) => (
                <a href=""><div
                  className="rounded-lg p-3"
                  key={index}
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
                    <img src={anime.image} alt={anime.title} className="w-full h-full object-cover mb-4" />
                  </div>
                  <h3 className="text-lg text-center text-white font-bold">{anime.title}</h3>
                  <p className="text-base text-gray-500 text-center font-bold">{anime.episode}</p>
                </div></a>
              ))}
            </div>
          </section>
          <section>
            <LastAddedAnimes animes={animes} />
          </section>
        </main>
      </div>
    </>


  )
}
