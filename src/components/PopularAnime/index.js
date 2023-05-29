import React from 'react'
import { Link } from 'react-router-dom';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

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
        {
            id: 6,
            title: 'Hunter x Hunter (2011)',
            image: 'https://cdn.myanimelist.net/images/anime/1735/117788l.jpg',
        },
        {
            id: 7,
            title: 'Hunter x Hunter (2011)',
            image: 'https://cdn.myanimelist.net/images/anime/1735/117788l.jpg',
        },
        {
            id: 8,
            title: 'Hunter x Hunter (2011)',
            image: 'https://cdn.myanimelist.net/images/anime/1735/117788l.jpg',
        },
    ];

    popularAnimeList.sort((a, b) => a.id - b.id);

    const settings = {
        dots: true,
        infinite: false,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 4,
        centerMode: false,
        centerPadding: '60px',
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 4,
                    slidesToScroll: 4,
                },
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2,
                },
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                },
            },
        ],
        
    };

    return (
        <section>
            <h2 className="text-2xl text-center text-white font-bold mb-1 p-6">
                <span className="border-b-4 border-emerald-600 pb-1">Animes Populares</span>
            </h2>
            <div className="mx-auto max-w-7xl">
                <Slider {...settings}>
                    {popularAnimeList.map((anime) => (
                        <Link to={`/animes/${anime.id}`} key={anime.id}>
                            <div className="flex flex-col items-center mx-2">
                            <div className="mb-4">
                                    <img src={anime.image} alt={anime.title} className="w-220 h-auto rounded-lg" />
                                </div>
                                <h3 className="text-lg text-white font-semibold">{anime.title}</h3>
                            </div>
                        </Link>
                    ))}
                </Slider>
            </div>
        </section>
    )
}
