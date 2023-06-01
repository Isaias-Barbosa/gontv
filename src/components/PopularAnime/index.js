import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import animeDetails from 'json/animes.json';

import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';


export default function PopularAnime() {

    const MAX_TITLE_LENGTH = 25; // Define o número máximo de caracteres do título

    const truncateTitle = (title) => {
        if (title.length > MAX_TITLE_LENGTH) {
            return title.substring(0, MAX_TITLE_LENGTH) + '...';
        }
        return title;
    };

    const [popularAnimeList, setPopularAnimeList] = useState([]);

    useEffect(() => {
        // Filtrar a lista de animes populares com a propriedade "top" igual a true
        const filteredList = animeDetails.filter((anime) => anime.top === true).slice(0, 10);
        setPopularAnimeList(filteredList);
    }, []);


    const settings = {
        dots: true,
        infinite: false,
        speed: 500,
        slidesToShow: 6,
        slidesToScroll: 6,
        centerMode: false,
        centerPadding: '15px',
        responsive: [
            {
                breakpoint: 1366,
                settings: {
                    slidesToShow: 5,
                    slidesToScroll: 5,
                    infinite: true, // Definir como true nas telas menores
                },
            },
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 4,
                    slidesToScroll: 4,
                    infinite: true, // Definir como true nas telas menores

                },
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 3,
                    infinite: true, // Definir como true nas telas menores
                },
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2,
                    infinite: true, // Definir como true nas telas menores
                },
            },
        ],

    };



    return (
        <section>
            <h2 className="text-2xl text-center text-white font-bold mb-4 p-6">
                <span className="border-b-4 border-emerald-600 pb-1">Animes Populares</span>
            </h2>
            <div className="container mx-auto px-7 max-w-7xl mb-6 xl:px-1 2xl:px-1">
                <Slider {...settings}>
                    {popularAnimeList.map((anime) => (
                        <div key={anime.id} className="aspect-ratio-box">
                        <Link to={`/animes/${anime.slug}`}>
                        <div className="anime-cover">
                        <img
                            src={anime.coverImage}
                            alt={anime.title}
                            className="w-full h-full px-1 object-cover mb-3"
                            style={{ maxWidth: '260px', maxHeight: '325px', minHeight: '200px'}}
                        />
                        </div>
                        </Link>
                        <h3 className="text-lg text-center text-white font-semibold">{truncateTitle(anime.title)}</h3>
                    </div>
                    ))}
                </Slider>
            </div>
        </section>
    )
}

